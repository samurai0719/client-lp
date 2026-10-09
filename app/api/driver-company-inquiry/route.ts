import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import {
  validateDriverCompanyInquiry,
  HIRING_COUNT_LABELS,
  JOB_TYPE_LABELS,
  type DriverCompanyInquiryInput,
  type DriverCompanyInquiryRow,
} from "@/lib/types/driverCompanyInquiry";

/**
 * ドラテク 企業向けLP（/company）の求人情報 登録 受付API。
 *
 * 既存の /api/consultations と同じ作りにしている：
 *   ・ブラウザから Supabase へ直接書き込ませず、必ずこのサーバー側APIを経由する
 *   ・保存には service role キーを使う（このキーはサーバーにしか存在しない）
 *   ・DB保存に失敗しても通知メールが送れていれば受付成立とみなす
 *
 * DBにもメールにも届かなかった場合は必ず 500 を返す。
 * 「送信できていないのに完了画面を出す」ことは絶対にしない。
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ── 送信回数制限 ─────────────────────────────────────────────────────────
   インスタンス内メモリの簡易実装。サーバーレスでは実行環境ごとに独立するため
   完全な制限にはならないが、単一クライアントからの連打は十分に抑えられる。
   ───────────────────────────────────────────────────────────────────────── */
const WINDOW_MS = 10 * 60 * 1000; // 10分
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

/**
 * CSRF対策。ブラウザが必ず送る Origin を自分のホストと突き合わせる。
 * 一致しないクロスサイトからの送信は受け付けない。
 */
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

const GENERIC_ERROR =
  "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。";

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

    let body: DriverCompanyInquiryInput;
    try {
      body = (await req.json()) as DriverCompanyInquiryInput;
    } catch {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    // ハニーポット：人間には見えない項目。値が入っていればボット。
    // 攻撃者に検知を悟らせないため、成功したように見せて保存はしない。
    if (typeof body.websiteUrl === "string" && body.websiteUrl.trim() !== "") {
      return NextResponse.json({ success: true });
    }
    // 表示から2秒未満の送信も自動化とみなす
    if (typeof body.elapsedMs === "number" && body.elapsedMs >= 0 && body.elapsedMs < 2000) {
      return NextResponse.json({ success: true });
    }

    const result = validateDriverCompanyInquiry(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // Supabase 未設定でもメールが送れるなら受付は成立させる
    if (!isSupabaseAdminConfigured()) {
      console.error("[driver-company-inquiry] Supabase admin is not configured");
      const mailed = await notify(result.row, { dbFailed: true });
      return mailed
        ? NextResponse.json({ success: true })
        : NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    const db = createAdminClient();
    const { error } = await db.from("driver_company_inquiries").insert(result.row);

    if (error) {
      // 個人情報を含めずに、原因追跡に必要な情報だけ残す
      console.error(
        "[driver-company-inquiry] insert failed:",
        error.code,
        error.message
      );

      // DB保存に失敗しても、問い合わせ自体を失わないようにする。
      // 通知メールが送れたなら担当者には届いているため受付成立とみなす。
      const mailed = await notify(result.row, { dbFailed: true });
      return mailed
        ? NextResponse.json({ success: true })
        : NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    // 保存が完了しているため、通知が失敗しても受付は成立させる
    void notify(result.row);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(
      "[driver-company-inquiry] unexpected error:",
      err instanceof Error ? err.message : err
    );
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}

/* ── 通知メール ───────────────────────────────────────────────────────── */

function line(label: string, value: string | null | undefined): string {
  return `${label}：${value && value.length > 0 ? value : "未入力"}`;
}

/** 送信できたら true。RESEND_API_KEY 未設定・送信失敗はいずれも false */
async function notify(
  row: DriverCompanyInquiryRow,
  opts: { dbFailed?: boolean } = {}
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[driver-company-inquiry] RESEND_API_KEY is not set");
    return false;
  }

  try {
    const to =
      process.env.DORATECH_NOTIFICATION_EMAIL ??
      process.env.NOTIFICATION_EMAIL ??
      process.env.ADMIN_NOTIFICATION_EMAIL;
    if (!to) {
      console.error("[driver-company-inquiry] notification address is not set");
      return false;
    }
    const from =
      process.env.RESEND_FROM_EMAIL ??
      process.env.MAIL_FROM_ADDRESS ??
      "onboarding@resend.dev";

    const jobTypes = row.job_types.map((v) => JOB_TYPE_LABELS[v] ?? v).join("、");
    const now = new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const text = [
      "【ドラテク】企業向けLPから求人情報の登録が届きました。",
      opts.dbFailed
        ? "\n※ データベースへの保存に失敗しています。このメールの内容を控えてください。\n"
        : "",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "■ 企業情報",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      line("会社名", row.company_name),
      line("ご担当者名", row.contact_name),
      line("電話番号", row.phone),
      line("メールアドレス", row.email),
      line("所在地", row.prefecture),
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "■ 募集内容",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      line("募集職種", jobTypes),
      line("募集職種（その他）", row.job_type_other),
      line(
        "採用予定人数",
        row.hiring_count ? HIRING_COUNT_LABELS[row.hiring_count] ?? row.hiring_count : null
      ),
      line("保有車両・業務内容", row.fleet_description),
      "",
      line("その他・補足事項", row.message),
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "■ 流入情報",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      line("ランディングページ", row.landing_page),
      line("リファラー", row.referrer),
      line("utm_source", row.utm_source),
      line("utm_medium", row.utm_medium),
      line("utm_campaign", row.utm_campaign),
      "",
      `送信日時：${now}`,
    ].join("\n");

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `【ドラテク】求人情報の登録（${row.company_name}）`,
      text,
    });

    if (error) {
      console.error("[driver-company-inquiry] Resend error:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(
      "[driver-company-inquiry] notify failed:",
      err instanceof Error ? err.message : err
    );
    return false;
  }
}
