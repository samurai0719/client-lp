import type { Metadata } from "next";
import "./adofy.css";

import { CursorGlow, Header, Loader, MobileFixedCta, ScrollProgress, SmoothScroll } from "@/components/adofy/Chrome";
import HeroSection from "@/components/adofy/HeroSection";
import ResultsSection from "@/components/adofy/ResultsSection";
import ProblemsSection from "@/components/adofy/ProblemsSection";
import SolutionSection from "@/components/adofy/SolutionSection";
import ReasonsSection from "@/components/adofy/ReasonsSection";
import FeaturesSection from "@/components/adofy/FeaturesSection";
import PricingSection from "@/components/adofy/PricingSection";
import IndustriesSection from "@/components/adofy/IndustriesSection";
import FlowSection from "@/components/adofy/FlowSection";
import FaqSection from "@/components/adofy/FaqSection";
import FinalCtaSection from "@/components/adofy/FinalCtaSection";
import Footer from "@/components/adofy/Footer";
import { FAQS, PLANS, SITE } from "@/components/adofy/config";

const TITLE = "建設業専門の集客ホームページ制作｜adofy";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: TITLE,
  description: SITE.description,
  alternates: { canonical: "/lp" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE.name,
    title: TITLE,
    description: SITE.description,
    url: "/lp",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

/**
 * 構造化データ。Organization / Service / FAQPage を1つのグラフにまとめる。
 * 断定的な効果保証は書かない（景品表示法・薬機法的な観点での安全側の記述）。
 */
function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        areaServed: { "@type": "Country", name: "日本" },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        inLanguage: "ja",
        publisher: { "@id": `${SITE.url}/#organization` },
      },
      {
        "@type": "Service",
        "@id": `${SITE.url}/lp#service`,
        name: "建設業専門の集客ホームページ制作",
        serviceType: "ホームページ制作・Web集客支援",
        provider: { "@id": `${SITE.url}/#organization` },
        description:
          "外構・外壁塗装・屋根・解体・リフォーム・電気・水道・内装・足場・造成など、建設業に特化した集客ホームページの制作サービス。",
        audience: { "@type": "BusinessAudience", name: "建設業・専門工事業の事業者" },
        offers: PLANS.map((plan) => ({
          "@type": "Offer",
          name: plan.name,
          description: plan.for,
          price: plan.price * 10000,
          priceCurrency: "JPY",
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE.url}/lp#faq`,
        mainEntity: FAQS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // 静的な自前データのみを流し込む
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function AdofyPage() {
  return (
    <>
      {/*
        JS が有効なときだけ「登場前の非表示状態」を適用するためのフラグ。
        本文より前に実行されるので、初回描画から正しい状態で表示される。
        このスクリプトが動かない環境では adf-js が付かず、
        すべてのコンテンツが最初から可視のままになる（永久に消えることはない）。
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.classList.add('adf-js')`,
        }}
      />
      <StructuredData />

      <div className="adf-lp" id="top">
        <Loader />
        <ScrollProgress />
        <CursorGlow />
        <SmoothScroll />
        <Header />

        {/* 固定表示の要素は上、通常フローの中身は .adf-lp__flow の内側に置く */}
        <div className="adf-lp__flow">
          <main>
            {/* 検索結果・支援技術向けのページ主題（FVは画像のみで文字を持たないため） */}
            <h1 className="adf-sr">
              建設業専門の集客ホームページ制作｜adofy。外構工事のWeb集客実績と広告運用のノウハウをもとに、問い合わせ・受注・採用につながるホームページを制作します。
            </h1>

            {/* 2. ファーストビュー（画像差し替え待ちの白紙エリア） */}
            <HeroSection />

            {/* 3. 集客実績（実績差し替え待ちの白紙エリア） */}
            <ResultsSection />

            {/* 4. お悩み → 5. 解決策（背景が暗色から明色へ切り替わる） */}
            <ProblemsSection />
            <SolutionSection />

            {/* 6. 選ばれる理由 */}
            <ReasonsSection />

            {/* 7. 制作するホームページの特徴 */}
            <FeaturesSection />

            {/* 8. 料金プラン */}
            <PricingSection />

            {/* 9. 対応業種 */}
            <IndustriesSection />

            {/* 10. 制作の流れ */}
            <FlowSection />

            {/* 11. よくある質問 */}
            <FaqSection />

            {/* 12. 最終CTA（CTA_HREF の初期着地点 #contact） */}
            <FinalCtaSection />
          </main>

          {/* 13. フッター */}
          <Footer />
        </div>

        {/* スマートフォンのみ：画面下部の追従CTA */}
        <MobileFixedCta />
      </div>
    </>
  );
}
