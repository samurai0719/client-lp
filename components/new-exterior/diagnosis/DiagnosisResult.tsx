"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Info } from "lucide-react";
import PhoneCallNotice from "@/components/gaikou/PhoneCallNotice";

// 送信完了画面
export default function DiagnosisResult() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="text-center py-4"
    >
      <div className="w-16 h-16 rounded-full bg-[#eaf3ee] flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-8 h-8 text-[#2f7d5a]" aria-hidden="true" />
      </div>

      <h2 className="text-[1.3rem] sm:text-[1.6rem] font-bold text-[#10302a] tracking-tight">
        お問い合わせありがとうございます
      </h2>

      <p className="mt-4 text-[14px] sm:text-[15px] text-[#3d4a45] leading-relaxed">
        内容を確認のうえ、
        <br className="sm:hidden" />
        担当者よりご連絡いたします。
      </p>

      <PhoneCallNotice />

      <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-[#f9f7f1] border border-[#e7e3d8] px-4 py-3.5 text-left">
        <Info className="w-4 h-4 text-[#6b7a73] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-[12.5px] sm:text-sm text-[#6b7a73] leading-relaxed">
          正式な施工内容と金額は、
          <br />
          現地調査後のお見積もりで確定します。
        </p>
      </div>
    </motion.div>
  );
}
