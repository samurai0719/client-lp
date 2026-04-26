"use client";

import Image from "next/image";
import { CTA_HREF, IMAGES } from "../constants";

const CONDITIONS = [
  "年間休日120日以上",
  "残業ほぼなし",
  "出張なし",
  "年収800万円以上も可能性あり",
];

const CTA_REST =
  "0 8px 36px rgba(249,115,22,0.45), 0 3px 10px rgba(249,115,22,0.30), 0 1px 3px rgba(160,50,0,0.18), inset 0 1px 0 rgba(255,255,255,0.24)";
const CTA_PRESSED =
  "0 2px 8px rgba(249,115,22,0.28), 0 1px 3px rgba(249,115,22,0.18), inset 0 1px 0 rgba(255,255,255,0.10)";

export default function HeroSection() {
  return (
    /*
     * Mobile : NO explicit height → section height = content height.
     *   The background image (absolute inset-0) stretches to the same height
     *   as the content, so there is ZERO empty space below the last element.
     * Desktop: md:h-[100svh] fills the viewport; content is vertically centred.
     * overflow-hidden clips the background image in both cases.
     */
    <section
      className="relative overflow-hidden md:h-[100svh]"
      aria-label="ファーストビュー"
    >
      {/* ── Background images ─────────────────────────────────── */}
      <div className="absolute inset-0 z-0">

        {/*
         * Mobile: objectPosition "center 70%" shows the lower-middle of the
         * image (person body visible, not just feet or just face).
         */}
        <Image
          src={IMAGES.heroBgMobile}
          alt=""
          fill
          priority
          sizes="100vw"
          className="md:hidden"
          style={{ objectFit: "cover", objectPosition: "center bottom" }}
        />

        {/* Desktop: person shifted right */}
        <Image
          src={IMAGES.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden md:block"
          style={{ objectFit: "cover", objectPosition: "82% center" }}
        />

        {/* Mobile overlay: diagonal white → transparent */}
        <div
          aria-hidden
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(158deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 34%, rgba(255,255,255,0.46) 64%, rgba(255,255,255,0.07) 100%)",
          }}
        />

        {/* Desktop overlay: left → right white fade */}
        <div
          aria-hidden
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.93) 22%, rgba(255,255,255,0.68) 40%, rgba(255,255,255,0.10) 56%, rgba(255,255,255,0.00) 68%)",
          }}
        />
      </div>

      {/* Orange top accent stripe */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[3px] z-30
                   bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500"
      />

      {/* ── Content ───────────────────────────────────────────── */}
      {/*
       * Mobile : no h-full → auto height, determines the section height.
       *   pt-8 / pb-6 give breathing room top and bottom.
       * Desktop: md:h-full fills the 100svh section; md:justify-center centres.
       */}
      <div
        className="hero-enter relative z-10 md:h-full
                   flex flex-col justify-start md:justify-center
                   px-5 pt-8 pb-6 md:pt-0 md:pb-0 md:pl-14 lg:pl-20"
      >
        <div className="max-w-[340px] md:max-w-[500px] lg:max-w-[540px] md:w-[50%] lg:w-[46%]">

          {/* Service name + PR */}
          {/* text-[11px]: up from 10px for readability */}
          <div className="flex items-center gap-2.5 mb-3.5 md:mb-5">
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className="text-slate-600 text-[11px] font-bold tracking-[0.18em] uppercase">
                建設・設備求人データベース
              </span>
            </span>
            <span
              className="text-[10px] font-bold text-amber-700 rounded px-1.5 py-0.5 tracking-[0.1em]"
              style={{
                border: "1px solid rgba(217,119,6,0.45)",
                background: "rgba(255,251,235,0.92)",
              }}
            >
              PR
            </span>
          </div>

          {/* h1 */}
          {/*
           * Font size: slightly larger clamp values for stronger visual impact.
           * lineHeight: 1.14 (up from 1.06) — a touch more breathing between lines.
           */}
          <h1 className="font-black mb-4 md:mb-5">
            <span
              className="block text-orange-500 whitespace-nowrap"
              style={{
                fontSize: "clamp(1.9rem, 7vw, 3.2rem)",
                lineHeight: 1.14,
                letterSpacing: "-0.02em",
              }}
            >
              年収800万円以下の
            </span>
            <span
              className="sparkle-text block"
              style={{
                fontSize: "clamp(1.45rem, 5.2vw, 2.4rem)",
                lineHeight: 1.14,
                letterSpacing: "-0.015em",
              }}
            >
              施工管理の方へ
            </span>
          </h1>

          {/* Sub copy */}
          {/*
           * fontSize: 0.925rem → slightly larger than 0.875rem.
           * lineHeight: 1.92 (up from 1.82) — more relaxed reading rhythm.
           */}
          <p
            className="text-slate-600 mb-3.5 md:mb-5"
            style={{
              fontSize: "clamp(0.925rem, 2.4vw, 1.05rem)",
              lineHeight: 1.92,
            }}
          >
            今の会社だけで判断せず、
            <br className="sm:hidden" />
            非公開求人まで確認してから決めませんか？
          </p>

          {/* Condition chips */}
          {/* text sizes up 1px: label 10→11, chips 11→12 */}
          <div className="mb-4 md:mb-5">
            <p className="text-[11px] text-slate-500 font-semibold mb-2 tracking-wide">
              非公開求人で確認できる条件例
            </p>
            <div className="flex flex-wrap gap-[7px]">
              {CONDITIONS.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-full
                             px-2.5 py-[5px] text-[12px] text-slate-700 font-medium"
                  style={{
                    background: "rgba(255,255,255,0.92)",
                    border: "1px solid rgba(200,210,222,0.88)",
                    boxShadow: "0 1px 5px rgba(0,0,0,0.07)",
                  }}
                >
                  <span aria-hidden className="w-[5px] h-[5px] rounded-full bg-orange-400 shrink-0" />
                  {c}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 leading-snug">
              ※ 求人により条件は異なります
            </p>
          </div>

          {/* CTA */}
          {/* upper text: 11→12px, lower: 1rem→1.05rem */}
          <div id="hero-cta" className="flex flex-col gap-1.5 max-w-[288px] md:max-w-[300px]">
            <a
              href={CTA_HREF}
              className="relative overflow-hidden flex flex-col items-center justify-center
                         w-full min-h-[54px] md:min-h-[56px] rounded-2xl
                         cursor-pointer touch-manipulation active:scale-[0.96]"
              style={{
                padding: "13px 28px",
                background:
                  "linear-gradient(174deg, #ff9a47 0%, #f97316 44%, #e55d0a 100%)",
                boxShadow: CTA_REST,
                border: "1px solid rgba(210,72,0,0.42)",
                transition: "transform 0.14s ease, box-shadow 0.14s ease",
              }}
              onPointerDown={(e) => {
                e.currentTarget.style.boxShadow = CTA_PRESSED;
              }}
              onPointerUp={(e) => {
                e.currentTarget.style.boxShadow = CTA_REST;
              }}
              onPointerLeave={(e) => {
                e.currentTarget.style.boxShadow = CTA_REST;
              }}
            >
              <span
                aria-hidden
                className="absolute inset-x-4 top-[1px] h-[1px] rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,rgba(255,255,255,0.75) 30%,rgba(255,255,255,0.75) 70%,transparent)",
                }}
              />
              <span
                className="block text-[12px] font-semibold tracking-[0.2em] mb-0.5"
                style={{ color: "rgba(255,237,213,0.90)" }}
              >
                公式サイト
              </span>
              <span
                className="block text-[1.05rem] font-extrabold leading-tight tracking-wide"
                style={{ color: "#fff", textShadow: "0 1px 4px rgba(130,35,0,0.28)" }}
              >
                非公開求人を見てみる
              </span>
            </a>
            {/* free note: 10→11px */}
            <p className="text-slate-500 text-[11px] text-center leading-relaxed">
              ※ 求職者は完全無料でご利用いただけます
            </p>
          </div>

        </div>
      </div>

      {/* Scroll hint — desktop only */}
      <div
        aria-hidden
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20
                   hidden md:flex flex-col items-center gap-1.5
                   text-slate-500 text-[10px] tracking-[0.2em] uppercase"
      >
        <span>Scroll</span>
        <svg
          className="w-4 h-4 animate-bounce"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
