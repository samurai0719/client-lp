import { OwnerQuestion } from "./illustrations/scenes";
import { FAQS } from "./content";
import { CtaBlock, Rich, SectionHead } from "./ui";

/**
 * よくある質問・不安解消。
 * 「掲載しない理由」を先回りして潰すため、アコーディオンで隠さず全て開いた状態で見せる。
 */
export default function Faq() {
  return (
    <section className="dt-section dt-faq" aria-labelledby="dt-faq-title">
      <div className="dt-container dt-container--narrow">
        <OwnerQuestion className="dt-faq__art" />
        <SectionHead eyebrow="Q&A" id="dt-faq-title" title="よくある質問" />

        <div className="dt-faq__list">
          {FAQS.map((f) => (
            <article key={f.q} className="dt-faq__item">
              <h3 className="dt-faq__q">
                <span aria-hidden="true">Q</span>
                {f.q}
              </h3>
              <div className="dt-faq__a">
                <span aria-hidden="true">A</span>
                <div className="dt-faq__body">
                  {f.a.map((p) => (
                    <p key={p}>
                      <Rich text={p} />
                    </p>
                  ))}
                  {f.chips && (
                    <ul className="dt-faq__chips">
                      {f.chips.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <CtaBlock
          location="faq"
          lead={
            <>
              疑問が解消したら、
              <br className="dt-sp-only" />
              まずは<strong>求人を1件</strong>掲載してみませんか？
            </>
          }
        />
      </div>
    </section>
  );
}
