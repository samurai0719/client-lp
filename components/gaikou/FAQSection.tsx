"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "./data";
import SectionHeading from "./SectionHeading";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <SectionHeading eyebrow="FAQ" title={"よくある質問"} />

        <div className="mt-10 md:mt-14 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const buttonId = `${baseId}-faq-button-${i}`;
            const panelId = `${baseId}-faq-panel-${i}`;
            return (
              <div
                key={faq.q}
                className={`rounded-2xl border bg-white overflow-hidden transition-colors ${
                  isOpen ? "border-[#2f7d5a]" : "border-[#e7e3d8]"
                }`}
              >
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 sm:py-5 text-left min-h-[44px]"
                  >
                    <span className="flex-1 min-w-0 text-[13.5px] sm:text-[15px] font-semibold text-[#10302a]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#2f7d5a] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <p className="px-5 pb-4 sm:pb-5 text-[13px] sm:text-sm text-[#52615c] leading-relaxed">{faq.a}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
