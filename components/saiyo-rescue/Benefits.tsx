import {
  Archive,
  Heart,
  JapaneseYen,
  Layers,
  Route,
  Store,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { CtaBlock, SectionHead } from "./ui";
import { ApplicantsGather, Celebrate, ChosenCompany, Comparing } from "./illustrations";
import { BENEFITS, DESIGN_POINTS, MEDIA_VS_LP, SEEKER_FEELINGS, type BenefitIcon } from "./config";

const ICONS: Record<BenefitIcon, LucideIcon> = {
  up: TrendingUp,
  yen: JapaneseYen,
  heart: Heart,
  target: Target,
  route: Route,
  asset: Archive,
  team: Users,
  layers: Layers,
};

/** 価値の提案。機能ではなく「応募したくなる理由を作る」という結果を中心に見せる */
export default function Benefits() {
  return (
    <section className="sr-section sr-benefits" aria-labelledby="sr-benefits-title">
      <div className="sr-container">
        <SectionHead
          eyebrow="VALUE"
          id="sr-benefits-title"
          title={
            <>
              採用レスキューは、
              <br />
              <span className="sr-marker">「応募したくなる理由」</span>
              <br className="sr-sp-only" />
              を作ります。
            </>
          }
        />

        <div className="sr-benefits__intro">
          {/* 比較されても「自社」が選ばれる＝応募したくなる理由がある状態 */}
          <ChosenCompany className="sr-benefits__art" />
          <p>
            会社側が伝えたいことを並べるのではなく、
            <br className="sr-pc-only" />
            求職者が次のように思う<strong>順番</strong>でページを設計します。
          </p>
          <ul className="sr-benefits__feelings">
            {SEEKER_FEELINGS.map((f) => (
              <li key={f}>「{f}」</li>
            ))}
          </ul>
        </div>

        <div className="sr-design">
          <p className="sr-design__title">
            具体的には、
            <br className="sr-sp-only" />
            次の5つを設計します。
          </p>
          <ol className="sr-design__list">
            {DESIGN_POINTS.map((d, i) => (
              <li key={d}>
                <span className="sr-design__no">{String(i + 1).padStart(2, "0")}</span>
                <span className="sr-design__text">{d}</span>
              </li>
            ))}
          </ol>
          <p className="sr-design__after">
            これらを整理したうえで、
            <br className="sr-sp-only" />
            LPを制作します。
          </p>
        </div>

        <h3 className="sr-subhead">採用レスキューで得られること</h3>
        <ul className="sr-benefits__grid">
          {BENEFITS.map((b) => {
            const Icon = ICONS[b.icon];
            return (
              <li key={b.title} className="sr-bcard">
                <span className="sr-bcard__icon" aria-hidden="true">
                  <Icon strokeWidth={2.2} />
                </span>
                <p className="sr-bcard__title">{b.title}</p>
              </li>
            );
          })}
        </ul>

        <div className="sr-vs">
          <h3 className="sr-vs__title">
            求人媒体は<span className="sr-vs__em-gray">「場所」</span>です。
            <br />
            採用LPは<span className="sr-vs__em-blue">「営業マン」</span>です。
          </h3>

          <div className="sr-vs__cols">
            <div className="sr-vs__col sr-vs__col--media">
              <Comparing className="sr-vs__art" />
              <p className="sr-vs__label">
                <Store aria-hidden="true" />
                求人媒体だけ ＝ {MEDIA_VS_LP.media.role}
              </p>
              <ul>
                {MEDIA_VS_LP.media.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div className="sr-vs__col sr-vs__col--lp">
              <ApplicantsGather className="sr-vs__art" />
              <p className="sr-vs__label">
                <UserCheck aria-hidden="true" />
                採用LP ＝ {MEDIA_VS_LP.lp.role}
              </p>
              <p className="sr-vs__lp-lead">自社の魅力を1ページでしっかり伝え、</p>
              <ul>
                {MEDIA_VS_LP.lp.points.map((p) => (
                  <li key={p}>「{p}」</li>
                ))}
              </ul>
              <p className="sr-vs__lp-lead">まで伝えることで、応募につながる可能性を高めます。</p>
            </div>
          </div>
        </div>

        <CtaBlock location="benefits" art={<Celebrate />} lead={
            <>
              貴社の「応募したくなる理由」を、
              <br />
              一緒に整理しませんか？
            </>
          } />
      </div>
    </section>
  );
}
