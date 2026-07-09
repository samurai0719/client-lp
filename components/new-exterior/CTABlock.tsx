"use client";

import { ChevronRight } from "lucide-react";
import { buildDiagnosisHref } from "./utm";

// LP内のCTAはすべてこの1種類に統一する（文言・装飾を変えない）。
// 「＼ 煽り ／」＋［無料］バッジ付きボタン＋補足の3点セット。
const SHOUT = "一番いい外構プランがみつかる";
const LABEL = "かんたん診断で費用を確認する";
const NOTE = "30秒で完了・契約義務なし・現地調査無料";

type CTABlockProps = {
  className?: string;
  /** 濃色背景に置くとき true（煽り・補足の文字色を明るくする） */
  dark?: boolean;
};

export default function CTABlock({ className = "", dark = false }: CTABlockProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.location.href = buildDiagnosisHref();
  }

  return (
    <div className={className}>
      <div className="max-w-[26rem] mx-auto">
        {/* ここから限定の10%OFFクーポン（診断CTAの目玉訴求） */}
        <div className="mb-3 rounded-xl border-2 border-dashed border-[#b0502f] bg-[#fff3e8] px-4 py-3 text-center shadow-[0_3px_14px_rgba(176,80,47,0.18)]">
          <p className="inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] font-bold text-[#8c3d1d]">
            <span className="rounded-md bg-[#b0502f] px-1.5 py-0.5 text-[11px] font-extrabold text-white">限定</span>
            ここからご依頼いただいた方だけ
          </p>
          <p className="mt-0.5 text-[17px] sm:text-[19px] font-extrabold text-[#b0502f] leading-tight">
            お見積もり<span className="mx-1 text-[27px] sm:text-[30px] tracking-tight">10%OFF</span>
          </p>
        </div>

        <p className="text-center mb-2.5">
          <span
            className={`ne-shout text-[14.5px] sm:text-[16px] ${
              dark ? "!text-white before:!bg-white after:!bg-white" : ""
            }`}
          >
            {SHOUT}
          </span>
        </p>
        <a href="/new-exterior/diagnosis" onClick={handleClick} className="ne-cta-btn !py-4">
          <span className="ne-cta-btn-inner">
            <span className="inline-flex items-center justify-center rounded-md bg-white px-1.5 py-0.5 text-[13px] font-extrabold text-[#b0502f] shrink-0">
              無料
            </span>
            {LABEL}
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </span>
        </a>
        <p
          className={`mt-2 text-center text-[13px] font-semibold ${
            dark ? "text-[#b7c39a]" : "text-[#5a6b46]"
          }`}
        >
          {NOTE}
        </p>
      </div>
    </div>
  );
}
