"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Info, Calculator } from "lucide-react";
import type { SimulatorEstimate } from "@/lib/calculate-exterior-estimate";
import CouponBadge from "./CouponBadge";

type DiagnosisResultProps = {
  workType: string | null;
  constructionTypes: string[];
  estimate: SimulatorEstimate | null;
};

// 工事内容の選択IDから、おすすめプラン名を導く（文言は従来の診断結果と同一）
const PLAN_RULES: { matchIds: string[]; plan: string }[] = [
  { matchIds: ["concrete"], plan: "駐車場コンクリート・排水改善プラン" },
  { matchIds: ["expand-parking", "garden-to-parking"], plan: "庭撤去・駐車場拡張プラン" },
  { matchIds: ["weed-control", "turf-tile-deck"], plan: "草むしり卒業・雑草対策プラン" },
  { matchIds: ["privacy-fence"], plan: "目隠しフェンス・プライバシー対策プラン" },
];

function getRecommendedPlans(constructionTypes: string[]): string[] {
  const plans = PLAN_RULES.filter((rule) => rule.matchIds.some((id) => constructionTypes.includes(id))).map(
    (rule) => rule.plan
  );
  return Array.from(new Set(plans));
}

export default function DiagnosisResult({ workType, constructionTypes, estimate }: DiagnosisResultProps) {
  const plans = getRecommendedPlans(constructionTypes);
  const workTypeLabel = workType === "new-construction" ? "新築外構" : "外構リフォーム";

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
        お申し込みありがとうございます
      </h2>

      <p className="mt-3">
        <span className="inline-flex items-center rounded-full bg-[#eaf3ee] border border-[#2f7d5a]/30 px-3.5 py-1 text-[12.5px] sm:text-[13px] font-bold text-[#1f4d3d]">
          ご希望の工事：{workTypeLabel}
        </span>
      </p>

      <p className="mt-4 text-[14px] sm:text-[15px] text-[#3d4a45] leading-relaxed text-left sm:text-center">
        ご回答ありがとうございます。
        <br />
        内容を確認のうえ、担当者よりご連絡いたします。
      </p>

      {estimate && (
        <div className="mt-6 rounded-2xl bg-[#fff7ec] border border-[#e8a25a] px-4 py-4 text-left">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-[#a85a1f]">
            <Calculator className="w-4 h-4 shrink-0" aria-hidden="true" />
            今回の概算目安
          </p>
          <p className="mt-1 text-[18px] sm:text-[20px] font-extrabold tracking-tight text-[#d9601a]">
            約{estimate.minMan}万円〜
          </p>
          <p className="mt-1 text-[11.5px] text-[#8a7a55] leading-relaxed">
            対象：{estimate.works.join("・")}／正式な金額は無料の現地調査後に確定します。
          </p>
          <p className="mt-2.5 text-center">
            <CouponBadge />
          </p>
        </div>
      )}

      {plans.length > 0 && (
        <div className="mt-6 space-y-3 text-left">
          {plans.map((plan) => (
            <div key={plan} className="flex items-start gap-3 rounded-2xl bg-white border border-[#e7e3d8] px-4 py-3.5">
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
    </motion.div>
  );
}
