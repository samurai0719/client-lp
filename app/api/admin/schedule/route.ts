import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { unauthorizedResponse } from "@/lib/auth/adminCheck";
import { requireCrmAdmin } from "@/lib/crm/company";

export async function GET() {
  const supabase = await createClient();
  const admin = await requireCrmAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const db = createAdminClient();

  const [siteVisitRes, nextActionRes] = await Promise.all([
    db
      .from("leads")
      .select("*, customer:customers(*)")
      .eq("company", admin.company)
      .not("site_visit_at", "is", null)
      .is("deleted_at", null)
      .order("site_visit_at", { ascending: true }),
    db
      .from("leads")
      .select("*, customer:customers(*)")
      .eq("company", admin.company)
      .not("next_action_at", "is", null)
      .is("deleted_at", null)
      .order("next_action_at", { ascending: true }),
  ]);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

  const nextActions = nextActionRes.data ?? [];

  return NextResponse.json({
    siteVisits: siteVisitRes.data ?? [],
    overdue: nextActions.filter((l) => l.next_action_at < todayStart),
    today: nextActions.filter((l) => l.next_action_at >= todayStart && l.next_action_at < todayEnd),
    upcoming: nextActions.filter((l) => l.next_action_at >= todayEnd),
  });
}
