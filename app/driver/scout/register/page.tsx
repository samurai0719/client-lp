import type { Metadata } from "next";
import { SectionHead } from "@/components/driver-company/lp/ui";
import ApplyForm from "@/components/driver-scout/ApplyForm";
import InterviewRequestForm from "@/components/driver-scout/InterviewRequestForm";
import { CANDIDATE_NO_PATTERN } from "@/lib/driverCandidates/candidateNo";
import ScoutShell from "@/components/driver-scout/Shell";
import { SCOUT_PATHS, SERVICE_NAME } from "@/components/driver-scout/content";
import { SITE_URL } from "@/components/driver-scout/seo";
import { getWaitingDriverCount } from "@/lib/driverCandidates/count";

/**
 * 無料登録（企業登録・利用申込み）フォーム（公開URL https://scout.adofy-site.com/register ）。
 * 匿名プロフィールの「この方と面接を希望する」から来る（通常はライトボックスで開き、JSが動かない環境ではこのページ）。
 * ?candidate=XXXXXX が付いていれば、その求職者への面接希望の依頼フォーム（InterviewRequestForm）を出す。
 * 付いていなければ、会社の無料登録フォーム（ApplyForm）を出す。
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `無料登録（企業登録）｜${SERVICE_NAME} ドライバー採用サービス`,
  description: "匿名プロフィールの候補者との面接を希望するための、運送会社さま向けの無料登録フォームです。",
  alternates: { canonical: SCOUT_PATHS.register },
  // フォームだけのページなので検索結果には出さない（リンクはたどってよい）
  robots: { index: false, follow: true },
};

export default async function ScoutRegisterPage({ searchParams }: { searchParams: Promise<{ candidate?: string }> }) {
  const { candidate } = await searchParams;
  const no = typeof candidate === "string" ? candidate.toUpperCase() : "";
  const isRequest = CANDIDATE_NO_PATTERN.test(no);
  const waiting = await getWaitingDriverCount();
  return (
    <ScoutShell waiting={waiting} event="company_register_view">
      <section className="dt-section ds-apply" id="apply" aria-labelledby="ds-apply-title">
        <div className="dt-container dt-container--narrow">
          <SectionHead
            eyebrow="FREE REGISTER"
            id="ds-apply-title"
            title={isRequest ? "この方と面接を希望する" : "無料登録（企業登録）"}
            lead={
              isRequest
                ? "ドラテクが求職者に連絡し、面接の希望と御社が確認したい内容を聞いたうえで、面接の日程を調整します。登録は無料です。"
                : "会社情報と採用したい条件をご入力ください。登録は無料です。費用が発生するのは採用決定時の成功報酬（想定年収の10％）だけです。"
            }
          />
          {isRequest ? <InterviewRequestForm candidateNo={no} /> : <ApplyForm />}
        </div>
      </section>
    </ScoutShell>
  );
}
