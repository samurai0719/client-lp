"use client";

import { ChevronRight } from "lucide-react";
import { buildDiagnosisHref } from "./utm";

type CTABlockProps = {
  className?: string;
  dark?: boolean;
  /** 10%OFFクーポンはページ内で最初に出てくるCTAだけに表示する */
  showCoupon?: boolean;
};

export default function CTABlock({ className = "", dark: _dark = false, showCoupon = false }: CTABlockProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.location.href = buildDiagnosisHref();
  }

  return (
    <div className={`${className}`}>
      <div className="max-w-[26rem] mx-auto">
        {showCoupon && (
          <div className="mb-3 rounded-xl border-2 border-dashed border-[#d9601a] bg-[#fff7ec] px-4 py-3 text-center shadow-[0_3px_14px_rgba(217,96,26,0.18)]">
            <p className="inline-flex items-center gap-1.5 text-[13px] sm:text-[14px] font-bold text-[#a85a1f]">
              <span className="rounded-md bg-[#d9601a] px-1.5 py-0.5 text-[11px] font-extrabold text-white">限定</span>
              ここからご依頼いただいた方だけ
            </p>
            <p className="mt-0.5 text-[17px] sm:text-[19px] font-extrabold text-[#d9601a] leading-tight">
              お見積もり<span className="mx-1 text-[27px] sm:text-[30px] tracking-tight">10%OFF</span>
            </p>
          </div>
        )}

        <a href="/gaikou/diagnosis" onClick={handleClick} className="gaikou-cta-btn">
          <span className="gaikou-cta-btn-inner">
            無料で相談・お見積もりを依頼する
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </span>
        </a>
      </div>
    </div>
  );
}
