import type { SupabaseClient } from "@supabase/supabase-js";
import { OPERATOR, SERVICE } from "@/config/driver-company";
import { TABLES } from "./constants";

/**
 * 送信速度・送信者情報の設定。
 *
 * 送信速度は「管理画面で設定した値」と「メール配信サービスの上限（環境変数）」の
 * 小さいほうを常に使う。管理画面からサービスの上限を超える値は設定できない。
 *
 *   OUTREACH_PROVIDER_MAX_PER_MINUTE  既定 60   （Resend の API レート制限 2件/秒 より十分低く）
 *   OUTREACH_PROVIDER_MAX_PER_HOUR    既定 1000
 *   OUTREACH_PROVIDER_MAX_PER_DAY     既定 100  （Resend 無料プランの1日上限。有料プランなら契約に合わせて上げる）
 */

export type OutreachSettings = {
  per_minute: number;
  per_hour: number;
  per_day: number;
  min_days_between_campaigns: number;
  sender_name: string;
  sender_address: string;
  sender_email: string;
  sender_phone: string;
  updated_at?: string;
};

function envInt(name: string, fallback: number): number {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export function providerLimits() {
  return {
    per_minute: envInt("OUTREACH_PROVIDER_MAX_PER_MINUTE", 60),
    per_hour: envInt("OUTREACH_PROVIDER_MAX_PER_HOUR", 1000),
    per_day: envInt("OUTREACH_PROVIDER_MAX_PER_DAY", 100),
  };
}

const DEFAULTS: OutreachSettings = {
  per_minute: 10,
  per_hour: 200,
  per_day: 100,
  min_days_between_campaigns: 30,
  sender_name: "",
  sender_address: "",
  sender_email: "",
  sender_phone: "",
};

export async function getSettings(db: SupabaseClient): Promise<OutreachSettings> {
  const { data } = await db.from(TABLES.settings).select("*").eq("id", 1).maybeSingle();
  const s = { ...DEFAULTS, ...((data as Partial<OutreachSettings>) ?? {}) };
  // 未入力の送信者情報は、ドラテクの事業者情報（config/driver-company.ts）で補う
  return {
    ...s,
    sender_name: s.sender_name || OPERATOR.name || OPERATOR.tradeName,
    sender_address: s.sender_address || OPERATOR.address,
    sender_email: s.sender_email || OPERATOR.email,
    sender_phone: s.sender_phone || OPERATOR.phone,
  };
}

/** 実際に使う送信速度（サービス上限で丸めたもの） */
export function effectiveLimits(s: OutreachSettings) {
  const p = providerLimits();
  return {
    per_minute: Math.max(0, Math.min(s.per_minute, p.per_minute)),
    per_hour: Math.max(0, Math.min(s.per_hour, p.per_hour)),
    per_day: Math.max(0, Math.min(s.per_day, p.per_day)),
  };
}

export function fromAddress(): string | null {
  return process.env.OUTREACH_FROM_EMAIL?.trim() || null;
}

export function replyToAddress(s: OutreachSettings): string | null {
  return process.env.OUTREACH_REPLY_TO?.trim() || s.sender_email || null;
}

/** 営業メールのリンク先（企業向けLP）の既定値。例: https://doratech.adofy-site.com/ */
export function defaultLandingUrl(): string {
  return process.env.OUTREACH_LANDING_URL?.trim() || SERVICE.url;
}

/** メール内のリンク（クリック計測・配信停止）に使う公開URL */
export function publicBaseUrl(): string {
  return (process.env.OUTREACH_PUBLIC_BASE_URL?.trim() || SERVICE.siteUrl).replace(/\/$/, "");
}

/**
 * 送信を始めてよい状態か。
 * 特定電子メール法の表示義務（送信者の氏名又は名称・住所・受信拒否の連絡先・問い合わせ先）を
 * 満たせない状態では1通も送らない。
 */
export function sendReadiness(s: OutreachSettings): { ready: boolean; problems: string[] } {
  const problems: string[] = [];
  const logMode = process.env.OUTREACH_MAIL_PROVIDER === "log" && process.env.NODE_ENV !== "production" && process.env.VERCEL_ENV !== "production";
  if (!logMode && !process.env.RESEND_API_KEY) problems.push("RESEND_API_KEY（メール配信サービスのAPIキー）が未設定です");
  if (!fromAddress()) problems.push("OUTREACH_FROM_EMAIL（営業メールの送信元アドレス）が未設定です");
  if (!s.sender_name) problems.push("送信者名（事業者名）が未設定です");
  if (!s.sender_address) problems.push("送信者の住所が未設定です");
  if (!s.sender_email) problems.push("送信者の連絡先メールアドレス（受信拒否・問い合わせ先）が未設定です");
  if (!replyToAddress(s)) problems.push("返信先アドレスが未設定です");
  const eff = effectiveLimits(s);
  if (eff.per_minute <= 0 || eff.per_hour <= 0 || eff.per_day <= 0) problems.push("送信速度が0になっています");
  return { ready: problems.length === 0, problems };
}
