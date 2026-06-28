import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";

export async function GET() {
  const supabase = await createClient();
  if (!await requireAdmin(supabase)) return unauthorizedResponse();

  const db = createAdminClient();

  const [siteVisitRes, nextActionRes] = await Promise.all([
    db
      .from("leads")
      .select("*, customer:customers(*)")
      .not("site_visit_at", "is", null)
      .is("deleted_at", null)
      .order("site_visit_at", { ascending: true }),
    db
      .from("leads")
      .select("*, customer:customers(*)")
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
