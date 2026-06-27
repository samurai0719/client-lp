"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { buildDiagnosisHref } from "./utm";

type CTABlockProps = {
  className?: string;
  dark?: boolean;
};

export default function CTABlock({ className = "", dark = false }: CTABlockProps) {
  // hrefは素のパスのまま残し（SSR・JS無効時の保険）、クリック時にUTM等を引き継いだURLへ遷移する
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.location.href = buildDiagnosisHref();
  }

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <a href="/gaikou/diagnosis" onClick={handleClick} className="gaikou-cta-btn">
        <span className="gaikou-cta-btn-inner">
          無料で外構プランを診断する
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </span>
      </a>
      <p className={`mt-3 flex items-center gap-1.5 text-sm ${dark ? "text-white/55" : "text-[#52615c]"}`}>
        <Sparkles className={`w-4 h-4 ${dark ? "text-[#d4af6a]" : "text-[#2f7d5a]"}`} aria-hidden="true" />
        7つの質問に答えるだけ・最短1分で完了します
      </p>
    </div>
  );
}
