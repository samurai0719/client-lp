import type { Metadata } from "next";
import LegalPageShell from "@/components/nurse-ranking/LegalPageShell";
import { siteMeta } from "@/config/nurse-ranking";

const canonicalUrl = siteMeta.domain ? `https://${siteMeta.domain}/nurse-ranking/privacy` : undefined;

export const metadata: Metadata = {
  title: "プライバシーポリシー｜看護師転職サイトおすすめランキング",
  description: "当サイトの個人情報の取り扱い、Cookieの利用、外部サービスへのリンクについて説明します。",
  alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="プライバシーポリシー">
      <section>
        <p>
          本サイト「看護師転職サイトおすすめランキング」（以下「当サイト」）は、掲載する転職支援サービスへの導線となる
          比較・紹介サイトです。当サイト自体はお申し込みフォームを持たず、個人情報の入力は各サービスの公式サイト上で
          行われます。
        </p>
      </section>

      <section>
        <h2>アクセス解析について</h2>
        <p>
          当サイトでは、サイト改善のためGoogle Analytics（GA4）等のアクセス解析ツールを利用する場合があります。
          これらのツールはCookie等を用いてアクセス状況を収集しますが、個人を特定する情報は取得しません。
          収集したデータは各解析ツールの提供事業者のプライバシーポリシーに基づいて取り扱われます。
        </p>
      </section>

      <section>
        <h2>広告について</h2>
        <p>
          当サイトはアフィリエイト広告を利用しています。広告配信事業者がCookie等を利用し、当サイトや他サイトへの
          過去のアクセス情報に基づいて広告を配信することがあります。詳しくは「広告掲載ポリシー」をご確認ください。
        </p>
      </section>

      <section>
        <h2>外部サービスへのリンク</h2>
        <p>
          当サイトに掲載しているCTA（「公式サイトで無料相談する」等）をクリックすると、各転職支援サービスの公式サイトへ
          遷移します。遷移先で入力される個人情報は、当該サービスのプライバシーポリシーに基づいて管理されます。
          個人情報の取り扱いについては、各サービスの公式サイトをご確認ください。
        </p>
      </section>

      <section>
        <h2>クリック計測について</h2>
        <p>
          当サイトでは、どのCTAがどの程度クリックされたかを把握するために計測を行うことがあります。
          この計測において、氏名・連絡先等の個人情報を取得することはありません。
        </p>
      </section>

      <section>
        <h2>お問い合わせ</h2>
        <p>
          本ポリシーに関するお問い合わせは、運営者情報ページに記載の連絡先までお願いいたします。
        </p>
      </section>

      <p className="text-xs text-slate-400">最終更新：{siteMeta.contentUpdatedAt}</p>
    </LegalPageShell>
  );
}
