import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";

export async function GET(request: NextRequest) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ skip: true });
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const { sendPushToUser } = await import("@/lib/push/sendPush");
  const db = createAdminClient();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
  const thirtyMinAgo = new Date(Date.now() - 30 * 60000).toISOString();

  const [actionLeads, urgentLeads] = await Promise.all([
    // 次回対応予定（本日）
    db.from("leads")
      .select("id, company, next_action_at, customer:customers(name, city)")
      .not("next_action_at", "is", null)
      .gte("next_action_at", todayStart)
      .lte("next_action_at", now.toISOString())
      .is("deleted_at", null),

    // 30分以上未対応
    db.from("leads")
      .select("id, company, status, created_at, customer:customers(name, city)")
      .in("status", ["new", "uncontacted"])
      .lte("created_at", thirtyMinAgo)
      .is("deleted_at", null),
  ]);

  const { data: allAdmins } = await db.from("profiles").select("id, company").eq("role", "admin");
  if (!allAdmins?.length) return NextResponse.json({ success: true });
  // 通知はその案件の会社の人にだけ送る
  const adminsOf = (company: string) => allAdmins.filter((a) => a.company === company);

  const sent: string[] = [];

  for (const lead of actionLeads.data ?? []) {
    const admins = adminsOf(lead.company);
    if (!admins.length) continue;
    const schedKey = `next_action_${lead.next_action_at?.slice(0, 16)}`;
    const { count } = await db.from("notification_logs")
      .select("*", { count: "exact", head: true })
      .eq("lead_id", lead.id)
      .eq("notification_type", "next_action")
      .eq("scheduled_key", schedKey);

    if ((count ?? 0) > 0) continue;

    const customer = Array.isArray(lead.customer) ? lead.customer[0] : lead.customer;
    const name = customer?.name?.split(/[\s　]/)[0] ?? "";
    await Promise.allSettled(admins.map((a) => sendPushToUser(a.id, {
      title: "本日の対応予定",
      body: `${name}様への再連絡予定時刻です。`,
      url: `/admin/leads/${lead.id}`,
    })));

    await db.from("notification_logs").insert(admins.map((a) => ({
      user_id: a.id,
      lead_id: lead.id,
      notification_type: "next_action",
      scheduled_key: schedKey,
      status: "sent",
    })));
    sent.push(`next_action:${lead.id}`);
  }

  // 未対応警告（会社ごとに1日1回のみ）
  const dayKey = now.toISOString().slice(0, 10);
  for (const company of new Set((urgentLeads.data ?? []).map((l) => l.company))) {
    const admins = adminsOf(company);
    if (!admins.length) continue;
    const { count } = await db.from("notification_logs")
      .select("*", { count: "exact", head: true })
      .eq("notification_type", "uncontacted_warning")
      .eq("scheduled_key", `${dayKey}:${company}`)
      .gte("sent_at", todayStart);

    if ((count ?? 0) === 0) {
      const urgentCount = (urgentLeads.data ?? []).filter((l) => l.company === company).length;
      await Promise.allSettled(admins.map((a) => sendPushToUser(a.id, {
        title: "未対応のお問い合わせがあります",
        body: `受付から30分以上経過した未対応案件が${urgentCount}件あります。`,
        url: "/admin/leads",
      })));
      await db.from("notification_logs").insert(admins.map((a) => ({
        user_id: a.id,
        notification_type: "uncontacted_warning",
        scheduled_key: `${dayKey}:${company}`,
        status: "sent",
      })));
      sent.push(`uncontacted_warning:${company}`);
    }
  }

  // 現地調査予定
  const { data: siteVisits } = await db.from("leads")
    .select("id, company, next_action_at, customer:customers(name)")
    .eq("status", "site_visit_scheduled")
    .gte("next_action_at", todayStart)
    .lte("next_action_at", todayEnd)
    .is("deleted_at", null);

  for (const lead of siteVisits ?? []) {
    const admins = adminsOf(lead.company);
    if (!admins.length) continue;
    const schedKey = `site_visit_${lead.next_action_at?.slice(0, 16)}`;
    const { count } = await db.from("notification_logs")
      .select("*", { count: "exact", head: true })
      .eq("lead_id", lead.id)
      .eq("notification_type", "site_visit")
      .eq("scheduled_key", schedKey);

    if ((count ?? 0) > 0) continue;

    const customer = Array.isArray(lead.customer) ? lead.customer[0] : lead.customer;
    const name = customer?.name?.split(/[\s　]/)[0] ?? "";
    const timeStr = lead.next_action_at
      ? new Date(lead.next_action_at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tokyo" })
      : "";

    await Promise.allSettled(admins.map((a) => sendPushToUser(a.id, {
      title: "現地調査の予定",
      body: `${timeStr ? `本日${timeStr}から` : "本日"}${name}様の現地調査の予定があります。`,
      url: `/admin/leads/${lead.id}`,
    })));

    await db.from("notification_logs").insert(admins.map((a) => ({
      user_id: a.id,
      lead_id: lead.id,
      notification_type: "site_visit",
      scheduled_key: schedKey,
      status: "sent",
    })));
    sent.push(`site_visit:${lead.id}`);
  }

  return NextResponse.json({ success: true, sent });
}
