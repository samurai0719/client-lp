import { PRICING } from "@/config/driver-company";
import CountUp from "./CountUp";
import { HERO_ZEROS } from "./content";
import { CtaButton, Reassure } from "./ui";

/**
 * ファーストビュー。
 * 大型トラックの写真の上で「採用できるまで0円」「入社した時だけ25万円」を最大級に見せ、
 * 0円4点（初期費用・掲載費・月額費・応募費）→ 成功報酬 → CTA の順で一目で料金体系を伝える。
 * 0円はカウントダウン（数字が減って0になる）で「費用がなくなる」ことを印象づける。
 */
export default function Hero() {
  return (
    <section className="dt-hero" id="hero" aria-labelledby="dt-hero-title">
      <div className="dt-hero__media" aria-hidden="true">
        <picture>
          <source media="(max-width: 767px)" srcSet="/images/driver/company/hero-sp.webp" width={820} height={1024} />
          <img
            src="/images/driver/company/hero-pc.webp"
            width={1536}
            height={1024}
            alt=""
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        </picture>
      </div>

      <div className="dt-hero__inner">
        <p className="dt-hero__tag">
          <span>運送会社・物流会社のための</span>
          <span>ドライバー採用サービス</span>
        </p>

        <h1 className="dt-hero__title" id="dt-hero-title">
          <span className="dt-hero__title-sm">ドライバー採用、</span>
          <span className="dt-hero__title-lg">
            採用できるまで
            <span className="dt-hero__zero">
              <CountUp value={0} from={250000} duration={1400} delay={200} />
              <small>円</small>
            </span>
            。
          </span>
        </h1>

        <p className="dt-hero__fee">
          <span className="dt-hero__fee-pre">入社した時だけ</span>
          <span className="dt-hero__fee-main">
            成功報酬
            <b>
              <CountUp value={25} duration={1200} delay={600} />
            </b>
            万円{PRICING.taxNote && <small>{PRICING.taxNote}</small>}
          </span>
        </p>

        <ul className="dt-hero__zeros" aria-label="採用できるまでの費用">
          {HERO_ZEROS.map((label, i) => (
            <li key={label}>
              <span className="dt-hero__zeros-label">{label}</span>
              <span className="dt-hero__zeros-value">
                <CountUp value={0} from={100000} duration={1100} delay={300 + i * 120} />
                <small>円</small>
              </span>
            </li>
          ))}
        </ul>

        <div className="dt-hero__cta">
          <CtaButton location="hero" />
          <Reassure invert />
        </div>
      </div>

      <div className="dt-hero__about">
        <div className="dt-container dt-container--narrow">
          <p className="dt-hero__about-lead">
            <b>ドラテク</b>は、
            <br className="dt-sp-only" />
            トラックドライバーを採用したい
            <br />
            運送会社向けの<strong>成果報酬型採用サービス</strong>です。
          </p>
          <ol className="dt-hero__about-flow">
            <li>
              <span>1</span>求人情報を登録すると、条件に合うドライバーへ求人情報を届けます
            </li>
            <li>
              <span>2</span>求職者本人が、気になる企業へ応募
            </li>
            <li>
              <span>3</span>応募後は、企業と求職者が直接やり取り
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
