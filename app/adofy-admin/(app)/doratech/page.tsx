import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { formatJst, jstMonthKey } from "@/lib/saiyoRescue/leads";
import {
  MISSING_TABLE_MESSAGE,
  POSTING_STATUS_LABEL,
  POSTING_STATUS_STYLE,
  formatSalary,
  type PostingRow,
} from "@/lib/driverCompany/admin";

export const dynamic = "force-dynamic";

export const metadata = { title: "ドラテク 求人登録一覧｜adofy 管理画面" };

/**
 * ドラテク企業向けLP（/company）→ 求人登録フォーム（/company/register）から
 * 登録された企業と求人の一覧。新しい登録順に並べる。
 */
export default async function DoratechPostingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();

  const { status } = await searchParams;

  const { data, error } = await auth.db
    .from("driver_job_postings")
    .select("*, driver_companies(*)")
    .order("created_at", { ascending: false })
    .limit(2000);

  const all = (data ?? []) as PostingRow[];
  const rows = status ? all.filter((r) => r.status === status) : all;

  const month = jstMonthKey(new Date());
  const companies = new Set(all.map((r) => r.company_id)).size;
  const thisMonth = all.filter((r) => jstMonthKey(r.created_at) === month).length;
  const published = all.filter((r) => r.status === "published").length;
  const pending = all.filter((r) => r.status === "pending_verification").length;

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-black text-amber-800">ドラテク</span>
          <h1 className="text-xl font-bold text-slate-900">企業・求人登録</h1>
        </div>

        {error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{MISSING_TABLE_MESSAGE}</p>}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Stat label="登録企業" value={companies} unit="社" />
          <Stat label="求人" value={all.length} unit="件" />
          <Stat label="今月の求人登録" value={thisMonth} unit="件" />
          <Stat label="掲載中" value={published} unit="件" />
          <Stat label="メール認証待ち" value={pending} unit="件" alert={pending > 0} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <Filter href="/adofy-admin/doratech" active={!status} label={`すべて ${all.length}`} />
          {Object.entries(POSTING_STATUS_LABEL).map(([key, label]) => {
            const n = all.filter((r) => r.status === key).length;
            if (n === 0 && status !== key) return null;
            return <Filter key={key} href={`/adofy-admin/doratech?status=${key}`} active={status === key} label={`${label} ${n}`} />;
          })}
        </div>

        {rows.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-300 py-14 text-center text-sm text-slate-500">
            {error ? "—" : "まだ求人登録がありません。"}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {rows.map((r) => (
              <li key={r.id}>
                <Link href={`/adofy-admin/doratech/${r.id}`} className="flex min-w-0 items-center gap-3 p-3 hover:bg-slate-50 sm:p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900">{r.driver_companies?.company_name ?? "（企業情報なし）"}</p>
                    <p className="truncate text-sm text-slate-700">{r.job_title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatJst(r.created_at)}・{r.work_prefecture}・{formatSalary(r)}・募集{r.hiring_count}
                    </p>
                    {r.job_types?.length > 0 && (
                      <p className="mt-1 flex flex-wrap gap-1">
                        {r.job_types.map((t) => (
                          <span key={t} className="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-bold text-blue-700">
                            {t}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${POSTING_STATUS_STYLE[r.status] ?? "bg-slate-100 text-slate-600"}`}>
                    {POSTING_STATUS_LABEL[r.status] ?? r.status}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdofyAdminShell>
  );
}

function Stat({ label, value, unit, alert = false }: { label: string; value: number; unit: string; alert?: boolean }) {
  return (
    <div className={`rounded-xl border bg-white p-4 ${alert ? "border-amber-300" : "border-slate-200"}`}>
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-black ${alert ? "text-amber-600" : "text-[#0a1f4e]"}`}>
        <span className="tabular-nums">{value}</span>
        <span className="ml-0.5 text-base font-bold">{unit}</span>
      </p>
    </div>
  );
}

function Filter({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 font-bold ${active ? "bg-[#0a1f4e] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}
    >
      {label}
    </Link>
  );
}
