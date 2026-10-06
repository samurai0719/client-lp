import type { ComponentType } from "react";
import { Rich, SectionHead } from "./ui";
import {
  ApplicantsGather,
  ChosenCompany,
  Consulting,
  Designing,
  GuaranteeRelief,
  PlanCompare,
  Presentation,
  Questioning,
  TeamLineup,
  type IllustrationProps,
} from "./illustrations";
import { OBJECTIONS } from "./config";

/**
 * よくある不安・反論処理。
 * 「依頼しない理由」を先回りして潰すため、アコーディオンで隠さず全て開いた状態で見せる。
 */
/** 各回答に添える挿絵（不安 → 納得の場面）。OBJECTIONS の並び順に対応 */
const ANSWER_ARTS: ComponentType<IllustrationProps>[] = [
  ApplicantsGather,
  Consulting,
  Designing,
  TeamLineup,
  ChosenCompany,
  PlanCompare,
  PlanCompare,
  Presentation,
  GuaranteeRelief,
];

export default function FAQ() {
  return (
    <section className="sr-section sr-faq" aria-labelledby="sr-faq-title">
      <div className="sr-container sr-container--narrow">
        <Questioning className="sr-faq__headart" />
        <SectionHead
          eyebrow="Q&A"
          id="sr-faq-title"
          title={
            <>
              でも、本当に
              <br />
              うちでも
              <br className="sr-sp-only" />
              効果がありますか？
            </>
          }
          lead="ご相談前によくいただく不安に、正直にお答えします。"
        />

        <div className="sr-faq__list">
          {OBJECTIONS.map((o, idx) => {
            const Art = ANSWER_ARTS[idx];
            return (
            <article key={o.q} className="sr-faq__item">
              <h3 className="sr-faq__question">
                <span className="sr-faq__q" aria-hidden="true">Q</span>
                <span>{o.q}</span>
              </h3>
              <div className="sr-faq__answer">
                <span className="sr-faq__a" aria-hidden="true">A</span>
                <div className="sr-faq__body">
                  {Art && <Art className="sr-faq__art" />}
                  {o.a.map((para, i) => (
                    <div key={para}>
                      <p>
                        <Rich text={para} />
                      </p>
                      {o.list && o.listAfter === i && (
                        <ul className="sr-faq__chips">
                          {o.list.map((l) => (
                            <li key={l}>{l}</li>
                          ))}
                        </ul>
                      )}
                      {o.calc && i === 0 && (
                        <div className="sr-faq__calc" aria-label="求人媒体に毎月20万円を12ヶ月払うと年間240万円">
                          <span className="sr-faq__calc-item">
                            月<b>20</b>万円
                          </span>
                          <span className="sr-faq__calc-op">×</span>
                          <span className="sr-faq__calc-item">
                            <b>12</b>ヶ月
                          </span>
                          <span className="sr-faq__calc-op">＝</span>
                          <span className="sr-faq__calc-item is-total">
                            年間<b>240</b>万円
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
