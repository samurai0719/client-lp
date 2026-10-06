import { NextResponse, type NextRequest } from "next/server";
import { forbiddenResponse } from "@/lib/auth/adofyCheck";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { LEADS_TABLE, isLeadStatus } from "@/lib/saiyoRescue/leads";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

const UUID = /^[0-9a-f-]{36}$/i;

/** 問い合わせ1件の更新（ステータス・担当者・対応メモ・次回対応日） */
export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) return forbiddenResponse();

  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "不正なIDです" }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};

  if ("status" in body) {
    if (!isLeadStatus(body.status)) return NextResponse.json({ error: "ステータスが不正です" }, { status: 400 });
    patch.status = body.status;
  }
  if ("assigned_to" in body) {
    const v = typeof body.assigned_to === "string" ? body.assigned_to.trim().slice(0, 60) : "";
    patch.assigned_to = v || null;
  }
  if ("memo" in body) {
    const v = typeof body.memo === "string" ? body.memo.slice(0, 20000) : "";
    patch.memo = v.trim() ? v : null;
  }
  if ("next_contact_at" in body) {
    const v = body.next_contact_at;
    if (v === null || v === "") {
      patch.next_contact_at = null;
    } else if (typeof v === "string" && !Number.isNaN(new Date(v).getTime())) {
      patch.next_contact_at = new Date(v).toISOString();
    } else {
      return NextResponse.json({ error: "次回対応日が不正です" }, { status: 400 });
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "更新する項目がありません" }, { status: 400 });
  }

  const { data, error } = await auth.db.from(LEADS_TABLE).update(patch).eq("id", id).select("*").single();
  if (error || !data) {
    console.error("[saiyo-rescue admin] update failed:", error?.code, error?.message);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }
  return NextResponse.json({ lead: data });
}
