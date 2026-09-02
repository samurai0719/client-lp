"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { RESULTS, RESULTS_NOTE, type ResultItem } from "./config";
import { prefersReducedMotion, stagger, useInView } from "./motion";
import { SectionHeading } from "./ui";

/**
 * 集客実績。
 * 事例は config.ts の RESULTS で管理する。件数に応じて列数が変わり、
 * 数値（value）を入れた場合だけ、画面内に入った時点でカウントアップが走る。
 */
export default function ResultsSection() {
  return (
    <section className="adf-section adf-sec-paper2" aria-labelledby="adf-results-h">
      <div className="adf-container">
        <SectionHeading
          eyebrow="Track record"
          title="集客実績"
          id="adf-results-h"
          center
          lead="外構工事をはじめとしたWeb集客で積み上げてきた実績です。"
        />

        <div className="adf-results__grid" data-count={RESULTS.length}>
          {RESULTS.map((item, i) => (
            <ResultCard key={item.image ?? i} item={item} index={i} />
          ))}
        </div>

        <p className="adf-results__note">※ {RESULTS_NOTE}</p>
      </div>
    </section>
  );
}

function ResultCard({ item, index }: { item: ResultItem; index: number }) {
  const ref = useInView<HTMLDivElement>({ threshold: 0.15 });
  const hasNumber = typeof item.value === "number";
  const hasBody = hasNumber || Boolean(item.label) || Boolean(item.caption);

  // 画像の実寸から比率を作り、読み込み前に高さを確保する（CLS防止）
  const mediaStyle: CSSProperties | undefined =
    item.w && item.h ? { aspectRatio: `${item.w} / ${item.h}` } : undefined;

  return (
    <div
      ref={ref}
      className="adf-result adf-reveal adf-reveal--up"
      style={stagger(index)}
    >
      {item.image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          className="adf-result__media"
          style={mediaStyle}
          src={item.image}
          alt={item.alt ?? item.label ?? "集客実績"}
          width={item.w}
          height={item.h}
          loading="lazy"
          decoding="async"
        />
      ) : (
        /* 画像未設定：比率で高さを確保した白紙エリア */
        <div className="adf-result__media" style={mediaStyle} />
      )}

      {hasBody ? (
        <div className="adf-result__body">
          {hasNumber ? (
            <p className="adf-result__num">
              <CountUp target={item.value as number} />
              {item.unit ? <small>{item.unit}</small> : null}
            </p>
          ) : null}
          {item.label ? <p className="adf-result__label is-strong">{item.label}</p> : null}
          {item.caption ? <p className="adf-result__label">{item.caption}</p> : null}

          {/* 伸びるグラフ線は、数値を掲載している事例にだけ添える */}
          {hasNumber ? (
            <svg
              className="adf-result__chart"
              viewBox="0 0 200 44"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 40 L48 30 L92 32 L134 16 L198 4"
                stroke="#f26a1b"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ "--len": 210 } as CSSProperties}
              />
            </svg>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * 画面内に入ったときだけ開始する数字のカウントアップ。
 * 値の更新は textContent への直接書き込みで行うため、1フレームごとの再レンダリングが起きない。
 * SSR時・JS無効時は最終的な数値がそのまま表示される。
 */
function CountUp({ target, duration = 1500 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return; // 最終値のまま動かさない

    const format = (n: number) => n.toLocaleString("ja-JP");
    el.textContent = format(0);

    let raf = 0;
    let started = false;

    const io = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((e) => e.isIntersecting)) return;
        started = true;
        io.unobserve(el);

        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
          el.textContent = format(Math.round(eased * target));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      el.textContent = format(target);
    };
  }, [target, duration]);

  return <span ref={ref}>{target.toLocaleString("ja-JP")}</span>;
}
