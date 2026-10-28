import Link from "next/link";
import { notFound } from "next/navigation";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import DoratechNav from "@/components/doratech-admin/DoratechNav";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { formatJst } from "@/lib/saiyoRescue/leads";
import { STATUS_LABEL, type RequestStatus } from "@/lib/driverScout/requests";
import { REQUEST_STATUS_STYLE } from "@/lib/driverScout/adminStyle";
import {
  BILLING_LABEL,
  BILLING_STYLE,
  MIGRATION_017_MESSAGE,
  OUTCOME_LABEL,
  billingState,
  yen,
} from "@/lib/driverCandidates/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "ドラテク 成約・請求｜adofy 管理画面" };

type Req = {
  id: string;
  company_name: string;
  candidate_no: string;
  status: RequestStatus;
  interview_at: string | null;
  outcome?: string | null;
  hired_at?: string | null;
  joined_at?: string | null;
  annual_salary?: number | null;
  fee_amount?: number | null;
  invoiced_at?: string | null;
  paid_at?: string | null;
};

const VIEWS = {
  need_outcome: "結果の記録待ち",
  unbilled: "未請求",
  invoiced: "入金待ち",
  paid: "入金済み",
  all: "採用決定すべて",
} as const;
type View = keyof typeof VIEWS;

/**
 * 面接確定後の採用結果と、成功報酬の請求・入金の管理。
 * 金額の入力・変更は各面接希望の詳細画面（採用結果・成功報酬）で行う。
 */
export default async function BillingPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();
  const { view: rawView } = await searchParams;
  const view: View = rawView && rawView in VIEWS ? (rawView as View) : "need_outcome";

  const { data, error } = await auth.db.from("scout_interview_requests").select("*").order("created_at", { ascending: false }).limit(5000);
  const all = (data ?? []) as Req[];
  const migrated = all.length === 0 || "outcome" in all[0];
  const now = new Date().getTime();

  const filters: Record<View, (r: Req) => boolean> = {
    need_outcome: (r) => r.status === "confirmed" && !r.outcome && Boolean(r.interview_at) && new Date(r.interview_at!).getTime() < now,
    unbilled: (r) => billingState(r) === "unbilled",
    invoiced: (r) => billingState(r) === "invoiced",
    paid: (r) => billingState(r) === "paid",
    all: (r) => r.outcome === "hired",
  };
  const rows = all.filter(filters[view]);
  const sum = (f: (r: Req) => boolean) => all.filter(f).reduce((s, r) => s + (r.fee_amount ?? 0), 0);
  const year = new Date().getFullYear().toString();

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <DoratechNav current="billing" />
        <h1 className="mb-4 text-xl font-bold text-slate-900">成約・請求</h1>

        {(error || !migrated) && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{MIGRATION_017_MESSAGE}</p>}

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="未請求" value={yen(sum(filters.unbilled))} />
          <Stat label="入金待ち" value={yen(sum(filters.invoiced))} />
          <Stat label={`入金済み（${year}年）`} value={yen(sum((r) => Boolean(r.paid_at?.startsWith(year))))} />
          <Stat label="採用決定（累計）" value={`${all.filter(filters.all).length}人`} />
        </div>

        <div className="mb-4 flex flex-wrap gap-2 text-sm">
          {(Object.keys(VIEWS) as View[]).map((k) => (
            <Link
              key={k}
              href={`/adofy-admin/doratech/billing?view=${k}`}
              className={`rounded-lg px-3 py-1.5 font-bold ${view === k ? "bg-[#0a1f4e] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}
            >
              {VIEWS[k]} {all.filter(filters[k]).length}
            </Link>
          ))}
        </div>

        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 py-14 text-center text-sm text-slate-500">該当するものはありません。</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[44rem] text-sm">
              <thead className="bg-slate-50 text-left text-xs text-slate-500">
                <tr>
                  <th className="px-3 py-2">企業 × 求職者</th>
                  <th className="px-3 py-2">面接</th>
                  <th className="px-3 py-2">結果</th>
                  <th className="px-3 py-2 text-right">想定年収</th>
                  <th className="px-3 py-2 text-right">成功報酬</th>
                  <th className="px-3 py-2">請求・入金</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => {
                  const b = billingState(r);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2">
                        <Link href={`/adofy-admin/doratech/interviews/${r.id}#outcome`} className="font-bold text-blue-700 hover:underline">
                          {r.company_name} × No.{r.candidate_no}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <span className={`rounded-full px-2 py-0.5 font-bold ${REQUEST_STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
                        <span className="ml-1 text-slate-500">{formatJst(r.interview_at, false)}</span>
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {r.outcome ? OUTCOME_LABEL[r.outcome] : "未記録"}
                        {r.hired_at && <span className="block text-slate-500">決定 {r.hired_at}</span>}
                        {r.joined_at && <span className="block text-slate-500">入社 {r.joined_at}</span>}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{yen(r.annual_salary)}</td>
                      <td className="px-3 py-2 text-right font-bold tabular-nums">{yen(r.fee_amount)}</td>
                      <td className="px-3 py-2 text-xs">
                        {b !== "none" && <span className={`rounded-full px-2 py-0.5 font-bold ${BILLING_STYLE[b]}`}>{BILLING_LABEL[b]}</span>}
                        {r.invoiced_at && <span className="block text-slate-500">請求 {r.invoiced_at}</span>}
                        {r.paid_at && <span className="block text-slate-500">入金 {r.paid_at}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdofyAdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-black tabular-nums text-[#0a1f4e]">{value}</p>
    </div>
  );
}
