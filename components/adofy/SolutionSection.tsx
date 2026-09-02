"use client";

import { SOLUTIONS } from "./config";
import { stagger, useInView } from "./motion";
import { BlueprintGrid, CtaBlock, SectionHeading } from "./ui";
import PhotoBand from "./PhotoBand";

/**
 * 解決策セクション。
 * 背景が暗色（悩み）→ 明色（解決）へ切り替わり、
 * その境目を1本のSVGラインがつないで「悩みから解決へ」を視覚化する。
 */
export default function SolutionSection() {
  const bridgeRef = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section id="solution" className="adf-solution" aria-labelledby="adf-solution-h">
      {/* ここまでが暗色（悩み側）。見出しの直後で明色へ切り替わる */}
      <div className="adf-solution__top">
      {/* 悩み側から解決側へつながる線 */}
      <div ref={bridgeRef} className="adf-solution__bridge">
        <svg
          viewBox="0 0 1200 170"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 6 C 300 6, 360 150, 600 150 C 840 150, 900 6, 1200 6"
            stroke="#f26a1b"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M0 6 C 300 6, 360 150, 600 150 C 840 150, 900 6, 1200 6"
            stroke="#f26a1b"
            strokeWidth="10"
            opacity="0.14"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="adf-container adf-solution__head">
        <SectionHeading
          eyebrow="Solution"
          title="そのお悩み、adofyなら解決できます。"
          id="adf-solution-h"
          center
          lead="adofyが制作するのは、会社案内として置いておくだけのホームページではありません。広告運用と実際の集客経験をもとに、問い合わせにつながる導線まで考えたホームページを制作します。"
        />
      </div>
      </div>

      {/* ここから明色（解決側） */}
      <div className="adf-solution__body">
        {/* 設計図グリッド（可読性を邪魔しない濃度） */}
        <BlueprintGrid tone="light" opacity={0.35} />

        <div className="adf-container">
        <PhotoBand
          src="/images/adofy/photo-planning.webp"
          alt="ホームページの構成やワイヤーフレームを、資料を広げながら複数人で検討している様子"
          caption="デザインの前に、何を伝えれば問い合わせにつながるかを整理します"
        />

        <ul className="adf-sol-list">
          {SOLUTIONS.map((s, i) => (
            <SolutionItem key={s.title} index={i} title={s.title} body={s.body} />
          ))}
        </ul>

        <div style={{ marginTop: 48 }}>
          <CtaBlock guide />
        </div>
        </div>
      </div>
    </section>
  );
}

function SolutionItem({ index, title, body }: { index: number; title: string; body: string }) {
  const ref = useInView<HTMLLIElement>({ threshold: 0.25 });
  return (
    <li
      ref={ref}
      className="adf-sol adf-reveal adf-reveal--up"
      style={stagger(index)}
    >
      <span className="adf-sol__no" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </li>
  );
}
