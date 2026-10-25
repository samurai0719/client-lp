import type { Metadata } from "next";
import { SectionHead } from "@/components/driver-company/lp/ui";
import { ProfileCard, SampleProfileCard } from "@/components/driver-scout/Profiles";
import ScoutShell from "@/components/driver-scout/Shell";
import { SCOUT_PATHS, SERVICE_NAME } from "@/components/driver-scout/content";
import { OG_IMAGE, SITE_URL } from "@/components/driver-scout/seo";
import { WaitingLine } from "@/components/driver-scout/waiting";
import { listAnonymousProfiles } from "@/lib/driverCandidates/profiles";

/**
 * 求職者の匿名プロフィール一覧（公開URL https://scout.adofy-site.com/profiles ）。
 * LPの「無料で求職者情報を見てみる」から来る。登録なしで閲覧でき、
 * 連絡先の開示を依頼するときだけ無料登録（/register）へ進む。
 */

const TITLE = `ドライバー求職者の匿名プロフィール一覧｜愛知の運送会社向け｜${SERVICE_NAME}`;
const DESCRIPTION =
  "愛知県で働きたいトラックドライバー希望者の匿名プロフィール一覧。年齢（年代）・免許・運転経験・希望勤務地・希望年収を登録なしで確認できます。連絡先は本人の同意後に開示。";

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
      <section className="dt-section ds-profiles" aria-labelledby="ds-profiles-title">
        <div className="dt-container">
          <SectionHead
            eyebrow="PROFILES"
            id="ds-profiles-title"
            title="ドライバー求職者の匿名プロフィール"
            lead="個人を特定できる情報は表示していません。連絡を取りたい方がいれば、無料登録のうえ連絡先の開示を依頼できます。"
          />
          <div className="ds-profiles__count">
            <WaitingLine />
          </div>

          {profiles === null ? (
            <p className="ds-profiles__empty" role="alert">
              ただいまプロフィールを表示できません。時間をおいて、もう一度お試しください。
            </p>
          ) : profiles.length === 0 ? (
            <>
              <p className="ds-profiles__empty">
                現在、公開中のプロフィールはありません。新しい登録があり次第、ここに表示されます。
                <br />
                下は、プロフィールがどのように表示されるかの架空の例です。
              </p>
              <div className="ds-profiles__grid ds-profiles__grid--sample">
                <SampleProfileCard />
              </div>
            </>
          ) : (
            <div className="ds-profiles__grid">
              {profiles.map((p) => (
                <ProfileCard key={p.no} p={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </ScoutShell>
  );
}
