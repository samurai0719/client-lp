"use client";

import { useEffect, useRef } from "react";

/**
 * ダッシュボード用の軽いカウントアップ（1回だけ）。
 * 再レンダーを起こさないよう、数値は textContent を直接書き換える。reduced-motion 時は最終値のまま。
 */
export default function CountUp({ value, duration = 900 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || value === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      el.textContent = Math.round(value * (1 - Math.pow(1 - t, 3))).toLocaleString("ja-JP");
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("ja-JP")}
    </span>
  );
}
