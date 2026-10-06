import { ArrowDown, Check } from "lucide-react";
import CountUpNumber from "./CountUpNumber";
import { CTA_REASSURE, INTERVIEW_RATE, RESULTS_PERIOD, RESULTS_TOTAL, VICIOUS_CYCLE } from "./config";
import ContactForm from "./ContactForm";
import { SpeedBadge } from "./ui";
import { SendMessage, Support } from "./illustrations";

/**
 * 最終CTA。人手不足が続いた場合の悪循環を見せたうえで「採用導線は改善できる」と転換し、
 * 実績・返金保証・安心材料をそろえてフォーム（全CTAの着地点 #contact）へつなぐ。
 */
export default function CTA() {
  return (
    <section className="sr-section sr-cta" aria-labelledby="sr-cta-title">
      <div className="sr-container sr-container--narrow">
        <h2 id="sr-cta-title" className="sr-cta__title">
          人が集まらない状態を、
          <br />
          このまま続けますか？
        </h2>

        <p className="sr-cta__text">人手不足が続けば、次のような悪循環につながる可能性があります。</p>
        <ol className="sr-cycle">
          {VICIOUS_CYCLE.map((v, i) => (
            <li key={v}>
              <span>{v}</span>
              {i < VICIOUS_CYCLE.length - 1 && <ArrowDown aria-hidden="true" className="sr-cycle__arrow" />}
            </li>
          ))}
        </ol>

        <Support className="sr-cta__art" />
        <p className="sr-cta__turn">
          しかし、<strong>採用導線は改善できます。</strong>
        </p>
        <p className="sr-cta__text">
          採用レスキューでは、これまで2,465件の応募獲得実績をもとに、
          <br className="sr-pc-only" />
          貴社に合った採用LPをご提案します。
        </p>

        <ul className="sr-cta__stats">
          <li>
            <span className="sr-cta__stat-label">累計応募実績</span>
            <span className="sr-cta__stat-value">
              <CountUpNumber value={RESULTS_TOTAL} duration={1600} suffix={<small className="sr-unit">件</small>} />
            </span>
          </li>
          <li>
            <span className="sr-cta__stat-label">面談率</span>
            <span className="sr-cta__stat-value">
              <CountUpNumber value={INTERVIEW_RATE} duration={1200} delay={120} suffix={<small className="sr-unit">%以上</small>} />
            </span>
          </li>
          <li className="is-gold">
            <span className="sr-cta__stat-label">35万円プラン限定</span>
            <span className="sr-cta__stat-pre">応募が来なければ</span>
            <span className="sr-cta__stat-value sr-cta__stat-value--text">全額返金保証</span>
            <span className="sr-cta__stat-note">※適用条件あり</span>
          </li>
        </ul>

        <p className="sr-period sr-period--invert">{RESULTS_PERIOD}</p>

        <div className="sr-form-card" id="contact">
          <SendMessage className="sr-form-card__art" />
          <SpeedBadge />
          <p className="sr-form-card__title">無料で採用相談する</p>
          <p className="sr-form-card__lead">現在の採用状況をお聞かせください。</p>
          <ContactForm />
          <div className="sr-form-card__reassure">
            {CTA_REASSURE.map((r) => (
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
