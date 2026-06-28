import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!await requireAdmin(supabase)) return unauthorizedResponse();

  const db = createAdminClient();
  const { data } = await db.from("lead_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false });
  return NextResponse.json({ notes: data ?? [] });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const { content } = await request.json();
  if (!content?.trim()) return NextResponse.json({ error: "内容が必要です" }, { status: 400 });

  const db = createAdminClient();
  const { error } = await db.from("lead_notes").insert({ lead_id: id, content: content.trim(), created_by: admin.user.id });
  if (error) return NextResponse.json({ error: "追加に失敗しました" }, { status: 500 });
  return NextResponse.json({ success: true });
}
