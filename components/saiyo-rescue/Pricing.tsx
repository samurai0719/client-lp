import { Check, Crown } from "lucide-react";
import type { ComponentType } from "react";
import CountUpNumber from "./CountUpNumber";
import { BusinessFigure, GrowthChart, GuaranteeRelief, PlanCompare, Questioning, type IllustrationProps } from "./illustrations";
import { CtaButton, GuaranteeSeal, SectionHead, SpeedBadge } from "./ui";
import { GUARANTEE_NOTE, PAYMENT, PLANS, PRICE_TAX_NOTE, PRICING_HELP } from "./config";

/** プランごとの挿絵：まず用意する → 本格的に伸ばす → 保証付きで安心して任せる */
const PLAN_ARTS: Record<string, ComponentType<IllustrationProps>> = {
  light: BusinessFigure,
  standard: GrowthChart,
  premium: GuaranteeRelief,
};

/** 料金プラン。PCは3カラム・スマホは縦並び。返金保証付きのプレミアムを最も目立たせる */
export default function Pricing() {
  return (
    <section className="sr-section sr-pricing" id="pricing" aria-labelledby="sr-pricing-title">
      <div className="sr-container">
        <PlanCompare className="sr-pricing__headart" />
        <SectionHead
          eyebrow="PRICE"
          id="sr-pricing-title"
          title={
            <>
              採用状況に合わせて
              <br />
              3つのプランから
              <br className="sr-sp-only" />
              選べます。
            </>
          }
        />

        <ul className="sr-pricing__grid">
          {PLANS.map((p) => {
            const Art = PLAN_ARTS[p.id];
            return (
            <li key={p.id} className={`sr-plan sr-plan--${p.id}${p.guarantee ? " is-featured" : ""}`}>
              {p.badge && (
                <span className="sr-plan__badge">
                  {p.guarantee && <Crown aria-hidden="true" />}
                  {p.badge}
                </span>
              )}
              <Art className={`sr-plan__art${p.guarantee ? " sr-plan__art--big" : ""}`} />
              <h3 className="sr-plan__name">{p.name}</h3>
              <p className="sr-plan__target">{p.target}</p>
              <p className="sr-plan__price">
                <CountUpNumber
                  value={p.price}
                  duration={1100}
                  suffix={
                    <>
                      <span className="sr-unit">円</span>
                      <span className="sr-unit sr-plan__taxin">{PRICE_TAX_NOTE}</span>
                    </>
                  }
                />
              </p>
              <p className="sr-plan__pay">{PAYMENT.short}</p>

              {p.guarantee && (
                <>
                  <GuaranteeSeal note="※適用条件あり" compact />
                  <p className="sr-plan__gnote">{PAYMENT.guarantee}</p>
                </>
              )}

              <ul className="sr-plan__features">
                {p.features.map((f, i) => (
                  <li
                    key={f}
                    className={
                      f === "全額返金保証" ? "is-strong" : p.guarantee && i === 0 ? "is-base" : undefined
                    }
                  >
                    <Check aria-hidden="true" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="sr-plan__cta">
                <CtaButton
                  label={p.cta}
                  plan={p.id}
                  variant={p.guarantee ? "gold" : "primary"}
                  location={`pricing_${p.id}`}
                />
              </div>
            </li>
            );
          })}
        </ul>

        <div className="sr-pricing__help">
          <Questioning className="sr-pricing__helpart" />
          <p>
            {PRICING_HELP.split("、")[0]}、
            <br />
            {PRICING_HELP.split("、").slice(1).join("、")}
          </p>
          <SpeedBadge />
          <CtaButton location="pricing_help" />
        </div>
        <p className="sr-pricing__note">
          ※価格はすべて税込です。お支払いは全プラン、制作開始前の前金100%（{PAYMENT.method}）です。
          <br />
          {GUARANTEE_NOTE.replace("※", "※全額返金保証は")}
        </p>
      </div>
    </section>
  );
}
