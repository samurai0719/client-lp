import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { findSendByToken, markUnsubscribed } from "@/lib/outreach/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 配信停止。
 *   ・メールソフトの「配信停止」ボタン（List-Unsubscribe-Post によるワンクリック。RFC 8058）
 *   ・/unsubscribe ページのボタン
 * のどちらからも POST で呼ばれる。GET では停止しない（リンクの自動プリフェッチで誤停止させないため）。
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  let token = url.searchParams.get("t");
  if (!token) {
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      token = ((await req.json().catch(() => ({}))) as { t?: string }).t ?? null;
    } else {
      const form = await req.formData().catch(() => null);
      token = (form?.get("t") as string | null) ?? null;
    }
  }
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "現在処理できません。お手数ですがメールでご連絡ください。" }, { status: 503 });
  }
  const db = createAdminClient();
  const send = token ? await findSendByToken(db, token) : null;
  if (!send) return NextResponse.json({ error: "URLが無効です" }, { status: 404 });

  await markUnsubscribed(db, { send });
  return NextResponse.json({ success: true });
}
