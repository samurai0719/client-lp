// 王冠つきの金メダル風バッジ（実績訴求用のinline SVG）。
// 参考LPのメダル（王冠＋月桂樹＋赤リボン）を、LPの配色（金茶×テラコッタ）で再現。
// 月桂樹はリング帯の上に沿わせ、円の内側はテキスト専用にして文字はみ出しを防ぐ。

import type { ReactNode } from "react";

const G = {
  gold: "#d4af5a",
  goldDeep: "#b8934a",
  goldLight: "#eddcae",
  cream: "#fdf9ee",
  ribbon: "#b0502f",
  ribbonDeep: "#8c3d1d",
  ink: "#5a4a26",
};

// 月桂樹の葉（片側）。中心(90,104)・半径52のリング帯に沿って並べる。
function Laurel({ flip = false }: { flip?: boolean }) {
  // 角度（deg・12時=0で時計回り）とリング上の位置から葉を配置
  const CX = 90;
  const CY = 104;
  const R = 52;
  const angles = [214, 232, 250, 268, 286, 304];
  return (
    <g transform={flip ? `scale(-1 1) translate(${-CX * 2} 0)` : undefined}>
      {angles.map((deg, i) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        const x = CX + R * Math.cos(rad);
        const y = CY + R * Math.sin(rad);
        // 葉はリングの接線方向へ向ける
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="9"
            ry="3.6"
            fill={G.gold}
            transform={`rotate(${deg + 90} ${x} ${y})`}
            opacity={0.95 - i * 0.02}
          />
        );
      })}
    </g>
  );
}

type MedalBadgeProps = {
  /** 円の中の上段ラベル（例: お客様満足度） */
  topLabel: string;
  /** 中央のメイン表記。ReactNodeでtspan等も可 */
  main: ReactNode;
  /** メイン表記のフォントサイズ（px） */
  mainSize?: number;
  /** メイン表記の下の小さな補助行（例: 以上） */
  sub?: string;
  /** 下のリボンの文言 */
  ribbon: string;
  className?: string;
};

export default function MedalBadge({
  topLabel,
  main,
  mainSize = 30,
  sub,
  ribbon,
  className = "",
}: MedalBadgeProps) {
  return (
    <svg viewBox="0 0 180 206" className={className} role="img" aria-label={`${topLabel} ${ribbon}`}>
      {/* ── 王冠（円の上に帯で接続） ── */}
      <g>
        <path
          d="M 68 48
             L 65 26
             L 79 35
             L 90 17
             L 101 35
             L 115 26
             L 112 48
             Z"
          fill={G.gold}
          stroke={G.goldDeep}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <rect x="66" y="44" width="48" height="7" rx="3.5" fill={G.goldDeep} />
        <circle cx="65" cy="24" r="3" fill={G.goldLight} stroke={G.goldDeep} strokeWidth="1.2" />
        <circle cx="90" cy="15" r="3.4" fill={G.goldLight} stroke={G.goldDeep} strokeWidth="1.2" />
        <circle cx="115" cy="24" r="3" fill={G.goldLight} stroke={G.goldDeep} strokeWidth="1.2" />
      </g>

      {/* ── リボン（メダルの後ろから両側へ） ── */}
      <g>
        <path d="M 42 158 L 16 168 L 25 191 L 48 181 Z" fill={G.ribbonDeep} />
        <path d="M 138 158 L 164 168 L 155 191 L 132 181 Z" fill={G.ribbonDeep} />
        <rect x="36" y="156" width="108" height="30" rx="3" fill={G.ribbon} />
        <text x="90" y="176.5" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#ffffff">
          {ribbon}
        </text>
      </g>

      {/* ── メダル円（二重リング） ── */}
      <circle cx="90" cy="104" r="58" fill={G.cream} stroke={G.gold} strokeWidth="4" />
      <circle cx="90" cy="104" r="46" fill="none" stroke={G.goldLight} strokeWidth="1.5" />

      {/* 月桂樹（リング帯の上・テキスト領域を侵さない） */}
      <Laurel />
      <Laurel flip />

      {/* ── 円内のテキスト ── */}
      <text x="90" y={sub ? 82 : 86} textAnchor="middle" fontSize="12.5" fontWeight="bold" fill={G.ink}>
        {topLabel}
      </text>
      <text
        x="90"
        y={sub ? 116 : 122}
        textAnchor="middle"
        fontSize={mainSize}
        fontWeight="900"
        fill={G.ribbon}
        style={{ letterSpacing: "0.01em" }}
      >
        {main}
      </text>
      {sub && (
        <text x="90" y="136" textAnchor="middle" fontSize="12.5" fontWeight="bold" fill={G.ink}>
          {sub}
        </text>
      )}
    </svg>
  );
}
