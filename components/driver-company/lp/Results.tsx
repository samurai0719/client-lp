import { Fragment } from "react";
import CountUp from "./CountUp";
import { DriversApplying } from "./illustrations/scenes";
import { INTERVIEW_RATE, RESULTS, RESULTS_NOTE, RESULTS_PERIOD, RESULTS_TOTAL } from "./content";
import { CtaBlock, SectionHead } from "./ui";

const STAGGER = 100;

/**
 * 実績（FV直下）。「広告を出したことがない会社が作った採用サービスではない」ことを
 * ドライバー領域の応募数・応募単価・面談率で裏付ける。
 */
export default function Results() {
  return (
    <section className="dt-section dt-results" aria-labelledby="dt-results-title">
      <div className="dt-container">
        <SectionHead
          eyebrow="RESULTS"
          id="dt-results-title"
          title={
            <>
              ドライバー集客の
              <br className="dt-sp-only" />
              実績があります。
            </>
          }
        />

        <div className="dt-results__hero">
          <div className="dt-results__main">
            <p className="dt-results__label">ドライバー領域 応募実績 合計</p>
            <p className="dt-results__number">
              <CountUp
                value={RESULTS_TOTAL}
                duration={1800}
                numberClassName="dt-results__digits"
                suffix={<span className="dt-results__unit">人以上</span>}
              />
            </p>
          </div>
          <div className="dt-results__sub">
            <p className="dt-results__label">面談率</p>
            <p className="dt-results__rate">
              <CountUp
                value={INTERVIEW_RATE}
                duration={1200}
                delay={300}
                suffix={
                  <>
                    <span className="dt-results__rate-unit">%</span>
                    <span className="dt-results__rate-more">以上</span>
                  </>
                }
              />
            </p>
          </div>
        </div>

        <ul className="dt-results__grid">
          {RESULTS.map((r, i) => (
            <li key={r.name} className="dt-rcard">
              <span className="dt-rcard__cat">ドライバー</span>
              <p className="dt-rcard__name">
                <span>
                  {r.name.split("|").map((part, j) => (
                    <Fragment key={part}>
                      {j > 0 && <wbr />}
                      {part}
                    </Fragment>
                  ))}
                </span>
              </p>
              <div className="dt-rcard__row">
                <p className="dt-rcard__label">応募実績</p>
                <p className="dt-rcard__count">
                  <CountUp value={r.count} duration={1200} delay={i * STAGGER} suffix={<span className="dt-unit">人</span>} />
                </p>
              </div>
              <div className="dt-rcard__row dt-rcard__row--sub">
                <p className="dt-rcard__label">応募単価</p>
                <p className="dt-rcard__price">
                  <CountUp value={r.unitPrice} duration={1200} delay={i * STAGGER + 120} suffix={<span className="dt-unit">円</span>} />
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="dt-note">
          {RESULTS_PERIOD}
          <br />
          {RESULTS_NOTE}
        </p>

        <div className="dt-results__copy">
          <DriversApplying className="dt-results__art" />
          <p className="dt-results__copy-strong">
            広告を出したことがない会社が作った
            <br />
            採用サービスではありません。
          </p>
          <p>
            実際にドライバーを集客し、
            <br className="dt-sp-only" />
            応募・面談につなげてきた経験をもとに
            <br />
            ドラテクを運営しています。
          </p>
        </div>

        <CtaBlock
          location="results"
          lead={
            <>
              この集客ノウハウで、
              <br className="dt-sp-only" />
              貴社の求人を<strong>無料で掲載</strong>します。
            </>
          }
        />
      </div>
    </section>
  );
}
