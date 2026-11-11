import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { adminAddress, sendMail } from "@/lib/driverCompany/send";
import {
  CONSULT_INQUIRY_TYPE,
  validateConsult,
  type ConsultInput,
  type ConsultValues,
} from "@/lib/types/driverCompanyConsult";

/**
 * ドラテク 企業向け「無料オンライン相談」の申込み受付API（/driver/consult から呼ばれる）。
 *
 * /api/driver-scout-apply と同じ作り：
 *   ・ブラウザから Supabase へ直接書き込ませず、このAPIが service role キーで保存する
 *   ・保存先は driver_company_inquiries（inquiry_type = 'consultation'）
 *   ・DB保存に失敗しても運営への通知メールが送れていれば受付成立とみなす
 * DBにもメールにも届かなかった場合は必ず 500 を返す（送れたように見せかけない）。
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
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

const GENERIC_ERROR = "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。";

function clip(v: unknown, max: number): string | null {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;
}

export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: GENERIC_ERROR }, { status: 403 });
    if (rateLimited(clientKey(req))) {
      return NextResponse.json(
        { error: "送信回数の上限に達しました。しばらく時間をおいてからお試しください。" },
        { status: 429 },
      );
    }

    let body: ConsultInput;
    try {
      body = (await req.json()) as ConsultInput;
    } catch {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    // ボット対策。検知を悟らせないため成功したように返すが、保存も通知もしない
    if (typeof body.websiteUrl === "string" && body.websiteUrl.trim() !== "") {
      return NextResponse.json({ success: true });
    }
    if (typeof body.elapsedMs === "number" && body.elapsedMs >= 0 && body.elapsedMs < 3000) {
      return NextResponse.json({ success: true });
    }

    const result = validateConsult(body);
    if (!result.ok) {
      return NextResponse.json({ error: "入力内容をご確認ください。", errors: result.errors }, { status: 400 });
    }
    const v = result.values;
    const utm = body.utm ?? {};
    const tracking = {
      referrer: clip(body.referrer, 500),
      landing_page: clip(body.landingPage, 500),
      utm_source: clip(utm.utm_source, 100),
      utm_medium: clip(utm.utm_medium, 100),
      utm_campaign: clip(utm.utm_campaign, 200),
      utm_content: clip(utm.utm_content, 200),
      utm_term: clip(utm.utm_term, 200),
    };

    const saved = await save(v, tracking);
    const mailed = await notify(v, tracking, !saved);

    if (!saved && !mailed) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[driver-company-consult] unexpected error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}

function summary(v: ConsultValues): string {
  return [
    "【無料オンライン相談の申込み】",
    `現在の採用状況：${v.hiringStatus}`,
    `採用したい人数：${v.hiringCount}`,
    `採用したい人材：${v.talentTypes.join("、")}`,
    `採用したい時期：${v.hiringTiming}`,
    `採用予定の勤務地：${v.prefecture}`,
    `気になる料金プラン：${v.plan}`,
  ].join("\n");
}

async function save(v: ConsultValues, tracking: Record<string, string | null>): Promise<boolean> {
  if (!isSupabaseAdminConfigured()) {
    console.error("[driver-company-consult] Supabase admin is not configured");
    return false;
  }
  const { error } = await createAdminClient().from("driver_company_inquiries").insert({
    company_name: v.companyName,
    contact_name: v.contactName,
    phone: v.phone,
    email: v.email,
    prefecture: v.prefecture,
    hiring_count: v.hiringCount,
    hiring_timing: v.hiringTiming,
    inquiry_type: CONSULT_INQUIRY_TYPE,
    message: summary(v),
    consented_at: new Date().toISOString(),
    status: "new",
    ...tracking,
  });
  if (error) {
    console.error("[driver-company-consult] insert failed:", error.code, error.message);
    return false;
  }
  return true;
}

/** 運営への通知。送れたら true（RESEND_API_KEY・通知先が未設定なら false） */
async function notify(v: ConsultValues, tracking: Record<string, string | null>, dbFailed: boolean): Promise<boolean> {
  const to = adminAddress();
  if (!to) {
    console.error("[driver-company-consult] notification address is not set");
    return false;
  }
  const text = [
    "【ドラテク】企業向けLPから無料オンライン相談の申込みが届きました。",
    dbFailed ? "\n※ データベースへの保存に失敗しています。このメールの内容を控えてください。\n" : "",
    `会社名：${v.companyName}`,
    `担当者名：${v.contactName}`,
    `電話番号：${v.phone}`,
    `メールアドレス：${v.email}`,
    "",
    summary(v),
    "",
    `流入元：${tracking.utm_source ?? tracking.referrer ?? "直接アクセス"}`,
    "",
    "次の対応：お客様へ連絡し、オンライン相談の日程を調整してください（申込み画面では「担当者から連絡して日程を決める」と案内しています）。",
  ].join("\n");
  return sendMail({ to, subject: `【無料オンライン相談】${v.companyName} 様（${v.hiringCount}・${v.hiringTiming}）`, text, replyTo: v.email });
}
