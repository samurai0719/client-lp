"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   adofy LP 共通モーション基盤。
   - scroll は「1本の rAF ループ」に集約し、購読者へ配るだけにする（listener重複防止）
   - 表示検知は IntersectionObserver を優先
   - prefers-reduced-motion / タッチ端末は入口で判定して演出を止める
   ═══════════════════════════════════════════════════════════════════════════ */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** マウス前提の演出（マグネティック・傾き・カーソル追従）を有効にしてよい端末か */
export function isFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** 重い演出を簡略化するモバイル判定 */
export function isNarrowScreen(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

/* ── 共有スクロールループ ────────────────────────────────────────────────── */

type ScrollListener = () => void;
const listeners = new Set<ScrollListener>();
let frame = 0;
let bound = false;

function flush() {
  frame = 0;
  listeners.forEach((fn) => fn());
}

function request() {
  if (frame) return;
  frame = requestAnimationFrame(flush);
}

/**
 * scroll / resize を requestAnimationFrame で1回にまとめて購読する。
 * 戻り値を呼ぶと解除される。購読者が0になればリスナー自体も外す。
 */
export function onScrollFrame(fn: ScrollListener): () => void {
  listeners.add(fn);
  if (!bound) {
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    bound = true;
  }
  // 初回同期
  fn();
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && bound) {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      bound = false;
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }
  };
}

/* ── 表示検知 ───────────────────────────────────────────────────────────── */

type InViewOptions = {
  /** 一度表示したら監視を解除する（既定: true） */
  once?: boolean;
  threshold?: number | number[];
  rootMargin?: string;
};

/**
 * 要素が画面に入ったら `data-in` 属性を付ける。
 * CSS側で `.adf-js .adf-reveal` の初期状態を定義しているため、
 * JSが動かない環境ではコンテンツは最初から見えたままになる。
 *
 * クラスではなく data属性を使うのは、React が className を書き換えたときに
 * 表示状態が巻き戻るのを防ぐため。
 * （例：FAQの開閉で className が変わると、classList で付けた印は消えてしまう）
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: InViewOptions = {}
) {
  const { once = true, threshold = 0.15, rootMargin = "0px 0px -8% 0px" } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // モーション低減時は即座に完了状態にする
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-in", "");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.setAttribute("data-in", "");
            if (once) io.unobserve(el);
          } else if (!once) {
            el.removeAttribute("data-in");
          }
        }
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold, rootMargin]);

  return ref;
}

/**
 * セクションのスクロール進捗（0〜1）を CSS変数として要素に書き込む。
 * React の再描画を挟まないので、スクロール中に再レンダリングが発生しない。
 * 画面外では計算を打ち切る。
 */
export function useScrollProgressVar<T extends HTMLElement = HTMLDivElement>(
  varName: string,
  opts: { onStep?: (step: number) => void; steps?: number } = {}
) {
  const ref = useRef<T>(null);
  const { onStep, steps = 0 } = opts;
  const lastStep = useRef(-1);
  const stepCb = useRef(onStep);

  // 最新のコールバックを保持する（購読を張り直さずに差し替えるため）
  useEffect(() => {
    stepCb.current = onStep;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.style.setProperty(varName, "1");
      if (steps > 0) stepCb.current?.(steps);
      return;
    }

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 0;

      // 画面外なら端の値で固定して以降の計算をしない
      if (rect.bottom < 0) {
        if (lastStep.current !== steps) {
          el.style.setProperty(varName, "1");
          lastStep.current = steps;
          if (steps > 0) stepCb.current?.(steps);
        }
        return;
      }
      if (rect.top > vh) {
        if (lastStep.current !== 0) {
          el.style.setProperty(varName, "0");
          lastStep.current = 0;
          if (steps > 0) stepCb.current?.(0);
        }
        return;
      }

      // 要素上端が画面下から入り、要素下端が画面中央に達するまでを 0→1 とする
      const total = rect.height + vh * 0.55;
      const travelled = vh - rect.top;
      const p = Math.min(Math.max(travelled / total, 0), 1);
      el.style.setProperty(varName, p.toFixed(4));

      if (steps > 0) {
        const next = Math.min(steps, Math.floor(p * (steps + 0.35)));
        if (next !== lastStep.current) {
          lastStep.current = next;
          stepCb.current?.(next);
        }
      }
    };

    return onScrollFrame(update);
  }, [varName, steps]);

  return ref;
}

/** ステップ番号を state として返す（モックアップ演出用） */
export function useScrollSteps<T extends HTMLElement = HTMLDivElement>(steps: number) {
  const [step, setStep] = useState(0);
  const ref = useScrollProgressVar<T>("--adf-sp", { steps, onStep: setStep });
  return { ref, step };
}

/* ── ポインタ演出 ───────────────────────────────────────────────────────── */

/**
 * マグネティックボタン。移動量は最大 6px 程度に抑え、押しにくくならないようにする。
 * タッチ端末・モーション低減時は何もしない。
 */
export function useMagnetic<T extends HTMLElement = HTMLAnchorElement>(strength = 0.22) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!isFinePointer() || prefersReducedMotion()) return;

    const MAX = 6;
    let raf = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      raf = 0;
      el.style.setProperty("--mx", `${x.toFixed(2)}px`);
      el.style.setProperty("--my", `${y.toFixed(2)}px`);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) * strength;
      x = Math.max(-MAX, Math.min(MAX, dx));
      y = Math.max(-MAX, Math.min(MAX, dy));
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      x = 0;
      y = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("blur", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("blur", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return ref;
}

/**
 * カード群にマウス位置を伝える（傾き --rx/--ry と 光の位置 --cx/--cy）。
 * 親要素に1つだけ付ければ、内側の対象カードすべてに効く。
 * スマホ（タッチ端末）では完全に無効。
 */
export function usePointerCards<T extends HTMLElement = HTMLDivElement>(
  selector: string,
  opts: { tilt?: number; glow?: boolean } = {}
) {
  const { tilt = 0, glow = false } = opts;
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!isFinePointer() || prefersReducedMotion()) return;

    let raf = 0;
    let pending: { card: HTMLElement; e: PointerEvent } | null = null;

    const apply = () => {
      raf = 0;
      if (!pending) return;
      const { card, e } = pending;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      if (tilt) {
        card.style.setProperty("--ry", `${((px - 0.5) * tilt).toFixed(2)}deg`);
        card.style.setProperty("--rx", `${((0.5 - py) * tilt).toFixed(2)}deg`);
      }
      if (glow) {
        card.style.setProperty("--cx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--cy", `${(py * 100).toFixed(1)}%`);
      }
      pending = null;
    };

    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>(selector);
      if (!card || !root.contains(card)) return;
      pending = { card, e };
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onOut = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>(selector);
      if (!card) return;
      card.style.removeProperty("--rx");
      card.style.removeProperty("--ry");
    };

    // 傾ける対象であることをCSSに知らせる
    if (tilt) {
      root.querySelectorAll<HTMLElement>(selector).forEach((c) => c.classList.add("is-tilt"));
    }

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerout", onOut);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerout", onOut);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [selector, tilt, glow]);

  return ref;
}

/* ── ユーティリティ ─────────────────────────────────────────────────────── */

/** 時間差表示のインデックスを CSS変数として渡す */
export function stagger(i: number): CSSProperties {
  return { "--adf-i": i } as CSSProperties;
}

/** SVGの線を描く長さを CSS変数として渡す */
export function drawLen(len: number): CSSProperties {
  return { "--len": len } as CSSProperties;
}
