import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import DoratechNav from "@/components/doratech-admin/DoratechNav";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { formatJst } from "@/lib/saiyoRescue/leads";
import {
  COMPANY_STATUSES,
  COMPANY_STATUS_LABEL,
  COMPANY_STATUS_STYLE,
  INQUIRY_TYPE_LABEL,
  type CompanyInquiryRow,
} from "@/lib/driverCandidates/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "ドラテク 企業｜adofy 管理画面" };

/** 企業からの申込み・問い合わせ（driver_company_inquiries）の一覧。面接希望の件数も並べる */
export default async function CompaniesPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();
  const { status, q } = await searchParams;

  const [{ data, error }, { data: reqData }] = await Promise.all([
    auth.db.from("driver_company_inquiries").select("*").order("created_at", { ascending: false }).limit(3000),
    auth.db.from("scout_interview_requests").select("company_inquiry_id").limit(5000),
  ]);
  const all = (data ?? []) as CompanyInquiryRow[];
  const requestCount = new Map<string, number>();
  for (const r of (reqData ?? []) as { company_inquiry_id: string | null }[]) {
    if (r.company_inquiry_id) requestCount.set(r.company_inquiry_id, (requestCount.get(r.company_inquiry_id) ?? 0) + 1);
  }
  const query = q?.trim().toLowerCase() ?? "";
  const rows = all.filter(
    (r) =>
      (!status || (status === "contracted" ? Boolean(r.contracted_at) : r.status === status)) &&
      (!query || [r.company_name, r.contact_name, r.email, r.phone, r.prefecture].some((v) => v?.toLowerCase().includes(query))),
  );

  const href = (s?: string) => {
    const sp = new URLSearchParams();
    if (s) sp.set("status", s);
    if (q) sp.set("q", q);
    const str = sp.toString();
    return `/adofy-admin/doratech/companies${str ? `?${str}` : ""}`;
  };

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <DoratechNav current="companies" />
        <h1 className="mb-4 text-xl font-bold text-slate-900">企業（申込み・問い合わせ）</h1>

        {error && <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">企業の表を読み込めませんでした（migration 007 の適用を確認してください）。</p>}

        <form className="mb-3 flex gap-2" action="/adofy-admin/doratech/companies">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="会社名・担当者・メール・電話・都道府県で検索" className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" />
          <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-bold text-white">検索</button>
        </form>

        <div className="mb-4 flex flex-wrap gap-2 text-sm">
          <FilterLink href={href()} active={!status} label={`すべて ${all.length}`} />
          <FilterLink href={href("contracted")} active={status === "contracted"} label={`契約済み ${all.filter((r) => r.contracted_at).length}`} />
          {COMPANY_STATUSES.map((s) => {
            const n = all.filter((r) => r.status === s).length;
            if (n === 0 && status !== s) return null;
            return <FilterLink key={s} href={href(s)} active={status === s} label={`${COMPANY_STATUS_LABEL[s]} ${n}`} />;
          })}
        </div>

        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 py-14 text-center text-sm text-slate-500">該当する企業はありません。</p>
        ) : (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {rows.map((r) => (
              <li key={r.id}>
                <Link href={`/adofy-admin/doratech/companies/${r.id}`} className="flex min-w-0 items-center gap-3 p-3 hover:bg-slate-50 sm:p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900">
                      {r.company_name}
                      <span className="ml-2 text-sm font-normal text-slate-500">{r.contact_name} 様</span>
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatJst(r.created_at)}・{r.prefecture}{r.address_city ?? ""}・{INQUIRY_TYPE_LABEL[r.inquiry_type ?? "job_posting"] ?? r.inquiry_type}
                      {requestCount.get(r.id) ? `・面接希望 ${requestCount.get(r.id)}件` : ""}
                    </p>
                  </div>
                  {r.contracted_at && <span className="shrink-0 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">契約済み</span>}
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${COMPANY_STATUS_STYLE[r.status] ?? "bg-slate-100"}`}>
                    {COMPANY_STATUS_LABEL[r.status] ?? r.status}
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
