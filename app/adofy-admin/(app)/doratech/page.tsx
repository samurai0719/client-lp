import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, CalendarClock, ChevronRight } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import DoratechNav from "@/components/doratech-admin/DoratechNav";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { formatJst, jstMonthKey } from "@/lib/saiyoRescue/leads";
import { STATUS_LABEL, type RequestStatus } from "@/lib/driverScout/requests";
import { REQUEST_STATUS_STYLE } from "@/lib/driverScout/adminStyle";
import {
  CANDIDATE_STATUSES,
  CANDIDATE_STATUS_LABEL,
  billingState,
  yen,
  type CandidateStatus,
  type CompanyStatus,
} from "@/lib/driverCandidates/admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "ドラテク管理｜adofy 管理画面" };

type Cand = { status: CandidateStatus; is_test?: boolean; created_at: string };
type Company = { status: CompanyStatus; contracted_at?: string | null; created_at: string };
type Req = {
  id: string;
  company_name: string;
  candidate_no: string;
  status: RequestStatus;
  interview_at: string | null;
  created_at: string;
  outcome?: string | null;
  hired_at?: string | null;
  fee_amount?: number | null;
  invoiced_at?: string | null;
  paid_at?: string | null;
};

const CLOSED: RequestStatus[] = ["confirmed", "declined", "unreachable", "withdrawn"];

/** ドラテク管理のホーム。今日やること（未対応の数）と、全体の数字をまとめて出す */
export default async function DoratechHome() {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();

  const [cands, companies, reqs] = await Promise.all([
    auth.db.from("driver_candidates").select("*").limit(5000),
    auth.db.from("driver_company_inquiries").select("*").limit(5000),
    auth.db.from("scout_interview_requests").select("*").order("created_at", { ascending: false }).limit(5000),
  ]);
  const candidates = ((cands.data ?? []) as Cand[]).filter((c) => !c.is_test);
  const comps = (companies.data ?? []) as Company[];
  const requests = (reqs.data ?? []) as Req[];

  const month = jstMonthKey(new Date());
  const now = new Date().getTime();

  const pendingCandidates = candidates.filter((c) => c.status === "pending").length;
  const newCompanies = comps.filter((c) => c.status === "new").length;
  const receivedRequests = requests.filter((r) => r.status === "received").length;
  const openRequests = requests.filter((r) => !CLOSED.includes(r.status)).length;
  const hired = requests.filter((r) => r.outcome === "hired");
  const unbilled = hired.filter((r) => billingState(r) === "unbilled");
  const awaitingPayment = hired.filter((r) => billingState(r) === "invoiced");
  const awaitingAmount = awaitingPayment.reduce((s, r) => s + (r.fee_amount ?? 0), 0);
  const paidThisMonth = hired.filter((r) => r.paid_at && r.paid_at.slice(0, 7) === month).reduce((s, r) => s + (r.fee_amount ?? 0), 0);
  // 面接確定で、まだ採用結果を記録していないもの（面接日を過ぎたら結果の記録が必要）
  const needOutcome = requests.filter((r) => r.status === "confirmed" && !r.outcome && r.interview_at && new Date(r.interview_at).getTime() < now).length;
  const upcoming = requests
    .filter((r) => r.status === "confirmed" && r.interview_at && new Date(r.interview_at).getTime() >= now - 3600_000)
    .sort((a, b) => (a.interview_at! < b.interview_at! ? -1 : 1))
    .slice(0, 8);

  const todos = [
    { n: pendingCandidates, label: "確認待ちの求職者（本人に確認して公開）", href: "/adofy-admin/doratech/candidates?status=pending" },
    { n: newCompanies, label: "新規の企業申込み", href: "/adofy-admin/doratech/companies?status=new" },
    { n: receivedRequests, label: "受付のままの面接希望（求職者へ連絡）", href: "/adofy-admin/doratech/interviews?status=received" },
    { n: needOutcome, label: "面接日を過ぎた依頼（採用結果を記録）", href: "/adofy-admin/doratech/billing?view=need_outcome" },
    { n: unbilled.length, label: "採用決定・未請求（成功報酬を請求）", href: "/adofy-admin/doratech/billing?view=unbilled" },
    { n: awaitingPayment.length, label: "請求済み・入金待ち", href: "/adofy-admin/doratech/billing?view=invoiced" },
  ];
  const errors = [cands.error, companies.error, reqs.error].filter(Boolean);

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <DoratechNav current="home" />
        <h1 className="mb-4 text-xl font-bold text-slate-900">ドラテク管理</h1>

        {errors.length > 0 && (
          <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            一部のデータを読み込めませんでした。supabase/migrations の 015〜017 が Supabase に適用されているか確認してください。
          </p>
        )}

        <section className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-black text-slate-700">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            やること
          </h2>
          <ul className="divide-y divide-slate-100">
            {todos.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="flex items-center gap-3 py-2.5 hover:bg-slate-50">
                  <span className={`w-12 shrink-0 text-right text-2xl font-black tabular-nums ${t.n > 0 ? "text-rose-600" : "text-slate-300"}`}>{t.n}</span>
                  <span className={`flex-1 text-sm font-bold ${t.n > 0 ? "text-slate-900" : "text-slate-400"}`}>{t.label}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="公開中の求職者" value={candidates.filter((c) => c.status === "waiting").length} unit="人" sub={`今月の登録 ${candidates.filter((c) => jstMonthKey(c.created_at) === month).length}人`} />
          <Stat label="企業（契約済み）" value={comps.filter((c) => c.contracted_at).length} unit="社" sub={`申込み 累計${comps.length}社`} />
          <Stat label="対応中の面接希望" value={openRequests} unit="件" sub={`今月の依頼 ${requests.filter((r) => jstMonthKey(r.created_at) === month).length}件`} />
          <Stat label="採用決定" value={hired.length} unit="人" sub={`今月 ${hired.filter((r) => r.hired_at?.slice(0, 7) === month).length}人`} />
          <Stat label="入金待ち" value={yen(awaitingAmount)} sub={`${awaitingPayment.length}件`} />
          <Stat label="今月の入金" value={yen(paidThisMonth)} />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-3 flex items-center gap-1.5 text-sm font-black text-slate-700">
              <CalendarClock className="h-4 w-4" />
              これからの面接
            </h2>
            {upcoming.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">確定している面接はありません。</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {upcoming.map((r) => (
                  <li key={r.id}>
                    <Link href={`/adofy-admin/doratech/interviews/${r.id}`} className="flex items-center gap-3 py-2 text-sm hover:bg-slate-50">
                      <span className="w-36 shrink-0 font-bold tabular-nums text-slate-900">{formatJst(r.interview_at)}</span>
                      <span className="min-w-0 flex-1 truncate">{r.company_name} × No.{r.candidate_no}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-3 text-sm font-black text-slate-700">求職者の状態</h2>
            <ul className="space-y-1.5 text-sm">
              {CANDIDATE_STATUSES.map((s) => (
                <li key={s}>
                  <Link href={`/adofy-admin/doratech/candidates?status=${s}`} className="flex justify-between rounded px-1 py-1 hover:bg-slate-50">
                    <span className="font-bold text-slate-700">{CANDIDATE_STATUS_LABEL[s]}</span>
                    <span className="tabular-nums text-slate-500">{candidates.filter((c) => c.status === s).length}人</span>
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="mb-2 mt-4 text-sm font-black text-slate-700">最近の面接希望</h2>
            <ul className="space-y-1 text-sm">
              {requests.slice(0, 5).map((r) => (
                <li key={r.id}>
                  <Link href={`/adofy-admin/doratech/interviews/${r.id}`} className="flex items-center gap-2 rounded px-1 py-1 hover:bg-slate-50">
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${REQUEST_STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
                    <span className="min-w-0 flex-1 truncate">{r.company_name} × No.{r.candidate_no}</span>
                  </Link>
                </li>
              ))}
              {requests.length === 0 && <li className="text-slate-400">まだありません。</li>}
            </ul>
          </section>
        </div>
      </div>
    </AdofyAdminShell>
  );
}

function Stat({ label, value, unit, sub }: { label: string; value: number | string; unit?: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#0a1f4e]">
        <span className="tabular-nums">{value}</span>
        {unit && <span className="ml-0.5 text-base font-bold">{unit}</span>}
      </p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
