"use client";

import { INDUSTRIES } from "./config";
import { IndustryIcon } from "./icons";
import { stagger, useInView } from "./motion";
import { SectionHeading } from "./ui";

/** 対応業種。カードごとに専用のinline SVGを持ち、ホバーで一部のパーツが動く */
export default function IndustriesSection() {
  return (
    <section id="industries" className="adf-section adf-sec-paper2" aria-labelledby="adf-ind-h">
      <div className="adf-container">
        <SectionHeading
          eyebrow="Industries"
          title="さまざまな建設業に対応しています"
          id="adf-ind-h"
          center
          lead="業種や地域によって、お客様が重視するポイントは異なります。adofyでは、事業内容や商圏、受注したい工事に合わせて構成を設計します。"
        />

        <div className="adf-industries__grid">
          {INDUSTRIES.map((ind, i) => (
            <IndustryCard key={ind.id} id={ind.id} name={ind.name} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustryCard({
  id,
  name,
  index,
}: {
  id: (typeof INDUSTRIES)[number]["id"];
  name: string;
  index: number;
}) {
  const ref = useInView<HTMLDivElement>({ threshold: 0.2 });
  return (
    <div
      ref={ref}
      className="adf-ind adf-reveal adf-reveal--scale"
      style={stagger(index % 5)}
    >
      <IndustryIcon id={id} />
      <span className="adf-ind__name">{name}</span>
    </div>
  );
}
