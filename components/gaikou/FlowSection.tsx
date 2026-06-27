"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { Info } from "lucide-react";
import { flowSteps } from "./data";
import SectionHeading from "./SectionHeading";
import CTABlock from "./CTABlock";
import SectionBackdrop from "./SectionBackdrop";

export default function FlowSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });

  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <SectionBackdrop variant="wave" tone="green" />
      <div className="relative z-10 max-w-2xl mx-auto">
        <SectionHeading eyebrow="FLOW" title={"工事完了までの流れ"} description={"お問い合わせから引き渡しまで7つのステップでご案内します"} />

        <div ref={containerRef} className="mt-10 md:mt-14 relative pl-[40px] sm:pl-[48px]">
          <div className="absolute left-[18px] sm:left-[22px] top-2 bottom-2 w-px bg-[#e2ddc9]" />
          <motion.div
            className="absolute left-[18px] sm:left-[22px] top-2 bottom-2 w-px bg-[#2f7d5a] origin-top"
            style={{ scaleY: scrollYProgress }}
          />
          <ol className="space-y-7 sm:space-y-8">
            {flowSteps.map((step) => (
              <li key={step.step} className="relative flex items-start gap-4">
                <span className="absolute -left-[40px] sm:-left-[48px] flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-[#2f7d5a] text-[#1f4d3d] text-sm font-bold shrink-0">
                  {step.step}
                </span>
                <p className="pt-1 text-[14px] sm:text-base font-bold text-[#10302a] leading-snug">{step.title}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex items-start gap-2.5 rounded-xl bg-[#eaf3ee] border border-[#bfe0cd] px-4 py-3.5">
          <Info className="w-4 h-4 text-[#1f4d3d] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[13px] sm:text-sm font-semibold text-[#1f4d3d] leading-relaxed">
            現地調査を申し込んだだけで、
            <br />
            契約になることはありません。
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          <CTABlock />
        </div>
      </div>
    </section>
  );
}
