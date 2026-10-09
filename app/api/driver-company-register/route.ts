import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminAddress, sendMail } from "@/lib/driverCompany/send";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { SERVICE } from "@/config/driver-company";
import {
  adminBody,
  adminSubject,
  verificationBody,
  verificationSubject,
} from "@/lib/driverCompany/mail";
import {
  toCompanyRow,
  toJobRow,
  validateRegistration,
  type RegistrationInput,
} from "@/lib/types/driverJobRegistration";

/**
 * ドラテク 企業登録・求人登録（/company/register）の受付API。
 *
 * 流れ：
 *   1. 入力を検証する（信用できるのはこのサーバー側の検証だけ）
 *   2. 企業と求人を保存する。求人の初期状態は pending_verification
 *   3. 登録メールアドレスへ認証メールを送る
 *   4. 認証URLが開かれるまで求人は公開・配信しない（/company/verify が担当）
 *
 * 保存もメール送信もできなかった場合は必ずエラーを返す。
 * 「登録できていないのに完了画面を出す」ことは絶対にしない。
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 認証URLの有効期限 */
const VERIFICATION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7日

/* ── 送信回数制限 ─────────────────────────────────────────────────────
   インスタンス内メモリの簡易実装。サーバーレスでは実行環境ごとに独立するため
   完全な制限にはならないが、単一クライアントからの連打は十分に抑えられる。 */
const WINDOW_MS = 30 * 60 * 1000; // 30分
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  return fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

/** CSRF対策。ブラウザが必ず送る Origin を自分のホストと突き合わせる */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** 認証URLなどに使う、このリクエストのオリジン */
function siteOrigin(req: Request): string {
  const host = req.headers.get("host");
  if (!host) return SERVICE.siteUrl;
  const proto = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  return `${proto}://${host}`;
}

const GENERIC_ERROR = "登録に失敗しました。お手数ですが、時間をおいて再度お試しください。";

export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 403 });
    }
    if (rateLimited(clientKey(req))) {
      return NextResponse.json(
        { error: "送信回数の上限に達しました。しばらく時間をおいてからお試しください。" },
        { status: 429 }
      );
    }

    let body: RegistrationInput;
    try {
      body = (await req.json()) as RegistrationInput;
    } catch {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    // ハニーポット：人間には見えない項目。値が入っていればボット。
    // 攻撃者に検知を悟らせないため、成功したように見せて保存はしない。
    if (typeof body.faxNumber === "string" && body.faxNumber.trim() !== "") {
      return NextResponse.json({ success: true });
    }
    const elapsed = body.elapsedMs;
    if (typeof elapsed === "number" && elapsed >= 0 && elapsed < 5000) {
      return NextResponse.json({ success: true });
    }

    const result = validateRegistration(body);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.message, errors: result.errors },
        { status: 400 }
      );
    }

    const { values, consents } = result;
    const email = values.notificationEmail as string;
    const companyName = values.companyName as string;
    const jobTitle = values.jobTitle as string;

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MS);
    const verifyUrl = `${siteOrigin(req)}/driver/company/verify?token=${token}`;

    const utm = (body.utm ?? {}) as Record<string, string | undefined>;
    const tracking = {
      referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null,
      landing_page: typeof body.landingPage === "string" ? body.landingPage.slice(0, 500) : null,
      utm_source: utm.utm_source?.slice(0, 100) ?? null,
      utm_medium: utm.utm_medium?.slice(0, 100) ?? null,
      utm_campaign: utm.utm_campaign?.slice(0, 200) ?? null,
      utm_content: utm.utm_content?.slice(0, 200) ?? null,
      utm_term: utm.utm_term?.slice(0, 200) ?? null,
    };

    let saved = false;

    if (!isSupabaseAdminConfigured()) {
      console.error("[driver-company-register] Supabase admin is not configured");
    } else {
      const db = createAdminClient();

      // 同じメールアドレスの企業が既にいれば、その企業に求人を追加する。
      // 重複したアカウントを作らないため。
      const { data: existing } = await db
        .from("driver_companies")
        .select("id")
        .ilike("notification_email", email)
        .maybeSingle();

      let companyId = existing?.id as string | undefined;

      const companyRow = {
        ...toCompanyRow(values),
        verification_token: token,
        verification_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (companyId) {
        const { error } = await db
          .from("driver_companies")
          .update(companyRow)
          .eq("id", companyId);
        if (error) {
          console.error("[driver-company-register] company update failed:", error.code, error.message);
          companyId = undefined;
        }
      } else {
        const { data, error } = await db
          .from("driver_companies")
          .insert(companyRow)
          .select("id")
          .single();
        if (error) {
          // 個人情報を含めずに、原因追跡に必要な情報だけ残す
          console.error("[driver-company-register] company insert failed:", error.code, error.message);
        } else {
          companyId = data?.id as string;
        }
      }

      if (companyId) {
        const { error } = await db.from("driver_job_postings").insert({
          ...toJobRow(values),
          company_id: companyId,
          consents,
          consented_at: new Date().toISOString(),
          status: "pending_verification",
          ...tracking,
        });
        if (error) {
          console.error("[driver-company-register] job insert failed:", error.code, error.message);
        } else {
          saved = true;
        }
      }
    }

    // 企業への認証メール。これが送れないと求人を公開できないため、成否を受付判定に使う
    const verified = await sendMail({
      to: email,
      subject: verificationSubject(),
      text: verificationBody({ companyName, jobTitle, verifyUrl, expiresAt }),
      replyTo: adminAddress(),
    });

    // 運営への通知。失敗しても受付は成立させる
    void notifyAdmin(values, tracking, saved);

    if (!saved && !verified) {
      // 保存もメールも届いていない。登録できたように見せない。
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      emailSent: verified,
      email,
    });
  } catch (err) {
    console.error(
      "[driver-company-register] unexpected error:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}

async function notifyAdmin(
  values: Record<string, unknown>,
  tracking: Record<string, string | null>,
  saved: boolean
): Promise<void> {
  const to = adminAddress();
  if (!to) {
    console.error("[driver-company-register] admin notification address is not set");
    return;
  }
  await sendMail({
    to,
    subject: adminSubject(values.companyName as string),
    text: adminBody({ values, verified: false, utm: tracking, dbFailed: !saved }),
  });
}
