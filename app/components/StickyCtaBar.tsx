"use client";

import { useEffect, useState } from "react";

export default function StickyCtaBar() {
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
      className={`fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-white/95 backdrop-blur-sm border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transition-transform duration-300 sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href="#contact"
        className="cta-glow flex items-center justify-center gap-2 w-full bg-orange-500 active:bg-orange-600 active:scale-[0.98] text-white font-bold rounded-xl py-3.5 text-base transition-all duration-150 cursor-pointer"
      >
        無料で相談してみる
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
    </div>
  );
}
