"use client";

import { useEffect } from "react";

/**
 * LPのスクロール演出。ページの中の印（data-*）を見て、画面に入った要素に is-in を付けるだけ。
 * 動きそのものは scout-lp.css に書く。
 *
 *   data-reveal  … 説明文・図。is-in でふわっと出る（--d で遅れを指定）
 *   data-lines   … 見出し。行（.ln）ごとに下から出る
 *   data-count   … 数字。画面に入ったら一度だけ 0 から数え上げる（data-count に最終値）
 *   data-play    … 順番に強調する図（サービスの3段階・料金比較）。is-in でCSSの時間差が動く
 *
 * 演出が有効なのは <html> に ds-motion が付いているときだけ（Shell の先頭のスクリプトで付ける。
 * 「動きを減らす」設定の端末では付けない）。付いていなければ最初からすべて表示される。
 */
const SELECTOR = "[data-reveal], [data-lines], [data-count], [data-play]";

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  const duration = 1400;
  const start = performance.now();
  const fmt = (n: number) => Math.round(n).toLocaleString("ja-JP");
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    el.textContent = fmt(target * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export default function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("ds-motion") || !("IntersectionObserver" in window)) {
      root.classList.remove("ds-motion");
      return;
    }

    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    // 数字はいったん 0 にしてから数える（JSが動かない環境ではHTMLの最終値のまま）
    els.filter((el) => el.dataset.count).forEach((el) => (el.textContent = "0"));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          el.classList.add("is-in");
          if (el.dataset.count) {
            const delay = Number(el.dataset.countDelay ?? 0);
            window.setTimeout(() => countUp(el), delay);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
