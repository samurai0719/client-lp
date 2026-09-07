import type { Metadata } from "next";
import { Suspense } from "react";
import "../adofy/adofy.css";
import "./contact.css";
import AdofyMetaPixel from "@/components/analytics/AdofyMetaPixel";
import LpInsightTracker, { ADOFY_LP_PROJECT_ID } from "@/components/analytics/LpInsightTracker";
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
      <LpInsightTracker projectId={ADOFY_LP_PROJECT_ID} />
      <ContactHeader />

      <main className="adf-contact__main">
        {/*
          診断のファーストビュー。
          画面いっぱいのヒーローにはせず、最初の質問がこの下から見え始める高さに収める。
          画像内の見出し・実績を下で繰り返さないため、この下は短い一行と補足だけにする。
        */}
        <div className="adf-contact__hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="adf-contact__hero-img"
            src="/images/adofy/adofy-diagnosis-hero.webp"
            alt="外構・外壁塗装・リフォーム会社の方へ。あなたの会社に合う集客方法を診断。adofyの集客支援実績100社以上、累計集客数2000人以上。"
            width={1774}
            height={887}
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="adf-contact__intro">
          <h1 className="adf-contact__title">かんたんな質問に答えるだけ。入力は約1分です。</h1>
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
