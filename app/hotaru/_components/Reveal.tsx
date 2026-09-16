"use client";

import { useEffect } from "react";

/**
 * スクロール時の控えめなフェードイン。
 * JSが動いたときだけ data-motion="on" を付けるため、JSなし・視差効果を減らす設定では
 * 最初からすべて表示されたままになる。
 */
export default function Reveal() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".hotaru");
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(".ht-reveal"));
    // すでに画面内・通過済みの要素は隠さない（ちらつき防止）
    const vh = window.innerHeight;
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.95) el.classList.add("is-visible");
    });
    root.dataset.motion = "on";

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    targets.filter((el) => !el.classList.contains("is-visible")).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
