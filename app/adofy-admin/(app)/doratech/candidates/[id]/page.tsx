import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AdofyAdminShell from "@/components/adofy-admin/AdofyAdminShell";
import DoratechNav from "@/components/doratech-admin/DoratechNav";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { formatJst } from "@/lib/saiyoRescue/leads";
import { candidateNo } from "@/lib/driverCandidates/candidateNo";
import { STATUS_LABEL, type RequestStatus } from "@/lib/driverScout/requests";
import { REQUEST_STATUS_STYLE } from "@/lib/driverScout/adminStyle";
import {
  CANDIDATE_STATUS_LABEL,
  CANDIDATE_STATUS_STYLE,
  OUTCOME_LABEL,
  SOURCE_LABEL,
  candidateToValues,
  type CandidateRow,
} from "@/lib/driverCandidates/admin";
import CandidateForm from "../CandidateForm";
import { ANSWER_DISPLAY_ORDER } from "@/components/driver/questions";

export const dynamic = "force-dynamic";
export const metadata = { title: "ドラテク 求職者の詳細｜adofy 管理画面" };

/** 求職者1人。登録時の回答・この人への面接希望の履歴・編集フォーム */
export default async function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) notFound();
  const { id } = await params;

  const { data } = await auth.db.from("driver_candidates").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const c = data as CandidateRow;

  const { data: reqData } = await auth.db
    .from("scout_interview_requests")
    .select("*")
    .eq("candidate_id", id)
    .order("created_at", { ascending: false });
  const requests = (reqData ?? []) as { id: string; company_name: string; status: RequestStatus; created_at: string; outcome?: string | null }[];
  const rank = (k: string) => {
    const i = ANSWER_DISPLAY_ORDER.indexOf(k);
    return i === -1 ? ANSWER_DISPLAY_ORDER.length : i;
  };
  const answers = Object.entries(c.answers ?? {}).sort(([a], [b]) => rank(a) - rank(b));

  return (
    <AdofyAdminShell>
      <div className="p-4 sm:p-6">
        <DoratechNav current="candidates" />
        <Link href="/adofy-admin/doratech/candidates" className="mb-3 inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800">
          <ChevronLeft className="h-4 w-4" />
          求職者の一覧
        </Link>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">{c.full_name || "（氏名未登録）"}</h1>
          <span className="text-sm text-slate-500">No.{candidateNo(c.id)}</span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${CANDIDATE_STATUS_STYLE[c.status]}`}>{CANDIDATE_STATUS_LABEL[c.status] ?? c.status}</span>
          {c.is_test && <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">テスト用</span>}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          <CandidateForm id={c.id} initial={candidateToValues(c)} />

          <div className="grid content-start gap-4">
            <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
              <h2 className="mb-2 text-sm font-black text-slate-700">登録情報</h2>
              <p className="text-slate-600">登録 {formatJst(c.created_at)}</p>
              <p className="text-slate-600">更新 {formatJst(c.updated_at)}</p>
              <p className="text-slate-600">経路 {SOURCE_LABEL[c.source ?? ""] ?? c.source ?? "不明"}{c.utm_source && `（${c.utm_source}）`}</p>
              {answers.length > 0 && (
                <dl className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
                  {answers.map(([k, val]) => (
                    <div key={k} className="py-1.5">
                      <dt className="text-xs font-bold text-slate-500">{k}</dt>
                      <dd className="text-slate-900">{Array.isArray(val) ? val.join(" ／ ") : String(val)}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {c.comment && (
                <p className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-2 text-slate-800">
                  <span className="block text-xs font-bold text-slate-500">ご希望・ご質問</span>
                  {c.comment}
                </p>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="mb-2 text-sm font-black text-slate-700">この人への面接希望</h2>
              {requests.length === 0 ? (
                <p className="text-sm text-slate-400">まだありません。</p>
              ) : (
                <ul className="divide-y divide-slate-100 text-sm">
                  {requests.map((r) => (
                    <li key={r.id}>
                      <Link href={`/adofy-admin/doratech/interviews/${r.id}`} className="block py-2 hover:bg-slate-50">
                        <span className="font-bold text-slate-900">{r.company_name}</span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                          <span className={`rounded-full px-2 py-0.5 font-bold ${REQUEST_STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
                          {r.outcome && <span className="font-bold text-blue-700">{OUTCOME_LABEL[r.outcome]}</span>}
                          {formatJst(r.created_at, false)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </AdofyAdminShell>
  );
}
