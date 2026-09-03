import type { Metadata } from "next";
import { Suspense } from "react";
import "../adofy/adofy.css";
import "./contact.css";
import AdofyMetaPixel from "@/components/analytics/AdofyMetaPixel";
import ConsultationForm from "@/components/adofy/contact/ConsultationForm";
import { ContactHeader } from "@/components/adofy/contact/ContactChrome";
import { SITE } from "@/components/adofy/config";

const TITLE = "無料相談｜建設業専門の集客ホームページ制作 adofy";
const DESC =
  "建設会社・建設業の個人事業主向けの無料相談フォームです。現在の集客状況やこれから増やしたい仕事をお聞かせください。相談無料・無理な営業はありません。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.lpUrl),
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/contact" },
  openGraph: { type: "website", locale: "ja_JP", siteName: SITE.name, title: TITLE, description: DESC },
  // 相談フォームは検索結果に出す必要がないため、インデックスさせない
  robots: { index: false, follow: true },
};

export default function ContactPage() {
  return (
    <div className="adf-lp adf-contact">
      <AdofyMetaPixel />
      <ContactHeader />

      <main className="adf-contact__main">
        <div className="adf-contact__intro">
          <h1 className="adf-contact__title">ホームページ制作について無料で相談する</h1>
          <p className="adf-contact__lead">
            現在の集客状況や、これから増やしたい仕事についてお聞かせください。
            内容を確認したうえで、貴社に合ったホームページと集客方法をご提案します。
          </p>
          <ul className="adf-contact__badges">
            <li>相談無料</li>
            <li>無理な営業なし</li>
            <li>オンライン相談対応</li>
          </ul>
        </div>

        {/* useSearchParams（?plan=）を使うため Suspense で包む */}
        <Suspense fallback={<div className="adf-form__skeleton" aria-hidden="true" />}>
          <ConsultationForm />
        </Suspense>
      </main>
    </div>
  );
}
