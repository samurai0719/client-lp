import { CircleCheck, CircleX, RefreshCw } from "lucide-react";
import CountUpNumber from "./CountUpNumber";
import { SectionHead } from "./ui";
import { Analyzing, Presentation } from "./illustrations";
import { BEST_UNIT_PRICE, GUIDE_FIELDS, IMPROVE_POINTS, INTERVIEW_RATE, MOCKUPS, RESULTS_PERIOD, RESULTS_TOTAL, TRUST_TAGS } from "./config";

/** 導き手（信頼・共感・実績）。「作れる人」ではなく「応募を取ったことがある人」であることを示す */
export default function Trust() {
  return (
    <section className="sr-section sr-trust" aria-labelledby="sr-trust-title">
      <div className="sr-container">
        <SectionHead
          eyebrow="WHY US"
          id="sr-trust-title"
          title={
            <>
              採用LPは、
              <br />
              「作れる人」ではなく
              <br />
              <span className="sr-marker">「応募を取ったことがある人」</span>
              <br className="sr-sp-only" />
              に任せる。
            </>
          }
        />

        <div className="sr-trust__layout">
          <div className="sr-trust__text">
            <Presentation className="sr-trust__art" />
            <p>ホームページ制作会社の多くは、デザインやコーディングの専門家です。</p>
            <p>しかし採用LPで重要なのは、そこではありません。</p>

            <div className="sr-trust__compare">
              <p className="is-no">
                <CircleX aria-hidden="true" />
                <span>「綺麗に作れるか」</span>
              </p>
              <p className="is-yes">
                <CircleCheck aria-hidden="true" />
                <span>「どうすれば求職者が応募するのか」を理解していること</span>
              </p>
            </div>

            <p>
              採用レスキューでは、次のような採用・転職領域で、
              <strong>実際に応募獲得を行ってきました。</strong>
            </p>
            <ul className="sr-trust__fields">
              {GUIDE_FIELDS.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="sr-trust__visual">
            <p className="sr-trust__visual-title">応募獲得に携わったLPの例</p>
            <ul className="sr-mockups">
              {MOCKUPS.map((m) => (
                <li key={m.src}>
                  <figure>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.src} alt={`${m.caption}（PC・スマートフォン表示）`} width={1200} height={900} loading="lazy" decoding="async" />
                    <figcaption>
                      <b>{m.title}</b>
                      {m.caption}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="sr-trust__stats">
          <li className="is-main">
            <span className="sr-trust__stat-label">累計応募数</span>
            <span className="sr-trust__stat-value">
              <CountUpNumber value={RESULTS_TOTAL} duration={1600} suffix={<small className="sr-unit">件</small>} />
            </span>
          </li>
          <li>
            <span className="sr-trust__stat-label">面談率</span>
            <span className="sr-trust__stat-value">
              <CountUpNumber value={INTERVIEW_RATE} duration={1200} delay={120} suffix={<small className="sr-unit">%以上</small>} />
            </span>
          </li>
          <li>
            <span className="sr-trust__stat-label">応募単価</span>
            <span className="sr-trust__stat-value">
              <CountUpNumber value={BEST_UNIT_PRICE} duration={1200} delay={240} suffix={<small className="sr-unit">円の実績</small>} />
            </span>
          </li>
        </ul>

        <p className="sr-period">{RESULTS_PERIOD}</p>

        <div className="sr-improve">
          <Analyzing className="sr-improve__art" />
          <h3 className="sr-improve__title">
            広告を回して<br className="sr-sp-only" />終わりではありません。
          </h3>
          <p className="sr-improve__text">
            応募が少なければ、<strong>どこで離脱しているのか</strong>を考え、次のような箇所を見直して改善してきました。
          </p>
          <ul className="sr-improve__points">
            {IMPROVE_POINTS.map((p) => (
              <li key={p}>
                <RefreshCw aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <p className="sr-improve__after">
            この経験を、<strong>採用レスキューのLP制作に反映</strong>します。
          </p>
        </div>

        <ul className="sr-trust__tags">
          {TRUST_TAGS.map((t) => (
            <li key={t}>
              <CircleCheck aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
