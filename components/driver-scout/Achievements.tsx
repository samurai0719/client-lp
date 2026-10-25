"use client";

import { useEffect, useRef, useState } from "react";
import { Crown } from "lucide-react";
import { ACHIEVEMENTS, ACHIEVEMENTS_NOTE } from "./content";

/**
 * 運営者の実績（FV直下）。画面に入ったらカードがせり上がり、数字が0から数え上がる。
 * サーバーでは最終の数字のまま描画する（JSが動かない環境・検索エンジンでも正しい数字が読める）。
 * 「動きを減らす」設定の端末ではアニメーションしない。
 */
const DURATION = 1600;

export function Achievements() {
  const ref = useRef<HTMLElement>(null);
  /** null = アニメーションしない（最終値のまま）。数値 = 進み具合 0〜1 */
  const [progress, setProgress] = useState<number | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    setProgress(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setShown(true);
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          setProgress(1 - Math.pow(1 - t, 3)); // 最後にゆっくり止まる
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const animating = progress !== null;

  return (
    <section
      ref={ref}
      className={`ds-achv${animating ? " is-anim" : ""}${shown ? " is-shown" : ""}`}
      aria-labelledby="ds-achv-title"
    >
      <div className="dt-container">
        <h2 className="ds-achv__title" id="ds-achv-title">
          運営者の実績
        </h2>
        <ul className="ds-achv__list">
          {ACHIEVEMENTS.map((a, i) => (
            <li key={a.label} className="ds-achv__item" style={{ transitionDelay: `${i * 140}ms` }}>
              <Crown className="ds-achv__crown" aria-hidden="true" fill="currentColor" strokeWidth={1.5} />
              <span className="ds-achv__label">{a.label}</span>
              <span className="ds-achv__value">
                {/* 読み上げは最終の数字だけにする（数え上げ途中の数字を読ませない） */}
                <span className="dt-visually-hidden">
                  {a.value.toLocaleString("ja-JP")}
                  {a.unit}
                </span>
                <span aria-hidden="true">
                  <b>{Math.round(a.value * (progress ?? 1)).toLocaleString("ja-JP")}</b>
                  {a.unit}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="ds-achv__note">※{ACHIEVEMENTS_NOTE}</p>
      </div>
    </section>
  );
}
