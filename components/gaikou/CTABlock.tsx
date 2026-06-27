"use client";

import { ChevronRight } from "lucide-react";
import { buildDiagnosisHref } from "./utm";

type CTABlockProps = {
  className?: string;
  dark?: boolean;
};

export default function CTABlock({ className = "", dark: _dark = false }: CTABlockProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.location.href = buildDiagnosisHref();
  }

  return (
    <div className={`${className}`}>
      <div className="max-w-[26rem] mx-auto">
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
