import type { Metadata, Viewport } from "next";

import { Achievements, Faq, Flow, Hero, Mechanism, Pricing, Problems, Visible } from "@/components/driver-scout/Sections";
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }} />
      <ScoutShell waiting={waiting} event="company_lp_view" home sticky>
        <Hero />
        <Achievements />
        <Problems />
        <Mechanism />
        <Visible />
        <Pricing />
        <Flow />
        <Faq />
      </ScoutShell>
    </>
  );
}
