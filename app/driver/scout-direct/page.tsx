import type { Metadata, Viewport } from "next";

import InterviewModal from "@/components/driver-scout/InterviewModal";
import ProfilesSection from "@/components/driver-scout/ProfilesSection";
import { Hero, Intro } from "@/components/driver-scout/Sections";
import ScoutShell from "@/components/driver-scout/Shell";
import { SERVICE_NAME } from "@/components/driver-scout/content";
import { OG_IMAGE, SITE_URL } from "@/components/driver-scout/seo";
import { listAnonymousProfiles } from "@/lib/driverCandidates/profiles";
import SingleMetaPixel from "@/components/analytics/SingleMetaPixel";
import { DORATECH_DIRECT_PIXEL_ID } from "@/lib/analytics/doratechDirectPixel";
// FV・説明の見た目はLP（/driver/scout/page.tsx）と同じCSSをそろえる
import "../scout/scout-motion.css";
import "../scout/scout-saiyo.css";
import "../scout/scout-fv-theme.css";
import "../scout/scout-editorial.css";
import "../scout/scout-logistics-editorial.css";

/**
 * 匿名プロフィールをいきなり見せる1ページ完結LP（公開URL https://scout.adofy-site.com/drivers ）。
 * 物理ルートは /driver/scout-direct。/driver/scout 配下に置くと企業向けの別Pixel（scout/layout.tsx）まで
 * 読み込まれるため、配下から外して専用Pixel（3711341419004077）だけを動かしている。
 * 構成：ファーストビュー（企業向けLPと同じ）→ 匿名プロフィール一覧 → ドラテクの軽い説明。
 * FVのボタンはページ内の一覧（#profiles）へ移動する。
 * 一覧で「この方と面接を希望する」を押すと、ライトボックスで面接希望の依頼へ進む（/profiles と同じ）。
 * 広告の着地ページ用のため、検索結果には出さない（noindex）。
 */

const TITLE = `ドライバー求職者の匿名プロフィール｜愛知の運送会社向け｜${SERVICE_NAME}`;
const DESCRIPTION =
  "愛知県で働きたいトラックドライバー希望者の匿名プロフィールを、登録なしですぐに確認できます。面接したい人を選ぶと、ドラテクが連絡と面接の日程調整を行います。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/drivers" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/drivers",
    siteName: SERVICE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#0a1f4e" };

// 新しく登録された求職者を1分以内に反映する（ISR）
export const revalidate = 60;

export default async function DriverScoutDirectProfilesPage() {
  const profiles = await listAnonymousProfiles();
  const waiting = profiles?.length ?? null;

  return (
    <ScoutShell waiting={waiting} event="company_profiles_view" home headerCta={false}>
      <SingleMetaPixel id={DORATECH_DIRECT_PIXEL_ID} />
      <Hero ctaHref="#profiles" />
      <ProfilesSection profiles={profiles} />
      <Intro />
      <InterviewModal />
    </ScoutShell>
  );
}
