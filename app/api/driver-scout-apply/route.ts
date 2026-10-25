import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { adminAddress, sendMail } from "@/lib/driverCompany/send";
import {
  SCOUT_INQUIRY_TYPE,
  validateScoutApply,
  type ScoutApplyInput,
  type ScoutApplyValues,
} from "@/lib/types/driverScoutApply";

/**
 * ドライバー採用サービス（候補者プロフィール検索）の利用申込み受付API。
 * /driver/scout のフォームから呼ばれる。
 *
 * 既存の /api/driver-company-inquiry と同じ作り：
 *   ・ブラウザから Supabase へ直接書き込ませず、このAPIが service role キーで保存する
 *   ・保存先は driver_company_inquiries（inquiry_type = 'profile_search'）
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

    let body: ScoutApplyInput;
    try {
      body = (await req.json()) as ScoutApplyInput;
    } catch {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    // ボット対策。検知を悟らせないため成功したように返すが、保存も通知もしない
    if (typeof body.websiteUrl === "string" && body.websiteUrl.trim() !== "") {
      return NextResponse.json({ success: true });
    }
    if (typeof body.elapsedMs === "number" && body.elapsedMs >= 0 && body.elapsedMs < 2000) {
      return NextResponse.json({ success: true });
    }

    const result = validateScoutApply(body);
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
    console.error("[driver-scout-apply] unexpected error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}

/** 申込み内容のうち、既存列に無い項目を1つの文字列にする（migration 014 未適用時の保存用） */
function extrasText(v: ScoutApplyValues): string {
  return [
    "【候補者プロフィール検索 利用申込み】",
    `所在地（市区町村）：${v.city}`,
    `求める免許：${v.licenses.join("、")}`,
    `採用希望時期：${v.hiringTiming}`,
  ].join("\n");
}

async function save(v: ScoutApplyValues, tracking: Record<string, string | null>): Promise<boolean> {
  if (!isSupabaseAdminConfigured()) {
    console.error("[driver-scout-apply] Supabase admin is not configured");
    return false;
  }
  const db = createAdminClient();
  const base = {
    company_name: v.companyName,
    contact_name: v.contactName,
    phone: v.phone,
    email: v.email,
    prefecture: v.prefecture,
    job_types: v.jobTypes,
    hiring_count: v.hiringCount,
    consented_at: new Date().toISOString(),
    status: "new",
    ...tracking,
  };

  const { error } = await db.from("driver_company_inquiries").insert({
    ...base,
    inquiry_type: SCOUT_INQUIRY_TYPE,
    address_city: v.city,
    licenses: v.licenses,
    hiring_timing: v.hiringTiming,
    message: extrasText(v),
  });
  if (!error) return true;

  // migration 014 の列がまだ無い場合は、追加項目を message にまとめて保存し直す
  const missingColumn = error.code === "PGRST204" || error.code === "42703";
  console.error("[driver-scout-apply] insert failed:", error.code, error.message);
  if (!missingColumn) return false;

  const retry = await db.from("driver_company_inquiries").insert({ ...base, message: extrasText(v) });
  if (retry.error) {
    console.error("[driver-scout-apply] fallback insert failed:", retry.error.code, retry.error.message);
    return false;
  }
  return true;
}

/** 運営への通知。送れたら true（RESEND_API_KEY・通知先が未設定なら false） */
async function notify(v: ScoutApplyValues, tracking: Record<string, string | null>, dbFailed: boolean): Promise<boolean> {
  const to = adminAddress();
  if (!to) {
    console.error("[driver-scout-apply] notification address is not set");
    return false;
  }
  const text = [
    "【ドライバー採用サービス】候補者プロフィール検索の利用申込みが届きました。",
    dbFailed ? "\n※ データベースへの保存に失敗しています。このメールの内容を控えてください。\n" : "",
    `会社名：${v.companyName}`,
    `担当者名：${v.contactName}`,
    `電話番号：${v.phone}`,
    `メールアドレス：${v.email}`,
    `所在地：${v.prefecture}${v.city}`,
    `採用したい職種：${v.jobTypes.join("、")}`,
    `求める免許：${v.licenses.join("、")}`,
    `採用予定人数：${v.hiringCount}`,
    `採用希望時期：${v.hiringTiming}`,
    "",
    `流入元：${tracking.utm_source ?? tracking.referrer ?? "直接アクセス"}`,
    "",
    "次の対応：採用条件のヒアリング → サービス説明・料金条件の確認 → 企業確認・契約 → アカウント発行",
  ].join("\n");
  return sendMail({ to, subject: `【利用申込み】${v.companyName} 様（候補者プロフィール検索）`, text, replyTo: v.email });
}
