"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Info } from "lucide-react";

type DiagnosisResultProps = {
  worries: string[];
};

const PLAN_RULES: { matchIds: string[]; plan: string }[] = [
  { matchIds: ["gravel-scatter", "mud-puddle"], plan: "駐車場コンクリート・排水改善プラン" },
  { matchIds: ["parking-shortage"], plan: "庭撤去・駐車場拡張プラン" },
  { matchIds: ["weeding"], plan: "草むしり卒業・雑草対策プラン" },
  { matchIds: ["privacy"], plan: "目隠しフェンス・プライバシー対策プラン" },
];

function getRecommendedPlans(worries: string[]): string[] {
  const plans = PLAN_RULES.filter((rule) => rule.matchIds.some((id) => worries.includes(id))).map((rule) => rule.plan);
  return Array.from(new Set(plans));
}

export default function DiagnosisResult({ worries }: DiagnosisResultProps) {
  const plans = getRecommendedPlans(worries);

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

      <h2 className="text-[1.3rem] sm:text-[1.6rem] font-bold text-[#10302a] tracking-tight">診断が完了しました</h2>

      <p className="mt-4 text-[14px] sm:text-[15px] text-[#3d4a45] leading-relaxed text-left sm:text-center">
        ご回答ありがとうございます。
        <br />
        <br />
        ご希望の工事内容と現在のお悩みをもとに、
        お客様に合った外構リフォームプランをご案内します。
        <br />
        <br />
        担当者からのご連絡をお待ちください。
      </p>

      {plans.length > 0 && (
        <div className="mt-6 space-y-3 text-left">
          {plans.map((plan) => (
            <div key={plan} className="flex items-start gap-3 rounded-2xl bg-[#fff7ec] border border-[#e8a25a] px-4 py-3.5">
              <Sparkles className="w-5 h-5 text-[#d9601a] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-[11px] font-bold text-[#a85a1f]">おすすめプラン</p>
                <p className="text-[14px] sm:text-[15px] font-bold text-[#10302a]">{plan}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-[#f9f7f1] border border-[#e7e3d8] px-4 py-3.5 text-left">
        <Info className="w-4 h-4 text-[#6b7a73] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-[12.5px] sm:text-sm text-[#6b7a73] leading-relaxed">
          正式な施工内容と金額は、
          <br />
          現地調査後のお見積もりで確定します。
        </p>
      </div>

      <div className="mt-4 rounded-xl bg-[#eef0ea] px-4 py-3 text-[12px] sm:text-sm text-[#5a655f]">
        現在はテスト運用中です。
        <br />
        送信機能は後から接続します。
      </div>
    </motion.div>
  );
}
