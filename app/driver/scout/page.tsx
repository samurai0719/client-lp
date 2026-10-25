import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "../company/doratech-company.css";
import "./scout.css";

import PageViewTracker from "@/components/driver-company/PageViewTracker";
import { SectionHead } from "@/components/driver-company/lp/ui";
import ApplyForm from "@/components/driver-scout/ApplyForm";
import { Faq, Flow, Footer, Hero, Mechanism, Pricing, Problems, Visible } from "@/components/driver-scout/Sections";
import { Header, StickyCta } from "@/components/driver-scout/ui";
import { SERVICE_NAME } from "@/components/driver-scout/content";
import { buildJsonLd, DESCRIPTION, OG_IMAGE, SITE_URL, TITLE } from "@/components/driver-scout/seo";
import { WaitingCountProvider } from "@/components/driver-scout/waiting";
import { getWaitingDriverCount } from "@/lib/driverCandidates/count";

/**
 * ドライバー採用サービス（候補者プロフィール検索）企業向けLP。
 * 物理ルート … /driver/scout（公開ドメインは未設定）
 *
 * 対象は運送会社の経営者・採用担当者のみ。求職者向けの導線は置かない。
 * CTAはすべて「無料で求職者情報を見てみる」で、ページ下部の利用申込みフォーム（#apply）へ進む。
 * デザインはドラテク企業向けLP（/driver/company）の dt- スタイルを共有し、
 * このページ固有の部品だけ ./scout.css（ds- プレフィックス）に置いている。
 * 文言は components/driver-scout/content.ts。
 */

const gothic = Noto_Sans_JP({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--dt-font",
  fallback: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: SERVICE_NAME,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: SERVICE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ ...OG_IMAGE, alt: "運送会社が求職者を選ぶ時代。初期費用0円・月額0円・採用決定時のみ想定年収の10％" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE.url] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#0a1f4e" };

// 「○人のドライバーが待機中」の人数を最新に保つため、ページを最大60秒ごとに作り直す（ISR）。
// 求職者が増えても、1分以内にLPの人数へ反映される。
export const revalidate = 60;

export default async function DriverScoutPage() {
  const waiting = await getWaitingDriverCount();
  return (
    <WaitingCountProvider count={waiting}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }} />
    <div className={`dt-lp ds-lp ${gothic.variable}`}>
      <PageViewTracker event="company_lp_view" />
      <Header />
      <main>
        <Hero />
        <Problems />
        <Mechanism />
        <Visible />
        <Pricing />
        <Flow />
        <Faq />
        <section className="dt-section ds-apply" id="apply" aria-labelledby="ds-apply-title">
          <div className="dt-container dt-container--narrow">
            <SectionHead
              eyebrow="APPLY"
              id="ds-apply-title"
              title="企業登録・利用申込みフォーム"
              lead="企業確認とご契約のあと、個人を特定できない匿名プロフィールを無料で閲覧できます。"
            />
            <ApplyForm />
          </div>
        </section>
      </main>
      <Footer />
      <StickyCta />
    </div>
    </WaitingCountProvider>
  );
}
