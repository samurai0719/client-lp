"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { buildDiagnosisHref } from "./utm";

// スマホ・タブレット用の画面下部固定CTA。スクロール中も常に表示し、
// お問い合わせフォーム（#contact）やフッターが見えている間は
// 入力の邪魔にならないよう非表示にする。
// （タブレットはFV画像が縦長でCTAが初期画面に入らないため、lg未満で表示する）
export default function GaikouFixedCta() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets: Element[] = [];
    const contact = document.getElementById("contact");
    const footer = document.querySelector("footer");
    if (contact) targets.push(contact);
    if (footer) targets.push(footer);
    if (targets.length === 0) return;

    const visibility = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visibility.set(entry.target, entry.isIntersecting));
        setHidden([...visibility.values()].some(Boolean));
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    window.location.href = buildDiagnosisHref();
  }

  return (
    <div
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 px-3 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-sm border-t border-[#e7e3d8] transition-transform duration-300 ${
        hidden ? "translate-y-full pointer-events-none" : "translate-y-0"
      }`}
      aria-hidden={hidden}
    >
      <a
        href="/gaikou/diagnosis"
        onClick={handleClick}
        className="gaikou-cta-btn w-full !max-w-none !py-3.5 text-[15px]"
        tabIndex={hidden ? -1 : 0}
      >
        <span className="gaikou-cta-btn-inner">
          無料で概算費用を確認する
          <ChevronRight className="w-5 h-5 shrink-0" aria-hidden="true" />
        </span>
      </a>
    </div>
  );
}
