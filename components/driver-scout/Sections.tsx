import Link from "next/link";
import { BadgeCheck, EyeOff, Handshake, Lock, MapPin, MessageSquareShare, PhoneCall, Search, UserCheck } from "lucide-react";
import type { ComponentType } from "react";
import { OPERATOR, PATHS, SHOW_NOTICE_NUMBER } from "@/config/driver-company";
import type { IllustrationProps } from "../driver-company/lp/illustrations/kit";
import {
  OwnerQuestion,
  ProblemLargeLicense,
  ProblemMediaCost,
  ProblemNoApply,
  ProblemNoHR,
} from "../driver-company/lp/illustrations/scenes";
import { Rich, SectionHead } from "../driver-company/lp/ui";
import {
  FAQS,
  FLOW,
  HERO_PRICES,
  HIDDEN_FIELDS,
  MECHANISM,
  PRICES,
  PRICE_FIXED,
  PRICE_TBD,
  PROBLEMS,
  SAMPLE_PROFILE,
  SERVICE_KIND,
  SERVICE_NAME,
  VISIBLE_FIELDS,
} from "./content";
import { ScoutCta } from "./ui";

/* ═══════════════════════ 1. ファーストビュー ═══════════════════════ */

/** FVの匿名プロフィールカードに出す項目（SAMPLE_PROFILE から抜粋。架空の表示イメージ） */
const HERO_CARD_KEYS = ["年齢", "希望勤務地", "免許・資格", "運転経験", "希望年収帯"] as const;

/**
 * ファーストビュー。文字・料金・CTAはすべてHTMLで組み、画像は文字の入っていない写真だけを使う
 * （public/images/driver/scout/fv-photo.webp。差し替えは写真だけを置き換える）。
 * スマホは「対象 → 見出し → 写真 → 料金 → CTA → カード」の順に縦へ並べ、要素同士を重ねない。
 * PCは左に文字・料金・CTA、右に写真とカードを置く。
 */
export function Hero() {
  return (
    <section className="ds-hero" id="top" aria-labelledby="ds-hero-title">
      <div className="ds-hero__inner">
        <div className="ds-hero__copy">
          <p className="ds-hero__target">
            <MapPin aria-hidden="true" />
            <span>
              <b>愛知県の運送会社さま向け</b>
              <span className="ds-hero__kind">{SERVICE_KIND}</span>
            </span>
          </p>
          <h1 className="ds-hero__title" id="ds-hero-title">
            <span>運送会社が</span>
            <span>
              <em>求職者を選ぶ</em>時代。
            </span>
          </h1>
          <p className="ds-hero__lead">
            <span>応募を待つだけの採用から、</span>
            <br />
            <span>条件に合うドライバーへ</span>
            <span>企業からアプローチ。</span>
          </p>
        </div>

        <div className="ds-hero__visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="ds-hero__photo"
            src="/images/driver/scout/fv-photo.webp"
            width={836}
            height={664}
            alt="倉庫前に停めた大型トラックと、腕を組んで立つドライバー"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
          {/* PCでは写真の右上に重ねる（スマホではCTAの下に別に出す） */}
          <HeroCard className="ds-hero__card ds-hero__card--pc" compact />
        </div>

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

        <HeroCard className="ds-hero__card ds-hero__card--sp" />
      </div>
    </section>
  );
}

/** FVの匿名プロフィールカード（架空の表示イメージ）。PCとスマホで置き場所が違うため2回描画し、CSSで片方だけ出す */
function HeroCard({ className, compact = false }: { className: string; compact?: boolean }) {
  // PCでは写真を隠しすぎないよう、年齢・免許・経験の3項目だけにする
  const keys: readonly string[] = compact ? ["年齢", "免許・資格", "運転経験"] : HERO_CARD_KEYS;
  const rows = SAMPLE_PROFILE.filter(([k]) => keys.includes(k));
  return (
    <figure className={className}>
      <div className="ds-hero__cardhead">
        <span className="ds-hero__avatar" aria-hidden="true">
          <UserCheck />
        </span>
        <p>候補者 No.＊＊＊＊</p>
        <span className="ds-hero__sample">表示イメージ</span>
      </div>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{compact ? k.replace("・資格", "") : k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <figcaption className="ds-hero__lock">
        <Lock aria-hidden="true" />
        連絡先は本人の同意後に開示
      </figcaption>
    </figure>
  );
}

/* ═══════════════════════ 2. 採用課題 ═══════════════════════ */

const PROBLEM_ARTS: Record<(typeof PROBLEMS)[number]["art"], ComponentType<IllustrationProps>> = {
  noApply: ProblemNoApply,
  license: ProblemLargeLicense,
  cost: ProblemMediaCost,
  noHR: ProblemNoHR,
};

export function Problems() {
  return (
    <section className="dt-section ds-problems" aria-labelledby="ds-problems-title">
      <div className="dt-container">
        <SectionHead
          eyebrow="PROBLEM"
          id="ds-problems-title"
          title={
            <>
              運送会社の
              <br className="dt-sp-only" />
              ドライバー採用、
              <br />
              こんな課題は
              <br className="dt-sp-only" />
              ありませんか？
            </>
          }
          lead="名古屋・尾張・三河など、愛知県内でトラックドライバーを採用したい運送会社さまの、よくある悩みです。"
        />
        <ul className="dt-pcards">
          {PROBLEMS.map((p, i) => {
            const Art = PROBLEM_ARTS[p.art];
            return (
              <li key={p.title} className="dt-pcard">
                <div className="dt-pcard__artbox">
                  <Art className="dt-pcard__art" />
                </div>
                <div className="dt-pcard__body">
                  <span className="dt-pcard__no">課題 {String(i + 1).padStart(2, "0")}</span>
                  <p className="dt-pcard__text">
                    <strong>{p.title}</strong>
                  </p>
                  <p className="ds-pcard__sub">{p.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="ds-turn">
          求人を出して<strong>応募を待つだけ</strong>ではなく、
          <br />
          条件に合う人へ<strong>企業から声をかける</strong>方法があります。
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════ 3. 仕組み ═══════════════════════ */

const MECH_ICONS = [Search, MessageSquareShare, UserCheck, Lock, PhoneCall, Handshake];

export function Mechanism() {
  return (
    <section className="dt-section ds-mech" aria-labelledby="ds-mech-title">
      <div className="dt-container dt-container--narrow">
        <SectionHead
          eyebrow="HOW IT WORKS"
          id="ds-mech-title"
          title={
            <>
              サービスの仕組み
            </>
          }
          lead="連絡先は、候補者本人が企業と求人内容を確認して同意した場合にだけ開示されます。"
        />
        <ol className="ds-mech__list">
          {MECHANISM.map((m, i) => {
            const Icon = MECH_ICONS[i];
            return (
              <li key={m.title} className={`ds-mech__item${i === 3 ? " is-consent" : ""}${i === 5 ? " is-fee" : ""}`}>
                <span className="ds-mech__icon" aria-hidden="true">
                  <Icon strokeWidth={2.2} />
                </span>
                <div>
                  <p className="ds-mech__no">STEP {i + 1}</p>
                  <h3 className="ds-mech__title">{m.title}</h3>
                  <p className="ds-mech__body">{m.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <ScoutCta location="mechanism" />
      </div>
    </section>
  );
}

/* ═══════════════════════ 4. 閲覧できる情報 ═══════════════════════ */

export function Visible() {
  return (
    <section className="dt-section ds-visible" aria-labelledby="ds-visible-title">
      <div className="dt-container">
        <SectionHead eyebrow="PROFILE" id="ds-visible-title" title="企業が閲覧できる情報" />
        <div className="ds-visible__grid">
          <figure className="ds-profile">
            <figcaption className="ds-profile__cap">匿名プロフィールの表示イメージ</figcaption>
            <div className="ds-profile__card">
              <div className="ds-profile__head">
                <span className="ds-profile__avatar" aria-hidden="true">
                  <EyeOff />
                </span>
                <div>
                  <p className="ds-profile__name">候補者 No.＊＊＊＊</p>
                  <p className="ds-profile__hidden">氏名・連絡先は非表示</p>
                </div>
              </div>
              <dl className="ds-profile__rows">
                {SAMPLE_PROFILE.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="ds-profile__lock">
                <Lock aria-hidden="true" />
                連絡先は、本人の同意後に表示されます
              </p>
            </div>
            <p className="ds-profile__note">※表示イメージです。実在の求職者の情報ではありません。</p>
          </figure>

          <div className="ds-visible__lists">
            <div className="ds-visible__box">
              <h3>
                <BadgeCheck aria-hidden="true" />
                閲覧できる情報
              </h3>
              <ul className="ds-chips">
                {VISIBLE_FIELDS.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="ds-visible__box is-hidden">
              <h3>
                <EyeOff aria-hidden="true" />
                匿名プロフィールでは表示しない情報
              </h3>
              <ul className="ds-chips">
                {HIDDEN_FIELDS.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p>
                匿名プロフィールでは、<strong>個人を特定できる情報は表示しません。</strong>
                連絡先は、候補者本人が企業と求人内容を確認し、開示に同意した場合にだけ表示されます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════ 5. 料金 ═══════════════════════ */

export function Pricing() {
  return (
    <section className="dt-section ds-pricing" id="pricing" aria-labelledby="ds-pricing-title">
      <div className="dt-container dt-container--narrow">
        <SectionHead eyebrow="PRICE" id="ds-pricing-title" title="料金" />
        <dl className="ds-price">
          {PRICES.map((p) => (
            <div key={p.label} className={"note" in p ? "is-fee" : undefined}>
              <dt>{p.label}</dt>
              <dd>
                {"note" in p && <span className="ds-price__when">{p.note}</span>}
                <b>{p.value}</b>
              </dd>
            </div>
          ))}
        </dl>
        <div className="ds-price__terms">
          <div>
            <h3>決まっていること</h3>
            <ul className="is-fixed">
              {PRICE_FIXED.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>ご契約前に明示すること</h3>
            <ul className="is-tbd">
              {PRICE_TBD.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
        <ScoutCta location="pricing" />
      </div>
    </section>
  );
}

/* ═══════════════════════ 6. 利用開始までの流れ ═══════════════════════ */

export function Flow() {
  return (
    <section className="dt-section ds-flow" aria-labelledby="ds-flow-title">
      <div className="dt-container dt-container--narrow">
        <SectionHead eyebrow="FLOW" id="ds-flow-title" title="利用開始までの流れ" />
        <ol className="ds-flow__list">
          {FLOW.map((f, i) => (
            <li key={f.title}>
              <span className="ds-flow__no">{i + 1}</span>
              <div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ═══════════════════════ 7. よくある質問 ═══════════════════════ */

export function Faq() {
  return (
    <section className="dt-section dt-faq" aria-labelledby="ds-faq-title">
      <div className="dt-container dt-container--narrow">
        <OwnerQuestion className="dt-faq__art" />
        <SectionHead eyebrow="Q&A" id="ds-faq-title" title="よくある質問" />
        <div className="dt-faq__list">
          {FAQS.map((f) => (
            <article key={f.q} className="dt-faq__item">
              <h3 className="dt-faq__q">
                <span aria-hidden="true">Q</span>
                {f.q}
              </h3>
              <div className="dt-faq__a">
                <span aria-hidden="true">A</span>
                <div className="dt-faq__body">
                  {f.a.map((p) => (
                    <p key={p}>
                      <Rich text={p} />
                    </p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <ScoutCta location="faq" />
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
