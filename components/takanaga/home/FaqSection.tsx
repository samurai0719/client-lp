"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { faqs } from "@/data/takanaga/faqs";
import AnimateOnScroll from "@/components/takanaga/common/AnimateOnScroll";

const DISPLAY_COUNT = 8;

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const displayFaqs = faqs.slice(0, DISPLAY_COUNT);

  return (
    <section
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <AnimateOnScroll variant="up" className="text-center mb-10">
          <p className="tkn-eyebrow justify-center mb-3">FAQ</p>
          <h2
            id="faq-heading"
            className="text-2xl sm:text-3xl font-bold text-(--tkn-navy-deep) leading-tight"
          >
            よくある質問
          </h2>
          <span className="tkn-heading-line mx-auto mt-3" />
        </AnimateOnScroll>

        <div role="list">
          {displayFaqs.map((faq, i) => {
            const isOpen = openId === faq.id;
            return (
              <AnimateOnScroll key={faq.id} variant="up" delay={i * 50}>
                <div
                  role="listitem"
                  className="tkn-accordion"
                >
                  <button
                    type="button"
                    className="tkn-accordion-trigger"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    id={`faq-trigger-${faq.id}`}
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className="shrink-0 w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold mt-0.5"
                        style={{ background: "var(--tkn-blue)" }}
                        aria-hidden
                      >
                        Q
                      </span>
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-(--tkn-text-muted) transition-transform ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${faq.id}`}
                      className="tkn-accordion-content"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="shrink-0 w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold mt-0.5"
                          style={{ background: "var(--tkn-blue-bright)" }}
                          aria-hidden
                        >
                          A
                        </span>
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        <AnimateOnScroll variant="fade" delay={100} className="text-center mt-8">
          <Link
            href="/takanaga/faq"
            className="inline-flex items-center gap-2 text-sm font-semibold text-(--tkn-blue-bright) hover:text-(--tkn-navy) transition-colors"
          >
            すべてのFAQを見る
            <ArrowRight size={16} aria-hidden />
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
