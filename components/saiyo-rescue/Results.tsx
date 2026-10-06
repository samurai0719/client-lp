import { Fragment } from "react";
import AdVideo from "./AdVideo";
import CountUpNumber from "./CountUpNumber";
import { GrowthChart, Support } from "./illustrations";
import { CtaBlock, SectionHead } from "./ui";
import { AD_VIDEOS, INTERVIEW_RATE, RESULTS, RESULTS_NOTE, RESULTS_PERIOD, RESULTS_TOTAL } from "./config";

/** カードの開始をずらす間隔（ミリ秒）。PCの1行=4枚ぶんで一巡させ、テンポを落とさない */
const STAGGER = 80;

/** 実績（FV直下）。最初の信頼獲得。累計2,465件と面談率を大きく見せ、媒体別の実績で裏付ける */
export default function Results() {
  return (
    <section className="sr-section sr-results" aria-labelledby="sr-results-title">
      <div className="sr-container">
        <SectionHead
          eyebrow="RESULTS"
          id="sr-results-title"
          title={
            <>
              実際に、これだけの
              <br className="sr-sp-only" />
              応募を獲得してきました。
            </>
          }
        />

        <div className="sr-results__hero">
          <div className="sr-results__main">
            <p className="sr-results__label">累計応募実績</p>
            <p className="sr-results__number">
              <CountUpNumber
                value={RESULTS_TOTAL}
                duration={1800}
                className="sr-results__count"
                numberClassName="sr-results__digits"
                suffix={<span className="sr-unit sr-results__unit">件</span>}
              />
            </p>
          </div>
          <div className="sr-results__sub">
            <p className="sr-results__label">面談率</p>
            <p className="sr-results__rate">
              <CountUpNumber
                value={INTERVIEW_RATE}
                duration={1200}
                delay={300}
                suffix={
                  <>
                    <span className="sr-unit sr-results__rate-unit">%</span>
                    <span className="sr-unit sr-results__rate-more">以上</span>
                  </>
                }
              />
            </p>
          </div>
        </div>

        <p className="sr-period">{RESULTS_PERIOD}</p>

        <div className="sr-results__copy">
          <GrowthChart className="sr-results__art" />
          <p className="sr-results__copy-strong">机上の空論ではありません。</p>
          <p>
            実際に採用・求人案件を運用し、
            <br className="sr-pc-only" />
            応募が発生するまで改善を繰り返してきた実績があります。
          </p>
        </div>

        <ul className="sr-results__grid">
          {RESULTS.map((r, i) => {
            const delay = (i % 4) * STAGGER;
            return (
              <li key={r.name} className="sr-rcard">
                <span className="sr-rcard__cat">{r.category}</span>
                <p className="sr-rcard__name">
                  <span>
                    {r.name.split("|").map((part, j) => (
                      <Fragment key={part}>
                        {j > 0 && <wbr />}
                        {part}
                      </Fragment>
                    ))}
                  </span>
                </p>
                <div className="sr-rcard__metric">
                  <p className="sr-rcard__label">応募実績</p>
                  <p className="sr-rcard__count">
                    <CountUpNumber value={r.count} duration={1200} delay={delay} suffix={<span className="sr-unit">人</span>} />
                  </p>
                </div>
                <div className="sr-rcard__metric sr-rcard__metric--sub">
                  <p className="sr-rcard__label">応募単価</p>
                  <p className="sr-rcard__price">
                    <CountUpNumber
                      value={r.unitPrice}
                      duration={1200}
                      delay={delay + 120}
                      suffix={<span className="sr-unit">円</span>}
                    />
                  </p>
                </div>
              </li>
            );
          })}
          <li className="sr-rcard sr-rcard--total">
            <span className="sr-rcard__cat">合計</span>
            <p className="sr-rcard__name">累計応募実績</p>
            <div className="sr-rcard__metric">
              <p className="sr-rcard__label">応募実績</p>
              <p className="sr-rcard__count">
                <CountUpNumber
                  value={RESULTS_TOTAL}
                  duration={1400}
                  delay={3 * STAGGER}
                  suffix={<span className="sr-unit">人</span>}
                />
              </p>
            </div>
            <div className="sr-rcard__metric sr-rcard__metric--sub">
              <p className="sr-rcard__label">面談率</p>
              <p className="sr-rcard__price">
                <CountUpNumber
                  value={INTERVIEW_RATE}
                  duration={1200}
                  delay={3 * STAGGER + 120}
                  suffix={
                    <>
                      <span className="sr-unit">%</span>
                      <span className="sr-unit sr-rcard__more">以上</span>
                    </>
                  }
                />
              </p>
            </div>
          </li>
        </ul>

        <p className="sr-results__note">{RESULTS_NOTE}</p>

        <div className="sr-ads">
          <h3 className="sr-ads__title">
            LPとセットで制作・運用した
            <br className="sr-sp-only" />
            動画広告CRの一部
          </h3>
          <p className="sr-ads__lead">
            広告からLP・応募フォームまでを一貫して設計し、
            <br className="sr-pc-only" />
            応募が発生するまで改善を繰り返してきました。
          </p>
          <ul className="sr-ads__list" aria-label="動画広告の事例">
            {AD_VIDEOS.map((v) => (
              <li key={v.id} className="sr-ads__item">
                <AdVideo
                  src={`/videos/saiyo-rescue/${v.id}.mp4`}
                  poster={`/images/saiyo-rescue/ad-${v.id}.webp`}
                  label={`${v.media}の動画広告`}
                />
                <div className="sr-ads__meta">
                  <span className="sr-ads__cat">{v.category}</span>
                  <p className="sr-ads__media">{v.media}</p>
                  <p className="sr-ads__count">
                    応募実績 <b>{v.count.toLocaleString("ja-JP")}</b>人
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="sr-ads__hint">← 横にスクロールして他の事例を見る →</p>
        </div>

        <p className="sr-results__bridge">
          だから、ただ綺麗なページを
          <br className="sr-sp-only" />
          作るのではなく、
          <br />
          <strong>応募につながる見せ方</strong>を考えます。
        </p>

        <CtaBlock location="results" art={<Support />} lead={
            <>
              自社の求人でも応募を増やせるか、
              <br />
              まずは確認してみませんか？
            </>
          } />
      </div>
    </section>
  );
}
