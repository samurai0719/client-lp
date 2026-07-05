import type { Metadata } from "next";
import PageHero from "@/components/takanaga/common/PageHero";
import { siteConfig } from "@/data/takanaga/siteConfig";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "高長建設のプライバシーポリシー。個人情報の取り扱いについてご説明します。",
  alternates: { canonical: `https://${siteConfig.domain}/privacy` },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="プライバシーポリシー"
        path="/privacy"
        breadcrumbs={[{ label: "プライバシーポリシー" }]}
      />

      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-sm max-w-none text-(--tkn-text) leading-relaxed space-y-8">

            <section aria-labelledby="pp-intro">
              <p>
                高長建設（以下「当社」）は、お客様の個人情報の保護を重要と考え、以下のとおりプライバシーポリシーを定めます。
              </p>
            </section>

            <section aria-labelledby="pp-1">
              <h2 id="pp-1" className="text-lg font-bold text-(--tkn-navy-deep) mb-3">
                1. 収集する個人情報
              </h2>
              <p>当社は、以下の情報を収集することがあります。</p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                <li>お名前</li>
                <li>電話番号</li>
                <li>メールアドレス</li>
                <li>ご住所（市区町村まで）</li>
                <li>お問い合わせ内容</li>
                <li>ご提供いただいた写真・資料</li>
              </ul>
            </section>

            <section aria-labelledby="pp-2">
              <h2 id="pp-2" className="text-lg font-bold text-(--tkn-navy-deep) mb-3">
                2. 利用目的
              </h2>
              <p>収集した個人情報は、以下の目的で利用します。</p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                <li>お問い合わせへの回答・対応</li>
                <li>現地調査・お見積もりの実施</li>
                <li>施工提案の作成</li>
                <li>工事の施工・管理</li>
                <li>アフターフォローの実施</li>
              </ul>
            </section>

            <section aria-labelledby="pp-3">
              <h2 id="pp-3" className="text-lg font-bold text-(--tkn-navy-deep) mb-3">
                3. 第三者への提供
              </h2>
              <p>
                当社は、法令に基づく場合を除き、お客様の同意なく個人情報を第三者に提供しません。
                なお、業務委託先（顧客管理システムの提供事業者など）には、必要な範囲で情報を提供する場合があります。
              </p>
            </section>

            <section aria-labelledby="pp-4">
              <h2 id="pp-4" className="text-lg font-bold text-(--tkn-navy-deep) mb-3">
                4. 個人情報の管理
              </h2>
              <p>
                当社は、個人情報の漏洩・滅失・毀損を防ぐため、適切な安全管理措置を講じます。
              </p>
            </section>

            <section aria-labelledby="pp-5">
              <h2 id="pp-5" className="text-lg font-bold text-(--tkn-navy-deep) mb-3">
                5. 個人情報の開示・訂正・削除
              </h2>
              <p>
                ご本人からの個人情報の開示・訂正・削除のご請求には、合理的な範囲で対応します。
                ご希望の場合はお問い合わせフォームよりご連絡ください。
              </p>
            </section>

            <section aria-labelledby="pp-6">
              <h2 id="pp-6" className="text-lg font-bold text-(--tkn-navy-deep) mb-3">
                6. Cookieについて
              </h2>
              <p>
                当社ウェブサイトでは、サービス改善のためCookieを使用することがあります。
                ブラウザの設定によりCookieを無効にすることが可能ですが、一部機能が制限される場合があります。
              </p>
            </section>

            <section aria-labelledby="pp-7">
              <h2 id="pp-7" className="text-lg font-bold text-(--tkn-navy-deep) mb-3">
                7. プライバシーポリシーの変更
              </h2>
              <p>
                当社は、必要に応じて本プライバシーポリシーを変更することがあります。
                変更後のポリシーは本ページに掲載します。
              </p>
            </section>

            <section aria-labelledby="pp-8">
              <h2 id="pp-8" className="text-lg font-bold text-(--tkn-navy-deep) mb-3">
                8. お問い合わせ
              </h2>
              <p>
                個人情報の取り扱いに関するご質問・ご要望は、お問い合わせフォームよりご連絡ください。
              </p>
            </section>

            <p className="text-xs text-(--tkn-text-muted)">
              制定日：2025年 ※ 制定日が確定しましたら更新します。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
