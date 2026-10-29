import { Fragment, type ComponentType, type ReactNode } from "react";
import { ArrowRight, Building2, Check, ChevronRight, Headset, HardHat, Lock, MessageCircle, UserRound } from "lucide-react";
import CountUpNumber from "@/components/saiyo-rescue/CountUpNumber";
import LegalOpener from "@/components/saiyo-rescue/LegalOpener";
import { OPERATOR } from "@/components/saiyo-rescue/config";
import type { IllustrationProps } from "@/components/saiyo-rescue/illustrations/parts";
import { DiscloseButton } from "./InterviewModal";
import {
  BlueprintSkyline,
  CrewRelief,
  IntroArrange,
  IntroBrowse,
  IntroPick,
  ProblemBusy,
  ProblemCost,
  ProblemDecline,
  ProblemUnknown,
} from "./illustrations";
import {
  BRAND,
  CREW_IMAGE,
  CTA_HREF,
  CTA_LABEL,
  CTA_LABEL_SHORT,
  CTA_POINTS,
  DELEGATE,
  FAQS,
  FINAL_CTA,
  FLOW,
  FLOW_NOTE,
  FREE_TABLE,
  HERO,
  HERO_IMAGE,
  HIDDEN_FIELDS,
  INTRO,
  PRICE,
  PRICE_EXAMPLE,
  PRICE_NOTE,
  PRICE_ROWS,
  PRICE_TBD,
  PROBLEMS,
  PROBLEMS_MORE,
  REASONS,
  RESULTS_NOTE,
  RESULTS_PERIOD,
  RESULTS_TOTAL,
  RESULTS_TOTAL_NOTE,
  RETENTION,
  SAMPLE_PROFILES,
  SITE,
  man,
  plain,
  successFee,
  yen,
  type IntroArt,
  type ProblemArt,
} from "./config";

/*
 * デザインの方針（FV画像に合わせる）
 * ・生成りの紙＋設計図の方眼・寸法線、墨色の極太見出し、オレンジのアクセント
 * ・見出しは工事看板風のラベル（番号＋英字＋日本語）とオレンジの下線
 * ・カードは墨色の太枠＋オレンジのずらし影（スタンプ風）
 */

/* ═══════════════════════ 共通部品 ═══════════════════════ */

/** "|" を <wbr>（ここで改行してよい位置）、"\n" を <br> に変換する */
function W({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split("|").map((part, i) => (
            <Fragment key={i}>
              {i > 0 && <wbr />}
              {part}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </>
  );
}

/** "**強調**" を <strong> に変換する */
function R({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return <>{parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <Fragment key={i}>{p}</Fragment>))}</>;
}

export function CtaButton({ location, size = "lg", label = CTA_LABEL }: { location: string; size?: "sm" | "lg"; label?: string }) {
  return (
    <a href={CTA_HREF} className={`sr-btn sr-btn--${size} sr-btn--primary ks-btn`} data-sr-cta={location}>
      <span>{label}</span>
      <ArrowRight className="sr-btn__arrow" aria-hidden="true" strokeWidth={2.6} />
    </a>
  );
}

function CtaPoints({ invert = false }: { invert?: boolean }) {
  return (
    <ul className={`ks-points${invert ? " ks-points--invert" : ""}`}>
      {CTA_POINTS.map((p) => (
        <li key={p}>
          <Check aria-hidden="true" strokeWidth={3} />
          {p}
        </li>
      ))}
    </ul>
  );
}

/** 料金の要点（月額0円を主役に、初期費用・成功報酬を並べる） */
function PriceSummary({ invert = false }: { invert?: boolean }) {
  return (
    <dl className={`ks-psum${invert ? " ks-psum--invert" : ""}`}>
      <div className="ks-psum__main">
        <dt>月額費用</dt>
        <dd>
          <b>{PRICE.monthly}</b>
          <span>円</span>
        </dd>
      </div>
      <div>
        <dt>初期費用</dt>
        <dd>
          <b>{yen(PRICE.initial)}</b>
          <span>円</span>
        </dd>
      </div>
      <div>
        <dt>採用決定時のみ</dt>
        <dd>
          <small>想定年収の</small>
          <b>{PRICE.successRate}</b>
          <span>%</span>
        </dd>
      </div>
    </dl>
  );
}

/** セクション見出し：工事看板風のラベル＋極太見出し＋オレンジの下線 */
function SectionHead({
  no,
  en,
  label,
  title,
  lead,
  id,
  invert = false,
}: {
  no: string;
  en: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  id: string;
  invert?: boolean;
}) {
  return (
    <header className={`ks-head${invert ? " ks-head--invert" : ""}`}>
      <p className="ks-head__label">
        <span className="ks-head__no">{no}</span>
        <span className="ks-head__en">{en}</span>
        <span className="ks-head__jp">{label}</span>
      </p>
      <h2 className="ks-head__title" id={id}>
        {title}
      </h2>
      {lead && <p className="ks-head__lead">{lead}</p>}
    </header>
  );
}

function CtaBlock({ location, lead }: { location: string; lead: string }) {
  return (
    <div className="ks-ctablock">
      <MessageCircle className="ks-ctablock__icon" aria-hidden="true" strokeWidth={2.4} />
      <p className="ks-ctablock__lead">
        <W text={lead} />
      </p>
      <CtaButton location={location} />
      <CtaPoints />
    </div>
  );
}

/* ═══════════════════════ 匿名プロフィールのカード（LP・一覧ページで共通） ═══════════════════════ */

/**
 * 架空の表示例カード。建設業の求職者はまだ登録がないため、実在の登録者と誤認されないよう
 * 「表示イメージ（架空の例）」と明記し、番号も伏せる。ボタンを押すと表示例である旨と会社の無料登録フォームが開く。
 */
export function SampleProfileCard({ rows, showButton = true }: { rows: [string, string][]; showButton?: boolean }) {
  return (
    <article className="ks-card ks-profile">
      <header className="ks-profile__head">
        <span className="ks-profile__avatar" aria-hidden="true">
          <UserRound />
        </span>
        <div>
          <p className="ks-profile__no">候補者 No.＊＊＊＊</p>
          <p className="ks-profile__sample">表示イメージ（架空の例です）</p>
        </div>
      </header>
      <dl className="ks-profile__rows">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="ks-profile__hidden">
        <dl aria-label="非公開の情報">
          {HIDDEN_FIELDS.map((f) => (
            <div key={f}>
              <dt>{f}</dt>
              <dd aria-hidden="true">●●●●●●</dd>
            </div>
          ))}
        </dl>
        <p className="ks-profile__lock">
          <Lock aria-hidden="true" />
          氏名・連絡先は表示されません。本人の同意なく企業に開示することはありません。
        </p>
        <p className="ks-profile__note">
          <Headset aria-hidden="true" />
          <span>
            <W text={`${BRAND}が|連絡し、|面接の|希望を|確認します`} />
          </span>
        </p>
        {showButton && <DiscloseButton />}
      </div>
    </article>
  );
}

/* ═══════════════════════ ヘッダー ═══════════════════════ */

export function Header({ cta = true }: { cta?: boolean }) {
  return (
    <header className="sr-header ks-header">
      <div className="sr-header__inner">
        <span className="sr-logo" aria-label={SITE.name}>
          <span className="sr-logo__mark ks-logo__mark" aria-hidden="true">
            <HardHat strokeWidth={2.4} />
          </span>
          <span className="sr-logo__text">
            採用<em>レスキュー</em>
            <span className="ks-logo__sub">建設業</span>
          </span>
        </span>
        {cta && <CtaButton size="sm" location="header" label={CTA_LABEL_SHORT} />}
      </div>
    </header>
  );
}

/* ═══════════════════════ FV ═══════════════════════ */

export function Hero() {
  return (
    <section className="ks-hero" id="hero" aria-labelledby="ks-hero-title">
      {/* 見出し・料金は画像に焼き込み済み。読み上げ・検索用にテキストでも持つ */}
      <h1 id="ks-hero-title" className="sr-visually-hidden">
        {HERO.title.join("")} {plain(HERO.body)}
      </h1>
      <picture className="ks-hero__visual">
        <source media="(max-width: 767px)" srcSet={HERO_IMAGE.sp} width={HERO_IMAGE.spW} height={HERO_IMAGE.spH} />
        <img
          className="ks-hero__img"
          src={HERO_IMAGE.pc}
          width={HERO_IMAGE.pcW}
          height={HERO_IMAGE.pcH}
          alt={HERO_IMAGE.alt}
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </picture>

      <div className="sr-container ks-hero__inner">
        <div className="ks-hero__card">
          <p className="ks-hero__body">
            <W text={HERO.body} />
          </p>
          <ul className="ks-hero__trades" aria-label="対象の職種">
            {HERO.trades.map((t) => (
              <li key={t}>{t}</li>
            ))}
            <li className="is-more">など</li>
          </ul>
          <div className="ks-hero__cta">
            <CtaButton location="hero" />
            <CtaPoints />
            <p className="ks-hero__price-note">
              ※成功報酬は、採用が決定したときに、採用した方の想定年収に対して発生します。料金の詳細は
              <a href="#pricing">料金</a>をご覧ください。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 01 サービスの仕組み ═══════════════════════ */

const INTRO_ARTS: Record<IntroArt, ComponentType<IllustrationProps>> = {
  browse: IntroBrowse,
  pick: IntroPick,
  arrange: IntroArrange,
};

export function Intro() {
  return (
    <section className="ks-section ks-intro" aria-labelledby="ks-intro-title">
      <div className="sr-container">
        <SectionHead no="01" en="SERVICE" label="サービスの仕組み" id="ks-intro-title" title={<W text={INTRO.title} />} />
        <ol className="ks-intro__steps">
          {INTRO.steps.map((s, i) => {
            const Art = INTRO_ARTS[s.art];
            return (
              <li key={s.title} className="ks-card ks-istep">
                <span className="ks-istep__no">STEP {i + 1}</span>
                <Art className="ks-istep__art" />
                <h3 className="ks-istep__title">{s.title}</h3>
                <p className="ks-istep__body">{s.body}</p>
                {i < INTRO.steps.length - 1 && <ChevronRight className="ks-istep__arrow" aria-hidden="true" strokeWidth={3} />}
              </li>
            );
          })}
        </ol>
        <p className="ks-note ks-note--center">{FLOW_NOTE}</p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 02 よくある悩み ═══════════════════════ */

const PROBLEM_ARTS: Record<ProblemArt, ComponentType<IllustrationProps>> = {
  cost: ProblemCost,
  decline: ProblemDecline,
  busy: ProblemBusy,
  unknown: ProblemUnknown,
};

export function Problems() {
  return (
    <section className="ks-section ks-problems" aria-labelledby="ks-problems-title">
      <div className="sr-container">
        <SectionHead
          no="02"
          en="PROBLEM"
          label="よくあるお悩み"
          id="ks-problems-title"
          title={<W text={"建設会社の採用で、\nこんなお悩みは|ありませんか？"} />}
        />
        <ul className="ks-problems__grid">
          {PROBLEMS.map((p, i) => {
            const Art = PROBLEM_ARTS[p.art];
            return (
              <li key={p.title} className="ks-card ks-pcard">
                <span className="ks-pcard__no" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Art className="ks-pcard__art" />
                <h3 className="ks-pcard__title">
                  <W text={p.title} />
                </h3>
                <p className="ks-pcard__body">{p.body}</p>
              </li>
            );
          })}
        </ul>
        <ul className="ks-problems__more">
          {PROBLEMS_MORE.map((m) => (
            <li key={m}>
              <Check aria-hidden="true" strokeWidth={3} />
              {m}
            </li>
          ))}
        </ul>
      </div>
      <div className="ks-turn">
        <div className="sr-container">
          <p className="ks-turn__text">
            求人を出して
            <wbr />
            待つだけでなく、
            <br />
            <strong>
              <span className="ks-chunk">会いたい人を</span>
              <span className="ks-chunk">自分で選ぶ</span>
            </strong>
            <br />
            採用に変えませんか。
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 03 使う理由・見られる情報 ═══════════════════════ */

export function Reasons() {
  return (
    <section className="ks-section ks-reasons" aria-labelledby="ks-reasons-title">
      <div className="sr-container">
        <SectionHead
          no="03"
          en="REASON"
          label="選べる理由"
          id="ks-reasons-title"
          title={<W text={"会う前に、|どんな人か|分かる。"} />}
        />
        <div className="ks-reasons__layout">
          <ol className="ks-reasons__list">
            {REASONS.map((r, i) => (
              <li key={r.title} className="ks-card ks-reason">
                <span className="ks-strengths__no">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="ks-reason__title">
                  <W text={r.title} />
                </h3>
                <p className="ks-reason__body">
                  <R text={r.body} />
                </p>
                <p className="ks-reason__example">{r.example}</p>
              </li>
            ))}
          </ol>
          <div className="ks-reasons__sample">
            <p className="ks-reasons__sample-label">求職者カードの表示例</p>
            <SampleProfileCard rows={SAMPLE_PROFILES[0].rows} showButton={false} />
          </div>
        </div>

        <h3 className="ks-subhead">
          <span>無料でできること</span>
        </h3>
        <div className="ks-table-wrap">
          <table className="ks-table ks-table--free">
            <tbody>
              {FREE_TABLE.map((r) => (
                <tr key={r.what}>
                  <th scope="row">{r.what}</th>
                  <td>{r.need}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CtaBlock location="reasons" lead="実際に、|どんな|資格・経験の|人が|いるか|確認してみませんか。" />
      </div>
    </section>
  );
}

/* ═══════════════════════ 04 入社前に話しておきたいこと ═══════════════════════ */

export function Retention() {
  return (
    <section className="ks-section ks-strengths" aria-labelledby="ks-retention-title">
      <div className="sr-container">
        <SectionHead no="04" en="RETENTION" label="長く働いてもらうために" id="ks-retention-title" invert title={<W text={RETENTION.title} />} />
        <div className="ks-strengths__intro">
          <figure className="ks-strengths__photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CREW_IMAGE.src} width={CREW_IMAGE.w} height={CREW_IMAGE.h} alt={CREW_IMAGE.alt} loading="lazy" decoding="async" />
          </figure>
          <div className="ks-strengths__checks">
            <p className="ks-retention__label">一覧で、先に分かること</p>
            <ul>
              {RETENTION.fromUs.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="ks-retention__label">面接で、会社が確かめたいこと</p>
            <ul className="is-check">
              {RETENTION.checklist.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="ks-retention__close">
          <R text={RETENTION.close} />
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 05 連絡と日程調整はお任せ ═══════════════════════ */

export function Delegate() {
  return (
    <section className="ks-section ks-delegate" aria-labelledby="ks-delegate-title">
      <div className="sr-container sr-container--narrow">
        <SectionHead no="05" en="SUPPORT" label="お任せできること" id="ks-delegate-title" title={<W text={DELEGATE.title} />} />
        <div className="ks-delegate__cols">
          <div className="ks-card ks-delegate__col">
            <p className="ks-delegate__who">
              <Building2 aria-hidden="true" />
              企業様がやること
            </p>
            <ol>
              {DELEGATE.company.map((t) => (
                <li key={t}>
                  <R text={t} />
                </li>
              ))}
            </ol>
          </div>
          <div className="ks-card ks-delegate__col is-us">
            <p className="ks-delegate__who">
              <Headset aria-hidden="true" />
              {BRAND}がやること
            </p>
            <ol>
              {DELEGATE.us.map((t) => (
                <li key={t}>
                  <R text={t} />
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="ks-note ks-note--center">{DELEGATE.note}</p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 06 運営者の実績 ═══════════════════════ */

export function Results() {
  return (
    <section className="ks-section ks-results" id="results" aria-labelledby="ks-results-title">
      <div className="sr-container">
        <SectionHead
          no="06"
          en="RESULTS"
          label="運営者の実績"
          id="ks-results-title"
          title={<W text={"求人広告で、|応募を|集めてきた|実績"} />}
          lead="運営者がこれまでに制作・運用してきた求人広告の応募獲得実績です。本サービスの登録者数や採用人数ではありません。"
        />

        <div className="ks-total">
          <p className="ks-total__cat">全案件の合計</p>
          <div className="ks-total__metrics">
            <div>
              <p className="ks-total__label">累計応募件数</p>
              <p className="ks-total__value">
                <CountUpNumber value={RESULTS_TOTAL.count} duration={1600} suffix={<span className="sr-unit">件</span>} />
              </p>
            </div>
            <div>
              <p className="ks-total__label">平均応募単価</p>
              <p className="ks-total__value">
                <CountUpNumber value={RESULTS_TOTAL.avgUnitPrice} duration={1400} delay={120} suffix={<span className="sr-unit">円</span>} />
              </p>
            </div>
          </div>
          <p className="ks-total__period">{RESULTS_PERIOD}</p>
          <p className="ks-total__note">{RESULTS_TOTAL_NOTE}</p>
        </div>

        <p className="ks-note">
          {RESULTS_PERIOD}
          <br />
          {RESULTS_NOTE}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 07 料金 ═══════════════════════ */

export function Pricing() {
  const fee = successFee(PRICE_EXAMPLE.annualIncome);
  return (
    <section className="ks-section ks-pricing" id="pricing" aria-labelledby="ks-pricing-title">
      <div className="sr-container sr-container--narrow">
        <SectionHead
          no="07"
          en="PRICE"
          label="料金"
          id="ks-pricing-title"
          title={
            <>
              月額費用は<span className="ks-hl">0円</span>。
              <br />
              <W text="成功報酬は|採用が|決まったときだけ。" />
            </>
          }
        />

        <div className="ks-plan">
          <p className="ks-plan__badge">建設業向け 採用プラン</p>
          <div className="ks-plan__monthly">
            <p className="ks-plan__label">月額費用</p>
            <p className="ks-plan__zero">
              <b>0</b>
              <span>円</span>
            </p>
          </div>
          <div className="ks-plan__rows">
            <div className="ks-plan__row">
              <p className="ks-plan__label">初期費用</p>
              <p className="ks-plan__price">
                <b>{yen(PRICE.initial)}</b>
                <span>円</span>
              </p>
            </div>
            <div className="ks-plan__row">
              <p className="ks-plan__label">採用決定時のみ</p>
              <p className="ks-plan__price">
                <small>採用した方の想定年収の</small>
                <b>{PRICE.successRate}</b>
                <span>%</span>
              </p>
            </div>
          </div>

          <div className="ks-plan__example">
            <p className="ks-plan__example-title">料金例</p>
            <p className="ks-plan__example-calc" aria-hidden="true">
              <span>
                想定年収<b>{man(PRICE_EXAMPLE.annualIncome).replace("万円", "")}</b>万円
              </span>
              <span className="op">×</span>
              <span>
                <b>{PRICE.successRate}</b>%
              </span>
              <span className="op">＝</span>
              <span className="is-total">
                成功報酬<b>{man(fee).replace("万円", "")}</b>万円
              </span>
            </p>
            <p className="ks-plan__example-text">
              想定年収{man(PRICE_EXAMPLE.annualIncome)}の方を{PRICE_EXAMPLE.hires}名採用した場合、成功報酬は{man(fee)}
              です。初期費用{yen(PRICE.initial)}円は別途かかります。
            </p>
          </div>

          <div className="ks-table-wrap ks-plan__table">
            <table className="ks-table ks-table--free">
              <tbody>
                {PRICE_ROWS.map((r) => (
                  <tr key={r.label} className={r.fixed ? undefined : "is-tbd"}>
                    <th scope="row">{r.label}</th>
                    <td>{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ks-plan__tbd">
            <p>ご契約前に明示すること</p>
            <ul>
              {PRICE_TBD.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <div className="ks-plan__cta">
            <CtaButton location="pricing" />
          </div>
        </div>

        <p className="ks-note">※{PRICE_NOTE}</p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 08 利用の流れ ═══════════════════════ */

export function Steps() {
  return (
    <section className="ks-section ks-steps" aria-labelledby="ks-steps-title">
      <div className="sr-container sr-container--narrow">
        <SectionHead no="08" en="FLOW" label="ご利用の流れ" id="ks-steps-title" title={<W text={"見るところから、|採用まで"} />} />
        <ol className="ks-steps__list">
          {FLOW.map((s, i) => (
            <li key={s.title} className="ks-step">
              <span className="ks-step__no">
                <small>STEP</small>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="ks-step__text">
                {s.tag && <span className="ks-step__tag">{s.tag}</span>}
                <h3 className="ks-step__title">
                  <W text={s.title} />
                </h3>
                <p className="ks-step__body">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="ks-note ks-note--center">{FLOW_NOTE}</p>
        <CtaBlock location="steps" lead="成功報酬が|かかるのは|採用が|決まったときだけ。|まずは|見るところから|始められます。" />
      </div>
    </section>
  );
}

/* ═══════════════════════ 09 よくある質問 ═══════════════════════ */

export function FAQ() {
  return (
    <section className="ks-section ks-faq" id="faq" aria-labelledby="ks-faq-title">
      <div className="sr-container sr-container--narrow">
        <SectionHead no="09" en="Q&A" label="よくあるご質問" id="ks-faq-title" title="よくあるご質問" />
        <div className="ks-faq__list">
          {FAQS.map((f, i) => (
            <details key={f.q} className="ks-faq__item" open={i < 3}>
              <summary>
                <span className="ks-faq__q" aria-hidden="true">
                  Q
                </span>
                <span className="ks-faq__qtext">
                  <W text={f.q} />
                </span>
              </summary>
              <div className="ks-faq__answer">
                <span className="ks-faq__a" aria-hidden="true">
                  A
                </span>
                <div>
                  {f.a.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 最終CTA ═══════════════════════ */

export function FinalCta() {
  return (
    <section className="ks-section ks-contact" id="final" aria-labelledby="ks-final-title">
      <BlueprintSkyline className="ks-contact__skyline" />
      <div className="sr-container sr-container--narrow">
        <p className="ks-contact__label">START</p>
        <h2 id="ks-final-title" className="ks-contact__title">
          <W text={FINAL_CTA.title} />
        </h2>
        <p className="ks-contact__text">
          <R text={FINAL_CTA.body} />
        </p>
        <CrewRelief className="ks-contact__art" />
        <PriceSummary invert />
        <div className="ks-final__cta">
          <CtaButton location="final" />
          <CtaPoints invert />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ フッター ═══════════════════════ */

/** 確定前に仮の内容を掲載しない（採用レスキュー本体と同じ方針） */
const PREPARING = "内容が確定次第、掲載します。お急ぎの場合は下記メールアドレスまでご連絡ください。";

const LEGAL: { id: string; title: string; items: { term: string; desc: string; href?: string }[] }[] = [
  {
    id: "operator",
    title: "運営者情報",
    items: [
      { term: "サービス名", desc: "採用レスキュー 建設業（建設業の求職者情報の公開と、求職者への連絡・面接日程の調整）" },
      { term: "運営者", desc: OPERATOR.name },
      { term: "代表者", desc: OPERATOR.representative },
      { term: "所在地", desc: OPERATOR.area },
      { term: "メールアドレス", desc: OPERATOR.email, href: `mailto:${OPERATOR.email}` },
      { term: "ホームページ", desc: OPERATOR.siteUrl, href: OPERATOR.siteUrl },
    ],
  },
  {
    id: "privacy",
    title: "プライバシーポリシー",
    items: [
      { term: "事業者", desc: `${OPERATOR.name}（代表：${OPERATOR.representative}）` },
      {
        term: "個人情報の利用目的",
        desc: "登録フォームでいただいた情報は、サービスのご案内・ご連絡・面接のご依頼への対応のためにのみ利用します。",
      },
      {
        term: "アクセス解析・広告計測",
        desc: "サービス改善と広告効果測定のため、Meta Pixel等の計測ツールおよび広告パラメータ（utm等）を利用しています。",
      },
      { term: "第三者提供", desc: "法令に基づく場合を除き、ご本人の同意なく第三者へ提供することはありません。" },
      { term: "お問い合わせ窓口", desc: OPERATOR.email, href: `mailto:${OPERATOR.email}` },
    ],
  },
  {
    id: "tokushoho",
    title: "特定商取引法に基づく表記",
    items: [
      { term: "販売事業者", desc: OPERATOR.name },
      { term: "運営統括責任者", desc: OPERATOR.representative },
      { term: "所在地", desc: `${OPERATOR.area}　※詳細はご請求があれば遅滞なく開示します` },
      { term: "電話番号", desc: "ご請求があれば遅滞なく開示します" },
      { term: "メールアドレス", desc: OPERATOR.email, href: `mailto:${OPERATOR.email}` },
      {
        term: "販売価格",
        desc: `初期費用 ${yen(PRICE.initial)}円 / 月額費用 ${PRICE.monthly}円 / 成功報酬 採用決定時に、採用した方の想定年収の${PRICE.successRate}%`,
      },
      { term: "支払時期・支払方法", desc: PREPARING },
      { term: "役務の提供時期", desc: PREPARING },
      { term: "返金について", desc: PREPARING },
    ],
  },
];

export function Footer() {
  return (
    <footer className="sr-footer ks-footer">
      <LegalOpener />
      <div className="sr-container">
        <p className="sr-footer__brand">
          採用<em>レスキュー</em> 建設業
        </p>
        <p className="sr-footer__op">
          運営：
          <a href={OPERATOR.siteUrl} target="_blank" rel="noopener">
            {OPERATOR.name}
          </a>
          （代表 {OPERATOR.representative}）
        </p>
        <nav className="sr-footer__nav" aria-label="フッター">
          <a href="#legal-operator">運営者情報</a>
          <a href={`mailto:${OPERATOR.email}`}>お問い合わせ</a>
          <a href="#legal-privacy">プライバシーポリシー</a>
          <a href="#legal-tokushoho">特定商取引法に基づく表記</a>
        </nav>
        <div className="sr-footer__legal">
          {LEGAL.map((l) => (
            <details key={l.id} id={`legal-${l.id}`} className="sr-legal">
              <summary>{l.title}</summary>
              <dl>
                {l.items.map((it) => (
                  <div key={it.term}>
                    <dt>{it.term}</dt>
                    <dd>
                      {it.href ? (
                        <a href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noopener">
                          {it.desc}
                        </a>
                      ) : (
                        it.desc
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </details>
          ))}
        </div>
        <p className="sr-footer__copy">
          © {new Date().getFullYear()} {OPERATOR.name}（採用レスキュー） All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
