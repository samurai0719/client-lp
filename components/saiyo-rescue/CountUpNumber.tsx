"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * 数字のカウントアップ（0 → value）。画面に入ったら1回だけ再生する。
 *
 * ・毎フレームの更新は textContent を直接書き換える（React の再レンダーを起こさない）
 * ・最終値を見えないゴーストとして同じセルに重ね、幅を最初から確保する（レイアウトシフト・横ブレ防止）
 * ・SSR/HTML には最終値が入っている。JSが動かない環境・reduced-motion では最初から最終値を表示する
 * ・IntersectionObserver はページ内の全インスタンスで1つを共有する
 */
type Props = {
  value: number;
  /** 数字の後ろにつける単位など（件 / 人 / 円 / % / 以上）。カウント対象外 */
  suffix?: ReactNode;
  /** 数字の前につける記号など。カウント対象外 */
  prefix?: ReactNode;
  /** ミリ秒 */
  duration?: number;
  /** 開始の遅延（ミリ秒）。カードを順番に動かすときに使う */
  delay?: number;
  decimals?: number;
  separator?: string;
  /** false にすると画面外に出たら0に戻し、再度入ったときにもう一度再生する */
  triggerOnce?: boolean;
  /** 外側（フェード・浮き上がりする要素）のクラス */
  className?: string;
  /** 数字部分のクラス（グラデーション文字などを数字にだけ当てたいとき） */
  numberClassName?: string;
};

export function formatCount(n: number, decimals = 0, separator = ","): string {
  const fixed = n.toFixed(decimals);
  const [int, frac] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return frac ? `${grouped}.${frac}` : grouped;
}

/* ── 共有 IntersectionObserver ─────────────────────────── */
type Handler = (visible: boolean) => void;
const handlers = new WeakMap<Element, Handler>();
let sharedObserver: IntersectionObserver | null = null;

function observe(el: Element, handler: Handler) {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) handlers.get(entry.target)?.(entry.isIntersecting);
      },
      // 画面下端から少し入ったところで発火させ、見え始めた瞬間に動き出すようにする
      { rootMargin: "0px 0px -8% 0px", threshold: 0.2 },
    );
  }
  handlers.set(el, handler);
  sharedObserver.observe(el);
  return () => {
    handlers.delete(el);
    sharedObserver?.unobserve(el);
  };
}

// 終盤でゆっくり止まる（バウンドなし）
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function CountUpNumber({
  value,
  suffix,
  prefix,
  duration = 1200,
  delay = 0,
  decimals = 0,
  separator = ",",
  triggerOnce = true,
  className,
  numberClassName,
}: Props) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);
  const finalText = formatCount(value, decimals, separator);

  useEffect(() => {
    const root = rootRef.current;
    const live = liveRef.current;
    if (!root || !live) return;

    const render = (n: number) => {
      live.textContent = formatCount(n, decimals, separator);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      render(value);
      root.dataset.state = "done";
      return;
    }

    let raf = 0;
    let timer = 0;
    let played = false;

    const reset = () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      render(0);
      root.dataset.state = "idle";
      played = false;
    };

    const play = () => {
      played = true;
      timer = window.setTimeout(() => {
        root.dataset.state = "run";
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          render(value * easeOutCubic(t));
          if (t < 1) raf = requestAnimationFrame(tick);
          else {
            render(value);
            root.dataset.state = "done";
          }
        };
        raf = requestAnimationFrame(tick);
      }, delay);
    };

    reset();
    const stop = observe(root, (visible) => {
      if (visible && !played) {
        play();
        if (triggerOnce) stop();
      } else if (!visible && !triggerOnce && played) {
        reset();
      }
    });

    return () => {
      stop();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [value, duration, delay, decimals, separator, triggerOnce]);

  return (
    <span ref={rootRef} className={`sr-count${className ? ` ${className}` : ""}`} data-state="ssr">
      {prefix}
      {/* 読み上げは最終値だけにする（カウント途中の数字は読ませない） */}
      <span className="sr-visually-hidden">{finalText}</span>
      <span className={`sr-count__num${numberClassName ? ` ${numberClassName}` : ""}`} aria-hidden="true">
        <span className="sr-count__ghost">{finalText}</span>
        <span className="sr-count__live" ref={liveRef}>
          {finalText}
        </span>
      </span>
      {suffix}
    </span>
  );
}
