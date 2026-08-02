"use client";

import { useState } from "react";
import { faqs } from "@/config/nurse-ranking";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-[820px]">
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">FAQ</span>
          <h2 id="faq-heading" className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
            よくある質問
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const panelId = `faq-panel-${i}`;
            const open = openIndex === i;
            return (
              <div key={faq.question} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <h3>
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50 sm:px-5"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={panelId}
                  >
                    <span className="flex-1 text-sm font-semibold leading-relaxed text-slate-800 sm:text-base">
                      {faq.question}
                    </span>
                    <svg
                      className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180 text-teal-600" : ""}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  className="grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-slate-100 px-4 pb-4 pt-3 text-sm leading-relaxed text-slate-600 sm:px-5">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">
          上記で判断できない内容は、各サービスの公式サイト・利用規約を必ずご確認ください。
        </p>
      </div>
    </section>
  );
}
