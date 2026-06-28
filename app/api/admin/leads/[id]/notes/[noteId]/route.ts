import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; noteId: string }> }) {
  const { noteId } = await params;
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const { content } = await request.json();
  if (!content?.trim()) return NextResponse.json({ error: "内容が必要です" }, { status: 400 });

  const db = createAdminClient();
  const { error } = await db.from("lead_notes").update({ content: content.trim(), updated_at: new Date().toISOString() }).eq("id", noteId);
  if (error) return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string; noteId: string }> }) {
  const { noteId } = await params;
  const supabase = await createClient();
  if (!await requireAdmin(supabase)) return unauthorizedResponse();

  const db = createAdminClient();
  await db.from("lead_notes").delete().eq("id", noteId);
  return NextResponse.json({ success: true });
}
