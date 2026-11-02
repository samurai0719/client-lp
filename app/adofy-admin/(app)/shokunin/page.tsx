import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { formatJst } from "@/lib/saiyoRescue/leads";
import { SHOKUNIN_STATUSES, SHOKUNIN_STATUS_LABEL, SHOKUNIN_STATUS_STYLE, ageOf, type ShokuninRow } from "@/lib/shokuninCandidates/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "職人登録｜adofy 管理画面" };

/** 職人（/shokunin-entry の登録者）の一覧。氏名・電話・メール・地域・職種で検索できる */
export default async function ShokuninPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();
  const { status, q } = await searchParams;

  const { data, error } = await auth.db.from("shokunin_candidates").select("*").order("created_at", { ascending: false }).limit(3000);
  const all = (data ?? []) as ShokuninRow[];
  const query = q?.trim().toLowerCase().replace(/[-\s]/g, "") ?? "";
  const rows = all.filter((r) => {
    if (status && r.status !== status) return false;
    if (!query) return true;
    return [r.name, r.phone, r.email, r.current_prefecture, r.current_city, r.desired_prefecture, r.desired_area, ...r.experienced_trades, ...r.desired_trades].some((v) =>
      v?.toLowerCase().replace(/[-\s]/g, "").includes(query),
    );
  });

  const href = (s?: string) => {
    const sp = new URLSearchParams();
    if (s) sp.set("status", s);
    if (q) sp.set("q", q);
    const qs = sp.toString();
    return `/adofy-admin/shokunin${qs ? `?${qs}` : ""}`;
  };

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <h1 className="mb-4 text-xl font-bold text-slate-900">職人登録</h1>

        {error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">職人の表を読み込めませんでした（migration 019 の適用を確認してください）。</p>}

        <form className="mb-3 flex gap-2" action="/adofy-admin/shokunin">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="氏名・電話・メール・地域・職種で検索" className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
          <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-bold text-white">検索</button>
        </form>

        <div className="mb-4 flex flex-wrap gap-2 text-sm">
          <FilterLink href={href()} active={!status} label={`すべて ${all.length}`} />
          {SHOKUNIN_STATUSES.map((s) => (
            <FilterLink key={s} href={href(s)} active={status === s} label={`${SHOKUNIN_STATUS_LABEL[s]} ${all.filter((r) => r.status === s).length}`} />
          ))}
        </div>

        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 py-14 text-center text-sm text-slate-500">該当する職人はいません。</p>
        ) : (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {rows.map((r) => (
              <li key={r.id}>
                <Link href={`/adofy-admin/shokunin/${r.id}`} className="flex min-w-0 items-center gap-3 p-3 hover:bg-slate-50 sm:p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900">
                      {r.name}
                      <span className="ml-2 text-xs font-normal text-slate-500">{ageOf(r.birth_year)}歳</span>
                    </p>
                    <p className="truncate text-sm text-slate-700">
                      {[r.current_prefecture, r.experienced_trades.join("・"), r.experience_years, r.desired_salary].join("／")}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      登録 {formatJst(r.created_at)}・{r.phone}・{r.desired_timing}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${SHOKUNIN_STATUS_STYLE[r.status] ?? "bg-slate-100"}`}>
                    {SHOKUNIN_STATUS_LABEL[r.status] ?? r.status}
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

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link href={href} className={`rounded-lg px-3 py-1.5 font-bold ${active ? "bg-[#0a1f4e] text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}>
      {label}
    </Link>
  );
}
