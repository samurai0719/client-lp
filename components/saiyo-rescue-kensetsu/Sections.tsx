import { Fragment, type ComponentType, type ReactNode } from "react";
import { ArrowRight, Check, HardHat, MessageCircle } from "lucide-react";
import CountUpNumber from "@/components/saiyo-rescue/CountUpNumber";
import LegalOpener from "@/components/saiyo-rescue/LegalOpener";
import { OPERATOR } from "@/components/saiyo-rescue/config";
import type { IllustrationProps } from "@/components/saiyo-rescue/illustrations/parts";
import ContactForm from "./ContactForm";
import {
  BlueprintSkyline,
  CrewRelief,
  Meeting,
  ProblemBusy,
  ProblemCost,
  ProblemDecline,
  ProblemWriting,
  ServiceAds,
  ServiceCreative,
  ServiceImprove,
  ServiceLp,
} from "./illustrations";
import {
  CONSTRUCTION_RESULT,
  CREW_IMAGE,
  CTA_HREF,
  CTA_LABEL,
  CTA_LABEL_SHORT,
  FAQS,
  FORM_REASSURE,
  HERO,
  HERO_IMAGE,
  OTHER_RESULTS,
  PRICE,
  PRICE_EXAMPLE,
  PRICING_NOTES,
  PROBLEMS,
  PROBLEMS_MORE,
  RESULTS_NOTE,
  RESULTS_PERIOD,
  RESULTS_TOTAL,
  RESULTS_TOTAL_NOTE,
  SEEKER_CHECKS,
  SERVICES,
  SHOW_CLIENT_NAMES,
  SITE,
  STEPS,
  STRENGTHS,
  man,
  plain,
  successFee,
  yen,
  type ProblemArt,
  type ServiceIcon,
} from "./config";

/*
 * デザインの方針（FV画像に合わせる）
 * ・生成りの紙＋設計図の方眼・寸法線、墨色の極太見出し、オレンジのアクセント
 * ・見出しは工事看板風のラベル（番号＋英字＋日本語）とオレンジの下線
 * ・カードは墨色の太枠＋オレンジのずらし影（スタンプ風）
 */

/* ═══════════════════════ 共通部品 ═══════════════════════ */

/** "|" を <wbr>（ここで改行してよい位置）に変換する。.ks-nowrap-word と組み合わせて使う */
function W({ text }: { text: string }) {
  return (
    <>
      {text.split("|").map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {part}
        </Fragment>
      ))}
    </>
  );
}

function CtaButton({ location, size = "lg", label = CTA_LABEL }: { location: string; size?: "sm" | "lg"; label?: string }) {
  return (
    <a href={CTA_HREF} className={`sr-btn sr-btn--${size} sr-btn--primary ks-btn`} data-sr-cta={location}>
      <span>{label}</span>
      <ArrowRight className="sr-btn__arrow" aria-hidden="true" strokeWidth={2.6} />
    </a>
  );
}

/** 料金の要点（月額0円を主役に、初期費用・成果報酬を並べる） */
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
        <dt>成果報酬</dt>
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

function CtaBlock({ location, lead }: { location: string; lead: ReactNode }) {
  return (
    <div className="ks-ctablock">
      <MessageCircle className="ks-ctablock__icon" aria-hidden="true" strokeWidth={2.4} />
      <p className="ks-ctablock__lead">{lead}</p>
      <CtaButton location={location} />
      <p className="ks-ctablock__note">相談無料｜月額費用0円</p>
    </div>
  );
}

/* ═══════════════════════ ヘッダー ═══════════════════════ */

export function Header() {
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
        <CtaButton size="sm" location="header" label={CTA_LABEL_SHORT} />
      </div>
    </header>
  );
}

/* ═══════════════════════ 1. ファーストビュー ═══════════════════════ */

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
          <p className="ks-hero__body"><W text={HERO.body} /></p>
          <ul className="ks-hero__trades" aria-label="対象の職種">
            {HERO.trades.map((t) => (
              <li key={t}>{t}</li>
            ))}
            <li className="is-more">など</li>
          </ul>
          <div className="ks-hero__cta">
            <CtaButton location="hero" />
            <p className="ks-hero__reassure">
              <Check aria-hidden="true" strokeWidth={3} />
              <span>{HERO.reassure}</span>
            </p>
            <p className="ks-hero__price-note">
              ※成果報酬は採用した方の想定年収に対する割合です。料金の詳細は<a href="#pricing">料金プラン</a>をご覧ください。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 2. よくある悩み ═══════════════════════ */

const PROBLEM_ARTS: Record<ProblemArt, ComponentType<IllustrationProps>> = {
  cost: ProblemCost,
  decline: ProblemDecline,
  busy: ProblemBusy,
  writing: ProblemWriting,
};

export function Problems() {
  return (
    <section className="ks-section ks-problems" aria-labelledby="ks-problems-title">
      <div className="sr-container">
        <SectionHead
          no="01"
          en="PROBLEM"
          label="よくあるお悩み"
          id="ks-problems-title"
          title={
            <>
              建設会社の採用で、
              <br />
              こんなお悩みは
              <br className="sr-sp-only" />
              ありませんか？
            </>
          }
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
                <h3 className="ks-pcard__title"><W text={p.title} /></h3>
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
            人が足りないのは、
            <wbr />
            会社の魅力が
            <wbr />
            ないからとは
            <wbr />
            限りません。
            <br />
            <strong>
              <span className="ks-chunk">求職者に</span>
              <span className="ks-chunk">「届いていない」</span>
              <span className="ks-chunk">「伝わっていない」</span>
            </strong>
            <br />
            だけかもしれません。
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 3. 実績 ═══════════════════════ */

export function Results() {
  return (
    <section className="ks-section ks-results" id="results" aria-labelledby="ks-results-title">
      <div className="sr-container">
        <SectionHead
          no="02"
          en="RESULTS"
          label="これまでの実績"
          id="ks-results-title"
          title={
            <>
              これまでの
              <br className="sr-sp-only" />
              応募獲得実績
            </>
          }
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

        <h3 className="ks-subhead">
          <span>内訳</span>
        </h3>

        <div className="ks-card ks-feature">
          <p className="ks-feature__cat">
            <HardHat aria-hidden="true" strokeWidth={2.6} />
            {CONSTRUCTION_RESULT.label}
          </p>
          <div className="ks-feature__metrics">
            <div>
              <p className="ks-feature__label">応募件数</p>
              <p className="ks-feature__value">
                <CountUpNumber value={CONSTRUCTION_RESULT.count} duration={1200} suffix={<span className="sr-unit">件</span>} />
              </p>
            </div>
            <div>
              <p className="ks-feature__label">応募単価</p>
              <p className="ks-feature__value">
                <CountUpNumber value={CONSTRUCTION_RESULT.unitPrice} duration={1200} delay={120} suffix={<span className="sr-unit">円</span>} />
              </p>
            </div>
          </div>
        </div>

        <div className="ks-others">
          <h4 className="ks-others__title">
            建設業以外の職種での
            <wbr />
            応募獲得実績
          </h4>
          <p className="ks-others__lead">以下は建設業ではなく、看護師・ドライバー・薬剤師などの求人での実績です。</p>
          <div className="ks-table-wrap">
            <table className="ks-table">
              <thead>
                <tr>
                  <th scope="col">職種・案件</th>
                  <th scope="col">応募件数</th>
                  <th scope="col">応募単価</th>
                </tr>
              </thead>
              <tbody>
                {OTHER_RESULTS.map((r) => (
                  <tr key={r.name}>
                    <th scope="row">
                      <span className="ks-table__cat">{r.category}</span>
                      {SHOW_CLIENT_NAMES ? r.name : r.anon}
                    </th>
                    <td>
                      <b>{yen(r.count)}</b>件
                    </td>
                    <td>
                      <b>{yen(r.unitPrice)}</b>円
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="ks-note">
          {RESULTS_PERIOD}
          <br />
          {RESULTS_NOTE}
        </p>

        <CtaBlock
          location="results"
          lead={
            <>
              自社の求人でも
              <wbr />
              応募を集められるか、
              <br />
              まずは
              <wbr />
              相談してみませんか？
            </>
          }
        />
      </div>
    </section>
  );
}

/* ═══════════════════════ 4. サービス内容 ═══════════════════════ */

const SERVICE_ARTS: Record<ServiceIcon, ComponentType<IllustrationProps>> = {
  lp: ServiceLp,
  creative: ServiceCreative,
  ads: ServiceAds,
  improve: ServiceImprove,
};

export function Services() {
  return (
    <section className="ks-section ks-services" id="service" aria-labelledby="ks-services-title">
      <div className="sr-container">
        <SectionHead
          no="03"
          en="SERVICE"
          label="サービス内容"
          id="ks-services-title"
          title={
            <>
              採用LPの制作から
              <br className="sr-sp-only" />
              広告運用・改善まで
            </>
          }
          lead={<W text="職人・現場スタッフからの|応募獲得に向けて、|次の4つを|まとめて|お手伝いします。" />}
        />
        <ol className="ks-services__grid">
          {SERVICES.map((s) => {
            const Art = SERVICE_ARTS[s.icon];
            return (
              <li key={s.no} className="ks-card ks-scard">
                <div className="ks-scard__visual">
                  <Art className="ks-scard__art" />
                  <span className="ks-scard__no" aria-hidden="true">
                    {s.no}
                  </span>
                </div>
                <div className="ks-scard__text">
                  <h3 className="ks-scard__title">{s.title}</h3>
                  <p className="ks-scard__body">{s.body}</p>
                  <ul className="ks-scard__points">
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="ks-note ks-note--center">※採用人数・採用までの期間・応募単価を保証するサービスではありません。</p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 5. 取り組みと強み ═══════════════════════ */

export function Strengths() {
  return (
    <section className="ks-section ks-strengths" aria-labelledby="ks-strengths-title">
      <div className="sr-container">
        <SectionHead
          no="04"
          en="STRENGTH"
          label="取り組みと強み"
          id="ks-strengths-title"
          invert
          title={
            <>
              応募獲得に向けた
              <br className="sr-sp-only" />
              取り組みと強み
            </>
          }
        />

        <div className="ks-strengths__intro">
          <figure className="ks-strengths__photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CREW_IMAGE.src} width={CREW_IMAGE.w} height={CREW_IMAGE.h} alt={CREW_IMAGE.alt} loading="lazy" decoding="async" />
          </figure>
          <div className="ks-strengths__checks">
            <p>職人・現場スタッフは、求人を見るときに次のようなことを気にしています。</p>
            <ul>
              {SEEKER_CHECKS.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p>
              給与や勤務地だけでなく、<strong>こうした疑問に先回りして答える</strong>ことで、「ここなら話を聞いてみたい」と思ってもらえる求人を目指します。
            </p>
          </div>
        </div>

        <ol className="ks-strengths__list">
          {STRENGTHS.map((s, i) => (
            <li key={s.title}>
              <span className="ks-strengths__no">{String(i + 1).padStart(2, "0")}</span>
              <h3><W text={s.title} /></h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ═══════════════════════ 6. 料金プラン ═══════════════════════ */

export function Pricing() {
  const fee = successFee(PRICE_EXAMPLE.annualIncome);
  return (
    <section className="ks-section ks-pricing" id="pricing" aria-labelledby="ks-pricing-title">
      <div className="sr-container sr-container--narrow">
        <SectionHead
          no="05"
          en="PRICE"
          label="料金プラン"
          id="ks-pricing-title"
          title={
            <>
              月額費用は<span className="ks-hl">0円</span>。
              <br />
              料金は初期費用と
              <br className="sr-sp-only" />
              成果報酬だけ。
            </>
          }
        />

        <div className="ks-plan">
          <p className="ks-plan__badge">建設業向け 採用支援プラン</p>
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
              <p className="ks-plan__label">成果報酬</p>
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
                成果報酬<b>{man(fee).replace("万円", "")}</b>万円
              </span>
            </p>
            <p className="ks-plan__example-text">
              想定年収{man(PRICE_EXAMPLE.annualIncome)}の方を{PRICE_EXAMPLE.hires}名採用した場合、成果報酬は{man(fee)}
              です。初期費用{yen(PRICE.initial)}円は別途かかります。
            </p>
          </div>

          <p className="ks-plan__includes-title">ご提供内容</p>
          <ul className="ks-plan__includes">
            {SERVICES.map((s) => (
              <li key={s.no}>
                <Check aria-hidden="true" strokeWidth={3} />
                {s.title}
              </li>
            ))}
          </ul>

          <div className="ks-plan__cta">
            <CtaButton location="pricing" />
          </div>
        </div>

        <ul className="ks-pricing__notes">
          {PRICING_NOTES.map((n) => (
            <li key={n}>※{n}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ═══════════════════════ 7. 相談から開始までの流れ ═══════════════════════ */

export function Steps() {
  return (
    <section className="ks-section ks-steps" aria-labelledby="ks-steps-title">
      <div className="sr-container sr-container--narrow">
        <SectionHead
          no="06"
          en="FLOW"
          label="ご相談から開始まで"
          id="ks-steps-title"
          title={
            <>
              ご相談から
              <br className="sr-sp-only" />
              開始までの流れ
            </>
          }
        />
        <Meeting className="ks-steps__art" />
        <ol className="ks-steps__list">
          {STEPS.map((s) => (
            <li key={s.no} className="ks-step">
              <span className="ks-step__no">
                <small>STEP</small>
                {s.no}
              </span>
              <div className="ks-step__text">
                <h3 className="ks-step__title"><W text={s.title} /></h3>
                <p className="ks-step__body">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <CtaBlock
          location="steps"
          lead={
            <>
              まずは、
              <wbr />
              今の求人の状況を
              <br className="sr-sp-only" />
              お聞かせください。
            </>
          }
        />
      </div>
    </section>
  );
}

/* ═══════════════════════ 8. よくある質問 ═══════════════════════ */

export function FAQ() {
  return (
    <section className="ks-section ks-faq" id="faq" aria-labelledby="ks-faq-title">
      <div className="sr-container sr-container--narrow">
        <SectionHead no="07" en="Q&A" label="よくあるご質問" id="ks-faq-title" title="よくあるご質問" />
        <div className="ks-faq__list">
          {FAQS.map((f, i) => (
            <details key={f.q} className="ks-faq__item" open={i < 3}>
              <summary>
                <span className="ks-faq__q" aria-hidden="true">
                  Q
                </span>
                <span className="ks-faq__qtext"><W text={f.q} /></span>
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

/* ═══════════════════════ 9. 問い合わせフォーム ═══════════════════════ */

export function Contact() {
  return (
    <section className="ks-section ks-contact" aria-labelledby="ks-contact-title">
      <BlueprintSkyline className="ks-contact__skyline" />
      <div className="sr-container sr-container--narrow">
        <p className="ks-contact__label">CONTACT</p>
        <h2 id="ks-contact-title" className="ks-contact__title">
          人が足りないまま、
          <br />
          仕事を
          <wbr />
          <span>断り続けますか？</span>
        </h2>
        <p className="ks-contact__text">
          職人・現場スタッフの
          <wbr />
          採用について、
          <br className="sr-sp-only" />
          まずは
          <wbr />
          無料でご相談ください。
        </p>
        <CrewRelief className="ks-contact__art" />
        <PriceSummary invert />

        <div className="ks-form-card" id="contact">
          <p className="ks-form-card__title">
            建設業の採用について
            <br />
            <span>無料相談する</span>
          </p>
          <p className="ks-form-card__lead">現在の採用状況をお聞かせください。</p>
          <ContactForm />
          <div className="ks-form-card__reassure">
            {FORM_REASSURE.map((r) => (
              <p key={r}>
                <Check aria-hidden="true" strokeWidth={3} />
                <span>{r}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ フッター ═══════════════════════ */

/** 確定前に仮の内容を掲載しない（採用レスキュー本体と同じ方針） */
const PREPARING = "内容が確定次第、掲載します。お急ぎの場合はお問い合わせフォームよりご連絡ください。";

const LEGAL: { id: string; title: string; items: { term: string; desc: string; href?: string }[] }[] = [
  {
    id: "operator",
    title: "運営者情報",
    items: [
      { term: "サービス名", desc: "採用レスキュー 建設業（採用LP制作・広告運用による応募獲得支援）" },
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
        desc: "お問い合わせフォームでいただいた情報は、ご相談への回答・ご提案・ご連絡のためにのみ利用します。",
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
        desc: `初期費用 ${yen(PRICE.initial)}円 / 月額費用 ${PRICE.monthly}円 / 成果報酬 採用した方の想定年収の${PRICE.successRate}%`,
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
          <a href={CTA_HREF}>お問い合わせ</a>
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
