import { Fragment, type ReactNode } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  Clock3,
  HardHat,
  LogOut,
  PhoneMissed,
  PhoneOff,
  SearchX,
  UserPlus,
  UserX,
  X,
  type LucideIcon,
} from "lucide-react";
import CountUpNumber from "@/components/saiyo-rescue/CountUpNumber";
import LegalOpener from "@/components/saiyo-rescue/LegalOpener";
import { OPERATOR } from "@/components/saiyo-rescue/config";
import { BlueprintSkyline } from "@/components/saiyo-rescue-kensetsu/illustrations";
import ContactForm from "./ContactForm";
import {
  COMPANY_TASKS,
  COMPARE_COLS,
  COMPARE_ROWS,
  COST,
  CTA_HREF,
  CTA_MAIN,
  CTA_SUB,
  EXAMPLE_FEE,
  FAQS,
  FINAL_TITLE,
  FLOW,
  HERO,
  PRICE,
  PRICE_FOOTNOTE,
  PRICE_LINE,
  PROBLEMS,
  RESULTS_NOTES,
  RESULTS_TOTAL,
  SCOPE,
  SCOPE_NOTE,
  SERVICE_NAME,
  SOLUTION,
  STRENGTHS,
  TRADES,
  yen,
  type ProblemIcon,
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

/** "**強調**" を <strong> に変換する */
function R({ text }: { text: string }) {
  return <>{text.split(/\*\*(.+?)\*\*/g).map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <Fragment key={i}>{p}</Fragment>))}</>;
}

function Cta({ location, label = CTA_MAIN }: { location: string; label?: string }) {
  return (
    <a href={CTA_HREF} className="sr-btn sr-btn--lg sr-btn--primary ks-btn" data-sr-cta={location}>
      <span>{label}</span>
      <ArrowRight className="sr-btn__arrow" aria-hidden="true" strokeWidth={2.6} />
    </a>
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
          <ul className="sa-hero__tags">
            {HERO.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <h1 className="sa-hero__title" id="sa-hero-title">
            <W text={HERO.title} />
          </h1>
          <p className="sa-hero__body">
            <W text={HERO.body} />
          </p>
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

/* ═══════════════════════ 経営者の悩み ═══════════════════════ */

const PROBLEM_ICONS: Record<ProblemIcon, LucideIcon> = {
  noApply: UserX,
  noResponse: SearchX,
  noContact: PhoneMissed,
  busy: Clock3,
  schedule: CalendarClock,
  young: UserPlus,
  noStaff: BriefcaseBusiness,
  decline: PhoneOff,
  site: HardHat,
  leave: LogOut,
};

export function Problems() {
  return (
    <section className="ks-section sa-problems" aria-labelledby="sa-problems-title">
      <div className="sr-container">
        <Head no="02" en="PROBLEM" label="経営者の悩み" id="sa-problems-title" title={<W text={"人が足りない。\nそれでも、|採用にかける|時間がない。"} />} />
        <ul className="sa-problems__grid">
          {PROBLEMS.map((p) => {
            const Icon = PROBLEM_ICONS[p.icon];
            return (
              <li key={p.text} className="sa-pcard">
                <span aria-hidden="true">
                  <Icon strokeWidth={2.2} />
                </span>
                <p>
                  <W text={p.text} />
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ═══════════════════════ 解決策 ═══════════════════════ */

export function Solution() {
  return (
    <section className="ks-section sa-solution" id="features" aria-labelledby="sa-solution-title">
      <div className="sr-container">
        <Head no="03" en="SOLUTION" label="サービスの特徴" id="sa-solution-title" invert title={<W text="職人採用に|必要な業務を、|企業の採用担当として|代行します。" />} />
        <div className="sa-solution__grid">
          <div className="sa-solution__col">
            <h3>{SOLUTION.ads.label}</h3>
            <ul>
              {SOLUTION.ads.items.map((t) => (
                <li key={t}>
                  <X aria-hidden="true" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="sa-solution__col is-agent">
            <h3>{SOLUTION.agent.label}</h3>
            <ul>
              {SOLUTION.agent.items.map((t) => (
                <li key={t}>
                  <Check aria-hidden="true" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="sa-solution__close">
          <R text={SOLUTION.close} />
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 代行業務の範囲 ═══════════════════════ */

export function Scope() {
  return (
    <section className="ks-section sa-scope" id="scope" aria-labelledby="sa-scope-title">
      <div className="sr-container">
        <Head no="04" en="SCOPE" label="代行業務の範囲" id="sa-scope-title" title={<W text="どこまで|任せられるか、|一目で分かります。" />} />
        <div className="sa-scope__layout">
          <ol className="sa-scope__list">
            {SCOPE.map((s, i) => (
              <li key={s.title} className={s.owner === "company" ? "is-company" : undefined}>
                <span className="sa-scope__no">{i + 1}</span>
                <span className="sa-scope__title">
                  <W text={s.title} />
                </span>
                <span className="sa-scope__owner">{s.owner === "us" ? "当社が担当" : "企業が担当"}</span>
              </li>
            ))}
          </ol>
          <aside className="sa-scope__company" aria-labelledby="sa-scope-company">
            <h3 id="sa-scope-company">企業が担当する業務</h3>
            <ul>
              {COMPANY_TASKS.map((t) => (
                <li key={t}>
                  <Check aria-hidden="true" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
            <p>{SCOPE_NOTE}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 建設業特化の強み ═══════════════════════ */

export function Strengths() {
  return (
    <section className="ks-section sa-strengths" aria-labelledby="sa-strengths-title">
      <div className="sr-container">
        <Head no="05" en="STRENGTH" label="建設業特化の強み" id="sa-strengths-title" title={<W text={"建設業の採用は、\n職種を|理解していなければ|成功しません。"} />} />
        <ol className="sa-strengths__grid">
          {STRENGTHS.map((s, i) => (
            <li key={s.title} className="ks-card">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>
                <W text={s.title} />
              </h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
        <h3 className="ks-subhead">
          <span>対応職種の例</span>
        </h3>
        <ul className="sa-trades">
          {TRADES.map((t) => (
            <li key={t}>{t}</li>
          ))}
          <li className="is-more">など</li>
        </ul>
      </div>
    </section>
  );
}

/* ═══════════════════════ 実績 ═══════════════════════ */

export function Results() {
  return (
    <section className="ks-section ks-results" id="results" aria-labelledby="sa-results-title">
      <div className="sr-container">
        <Head no="06" en="RESULTS" label="採用支援実績" id="sa-results-title" title="応募獲得実績" />
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

/* ═══════════════════════ 他の採用方法との比較 ═══════════════════════ */

export function Compare() {
  return (
    <section className="ks-section sa-compare" aria-labelledby="sa-compare-title">
      <div className="sr-container">
        <Head no="07" en="COMPARE" label="他の採用方法との比較" id="sa-compare-title" title={<W text="採用方法ごとの|違い" />} />
        {/* スマホでは横スクロールさせず、行ごとの縦型カードに切り替える */}
        <table className="sa-compare__table">
          <thead>
            <tr>
              <th scope="col">比較項目</th>
              {COMPARE_COLS.map((c, i) => (
                <th key={c} scope="col" className={i === 2 ? "is-agent" : undefined}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                {r.values.map((v, i) => (
                  <td key={i} data-label={COMPARE_COLS[i]} className={i === 2 ? "is-agent" : undefined}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
          {FAQS.map((f) => (
            <details key={f.q} className="ks-faq__item" open>
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
