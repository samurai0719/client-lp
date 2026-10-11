/* eslint-disable @next/next/no-img-element */

/**
 * 「どのような雰囲気が好みですか？」の選択肢に出す小さなサイトイメージ。
 *
 * ▼ 実際のサイト画像に差し替える方法
 *   DESIGN_SAMPLE_IMAGES に「業種 → 雰囲気 → 画像パス」を追加するだけで、
 *   その組み合わせは画像表示に切り替わる（無い組み合わせは下の SVG イメージを表示）。
 *   業種を問わない共通画像は "default" に入れる。
 *   推奨サイズ：横320×縦220px 程度の WebP（public/images/adofy/free-design/ 配下）。
 */
export const DESIGN_SAMPLE_IMAGES: Partial<Record<string, Partial<Record<string, string>>>> = {
  // 例) painting: { luxury: "/images/adofy/free-design/painting-luxury.webp" },
  // 例) default: { simple: "/images/adofy/free-design/simple.webp" },
};

type Theme = {
  bg: string;
  header: string;
  headerText: string;
  hero: string;
  heroText: string;
  accent: string;
  card: string;
  line: string;
  serif?: boolean;
  rounded: number;
};

const THEMES: Record<string, Theme> = {
  simple: { bg: "#ffffff", header: "#ffffff", headerText: "#334155", hero: "#eef4fb", heroText: "#1e293b", accent: "#3b82f6", card: "#f8fafc", line: "#e2e8f0", rounded: 2 },
  luxury: { bg: "#151515", header: "#0c0c0c", headerText: "#c9a961", hero: "#262118", heroText: "#e9d9a6", accent: "#c9a961", card: "#1f1f1f", line: "#3a3426", serif: true, rounded: 0 },
  cool: { bg: "#0f172a", header: "#020617", headerText: "#e2e8f0", hero: "#1e293b", heroText: "#ffffff", accent: "#22d3ee", card: "#1e293b", line: "#334155", rounded: 0 },
  friendly: { bg: "#fffbeb", header: "#fbbf24", headerText: "#78350f", hero: "#fde68a", heroText: "#78350f", accent: "#f97316", card: "#ffffff", line: "#fcd34d", rounded: 6 },
  natural: { bg: "#f7f5ef", header: "#f7f5ef", headerText: "#4d5b3d", hero: "#dfe5d2", heroText: "#3f4a33", accent: "#8a9a5b", card: "#ffffff", line: "#e2ddd0", serif: true, rounded: 4 },
  omakase: { bg: "#ffffff", header: "#ffffff", headerText: "#334155", hero: "#fef3c7", heroText: "#1f2937", accent: "#facc15", card: "#f8fafc", line: "#e5e7eb", rounded: 4 },
};

/** 工事の種類ごとに、ヒーロー部分のモチーフを変える */
const MOTIF_GROUP: Record<string, "house" | "food" | "beauty" | "medical" | "truck" | "doc"> = {
  construction: "house", real_estate: "house", hotel: "house", cleaning: "house",
  restaurant: "food",
  salon: "beauty", bodycare: "beauty", fitness: "beauty", wedding: "beauty",
  clinic: "medical", dental: "medical", care: "medical", childcare: "medical",
  logistics: "truck", auto: "truck", travel: "truck",
};

function Motif({ industry, color }: { industry: string; color: string }) {
  const s = { fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (MOTIF_GROUP[industry] ?? "doc") {
    case "truck":
      return (
        <g {...s}>
          <rect x="82" y="34" width="20" height="12" />
          <path d="M102 38h6l4 4v4h-10" />
          <circle cx="88" cy="48" r="2.5" />
          <circle cx="106" cy="48" r="2.5" />
        </g>
      );
    case "food":
      return (
        <g {...s}>
          <path d="M84 40h24a12 12 0 0 1-24 0z" />
          <path d="M92 34c0-3 2-3 2-6M100 34c0-3 2-3 2-6" />
        </g>
      );
    case "beauty":
      return (
        <g {...s}>
          <circle cx="88" cy="46" r="3.5" />
          <circle cx="102" cy="46" r="3.5" />
          <path d="M90 43 104 28M100 43 86 28" />
        </g>
      );
    case "medical":
      return (
        <g {...s}>
          <rect x="84" y="28" width="24" height="22" rx="4" />
          <path d="M96 33v12M90 39h12" />
        </g>
      );
    case "house":
      return (
        <g {...s}>
          <path d="M82 40 96 28l14 12" />
          <path d="M86 37v12h20V37" />
          <path d="M93 49v-6h6v6" />
        </g>
      );
    default:
      return (
        <g {...s}>
          <rect x="84" y="28" width="24" height="20" rx="2" />
          <path d="M89 34h14M89 39h14M89 44h8" />
        </g>
      );
  }
}

export default function DesignSample({ style, industry }: { style: string; industry: string }) {
  const img = DESIGN_SAMPLE_IMAGES[industry]?.[style] ?? DESIGN_SAMPLE_IMAGES.default?.[style];
  if (img) {
    return <img className="fd-sample" src={img} alt="" width={160} height={110} loading="lazy" decoding="async" />;
  }

  const t = THEMES[style] ?? THEMES.simple;
  const r = t.rounded;
  return (
    <svg className="fd-sample" viewBox="0 0 120 84" role="img" aria-hidden="true">
      <rect width="120" height="84" fill={t.bg} />
      {/* ヘッダー */}
      <rect width="120" height="11" fill={t.header} />
      <rect x="6" y="4" width="16" height="3.5" rx="1" fill={t.headerText} />
      <rect x="70" y="4.5" width="9" height="2.5" rx="1" fill={t.headerText} opacity="0.6" />
      <rect x="83" y="4.5" width="9" height="2.5" rx="1" fill={t.headerText} opacity="0.6" />
      <rect x="96" y="3" width="18" height="5.5" rx={r} fill={t.accent} />
      {/* ファーストビュー */}
      <rect y="11" width="120" height="44" fill={t.hero} />
      {style === "cool" && <path d="M0 55 120 22v33z" fill={t.accent} opacity="0.12" />}
      {style === "friendly" && <circle cx="18" cy="48" r="10" fill="#fff" opacity="0.5" />}
      {style === "natural" && <path d="M0 55c30-10 60 4 120-8v8z" fill="#c8d2b4" />}
      {style === "luxury" && <rect x="8" y="19" width="62" height="28" fill="none" stroke={t.accent} strokeWidth="0.6" />}
      <rect x="12" y="24" width={t.serif ? 44 : 50} height="5" rx={t.serif ? 0 : 1} fill={t.heroText} />
      <rect x="12" y="32" width="36" height="5" rx={t.serif ? 0 : 1} fill={t.heroText} />
      <rect x="12" y="41" width="22" height="6" rx={r + 1} fill={t.accent} />
      <Motif industry={industry} color={t.heroText} />
      {/* カード */}
      {[6, 44, 82].map((x) => (
        <g key={x}>
          <rect x={x} y="60" width="32" height="20" rx={r} fill={t.card} stroke={t.line} strokeWidth="0.6" />
          <rect x={x + 4} y="64" width="24" height="6" rx={Math.max(r - 1, 0)} fill={t.accent} opacity="0.35" />
          <rect x={x + 4} y="73" width="18" height="2.5" rx="1" fill={t.headerText} opacity="0.5" />
        </g>
      ))}
    </svg>
  );
}
