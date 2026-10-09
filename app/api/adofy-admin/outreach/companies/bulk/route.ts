import { NextResponse } from "next/server";
import { authed, bad, UUID } from "@/lib/outreach/api";
import { REVIEW_BLOCK_REASONS, TABLES } from "@/lib/outreach/constants";

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
  // ChatGPT 経由・個人名・フリーメールのアドレスは、目視確認して「送信OK」にした時点で送信停止を解除する
  if (review === "approved") {
    await a.db
      .from(TABLES.companies)
      .update({ send_blocked: false, send_blocked_reason: null })
      .in("id", ids)
      .in("send_blocked_reason", REVIEW_BLOCK_REASONS);
  }
  return NextResponse.json({ ok: true, count: ids.length });
}
