import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarCheck, CircleDot, MapPin } from "lucide-react";
import { SectionHead } from "@/components/driver-company/lp/ui";
import ScoutShell from "@/components/driver-scout/Shell";
import { SCOUT_PATHS, SERVICE_NAME } from "@/components/driver-scout/content";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { STATUS_LABEL, STATUS_MESSAGE, type RequestStatus } from "@/lib/driverScout/requests";

/**
 * 企業向けの面接希望の受付状況（公開URL https://scout.adofy-site.com/requests/<token> ）。
 * 受付メールに載せたURL（推測できない token）で開く。検索結果には出さない。
 *
 * 表示するのは、企業自身が入力した依頼内容・対応状況・求職者の回答・確定した面接日時だけ。
 * 求職者の氏名・電話番号などはこのページに出さない（企業への開示は本人の同意と既存の権限で別に扱う）。
 */

export const metadata: Metadata = {
  title: `面接希望の受付状況｜${SERVICE_NAME}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const TOKEN_PATTERN = /^[0-9a-f]{48}$/;

type Row = {
  candidate_no: string;
  company_name: string;
  job_description: string;
  questions: string | null;
  company_available_times: string | null;
  status: RequestStatus;
  candidate_answers: string | null;
  interview_at: string | null;
  interview_place: string | null;
  created_at: string;
  status_changed_at: string | null;
};

const fmt = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
});

/** 進み具合の表示（見送り・連絡がつかない・取り下げは途中で止める） */
const STEPS: { key: RequestStatus[]; label: string }[] = [
  { key: ["received"], label: "受付" },
  { key: ["contacting", "awaiting_answer"], label: "求職者へ連絡" },
  { key: ["scheduling"], label: "日程調整" },
  { key: ["confirmed"], label: "面接確定" },
];

export default async function RequestStatusPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!TOKEN_PATTERN.test(token) || !isSupabaseAdminConfigured()) notFound();

  const { data, error } = await createAdminClient()
    .from("scout_interview_requests")
    .select("candidate_no, company_name, job_description, questions, company_available_times, status, candidate_answers, interview_at, interview_place, created_at, status_changed_at")
    .eq("public_token", token)
    .maybeSingle();
  if (error || !data) notFound();
  const r = data as Row;

  const stopped = r.status === "declined" || r.status === "unreachable" || r.status === "withdrawn";
  const current = STEPS.findIndex((s) => s.key.includes(r.status));

  return (
    <ScoutShell waiting={null} event="company_register_view" headerCta={false}>
      <section className="dt-section ds-reqstatus" aria-labelledby="ds-req-title">
        <div className="dt-container dt-container--narrow">
          <SectionHead eyebrow="受付状況" id="ds-req-title" title="面接希望の受付状況" />

          <div className={`ds-reqcard${stopped ? " is-stopped" : ""}${r.status === "confirmed" ? " is-confirmed" : ""}`}>
            <p className="ds-reqcard__who">
              {r.company_name} 様　→　求職者 No.{r.candidate_no}
            </p>
            <p className="ds-reqcard__status">
              <CircleDot aria-hidden="true" />
              {STATUS_LABEL[r.status]}
            </p>
            <p className="ds-reqcard__msg">{STATUS_MESSAGE[r.status]}</p>

            {!stopped && (
              <ol className="ds-reqsteps" aria-label="進み具合">
                {STEPS.map((s, i) => (
                  <li key={s.label} className={i < current ? "is-done" : i === current ? "is-now" : undefined}>
                    {s.label}
                  </li>
                ))}
              </ol>
            )}

            {r.status === "confirmed" && r.interview_at && (
              <div className="ds-reqinterview">
                <p>
                  <CalendarCheck aria-hidden="true" />
                  <b>{fmt.format(new Date(r.interview_at))}</b>
                </p>
                {r.interview_place && (
                  <p>
                    <MapPin aria-hidden="true" />
                    {r.interview_place}
                  </p>
                )}
              </div>
            )}
          </div>

          {r.candidate_answers && (
            <div className="ds-reqblock">
              <h2>確認したい内容への、求職者の回答</h2>
              <p>{r.candidate_answers}</p>
            </div>
          )}

          <div className="ds-reqblock">
            <h2>ご依頼の内容</h2>
            <dl>
              <div>
                <dt>仕事内容</dt>
                <dd>{r.job_description}</dd>
              </div>
              <div>
                <dt>確認したいこと</dt>
                <dd>{r.questions ?? "（記入なし）"}</dd>
              </div>
              <div>
                <dt>面接できる日時</dt>
                <dd>{r.company_available_times ?? "（記入なし）"}</dd>
              </div>
              <div>
                <dt>受付日時</dt>
                <dd>{fmt.format(new Date(r.created_at))}</dd>
              </div>
            </dl>
          </div>

          <p className="ds-small">
            ドラテクが求職者へ連絡し、面接の希望と確認事項をお聞きして、日程を調整します。面接・採用の判断は企業様に行っていただきます。
            費用が発生するのは、ご契約のうえ採用が決定したときの成功報酬だけです。内容の変更・取り下げは、受付メールへの返信でお知らせください。
          </p>
          <p className="ds-small">
            <a href={SCOUT_PATHS.profiles}>匿名プロフィール一覧へ</a>
          </p>
        </div>
      </section>
    </ScoutShell>
  );
}
