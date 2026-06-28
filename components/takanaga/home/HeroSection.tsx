"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Camera, ChevronDown } from "lucide-react";
import { siteConfig } from "@/data/takanaga/siteConfig";

/* ─── インラインCSS（コンポーネント専用） ─────────────────────────── */
const heroStyles = `
  @keyframes tkn-hero-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes tkn-hero-pulse-ring {
    0%   { transform: scale(0.8); opacity: 0.6; }
    100% { transform: scale(1.8); opacity: 0; }
  }
  @keyframes tkn-hero-shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes tkn-hero-slide-up {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes tkn-hero-slide-right {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes tkn-hero-scale-in {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes tkn-hero-particle {
    0%   { transform: translateY(0) scale(1); opacity: 0.7; }
    100% { transform: translateY(-120px) scale(0); opacity: 0; }
  }
  @keyframes tkn-stripe-slide {
    from { transform: translateX(-60px); }
    to   { transform: translateX(0); }
  }
  @keyframes tkn-badge-pop {
    0%   { opacity: 0; transform: scale(0.7) translateY(12px); }
    70%  { transform: scale(1.06) translateY(-2px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes tkn-card-enter {
    from { opacity: 0; transform: translateY(28px) scale(0.94); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes tkn-scroll-hint {
    0%, 100% { transform: translateY(0); opacity: 0.5; }
    50%       { transform: translateY(6px); opacity: 1; }
  }

  .tkn-hero-tag {
    animation: tkn-hero-slide-right 0.7s cubic-bezier(.22,.68,0,1.2) 0.1s both;
  }
  .tkn-hero-h1 {
    animation: tkn-hero-slide-up 0.75s cubic-bezier(.22,.68,0,1.1) 0.3s both;
  }
  .tkn-hero-sub {
    animation: tkn-hero-slide-up 0.7s ease-out 0.52s both;
  }
  .tkn-hero-cta {
    animation: tkn-hero-slide-up 0.7s ease-out 0.68s both;
  }
  .tkn-hero-sim {
    animation: tkn-hero-slide-up 0.6s ease-out 0.82s both;
  }
  .tkn-hero-badge-0 { animation: tkn-badge-pop 0.6s cubic-bezier(.22,.68,0,1.3) 0.9s both; }
  .tkn-hero-badge-1 { animation: tkn-badge-pop 0.6s cubic-bezier(.22,.68,0,1.3) 1.0s both; }
  .tkn-hero-badge-2 { animation: tkn-badge-pop 0.6s cubic-bezier(.22,.68,0,1.3) 1.1s both; }

  .tkn-hero-card-0 { animation: tkn-card-enter 0.8s cubic-bezier(.22,.68,0,1.1) 0.5s both; }
  .tkn-hero-card-1 { animation: tkn-card-enter 0.8s cubic-bezier(.22,.68,0,1.1) 0.7s both; }
  .tkn-hero-card-2 { animation: tkn-card-enter 0.8s cubic-bezier(.22,.68,0,1.1) 0.9s both; }

  .tkn-hero-float  { animation: tkn-hero-float 5s ease-in-out 1.2s infinite; }
  .tkn-scroll-hint { animation: tkn-scroll-hint 1.8s ease-in-out infinite; }

  .tkn-card-shine {
    position: relative;
    overflow: hidden;
  }
  .tkn-card-shine::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%);
    background-size: 400px 100%;
    animation: tkn-hero-shimmer 3.5s ease-in-out 1.5s infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .tkn-hero-tag, .tkn-hero-h1, .tkn-hero-sub, .tkn-hero-cta,
    .tkn-hero-sim, .tkn-hero-badge-0, .tkn-hero-badge-1, .tkn-hero-badge-2,
    .tkn-hero-card-0, .tkn-hero-card-1, .tkn-hero-card-2,
    .tkn-hero-float, .tkn-scroll-hint, .tkn-card-shine::after {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
`;

const BADGES = ["現地調査 無料", "お見積もり 無料", "3県対応"];

const CARDS = [
  { src: "/images/gaikou/works/case1-after.png", label: "コンクリート駐車場", cls: "tkn-hero-card-0", pos: "top-0 right-0 w-[66%]" },
  { src: "/images/gaikou/works/case3-after.png", label: "カーポート",           cls: "tkn-hero-card-1", pos: "top-[37%] left-0 w-[46%]" },
  { src: "/images/gaikou/works/case5-after.png", label: "フェンス・外構",       cls: "tkn-hero-card-2", pos: "bottom-0 right-[4%] w-[42%]" },
];

export default function HeroSection() {
  const particleRef = useRef<SVGGElement>(null);

  /* パーティクルをランダム配置 */
  useEffect(() => {
    const g = particleRef.current;
    if (!g) return;
    const circles: SVGCircleElement[] = [];
    for (let i = 0; i < 18; i++) {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      const x = Math.random() * 100;
      const y = 20 + Math.random() * 70;
      const r = 1 + Math.random() * 2;
      const delay = Math.random() * 6;
      const dur = 4 + Math.random() * 5;
      c.setAttribute("cx", `${x}%`);
      c.setAttribute("cy", `${y}%`);
      c.setAttribute("r", String(r));
      c.setAttribute("fill", "rgba(96,165,250,0.5)");
      c.style.animation = `tkn-hero-particle ${dur}s ease-out ${delay}s infinite`;
      g.appendChild(c);
      circles.push(c);
    }
    return () => circles.forEach((c) => c.remove());
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heroStyles }} />

      <section
        className="relative overflow-hidden"
        style={{ background: "#0d1117", minHeight: "100svh" }}
        aria-label="ファーストビュー"
      >
        {/* ── 職人写真（低透明度テクスチャ） ── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <Image
            src="/images/gaikou/direct-model.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            style={{ opacity: 0.15, mixBlendMode: "luminosity" }}
          />
          {/* 左右グラデーションマスク */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(13,17,23,0.97) 0%, rgba(13,17,23,0.75) 45%, rgba(13,17,23,0.45) 100%)",
            }}
          />
          {/* 下部フェードアウト */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32"
            style={{ background: "linear-gradient(to top, #0d1117 0%, transparent 100%)" }}
          />
        </div>

        {/* ── インラインSVG 背景デコレーション ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* ドットグリッド */}
            <pattern id="hero-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="0.8" fill="rgba(96,165,250,0.08)" />
            </pattern>
            {/* 斜めストライプ */}
            <pattern id="hero-stripe" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
              <line x1="0" y1="0" x2="0" y2="60" stroke="rgba(255,255,255,0.018)" strokeWidth="18" />
            </pattern>
            {/* グロー */}
            <radialGradient id="hero-glow-l" cx="0%" cy="50%" r="60%">
              <stop offset="0%" stopColor="rgba(29,95,166,0.28)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="hero-glow-r" cx="100%" cy="45%" r="55%">
              <stop offset="0%" stopColor="rgba(45,125,210,0.18)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            {/* カードのハイライト用クリップ */}
            <clipPath id="hero-clip-r">
              <rect x="50%" y="0" width="50%" height="100%" />
            </clipPath>
          </defs>

          {/* ドット・ストライプ */}
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
          <rect width="100%" height="100%" fill="url(#hero-stripe)" />

          {/* グロー */}
          <rect width="100%" height="100%" fill="url(#hero-glow-l)" />
          <rect width="100%" height="100%" fill="url(#hero-glow-r)" />

          {/* 大きな装飾円弧（右側） */}
          <g stroke="rgba(96,165,250,0.06)" strokeWidth="1" fill="none">
            <circle cx="78%" cy="48%" r="200" />
            <circle cx="78%" cy="48%" r="320" />
            <circle cx="78%" cy="48%" r="460" />
          </g>

          {/* 斜め装飾ライン */}
          <line x1="0" y1="75%" x2="48%" y2="0" stroke="rgba(96,165,250,0.05)" strokeWidth="1" />
          <line x1="5%" y1="100%" x2="55%" y2="0" stroke="rgba(96,165,250,0.04)" strokeWidth="1" />

          {/* 左下のコーナー装飾 */}
          <g stroke="rgba(45,125,210,0.2)" strokeWidth="1.5" fill="none">
            <path d="M 0 85% L 60 85% L 60 100%" />
          </g>

          {/* 右上のコーナー装飾 */}
          <g stroke="rgba(45,125,210,0.2)" strokeWidth="1.5" fill="none">
            <path d="M 100% 0 L calc(100% - 60px) 0 L calc(100% - 60px) 60" />
          </g>

          {/* フローティングパーティクル */}
          <g ref={particleRef} />
        </svg>

        {/* ── メインコンテンツ ── */}
        <div
          className="relative flex flex-col"
          style={{ minHeight: "100svh" }}
        >
          {/* コンテンツグリッド */}
          <div className="flex-1 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 pt-20 pb-6 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">

            {/* 左：テキスト */}
            <div>
              {/* エリアタグ */}
              <div className="tkn-hero-tag inline-flex items-center gap-2 mb-6">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold tracking-widest uppercase"
                  style={{
                    background: "rgba(45,125,210,0.15)",
                    border: "1px solid rgba(96,165,250,0.3)",
                    color: "#93c5fd",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <circle cx="5" cy="5" r="4" stroke="#93c5fd" strokeWidth="1.5"/>
                    <circle cx="5" cy="5" r="1.5" fill="#93c5fd"/>
                  </svg>
                  岐阜・愛知・三重 対応
                </span>
                {/* パルスリング */}
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span
                    className="absolute inline-flex h-full w-full rounded-full"
                    style={{
                      background: "#2d7dd2",
                      animation: "tkn-hero-pulse-ring 1.8s ease-out infinite",
                    }}
                  />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#60a5fa" }} />
                </span>
              </div>

              {/* メインキャッチ */}
              <h1
                className="tkn-hero-h1 font-black text-white tracking-tight leading-[1.15] mb-5"
                style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
              >
                住まいの外まわりを、
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10">もっと快適に。</span>
                  {/* アンダーライン SVG */}
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    height="6"
                    viewBox="0 0 200 6"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      d="M0 4 Q50 0 100 3 Q150 6 200 2"
                      stroke="url(#underline-grad)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="underline-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#2d7dd2" />
                        <stop offset="100%" stopColor="#d9601a" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              {/* サブコピー */}
              <p
                className="tkn-hero-sub leading-relaxed mb-7"
                style={{
                  color: "rgba(255,255,255,0.68)",
                  fontSize: "clamp(0.875rem, 2.5vw, 1.05rem)",
                  maxWidth: "30rem",
                }}
              >
                駐車場・カーポート・フェンス・お庭など、<br className="hidden sm:block" />
                外構リフォームの専門会社として東海エリアで対応。<br className="hidden sm:block" />
                現地調査・お見積もりは無料です。
              </p>

              {/* CTA（デスクトップ） */}
              <div className="tkn-hero-cta hidden lg:flex flex-col sm:flex-row gap-3 mb-6">
                <Link href="/takanaga/contact" className="tkn-btn-primary !text-base !py-4 !px-8">
                  無料で現地調査を相談する
                  <ArrowRight size={18} aria-hidden />
                </Link>
                <Link
                  href="/takanaga/works"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold rounded-full transition-all"
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  }}
                >
                  施工事例を見る
                </Link>
              </div>

              <div className="tkn-hero-sim hidden lg:block mb-8">
                <Link
                  href={siteConfig.externalLinks.simulatorUrl}
                  className="inline-flex items-center gap-2 text-sm transition-colors"
                  style={{ color: "rgba(255,255,255,0.42)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.42)"; }}
                >
                  <Camera size={13} aria-hidden />
                  <span className="underline underline-offset-4">AIシミュレーションで完成イメージを確認する</span>
                </Link>
              </div>

              {/* バッジ群 */}
              <div className="hidden lg:flex flex-wrap gap-2">
                {BADGES.map((label, i) => (
                  <span
                    key={label}
                    className={`tkn-hero-badge-${i} inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold`}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.75)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <circle cx="6" cy="6" r="5" stroke="#60a5fa" strokeWidth="1.2"/>
                      <path d="M3.5 6l1.8 1.8L8.5 4" stroke="#60a5fa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* 右：施工写真カード（デスクトップ） */}
            <div className="hidden lg:block relative h-[480px]">
              {CARDS.map(({ src, label, cls, pos }) => (
                <div
                  key={src}
                  className={`${cls} tkn-card-shine tkn-hero-float absolute ${pos} rounded-2xl overflow-hidden`}
                  style={{
                    boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="relative aspect-[4/3]">
                    <Image src={src} alt={`施工事例 ${label}`} fill className="object-cover" sizes="28vw" />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(13,17,23,0.85) 0%, transparent 55%)" }}
                      aria-hidden
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold"
                        style={{ color: "rgba(255,255,255,0.9)" }}
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                          <circle cx="4" cy="4" r="3" fill="#2d7dd2"/>
                        </svg>
                        {label}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {/* 光点 */}
              <div
                className="absolute top-[33%] left-[43%] w-3 h-3 rounded-full"
                aria-hidden
                style={{
                  background: "#2d7dd2",
                  boxShadow: "0 0 16px 4px rgba(45,125,210,0.6)",
                  animation: "tkn-hero-pulse-ring 2s ease-out 0.5s infinite",
                }}
              />
            </div>

            {/* モバイル：施工写真カード（デスクトップと同レイアウト） */}
            <div className="lg:hidden relative" style={{ height: "clamp(220px, 55vw, 340px)" }}>
              {CARDS.map(({ src, label, cls, pos }) => (
                <div
                  key={src}
                  className={`${cls} tkn-card-shine absolute ${pos} rounded-xl overflow-hidden`}
                  style={{
                    boxShadow: "0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="relative aspect-[4/3]">
                    <Image src={src} alt={`施工事例 ${label}`} fill className="object-cover" sizes="46vw" />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(13,17,23,0.85) 0%, transparent 55%)" }}
                      aria-hidden
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-2 py-2">
                      <span className="text-[0.58rem] font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>
                        {label}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── モバイル CTA（ファーストビュー最下部） ── */}
          <div
            className="lg:hidden relative px-5 pb-8 pt-4"
            style={{
              background: "linear-gradient(to top, rgba(13,17,23,1) 60%, transparent 100%)",
            }}
          >
            {/* バッジ */}
            <div className="flex justify-center gap-2 mb-4">
              {BADGES.map((label, i) => (
                <span
                  key={label}
                  className={`tkn-hero-badge-${i} inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.6rem] font-semibold`}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.13)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <circle cx="5" cy="5" r="4" stroke="#60a5fa" strokeWidth="1"/>
                    <path d="M2.8 5l1.5 1.5L7.2 3.5" stroke="#60a5fa" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {label}
                </span>
              ))}
            </div>

            {/* CTA ボタン */}
            <div className="flex flex-col gap-2.5 max-w-sm mx-auto">
              <Link href="/takanaga/contact" className="tkn-btn-primary justify-center !py-4 !text-base">
                無料で現地調査を相談する
                <ArrowRight size={18} aria-hidden />
              </Link>
              <Link
                href="/takanaga/works"
                className="inline-flex items-center justify-center gap-2 py-3.5 text-sm font-semibold rounded-full transition-all"
                style={{
                  color: "rgba(255,255,255,0.75)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                施工事例を見る
              </Link>
            </div>

            {/* AIシミュレーション */}
            <div className="text-center mt-3">
              <Link
                href={siteConfig.externalLinks.simulatorUrl}
                className="inline-flex items-center gap-1.5 text-xs"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                <Camera size={12} aria-hidden />
                <span className="underline underline-offset-4">AIシミュレーションを試す</span>
              </Link>
            </div>
          </div>
        </div>

        {/* スクロールヒント */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 tkn-scroll-hint"
          aria-hidden
        >
          <span className="text-[0.6rem] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Scroll</span>
          <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
        </div>

        {/* 波形区切り */}
        <div className="tkn-wave-divider" aria-hidden>
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="#f8fafd" />
          </svg>
        </div>
      </section>
    </>
  );
}
