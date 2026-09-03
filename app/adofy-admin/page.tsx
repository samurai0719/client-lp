import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox, TrendingUp } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdofyAccess } from "@/lib/auth/adofyCheck";
import { CONSULTATION_LABELS as L, STATUS_LABELS } from "./consultations/_lib/labels";

export const dynamic = "force-dynamic";

type Row = {
  status: string;
  selected_plan: string | null;
  utm_source: string | null;
  referrer: string | null;
  industries: string[];
  created_at: string;
};

export default async function AdofyDashboardPage() {
  const supabase = await createClient();
  const access = await requireAdofyAccess(supabase);
  if (!access) redirect("/admin/login");

  const db = createAdminClient();
  const { data } = await db
    .from("consultations")
    .select("status, selected_plan, utm_source, referrer, industries, created_at");

  const rows = (data ?? []) as Row[];
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const count = (fn: (r: Row) => boolean) => rows.filter(fn).length;
  const thisMonth = count((r) => new Date(r.created_at) >= monthStart);
  const lastMonth = count((r) => {
    const t = new Date(r.created_at);
    return t >= prevStart && t < monthStart;
  });
  const untouched = count((r) => r.status === "new");
  const won = count((r) => r.status === "won");
  const closed = won + count((r) => r.status === "lost");
  const winRate = closed > 0 ? Math.round((won / closed) * 100) : null;

  const tally = (key: (r: Row) => string | null) => {
    const m = new Map<string, number>();
    for (const r of rows) {
      const k = key(r);
      if (k) m.set(k, (m.get(k) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };

  const byPlan = tally((r) => r.selected_plan);
  const bySource = tally((r) => r.utm_source ?? (r.referrer ? "その他サイト経由" : "直接アクセス"));
  const byStatus = tally((r) => r.status);
  const industryMap = new Map<string, number>();
  for (const r of rows) for (const i of r.industries ?? []) industryMap.set(i, (industryMap.get(i) ?? 0) + 1);
  const byIndustry = [...industryMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <h1 className="mb-1 text-xl font-bold text-slate-900">ダッシュボード</h1>
        <p className="mb-5 text-sm text-slate-500">無料相談の状況をまとめて確認できます。</p>

        {/* 主要な数字 */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat
            label="今月の相談"
            value={thisMonth}
            unit="件"
            sub={`先月 ${lastMonth}件`}
            trend={lastMonth === 0 ? null : thisMonth - lastMonth}
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <Stat
            label="未対応"
            value={untouched}
            unit="件"
            sub={untouched > 0 ? "早めに連絡しましょう" : "すべて対応済み"}
            highlight={untouched > 0}
            icon={<Inbox className="h-4 w-4" />}
          />
          <Stat label="受注" value={won} unit="件" sub={`累計 ${rows.length}件中`} />
          <Stat
            label="受注率"
            value={winRate ?? "—"}
            unit={winRate === null ? "" : "%"}
            sub={closed > 0 ? `決着した ${closed}件のうち` : "まだ決着した案件がありません"}
          />
        </div>

        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
            <p className="text-sm text-slate-500">まだ相談が届いていません。</p>
            <p className="mt-1 text-xs text-slate-400">
              相談が入るとここに集計が表示されます。
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <Breakdown title="対応状況" rows={byStatus} labels={STATUS_LABELS} total={rows.length} />
            <Breakdown title="流入元" rows={bySource} total={rows.length} />
            <Breakdown title="希望プラン" rows={byPlan} labels={L.plan} total={rows.length} />
            <Breakdown title="業種（上位6件）" rows={byIndustry} labels={L.industry} total={rows.length} />
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/adofy-admin/consultations"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-bold text-white"
          >
            相談一覧を見る
          </Link>
        </div>
      </div>
    </AdofyAdminShell>
  );
}

function Stat({
  label, value, unit, sub, trend, highlight, icon,
}: {
  label: string;
  value: number | string;
  unit?: string;
  sub?: string;
  trend?: number | null;
  highlight?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight ? "border-orange-300 bg-orange-50" : "border-slate-200 bg-white"
      }`}
    >
      <p className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
        {icon}
        {label}
      </p>
      <p className="mt-1.5 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        {unit && <span className="text-sm font-bold text-slate-500">{unit}</span>}
        {typeof trend === "number" && trend !== 0 && (
          <span
            className={`ml-1 text-xs font-bold ${
              trend > 0 ? "text-emerald-700" : "text-slate-500"
            }`}
          >
            {trend > 0 ? `+${trend}` : trend}
          </span>
        )}
      </p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

/** 内訳。色だけでなく件数と割合の数字でも読めるようにする */
function Breakdown({
  title, rows, labels, total,
}: {
  title: string;
  rows: [string, number][];
  labels?: Record<string, string>;
  total: number;
}) {
  if (rows.length === 0) return null;
  const max = Math.max(...rows.map(([, v]) => v));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-bold text-slate-900">{title}</h2>
      <ul className="space-y-2.5">
        {rows.map(([key, value]) => (
          <li key={key}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
              <span className="truncate font-semibold text-slate-700">
                {labels?.[key] ?? key}
              </span>
              <span className="flex-none tabular-nums text-slate-500">
                {value}件（{Math.round((value / total) * 100)}%）
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#f26a1b]"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
