import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { runWorker } from "@/lib/outreach/worker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * 営業メールのバックグラウンド処理（送信キュー・営業先の取得・HP確認・問い合わせ紐付け）。
 * Vercel Cron または外部のスケジューラから1〜5分ごとに呼ぶ。
 *   Authorization: Bearer ${CRON_SECRET}
 */
export async function GET(request: NextRequest) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseAdminConfigured()) return NextResponse.json({ skip: true });

  const result = await runWorker(createAdminClient(), { budgetMs: 50_000 });
  return NextResponse.json(result);
}
