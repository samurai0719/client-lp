import AdminShell from "@/components/admin/AdminShell";
import LeadDetailContent from "./_components/LeadDetailContent";

export default function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AdminShell>
      <LeadDetailContent paramsPromise={params} />
    </AdminShell>
  );
}
