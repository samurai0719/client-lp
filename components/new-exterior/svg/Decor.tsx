// 画像LP風の装飾パーツ（すべてinline SVG / CSS）。
// バースト（ギザギザバッジ）・誘導矢印・リボン見出しをまとめる。

import type { ReactNode } from "react";

// ── ギザギザのバーストバッジ ─────────────────────────────────────────
// 「無料」「追加費用なし」などの強調に使う。
function burstPoints(cx: number, cy: number, spikes: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

type BurstProps = {
  children: ReactNode;
  color?: "terracotta" | "olive" | "gold";
  className?: string;
  /** 全体の大きさ（px基準、Tailwindのw/hで上書き可） */
  size?: number;
  rotate?: number;
};

const BURST_COLORS = {
  terracotta: { fill: "#b0502f", stroke: "#96421f", text: "#ffffff" },
  olive: { fill: "#3f4d33", stroke: "#333f29", text: "#ffffff" },
  gold: { fill: "#f7f1df", stroke: "#cdb98a", text: "#9c5732" },
};

export function Burst({ children, color = "terracotta", className = "", size = 92, rotate = -8 }: BurstProps) {
  const c = BURST_COLORS[color];
  return (
    <span
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)` }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <polygon points={burstPoints(50, 50, 14, 49, 42)} fill={c.fill} stroke={c.stroke} strokeWidth="1.5" />
      </svg>
      <span
        className="relative z-[1] text-center font-bold leading-tight"
        style={{ color: c.text, fontSize: size * 0.15 }}
      >
        {children}
      </span>
    </span>
  );
}

// ── CTAへ誘導する三連シェブロン矢印 ──────────────────────────────────
export function GuideArrow({ className = "" }: { className?: string }) {
  return (
    <span className={`ne-guide-arrow inline-block ${className}`} aria-hidden="true">
      <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
        <path d="M4 2 L22 12 L40 2" stroke="#cdb98a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 14 L22 24 L40 14" stroke="#c96b3f" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 26 L22 36 L40 26" stroke="#b0502f" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// ── リボン帯見出し ───────────────────────────────────────────────────
export function RibbonHeading({
  children,
  tone = "olive",
  className = "",
}: {
  children: ReactNode;
  tone?: "olive" | "terracotta";
  className?: string;
}) {
  return (
    <span
      className={`ne-ribbon ${tone === "terracotta" ? "ne-ribbon-terracotta" : ""} text-[13px] sm:text-[15px] ${className}`}
    >
      {children}
    </span>
  );
}

// ── ¥コインの積み上げ（中間マージンの図解用） ────────────────────────
export function CoinStack({ coins, className = "" }: { coins: number; className?: string }) {
  const width = 64;
  const coinH = 14;
  const height = coins * coinH + 8;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
    >
      {Array.from({ length: coins }, (_, i) => {
        const y = height - 10 - i * coinH;
        return (
          <g key={i}>
            <ellipse cx="32" cy={y} rx="26" ry="9" fill="#e5c665" stroke="#c2a13e" strokeWidth="1.5" />
            <ellipse cx="32" cy={y - 3} rx="26" ry="9" fill="#f2dc8d" stroke="#c2a13e" strokeWidth="1.5" />
            <text
              x="32"
              y={y + 1}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#9a7d22"
            >
              ¥
            </text>
          </g>
        );
      })}
    </svg>
  );
}
