import { NextResponse } from "next/server";
import { authed, bad, campaignFields, UUID } from "@/lib/outreach/api";
import { TABLES } from "@/lib/outreach/constants";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** 文面の編集は下書きの間だけ（テスト送信後に文面を変えると、確認した内容と違うものが送られるため） */
export async function PATCH(req: Request, { params }: Params) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const { id } = await params;
  if (!UUID.test(id)) return bad("不正なIDです");
  const f = campaignFields(a.body);
  if ("error" in f) return bad(f.error!);
  const { data } = await a.db
    .from(TABLES.campaigns)
    .update({ ...f.row, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "draft")
    .select("id");
  if (!data?.length) return bad("送信を開始したメールは編集できません。複製して新しく作成してください。", 409);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: Params) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const { id } = await params;
  if (!UUID.test(id)) return bad("不正なIDです");
  const { data } = await a.db.from(TABLES.campaigns).delete().eq("id", id).eq("status", "draft").select("id");
  if (!data?.length) return bad("下書き以外は削除できません（送信履歴を残すため）", 409);
  return NextResponse.json({ ok: true });
}
