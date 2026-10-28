import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import DoratechNav from "@/components/doratech-admin/DoratechNav";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { formatJst } from "@/lib/saiyoRescue/leads";
import { REQUEST_STATUSES, STATUS_LABEL, type RequestStatus } from "@/lib/driverScout/requests";
import { REQUEST_STATUS_STYLE } from "@/lib/driverScout/adminStyle";

export const dynamic = "force-dynamic";
export const metadata = { title: "ドラテク 面接希望｜adofy 管理画面" };

/** 企業からの「この方と面接を希望する」依頼の一覧（新しい順） */
export default async function InterviewRequestsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();
  const { status } = await searchParams;

  const { data, error } = await auth.db
    .from("scout_interview_requests")
    .select("id, candidate_no, company_name, contact_name, status, interview_at, created_at")
    .order("created_at", { ascending: false })
    .limit(1000);
  const all = (data ?? []) as { id: string; candidate_no: string; company_name: string; contact_name: string; status: RequestStatus; interview_at: string | null; created_at: string }[];
  const rows = status ? all.filter((r) => r.status === status) : all;
  const open = all.filter((r) => !["confirmed", "declined", "unreachable", "withdrawn"].includes(r.status)).length;

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <DoratechNav current="interviews" />
        <h1 className="mb-4 text-xl font-bold text-slate-900">面接希望（連絡・日程調整の依頼）</h1>

        {error && (
          <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            依頼の表がまだありません。Supabase の SQL Editor で supabase/migrations/016_scout_interview_requests.sql を実行してください。
          </p>
        )}

        <p className="mb-4 text-sm text-slate-600">
          対応中 <b className="text-lg text-[#0a1f4e]">{open}</b> 件 ／ 全 {all.length} 件
        </p>

        <div className="mb-4 flex flex-wrap gap-2 text-sm">
          <FilterLink href="/adofy-admin/doratech/interviews" active={!status} label={`すべて ${all.length}`} />
          {REQUEST_STATUSES.map((s) => {
            const n = all.filter((r) => r.status === s).length;
            if (n === 0 && status !== s) return null;
            return <FilterLink key={s} href={`/adofy-admin/doratech/interviews?status=${s}`} active={status === s} label={`${STATUS_LABEL[s]} ${n}`} />;
          })}
        </div>

        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 py-14 text-center text-sm text-slate-500">{error ? "—" : "まだ依頼はありません。"}</p>
        ) : (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {rows.map((r) => (
              <li key={r.id}>
                <Link href={`/adofy-admin/doratech/interviews/${r.id}`} className="flex min-w-0 items-center gap-3 p-3 hover:bg-slate-50 sm:p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900">
                      {r.company_name}
                      <span className="ml-2 text-sm font-normal text-slate-500">{r.contact_name} 様</span>
                    </p>
                    <p className="text-sm text-slate-700">求職者 No.{r.candidate_no}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      受付 {formatJst(r.created_at)}
                      {r.interview_at && `・面接 ${formatJst(r.interview_at)}`}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${REQUEST_STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
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
