import type { ComponentType } from "react";
import type { IllustrationProps } from "./illustrations/kit";
import { ReasonAds, ReasonDirect, ReasonResults, ReasonSelfChoice, ReasonSuccessFee } from "./illustrations/scenes";
import { REASONS, type ReasonArt } from "./content";
import { Rich, SectionHead } from "./ui";

const ARTS: Record<ReasonArt, ComponentType<IllustrationProps>> = {
  results: ReasonResults,
  ads: ReasonAds,
  selfChoice: ReasonSelfChoice,
  direct: ReasonDirect,
  successFee: ReasonSuccessFee,
};

/** ドラテクが選ばれる理由（5つ）。スマホは縦積み、PCは絵と文を左右交互に置く */
export default function Reasons() {
  return (
    <section className="dt-section dt-reasons" aria-labelledby="dt-reasons-title">
      <div className="dt-container">
        <SectionHead
          eyebrow="REASON"
          id="dt-reasons-title"
          title={
            <>
              ドラテクが
              <br />
              ドライバー採用に
              <br className="dt-sp-only" />
              強い理由
            </>
          }
        />

        <ol className="dt-reasons__list">
          {REASONS.map((r, i) => {
            const Art = ARTS[r.art];
            return (
              <li key={r.title} className="dt-reason">
                <div className="dt-reason__artbox">
                  <Art className="dt-reason__art" />
                </div>
                <div className="dt-reason__body">
                  <p className="dt-reason__no">
                    理由<b>{String(i + 1).padStart(2, "0")}</b>
                  </p>
                  <h3 className="dt-reason__title">{r.title}</h3>
                  {r.body.map((p) => (
                    <p key={p} className="dt-reason__text">
                      <Rich text={p} />
                    </p>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
