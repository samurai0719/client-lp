import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { unauthorizedResponse } from "@/lib/auth/adminCheck";
import { leadBelongsTo, requireCrmAdmin } from "@/lib/crm/company";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireCrmAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const db = createAdminClient();
  if (!(await leadBelongsTo(db, id, admin.company))) return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  const { data } = await db
    .from("lead_activities")
    .select("*")
    .eq("lead_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ activities: data ?? [] });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireCrmAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const { activity_type, content } = await request.json();
  if (!content?.trim()) return NextResponse.json({ error: "内容が必要です" }, { status: 400 });

  const db = createAdminClient();
  if (!(await leadBelongsTo(db, id, admin.company))) return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  const { error } = await db.from("lead_activities").insert({
    lead_id: id,
    activity_type: activity_type ?? "note",
    content: content.trim(),
    created_by: admin.user.id,
  });

  if (error) return NextResponse.json({ error: "追加に失敗しました" }, { status: 500 });
  return NextResponse.json({ success: true });
}
