import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { LEADS_TABLE, validateLead } from "@/lib/saiyoRescue/leads";
import { notifyNewLead } from "@/lib/saiyoRescue/notify";

/**
 * 採用レスキューLPの無料相談フォーム受付。
 *
 * ・ブラウザから Supabase へ直接書き込ませず、必ずこのAPIを経由する（service role で INSERT）
 * ・スパム対策：同一オリジン確認／ハニーポット／表示から送信までの最短時間／送信間隔制限／サーバー側検証
 *   Turnstile 等を足す場合は、検証処理をハニーポットの直後に追加する
 * ・DB保存に失敗しても、通知が届けば受付成立とする（問い合わせを取りこぼさない）
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ── 送信間隔制限（インスタンス内メモリの簡易実装） ── */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const MIN_INTERVAL_MS = 20 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  const tooSoon = recent.length > 0 && now - recent[recent.length - 1] < MIN_INTERVAL_MS;
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return tooSoon || recent.length > MAX_PER_WINDOW;
}

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  return fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

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

export async function POST(req: Request) {
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: GENERIC_ERROR }, { status: 403 });

    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    // ハニーポット・高速送信は「成功したように見せて」破棄する
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ success: true });
    }
    if (typeof body.elapsedMs === "number" && body.elapsedMs >= 0 && body.elapsedMs < 2500) {
      return NextResponse.json({ success: true });
    }

    if (rateLimited(clientKey(req))) {
      return NextResponse.json(
        { error: "短時間に続けて送信されています。しばらく時間をおいてからお試しください。" },
        { status: 429 },
      );
    }

    const result = validateLead(body);
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 400 });

    const createdAt = new Date();
    let id: string | null = null;
    let dbFailed = false;

    if (isSupabaseAdminConfigured()) {
      const { data, error } = await createAdminClient()
        .from(LEADS_TABLE)
        .insert(result.row)
        .select("id")
        .single();
      if (error) {
        console.error("[saiyo-rescue-contact] insert failed:", error.code, error.message);
        dbFailed = true;
      } else {
        id = (data?.id as string) ?? null;
      }
    } else {
      console.error("[saiyo-rescue-contact] Supabase admin is not configured");
      dbFailed = true;
    }

    const sent = await notifyNewLead({ id, row: result.row, createdAt, dbFailed });

    // DBにも通知にも残らなかった場合だけエラーを返し、再送を促す
    if (dbFailed && !sent.delivered) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[saiyo-rescue-contact] unexpected:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
