"use client";

import { useState } from "react";
import { FAQS } from "./config";
import { stagger, useInView } from "./motion";
import { SectionHeading } from "./ui";

/**
 * よくある質問。
 * button + aria-expanded / aria-controls で構成しているため、
 * キーボード（Tab / Enter / Space）だけで開閉できる。
 */
export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="adf-section adf-sec-paper" aria-labelledby="adf-faq-h">
      <div className="adf-container">
        <SectionHeading eyebrow="FAQ" title="よくある質問" id="adf-faq-h" center />

        <div className="adf-faq">
          {FAQS.map((item, i) => (
            <FaqItem
              key={item.q}
              index={i}
              question={item.q}
              answer={item.a}
              isOpen={open === i}
              onToggle={() => setOpen((cur) => (cur === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({
  index,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const ref = useInView<HTMLDivElement>({ threshold: 0.2 });
  const panelId = `adf-faq-panel-${index}`;
  const btnId = `adf-faq-btn-${index}`;

  return (
    <div
      ref={ref}
      className={`adf-faq__item adf-reveal adf-reveal--up${isOpen ? " is-open" : ""}`}
      style={stagger(Math.min(index, 4))}
    >
      <h3 style={{ margin: 0 }}>
        <button
          type="button"
          id={btnId}
          className="adf-faq__q"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="adf-faq__mark" aria-hidden="true">
            Q
          </span>
          <span>{question}</span>
          <span className="adf-faq__icon" aria-hidden="true" />
        </button>
      </h3>

      {/* 閉じている間は inert で支援技術からも外す（CSSのアニメーションは維持される） */}
      <div
        id={panelId}
        className="adf-faq__panel"
        role="region"
        aria-labelledby={btnId}
        inert={!isOpen}
      >
        <div>
          <p className="adf-faq__a">
            <span className="adf-faq__mark" aria-hidden="true">
              A
            </span>
            <span>{answer}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
