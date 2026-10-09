import { notFound } from "next/navigation";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import OutreachNav from "@/components/outreach-admin/OutreachNav";
import WorkerRunner from "@/components/outreach-admin/WorkerRunner";
import { getOutreachDb } from "@/lib/outreach/access";

/*
  ドラテク 営業メール（運送会社向け）の管理画面。
  公開URL /admin/outreach/* は next.config.ts でここへリダイレクトしている。
  権限は adofy 管理者（ADOFY_ADMIN_EMAILS）のみ。高長建設の /admin のログインでは開けない。
*/
export default async function OutreachLayout({ children }: { children: React.ReactNode }) {
  if (!(await getOutreachDb())) notFound();
  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <OutreachNav />
        <WorkerRunner />
        {children}
      </div>
    </AdofyAdminShell>
  );
}
