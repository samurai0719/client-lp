import { NextResponse } from "next/server";
import { authed, bad, UUID } from "@/lib/outreach/api";
import { TABLES } from "@/lib/outreach/constants";

export const dynamic = "force-dynamic";

/** 確認待ちの一括操作（送信OK / 除外） */
export async function POST(req: Request) {
  const a = await authed<{ ids?: unknown; review?: unknown }>(req);
  if ("error" in a) return a.error;
  const ids = Array.isArray(a.body.ids) ? a.body.ids.filter((x): x is string => typeof x === "string" && UUID.test(x)) : [];
  const review = String(a.body.review ?? "");
  if (ids.length === 0 || ids.length > 500) return bad("対象を選択してください");
  if (!["approved", "excluded", "pending"].includes(review)) return bad("値が不正です");
  const now = new Date().toISOString();
  const { error } = await a.db
    .from(TABLES.companies)
    .update({ review_status: review, reviewed_at: review === "pending" ? null : now, updated_at: now })
    .in("id", ids);
  if (error) return bad("更新に失敗しました", 500);
  return NextResponse.json({ ok: true, count: ids.length });
}
