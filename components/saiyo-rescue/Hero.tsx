import { Check } from "lucide-react";
import CountUpNumber from "./CountUpNumber";
import { TeamLineup } from "./illustrations";
import { CtaButton, SpeedBadge } from "./ui";
import { GUARANTEE_NOTE, HERO_COPY, HERO_IMAGE, INTERVIEW_RATE, RESULTS_PERIOD, RESULTS_TOTAL, SITE } from "./config";

/**
 * ファーストビュー。メインコピーと実績・返金保証は画像に焼き込み済み。
 * 画像の直下で「制作会社ではなく採用課題を解決するサービス」であることを言語化し、
 * 実績4点とCTA・安心材料をひとまとまりで見せる。
 */
export default function Hero() {
  return (
    <section className="sr-hero" id="hero" aria-labelledby="sr-hero-title">
      <h1 id="sr-hero-title" className="sr-visually-hidden">
        {SITE.name}｜{SITE.catch} 求人の応募が来なければ全額返金保証（35万円プラン限定・適用条件あり）
      </h1>

      <div className="sr-hero__frame">
        <picture>
          <source media="(max-width: 767px)" srcSet={HERO_IMAGE.sp} width={HERO_IMAGE.spW} height={HERO_IMAGE.spH} />
          <img
            className="sr-hero__img"
            src={HERO_IMAGE.pc}
            width={HERO_IMAGE.pcW}
            height={HERO_IMAGE.pcH}
            alt={HERO_IMAGE.alt}
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
        </picture>
      </div>

      <div className="sr-hero__panel">
        <div className="sr-hero__panel-inner">
          {/* 看護師・ドライバー・会社員・建設・薬剤師が並ぶ＝全業種の採用を支援するサービスだと一目で伝える */}
          <TeamLineup className="sr-hero__team" />
          <p className="sr-hero__lead">
            {HERO_COPY.lead[0]}
            <br />
            <strong>{HERO_COPY.lead[1]}</strong>
          </p>
          <p className="sr-hero__body">{HERO_COPY.body}</p>
          <p className="sr-hero__set" aria-label="採用LPと広告クリエイティブをセットで制作">
            <span>採用LP</span>
            <b aria-hidden="true">＋</b>
            <span>広告CR（バナー・動画）</span>
            <em>をセットで制作</em>
          </p>

          <ul className="sr-hero__stats">
            <li>
              <span className="sr-hero__stat-label">累計応募実績</span>
              <span className="sr-hero__stat-value">
                <CountUpNumber value={RESULTS_TOTAL} duration={1600} suffix={<small className="sr-unit">件</small>} />
              </span>
            </li>
            <li>
              <span className="sr-hero__stat-label">面談率</span>
              <span className="sr-hero__stat-value">
                <CountUpNumber
                  value={INTERVIEW_RATE}
                  duration={1200}
                  delay={150}
                  suffix={<small className="sr-unit">%以上</small>}
                />
              </span>
            </li>
            <li>
              <span className="sr-hero__stat-label">対応業種</span>
              <span className="sr-hero__stat-value">
                全業種<small className="sr-unit">対応</small>
              </span>
            </li>
            <li className="is-gold">
              <span className="sr-hero__stat-label">応募が来なければ</span>
              <span className="sr-hero__stat-value sr-hero__stat-value--text">全額返金保証</span>
              <span className="sr-hero__stat-note">{GUARANTEE_NOTE}</span>
            </li>
          </ul>

          <p className="sr-period">{RESULTS_PERIOD}</p>

          <div className="sr-hero__cta">
            <SpeedBadge />
            <CtaButton location="hero" />
            <p className="sr-hero__reassure">
              <Check aria-hidden="true" strokeWidth={3} />
              <span>{HERO_COPY.reassure}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
