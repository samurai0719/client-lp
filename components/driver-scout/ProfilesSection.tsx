import { Breakable, SectionHead } from "@/components/driver-company/lp/ui";
import type { AnonymousProfile } from "@/lib/driverCandidates/profiles";
import { ProfileCard, SampleProfileCard } from "./Profiles";
import { WaitingLine } from "./waiting";

/**
 * 匿名プロフィール一覧のセクション。一覧ページ（/profiles）と、
 * 一覧をいきなり見せる1ページLP（/drivers、物理ルート /driver/scout-direct）の両方で使う。
 * profiles が null のときは取得失敗、0件のときは架空の表示例を出す。
 */
export default function ProfilesSection({ profiles }: { profiles: AnonymousProfile[] | null }) {
  return (
    <section className="dt-section ds-profiles" id="profiles" aria-labelledby="ds-profiles-title">
      <div className="dt-container">
        <SectionHead
          eyebrow="PROFILES"
          id="ds-profiles-title"
          title={<Breakable text="ドライバー求職者の|プロフィール" />}
          lead="個人を特定できる情報は表示していません。気になる方がいれば「無料でこの方について問い合わせする」からお問い合わせください。ご契約後、ドラテクが求職者に連絡し、面接の日程を調整します。"
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
  );
}
