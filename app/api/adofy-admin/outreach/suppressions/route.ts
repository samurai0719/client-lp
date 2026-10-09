import { NextResponse } from "next/server";
import { authed, bad, str, UUID } from "@/lib/outreach/api";
import { TABLES } from "@/lib/outreach/constants";
import { markUnsubscribed } from "@/lib/outreach/events";
import { normalizeEmail } from "@/lib/outreach/normalize";

export const dynamic = "force-dynamic";

/** 送信拒否の連絡（電話・メール等）を受けたアドレスを手動で配信停止リストに入れる */
export async function POST(req: Request) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const email = normalizeEmail(str(a.body.email, 200));
  if (!email) return bad("メールアドレスの形式が正しくありません");
  await markUnsubscribed(a.db, { email }, "refused");
  return NextResponse.json({ ok: true });
}

/** 削除できるのは「手動登録」だけ。配信停止・バウンス・苦情は誤操作でも解除させない */
export async function DELETE(req: Request) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!UUID.test(id)) return bad("不正なIDです");
  const { data } = await a.db.from(TABLES.suppressions).delete().eq("id", id).eq("reason", "manual").select("id");
  if (!data?.length) return bad("配信停止・バウンス等で登録されたアドレスは解除できません", 409);
  return NextResponse.json({ ok: true });
}
