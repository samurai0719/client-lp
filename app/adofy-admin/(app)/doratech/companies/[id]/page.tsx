import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import DoratechNav from "@/components/doratech-admin/DoratechNav";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { formatJst } from "@/lib/saiyoRescue/leads";
import { STATUS_LABEL, type RequestStatus } from "@/lib/driverScout/requests";
import { REQUEST_STATUS_STYLE } from "@/lib/driverScout/adminStyle";
import { JOB_TYPE_LABELS, HIRING_COUNT_LABELS } from "@/lib/types/driverCompanyInquiry";
import {
  BILLING_LABEL,
  BILLING_STYLE,
  COMPANY_STATUS_LABEL,
  COMPANY_STATUS_STYLE,
  INQUIRY_TYPE_LABEL,
  billingState,
  yen,
  type CompanyInquiryRow,
} from "@/lib/driverCandidates/admin";
import CompanyEditor from "./CompanyEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "ドラテク 企業の詳細｜adofy 管理画面" };

type Req = {
  id: string;
  candidate_no: string;
  status: RequestStatus;
  created_at: string;
  outcome?: string | null;
  fee_amount?: number | null;
  invoiced_at?: string | null;
  paid_at?: string | null;
};

/** 企業1社。申込み内容・この企業からの面接希望と成約・運営の対応 */
export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();
  const { id } = await params;

  const { data } = await auth.db.from("driver_company_inquiries").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const c = data as CompanyInquiryRow;

  // 依頼は company_inquiry_id で結びつく。結びついていない古い依頼もメールで拾う
  const { data: reqData } = await auth.db
    .from("scout_interview_requests")
    .select("*")
    .or(`company_inquiry_id.eq.${c.id},email.eq."${c.email.replace(/"/g, "")}"`)
    .order("created_at", { ascending: false });
  const requests = (reqData ?? []) as Req[];
  const feeTotal = requests.filter((r) => r.outcome === "hired").reduce((s, r) => s + (r.fee_amount ?? 0), 0);

  const jobTypes = (c.job_types ?? []).map((t) => JOB_TYPE_LABELS[t] ?? t);

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <DoratechNav current="companies" />
        <Link href="/adofy-admin/doratech/companies" className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800">
          <ChevronLeft className="h-4 w-4" />
          企業の一覧
        </Link>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">{c.company_name}</h1>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${COMPANY_STATUS_STYLE[c.status] ?? "bg-slate-100"}`}>{COMPANY_STATUS_LABEL[c.status] ?? c.status}</span>
          {c.contracted_at && <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">契約済み {formatJst(c.contracted_at, false)}</span>}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-2 text-sm font-black text-slate-700">申込み内容</h2>
            <dl className="divide-y divide-slate-100">
              <Row k="種別" v={INQUIRY_TYPE_LABEL[c.inquiry_type ?? "job_posting"] ?? c.inquiry_type ?? ""} />
              <Row k="担当者" v={`${c.contact_name} 様`} />
              <Row k="電話番号" v={c.phone} />
              <Row k="メール" v={c.email} />
              <Row k="所在地" v={`${c.prefecture}${c.address_city ?? ""}`} />
              {jobTypes.length > 0 && <Row k="募集職種" v={[...jobTypes, c.job_type_other].filter(Boolean).join("・")} />}
              {(c.licenses?.length ?? 0) > 0 && <Row k="必要な免許" v={c.licenses!.join("・")} />}
              {c.hiring_count && <Row k="採用人数" v={HIRING_COUNT_LABELS[c.hiring_count] ?? c.hiring_count} />}
              {c.hiring_timing && <Row k="採用時期" v={c.hiring_timing} />}
              {c.fleet_description && <Row k="車両など" v={c.fleet_description} pre />}
              {c.message && <Row k="備考" v={c.message} pre />}
              <Row k="受付" v={formatJst(c.created_at)} />
              <Row k="流入" v={[c.utm_source, c.utm_campaign, c.landing_page].filter(Boolean).join(" / ") || "—"} />
            </dl>
          </section>

          <div className="grid content-start gap-4">
            <CompanyEditor id={c.id} initial={{ status: c.status, contracted: Boolean(c.contracted_at), staffMemo: c.staff_memo ?? "" }} />

            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="mb-2 flex items-baseline justify-between text-sm font-black text-slate-700">
                面接希望・成約
                {feeTotal > 0 && <span className="text-xs text-slate-500">成功報酬 計 {yen(feeTotal)}</span>}
              </h2>
              {requests.length === 0 ? (
                <p className="text-sm text-slate-400">まだありません。</p>
              ) : (
                <ul className="divide-y divide-slate-100 text-sm">
                  {requests.map((r) => {
                    const b = billingState(r);
                    return (
                      <li key={r.id}>
                        <Link href={`/adofy-admin/doratech/interviews/${r.id}`} className="flex flex-wrap items-center gap-2 py-2 hover:bg-slate-50">
                          <span className="font-bold text-slate-900">No.{r.candidate_no}</span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${REQUEST_STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
                          {b !== "none" && <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${BILLING_STYLE[b]}`}>{BILLING_LABEL[b]} {yen(r.fee_amount)}</span>}
                          <span className="ml-auto text-xs text-slate-500">{formatJst(r.created_at, false)}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </AdofyAdminShell>
  );
}

function Row({ k, v, pre = false }: { k: string; v: string; pre?: boolean }) {
  return (
    <div className="grid grid-cols-[7em_1fr] gap-3 py-2 text-sm">
      <dt className="font-bold text-slate-500">{k}</dt>
      <dd className={`min-w-0 break-words text-slate-900 ${pre ? "whitespace-pre-wrap" : ""}`}>{v}</dd>
    </div>
  );
}
