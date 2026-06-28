import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Camera } from "lucide-react";
import { siteConfig } from "@/data/takanaga/siteConfig";

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden min-h-[600px] lg:min-h-[700px]"
      style={{ background: "linear-gradient(150deg, #0f2744 0%, #1a3d6b 55%, #1d5fa6 100%)" }}
      aria-label="ファーストビュー"
    >
      {/* 背景SVGデコレーション */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="hero-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.2" fill="rgba(255,255,255,0.05)" />
          </pattern>
          <radialGradient id="hero-glow" cx="65%" cy="45%" r="55%">
            <stop offset="0%" stopColor="rgba(45,125,210,0.35)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
        <rect width="100%" height="100%" fill="url(#hero-glow)" />
        {/* 大きな円弧装飾 */}
        <g stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none">
          <circle cx="72%" cy="50%" r="220" />
          <circle cx="72%" cy="50%" r="340" />
          <circle cx="72%" cy="50%" r="460" />
        </g>
        {/* 斜めライン */}
        <line x1="0" y1="100%" x2="55%" y2="0" stroke="rgba(255,255,255,0.03)" strokeWidth="80" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* 左：テキスト */}
          <div>
            {/* エリア表示 */}
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-white/20 bg-white/8 backdrop-blur-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="rgba(229,238,248,0.85)" />
              </svg>
              <span className="text-xs font-semibold text-white/80 tracking-wide">
                岐阜県・愛知県・三重県 対応
              </span>
            </div>

            {/* メインキャッチ */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black text-white leading-[1.2] mb-5 tracking-tight">
              住まいの外まわりを、<br />
              <span className="relative inline-block">
                <span className="relative z-10">もっと快適に。</span>
                <span
                  className="absolute bottom-1 left-0 right-0 h-3 -z-0 opacity-40 rounded"
                  style={{ background: "var(--tkn-blue-bright)" }}
                  aria-hidden
                />
              </span>
            </h1>

            <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              駐車場・カーポート・フェンス・お庭など、外構リフォームの専門会社として
              東海エリアのお客様のお悩みを解決しています。
              現地調査・お見積もりは無料です。
            </p>

            {/* CTA群 */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/takanaga/contact"
                className="tkn-btn-primary !text-base !py-4 !px-8"
              >
                無料で現地調査を相談する
                <ArrowRight size={18} aria-hidden />
              </Link>
              <Link
                href="/takanaga/works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border border-white/30 hover:border-white/60 hover:bg-white/10 rounded-full transition-all"
              >
                施工事例を見る
              </Link>
            </div>

            <Link
              href={siteConfig.externalLinks.simulatorUrl}
              className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white/85 transition-colors"
            >
              <Camera size={14} aria-hidden />
              <span className="underline underline-offset-4">写真で完成イメージを確認する（AIシミュレーション）</span>
            </Link>

            {/* 実績バッジ */}
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { label: "現地調査", value: "無料" },
                { label: "お見積もり", value: "無料" },
                { label: "対応エリア", value: "3県" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs text-white/65">{badge.label}</span>
                  <span className="text-xs font-bold text-white">{badge.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* モバイル：横スクロール画像ギャラリー */}
          <div className="lg:hidden -mx-4 px-4 overflow-x-auto flex gap-3 pb-2 snap-x snap-mandatory">
            {[
              { src: "/images/gaikou/works/case1-after.png", label: "コンクリート駐車場" },
              { src: "/images/gaikou/works/case3-after.png", label: "カーポート" },
              { src: "/images/gaikou/works/case5-after.png", label: "フェンス" },
              { src: "/images/gaikou/works/case2-after.png", label: "人工芝" },
            ].map((item) => (
              <div
                key={item.src}
                className="flex-shrink-0 w-[72vw] snap-center rounded-xl overflow-hidden relative"
                style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.src}
                    alt={`施工事例 ${item.label}`}
                    fill
                    className="object-cover"
                    sizes="72vw"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 px-3 py-2"
                    style={{ background: "linear-gradient(to top, rgba(15,39,68,0.85) 0%, transparent 100%)" }}
                  >
                    <p className="text-white text-xs font-semibold">{item.label} 施工後</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* デスクトップ：施工事例写真カード群 */}
          <div className="hidden lg:block relative h-[480px]">
            {/* メインカード（大） */}
            <div
              className="absolute top-0 right-0 w-[68%] rounded-2xl overflow-hidden shadow-2xl"
              style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.4)" }}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/gaikou/works/case1-after.png"
                  alt="施工事例 コンクリート駐車場"
                  fill
                  className="object-cover"
                  priority
                  sizes="30vw"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3"
                  style={{ background: "linear-gradient(to top, rgba(15,39,68,0.9) 0%, transparent 100%)" }}
                >
                  <p className="text-white text-xs font-semibold">コンクリート駐車場 施工後</p>
                </div>
              </div>
            </div>

            {/* サブカード1（左中） */}
            <div
              className="absolute top-[38%] left-0 w-[48%] rounded-xl overflow-hidden shadow-xl"
              style={{ boxShadow: "0 16px 40px rgba(0,0,0,0.35)" }}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/gaikou/works/case3-after.png"
                  alt="施工事例 カーポート"
                  fill
                  className="object-cover"
                  sizes="20vw"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 px-3 py-2"
                  style={{ background: "linear-gradient(to top, rgba(15,39,68,0.85) 0%, transparent 100%)" }}
                >
                  <p className="text-white text-[0.65rem] font-semibold">カーポート 施工後</p>
                </div>
              </div>
            </div>

            {/* サブカード2（右下） */}
            <div
              className="absolute bottom-0 right-[5%] w-[44%] rounded-xl overflow-hidden shadow-xl"
              style={{ boxShadow: "0 16px 40px rgba(0,0,0,0.35)" }}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/gaikou/works/case5-after.png"
                  alt="施工事例 フェンス"
                  fill
                  className="object-cover"
                  sizes="20vw"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 px-3 py-2"
                  style={{ background: "linear-gradient(to top, rgba(15,39,68,0.85) 0%, transparent 100%)" }}
                >
                  <p className="text-white text-[0.65rem] font-semibold">フェンス 施工後</p>
                </div>
              </div>
            </div>

            {/* 装飾：青い光点 */}
            <div
              className="absolute top-[34%] left-[44%] w-3 h-3 rounded-full"
              style={{ background: "rgba(45,125,210,0.8)", boxShadow: "0 0 12px rgba(45,125,210,0.6)" }}
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* 下部の波形SVG区切り */}
      <div className="tkn-wave-divider" aria-hidden>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="#f8fafd" />
        </svg>
      </div>
    </section>
  );
}
