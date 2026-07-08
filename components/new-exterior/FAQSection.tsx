"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "./data";
import NeSectionHeading from "./NeSectionHeading";
import { StaffFace } from "./svg/LineArtPeople";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <NeSectionHeading eyebrow="よくある質問" title={"よくある質問"} />

        <div className="mt-10 md:mt-14 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const buttonId = `${baseId}-faq-button-${i}`;
            const panelId = `${baseId}-faq-panel-${i}`;
            return (
              <div
                key={faq.q}
                className={`rounded-2xl bg-white overflow-hidden transition-shadow shadow-[0_3px_16px_rgba(70,66,50,0.08)] ${
                  isOpen ? "ring-2 ring-[#6a7c50]/50" : ""
                }`}
              >
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-4 sm:py-5 text-left min-h-[44px]"
                  >
                    <span
                      className="ne-serif flex items-center justify-center w-8 h-8 rounded-full bg-[#3f4d33] text-white text-[16px] font-bold shrink-0"
                      aria-hidden="true"
                    >
                      Q
                    </span>
                    <span className="flex-1 min-w-0 text-[14.5px] sm:text-[16px] font-semibold text-[#2f3527]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#6a7c50] shrink-0 transition-transform duration-200 ${
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
                  {/* 回答は職人キャラの吹き出しで表示する */}
                  <div className="flex items-start gap-2.5 px-4 sm:px-5 pb-4 sm:pb-5">
                    <StaffFace className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 mt-1" />
                    <p className="ne-bubble-soft ne-soft-tail-l flex-1 text-[14px] sm:text-[15px] !font-medium text-[#45463a]">
                      {faq.a}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
