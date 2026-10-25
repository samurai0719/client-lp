import type { Metadata } from "next";
import { SectionHead } from "@/components/driver-company/lp/ui";
import ApplyForm from "@/components/driver-scout/ApplyForm";
import ScoutShell from "@/components/driver-scout/Shell";
import { SCOUT_PATHS, SERVICE_NAME } from "@/components/driver-scout/content";
import { SITE_URL } from "@/components/driver-scout/seo";
import { getWaitingDriverCount } from "@/lib/driverCandidates/count";

/**
 * 無料登録（企業登録・利用申込み）フォーム（公開URL https://scout.adofy-site.com/register ）。
 * 匿名プロフィールの「無料登録して連絡先の開示を依頼する」から来る。
 * ?candidate=XXXXXX が付いていれば、どの候補者の開示を求めているかを一緒に送る。
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `無料登録（企業登録）｜${SERVICE_NAME} ドライバー採用サービス`,
  description: "匿名プロフィールの候補者へ連絡先の開示を依頼するための、運送会社さま向けの無料登録フォームです。",
  alternates: { canonical: SCOUT_PATHS.register },
  // フォームだけのページなので検索結果には出さない（リンクはたどってよい）
  robots: { index: false, follow: true },
};

export const revalidate = 60;

export default async function ScoutRegisterPage() {
  const waiting = await getWaitingDriverCount();
  return (
    <ScoutShell waiting={waiting} event="company_register_view">
      <section className="dt-section ds-apply" id="apply" aria-labelledby="ds-apply-title">
        <div className="dt-container dt-container--narrow">
          <SectionHead
            eyebrow="FREE REGISTER"
            id="ds-apply-title"
            title="無料登録（企業登録）"
            lead="会社情報と採用したい条件をご入力ください。登録は無料です。費用が発生するのは採用決定時の成功報酬（想定年収の10％）だけです。"
          />
          <ApplyForm />
        </div>
      </section>
    </ScoutShell>
  );
}
