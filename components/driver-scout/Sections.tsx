import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  ClipboardCheck,
  Clock,
  Eye,
  FileSignature,
  GraduationCap,
  HeartHandshake,
  JapaneseYen,
  Lock,
  Package,
  PhoneCall,
  Route,
  Search,
  ShieldCheck,
  Unlock,
  UserCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import { OPERATOR, PATHS, SHOW_NOTICE_NUMBER } from "@/config/driver-company";
import type { IllustrationProps } from "../driver-company/lp/illustrations/kit";
import {
  ACHIEVEMENTS,
  COMPARE,
  CTA_REASONS,
  FAQ_HEAD,
  FAQS,
  FINAL_CTA,
  FLOW,
  FLOW_NOTE,
  HERO,
  HIDDEN_FIELDS,
  INTRO,
  PRICE_ROWS,
  PRICE_TBD,
  PRICING_HEAD,
  PROBLEMS,
  PROBLEMS_GOAL,
  PROBLEMS_HEAD,
  RETENTION,
  SAMPLE_PROFILE,
  SERVICE_KIND,
  SERVICE_NAME,
  USAGE,
  VISIBLE_HEAD,
  VISIBLE_NOTES,
} from "./content";
import FaqList from "./FaqList";
import { ProblemOverload, ProblemOwnerDrives, ProblemRepeat, ProblemTurnDown, SceneInterview } from "./illustrations";
import { ScoutCta } from "./ui";

/**
 * 企業向けLPの各セクション（FV → 01〜09）。並びは page.tsx。文言は ./content.ts、見た目と動きは ./scout-lp.css。
 * 動きは Motion.tsx が data-reveal / data-lines / data-count / data-play の要素に is-in を付けて始める。
 */

const d = (sec: number) => ({ "--d": `${sec}s` }) as CSSProperties;

/** 行ごとに下から出る大きな見出し */
function Lines({ lines, as: Tag = "h2", id, className = "lp-title" }: { lines: readonly string[]; as?: "h1" | "h2"; id?: string; className?: string }) {
  return (
    <Tag className={className} id={id} data-lines="">
      {lines.map((l, i) => (
        <span key={l} className="ln" style={{ "--i": i } as CSSProperties}>
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  );
}

/** 「01 —— ドラテクとは」＋大きな見出し＋リード */
function Head({ no, label, lines, id, lead, invert = false }: { no: string; label: string; lines: readonly string[]; id: string; lead?: ReactNode; invert?: boolean }) {
  return (
    <header className={`lp-head${invert ? " is-invert" : ""}`}>
      <p className="lp-head__no" data-reveal="">
        <span>{no}</span>
        <i aria-hidden="true" />
        {label}
      </p>
      <Lines lines={lines} id={id} />
      {lead && (
        <p className="lp-lead" data-reveal="" style={d(0.18)}>
          {lead}
        </p>
      )}
    </header>
  );
}

/** 背景でゆっくり流れる縁取り文字（装飾。読み上げない） */
function Marquee({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`lp-marquee ${className}`} aria-hidden="true">
      <div className="lp-marquee__track">
        {[0, 1].map((k) => (
          <span key={k}>{`${text}　`.repeat(4)}</span>
        ))}
      </div>
    </div>
  );
}

/** 押す理由をボタンの直前に添えたCTA */
function CtaBlock({ location, reason, invert = false }: { location: string; reason: ReactNode; invert?: boolean }) {
  return (
    <div className={`lp-cta${invert ? " is-invert" : ""}`} data-reveal="">
      <p className="lp-cta__reason">{reason}</p>
      <ScoutCta location={location} />
    </div>
  );
}

/** 候補者カード（表示例）。項目は /profiles のカードと同じ */
function SampleCard({ highlight = [] }: { highlight?: readonly string[] }) {
  const rows = SAMPLE_PROFILE.filter(([k]) => k !== "更新日");
  return (
    <div className="ds-scard">
      <div className="ds-scard__head">
        <span className="ds-scard__avatar" aria-hidden="true">
          <UserRound />
        </span>
        <p className="ds-scard__no">候補者 No.＊＊＊＊</p>
        <span className="ds-scard__tag">表示例</span>
      </div>
      <dl className="ds-scard__rows">
        {rows.map(([k, v]) => (
          <div key={k} className={highlight.includes(k) ? "is-hl" : undefined} data-key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="ds-scard__lock" data-key="lock">
        <Lock aria-hidden="true" />
        氏名・連絡先は本人の同意後に表示
      </p>
    </div>
  );
}

/* ═══════════════════════ ファーストビュー ═══════════════════════ */

/**
 * 最新FVの写真・コピー・実績を、写真（文字なしの fv-photo.webp）とHTMLの文字に分けて組み直したもの。
 * 読み込み時に「写真 → 見出し1行目 → 2行目 → 説明 → CTA → 実績」が短い時間差で現れる（ローディング画面は置かない）。
 */
export function Hero() {
  return (
    <section className="lp-hero" id="top" aria-labelledby="lp-hero-title">
      <div className="lp-hero__photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/driver/scout/fv-photo.webp"
          width={941}
          height={600}
          alt="笑顔で話す運送会社の社長とドライバー"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </div>
      <div className="lp-hero__body">
        <p className="lp-hero__eyebrow">{HERO.eyebrow}</p>
        <h1 className="lp-hero__title" id="lp-hero-title">
          <span className="ln" style={{ "--i": 0 } as CSSProperties}>
            <span>{HERO.lines[0]}</span>
          </span>
          <span className="ln" style={{ "--i": 1 } as CSSProperties}>
            <span>
              <em>採用</em>へ。
            </span>
          </span>
        </h1>
        <p className="lp-hero__sub">{HERO.sub}</p>
        <div className="lp-hero__cta">
          <ScoutCta location="hero" />
        </div>
      </div>

      <div className="lp-hero__results">
        <p className="lp-hero__rtitle">{HERO.resultsTitle}</p>
        <ul>
          {ACHIEVEMENTS.map((a) => (
            <li key={a.label}>
              <span className="lp-hero__rlabel">{a.label}</span>
              <span className="lp-hero__rnum">
                <b data-count={a.value} data-count-delay="700">
                  {a.value.toLocaleString("ja-JP")}
                </b>
                <small>{a.unit}</small>
              </span>
            </li>
          ))}
        </ul>
        <p className="lp-hero__rnote">{HERO.resultsNote}</p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 01 ドラテクとは ═══════════════════════ */

/** 3段階の画面イメージ（見る → 選ぶ → 連絡）。線でつなぎ、順番に強調する */
function ServiceFlow() {
  return (
    <ol className="lp-sflow" data-play="" aria-label="サービスの流れ">
      <li className="lp-sflow__step" style={{ "--s": 0 } as CSSProperties}>
        <div className="lp-screen" aria-hidden="true">
          <div className="lp-screen__bar" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="lp-screen__row">
              <span className="lp-screen__ava" />
              <span className="lp-screen__lines">
                <i />
                <i />
              </span>
              <span className="lp-screen__chip">大型</span>
            </div>
          ))}
        </div>
        <p className="lp-sflow__verb">
          <span>1</span>
          {INTRO.steps[0].title}
        </p>
        <p className="lp-sflow__sub">{INTRO.steps[0].body}</p>
      </li>
      <li className="lp-sflow__link" aria-hidden="true" style={{ "--s": 0 } as CSSProperties}>
        <svg viewBox="0 0 80 12" preserveAspectRatio="none">
          <path d="M2 6 H74" />
          <path d="M68 1 L76 6 L68 11" />
        </svg>
      </li>
      <li className="lp-sflow__step" style={{ "--s": 1 } as CSSProperties}>
        <div className="lp-screen" aria-hidden="true">
          <div className="lp-screen__bar" />
          {[0, 1, 2].map((i) => (
            <div key={i} className={`lp-screen__row${i === 1 ? " is-pick" : ""}`}>
              <span className="lp-screen__ava" />
              <span className="lp-screen__lines">
                <i />
                <i />
              </span>
              {i === 1 ? (
                <span className="lp-screen__check">
                  <Check strokeWidth={3.4} />
                </span>
              ) : (
                <span className="lp-screen__chip">中型</span>
              )}
            </div>
          ))}
        </div>
        <p className="lp-sflow__verb">
          <span>2</span>
          {INTRO.steps[1].title}
        </p>
        <p className="lp-sflow__sub">{INTRO.steps[1].body}</p>
      </li>
      <li className="lp-sflow__link" aria-hidden="true" style={{ "--s": 1 } as CSSProperties}>
        <svg viewBox="0 0 80 12" preserveAspectRatio="none">
          <path d="M2 6 H74" />
          <path d="M68 1 L76 6 L68 11" />
        </svg>
      </li>
      <li className="lp-sflow__step" style={{ "--s": 2 } as CSSProperties}>
        <div className="lp-screen lp-screen--call" aria-hidden="true">
          <span className="lp-screen__agree">
            <ShieldCheck /> 本人が同意
          </span>
          <span className="lp-screen__phone">
            <PhoneCall />
          </span>
          <span className="lp-screen__name">候補者の連絡先</span>
        </div>
        <p className="lp-sflow__verb">
          <span>3</span>
          {INTRO.steps[2].title}
        </p>
        <p className="lp-sflow__sub">{INTRO.steps[2].body}</p>
      </li>
    </ol>
  );
}

export function Intro() {
  return (
    <section className="lp-sec lp-intro" aria-labelledby="lp-intro-title">
      <div className="lp-wrap">
        <Head no={INTRO.no} label={INTRO.label} lines={INTRO.lines} id="lp-intro-title" />
        <div className="lp-intro__body" data-reveal="" style={d(0.15)}>
          {INTRO.body.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
        <ServiceFlow />
      </div>
    </section>
  );
}

/* ═══════════════════════ 02 経営者の悩み ═══════════════════════ */

const PROBLEM_ARTS: Record<(typeof PROBLEMS)[number]["icon"], ComponentType<IllustrationProps>> = {
  turnDown: ProblemTurnDown,
  repeat: ProblemRepeat,
  load: ProblemOverload,
  owner: ProblemOwnerDrives,
};

export function Problems() {
  return (
    <section className="lp-sec lp-problems" aria-labelledby="lp-problems-title">
      <Marquee text="DRIVER RECRUIT" className="is-top" />
      <div className="lp-wrap">
        <Head no={PROBLEMS_HEAD.no} label={PROBLEMS_HEAD.label} lines={PROBLEMS_HEAD.lines} id="lp-problems-title" />
        <ol className="lp-plist">
          {PROBLEMS.map((p, i) => {
            const Art = PROBLEM_ARTS[p.icon];
            return (
              <li key={p.text} data-reveal="" style={d(0.08 * i)}>
                <span className="lp-plist__no">0{i + 1}</span>
                <p>{p.text}</p>
                <Art className="lp-plist__art" />
              </li>
            );
          })}
        </ol>
        <p className="lp-goal" data-reveal="">
          {PROBLEMS_GOAL}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 03 どう使うのか ═══════════════════════ */

export function Usage() {
  return (
    <section className="lp-sec lp-usage" id="usage" aria-labelledby="lp-usage-title">
      <div className="lp-wrap">
        <Head no={USAGE.no} label={USAGE.label} lines={USAGE.lines} id="lp-usage-title" lead={USAGE.lead} />
        <div className="lp-usage__grid">
          <div className="lp-usage__screen" data-reveal="" style={d(0.1)}>
            <SampleCard highlight={["免許・資格", "運転経験", "希望勤務地"]} />
            <p className="lp-caption">候補者一覧の画面例（架空の表示例）</p>
          </div>
          <ol className="lp-verbs">
            {USAGE.steps.map((st, i) => (
              <li key={st.verb} data-reveal="" style={d(0.12 * i)}>
                <p className="lp-verbs__verb">
                  <span>0{i + 1}</span>
                  {st.verb}
                </p>
                <p className="lp-verbs__body">{st.body}</p>
                <p className={`lp-verbs__need is-${st.needKind}`}>{st.need}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 04 見られる情報 ═══════════════════════ */

export function Visible() {
  return (
    <section className="lp-sec lp-visible" id="profile" aria-labelledby="lp-visible-title">
      <div className="lp-wrap">
        <Head no={VISIBLE_HEAD.no} label={VISIBLE_HEAD.label} lines={VISIBLE_HEAD.lines} id="lp-visible-title" />
        <div className="lp-visible__grid" data-play="">
          <div className="lp-visible__card" data-reveal="">
            <SampleCard />
          </div>
          <ul className="lp-visible__notes">
            {VISIBLE_NOTES.map((n, i) => (
              <li key={n.key} data-reveal="" style={d(0.15 + 0.12 * i)}>
                <span className="lp-visible__dot" aria-hidden="true" />
                <b>{n.title}</b>
                <span>{n.body}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lp-hidden" data-reveal="">
          <p>
            <Lock aria-hidden="true" />
            表示しない情報
          </p>
          <ul>
            {HIDDEN_FIELDS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <CtaBlock location="profile" reason={CTA_REASONS.profile} />
      </div>
    </section>
  );
}

/* ═══════════════════════ 05 長く働いてもらうために ═══════════════════════ */

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
    <section className="lp-sec lp-retention" aria-labelledby="lp-retention-title">
      <div className="lp-wrap">
        <Head no={RETENTION.no} label={RETENTION.label} lines={RETENTION.lines} id="lp-retention-title" />
        <div className="lp-retention__top">
          <div className="lp-retention__text" data-reveal="" style={d(0.12)}>
            {RETENTION.body.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
          <SceneInterview className="lp-retention__art" />
        </div>

        <div className="lp-split">
          <div className="lp-split__col" data-reveal="">
            <p className="lp-split__who">
              <Search aria-hidden="true" />
              ドラテクで、会う前に分かること
            </p>
            <ul className="lp-tags">
              {RETENTION.fromUs.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="lp-split__col is-company" data-reveal="" style={d(0.12)}>
            <p className="lp-split__who">
              <ClipboardCheck aria-hidden="true" />
              面接で、会社が確認すること
            </p>
            <ul className="lp-checks">
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
          </div>
        </div>

        <p className="lp-goal" data-reveal="">
          {RETENTION.close}
        </p>
        <p className="lp-small" data-reveal="">
          {RETENTION.note}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 06 採用費用の比較 ═══════════════════════ */

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
    <section className="lp-sec lp-compare" id="compare" aria-labelledby="lp-compare-title">
      <div className="lp-wrap lp-wrap--narrow">
        <Head no={COMPARE.no} label={COMPARE.label} lines={COMPARE.lines} id="lp-compare-title" lead={COMPARE.lead} />

        <div className="lp-cmpwrap" data-play="">
          <table className="ds-cmp">
            <caption className="dt-visually-hidden">中途採用1人あたりの平均採用コスト（調査値）と、ドラテクのサービス料金例</caption>
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
          <span className="lp-cmpwrap__frame" aria-hidden="true" />
        </div>

        <div className="ds-cmp__notes" data-reveal="">
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

/* ═══════════════════════ 07 料金と利用の流れ ═══════════════════════ */

const FLOW_ICONS: LucideIcon[] = [Eye, Building2, FileSignature, UserCheck, Unlock, PhoneCall];
const BIG_PRICES = [
  { label: "初期費用", num: "0", unit: "円" },
  { label: "月額費用", num: "0", unit: "円" },
  { label: "採用決定時のみ", pre: "想定年収の", num: "10", unit: "％" },
] as const;

export function Pricing() {
  return (
    <section className="lp-sec lp-pricing" id="pricing" aria-labelledby="lp-pricing-title">
      <div className="lp-wrap">
        <Head no={PRICING_HEAD.no} label={PRICING_HEAD.label} lines={PRICING_HEAD.lines} id="lp-pricing-title" />

        <dl className="lp-bigprice">
          {BIG_PRICES.map((p, i) => (
            <div key={p.label} className={i === 2 ? "is-fee" : undefined} data-reveal="" style={d(0.1 * i)}>
              <dt>{p.label}</dt>
              <dd>
                {"pre" in p && <small>{p.pre}</small>}
                <b>{p.num}</b>
                <span>{p.unit}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="lp-pricing__grid">
          <dl className="lp-terms" data-reveal="">
            {PRICE_ROWS.map((r) => (
              <div key={r.label} className={r.fixed ? undefined : "is-tbd"}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
            <div className="is-tbd">
              <dt>ほかに明示する項目</dt>
              <dd>{PRICE_TBD.join("・")}</dd>
            </div>
          </dl>

          <div className="lp-flow">
            <p className="lp-flow__note" data-reveal="">
              <Check aria-hidden="true" strokeWidth={3} />
              {FLOW_NOTE}
            </p>
            <ol>
              {FLOW.map((f, i) => {
                const Icon = FLOW_ICONS[i];
                return (
                  <li key={f.title} className={i === 2 ? "is-key" : i === 5 ? "is-fee" : undefined} data-reveal="" style={d(0.06 * i)}>
                    <span className="lp-flow__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <div>
                      <p className="lp-flow__title">
                        <span>{i + 1}</span>
                        {f.title}
                        {f.tag && <em>{f.tag}</em>}
                      </p>
                      <dl className="lp-flow__lanes">
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
        </div>

        <CtaBlock location="pricing" reason={CTA_REASONS.pricing} />
      </div>
    </section>
  );
}

/* ═══════════════════════ 08 よくある質問 ═══════════════════════ */

export function Faq() {
  return (
    <section className="lp-sec lp-faqsec" aria-labelledby="lp-faq-title">
      <div className="lp-wrap lp-faqsec__grid">
        <Head no={FAQ_HEAD.no} label={FAQ_HEAD.label} lines={FAQ_HEAD.lines} id="lp-faq-title" />
        <div data-reveal="" style={d(0.12)}>
          <FaqList items={FAQS} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 09 最後のCTA ═══════════════════════ */

export function FinalCta() {
  return (
    <section className="lp-sec lp-final" aria-labelledby="lp-final-title">
      <Marquee text="DRATECH" className="is-final" />
      <div className="lp-wrap lp-wrap--narrow">
        <p className="lp-head__no is-invert" data-reveal="">
          <span>{FINAL_CTA.no}</span>
          <i aria-hidden="true" />
          無料で見てみる
        </p>
        <Lines lines={FINAL_CTA.lines} id="lp-final-title" className="lp-title lp-final__title" />
        <p className="lp-final__body" data-reveal="" style={d(0.15)}>
          {FINAL_CTA.body}
        </p>
        <div className="lp-final__cta" data-reveal="" style={d(0.25)}>
          <ScoutCta location="final" />
        </div>
        <p className="lp-final__arrow" aria-hidden="true">
          <ArrowRight />
        </p>
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
