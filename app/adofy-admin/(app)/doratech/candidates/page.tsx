import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Plus } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import DoratechNav from "@/components/doratech-admin/DoratechNav";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { formatJst } from "@/lib/saiyoRescue/leads";
import { candidateNo } from "@/lib/driverCandidates/candidateNo";
import {
  CANDIDATE_STATUSES,
  CANDIDATE_STATUS_LABEL,
  CANDIDATE_STATUS_STYLE,
  SOURCE_LABEL,
  type CandidateRow,
} from "@/lib/driverCandidates/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "ドラテク 求職者｜adofy 管理画面" };

/** 求職者の一覧。氏名・電話・メール・番号で検索できる。テスト用は「テストも表示」のときだけ出す */
export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; test?: string }>;
}) {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();
  const { status, q, test } = await searchParams;

  const { data, error } = await auth.db.from("driver_candidates").select("*").order("created_at", { ascending: false }).limit(3000);
  const withTest = test === "1";
  const all = ((data ?? []) as CandidateRow[]).filter((r) => withTest || !r.is_test);
  const query = q?.trim().toLowerCase().replace(/[-\s]/g, "") ?? "";
  const rows = all.filter((r) => {
    if (status && r.status !== status) return false;
    if (!query) return true;
    return [r.full_name, r.phone, r.email, candidateNo(r.id), r.desired_prefecture, r.desired_area]
      .some((v) => v?.toLowerCase().replace(/[-\s]/g, "").includes(query));
  });

  const href = (p: { status?: string }) => {
    const sp = new URLSearchParams();
    if (p.status) sp.set("status", p.status);
    if (q) sp.set("q", q);
    if (withTest) sp.set("test", "1");
    const s = sp.toString();
    return `/adofy-admin/doratech/candidates${s ? `?${s}` : ""}`;
  };

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <DoratechNav current="candidates" />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">求職者</h1>
          <Link
            href="/adofy-admin/doratech/candidates/new"
            className="ml-auto inline-flex items-center gap-1 rounded-lg bg-[#0a1f4e] px-3 py-2 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" />
            求職者を登録
          </Link>
        </div>

        {error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">求職者の表を読み込めませんでした（migration 015 の適用を確認してください）。</p>}

        <form className="mb-3 flex flex-wrap gap-2" action="/adofy-admin/doratech/candidates">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="氏名・電話・メール・番号・地域で検索"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-1.5 text-sm text-slate-600">
            <input type="checkbox" name="test" value="1" defaultChecked={withTest} />
            テストも表示
          </label>
          <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-bold text-white">検索</button>
        </form>

        <div className="mb-4 flex flex-wrap gap-2 text-sm">
          <FilterLink href={href({})} active={!status} label={`すべて ${all.length}`} />
          {CANDIDATE_STATUSES.map((s) => (
            <FilterLink key={s} href={href({ status: s })} active={status === s} label={`${CANDIDATE_STATUS_LABEL[s]} ${all.filter((r) => r.status === s).length}`} />
          ))}
        </div>

        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 py-14 text-center text-sm text-slate-500">該当する求職者はいません。</p>
        ) : (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {rows.map((r) => (
              <li key={r.id}>
                <Link href={`/adofy-admin/doratech/candidates/${r.id}`} className="flex min-w-0 items-center gap-3 p-3 hover:bg-slate-50 sm:p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900">
                      {r.full_name || "（氏名未登録）"}
                      <span className="ml-2 text-xs font-normal text-slate-500">No.{candidateNo(r.id)}</span>
                      {r.is_test && <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-[11px] text-slate-600">テスト</span>}
                    </p>
                    <p className="truncate text-sm text-slate-700">
                      {[r.age_band, [r.desired_prefecture, r.desired_area].filter(Boolean).join(" "), (r.licenses ?? []).join("・"), r.experience]
                        .filter(Boolean)
                        .join("／") || "プロフィール未入力"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      登録 {formatJst(r.created_at)}・{SOURCE_LABEL[r.source ?? ""] ?? r.source ?? "経路不明"}
                      {r.phone && `・${r.phone}`}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${CANDIDATE_STATUS_STYLE[r.status] ?? "bg-slate-100"}`}>
                    {CANDIDATE_STATUS_LABEL[r.status] ?? r.status}
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
