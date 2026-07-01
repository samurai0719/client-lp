"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ctaContent, analyticsEvents } from "@/data/gaiko-review/content";
import { trackEvent } from "@/lib/analytics/track";

export default function CtaBlock({
  placement,
  large = false,
}: {
  /** クリック計測用: どの位置のCTAかを識別する */
  placement: "after-comparison" | "after-chosen-reason" | "final";
  large?: boolean;
}) {
  const handleClick = () => {
    trackEvent(analyticsEvents.articleCtaClick, { placement });
  };

  return (
    <div
      className="rounded-2xl border px-5 py-8 sm:px-8 sm:py-10 text-center"
      style={{ backgroundColor: "#FFFDF9", borderColor: "#DDD3C2" }}
      data-gr-cta-block={placement}
    >
      <p
        className={`gr-font-serif mb-5 leading-relaxed text-balance ${
          large ? "text-[1.3rem] sm:text-[1.55rem]" : "text-[1.1rem] sm:text-[1.3rem]"
        }`}
        style={{ color: "#2E2923" }}
      >
        {ctaContent.heading}
      </p>

      <Link
        href={ctaContent.href}
        onClick={handleClick}
        data-gtm-event={analyticsEvents.articleCtaClick}
        data-gr-cta-placement={placement}
        className="inline-flex min-h-[52px] w-full sm:w-auto items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#B7812D" }}
      >
        {ctaContent.buttonLabel}
        <ArrowRight size={18} aria-hidden />
      </Link>

      <p className="mt-3 text-xs sm:text-sm" style={{ color: "#879174" }}>
        {ctaContent.subText}
      </p>
    </div>
  );
}
