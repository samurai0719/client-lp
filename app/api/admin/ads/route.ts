import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";

export async function GET() {
  const supabase = await createClient();
  if (!await requireAdmin(supabase)) return unauthorizedResponse();

  const db = createAdminClient();
  const [expRes, leadRes] = await Promise.all([
    db.from("ad_expenses").select("*").order("date", { ascending: false }),
    db.from("leads").select("status, source, contract_amount").is("deleted_at", null),
  ]);

  const expenses = expRes.data ?? [];
  const leads = leadRes.data ?? [];

  const platforms = ["meta", "google", "tiktok", "other"];
  const stats = platforms.map((p) => {
    const exp = expenses.filter((e) => e.platform === p);
    const totalExpense = exp.reduce((s, e) => s + e.amount, 0);
    const platformLeads = leads.filter((l) => l.source === p);
    const contracted = platformLeads.filter((l) => ["contracted", "under_construction", "completed"].includes(l.status));
    return {
      platform: p,
      totalExpense,
      inquiryCount: platformLeads.length,
      contractCount: contracted.length,
      contractRevenue: contracted.reduce((s, l) => s + (l.contract_amount ?? 0), 0),
    };
  }).filter((s) => s.totalExpense > 0 || s.inquiryCount > 0);

  return NextResponse.json({ expenses, stats });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!await requireAdmin(supabase)) return unauthorizedResponse();

  const body = await request.json();
  const { date, platform, campaign_name, amount, memo } = body;
  if (!date || !platform || !amount) return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });

  const db = createAdminClient();
  const { error } = await db.from("ad_expenses").insert({ date, platform, campaign_name, amount, memo });
  if (error) return NextResponse.json({ error: "追加に失敗しました" }, { status: 500 });
  return NextResponse.json({ success: true });
}
