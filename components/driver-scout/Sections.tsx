import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Check,
  Headset,
  CircleCheck,
  ClipboardCheck,
  Clock,
  Eye,
  FileSignature,
  GraduationCap,
  Handshake,
  HeartHandshake,
  JapaneseYen,
  Lock,
  MessageCircle,
  Package,
  PhoneCall,
  Route,
  Search,
  UserCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Fragment, type ComponentType, type ReactNode } from "react";
import type { IllustrationProps } from "../driver-company/lp/illustrations/kit";
import { OPERATOR, PATHS, SHOW_NOTICE_NUMBER } from "@/config/driver-company";
import { OwnerQuestion } from "../driver-company/lp/illustrations/scenes";
import { Breakable, Rich, SectionHead } from "../driver-company/lp/ui";
import {
  ACHIEVEMENTS,
  ACHIEVEMENTS_NOTE,
  ACHIEVEMENT_ROWS,
  AD_VIDEOS,
  COMPARE,
  CTA_REASONS,
  DELEGATE,
  FAQS,
  FINAL_CTA,
  FLOW,
  FLOW_NOTE,
  FREE_TABLE,
  HERO_PRICES,
  HIDDEN_FIELDS,
  INTRO,
  PRICE_ROWS,
  PRICE_TBD,
  PROBLEMS,
  PROBLEMS_GOAL,
  REASONS,
  RETENTION,
  SAMPLE_PROFILE,
  SERVICE_KIND,
  SERVICE_NAME,
} from "./content";
import {
  ProblemNoDriver,
  ProblemOverload,
  ProblemOwnerDrives,
  ProblemRepeat,
  ProblemTurnDown,
  SceneChoose,
  SceneContact,
  SceneInterview,
  SceneLook,
} from "./illustrations";
import AdVideo from "./AdVideo";
import { ScoutCta } from "./ui";

/**
 * 企業向けLPの各セクション。順番は page.tsx で並べる：
 * FV → 1 何のサービスか → 2 悩み → 3 使う理由 → 4 見られる情報（CTA） → 5 入社前に話すこと
 * → 6 流れ → 7 料金（CTA） → 8 実績の説明 → 9 よくある質問 → 10 最後のCTA
 * 文言はすべて ./content.ts。
 */

/** 押す理由をボタンの直前に添えたCTA */
function CtaBlock({ location, reason }: { location: string; reason: ReactNode }) {
  return (
    <div className="ds-ctabox">
      <p className="ds-ctabox__reason">{typeof reason === "string" ? <Breakable text={reason} /> : reason}</p>
      <ScoutCta location={location} />
    </div>
  );
}

/** 候補者カード（表示例）。highlight の項目だけ強調して「どこを見るか」を示す */
function SampleCard({ highlight = [], compact = false }: { highlight?: readonly string[]; compact?: boolean }) {
  const rows = SAMPLE_PROFILE.filter(([k]) => k !== "更新日");
  return (
    <div className={`ds-scard${compact ? " is-compact" : ""}`}>
      <div className="ds-scard__head">
        <span className="ds-scard__avatar" aria-hidden="true">
          <UserRound />
        </span>
        <p className="ds-scard__no">候補者 No.＊＊＊＊</p>
        <span className="ds-scard__tag">表示例</span>
      </div>
      <dl className="ds-scard__rows">
        {rows.map(([k, v]) => (
          <div key={k} className={highlight.includes(k) ? "is-hl" : undefined}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="ds-scard__lock">
        <Lock aria-hidden="true" />
        氏名・連絡先は本人の同意後に表示
      </p>
    </div>
  );
}

/** 見出し：「\n」で必ず改行し、「|」の位置でだけ折り返す */
function Heading({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={line}>
          {i > 0 && <br />}
          <Breakable text={line} />
        </Fragment>
      ))}
    </>
  );
}

/* ═══════════════════════ 1. ファーストビュー ═══════════════════════ */

/**
 * ファーストビュー。見出し・写真・運営者の実績は画像に焼き込み済みで、
 * スマホ用（941×1672）とPC用（1672×941）を <picture> で出し分ける。
 * 差し替えは public/images/driver/scout/fv-sp.webp / fv-pc.webp を置き換える。
 * 画像の文字は検索エンジンや読み上げに伝わらないため、同じ内容を見えない h1 に持たせる。
 * 料金とCTAは画像の直下にHTMLで置く。
 */
export function Hero() {
  return (
    <section className="ds-hero" id="top" aria-labelledby="ds-hero-title">
      <h1 className="dt-visually-hidden" id="ds-hero-title">
        人が残り続けるドライバー採用。仕事を断らない採用へ。愛知県の運送会社さま向け{SERVICE_KIND}。
      </h1>
      <picture>
        <source media="(max-width: 767px)" srcSet="/images/driver/scout/fv-sp.webp" width={941} height={1672} />
        <img
          className="ds-hero__img"
          src="/images/driver/scout/fv-pc.webp"
          width={1672}
          height={941}
          alt={`運営者の実績：${ACHIEVEMENTS.map((a) => `${a.label}${a.value.toLocaleString("ja-JP")}${a.unit}`).join("、")}（${ACHIEVEMENTS_NOTE}）`}
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </picture>

      <div className="ds-hero__below">
        <dl className="ds-hero__price" aria-label="料金">
          {HERO_PRICES.map((p) => (
            <div key={p.label} className={p.pre ? "is-fee" : undefined}>
              <dt>{p.label}</dt>
              <dd>
                {p.pre && <small>{p.pre}</small>}
                <b>{p.num}</b>
                {p.unit}
              </dd>
            </div>
          ))}
        </dl>
        <div className="ds-hero__cta">
          <ScoutCta location="hero" />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 1. 何のサービスか ═══════════════════════ */

const INTRO_SCENES = [SceneLook, SceneChoose, SceneContact];

export function Intro() {
  return (
    <section className="dt-section ds-intro" aria-labelledby="ds-intro-title">
      <div className="dt-container">
        <SectionHead eyebrow="ドラテクとは" id="ds-intro-title" title={<Heading text={INTRO.title} />} />
        <div className="ds-intro__body">
          {INTRO.body.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
        <ol className="ds-steps3" aria-label="利用の概要">
          {INTRO.steps.map((st, i) => {
            const Scene = INTRO_SCENES[i];
            return (
              <li key={st.title}>
                <Scene className="ds-steps3__art" />
                <p className="ds-steps3__title">
                  <span className="ds-steps3__no">{i + 1}</span>
                  {st.title}
                </p>
                <p className="ds-steps3__sub">{st.body}</p>
              </li>
            );
          })}
        </ol>
        <p className="ds-intro__note">{INTRO.note}</p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 2. 経営者の悩み ═══════════════════════ */

const PROBLEM_ARTS: Record<(typeof PROBLEMS)[number]["icon"], ComponentType<IllustrationProps>> = {
  phoneOff: ProblemTurnDown,
  truck: ProblemNoDriver,
  repeat: ProblemRepeat,
  load: ProblemOverload,
  wheel: ProblemOwnerDrives,
};

export function Problems() {
  return (
    <section className="dt-section ds-problems2" aria-labelledby="ds-problems-title">
      <div className="dt-container">
        <SectionHead eyebrow="こんなお悩み" id="ds-problems-title" title={<Breakable text="人が|足りない|ことで、|こんな|悩みは|ありませんか？" />} />
        <ul className="ds-pgrid">
          {PROBLEMS.map((p) => {
            const Art = PROBLEM_ARTS[p.icon];
            return (
              <li key={p.text}>
                <Art className="ds-pgrid__art" />
                <p>{p.text}</p>
              </li>
            );
          })}
        </ul>
        <p className="ds-goal">
          <ArrowRight aria-hidden="true" />
          {PROBLEMS_GOAL}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 3. 使う理由 ═══════════════════════ */

export function Reasons() {
  return (
    <section className="dt-section ds-reasons" aria-labelledby="ds-reasons-title">
      <div className="dt-container">
        <SectionHead eyebrow="ドラテクを使う理由" id="ds-reasons-title" title={<Breakable text="応募を|待つだけでなく、|面接したい|人を|選べます。" />} />
        <div className="ds-reasons__list">
          {REASONS.map((r, i) => (
            <article key={r.title} className={`ds-reason${i % 2 ? " is-rev" : ""}`}>
              <div className="ds-reason__text">
                <p className="ds-reason__no">理由 {["①", "②"][i]}</p>
                <h3>
                  <Breakable text={r.title} />
                </h3>
                <p>{r.body}</p>
                <p className="ds-reason__ex">{r.example}</p>
              </div>
              <figure className="ds-reason__screen">
                <SampleCard highlight={r.highlight} compact />
                <figcaption>画面の表示例（架空）。色の付いた項目が、ここで確認する情報です。</figcaption>
              </figure>
            </article>
          ))}

          <article className="ds-reason ds-reason--table">
            <div className="ds-reason__text">
              <p className="ds-reason__no">理由 ③</p>
              <h3>
                <Breakable text="まずは|無料で、|どんな|人が|いるか|見られる" />
              </h3>
              <p>候補者の情報は、登録なしで見られます。会社情報の登録が必要になるのは、面接を希望するときです。</p>
            </div>
            <div className="ds-free" role="table" aria-label="無料でできることと、必要な手続き">
              <div className="ds-free__row ds-free__row--head" role="row">
                <span role="columnheader">できること</span>
                <span role="columnheader">必要なこと</span>
              </div>
              {FREE_TABLE.map((row, i) => (
                <div key={row.what} className={`ds-free__row${i === 0 ? " is-free" : ""}`} role="row">
                  <span role="cell">{row.what}</span>
                  <span role="cell">
                    <b>{row.need}</b>
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 4. 見られる情報 ═══════════════════════ */

export function Visible() {
  return (
    <section className="dt-section ds-visible2" id="profile" aria-labelledby="ds-visible-title">
      <div className="dt-container dt-container--narrow">
        <SectionHead eyebrow="見られる情報" id="ds-visible-title" title={<Breakable text="まずは、|こんな|情報を|確認できます。" />} />
        <div className="ds-visible2__grid">
          <SampleCard />
          <div className="ds-visible2__side">
            <p className="ds-visible2__lead">
              一覧ページでは、候補者ごとにこのカードが表示されます。<b>表示例は架空の内容です。</b>
            </p>
            <div className="ds-hidebox">
              <p className="ds-hidebox__title">
                <Lock aria-hidden="true" />
                氏名や連絡先は、本人の同意後に表示されます。
              </p>
              <ul>
                {HIDDEN_FIELDS.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <CtaBlock location="profile" reason={CTA_REASONS.profile} />
      </div>
    </section>
  );
}

/* ═══════════════════════ 連絡と面接の日程調整（お任せ） ═══════════════════════ */

export function Delegate() {
  return (
    <section className="dt-section ds-delegate" id="delegate" aria-labelledby="ds-delegate-title">
      <div className="dt-container dt-container--narrow">
        <SectionHead eyebrow="連絡と日程調整" id="ds-delegate-title" title={<Breakable text={DELEGATE.title} />} />
        <div className="ds-intro__body">
          {DELEGATE.body.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>

        {/* 企業 → ドラテク → 求職者 の役割の図 */}
        <ol className="ds-relay" aria-label="連絡の流れ">
          <li>
            <span className="ds-relay__icon" aria-hidden="true">
              <Building2 />
            </span>
            <b>企業様</b>
            <span>面接したい人と確認したい内容を伝える</span>
          </li>
          <li className="is-us">
            <span className="ds-relay__icon" aria-hidden="true">
              <Headset />
            </span>
            <b>ドラテク</b>
            <span>連絡・確認事項の聞き取り・日程調整</span>
          </li>
          <li>
            <span className="ds-relay__icon" aria-hidden="true">
              <UserRound />
            </span>
            <b>求職者</b>
            <span>会社と仕事内容を聞き、面接するか決める</span>
          </li>
        </ol>

        <div className="ds-roles">
          <div className="ds-split__box is-company">
            <p className="ds-split__who">
              <Building2 aria-hidden="true" />
              企業様がすること
            </p>
            <ul className="ds-checklist">
              {DELEGATE.company.map((t) => (
                <li key={t}>
                  <Check aria-hidden="true" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="ds-split__box">
            <p className="ds-split__who">
              <Headset aria-hidden="true" />
              ドラテクがすること
            </p>
            <ul className="ds-checklist">
              {DELEGATE.us.map((t) => (
                <li key={t}>
                  <Check aria-hidden="true" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="ds-goal">
          <ArrowRight aria-hidden="true" />
          {DELEGATE.note}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 5. 人が残る採用 ═══════════════════════ */

const CHECK_ICONS: Record<(typeof RETENTION.checklist)[number]["icon"], LucideIcon> = {
  clock: Clock,
  route: Route,
  box: Package,
  yen: JapaneseYen,
  study: GraduationCap,
  heart: HeartHandshake,
};

export function Retention() {
  return (
    <section className="dt-section ds-retention" aria-labelledby="ds-retention-title">
      <div className="dt-container dt-container--narrow">
        <SectionHead eyebrow="人が残る採用のために" id="ds-retention-title" title={<Breakable text={RETENTION.title} />} />
        <div className="ds-retention__top">
          <SceneInterview className="ds-retention__art" />
          <div className="ds-intro__body">
            {RETENTION.body.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </div>

        <p className="ds-split__who">
          <ClipboardCheck aria-hidden="true" />
          面接で、会社が確認すること
        </p>
        <ul className="ds-icongrid">
          {RETENTION.checklist.map((c) => {
            const Icon = CHECK_ICONS[c.icon];
            return (
              <li key={c.text}>
                <span aria-hidden="true">
                  <Icon />
                </span>
                {c.text}
              </li>
            );
          })}
        </ul>

        <div className="ds-split__box">
          <p className="ds-split__who">
            <Search aria-hidden="true" />
            ドラテクで、会う前に分かること
          </p>
          <ul className="ds-tags">
            {RETENTION.fromUs.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <p className="ds-goal">
          <MessageCircle aria-hidden="true" />
          {RETENTION.close}
        </p>
        <p className="ds-small">{RETENTION.note}</p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 6. 利用の流れ ═══════════════════════ */

const FLOW_ICONS: LucideIcon[] = [Eye, UserCheck, Building2, FileSignature, PhoneCall, CalendarCheck, Handshake];

export function Flow() {
  return (
    <section className="dt-section ds-flow2" id="flow" aria-labelledby="ds-flow-title">
      <div className="dt-container">
        <SectionHead eyebrow="利用の流れ" id="ds-flow-title" title={<Breakable text="見るところから、|採用までの|流れ。" />} />
        <p className="ds-flownote">
          <CircleCheck aria-hidden="true" />
          {FLOW_NOTE}
        </p>
        <ol className="ds-flow3">
          {FLOW.map((f, i) => {
            const Icon = FLOW_ICONS[i];
            return (
              <li key={f.title} className={f.tag === "ここで契約" ? "is-key" : f.tag === "採用決定で費用" ? "is-fee" : undefined}>
                <span className="ds-flow3__icon" aria-hidden="true">
                  <Icon />
                </span>
                <div className="ds-flow3__main">
                  <p className="ds-flow3__title">
                    <span>{i + 1}</span>
                    <Breakable text={f.title} />
                    {f.tag && <em>{f.tag}</em>}
                  </p>
                  <dl className="ds-flow3__lanes">
                    <div>
                      <dt>会社</dt>
                      <dd>{f.company}</dd>
                    </div>
                    <div className="is-us">
                      <dt>ドラテク</dt>
                      <dd>{f.us}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ═══════════════════════ 採用費用の比較 ═══════════════════════ */

type CompareCell = { big?: string; pre?: string; text?: string; tax?: string };

function CompareValue({ c }: { c: CompareCell }) {
  return (
    <>
      {c.pre && <span className="ds-cmp__pre">{c.pre}</span>}
      {c.big && <b className="ds-cmp__big">{c.big}</b>}
      {c.text && <span className="ds-cmp__text">{c.text}</span>}
      {c.tax && <span className="ds-cmp__tax">※{c.tax}</span>}
    </>
  );
}

export function Compare() {
  return (
    <section className="dt-section ds-compare" id="compare" aria-labelledby="ds-compare-title">
      <div className="dt-container dt-container--narrow">
        <SectionHead eyebrow="採用費用の比較" id="ds-compare-title" title={<Breakable text={COMPARE.title} />} lead={COMPARE.lead} />

        <table className="ds-cmp">
          <caption className="dt-visually-hidden">中途採用1人あたりの平均採用コスト（調査値）と、ドラテクの料金例</caption>
          <thead>
            <tr>
              <td className="ds-cmp__corner" aria-hidden="true" />
              <th scope="col">{COMPARE.cols[0]}</th>
              <th scope="col" className="is-ours">
                {COMPARE.cols[1]}
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARE.rows.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                <td>
                  <CompareValue c={r.survey} />
                </td>
                <td className="is-ours">
                  <CompareValue c={r.ours} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ds-cmp__notes">
          <p>{COMPARE.note}</p>
          <p className="ds-cmp__caution">{COMPARE.caution}</p>
          <p className="ds-cmp__source">
            出典：
            <a href={COMPARE.source.url} target="_blank" rel="noopener noreferrer">
              {COMPARE.source.title}
            </a>
            <br />
            {COMPARE.source.detail}
          </p>
        </div>

        <CtaBlock location="compare" reason={COMPARE.ctaTitle} />
      </div>
    </section>
  );
}

/* ═══════════════════════ 7. 料金 ═══════════════════════ */

/** 費用がかかるタイミング（見る→登録→契約→採用決定）。採用決定のところだけ費用が出る */
const FEE_STEPS = [
  { label: "見る", fee: "0円", icon: Eye },
  { label: "登録", fee: "0円", icon: Building2 },
  { label: "契約", fee: "0円", icon: FileSignature },
  { label: "採用決定", fee: "10％", icon: Handshake },
] as const;

export function Pricing() {
  return (
    <section className="dt-section ds-pricing2" id="pricing" aria-labelledby="ds-pricing-title">
      <div className="dt-container dt-container--narrow">
        <SectionHead eyebrow="料金" id="ds-pricing-title" title={<Breakable text="見るのは無料。|費用がかかる条件も、|先に確認できます。" />} />

        <ol className="ds-feeline" aria-label="費用がかかるタイミング">
          {FEE_STEPS.map((f, i) => {
            const Icon = f.icon;
            const paid = i === FEE_STEPS.length - 1;
            return (
              <li key={f.label} className={paid ? "is-paid" : undefined}>
                <span className="ds-feeline__icon" aria-hidden="true">
                  <Icon />
                </span>
                <span className="ds-feeline__label">{f.label}</span>
                <b className="ds-feeline__fee">{f.fee}</b>
                {paid && <span className="ds-feeline__sub">想定年収の</span>}
              </li>
            );
          })}
        </ol>

        <dl className="ds-ptable">
          {PRICE_ROWS.map((r) => (
            <div key={r.label} className={r.fixed ? undefined : "is-tbd"}>
              <dt>{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>

        <div className="ds-tbd">
          <p className="ds-tbd__title">このほか、ご契約前に明示する項目</p>
          <ul>
            {PRICE_TBD.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <CtaBlock location="pricing" reason={CTA_REASONS.pricing} />
      </div>
    </section>
  );
}

/* ═══════════════════════ 8. 実績の説明 ═══════════════════════ */

export function AboutResults() {
  return (
    <section className="dt-section ds-results" aria-labelledby="ds-results-title">
      <div className="dt-container dt-container--narrow">
        <SectionHead eyebrow="実績について" id="ds-results-title" title={<Breakable text="ページ上部の|実績は、|運営者の|これまでの|採用支援の|実績です。" />} />
        <div className="ds-rtable">
          {ACHIEVEMENT_ROWS.map((r) => (
            <div key={r.label} className="ds-rtable__row">
              <p className="ds-rtable__label">{r.label}</p>
              <p>{r.means}</p>
              <p className="ds-rtable__not">※{r.not}</p>
            </div>
          ))}
        </div>
        <div className="ds-ads">
          <h3 className="ds-ads__title">
            <Breakable text={AD_VIDEOS.title} />
          </h3>
          <p className="ds-ads__lead">{AD_VIDEOS.lead}</p>
          <ul className="ds-ads__list" aria-label="ドライバー求人の動画広告の例">
            {AD_VIDEOS.items.map((v) => (
              <li key={v.id} className="ds-ads__item">
                <AdVideo src={`/videos/saiyo-rescue/${v.id}.mp4`} poster={`/images/saiyo-rescue/ad-${v.id}.webp`} label={`${v.media}の動画広告`} />
                <div className="ds-ads__meta">
                  <p className="ds-ads__media">{v.media}</p>
                  <p className="ds-ads__count">
                    応募実績 <b>{v.count.toLocaleString("ja-JP")}</b>人
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="ds-ads__hint">← 横にスクロールして他の動画を見る →</p>
          <p className="ds-ads__note">{AD_VIDEOS.note}</p>
        </div>
        <p className="ds-small">
          ドラテクは新しく始めたサービスのため、現在の登録者数は一覧ページの表示がすべてです。導入事例・お客様の声は、確認できたものから掲載します。
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 9. よくある質問 ═══════════════════════ */

export function Faq() {
  return (
    <section className="dt-section dt-faq" aria-labelledby="ds-faq-title">
      <div className="dt-container dt-container--narrow">
        <OwnerQuestion className="dt-faq__art" />
        <SectionHead id="ds-faq-title" title="よくある質問" />
        <div className="ds-faq">
          {FAQS.map((f, i) => (
            <details key={f.q} className="ds-faq__item" open={i < 2}>
              <summary>
                <span className="ds-faq__q" aria-hidden="true">
                  Q
                </span>
                {f.q}
              </summary>
              <div className="ds-faq__a">
                {f.a.map((p) => (
                  <p key={p}>
                    <Rich text={p} />
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 10. 最後のCTA ═══════════════════════ */

export function FinalCta() {
  return (
    <section className="dt-section ds-final" aria-labelledby="ds-final-title">
      <div className="dt-container dt-container--narrow">
        <h2 className="ds-final__title" id="ds-final-title">
          <Breakable text={FINAL_CTA.title} />
        </h2>
        <p className="ds-final__body">{FINAL_CTA.body}</p>
        <ScoutCta location="final" />
      </div>
    </section>
  );
}

/* ═══════════════════════ フッター ═══════════════════════ */

/** 事業者情報は config/driver-company.ts に値が入っている項目だけ表示する（未確定の情報は出さない） */
export function Footer() {
  const rows: [string, string][] = [
    ["事業者名", OPERATOR.name],
    ["所在地", OPERATOR.address],
    ["電話番号", OPERATOR.phone],
    ["メールアドレス", OPERATOR.email],
  ];
  if (SHOW_NOTICE_NUMBER) rows.push(["届出受理番号", OPERATOR.noticeNumber]);
  const shown = rows.filter(([, v]) => v);
  return (
    <footer className="dt-footer">
      <div className="dt-container">
        <p className="ds-footer__brand">
          {SERVICE_NAME}｜運送会社向け {SERVICE_KIND}
        </p>
        {shown.length > 0 && (
          <dl className="dt-footer__info">
            {shown.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
        <nav className="dt-footer__nav" aria-label="ポリシー">
          <Link href={PATHS.privacy}>個人情報保護方針</Link>
        </nav>
        <p className="dt-footer__copy">© 2026 {SERVICE_NAME} All Rights Reserved.</p>
      </div>
    </footer>
  );
}
