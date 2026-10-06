import { notFound } from "next/navigation";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import LeadDetail from "@/components/saiyo-rescue-admin/LeadDetail";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { LEADS_TABLE, type LeadRow } from "@/lib/saiyoRescue/leads";

export const dynamic = "force-dynamic";

export const metadata = { title: "問い合わせ詳細｜採用レスキュー" };

export default async function SaiyoRescueLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const [{ data: lead }, { data: names }] = await Promise.all([
    auth.db.from(LEADS_TABLE).select("*").eq("id", id).maybeSingle(),
    auth.db.from(LEADS_TABLE).select("assigned_to").not("assigned_to", "is", null).limit(1000),
  ]);
  if (!lead) notFound();

  const assignees = [...new Set((names ?? []).map((n) => n.assigned_to as string))];

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <LeadDetail lead={lead as LeadRow} assignees={assignees} />
      </div>
    </AdofyAdminShell>
  );
}
