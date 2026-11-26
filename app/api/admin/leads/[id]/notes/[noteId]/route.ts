import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { unauthorizedResponse } from "@/lib/auth/adminCheck";
import { leadBelongsTo, requireCrmAdmin } from "@/lib/crm/company";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; noteId: string }> }) {
  const { id, noteId } = await params;
  const supabase = await createClient();
  const admin = await requireCrmAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const { content } = await request.json();
  if (!content?.trim()) return NextResponse.json({ error: "内容が必要です" }, { status: 400 });

  const db = createAdminClient();
  if (!(await leadBelongsTo(db, id, admin.company))) return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  const { error } = await db.from("lead_notes").update({ content: content.trim(), updated_at: new Date().toISOString() }).eq("id", noteId).eq("lead_id", id);
  if (error) return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string; noteId: string }> }) {
  const { id, noteId } = await params;
  const supabase = await createClient();
  const admin = await requireCrmAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const db = createAdminClient();
  if (!(await leadBelongsTo(db, id, admin.company))) return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  await db.from("lead_notes").delete().eq("id", noteId).eq("lead_id", id);
  return NextResponse.json({ success: true });
}
