"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CTA_HREF, CTA_LABEL } from "./config";

/**
 * スマホ下部の固定CTA（PCでは非表示）。
 * ・ファーストビューのCTAが見えている間と、相談フォーム（#contact）以降が見えている間は隠す
 *   （同じボタンが二重に見えたり、フォームの入力・送信ボタンに重なったりしないため）
 * ・本文の末尾が隠れないよう、.sr-lp の padding-bottom で固定CTA分の余白を確保している
 */
export default function StickyCta() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".ks-hero__cta");
    const form = document.getElementById("contact");
    const footer = document.querySelector(".sr-footer");
    const ios: IntersectionObserver[] = [];

    // FVのCTA（.ks-hero__cta）は常にページ内にある
    const io = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0 });
    if (hero) io.observe(hero);
    ios.push(io);

    // フォームとフッターのどちらかが見えている間は隠す
    const seen = new Map<Element, boolean>();
    const io2 = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target, e.isIntersecting);
        setFormVisible([...seen.values()].some(Boolean));
      },
      { threshold: 0 },
    );
    if (form) io2.observe(form);
    if (footer) io2.observe(footer);
    ios.push(io2);

    return () => ios.forEach((io) => io.disconnect());
  }, []);

  const hidden = heroVisible || formVisible;

  return (
    <div className={`sr-sticky${hidden ? " is-hidden" : ""}`} aria-hidden={hidden}>
      <a href={CTA_HREF} className="sr-btn sr-btn--lg sr-btn--primary sr-sticky__btn ks-btn" data-sr-cta="sticky" tabIndex={hidden ? -1 : 0}>
        <span>{CTA_LABEL}</span>
        <ArrowRight className="sr-btn__arrow" aria-hidden="true" strokeWidth={2.6} />
      </a>
    </div>
  );
}
