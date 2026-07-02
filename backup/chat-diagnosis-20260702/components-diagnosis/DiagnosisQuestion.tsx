"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

const variants = {
  enter: (direction: "forward" | "backward") => ({
    opacity: 0,
    x: direction === "forward" ? 28 : -28,
  }),
  center: { opacity: 1, x: 0 },
  exit: (direction: "forward" | "backward") => ({
    opacity: 0,
    x: direction === "forward" ? -28 : 28,
  }),
};

type DiagnosisQuestionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  direction: "forward" | "backward";
  showBack: boolean;
  onBack?: () => void;
  nextLabel?: string;
  onNext?: () => void;
  nextDisabled?: boolean;
};

export default function DiagnosisQuestion({
  title,
  description,
  children,
  direction,
  showBack,
  onBack,
  nextLabel,
  onNext,
  nextDisabled,
}: DiagnosisQuestionProps) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <h2 className="text-[1.15rem] sm:text-[1.4rem] font-bold text-[#10302a] leading-snug tracking-tight">{title}</h2>
      {description && <p className="mt-1.5 text-[13px] sm:text-sm text-[#6b7a73]">{description}</p>}

      <div className="mt-5 sm:mt-6">{children}</div>

      <div className="mt-7 flex items-center gap-3">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 min-h-[44px] px-3 text-sm font-semibold text-[#6b7a73] hover:text-[#10302a] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            戻る
          </button>
        )}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="gaikou-cta-btn flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="gaikou-cta-btn-inner">{nextLabel ?? "次の質問へ"}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
