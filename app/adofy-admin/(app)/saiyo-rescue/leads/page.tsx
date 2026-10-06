import { notFound } from "next/navigation";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import LeadsList from "@/components/saiyo-rescue-admin/LeadsList";
import SaiyoNav from "@/components/saiyo-rescue-admin/SaiyoNav";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { LEADS_TABLE, type LeadRow } from "@/lib/saiyoRescue/leads";

export const dynamic = "force-dynamic";

export const metadata = { title: "採用レスキュー 問い合わせ一覧｜adofy 管理画面" };

export default async function SaiyoRescueLeadsPage() {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();

  const { data, error } = await auth.db.from(LEADS_TABLE).select("*").order("created_at", { ascending: false }).limit(2000);

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <SaiyoNav current="leads" />
        <h1 className="mb-4 text-xl font-bold text-slate-900">問い合わせ一覧</h1>
        {error ? (
          <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            データを読み込めませんでした。Supabase に <code>saiyo_rescue_leads</code> テーブル（migration 009）が作成されているか確認してください。
          </p>
        ) : (
          <LeadsList leads={(data ?? []) as LeadRow[]} />
        )}
      </div>
    </AdofyAdminShell>
  );
}
