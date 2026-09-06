"use client";

import { useEffect, useRef } from "react";
import {
  AD_DISCOUNT_LABEL, AD_DISCOUNT_NOTE, AD_DISCOUNT_PERCENT,
  PLANS, REFUND_DISCLOSURE, ctaHrefForPlan, discountedPrice, type Plan,
} from "./config";
import { GuaranteeBadge } from "./icons";
import { prefersReducedMotion, stagger, useInView } from "./motion";
import { CheckIcon, CtaButton, SectionHeading } from "./ui";

/**
 * 料金プラン。
 * 税込・税別の表記が未確定のため、金額は「◯◯万円」とだけ表示する。
 * 全額返金保証は無条件と誤解されないよう、カード内に条件がある旨を明記し、
 * 詳細は開閉式の説明欄（#refund）へ誘導する。
 */
export default function PricingSection() {
  return (
    <section id="pricing" className="adf-section adf-sec-paper" aria-labelledby="adf-pricing-h">
      <div className="adf-container">
        <SectionHeading
          eyebrow="Pricing"
          title="料金は20万円の1プランのみ"
          id="adf-pricing-h"
          center
          lead="プランを分けず、集客に必要な内容をひとつにまとめました。制作の進め方は、現在の集客状況をうかがったうえでご提案します。"
        />

        {/* プランが1つのときは中央に1枚だけ置く（複数に戻せば自動で横並びに戻る） */}
        <div className={`adf-plans${PLANS.length === 1 ? " adf-plans--single" : ""}`}>
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>

        {AD_DISCOUNT_PERCENT > 0 ? (
          <p className="adf-plans__note">※ {AD_DISCOUNT_NOTE}</p>
        ) : null}

        {/* 返金保証の条件は断定せず、書面案内である旨のみを明記する */}
        <details className="adf-disclosure" id="refund">
          <summary>全額返金保証の適用条件について</summary>
          <p className="adf-disclosure__body">{REFUND_DISCLOSURE}</p>
        </details>
      </div>
    </section>
  );
}

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const ref = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className={`adf-plan adf-reveal adf-reveal--up${plan.featured ? " adf-plan--feature" : ""}`}
      style={stagger(index)}
    >
      {/* 保証シールは右上に出るため、バッジと併記するときは左上へ逃がす */}
      {plan.badge ? (
        <span className={`adf-plan__badge${plan.guard ? " adf-plan__badge--left" : ""}`}>
          {plan.badge}
        </span>
      ) : null}
      {plan.guard ? <GuaranteeBadge /> : null}

      <p className="adf-plan__label">{plan.label}</p>
      <h3 className="adf-plan__name">{plan.name}</h3>
      <p className="adf-plan__for">{plan.for}</p>

      <div className="adf-plan__price">
        <p className="adf-plan__amount">
          <span className="adf-plan__value">
            <PriceCount target={plan.price} />
          </span>
          <span className="adf-plan__unit">万円</span>
          {AD_DISCOUNT_PERCENT > 0 ? (
            <span className="adf-plan__off">
              {AD_DISCOUNT_LABEL}
              <b>{AD_DISCOUNT_PERCENT}%OFF</b>
            </span>
          ) : null}
        </p>
        {AD_DISCOUNT_PERCENT > 0 ? (
          <p className="adf-plan__after">
            適用後 <b>{discountedPrice(plan.price)}万円</b>
          </p>
        ) : null}
      </div>

      <ul className="adf-plan__list">
        {plan.items.map((item) => (
          <li key={item.text} className={item.inherit ? "is-inherit" : undefined}>
            <CheckIcon size={15} />
            {item.text}
          </li>
        ))}
      </ul>

      {plan.guard ? (
        <p className="adf-plan__guard">
          保証には適用条件があります。
          <a href="#refund">詳細条件を見る</a>
        </p>
      ) : null}

      {/* 選んだプランをフォームへ引き継ぐ（例: /contact?plan=growth） */}
      <CtaButton href={ctaHrefForPlan(plan.id)} />
    </div>
  );
}

/**
 * 画面内に入ったときだけ、金額が切り替わるように数字を動かす。
 * textContent を直接更新するので、スクロール中に再レンダリングが発生しない。
 * SSR時・JS無効時・モーション低減時は、最終的な金額がそのまま表示される。
 */
function PriceCount({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    el.textContent = "0";

    let raf = 0;
    let started = false;

    const io = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((e) => e.isIntersecting)) return;
        started = true;
        io.unobserve(el);

        const duration = 900;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(eased * target));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      el.textContent = String(target);
    };
  }, [target]);

  return <span ref={ref}>{target}</span>;
}
