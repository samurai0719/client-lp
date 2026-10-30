import { Fragment, type ReactNode } from "react";
import { ArrowRight, Building2, Headset } from "lucide-react";
import CountUpNumber from "@/components/saiyo-rescue/CountUpNumber";
import LegalOpener from "@/components/saiyo-rescue/LegalOpener";
import { OPERATOR } from "@/components/saiyo-rescue/config";
import type { ComponentType } from "react";
import { BlueprintSkyline, CrewRelief } from "@/components/saiyo-rescue-kensetsu/illustrations";
import {
  BeforeAfterIllustration,
  DeclinedProjectIllustration,
  LostApplicantIllustration,
  MissedCallIllustration,
  NoApplicantIllustration,
  ProblemOwnerIllustration,
  ScheduleConflictIllustration,
  ServiceFlowIllustration,
} from "./characters";
import ContactForm from "./ContactForm";
import {
  BEFORE_AFTER,
  COMPANY_TASKS,
  COST,
  CREW_IMAGE,
  CTA_HREF,
  CTA_MAIN,
  CTA_SUB,
  EXAMPLE_FEE,
  FAQS,
  FINAL_TITLE,
  FLOW,
  HERO,
  OWNER_LABEL,
  PRICE,
  PRICE_FOOTNOTE,
  PRICE_LINE,
  RESULTS_NOTES,
  RESULTS_TOTAL,
  SCOPE,
  SCOPE_NOTE,
  SERVICE_FLOW,
  SERVICE_NAME,
  STRENGTHS,
  TRADES,
  WORRY,
  yen,
  type WorryArt,
} from "./config";

/* ═══════════════════════ 共通部品 ═══════════════════════ */

/** "|" を <wbr>（改行してよい位置）、"\n" を <br> に変換する */
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

function Cta({ location, label = CTA_MAIN }: { location: string; label?: string }) {
  return (
    <a href={CTA_HREF} className="sr-btn sr-btn--lg sr-btn--primary ks-btn" data-sr-cta={location}>
      <span>{label}</span>
      <ArrowRight className="sr-btn__arrow" aria-hidden="true" strokeWidth={2.6} />
    </a>
  );
}

/** 料金の要点（最終CTA） */
function PriceSummary() {
  return (
    <dl className="ks-psum ks-psum--invert">
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
        <dt>採用成功時</dt>
        <dd>
          <small>想定年収の</small>
          <b>{PRICE.rate}</b>
          <span>%</span>
        </dd>
      </div>
    </dl>
  );
}

function Head({ no, en, label, title, lead, id, invert = false }: { no: string; en: string; label: string; title: ReactNode; lead?: ReactNode; id: string; invert?: boolean }) {
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

/* ═══════════════════════ FV ═══════════════════════ */

export function Hero() {
  const { image } = HERO;
  return (
    <section className="sa-hero" id="hero" aria-labelledby="sa-hero-title">
      <picture className="sa-hero__visual">
        <source media="(max-width: 767px)" srcSet={image.sp.src} width={image.sp.w} height={image.sp.h} />
        <img src={image.pc.src} width={image.pc.w} height={image.pc.h} alt={image.alt} fetchPriority="high" loading="eager" decoding="async" />
      </picture>
      <div className="sr-container">
        <div className="sa-hero__copy">
          <p className="sa-hero__label">{HERO.label}</p>
          <h1 className="sa-hero__title" id="sa-hero-title">
            <W text={HERO.title} />
          </h1>
          <ol className="sa-hero__steps">
            {HERO.steps.map((st, i) => (
              <li key={st.text} className={`is-${st.owner}`}>
                <span>{i + 1}</span>
                <b>{st.who}</b>
                <p>{st.text}</p>
              </li>
            ))}
          </ol>
          <p className="sa-hero__price">
            {PRICE_LINE.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </p>
          <div className="sa-hero__cta">
            <Cta location="hero" />
            <p className="sa-hero__sub">{CTA_SUB}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 採用コスト比較 ═══════════════════════ */

function CostCard({ data, featured = false }: { data: (typeof COST)["survey"] | (typeof COST)["agent"]; featured?: boolean }) {
  return (
    <article className={`sa-cost-card${featured ? " is-agent" : ""}`}>
      <h3>{data.name}</h3>
      <p className="sa-cost-card__note">{data.note}</p>
      <p className="sa-cost-card__big">{data.big}</p>
      <dl>
        {data.rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function Cost() {
  return (
    <section className="ks-section sa-cost" aria-labelledby="sa-cost-title">
      <div className="sr-container">
        <Head no="01" en="COST" label="採用コストの比較" id="sa-cost-title" title={<W text={COST.title} />} lead={COST.lead} />
        <div className="sa-cost__grid">
          <CostCard data={COST.survey} />
          <CostCard data={COST.agent} featured />
        </div>
        <ul className="sa-cost__notes">
          {COST.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <dl className="sa-cost__calc" aria-label="想定年収400万円の場合の計算例">
          {COST.calc.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="sa-cost__diff">
          <W text={COST.diff} />
        </p>
        <div className="sa-center">
          <Cta location="cost" label={COST.cta} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ お悩みエリア ═══════════════════════ */

const WORRY_ARTS: Record<WorryArt, ComponentType<{ className?: string }>> = {
  noApplicant: NoApplicantIllustration,
  missedCall: MissedCallIllustration,
  lost: LostApplicantIllustration,
  conflict: ScheduleConflictIllustration,
  declined: DeclinedProjectIllustration,
};

export function Worry() {
  return (
    <section className="ks-section sa-worry" id="worry" aria-labelledby="sa-worry-title">
      <div className="sr-container">
        <Head no="02" en="PROBLEM" label="よくあるお悩み" id="sa-worry-title" title={<W text={WORRY.title} />} lead={WORRY.lead} />
        <ProblemOwnerIllustration className="sa-worry__owner" />
        <ul className="ks-problems__grid sa-worry__grid">
          {WORRY.items.map((w, i) => {
            const Art = WORRY_ARTS[w.art];
            return (
              <li key={w.text} className="ks-card ks-pcard">
                <span className="ks-pcard__no" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Art className="ks-pcard__art" />
                <h3 className="ks-pcard__title">
                  <W text={w.text} />
                </h3>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ═══════════════════════ サービス全体図 ═══════════════════════ */

export function ServiceFlow() {
  return (
    <section className="ks-section ks-reasons" id="service" aria-labelledby="sa-flow-title">
      <div className="sr-container">
        <Head no="03" en="SERVICE" label="サービスの仕組み" id="sa-flow-title" title={<W text={SERVICE_FLOW.title} />} lead={SERVICE_FLOW.lead} />
        <ol className="ks-intro__steps sa-flow__grid">
          {SERVICE_FLOW.steps.map((st, i) => (
            <li key={st.text} className="ks-card ks-istep">
              <span className="ks-istep__no">STEP {i + 1}</span>
              <ServiceFlowIllustration step={i + 1} className="ks-istep__art" />
              <h3 className="ks-istep__title">
                <W text={st.text} />
              </h3>
              <p className={`sa-flow__owner is-${st.owner}`}>{OWNER_LABEL[st.owner]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ═══════════════════════ Before／After ═══════════════════════ */

export function BeforeAfter() {
  const { before, after } = BEFORE_AFTER;
  return (
    <section className="ks-section ks-delegate" aria-labelledby="sa-ba-title">
      <div className="sr-container">
        <Head no="04" en="BEFORE / AFTER" label="採用業務の変化" id="sa-ba-title" title={<W text="社長の仕事が、|ここまで変わります。" />} />
        <div className="sa-ba__grid">
          <article className="ks-card sa-ba__col">
            <p className="sa-ba__tag">Before</p>
            <h3>
              <W text={before.title} />
            </h3>
            <BeforeAfterIllustration variant="before" className="sa-ba__art" />
            <ul className="ks-hero__trades sa-ba__list">
              {before.items.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
          <article className="ks-card sa-ba__col">
            <p className="sa-ba__tag is-after">After</p>
            <h3>
              <W text={after.title} />
            </h3>
            <BeforeAfterIllustration variant="after" className="sa-ba__art" />
            <h4>{after.usLabel}</h4>
            <ul className="ks-hero__trades sa-ba__list">
              {after.us.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <h4>{after.companyLabel}</h4>
            <ul className="ks-hero__trades sa-ba__list is-company">
              {after.company.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 代行業務の範囲 ═══════════════════════ */

export function Scope() {
  return (
    <section className="ks-section ks-delegate" id="scope" aria-labelledby="sa-scope-title">
      <div className="sr-container sr-container--narrow">
        <Head no="05" en="SCOPE" label="代行業務の範囲" id="sa-scope-title" title={<W text="担当範囲の|詳細" />} />
        <div className="ks-delegate__cols">
          <div className="ks-card ks-delegate__col is-us">
            <p className="ks-delegate__who">
              <Headset aria-hidden="true" />
              職人採用エージェントが担当する業務
            </p>
            <ol>
              {SCOPE.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </div>
          <div className="ks-card ks-delegate__col">
            <p className="ks-delegate__who">
              <Building2 aria-hidden="true" />
              企業が担当する業務
            </p>
            <ol>
              {COMPANY_TASKS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </div>
        </div>
        <p className="ks-note ks-note--center">{SCOPE_NOTE}</p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 建設業特化の強み ═══════════════════════ */

export function Strengths() {
  return (
    <section className="ks-section ks-strengths" aria-labelledby="sa-strengths-title">
      <div className="sr-container">
        <Head no="06" en="STRENGTH" label="建設業特化の強み" id="sa-strengths-title" invert title={<W text={"建設業の採用は、\n職種を|理解していなければ|成功しません。"} />} />
        <div className="ks-strengths__intro">
          <figure className="ks-strengths__photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CREW_IMAGE.src} width={CREW_IMAGE.w} height={CREW_IMAGE.h} alt={CREW_IMAGE.alt} loading="lazy" decoding="async" />
          </figure>
          <div className="ks-strengths__checks">
            <p className="ks-retention__label">対応職種の例</p>
            <ul>
              {TRADES.map((t) => (
                <li key={t}>{t}</li>
              ))}
              <li>など</li>
            </ul>
          </div>
        </div>
        <ol className="ks-strengths__list">
          {STRENGTHS.map((s, i) => (
            <li key={s.title}>
              <span className="ks-strengths__no">{String(i + 1).padStart(2, "0")}</span>
              <h3>
                <W text={s.title} />
              </h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ═══════════════════════ 実績 ═══════════════════════ */

export function Results() {
  return (
    <section className="ks-section ks-results" id="results" aria-labelledby="sa-results-title">
      <div className="sr-container">
        <Head no="07" en="RESULTS" label="採用支援実績" id="sa-results-title" title="応募獲得実績" />
        <div className="ks-total">
          <p className="ks-total__cat">合計応募獲得数</p>
          <p className="sa-total__value">
            <CountUpNumber value={RESULTS_TOTAL} duration={1600} suffix={<span className="sr-unit">件</span>} />
          </p>
          <p className="sa-total__note">{RESULTS_NOTES[0]}</p>
        </div>
        <p className="sa-results__note">{RESULTS_NOTES[1]}</p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 料金 ═══════════════════════ */

export function Pricing() {
  return (
    <section className="ks-section ks-pricing" id="pricing" aria-labelledby="sa-pricing-title">
      <div className="sr-container sr-container--narrow">
        <Head no="08" en="PRICE" label="料金" id="sa-pricing-title" title={<W text={"料金は、|シンプルに|3つだけ。"} />} />
        <div className="ks-plan">
          <div className="ks-plan__monthly">
            <p className="ks-plan__label">月額費用</p>
            <p className="ks-plan__zero">
              <b>{PRICE.monthly}</b>
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
              <p className="ks-plan__label">採用成功報酬</p>
              <p className="ks-plan__price">
                <small>想定年収の</small>
                <b>{PRICE.rate}</b>
                <span>%</span>
              </p>
            </div>
          </div>
          <div className="ks-plan__example">
            <p className="ks-plan__example-title">計算例</p>
            <p className="sa-example">想定年収400万円の場合、採用成功報酬は{yen(EXAMPLE_FEE / 10000)}万円</p>
          </div>
          <div className="ks-plan__cta">
            <Cta location="pricing" label="自社の場合の料金を相談する" />
          </div>
        </div>
        <p className="sa-footnote">{PRICE_FOOTNOTE}</p>
      </div>
    </section>
  );
}

/* ═══════════════════════ ご利用の流れ ═══════════════════════ */

export function Flow() {
  return (
    <section className="ks-section ks-steps" id="flow" aria-labelledby="sa-flow-title">
      <div className="sr-container sr-container--narrow">
        <Head no="09" en="FLOW" label="ご利用の流れ" id="sa-flow-title" title="ご利用の流れ" />
        <ol className="ks-steps__list">
          {FLOW.map((t, i) => (
            <li key={t} className="ks-step">
              <span className="ks-step__no">
                <small>STEP</small>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="ks-step__text sa-step__text">
                <h3 className="ks-step__title">{t}</h3>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ═══════════════════════ よくある質問 ═══════════════════════ */

export function FAQ() {
  return (
    <section className="ks-section ks-faq" id="faq" aria-labelledby="sa-faq-title">
      <div className="sr-container sr-container--narrow">
        <Head no="10" en="Q&A" label="よくある質問" id="sa-faq-title" title="よくある質問" />
        <div className="ks-faq__list">
          {FAQS.map((f, i) => (
            <details key={f.q} className="ks-faq__item" open={i < 3}>
              <summary>
                <span className="ks-faq__q" aria-hidden="true">
                  Q
                </span>
                <span className="ks-faq__qtext">{f.q}</span>
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

/* ═══════════════════════ 最終CTA・フォーム ═══════════════════════ */

export function Contact() {
  return (
    <section className="ks-section ks-contact" aria-labelledby="sa-final-title">
      <BlueprintSkyline className="ks-contact__skyline" />
      <div className="sr-container sr-container--narrow">
        <h2 id="sa-final-title" className="ks-contact__title">
          <W text={FINAL_TITLE} />
        </h2>
        <CrewRelief className="ks-contact__art" />
        <PriceSummary />
        <div className="sa-center sa-final-cta">
          <Cta location="final" />
          <p>{CTA_SUB}</p>
        </div>
        <div className="sa-form-card" id="contact">
          <h3>{CTA_MAIN}</h3>
          <p>電話ではなく、このフォームからご相談いただけます。</p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ フッター ═══════════════════════ */

const PREPARING = "内容が確定次第、掲載します。お急ぎの場合は下記メールアドレスまでご連絡ください。";

const LEGAL: { id: string; title: string; items: { term: string; desc: string; href?: string }[] }[] = [
  {
    id: "operator",
    title: "運営者情報",
    items: [
      { term: "サービス名", desc: `${SERVICE_NAME}（建設業特化型の採用代行）` },
      { term: "運営者", desc: OPERATOR.name },
      { term: "代表者", desc: OPERATOR.representative },
      { term: "所在地", desc: OPERATOR.area },
      { term: "メールアドレス", desc: OPERATOR.email, href: `mailto:${OPERATOR.email}` },
      { term: "ホームページ", desc: OPERATOR.siteUrl, href: OPERATOR.siteUrl },
    ],
  },
  {
    id: "privacy",
    title: "個人情報保護方針",
    items: [
      { term: "事業者", desc: `${OPERATOR.name}（代表：${OPERATOR.representative}）` },
      { term: "個人情報の利用目的", desc: "相談フォームでいただいた情報は、ご相談への回答・ご提案・ご連絡のためにのみ利用します。" },
      { term: "アクセス解析・広告計測", desc: "サービス改善と広告効果測定のため、Meta Pixel等の計測ツールおよび広告パラメータ（utm等）を利用しています。" },
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
      { term: "販売価格", desc: `初期費用 ${yen(PRICE.initial)}円 / 月額費用 ${PRICE.monthly}円 / 採用成功報酬 想定年収の${PRICE.rate}%` },
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
        <p className="sr-footer__brand">{SERVICE_NAME}</p>
        <p className="sr-footer__op">
          運営：
          <a href={OPERATOR.siteUrl} target="_blank" rel="noopener">
            {OPERATOR.name}
          </a>
          （代表 {OPERATOR.representative}）
        </p>
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
          © {new Date().getFullYear()} {OPERATOR.name} All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
