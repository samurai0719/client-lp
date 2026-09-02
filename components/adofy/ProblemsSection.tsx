"use client";

import { PROBLEMS } from "./config";
import { stagger, usePointerCards, useInView } from "./motion";
import { ProblemIcon } from "./icons";
import { BlueprintGrid, SectionHeading } from "./ui";

/**
 * お悩みセクション。ページ内で最も暗いトーンにして、
 * 次の解決策セクションで明るく切り替わる落差を作る。
 */
export default function ProblemsSection() {
  // PCのみ：マウス位置に応じたごく軽い傾き（±5度以内）
  const gridRef = usePointerCards<HTMLDivElement>(".adf-pcard", { tilt: 5 });
  const msgRef = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section id="problems" className="adf-section adf-sec-dark" aria-labelledby="adf-problems-h">
      <BlueprintGrid tone="dark" opacity={0.55} />

      <div className="adf-container">
        <SectionHeading
          eyebrow="Issues"
          title="こんなお悩みありませんか？"
          id="adf-problems-h"
          center
        />

        <div ref={gridRef} className="adf-problems__grid">
          {PROBLEMS.map((p, i) => (
            <ProblemCard key={p.id} id={p.id} text={p.text} index={i} />
          ))}
        </div>

        <div ref={msgRef} className="adf-problems__msg adf-reveal adf-reveal--up">
          <p>
            <strong>その悩み、仕事を選べない状況が原因かもしれません。</strong>
            自社で直接お客様を集められる仕組みがあれば、価格や取引先に振り回されにくい経営を目指せます。
          </p>
        </div>
      </div>
    </section>
  );
}

function ProblemCard({
  id,
  text,
  index,
}: {
  id: (typeof PROBLEMS)[number]["id"];
  text: string;
  index: number;
}) {
  const ref = useInView<HTMLDivElement>({ threshold: 0.2 });
  return (
    <div
      ref={ref}
      className="adf-pcard adf-reveal adf-reveal--up"
      style={stagger(index)}
    >
      <span className="adf-pcard__no" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <ProblemIcon id={id} />
      <p className="adf-pcard__text">{text}</p>
    </div>
  );
}
