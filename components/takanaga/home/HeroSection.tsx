"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Camera } from "lucide-react";
import { siteConfig } from "@/data/takanaga/siteConfig";

const heroStyles = `
  @keyframes tkn-slide-up {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes tkn-slide-right {
    from { opacity:0; transform:translateX(-24px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes tkn-scale-in {
    from { opacity:0; transform:scale(0.9); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes tkn-badge-pop {
    0%   { opacity:0; transform:scale(0.7); }
    65%  { transform:scale(1.07); }
    100% { opacity:1; transform:scale(1); }
  }
  @keyframes tkn-pulse {
    0%,100% { transform:scale(1);   opacity:1; }
    50%     { transform:scale(1.15); opacity:0.7; }
  }
  @keyframes tkn-float {
    0%,100% { transform:translateY(0); }
    50%     { transform:translateY(-8px); }
  }
  @keyframes tkn-line-in {
    from { transform:scaleX(0); transform-origin:left; }
    to   { transform:scaleX(1); transform-origin:left; }
  }
  @keyframes tkn-particle-up {
    0%   { opacity:0.6; transform:translateY(0); }
    100% { opacity:0;   transform:translateY(-100px); }
  }

  /* デスクトップ */
  .tkn-tag   { animation: tkn-slide-right 0.6s cubic-bezier(.22,.68,0,1.2) 0.05s both; }
  .tkn-h1a   { animation: tkn-slide-up    0.7s cubic-bezier(.22,.68,0,1.1) 0.2s  both; }
  .tkn-h1b   { animation: tkn-slide-up    0.7s cubic-bezier(.22,.68,0,1.1) 0.32s both; }
  .tkn-sub   { animation: tkn-slide-up    0.65s ease-out                   0.44s both; }
  .tkn-cta   { animation: tkn-slide-up    0.65s ease-out                   0.56s both; }
  .tkn-sim   { animation: tkn-slide-up    0.6s  ease-out                   0.68s both; }
  .tkn-bd0   { animation: tkn-badge-pop   0.55s cubic-bezier(.22,.68,0,1.4) 0.76s both; }
  .tkn-bd1   { animation: tkn-badge-pop   0.55s cubic-bezier(.22,.68,0,1.4) 0.88s both; }
  .tkn-bd2   { animation: tkn-badge-pop   0.55s cubic-bezier(.22,.68,0,1.4) 1.0s  both; }

  /* 写真カード */
  .tkn-card0 { animation: tkn-scale-in 0.75s cubic-bezier(.22,.68,0,1.1) 0.1s  both; }
  .tkn-card1 { animation: tkn-scale-in 0.75s cubic-bezier(.22,.68,0,1.1) 0.28s both; }
  .tkn-card2 { animation: tkn-scale-in 0.75s cubic-bezier(.22,.68,0,1.1) 0.46s both; }
  .tkn-float { animation: tkn-float 5s ease-in-out 1.2s infinite; }

  .tkn-accent-line {
    display:block; height:3px; border-radius:2px;
    background:linear-gradient(90deg,#1d5fa6,#d9601a);
    margin-top:6px;
    animation: tkn-line-in 0.6s ease-out 0.5s both;
  }

  @media (prefers-reduced-motion: reduce) {
    .tkn-tag,.tkn-h1a,.tkn-h1b,.tkn-sub,.tkn-cta,.tkn-sim,
    .tkn-bd0,.tkn-bd1,.tkn-bd2,
    .tkn-card0,.tkn-card1,.tkn-card2,.tkn-float {
      animation:none; opacity:1; transform:none;
    }
    .tkn-accent-line { animation:none; transform:scaleX(1); }
  }
`;

/* 写真カードデータ */
const CARDS = [
  { src: "/images/gaikou/works/case1-after.png", label: "コンクリート駐車場", cls: "tkn-card0" },
  { src: "/images/gaikou/works/case3-after.png", label: "カーポート",           cls: "tkn-card1" },
  { src: "/images/gaikou/works/case5-after.png", label: "フェンス・外構",       cls: "tkn-card2" },
];

/* 共通シャドウ */
const shadow = (size: "lg" | "sm") =>
  size === "lg"
    ? "0 20px 56px rgba(15,39,68,0.16), 0 0 0 1px rgba(200,216,234,0.6)"
    : "0 10px 32px rgba(15,39,68,0.13), 0 0 0 1px rgba(200,216,234,0.5)";

/* カードラベルオーバーレイ */
function CardLabel({ text, size = "sm" }: { text: string; size?: "sm" | "xs" }) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0"
      style={{ background: "linear-gradient(to top, rgba(15,39,68,0.82) 0%, transparent 100%)", padding: "10px 12px 8px" }}
    >
      <span className="flex items-center gap-1.5">
        <span className="block w-1.5 h-1.5 rounded-full" style={{ background: "#2d7dd2", flexShrink: 0 }} aria-hidden />
        <span style={{ color: "#fff", fontSize: size === "xs" ? "0.62rem" : "0.72rem", fontWeight: 600 }}>{text}</span>
      </span>
    </div>
  );
}

export default function HeroSection() {
  const svgRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const g = svgRef.current;
    if (!g) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const nodes: SVGElement[] = [];
    for (let i = 0; i < 12; i++) {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", `${10 + Math.random() * 80}%`);
      c.setAttribute("cy", `${20 + Math.random() * 60}%`);
      c.setAttribute("r", String(1 + Math.random() * 1.5));
      c.setAttribute("fill", "rgba(29,95,166,0.2)");
      const dur = 6 + Math.random() * 6;
      c.style.animation = `tkn-particle-up ${dur}s ease-out ${Math.random() * 4}s infinite`;
      g.appendChild(c);
      nodes.push(c);
    }
    return () => nodes.forEach((n) => n.remove());
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: heroStyles }} />

      <section className="relative overflow-hidden bg-white" style={{ minHeight: "100svh" }} aria-label="ファーストビュー">

        {/* ── 背景写真（デスクトップ） ── */}
        <div className="absolute inset-0 hidden lg:block pointer-events-none" aria-hidden>
          <Image
            src="/images/gaikou/hero-fv.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          {/* 左から右へのグラデーション：テキスト側は白く、写真カード側は見せる */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(105deg, rgba(255,255,255,0.93) 0%, rgba(255,255,255,0.82) 38%, rgba(255,255,255,0.48) 62%, rgba(255,255,255,0.22) 100%)" }}
          />
        </div>

        {/* ── 背景写真（モバイル） ── */}
        <div className="absolute inset-0 lg:hidden pointer-events-none" aria-hidden>
          <Image
            src="/images/gaikou/hero-fv.png"
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: "28% center" }}
            priority
          />
          {/* 上（カード部）は写真を見せ、下（テキスト部）は白で読みやすくする */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.52) 40%, rgba(255,255,255,0.93) 58%, rgba(255,255,255,0.98) 100%)" }}
          />
        </div>

        {/* ── 背景SVG ── */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="hg-dot" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="14" cy="14" r="0.85" fill="rgba(29,95,166,0.07)" />
            </pattern>
            <radialGradient id="hg-tl" cx="0%" cy="0%" r="55%">
              <stop offset="0%" stopColor="rgba(229,238,248,0.85)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="hg-br" cx="100%" cy="100%" r="50%">
              <stop offset="0%" stopColor="rgba(240,245,252,0.7)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#hg-dot)" />
          <rect width="100%" height="100%" fill="url(#hg-tl)" />
          <rect width="100%" height="100%" fill="url(#hg-br)" />
          {/* コーナー装飾 */}
          <g stroke="rgba(29,95,166,0.13)" strokeWidth="1.5" fill="none">
            <polyline points="0,72 0,0 72,0" />
          </g>
          <g stroke="rgba(29,95,166,0.1)" strokeWidth="1.2" fill="none">
            <circle cx="78%" cy="48%" r="220" />
            <circle cx="78%" cy="48%" r="350" />
          </g>
          <g ref={svgRef} />
        </svg>

        {/* SEO用のh1（ページ内で1つだけ）。見た目のキャッチコピーはpタグで表現する */}
        <h1 className="sr-only">岐阜・愛知・三重の外構工事なら高長建設</h1>

        {/* ──────────────────────────────────────
            モバイルレイアウト（写真が上、テキスト・CTAが下）
        ────────────────────────────────────── */}
        <div className="lg:hidden flex flex-col" style={{ minHeight: "100svh" }}>

          {/* ① タグ（最上部） */}
          <div className="tkn-tag px-5 pt-6 pb-3 flex items-center gap-2">
            <span className="relative flex w-2 h-2" aria-hidden>
              <span className="absolute inset-0 rounded-full" style={{ background: "#2d7dd2", animation: "tkn-pulse 2s ease-in-out infinite" }} />
            </span>
            <span className="text-[0.65rem] font-bold tracking-[0.18em] uppercase" style={{ color: "#1d5fa6" }}>
              岐阜・愛知・三重 対応
            </span>
          </div>

          {/* ② 写真カード群（重なり・モバイル） */}
          <div className="relative mx-4 flex-none" style={{ height: "52svh" }}>

            {/* 大カード（右上） */}
            <div
              className={`${CARDS[0].cls} absolute rounded-2xl overflow-hidden`}
              style={{ top: 0, right: 0, width: "64%", boxShadow: shadow("lg") }}
            >
              <div className="relative" style={{ paddingBottom: "78%" }}>
                <Image src={CARDS[0].src} alt={`施工事例 ${CARDS[0].label}`} fill className="object-cover" sizes="60vw" priority />
                <CardLabel text={CARDS[0].label} />
              </div>
            </div>

            {/* 中カード（左中） */}
            <div
              className={`${CARDS[1].cls} absolute rounded-xl overflow-hidden`}
              style={{ top: "36%", left: 0, width: "44%", boxShadow: shadow("sm") }}
            >
              <div className="relative" style={{ paddingBottom: "78%" }}>
                <Image src={CARDS[1].src} alt={`施工事例 ${CARDS[1].label}`} fill className="object-cover" sizes="40vw" />
                <CardLabel text={CARDS[1].label} size="xs" />
              </div>
            </div>

            {/* 小カード（右下） */}
            <div
              className={`${CARDS[2].cls} absolute rounded-xl overflow-hidden`}
              style={{ bottom: 0, right: "3%", width: "40%", boxShadow: shadow("sm") }}
            >
              <div className="relative" style={{ paddingBottom: "78%" }}>
                <Image src={CARDS[2].src} alt={`施工事例 ${CARDS[2].label}`} fill className="object-cover" sizes="38vw" />
                <CardLabel text={CARDS[2].label} size="xs" />
              </div>
            </div>

            {/* 接続ドット */}
            <div
              className="absolute rounded-full"
              style={{
                top: "34%", left: "41%", width: 10, height: 10,
                background: "#2d7dd2",
                boxShadow: "0 0 0 3px rgba(45,125,210,0.2), 0 0 12px rgba(45,125,210,0.4)",
              }}
              aria-hidden
            />
          </div>

          {/* ③ テキスト */}
          <div className="px-5 pt-5">
            <p className="font-black leading-[1.15] tracking-tight" style={{ fontSize: "clamp(1.75rem,8vw,2.4rem)" }}>
              <span className="tkn-h1a block" style={{ color: "#0f2744" }}>住まいの外まわりを、</span>
              <span className="tkn-h1b block mb-1" style={{ color: "#1d5fa6" }}>
                もっと快適に。
                <span className="tkn-accent-line" aria-hidden />
              </span>
            </p>
            <p className="tkn-sub mt-3 text-sm leading-relaxed" style={{ color: "#4a6580", maxWidth: "30rem" }}>
              駐車場・カーポート・フェンス・お庭。外構リフォーム専門で
              東海エリアのお悩みを解決。現地調査・見積もりは<strong style={{ color: "#d9601a" }}>無料</strong>。
            </p>
          </div>

          {/* ④ バッジ */}
          <div className="px-5 pt-4 flex flex-wrap gap-2">
            {[
              { label: "現地調査", value: "無料", cls: "tkn-bd0" },
              { label: "お見積もり", value: "無料", cls: "tkn-bd1" },
              { label: "対応エリア", value: "3県",  cls: "tkn-bd2" },
            ].map(({ label, value, cls }) => (
              <span
                key={label}
                className={`${cls} inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[0.65rem] font-semibold`}
                style={{ background: "#e5eef8", border: "1px solid #c8d8ea", color: "#1a3d6b" }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                  <circle cx="5" cy="5" r="4" stroke="#1d5fa6" strokeWidth="1" />
                  <path d="M2.8 5l1.5 1.5L7.2 3.5" stroke="#1d5fa6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ color: "#4a6580" }}>{label}</span>
                <span style={{ color: "#1d5fa6", fontWeight: 700 }}>{value}</span>
              </span>
            ))}
          </div>

          {/* ⑤ CTA（最下部） */}
          <div className="mt-auto px-5 pb-10 pt-5 flex flex-col gap-2.5">
            <Link href="/contact" className="tkn-cta tkn-btn-primary !w-full justify-center !py-4 !text-[0.95rem]">
              無料で現地調査を相談する
              <ArrowRight size={17} aria-hidden />
            </Link>
            <Link href="/works" className="tkn-cta tkn-btn-outline !w-full justify-center !py-3.5 !text-[0.9rem]">
              施工事例を見る
            </Link>
            <div className="text-center">
              <Link href={siteConfig.externalLinks.simulatorUrl} className="tkn-sim inline-flex items-center gap-1.5 text-xs" style={{ color: "#4a6580" }}>
                <Camera size={12} aria-hidden />
                <span className="underline underline-offset-4">AIシミュレーションを試す</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────
            デスクトップレイアウト
        ────────────────────────────────────── */}
        <div className="hidden lg:flex items-center" style={{ minHeight: "100svh" }}>
          <div className="w-full mx-auto max-w-7xl px-12 py-20 grid grid-cols-2 gap-14 items-center">

            {/* 左：テキスト */}
            <div>
              <div className="tkn-tag flex items-center gap-2.5 mb-7">
                <span className="relative flex w-2 h-2" aria-hidden>
                  <span className="absolute inset-0 rounded-full" style={{ background: "#2d7dd2", animation: "tkn-pulse 2s ease-in-out infinite" }} />
                </span>
                <span className="text-[0.68rem] font-bold tracking-[0.2em] uppercase" style={{ color: "#1d5fa6" }}>
                  岐阜・愛知・三重 対応
                </span>
              </div>

              <p className="font-black leading-[1.18] tracking-tight mb-2" style={{ fontSize: "clamp(2.2rem,3.8vw,3.25rem)" }}>
                <span className="tkn-h1a block" style={{ color: "#0f2744" }}>住まいの外まわりを、</span>
                <span className="tkn-h1b block" style={{ color: "#1d5fa6" }}>
                  もっと快適に。
                  <span className="tkn-accent-line" aria-hidden />
                </span>
              </p>

              <p className="tkn-sub mt-5 leading-relaxed mb-8" style={{ color: "#4a6580", fontSize: "1rem", maxWidth: "28rem" }}>
                駐車場・カーポート・フェンス・お庭など、外構リフォームの専門会社として
                東海エリアのお客様のお悩みを解決しています。
                現地調査・お見積もりは<strong style={{ color: "#d9601a" }}>無料</strong>です。
              </p>

              <div className="tkn-cta flex gap-3 mb-6">
                <Link href="/contact" className="tkn-btn-primary !text-base !py-4 !px-8">
                  無料で現地調査を相談する
                  <ArrowRight size={18} aria-hidden />
                </Link>
                <Link href="/works" className="tkn-btn-outline !text-base !py-4 !px-8">
                  施工事例を見る
                </Link>
              </div>

              <div className="tkn-sim mb-8">
                <Link
                  href={siteConfig.externalLinks.simulatorUrl}
                  className="inline-flex items-center gap-1.5 text-sm transition-colors"
                  style={{ color: "#4a6580" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#1d5fa6"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#4a6580"; }}
                >
                  <Camera size={13} aria-hidden />
                  <span className="underline underline-offset-4">AIシミュレーションで完成イメージを確認する</span>
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: "現地調査", value: "無料", cls: "tkn-bd0" },
                  { label: "お見積もり", value: "無料", cls: "tkn-bd1" },
                  { label: "対応エリア", value: "3県",  cls: "tkn-bd2" },
                ].map(({ label, value, cls }) => (
                  <span
                    key={label}
                    className={`${cls} inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold`}
                    style={{ background: "#e5eef8", border: "1px solid #c8d8ea", color: "#1a3d6b" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <circle cx="6" cy="6" r="5" stroke="#1d5fa6" strokeWidth="1.2" />
                      <path d="M3.5 6l1.8 1.8L8.5 4" stroke="#1d5fa6" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ color: "#4a6580" }}>{label}</span>
                    <span style={{ color: "#1d5fa6", fontWeight: 700 }}>{value}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 右：施工写真カード（重なり） */}
            <div className="tkn-float relative" style={{ height: 500 }}>

              {/* 大カード（右上） */}
              <div
                className="tkn-card0 absolute rounded-2xl overflow-hidden"
                style={{ top: 0, right: 0, width: "65%", boxShadow: shadow("lg") }}
              >
                <div className="relative" style={{ paddingBottom: "76%" }}>
                  <Image src={CARDS[0].src} alt={`施工事例 ${CARDS[0].label}`} fill className="object-cover" sizes="28vw" priority />
                  <CardLabel text={CARDS[0].label} />
                </div>
              </div>

              {/* 中カード（左中） */}
              <div
                className="tkn-card1 absolute rounded-xl overflow-hidden"
                style={{ top: "38%", left: 0, width: "46%", boxShadow: shadow("sm") }}
              >
                <div className="relative" style={{ paddingBottom: "76%" }}>
                  <Image src={CARDS[1].src} alt={`施工事例 ${CARDS[1].label}`} fill className="object-cover" sizes="20vw" />
                  <CardLabel text={CARDS[1].label} />
                </div>
              </div>

              {/* 小カード（右下） */}
              <div
                className="tkn-card2 absolute rounded-xl overflow-hidden"
                style={{ bottom: 0, right: "4%", width: "42%", boxShadow: shadow("sm") }}
              >
                <div className="relative" style={{ paddingBottom: "76%" }}>
                  <Image src={CARDS[2].src} alt={`施工事例 ${CARDS[2].label}`} fill className="object-cover" sizes="18vw" />
                  <CardLabel text={CARDS[2].label} />
                </div>
              </div>

              {/* 接続ドット */}
              <div
                className="absolute rounded-full"
                style={{
                  top: "36%", left: "43%", width: 12, height: 12,
                  background: "#2d7dd2",
                  boxShadow: "0 0 0 4px rgba(45,125,210,0.15), 0 0 16px rgba(45,125,210,0.4)",
                }}
                aria-hidden
              />
            </div>
          </div>
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
