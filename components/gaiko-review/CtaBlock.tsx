"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ctaContent, analyticsEvents } from "@/data/gaiko-review/content";
import { trackEvent } from "@/lib/analytics/track";
import { withEmphasis } from "./emphasis";

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
      className="relative rounded-[28px] p-[1.5px] shadow-[0_10px_30px_-14px_rgba(46,41,35,0.35)]"
      style={{ background: "linear-gradient(135deg, #B7812D 0%, #E4CB94 45%, #566342 100%)" }}
      data-gr-cta-block={placement}
    >
      <div
        className="relative overflow-hidden rounded-[27px] px-6 py-9 sm:px-10 sm:py-11 text-center"
        style={{ background: "linear-gradient(165deg, #FFFDF9 0%, #FBF1DD 100%)" }}
      >
        {/* 装飾ドット（控えめ） */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.12]"
          style={{ background: "#B7812D" }}
        />

        <span
          className="relative inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
          style={{ backgroundColor: "#566342" }}
          aria-hidden
        >
          <Sparkles size={20} color="#FFFDF9" />
        </span>

        <p
          className={`relative gr-font-serif mb-6 leading-relaxed text-balance font-bold ${
            large ? "text-[1.3rem] sm:text-[1.55rem]" : "text-[1.1rem] sm:text-[1.3rem]"
          }`}
          style={{ color: "#2E2923" }}
        >
          {withEmphasis(ctaContent.heading)}
        </p>

        <Link
          href={ctaContent.href}
          onClick={handleClick}
          data-gtm-event={analyticsEvents.articleCtaClick}
          data-gr-cta-placement={placement}
          className="group relative inline-flex min-h-[54px] w-full sm:w-auto items-center justify-center gap-2 rounded-full px-9 py-4 text-base font-bold text-white shadow-[0_8px_20px_-6px_rgba(183,129,45,0.55)] transition-all duration-200 hover:shadow-[0_10px_26px_-6px_rgba(183,129,45,0.65)] hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          style={{ background: "linear-gradient(135deg, #C79640 0%, #B7812D 55%, #96681F 100%)" }}
        >
          {ctaContent.buttonLabel}
          <ArrowRight size={18} aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>

        <p className="relative mt-4 text-xs sm:text-sm" style={{ color: "#879174" }}>
          {ctaContent.subText}
        </p>
      </div>
    </div>
  );
}
