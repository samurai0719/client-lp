import { Check, X } from "lucide-react";
import type { ComponentType } from "react";
import { SectionHead } from "./ui";
import { ConcernedManager, type IllustrationProps } from "./illustrations";
import {
  ProblemBlankPage,
  ProblemBusy,
  ProblemCompare,
  ProblemCost,
  ProblemDropOff,
  ProblemMismatch,
} from "./illustrations/problems";
import { ONLY_CONDITIONS, PROBLEMS, SEEKER_CHECKS } from "./config";

/**
 * 悩みカード（イラスト付き）。それぞれの悩みの「場面」を絵で見せ、自分ごと化してもらう。
 * text は PROBLEMS の文言と一致させ、残りの悩みは下のチェックリストに回す。
 */
const PROBLEM_CARDS: { text: string; Art: ComponentType<IllustrationProps> }[] = [
  { text: "求人媒体に何十万円使っても応募が少ない", Art: ProblemCost },
  { text: "応募が来ても欲しい人材ではない", Art: ProblemMismatch },
  { text: "求人票の条件だけで比較されてしまう", Art: ProblemCompare },
  { text: "会社の良さを伝えたいが、何を書けばいいか分からない", Art: ProblemBlankPage },
  { text: "応募から面接につながらない", Art: ProblemDropOff },
  { text: "採用を担当できる人が社内にいない", Art: ProblemBusy },
];

/**
 * お悩み → 原因の気づき。
 * 「今の採用方法ではまずいかも」→「応募が来ない理由が分かった」まで一気に運ぶ。
 */
export default function Problems() {
  const carded = new Set(PROBLEM_CARDS.map((c) => c.text));
  const rest = PROBLEMS.filter((p) => !carded.has(p));

  return (
    <section className="sr-section sr-problems" aria-labelledby="sr-problems-title">
      <div className="sr-container">
        <SectionHead
          eyebrow="PROBLEM"
          id="sr-problems-title"
          title={
            <>
              採用で、
              <br />
              こんな状態に
              <br className="sr-sp-only" />
              なっていませんか？
            </>
          }
        />

        <ul className="sr-pcards">
          {PROBLEM_CARDS.map(({ text, Art }, i) => (
            <li key={text} className="sr-pcard">
              <div className="sr-pcard__artbox">
                <Art className="sr-pcard__art" />
              </div>
              <div className="sr-pcard__body">
                <span className="sr-pcard__no">お悩み {String(i + 1).padStart(2, "0")}</span>
                <p className="sr-pcard__text">{text}</p>
              </div>
            </li>
          ))}
        </ul>

        <ul className="sr-problems__list">
          {rest.map((p) => (
            <li key={p}>
              <span className="sr-problems__check" aria-hidden="true">
                <Check strokeWidth={3.2} />
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <div className="sr-problems__turnbox">
          <ConcernedManager className="sr-problems__turnart" />
          <p className="sr-problems__turn">
            もし1つでも当てはまるなら、
            <br />
            問題は<strong>「人がいない」だけではない</strong>
            <br className="sr-sp-only" />
            かもしれません。
          </p>
        </div>
      </div>

      <div className="sr-cause">
        <div className="sr-container sr-container--narrow">
          <h3 className="sr-cause__title">
            応募が来ない会社には、
            <br />
            <span className="sr-cause__accent">応募が来ない理由</span>が
            <br className="sr-sp-only" />
            あります。
          </h3>

          <p className="sr-cause__text">求職者は求人を見た瞬間に、次のことを判断しています。</p>
          <ol className="sr-cause__checks">
            {SEEKER_CHECKS.map((c, i) => (
              <li key={c}>
                <span className="sr-cause__no">{i + 1}</span>
                <span>「{c}」</span>
              </li>
            ))}
          </ol>

          <p className="sr-cause__text">しかし多くの求人ページは、</p>
          <div className="sr-cause__only">
            <ul>
              {ONLY_CONDITIONS.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p>だけを掲載して終わっています。</p>
          </div>

          <p className="sr-cause__warn">
            <X aria-hidden="true" strokeWidth={3} />
            <span>
              これでは、
              <br className="sr-sp-only" />
              他社との違いが伝わりません。
            </span>
          </p>

          <blockquote className="sr-cause__quote">
            <p>
              条件が同じなら、
              <br />
              求職者は<strong>“より魅力が伝わる会社”</strong>を選びます。
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
