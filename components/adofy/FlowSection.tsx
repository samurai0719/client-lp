"use client";

import { useState } from "react";
import { FLOW_STEPS } from "./config";
import { useScrollProgressVar } from "./motion";
import { BlueprintGrid, SectionHeading } from "./ui";
import PhotoBand from "./PhotoBand";

/**
 * 制作の流れ。SVG的な1本線で各ステップをつなぎ、
 * スクロールに応じて線が伸び、通過したステップが点灯する。
 * PC（900px以上）では横並び、それ未満では縦のタイムラインに切り替わる。
 */
export default function FlowSection() {
  const [active, setActive] = useState(0);
  const trackRef = useScrollProgressVar<HTMLDivElement>("--adf-fp", {
    steps: FLOW_STEPS.length,
    onStep: setActive,
  });

  return (
    <section id="flow" className="adf-section adf-sec-dark" aria-labelledby="adf-flow-h">
      <BlueprintGrid tone="dark" opacity={0.45} />

      <div className="adf-container">
        <SectionHeading
          eyebrow="Flow"
          title="ご相談から公開までの流れ"
          id="adf-flow-h"
          center
        />

        <PhotoBand
          src="/images/adofy/photo-consulting.webp"
          alt="建設会社の担当者とオンラインでつなぎ、打ち合わせをしている様子"
          caption="ご相談はオンラインでも承ります"
          tone="dark"
        />

        <div ref={trackRef} className="adf-flow__track">
          {/* 各ステップをつなぐ1本線。スクロールに応じて伸びる */}
          <div className="adf-flow__rail" aria-hidden="true">
            <i />
          </div>

          <ol className="adf-flow__steps">
            {FLOW_STEPS.map((label, i) => (
              <li key={label} className={`adf-step${active > i ? " is-active" : ""}`}>
                <span className="adf-step__dot" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="adf-step__title">{label}</h3>
              </li>
            ))}
          </ol>
        </div>

        <p className="adf-flow__note">
          無理な営業は行いません。現在の課題や目標を確認したうえで、必要なプランをご提案します。
        </p>
      </div>
    </section>
  );
}
