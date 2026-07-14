"use client";

import { motion } from "framer-motion";
import { TOTAL_STEPS } from "./types";

type DiagnosisProgressProps = {
  step: number;
};

export default function DiagnosisProgress({ step }: DiagnosisProgressProps) {
  const percent = Math.min(100, Math.round((step / TOTAL_STEPS) * 100));

  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[#e7e3d8]">
      {/* LPから引き継いだ10%OFF訴求（診断中も常に見える固定バッジ） */}
      <p className="bg-[#d9601a] text-white text-center text-[11px] sm:text-[12px] font-bold py-1.5 px-3">
        SNS広告限定｜お見積もり10%OFF適用中
      </p>
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[13px] sm:text-sm font-bold text-[#10302a]">外構プラン無料診断</p>
          <p className="text-[12px] sm:text-sm font-semibold text-[#2f7d5a]">
            STEP {step} / {TOTAL_STEPS}
          </p>
        </div>
        <p className="mb-2 text-[10.5px] sm:text-[11px] text-[#8a9a90] leading-snug">
          4つのステップに答えるだけで、概算費用の目安が分かります
        </p>
        <div
          className="h-2 rounded-full bg-[#eef0ea] overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={TOTAL_STEPS}
          aria-valuenow={step}
          aria-label="診断の進捗"
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#2f7d5a] to-[#1f4d3d]"
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
