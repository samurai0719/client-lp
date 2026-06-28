import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";
import { LEAD_STATUS_LABELS } from "@/lib/types/crm";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "";
  const source = searchParams.get("source") ?? "";

  const db = createAdminClient();
  let query = db
    .from("leads")
    .select("*, customer:customers(*), attribution:lead_attribution(*)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);

  const { data } = await query;
  let leads = data ?? [];

  if (q) {
    leads = leads.filter(
      (l) =>
        l.customer?.name?.includes(q) ||
        l.customer?.phone?.includes(q) ||
        l.customer?.city?.includes(q)
    );
  }

  // 監査ログ
  await db.from("audit_logs").insert({
    user_id: admin.user.id,
    action: "csv_exported",
    target_type: "leads",
    metadata: { count: leads.length },
  });

  const BOM = "﻿";
  const headers = [
    "受付日時", "顧客名", "電話番号", "メール", "都道府県", "市区町村", "住所",
    "希望工事", "デザイン", "ステータス", "見込み金額", "見積金額", "成約金額",
    "次回対応日時", "流入元", "キャンペーン", "広告クリエイティブ",
  ];

  const rows = leads.map((l) => [
    l.created_at ? new Date(l.created_at).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }) : "",
    l.customer?.name ?? "",
    l.customer?.phone ?? "",
    l.customer?.email ?? "",
    l.customer?.prefecture ?? "",
    l.customer?.city ?? "",
    l.customer?.address ?? "",
    (l.work_types ?? []).join("、"),
    l.design_style ?? "",
    LEAD_STATUS_LABELS[l.status as keyof typeof LEAD_STATUS_LABELS] ?? l.status,
    l.estimated_amount != null ? String(l.estimated_amount) : "",
    l.quoted_amount != null ? String(l.quoted_amount) : "",
    l.contract_amount != null ? String(l.contract_amount) : "",
    l.next_action_at ? new Date(l.next_action_at).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }) : "",
    l.attribution?.utm_source ?? l.source ?? "",
    l.attribution?.utm_campaign ?? "",
    l.attribution?.utm_content ?? "",
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`));

  const csv = BOM + [headers.map((h) => `"${h}"`).join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${date}.csv"`,
    },
  });
}
