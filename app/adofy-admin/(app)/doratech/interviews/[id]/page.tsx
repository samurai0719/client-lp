import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { formatJst } from "@/lib/saiyoRescue/leads";
import { STATUS_LABEL } from "@/lib/driverScout/requests";
import { REQUEST_STATUS_STYLE } from "@/lib/driverScout/adminStyle";
import { statusUrl, type RequestRow } from "@/lib/driverScout/requestsDb";
import RequestEditor from "./RequestEditor";
import OutcomeEditor from "./OutcomeEditor";
import DoratechNav from "@/components/doratech-admin/DoratechNav";
import { MIGRATION_017_MESSAGE } from "@/lib/driverCandidates/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "ドラテク 面接希望の詳細｜adofy 管理画面" };

type Candidate = {
  full_name: string | null;
  phone: string | null;
  email: string | null;
  age_band: string | null;
  desired_prefecture: string | null;
  desired_area: string | null;
  licenses: string[] | null;
  experience: string | null;
  status: string;
  is_test?: boolean;
};

/**
 * 面接希望1件。運営が求職者へ連絡するための情報（氏名・電話番号）はこの管理画面にだけ出す。
 * 企業向けの受付状況ページには、求職者の氏名・連絡先を出さない。
 */
export default async function InterviewRequestDetail({ params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();
  const { id } = await params;

  const { data } = await auth.db.from("scout_interview_requests").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const r = data as RequestRow;

  const [{ data: cand }, company] = await Promise.all([
    auth.db
      .from("driver_candidates")
      .select("full_name, phone, email, age_band, desired_prefecture, desired_area, licenses, experience, status, is_test")
      .eq("id", r.candidate_id)
      .maybeSingle(),
    r.company_inquiry_id
      ? auth.db.from("driver_company_inquiries").select("contracted_at").eq("id", r.company_inquiry_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const c = cand as Candidate | null;
  const contracted = Boolean((company.data as { contracted_at?: string | null } | null)?.contracted_at);

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <DoratechNav current="interviews" />
        <Link href="/adofy-admin/doratech/interviews" className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800">
          <ChevronLeft className="h-4 w-4" />
          面接希望の一覧
        </Link>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">
            {r.company_name} → 求職者 No.{r.candidate_no}
          </h1>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${REQUEST_STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Box title="依頼した企業">
            <Row k="会社名" v={r.company_name} />
            <Row k="担当者" v={`${r.contact_name} 様`} />
            <Row k="電話番号" v={r.phone} />
            <Row k="メール" v={r.email} />
            <Row k="所在地" v={`${r.prefecture ?? ""}${r.city ?? ""}`} />
            <Row k="契約" v={contracted ? "契約済み" : "未契約（サービス説明・契約の案内が必要）"} />
            {r.company_inquiry_id && (
              <Link href={`/adofy-admin/doratech/companies/${r.company_inquiry_id}`} className="mt-2 inline-block text-sm font-bold text-blue-700 hover:underline">
                企業の詳細を開く（契約・メモ）
              </Link>
            )}
            <Row k="受付" v={formatJst(r.created_at)} />
            <Row k="受付状況ページ" v={statusUrl(r.public_token)} />
          </Box>

          <Box title="求職者（運営の連絡用。企業には表示しない）">
            {c ? (
              <>
                <Row k="氏名" v={c.full_name ?? "—"} />
                <Row k="電話番号" v={c.phone ?? "—"} />
                <Row k="メール" v={c.email ?? "—"} />
                <Row k="年代・希望勤務地" v={`${c.age_band ?? ""} ${c.desired_prefecture ?? ""}${c.desired_area ? ` ${c.desired_area}` : ""}`} />
                <Row k="免許・経験" v={`${(c.licenses ?? []).join("・")} ／ ${c.experience ?? ""}`} />
                <Row k="公開状態" v={`${c.status}${c.is_test ? "（テスト用）" : ""}`} />
                <Link href={`/adofy-admin/doratech/candidates/${r.candidate_id}`} className="mt-2 inline-block text-sm font-bold text-blue-700 hover:underline">
                  求職者の詳細を開く
                </Link>
              </>
            ) : (
              <p className="text-sm text-slate-500">求職者の情報を読み込めませんでした。</p>
            )}
          </Box>

          <Box title="企業が入力した依頼内容">
            <Row k="仕事内容" v={r.job_description} pre />
            <Row k="確認したいこと" v={r.questions ?? "（記入なし）"} pre />
          </Box>

          <div className="lg:row-span-2">
            <RequestEditor
              id={r.id}
              initial={{
                status: r.status,
                candidateAnswers: r.candidate_answers ?? "",
                candidateAvailableTimes: r.candidate_available_times ?? "",
                companyAvailableTimes: r.company_available_times ?? "",
                interviewAt: r.interview_at,
                interviewPlace: r.interview_place ?? "",
                staffMemo: r.staff_memo ?? "",
                contracted,
                notifiedStatus: r.company_notified_status,
              }}
              hasCompany={Boolean(r.company_inquiry_id)}
            />
          </div>

          <OutcomeEditor
            id={r.id}
            disabled={"outcome" in r ? undefined : MIGRATION_017_MESSAGE}
            initial={{
              outcome: r.outcome ?? "",
              hiredAt: r.hired_at ?? "",
              joinedAt: r.joined_at ?? "",
              annualSalary: r.annual_salary != null ? String(r.annual_salary) : "",
              feeAmount: r.fee_amount != null ? String(r.fee_amount) : "",
              invoicedAt: r.invoiced_at ?? "",
              paidAt: r.paid_at ?? "",
              billingMemo: r.billing_memo ?? "",
            }}
          />
        </div>
      </div>
    </AdofyAdminShell>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-2 text-sm font-black text-slate-700">{title}</h2>
      <dl className="divide-y divide-slate-100">{children}</dl>
    </section>
  );
}

function Row({ k, v, pre = false }: { k: string; v: string; pre?: boolean }) {
  return (
    <div className="grid grid-cols-[7.5em_1fr] gap-3 py-2 text-sm">
      <dt className="font-bold text-slate-500">{k}</dt>
      <dd className={`min-w-0 break-words text-slate-900 ${pre ? "whitespace-pre-wrap" : ""}`}>{v}</dd>
    </div>
  );
}
