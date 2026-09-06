import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import {
  validateConsultation,
  type ConsultationInput,
  type ConsultationRow,
} from "@/lib/types/consultation";

/**
 * adofy 無料相談フォームの受付API。
 *
 * ブラウザから Supabase へ直接書き込ませず、必ずこのサーバー側APIを経由する。
 * 保存には service role キーを使う（このキーはサーバーにしか存在しない）。
 */

export const runtime = "nodejs";
// 受付処理は常に実行する（キャッシュさせない）
export const dynamic = "force-dynamic";

/* ── 送信回数制限 ─────────────────────────────────────────────────────────
   インスタンス内メモリの簡易実装。サーバーレスでは実行環境ごとに独立するため
   完全な制限にはならないが、単一クライアントからの連打は十分に抑えられる。
   より厳密に行う場合は Upstash 等の共有ストアに置き換える。
   ───────────────────────────────────────────────────────────────────────── */
const WINDOW_MS = 10 * 60 * 1000; // 10分
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // 古いキーを掃除してメモリの肥大を防ぐ
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
  if (!origin) return false;
  const host = req.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const GENERIC_ERROR = "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。";

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

    let body: ConsultationInput;
    try {
      body = (await req.json()) as ConsultationInput;
    } catch {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    // ハニーポット：人間には見えない項目。値が入っていればボット。
    // 攻撃者に検知を悟らせないため、成功したように見せて保存はしない。
    if (typeof body.companyWebsite === "string" && body.companyWebsite.trim() !== "") {
      return NextResponse.json({ success: true });
    }
    // 表示から2秒未満の送信も自動化とみなす
    if (typeof body.elapsedMs === "number" && body.elapsedMs >= 0 && body.elapsedMs < 2000) {
      return NextResponse.json({ success: true });
    }

    const result = validateConsultation(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    if (!isSupabaseAdminConfigured()) {
      console.error("[consultations] Supabase admin is not configured");
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    const db = createAdminClient();
    const { data, error } = await db
      .from("consultations")
      .insert(result.row)
      .select("id")
      .single();

    if (error) {
      // 個人情報を含めずに、原因追跡に必要な情報だけ残す
      console.error("[consultations] insert failed:", error.code, error.message);

      /*
        DB保存に失敗しても、問い合わせ自体を失わないようにする。
        通知メールが送れたなら担当者には届いているため受付成立とみなす。
        （メールも送れなかった場合のみエラーを返し、利用者に再送を促す）
      */
      const mailed = await notify(result.row, undefined, { dbFailed: true });
      if (mailed) {
        void pushNotify(result.row);
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }

    // 通知は失敗しても受付は成立させる（保存が完了しているため）
    void notify(result.row, data?.id as string | undefined);
    void pushNotify(result.row);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[consultations] unexpected error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}

/* ── プッシュ通知 ─────────────────────────────────────────────────────────
   既存CRMの新規問い合わせ通知と同じ仕組み（/api/push/send）を使う。
   管理画面をホーム画面に追加している端末へ即時に届く。
   ───────────────────────────────────────────────────────────────────────── */
async function pushNotify(row: ConsultationRow): Promise<void> {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const plan = row.selected_plan ? LABEL.plan[row.selected_plan] ?? "" : "";
  const body = [
    `${row.prefecture}の${row.company_name}様`,
    plan ? `／${plan}` : "",
    "から無料相談が届きました。",
  ].join("");

  await fetch(`${base}/api/push/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-cron-secret": process.env.CRON_SECRET ?? "",
    },
    body: JSON.stringify({
      title: "adofy 新しい無料相談",
      body,
      url: "/admin/consultations",
    }),
  }).catch(() => {
    // 通知が届かなくても受付は成立している
  });
}

/* ── 通知メール ───────────────────────────────────────────────────────── */

const LABEL = {
  business_type: {
    corporation: "法人", sole: "個人事業主", planned: "開業予定", other: "その他",
  } as Record<string, string>,
  plan: {
    standard: "20万円｜集客ホームページ制作",
    consult: "相談して決めたい",
    // 以下は3プラン時代の値（既存データの表示用）
    start: "30万円｜スタートプラン",
    growth: "50万円｜集客強化プラン",
    max: "70万円｜MAXプラン",
  } as Record<string, string>,
  timing: {
    asap: "できるだけ早く", "1month": "1ヶ月以内", "3months": "3ヶ月以内",
    "6months": "半年以内", undecided: "まだ決まっていない",
  } as Record<string, string>,
  method: { phone: "電話", email: "メール", any: "どちらでもよい" } as Record<string, string>,
  time: {
    "9-12": "9時〜12時", "12-15": "12時〜15時", "15-18": "15時〜18時",
    "18-": "18時以降", any: "いつでもよい",
  } as Record<string, string>,
};

function line(label: string, value: string | null | undefined): string {
  return `${label}：${value && value.length > 0 ? value : "未入力"}`;
}

async function notify(
  row: ConsultationRow,
  id?: string,
  opts: { dbFailed?: boolean } = {}
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const to = process.env.ADOFY_NOTIFICATION_EMAIL
      ?? process.env.NOTIFICATION_EMAIL
      ?? "samurai0719@outlook.jp";
    const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
    const resend = new Resend(apiKey);

    const text = [
      "【adofy】無料相談の申し込みが届きました。",
      "",
      line("事業形態", LABEL.business_type[row.business_type ?? ""]),
      line("会社名・屋号", row.company_name),
      line("ご担当者", `${row.contact_name}${row.position ? `（${row.position}）` : ""}`),
      line("所在地", `${row.prefecture}${row.city ?? ""}`),
      line("業種", [...row.industries, row.industry_other].filter(Boolean).join("、")),
      line("現在のHP", row.has_website === "yes" ? `あり ${row.website_url ?? ""}` : row.has_website),
      line("相談内容", [...row.consultation_topics, row.consultation_other].filter(Boolean).join("、")),
      line("お悩み", [...row.current_problems, row.problem_other].filter(Boolean).join("、")),
      line("希望プラン", LABEL.plan[row.selected_plan ?? ""]),
      line("希望時期", LABEL.timing[row.desired_timing ?? ""]),
      "",
      line("電話番号", row.phone),
      line("メール", row.email),
      line("希望連絡方法", LABEL.method[row.preferred_contact_method ?? ""]),
      line("連絡しやすい時間", LABEL.time[row.preferred_contact_time ?? ""]),
      "",
      line("流入元", row.utm_source ? `${row.utm_source} / ${row.utm_medium ?? ""} / ${row.utm_campaign ?? ""}` : row.referrer),
      id ? `管理ID：${id}` : "",
    ].filter(Boolean).join("\n");

    const { error: sendError } = await resend.emails.send({
      from,
      to,
      // DB保存に失敗した回は件名で気づけるようにする（手動でDBへ登録するため）
      subject: opts.dbFailed
        ? `【adofy・要手動登録】${row.company_name} 様より無料相談のお申し込み`
        : `【adofy】${row.company_name} 様より無料相談のお申し込み`,
      text: opts.dbFailed
        ? `※このお申し込みはデータベースに保存できませんでした。管理画面には表示されないため、内容を控えてください。\n\n${text}`
        : text,
    });
    if (sendError) {
      console.error("[consultations] notify email failed:", sendError.name);
      return false;
    }

    // 申込者への受付確認メール（メールアドレスの入力がある場合のみ）
    if (row.email) {
      await resend.emails.send({
        from,
        to: row.email,
        subject: "【adofy】無料相談を受け付けました",
        text: [
          `${row.contact_name} 様`,
          "",
          "この度は adofy へお問い合わせいただきありがとうございます。",
          "以下の内容で無料相談のお申し込みを受け付けました。",
          "内容を確認のうえ、ご希望の連絡方法にてご連絡いたします。",
          "",
          line("会社名・屋号", row.company_name),
          line("ご担当者", row.contact_name),
          line("希望連絡方法", LABEL.method[row.preferred_contact_method ?? ""]),
          line("連絡しやすい時間", LABEL.time[row.preferred_contact_time ?? ""]),
          "",
          "※このメールは送信専用です。",
          "adofy｜建設業専門の集客ホームページ制作",
        ].join("\n"),
      }).catch(() => {
        // 申込者への返信失敗は受付の成否に影響させない
      });
    }
    return true;
  } catch (err) {
    console.error("[consultations] notify failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
