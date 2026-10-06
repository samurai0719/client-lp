import { CtaBlock, SectionHead } from "./ui";
import { Consulting, Designing, LaunchSuccess, PlanCompare, Relief } from "./illustrations";
import { STEPS } from "./config";

/** STEPごとの挿絵：相談する → 申し込む・支払う → 作る → 応募が集まる */
const ARTS = [Consulting, PlanCompare, Designing, LaunchSuccess];

export default function Steps() {
  return (
    <section className="sr-section sr-steps" aria-labelledby="sr-steps-title">
      <div className="sr-container">
        <SectionHead
          eyebrow="FLOW"
          id="sr-steps-title"
          title={
            <>
              難しいことは
              <br className="sr-sp-only" />
              必要ありません。
            </>
          }
          lead={
            <>
              採用レスキューでは、<strong>4ステップ</strong>で採用LPを公開できます。
            </>
          }
        />

        <ol className="sr-steps__list">
          {STEPS.map((s, i) => {
            const Art = ARTS[i];
            return (
              <li key={s.no} className="sr-step">
                <Art className="sr-step__art" />
                <div className="sr-step__head">
                  <span className="sr-step__no">
                    STEP<b>{s.no}</b>
                  </span>
                </div>
                <h3 className="sr-step__title">{s.title}</h3>
                <p className="sr-step__body">{s.body}</p>
                {s.tags && (
                  <ul className="sr-step__tags">
                    {s.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>

        <CtaBlock
          location="steps"
          art={<Relief />}
          lead={
            <>
              まずは<strong>現在の求人ページを
              <br className="sr-sp-only" />
              見せていただくだけ</strong>でも構いません。
              <br />
              改善できそうなポイントがあるか、
              <br className="sr-sp-only" />
              無料相談で確認します。
            </>
          }
        />
      </div>
    </section>
  );
}
