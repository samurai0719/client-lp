"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ctaContent, analyticsEvents } from "@/data/gaiko-review/content";
import { trackEvent } from "@/lib/analytics/track";

// モバイル画面下部の固定CTA。フッターに重ならないよう、フッターが画面に入ったら非表示にする。
export default function StickyMobileCta() {
  const [hidden, setHidden] = useState(true);
  const [suppressed, setSuppressed] = useState(false);

  useEffect(() => {
    const heroEl = document.querySelector("[aria-label='ファーストビュー']");
    const footerEl = document.querySelector("footer");
    if (!heroEl) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0 }
    );
    heroObserver.observe(heroEl);

    let footerObserver: IntersectionObserver | undefined;
    if (footerEl) {
      footerObserver = new IntersectionObserver(
        ([entry]) => setSuppressed(entry.isIntersecting),
        { threshold: 0 }
      );
      footerObserver.observe(footerEl);
    }

    return () => {
      heroObserver.disconnect();
      footerObserver?.disconnect();
    };
  }, []);

  const handleClick = () => {
    trackEvent(analyticsEvents.stickyCtaClick);
  };

  return (
    <div
      className={`lg:hidden fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2.5 transition-transform duration-300 ${
        hidden || suppressed ? "translate-y-full" : "translate-y-0"
      }`}
      style={{ backgroundColor: "rgba(255,253,249,0.96)", borderTop: "1px solid #DDD3C2", backdropFilter: "blur(6px)" }}
    >
      <Link
        href={ctaContent.href}
        onClick={handleClick}
        data-gtm-event={analyticsEvents.stickyCtaClick}
        className="flex min-h-[48px] w-full items-center justify-center rounded-full text-[15px] font-bold text-white"
        style={{ backgroundColor: "#B7812D" }}
      >
        {ctaContent.stickyLabel}
      </Link>
    </div>
  );
}
