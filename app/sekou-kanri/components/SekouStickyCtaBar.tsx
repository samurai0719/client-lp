"use client";

import { useEffect, useState } from "react";
import { CTA_HREF } from "../constants";

export default function SekouStickyCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const trigger = document.getElementById("hero-cta");
    if (!trigger) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(trigger);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 sm:hidden"
      style={{
        /*
         * Two-layer bar shadow:
         *   1. Soft wide shadow for "floating" feel
         *   2. Tighter shadow under the bar for depth
         */
        background: "white",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        boxShadow:
          "0 -8px 32px rgba(0,0,0,0.07), 0 -2px 8px rgba(0,0,0,0.05)",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <a
        href={CTA_HREF}
        rel="nofollow"
        className="relative z-30 pointer-events-auto flex flex-col items-center justify-center gap-0 w-full
                   min-h-[52px] rounded-[14px] overflow-hidden
                   cursor-pointer touch-manipulation
                   active:scale-[0.97]"
        style={{
          /*
           * Three-layer button design:
           *   1. Orange gradient (top-light to darker bottom) for depth
           *   2. Inset top highlight line for a "lit from above" feel
           *   3. Two-stage outer shadow (soft wide + tight near)
           */
          background:
            "linear-gradient(170deg, #fb923c 0%, #f97316 40%, #ea580c 100%)",
          boxShadow:
            "0 6px 24px rgba(249,115,22,0.35), 0 2px 6px rgba(249,115,22,0.25), inset 0 1px 0 rgba(255,255,255,0.18)",
          border: "1px solid rgba(234,88,12,0.6)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.boxShadow =
            "0 2px 8px rgba(249,115,22,0.25), 0 1px 3px rgba(249,115,22,0.2), inset 0 1px 0 rgba(255,255,255,0.1)";
        }}
        onPointerUp={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.boxShadow =
            "0 6px 24px rgba(249,115,22,0.35), 0 2px 6px rgba(249,115,22,0.25), inset 0 1px 0 rgba(255,255,255,0.18)";
        }}
        onPointerLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.boxShadow =
            "0 6px 24px rgba(249,115,22,0.35), 0 2px 6px rgba(249,115,22,0.25), inset 0 1px 0 rgba(255,255,255,0.18)";
        }}
      >
        {/* Top highlight strip — "lit from above" */}
        <span
          aria-hidden
          className="absolute inset-x-2 top-px h-px rounded-full opacity-40 pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, white 30%, white 70%, transparent)" }}
        />

        <span
          className="text-[10px] font-semibold tracking-[0.2em]"
          style={{
            color: "rgba(255,237,213,0.9)",
            textShadow: "0 1px 2px rgba(180,50,0,0.3)",
          }}
        >
          公式サイト
        </span>
        <span
          className="text-base font-extrabold leading-tight"
          style={{
            color: "#fff",
            textShadow: "0 1px 3px rgba(180,50,0,0.25)",
          }}
        >
          非公開求人を見てみる
        </span>
      </a>
    </div>
  );
}
