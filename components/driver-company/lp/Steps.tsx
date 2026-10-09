import { Info } from "lucide-react";
import { StepChoose, StepDeliver, StepHire, StepRegister } from "./illustrations/scenes";
import { STEPS } from "./content";
import { SectionHead } from "./ui";

const ARTS = [StepRegister, StepDeliver, StepChoose, StepHire];

/** サービスの仕組み（4STEP）。求職者が自分で選んで応募し、応募後は企業が直接対応することを明示する */
export default function Steps() {
  return (
    <section className="dt-section dt-steps" aria-labelledby="dt-steps-title">
      <div className="dt-container">
        <SectionHead
          eyebrow="FLOW"
          id="dt-steps-title"
          title={
            <>
              求人掲載から採用まで
              <br />
              <span className="dt-marker">かんたん4STEP</span>
            </>
          }
        />

        <ol className="dt-steps__list">
          {STEPS.map((s, i) => {
            const Art = ARTS[i];
            return (
              <li key={s.title} className="dt-step">
                <p className="dt-step__no">
                  STEP<b>{String(i + 1).padStart(2, "0")}</b>
                </p>
                <Art className="dt-step__art" />
                <h3 className="dt-step__title">{s.title}</h3>
                <p className="dt-step__body">{s.body}</p>
                {s.tags && (
                  <ul className="dt-step__tags" aria-label="入力する項目の例">
                    {s.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
                {s.note && <p className="dt-step__note">{s.note}</p>}
              </li>
            );
          })}
        </ol>

        <p className="dt-steps__legal">
          <Info aria-hidden="true" />
          <span>
            ドラテクは、求人情報を求職者へ提供するサービスです。
            運営者が求職者を選んで企業へ紹介したり、面接日程の調整や条件のやり取りを代行したりすることはありません。
          </span>
        </p>
      </div>
    </section>
  );
}
