import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./doratech-company.css";

import PageViewTracker from "@/components/driver-company/PageViewTracker";
import { Footer, Header, StickyCta } from "@/components/driver-company/lp/Chrome";
import Hero from "@/components/driver-company/lp/Hero";
import Results from "@/components/driver-company/lp/Results";
import Problems from "@/components/driver-company/lp/Problems";
import Change from "@/components/driver-company/lp/Change";
import Reasons from "@/components/driver-company/lp/Reasons";
import Steps from "@/components/driver-company/lp/Steps";
import Pricing from "@/components/driver-company/lp/Pricing";
import Faq from "@/components/driver-company/lp/Faq";
import FinalCta from "@/components/driver-company/lp/FinalCta";
import { FAQ_PLAIN } from "@/components/driver-company/lp/content";
import { OPERATOR, PRICING, REFUND_TIERS, SERVICE } from "@/config/driver-company";

/**
 * ドラテク 企業向けLP。
 *
 * 公開URL … https://driver.taxidriver-beginner.com/company
 * 物理ルート … /driver/company
 *   /company は adofy コーポレートサイトが既に使っているため、
 *   next.config.ts のホスト条件付き rewrite で公開URLを /company に合わせている。
 *   canonical も公開URLを指す。
 *
 * 計測タグ（Meta Pixel / Ptengine）は app/driver/layout.tsx から引き継ぐ。
 * 求職者向けページ（/driver）には手を入れていない。
 *
 * デザイン・情報設計は採用レスキューLP（/saiyo-rescue）に合わせている。
 * 文言は components/driver-company/lp/content.ts、見た目は ./doratech-company.css（dt- プレフィックス）。
 * CTAはすべて求人登録フォーム（/company/register）へ送る。
 */

// 日本語グリフは unicode-range ごとに分割配信されるため、プリロードは latin のみ
const gothic = Noto_Sans_JP({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--dt-font",
  fallback: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "sans-serif"],
});

const TITLE = "ドライバー採用、採用できるまで0円｜入社した時だけ25万円のドラテク";
const DESCRIPTION =
  "運送会社・物流会社向けのドライバー採用サービス『ドラテク』。初期費用・掲載費・月額費・応募・面接はすべて0円。ドライバーが実際に入社した時だけ成功報酬1名25万円。早期退職時の返金制度あり。";

export const metadata: Metadata = {
  metadataBase: new URL(SERVICE.siteUrl),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: SERVICE.name,
  alternates: { canonical: SERVICE.url },
  openGraph: {
    type: "website",
    siteName: SERVICE.name,
    title: TITLE,
    description: DESCRIPTION,
    url: SERVICE.url,
    locale: "ja_JP",
    images: [{ url: "/images/driver/company/hero-pc.webp", width: 1536, height: 1024, alt: SERVICE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/driver/company/hero-pc.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1f4e",
};

/**
 * 構造化データ。
 * 事業者名・届出番号など未確定の項目は含めない（config に値が入ったときだけ出す）。
 * 料金は「採用1名 25万円の成果報酬」という事実のみを記述する。
 */
function buildJsonLd() {
  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${SERVICE.siteUrl}/#organization`,
    name: SERVICE.name,
    url: SERVICE.siteUrl,
    logo: `${SERVICE.siteUrl}${SERVICE.logo}`,
    description:
      "ドライバー求人に特化した募集情報等提供サービス。企業が入力した求人情報を掲載し、登録条件に一致する求職者へ自動配信します。",
  };
  if (OPERATOR.name) organization.legalName = OPERATOR.name;
  if (OPERATOR.address) organization.address = OPERATOR.address;
  if (OPERATOR.phone) organization.telephone = OPERATOR.phone;
  if (OPERATOR.email) organization.email = OPERATOR.email;

  const refundText = REFUND_TIERS.map((t) => `${t.label}：${t.refund}`).join("／");

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebPage",
        "@id": `${SERVICE.url}#webpage`,
        url: SERVICE.url,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "ja",
        isPartOf: { "@id": `${SERVICE.siteUrl}/#organization` },
      },
      {
        "@type": "Service",
        "@id": `${SERVICE.url}#service`,
        name: `${SERVICE.name} 求人掲載（企業向け）`,
        serviceType: "ドライバー求人に特化した募集情報等提供",
        provider: { "@id": `${SERVICE.siteUrl}/#organization` },
        description:
          "企業が入力した求人情報を自動で掲載し、登録条件に一致する登録ドライバーへ自動メール配信します。求職者が自ら応募先を選んで応募し、応募情報は企業の登録メールアドレスへ自動送信されます。選考は企業と応募者が直接行います。",
        offers: {
          "@type": "Offer",
          name: `採用成果報酬 1名${PRICING.successFee}`,
          description: `${PRICING.condition} ${PRICING.billingTrigger} 早期退職時の返金制度：${refundText}`,
          priceCurrency: "JPY",
          price: String(PRICING.successFeeValue),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SERVICE.url}#faq`,
        mainEntity: FAQ_PLAIN.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />
      <div className={`dt-lp ${gothic.variable}`}>
        {/* JSが無効な環境では、カウントアップ前の透明状態のまま残らないよう数字を最初から表示する */}
        <noscript
          dangerouslySetInnerHTML={{ __html: "<style>.dt-count{opacity:1!important;transform:none!important}</style>" }}
        />
        <PageViewTracker event="company_lp_view" />
        <Header />
        <main>
          <Hero />
          <Results />
          <Problems />
          <Change />
          <Reasons />
          <Steps />
          <Pricing />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
        <StickyCta />
      </div>
    </>
  );
}
