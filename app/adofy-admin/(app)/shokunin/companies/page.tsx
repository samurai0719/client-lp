import { notFound } from "next/navigation";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import LeadsList from "@/components/saiyo-rescue-admin/LeadsList";
import ShokuninNav from "@/components/shokunin-admin/ShokuninNav";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { LEADS_TABLE, type LeadRow } from "@/lib/saiyoRescue/leads";

export const dynamic = "force-dynamic";
export const metadata = { title: "職人採用エージェント 企業の問い合わせ｜adofy 管理画面" };

/** 企業向けLP（/shokunin-agent）からの問い合わせだけの一覧。詳細・状況管理は採用レスキューと共通 */
export default async function ShokuninCompaniesPage() {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();

  const { data, error } = await auth.db.from(LEADS_TABLE).select("*").eq("desired_plan", "shokunin").order("created_at", { ascending: false }).limit(2000);

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <ShokuninNav current="companies" />
        <h1 className="mb-4 text-xl font-bold text-slate-900">企業の問い合わせ</h1>
        {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">データを読み込めませんでした。</p> : <LeadsList leads={(data ?? []) as LeadRow[]} />}
      </div>
    </AdofyAdminShell>
  );
}
