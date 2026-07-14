"use client";

import { Calculator, Info } from "lucide-react";
import type { SimulatorEstimate } from "@/lib/calculate-exterior-estimate";
import CouponBadge from "./CouponBadge";

type DiagnosisEstimateCardProps = {
  estimate: SimulatorEstimate | null;
};

// STEP4冒頭：連絡先の入力前に、選択内容に応じた概算価格帯を表示するカード。
// 金額は config/exterior-pricing.ts 由来のレンジのみ（このコンポーネントで金額を定義しない）。
export default function DiagnosisEstimateCard({ estimate }: DiagnosisEstimateCardProps) {
  return (
    <div className="rounded-2xl border-2 border-[#e8a25a] bg-[#fff7ec] p-4 sm:p-5">
      <p className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-bold text-[#a85a1f]">
        <Calculator className="w-4 h-4 shrink-0" aria-hidden="true" />
        ご入力内容からの概算目安
      </p>

      {estimate ? (
        <>
          <p className="mt-2 text-[15px] sm:text-base font-bold text-[#10302a] leading-relaxed">
            今回の内容では、概算
            <span className="mx-1 text-[26px] sm:text-[30px] font-extrabold tracking-tight text-[#d9601a]">
              {estimate.minMan}
            </span>
            万円〜
            <span className="mx-1 text-[26px] sm:text-[30px] font-extrabold tracking-tight text-[#d9601a]">
              {estimate.maxMan}
            </span>
            万円が目安です
          </p>
          <p className="mt-1.5 text-[12px] text-[#8a7a55]">対象：{estimate.works.join("・")}</p>
          {estimate.hasUnpriced && (
            <p className="mt-1 text-[12px] text-[#8a7a55]">
              ※一部の工事内容は現地確認後のご案内となるため、上記に含まれていません。
            </p>
          )}
        </>
      ) : (
        <p className="mt-2 text-[14px] sm:text-[15px] font-semibold text-[#10302a] leading-relaxed">
          ご選択の内容は現地条件による幅が大きいため、無料の現地調査で正確な概算をご案内します。
        </p>
      )}

      <p className="mt-3 flex items-start gap-1.5 text-[11px] sm:text-[12px] text-[#8a7a55] leading-relaxed">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
        現地状況・撤去工事・地盤・使用商品によって変動します。正式な金額は無料の現地調査後に確定します。
      </p>

      <p className="mt-3 text-center">
        <CouponBadge />
      </p>
    </div>
  );
}
