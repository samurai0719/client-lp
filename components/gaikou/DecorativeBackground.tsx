"use client";

import { useEffect, useRef } from "react";

// 背景装飾：ぼかしブロブ・等高線・ドット格子・ノイズ・マウス追従の光（PC限定）
// position:fixed のレイヤーとして1度だけマウントし、本文の後ろに敷く。
export default function DecorativeBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    if (prefersReduced || !isDesktop) return;

    let frame = 0;
    function handleMove(e: MouseEvent) {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.setProperty("--gaikou-mx", `${e.clientX}px`);
          glowRef.current.style.setProperty("--gaikou-my", `${e.clientY}px`);
        }
        frame = 0;
      });
    }
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="gaikou-bg-layer" aria-hidden="true">
      <div ref={glowRef} className="gaikou-mouse-glow" />

      <span className="gaikou-blob gaikou-blob-1" />
      <span className="gaikou-blob gaikou-blob-2" />
      <span className="gaikou-blob gaikou-blob-3" />

      <svg className="gaikou-pattern gaikou-pattern-dots" width="100%" height="100%" aria-hidden="true">
        <defs>
          <pattern id="gaikou-dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="#1f4d3d" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gaikou-dot-grid)" />
      </svg>

      <svg
        className="gaikou-pattern gaikou-pattern-contour"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M-50 620 C 150 560, 300 680, 500 600 S 850 520, 1250 600"
          fill="none"
          stroke="#1f4d3d"
          strokeWidth="2"
        />
        <path
          d="M-50 680 C 180 630, 330 730, 540 660 S 880 590, 1250 660"
          fill="none"
          stroke="#1f4d3d"
          strokeWidth="2"
        />
        <path
          d="M-50 740 C 200 700, 360 780, 580 720 S 900 660, 1250 720"
          fill="none"
          stroke="#1f4d3d"
          strokeWidth="2"
        />
      </svg>

      <div className="gaikou-noise" />
    </div>
  );
}
