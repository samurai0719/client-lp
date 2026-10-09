import { PRICING } from "@/config/driver-company";
import CountUp from "./CountUp";
import { StepHire } from "./illustrations/scenes";
import { FINAL_ZEROS } from "./content";
import { CtaButton, Reassure } from "./ui";

/** 最終CTA。「先にお金を払い続けますか？」と問い、0円と25万円を最大で見せて求人登録へ送る */
export default function FinalCta() {
  return (
    <section className="dt-final" id="final-cta" aria-labelledby="dt-final-title">
      <div className="dt-container dt-container--narrow">
        <h2 id="dt-final-title" className="dt-final__title">
          採用できるか分からない
          <br />
          求人広告に、
          <br className="dt-sp-only" />
          先にお金を
          <br className="dt-sp-only" />
          払い続けますか？
        </h2>

        <p className="dt-final__text">ドラテクなら、</p>
        <ul className="dt-final__zeros">
          {FINAL_ZEROS.map((z) => (
            <li key={z}>{z}</li>
          ))}
        </ul>
        <p className="dt-final__text">
          料金が発生するのは、
          <br />
          <strong>ドライバーを採用できた時だけ。</strong>
        </p>

        <StepHire className="dt-final__art" />

        <div className="dt-final__price">
          <p>
            <span className="dt-final__price-pre">採用できるまで</span>
            <span className="dt-final__price-zero">
              <CountUp value={0} from={250000} duration={1400} />
              <small>円</small>
            </span>
          </p>
          <p>
            <span className="dt-final__price-pre">入社した時だけ</span>
            <span className="dt-final__price-fee">
              <CountUp value={25} duration={1200} delay={300} />
              <small>万円{PRICING.taxNote}</small>
            </span>
          </p>
        </div>

        <div className="dt-final__cta">
          <CtaButton location="final" />
          <Reassure invert />
        </div>
      </div>
    </section>
  );
}
