"use client";

import { useEffect } from "react";

/**
 * LPのスクロール演出。文字や部品の大きさ・配置・改行は変えず、「画面に入ったら現れる」だけを足す。
 * HTMLには手を入れず、下の一覧に当てはまる要素を探して is-in を付ける（動きは scout-motion.css）。
 *
 * ・同じ並びの要素（カード・手順・質問など）は、0.09秒ずつずらして現れる
 * ・読み込んだ時点ですでに画面に見えている要素は、最初から表示のまま（ちらつかせない）
 * ・「動きを減らす」設定、IntersectionObserver が無い環境では何もしない（すべて表示のまま）
 */
const TARGETS = [
  ".dt-head",
  ".ds-intro__body",
  ".ds-steps3 > li",
  ".ds-pgrid > li",
  ".ds-goal",
  ".ds-reason",
  ".ds-scard",
  ".ds-visible2__side",
  ".ds-ctabox",
  ".ds-relay > li",
  ".ds-roles > div",
  ".ds-retention__top",
  ".ds-split__who",
  ".ds-icongrid > li",
  ".ds-split__box",
  ".ds-small",
  ".ds-flownote",
  ".ds-flow3 > li",
  ".ds-cmp",
  ".ds-cmp__notes",
  ".ds-feeline > li",
  ".ds-ptable",
  ".ds-tbd",
  ".ds-rtable__row",
  ".ds-ads__title",
  ".ds-ads__lead",
  ".ds-ads__item",
  ".ds-faq__item",
  ".ds-final__title",
  ".ds-final__body",
  ".ds-final .ds-cta",
].join(",");

export default function ScrollMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".ds-lp");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const els = Array.from(root.querySelectorAll<HTMLElement>(TARGETS));
    const vh = window.innerHeight;

    els.forEach((el) => {
      // 同じ親の中で何番目の対象か → 少しずつ遅らせる（最大0.45秒）
      const siblings = el.parentElement ? Array.from(el.parentElement.children).filter((c) => els.includes(c as HTMLElement)) : [el];
      const i = Math.max(0, siblings.indexOf(el));
      el.style.setProperty("--mo-d", `${Math.min(i * 0.09, 0.45)}s`);
      // すでに画面に見えているものは、そのまま表示
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add("is-in");
    });

    root.classList.add("ds-motion");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    els.filter((el) => !el.classList.contains("is-in")).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
