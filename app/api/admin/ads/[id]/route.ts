import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!await requireAdmin(supabase)) return unauthorizedResponse();

  const body = await request.json();
  const db = createAdminClient();
  const { error } = await db.from("ad_expenses").update({ ...body, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!await requireAdmin(supabase)) return unauthorizedResponse();

  const db = createAdminClient();
  await db.from("ad_expenses").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
