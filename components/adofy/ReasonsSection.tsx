"use client";

import { REASONS } from "./config";
import { ReasonIcon } from "./icons";
import { stagger, useInView, usePointerCards } from "./motion";
import { SectionHeading } from "./ui";
import PhotoBand from "./PhotoBand";

/**
 * 選ばれる理由。大きな番号＋カードごとに異なるinline SVGの大型カード。
 * PCではカーソル位置に光が反応し、SVGの線が描かれる。
 * スマホでは表示時の自然なフェードアップに置き換わる（hover演出は発火しない）。
 */
export default function ReasonsSection() {
  const gridRef = usePointerCards<HTMLDivElement>(".adf-rcard", { glow: true });

  return (
    <section id="reasons" className="adf-section adf-sec-paper2" aria-labelledby="adf-reasons-h">
      <div className="adf-container">
        <SectionHeading
          eyebrow="Why adofy"
          title="建設業者にadofyが選ばれる理由"
          id="adf-reasons-h"
          center
        />

        <PhotoBand
          src="/images/adofy/photo-production.webp"
          alt="建設会社のホームページを、パソコンとスマートフォンの表示を並べて確認しながら制作している様子"
          caption="スマートフォンでの見え方を確認しながら制作します"
        />

        <div ref={gridRef} className="adf-reasons__grid">
          {REASONS.map((r, i) => (
            <ReasonCard key={r.id} index={i} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReasonCard({
  id,
  title,
  body,
  index,
}: (typeof REASONS)[number] & { index: number }) {
  const ref = useInView<HTMLDivElement>({ threshold: 0.2 });
  return (
    <div
      ref={ref}
      className="adf-rcard adf-reveal adf-reveal--up"
      style={stagger(index)}
    >
      <p className="adf-rcard__no" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3>{title}</h3>
      <p>{body}</p>
      <ReasonIcon id={id} />
    </div>
  );
}
