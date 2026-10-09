import type { ComponentType } from "react";
import type { IllustrationProps } from "./illustrations/kit";
import {
  MoneyDrain,
  ProblemLargeLicense,
  ProblemMediaCost,
  ProblemMultiMedia,
  ProblemNoApply,
  ProblemNoHR,
  ProblemNoInterview,
  ProblemPayFirst,
  ProblemTurnDown,
} from "./illustrations/scenes";
import { PROBLEMS, type ProblemArt } from "./content";
import { Breakable, CtaBlock, SectionHead } from "./ui";

const ARTS: Record<ProblemArt, ComponentType<IllustrationProps>> = {
  mediaCost: ProblemMediaCost,
  noApply: ProblemNoApply,
  noInterview: ProblemNoInterview,
  turnDown: ProblemTurnDown,
  largeLicense: ProblemLargeLicense,
  noHR: ProblemNoHR,
  multiMedia: ProblemMultiMedia,
  payFirst: ProblemPayFirst,
};

/**
 * お悩み（8点・イラスト付き）→ 問題提起。
 * 「今の求人媒体、高いな」「応募が来なくても金を払っているな」と気づいてもらうところまで運ぶ。
 */
export default function Problems() {
  return (
    <section className="dt-section dt-problems" aria-labelledby="dt-problems-title">
      <div className="dt-container">
        <SectionHead
          eyebrow="PROBLEM"
          id="dt-problems-title"
          title={
            <>
              ドライバー採用で、
              <br />
              こんなお悩み
              <br className="dt-sp-only" />
              ありませんか？
            </>
          }
        />

        <ul className="dt-pcards">
          {PROBLEMS.map(({ text, art }, i) => {
            const Art = ARTS[art];
            return (
              <li key={art} className="dt-pcard">
                <div className="dt-pcard__artbox">
                  <Art className="dt-pcard__art" />
                </div>
                <div className="dt-pcard__body">
                  <span className="dt-pcard__no">お悩み {String(i + 1).padStart(2, "0")}</span>
                  <p className="dt-pcard__text">
                    <Breakable text={text[0]} />
                    <br />
                    <strong>
                      <Breakable text={text[1]} />
                    </strong>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="dt-cause">
        <div className="dt-container dt-container--narrow">
          <h3 className="dt-cause__title">
            採用できなくても、
            <br />
            <span className="dt-cause__accent">求人広告費は</span>
            <br className="dt-sp-only" />
            <span className="dt-cause__accent">戻ってきません。</span>
          </h3>

          <MoneyDrain className="dt-cause__art" />

          <p className="dt-cause__text">
            掲載課金型の求人媒体では、
            <br />
            <strong>掲載した時点で費用が発生</strong>します。
          </p>

          <ul className="dt-cause__list">
            <li>
              <b>10万円</b>使っても、
            </li>
            <li>
              <b>30万円</b>使っても、
            </li>
            <li>
              <b>応募0件</b>でも、
            </li>
            <li>
              <b>採用0人</b>でも、
            </li>
          </ul>
          <p className="dt-cause__warn">広告費は発生します。</p>

          <p className="dt-cause__turn">
            そこでドラテクは、
            <br />
            <strong>料金体系そのもの</strong>を変えました。
          </p>

          <CtaBlock
            location="problems"
            invert
            lead={
              <>
                まずは<strong>掲載だけ</strong>でも大丈夫です。
                <br />
                採用できるまで、
                <br className="dt-sp-only" />
                費用はかかりません。
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}
