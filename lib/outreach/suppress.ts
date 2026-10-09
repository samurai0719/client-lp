import type { SupabaseClient } from "@supabase/supabase-js";
import { TABLES } from "./constants";

export type SuppressionReason = "unsubscribe" | "hard_bounce" | "complaint" | "refused" | "site_refusal" | "manual";

/** 配信停止リストへ登録（既に登録済みなら何もしない） */
export async function addSuppression(
  db: SupabaseClient,
  email: string,
  reason: SuppressionReason,
  note?: string | null
): Promise<void> {
  const { error } = await db
    .from(TABLES.suppressions)
    .insert({ email: email.trim().toLowerCase(), reason, note: note?.slice(0, 300) ?? null });
  if (error && error.code !== "23505") console.error("[outreach] suppression insert failed:", error.code, error.message);
}

export async function isSuppressed(db: SupabaseClient, email: string): Promise<boolean> {
  const { data } = await db.from(TABLES.suppressions).select("id").eq("email", email.trim().toLowerCase()).limit(1);
  return Boolean(data && data.length > 0);
}
