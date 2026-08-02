// ファーストビュー画像の金・銀・銅の月桂冠モチーフに合わせた、ランク表示用インラインSVG。

const MEDAL_COLORS: Record<1 | 2 | 3, { from: string; to: string; ring: string }> = {
  1: { from: "#fde68a", to: "#d97706", ring: "#b45309" },
  2: { from: "#f1f5f9", to: "#94a3b8", ring: "#64748b" },
  3: { from: "#fdba74", to: "#c2410c", ring: "#9a3412" },
};

const SIZE_MAP: Record<"sm" | "md" | "lg", number> = { sm: 32, md: 40, lg: 56 };

export default function RankMedal({ rank, size = "md" }: { rank: 1 | 2 | 3; size?: "sm" | "md" | "lg" }) {
  const colors = MEDAL_COLORS[rank];
  const px = SIZE_MAP[size];
  const gradientId = `medal-gradient-${rank}-${size}`;

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      className="shrink-0"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.from} />
          <stop offset="100%" stopColor={colors.to} />
        </linearGradient>
      </defs>

      {/* 月桂冠（左右） */}
      <g stroke={colors.ring} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.9">
        <path d="M14 20 C8 26, 8 38, 14 46" />
        <path d="M17 22 C13 22, 11 26, 12 29" />
        <path d="M14.5 28 C10.5 28.5, 9 32, 10.5 35" />
        <path d="M13.5 34 C10 35, 9.5 39, 11.5 41.5" />
        <path d="M15.5 40 C12.5 41.5, 12.5 44.5, 15 46.5" />

        <path d="M50 20 C56 26, 56 38, 50 46" />
        <path d="M47 22 C51 22, 53 26, 52 29" />
        <path d="M49.5 28 C53.5 28.5, 55 32, 53.5 35" />
        <path d="M50.5 34 C54 35, 54.5 39, 52.5 41.5" />
        <path d="M48.5 40 C51.5 41.5, 51.5 44.5, 49 46.5" />
      </g>

      {/* メダル本体 */}
      <circle cx="32" cy="30" r="16" fill={`url(#${gradientId})`} stroke={colors.ring} strokeWidth="1.5" />
      <circle cx="32" cy="30" r="12.5" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="1" />
      <text
        x="32"
        y="35"
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill="white"
        fontFamily="var(--font-sans, sans-serif)"
      >
        {rank}
      </text>

      {/* リボン */}
      <path d={`M25 42 L23 58 L32 52 L41 58 L39 42 Z`} fill={colors.to} opacity="0.9" />
    </svg>
  );
}
