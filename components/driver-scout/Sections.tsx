import Link from "next/link";
import { BadgeCheck, EyeOff, Handshake, Lock, MessageSquareShare, PhoneCall, Search, UserCheck } from "lucide-react";
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
  HIDDEN_FIELDS,
  MECHANISM,
  PRICES,
  PRICE_NOTE,
  PROBLEMS,
  SAMPLE_PROFILE,
  SERVICE_KIND,
  SERVICE_NAME,
  VISIBLE_FIELDS,
} from "./content";
import { ScoutCta } from "./ui";

/* ═══════════════════════ 1. ファーストビュー ═══════════════════════ */

/**
 * FVは画像（コピー・料金・UIカードを焼き込み済み）。スマホ用とPC用を出し分ける。
 * 画像内の文字は読み上げられないため、同じ内容を見出し（視覚的には非表示）として持たせる。
 * 差し替えは public/images/driver/scout/fv-pc.webp（1536×1024）と fv-sp.webp（1024×1536）。
 */
export function Hero() {
  return (
    <section className="ds-hero" id="top" aria-labelledby="ds-hero-title">
      <h1 className="dt-visually-hidden" id="ds-hero-title">
        愛知県の運送会社さま向け{SERVICE_KIND}。応募を待つだけの採用から、条件に合うドライバーへ企業からアプローチ。
        初期費用0円・月額0円・採用決定時のみ想定年収の10％。
      </h1>
      <picture>
        <source media="(max-width: 767px)" srcSet="/images/driver/scout/fv-sp.webp" width={1024} height={1536} />
        <img
          className="ds-hero__img"
          src="/images/driver/scout/fv-pc.webp"
          width={1536}
          height={1024}
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </picture>
      <div className="ds-hero__cta">
        <ScoutCta location="hero" />
      </div>
    </section>
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
        <p className="ds-price__free">匿名プロフィールの閲覧は無料です（企業確認後）。</p>
        <p className="dt-note">{PRICE_NOTE}</p>
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
