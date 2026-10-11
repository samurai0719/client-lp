import { randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * 無料デザイン申し込みのサーバー側共通処理（APIルートからのみ import する）。
 */

export const TABLE = "hp_design_requests";
export const LOG_TABLE = "hp_design_email_logs";

/** メール内リンクの基準URL。プレビュー環境などで変えたいときは HP_DESIGN_SITE_URL で上書きする */
export function siteUrl(): string {
  return (process.env.HP_DESIGN_SITE_URL ?? "https://adofy-site.com").replace(/\/$/, "");
}

export function newPublicToken(): string {
  return randomBytes(24).toString("base64url");
}

/* ── 送信回数制限 ─────────────────────────────────────────────────────────
   app/api/consultations と同じインスタンス内メモリの簡易実装。
   サーバーレスでは実行環境ごとに独立するため完全ではないが、連打・単純なスパムは抑えられる。
   ───────────────────────────────────────────────────────────────────────── */
const buckets = new Map<string, number[]>();

export function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
  }
  return recent.length > max;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  return fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

/** CSRF対策。ブラウザが送る Origin を自分のホストと突き合わせる */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export const GENERIC_ERROR = "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。";

/** 送信履歴を残す。履歴の保存失敗で本処理は止めない */
export async function logEmail(
  db: SupabaseClient,
  entry: { request_id: string; kind: string; to_email: string; status: "sent" | "failed"; provider_id?: string | null; error?: string | null }
): Promise<void> {
  const { error } = await db.from(LOG_TABLE).insert({
    ...entry,
    provider_id: entry.provider_id ?? null,
    error: entry.error ? entry.error.slice(0, 500) : null,
  });
  if (error) console.error("[hp-design] email log insert failed:", error.code);
}

export function formatJst(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
