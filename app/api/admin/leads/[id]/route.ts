import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";
import { LEAD_STATUS_LABELS } from "@/lib/types/crm";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const db = createAdminClient();
  const { data, error } = await db
    .from("leads")
    .select("*, customer:customers(*), attribution:lead_attribution(*)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error || !data) return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  return NextResponse.json({ lead: data });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const body = await request.json();
  const {
    status, estimated_amount, quoted_amount, contract_amount,
    next_action_at, site_visit_at, lost_reason, assigned_user_id, status_changed_from,
  } = body;

  const db = createAdminClient();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (status !== undefined) updateData.status = status;
  if (estimated_amount !== undefined) updateData.estimated_amount = estimated_amount;
  if (quoted_amount !== undefined) updateData.quoted_amount = quoted_amount;
  if (contract_amount !== undefined) updateData.contract_amount = contract_amount;
  if (next_action_at !== undefined) updateData.next_action_at = next_action_at;
  if (site_visit_at !== undefined) updateData.site_visit_at = site_visit_at;
  if (lost_reason !== undefined) updateData.lost_reason = lost_reason;
  if (assigned_user_id !== undefined) updateData.assigned_user_id = assigned_user_id;

  const { error } = await db.from("leads").update(updateData).eq("id", id);
  if (error) return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });

  // ステータス変更履歴
  if (status && status_changed_from && status !== status_changed_from) {
    await db.from("lead_activities").insert({
      lead_id: id,
      activity_type: "status_changed",
      content: `ステータスを「${LEAD_STATUS_LABELS[status_changed_from as keyof typeof LEAD_STATUS_LABELS] ?? status_changed_from}」から「${LEAD_STATUS_LABELS[status as keyof typeof LEAD_STATUS_LABELS] ?? status}」へ変更`,
      created_by: admin.user.id,
    });

    // 監査ログ
    await db.from("audit_logs").insert({
      user_id: admin.user.id,
      action: "status_changed",
      target_type: "leads",
      target_id: id,
      metadata: { from: status_changed_from, to: status },
    });
  }

  // 金額変更監査ログ
  if (contract_amount !== undefined || quoted_amount !== undefined || estimated_amount !== undefined) {
    await db.from("audit_logs").insert({
      user_id: admin.user.id,
      action: "amount_updated",
      target_type: "leads",
      target_id: id,
      metadata: {},
    });
  }

  return NextResponse.json({ success: true });
}
