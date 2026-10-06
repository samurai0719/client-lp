import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, CalendarClock, ChevronRight, Phone } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import CountUp from "@/components/saiyo-rescue-admin/CountUp";
import SaiyoNav from "@/components/saiyo-rescue-admin/SaiyoNav";
import { SourceBadge, StatusBadge } from "@/components/saiyo-rescue-admin/Badges";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import {
  LEADS_TABLE,
  SOURCE_LABEL,
  classifySource,
  formatJst,
  jstDateKey,
  jstMonthKey,
  type LeadRow,
} from "@/lib/saiyoRescue/leads";

export const dynamic = "force-dynamic";

export const metadata = { title: "採用レスキュー ダッシュボード｜adofy 管理画面" };

export default async function SaiyoRescueDashboard() {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();

  const { data, error } = await auth.db.from(LEADS_TABLE).select("*").order("created_at", { ascending: false }).limit(5000);
  const rows = (data ?? []) as LeadRow[];

  const now = new Date();
  const today = jstDateKey(now);
  const month = jstMonthKey(now);

  const thisMonth = rows.filter((r) => jstMonthKey(r.created_at) === month).length;
  const todayCount = rows.filter((r) => jstDateKey(r.created_at) === today).length;
  const untouched = rows.filter((r) => r.status === "new" || r.status === "untouched").length;
  const meetings = rows.filter((r) => r.status === "meeting_scheduled").length;
  const won = rows.filter((r) => r.status === "won").length;
  const winRate = rows.length > 0 ? Math.round((won / rows.length) * 1000) / 10 : 0;

  const closedStatuses = ["won", "lost"];
  const due = rows
    .filter((r) => r.next_contact_at && !closedStatuses.includes(r.status))
    .sort((a, b) => (a.next_contact_at ?? "").localeCompare(b.next_contact_at ?? ""));
  const dueToday = due.filter((r) => jstDateKey(r.next_contact_at!) === today);
  const overdue = due.filter((r) => jstDateKey(r.next_contact_at!) < today);
  const latest = rows.slice(0, 5);

  const bySource = new Map<string, number>();
  for (const r of rows.filter((x) => jstMonthKey(x.created_at) === month)) {
    const k = SOURCE_LABEL[classifySource(r)];
    bySource.set(k, (bySource.get(k) ?? 0) + 1);
  }

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <SaiyoNav current="dashboard" />
        <h1 className="mb-4 text-xl font-bold text-slate-900">ダッシュボード</h1>

        {error && (
          <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            データを読み込めませんでした。Supabase に <code>saiyo_rescue_leads</code> テーブル（migration 009）が作成されているか確認してください。
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
          <Stat label="今月の問い合わせ" value={thisMonth} unit="件" />
          <Stat label="本日の問い合わせ" value={todayCount} unit="件" />
          <Stat label="未対応" value={untouched} unit="件" alert={untouched > 0} sub="新規＋未対応" />
          <Stat label="商談予定" value={meetings} unit="件" />
          <Stat label="契約" value={won} unit="件" />
          <Stat label="成約率" value={winRate} unit="%" sub={`全${rows.length}件中 契約${won}件`} decimal />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900">
              <CalendarClock className="h-5 w-5 text-amber-600" />
              本日対応予定
              <span className="rounded-full bg-amber-100 px-2 text-sm text-amber-800">{dueToday.length}</span>
            </h2>
            {overdue.length > 0 && (
              <div className="mb-3 rounded-lg bg-rose-50 p-3">
                <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-rose-700">
                  <AlertTriangle className="h-4 w-4" />
                  期限切れ {overdue.length}件
                </p>
                <DueList rows={overdue} />
              </div>
            )}
            {dueToday.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">本日の対応予定はありません。</p>
            ) : (
              <DueList rows={dueToday} />
            )}
          </section>

          <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-3 flex items-center justify-between text-base font-bold text-slate-900">
              新着の問い合わせ
              <Link href="/adofy-admin/saiyo-rescue/leads" className="inline-flex items-center text-sm text-blue-700">
                一覧へ <ChevronRight className="h-4 w-4" />
              </Link>
            </h2>
            {latest.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">まだ問い合わせがありません。</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {latest.map((r) => (
                  <li key={r.id}>
                    <Link href={`/adofy-admin/saiyo-rescue/leads/${r.id}`} className="flex min-w-0 items-center gap-2 py-2.5 hover:bg-slate-50">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-slate-900">{r.company_name}</p>
                        <p className="text-xs text-slate-500">
                          {formatJst(r.created_at)}・{r.job_type}・{r.prefecture}
                        </p>
                      </div>
                      <SourceBadge lead={r} />
                      <StatusBadge status={r.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {bySource.size > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="mb-2 text-xs font-bold text-slate-500">今月の流入元</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {[...bySource.entries()]
                    .sort((a, b) => b[1] - a[1])
                    .map(([k, v]) => (
                      <span key={k} className="rounded-lg bg-slate-100 px-2.5 py-1 font-bold text-slate-700">
                        {k} {v}件
                      </span>
                    ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </AdofyAdminShell>
  );
}

function Stat({
  label,
  value,
  unit,
  sub,
  alert = false,
  decimal = false,
}: {
  label: string;
  value: number;
  unit: string;
  sub?: string;
  alert?: boolean;
  decimal?: boolean;
}) {
  return (
    <div className={`rounded-xl border bg-white p-4 ${alert ? "border-rose-300" : "border-slate-200"}`}>
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-black ${alert ? "text-rose-600" : "text-[#0a1f4e]"}`}>
        {decimal ? <span className="tabular-nums">{value}</span> : <CountUp value={value} />}
        <span className="ml-0.5 text-base font-bold">{unit}</span>
      </p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

function DueList({ rows }: { rows: LeadRow[] }) {
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.id} className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-100 bg-white p-2.5">
          <Link href={`/adofy-admin/saiyo-rescue/leads/${r.id}`} className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">{r.company_name}</p>
            <p className="text-xs text-slate-500">
              {formatJst(r.next_contact_at)}・{r.contact_name} 様
            </p>
          </Link>
          <StatusBadge status={r.status} />
          <a href={`tel:${r.phone}`} aria-label={`${r.company_name}に電話`} className="rounded-lg bg-blue-600 p-2 text-white">
            <Phone className="h-4 w-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
