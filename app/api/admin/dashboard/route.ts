import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";

export async function GET() {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const db = createAdminClient();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [allLeads, todayLeads, monthLeads] = await Promise.all([
    db.from("leads").select("id, status, estimated_amount, quoted_amount, contract_amount, next_action_at, created_at, updated_at, customer:customers(id, name, city, phone)").is("deleted_at", null).order("created_at", { ascending: false }),
    db.from("leads").select("id, status").is("deleted_at", null).gte("created_at", todayStart),
    db.from("leads").select("id, status, estimated_amount, quoted_amount, contract_amount, updated_at").is("deleted_at", null).gte("created_at", monthStart),
  ]);

  const leads = allLeads.data ?? [];
  const today = todayLeads.data ?? [];
  const month = monthLeads.data ?? [];

  const contracted = month.filter(l => ["contracted", "under_construction", "completed"].includes(l.status));

  const stats = {
    todayCount: today.length,
    monthCount: month.length,
    uncontactedCount: leads.filter(l => l.status === "new" || l.status === "uncontacted").length,
    siteVisitScheduled: leads.filter(l => l.status === "site_visit_scheduled").length,
    estimateSent: leads.filter(l => l.status === "estimate_sent").length,
    contractedCount: leads.filter(l => ["contracted", "under_construction", "completed"].includes(l.status)).length,
    monthEstimatedRevenue: month.reduce((s, l) => s + (l.estimated_amount ?? l.quoted_amount ?? 0), 0),
    monthContractRevenue: contracted.reduce((s, l) => s + (l.contract_amount ?? 0), 0),
  };

  const thirtyMinAgo = new Date(Date.now() - 30 * 60000).toISOString();
  const urgentLeads = leads.filter(l => (l.status === "new" || l.status === "uncontacted") && l.created_at < thirtyMinAgo);
  const todayActionLeads = leads.filter(l => l.next_action_at && l.next_action_at >= todayStart && l.next_action_at < new Date(now.getTime() + 86400000).toISOString());

  return NextResponse.json({
    stats,
    recentLeads: leads.slice(0, 5).map(l => ({ ...l, customer: l.customer })),
    todayActions: todayActionLeads,
    urgentLeads,
  });
}
