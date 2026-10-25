import type { Metadata, Viewport } from "next";

import { AboutResults, Faq, FinalCta, Flow, Hero, Intro, Pricing, Problems, Reasons, Retention, Visible } from "@/components/driver-scout/Sections";
import ScoutShell from "@/components/driver-scout/Shell";
import { SERVICE_NAME } from "@/components/driver-scout/content";
import { buildJsonLd, DESCRIPTION, OG_IMAGE, SITE_URL, TITLE } from "@/components/driver-scout/seo";
import { getWaitingDriverCount } from "@/lib/driverCandidates/count";

/**
 * ドライバー採用サービス（候補者プロフィール検索）企業向けLP。
 * 物理ルート … /driver/scout（公開URL https://scout.adofy-site.com/ ）
 *
 * 対象は運送会社の経営者・採用担当者のみ。求職者向けの導線は置かない。
 * CTAはすべて「無料で求職者情報を見てみる」で、匿名プロフィール一覧（/profiles）へ進む。
 * 一覧で連絡先の開示を求めたときに、無料登録（/register）へ進む。
 * デザインはドラテク企業向けLP（/driver/company）の dt- スタイルを共有し、
 * このサービス固有の部品だけ ./scout.css（ds- プレフィックス）に置いている。
 * 文言は components/driver-scout/content.ts。
 */

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
    images: [{ ...OG_IMAGE, alt: "仕事を断らない採用へ。人が残り続けるドライバー採用。運営者の実績：採用支援実績100社以上・累計応募者数2,000人以上" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE.url] },
  formatDetection: { telephone: false },
  // Google Search Console の所有権確認（URLプレフィックス https://scout.adofy-site.com/ ）
  verification: { google: "V3FtsnpfZEnsEv-8u0R4iWlXinrsIozyFVCM2oTOXpg" },
};

export const viewport: Viewport = { themeColor: "#0a1f4e" };

// 「○人のドライバーが待機中」の人数を最新に保つため、ページを最大60秒ごとに作り直す（ISR）。
// 求職者が増えても、1分以内にLPの人数へ反映される。
export const revalidate = 60;

export default async function DriverScoutPage() {
  const waiting = await getWaitingDriverCount();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }} />
      <ScoutShell waiting={waiting} event="company_lp_view" home sticky>
        <Hero />
        <Intro />
        <Problems />
        <Reasons />
        <Visible />
        <Retention />
        <Flow />
        <Pricing />
        <AboutResults />
        <Faq />
        <FinalCta />
      </ScoutShell>
    </>
  );
}
