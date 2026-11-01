// 公開フォーム・AIシミュレーター共通のレート制限。
// サーバーレスは関数インスタンスごとにメモリが分かれるため、
// Supabase の check_rate_limit（migration 018）で全インスタンス共通に数える。
// RPCが使えないとき（migration未適用など）だけ、従来どおりのメモリ内カウントへ切り替える。

import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";

const memoryMap = new Map<string, { count: number; resetAt: number }>();

function countInMemory(key: string, windowSeconds: number): number {
  const now = Date.now();
  const entry = memoryMap.get(key);
  if (!entry || now >= entry.resetAt) {
    memoryMap.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return 1;
  }
  entry.count++;
  return entry.count;
}

export function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** IPなどの生の値はDBへ保存しないようハッシュ化する */
export async function checkRateLimit(
  scope: string,
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `${scope}:${createHash("sha256").update(identifier).digest("hex")}`;
  let count: number | null = null;

  if (isSupabaseAdminConfigured()) {
    const { data, error } = await createAdminClient().rpc("check_rate_limit", {
      p_key: key,
      p_window_seconds: windowSeconds,
    });
    if (!error && typeof data === "number") count = data;
    else console.error("[rateLimit] RPC failed, falling back to memory:", error?.message);
  }

  count ??= countInMemory(key, windowSeconds);
  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}
