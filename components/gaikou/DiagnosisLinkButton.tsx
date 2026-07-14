"use client";

import { ChevronRight } from "lucide-react";
import { buildDiagnosisHref } from "./utm";

type DiagnosisLinkButtonProps = {
  label: string;
  className?: string;
};

// 診断ページへのCTAボタン（文言だけ差し替えたい箇所用）。
// UTM・fbclid・gclid・ttclid は buildDiagnosisHref がすべて引き継ぐ。
export default function DiagnosisLinkButton({ label, className = "" }: DiagnosisLinkButtonProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.location.href = buildDiagnosisHref();
  }

  return (
    <a href="/gaikou/diagnosis" onClick={handleClick} className={`gaikou-cta-btn ${className}`}>
      <span className="gaikou-cta-btn-inner">
        {label}
        <ChevronRight className="w-5 h-5 shrink-0" aria-hidden="true" />
      </span>
    </a>
  );
}
