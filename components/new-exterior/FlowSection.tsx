"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { flowSteps } from "./data";
import NeSectionHeading from "./NeSectionHeading";
import { StaffGuide } from "./svg/LineArtPeople";
import FlowIllust, { type FlowIllustKind } from "./svg/FlowIllust";
import CTABlock from "./CTABlock";

// ステップ番号 → ミニイラストの対応
const STEP_ILLUSTS: FlowIllustKind[] = ["form", "call", "survey", "plan", "construction"];

export default function FlowSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });

  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <div className="relative z-10 max-w-2xl mx-auto">
        <NeSectionHeading
          eyebrow="ご相談の流れ"
          title={"相談から施工までの流れ"}
          description={"5つのステップでご案内します"}
        />

        <div ref={containerRef} className="mt-10 md:mt-14 relative pl-[40px] sm:pl-[48px]">
          <div className="absolute left-[18px] sm:left-[22px] top-2 bottom-2 w-px bg-[#e2ddc9]" />
          <motion.div
            className="absolute left-[18px] sm:left-[22px] top-2 bottom-2 w-px bg-[#6a7c50] origin-top"
            style={{ scaleY: scrollYProgress }}
          />
          <ol className="space-y-7 sm:space-y-8">
            {flowSteps.map((step) => (
              <li key={step.step} className="relative flex items-start gap-4">
                <span className="absolute -left-[40px] sm:-left-[48px] flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-[#6a7c50] text-[#3f4d33] text-[15px] font-bold shrink-0">
                  {step.step}
                </span>
                <div className="pt-1 flex-1 min-w-0">
                  <p className="text-[15px] sm:text-base font-bold text-[#2f3527] leading-snug">{step.title}</p>
                  <p className="mt-1 text-[13.5px] sm:text-[15px] text-[#5f5f52] leading-relaxed">{step.body}</p>
                </div>
                <FlowIllust
                  kind={STEP_ILLUSTS[step.step - 1] ?? "form"}
                  className="w-16 h-16 sm:w-20 sm:h-20 shrink-0"
                />
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex items-end justify-center gap-2 sm:gap-4">
          <p className="ne-bubble-soft ne-soft-tail-r flex-1 max-w-md text-[14px] sm:text-[15px]">
            診断や現地調査を申し込んだだけで、
            <br />
            <span className="ne-marker font-bold">契約になることはありません。</span>ご安心ください！
          </p>
          <StaffGuide flip className="w-24 sm:w-32 shrink-0" />
        </div>

        <div className="mt-12 md:mt-16">
          <CTABlock />
        </div>
      </div>
    </section>
  );
}
