import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdofyAccess, forbiddenResponse } from "@/lib/auth/adofyCheck";
import { STATUSES } from "@/lib/hpDesign/options";
import { normalizeUrl } from "@/lib/hpDesign/validate";
import { TABLE } from "@/lib/hpDesign/server";

/** 無料デザイン申し込み1件の更新（ステータス・管理メモ・プレビューURL） */

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const admin = await requireAdofyAccess(supabase);
  if (!admin) return forbiddenResponse();

  const { id } = await params;
  let body: { status?: unknown; adminMemo?: unknown; previewUrl?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !STATUSES.some((s) => s.id === body.status)) {
      return NextResponse.json({ error: "不正なステータスです" }, { status: 400 });
    }
    patch.status = body.status;
  }
  if (body.adminMemo !== undefined) {
    patch.admin_memo = typeof body.adminMemo === "string" && body.adminMemo.trim() ? body.adminMemo.slice(0, 5000) : null;
  }
  if (body.previewUrl !== undefined) {
    const raw = typeof body.previewUrl === "string" ? body.previewUrl.trim() : "";
    if (raw) {
      const url = normalizeUrl(raw);
      if (!url) return NextResponse.json({ error: "プレビューURLの形式が正しくありません" }, { status: 400 });
      patch.preview_url = url;
    } else {
      patch.preview_url = null;
    }
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "更新する内容がありません" }, { status: 400 });
  }

  const db = createAdminClient();
  const { data, error } = await db.from(TABLE).update(patch).eq("id", id).select("id").maybeSingle();
  if (error) {
    console.error("[admin/hp-design/:id] update failed:", error.code, error.message);
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "見つかりませんでした" }, { status: 404 });
  return NextResponse.json({ success: true });
}
