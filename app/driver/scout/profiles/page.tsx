import type { Metadata } from "next";
import InterviewModal from "@/components/driver-scout/InterviewModal";
import ProfilesSection from "@/components/driver-scout/ProfilesSection";
import ScoutShell from "@/components/driver-scout/Shell";
import { SCOUT_PATHS, SERVICE_NAME } from "@/components/driver-scout/content";
import { OG_IMAGE, SITE_URL } from "@/components/driver-scout/seo";
import { listAnonymousProfiles } from "@/lib/driverCandidates/profiles";
import "../scout-saiyo.css";

/**
 * 求職者の匿名プロフィール一覧（公開URL https://scout.adofy-site.com/profiles ）。
 * LPの「無料で求職者情報を見てみる」から来る。登録なしで閲覧でき、
 * 「この方と面接を希望する」を押すと、ライトボックスで無料登録（企業登録）フォームが開く。
 */

const TITLE = `ドライバー求職者の匿名プロフィール一覧｜愛知の運送会社向け｜${SERVICE_NAME}`;
const DESCRIPTION =
  "愛知県で働きたいトラックドライバー希望者の匿名プロフィール一覧。年齢（年代）・免許・運転経験・希望勤務地・希望年収を登録なしで確認でき、面接したい人を選ぶと、ドラテクが連絡と面接の日程調整を行います。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SCOUT_PATHS.profiles },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SCOUT_PATHS.profiles,
    siteName: SERVICE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  formatDetection: { telephone: false },
};

// 新しく登録された求職者を1分以内に一覧へ反映する（ISR）
export const revalidate = 60;

export default async function ScoutProfilesPage() {
  const profiles = await listAnonymousProfiles();
  const waiting = profiles?.length ?? null;

  return (
    <ScoutShell waiting={waiting} event="company_profiles_view" headerCta={false}>
      <ProfilesSection profiles={profiles} />
      <InterviewModal />
    </ScoutShell>
  );
}
