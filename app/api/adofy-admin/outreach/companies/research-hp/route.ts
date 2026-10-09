import { NextResponse } from "next/server";
import { authed, bad } from "@/lib/outreach/api";
import { TABLES } from "@/lib/outreach/constants";

export const dynamic = "force-dynamic";

/**
 * 「HPなし」の企業を、会社名＋住所での HP 検索（Google Places）にもう一度かける。
 * 状態を「HP未確認」に戻すだけで、実際の検索は自動処理が少しずつ進める。
 */
export async function POST(req: Request) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  if (!process.env.GOOGLE_PLACES_API_KEY) return bad("GOOGLE_PLACES_API_KEY が未設定です", 409);
  const { data, error } = await a.db
    .from(TABLES.companies)
    .update({ crawl_status: "pending", email_status: "unchecked", last_checked_at: null, updated_at: new Date().toISOString() })
    .eq("crawl_status", "no_website")
    .is("email", null)
    .select("id");
  if (error) return bad("更新に失敗しました", 500);
  return NextResponse.json({ ok: true, count: data?.length ?? 0 });
}
