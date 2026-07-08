// 相談から施工までの流れ（5ステップ）のミニイラスト。
// LPの配色に合わせたフラットなinline SVG。

const C = {
  ink: "#4a4a3f",
  olive: "#5a6b46",
  oliveSoft: "#8a9573",
  oliveDeep: "#3f4d33",
  terra: "#c96b3f",
  gold: "#cdb98a",
  cream: "#f0ebdc",
  white: "#ffffff",
  sky: "#edf0e8",
};

export type FlowIllustKind = "form" | "call" | "survey" | "plan" | "construction";

export default function FlowIllust({ kind, className = "" }: { kind: FlowIllustKind; className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <circle cx="40" cy="40" r="38" fill={C.cream} />

      {kind === "form" && (
        <g>
          {/* スマホ */}
          <rect x="26" y="16" width="28" height="48" rx="6" fill={C.white} stroke={C.olive} strokeWidth="2.5" />
          <line x1="36" y1="21" x2="44" y2="21" stroke={C.olive} strokeWidth="2" strokeLinecap="round" />
          {/* チェック項目 */}
          <circle cx="33" cy="32" r="3" fill={C.oliveSoft} />
          <line x1="39" y1="32" x2="49" y2="32" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="33" cy="42" r="3" fill={C.oliveSoft} />
          <line x1="39" y1="42" x2="49" y2="42" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" />
          {/* 大きなチェック */}
          <circle cx="48" cy="54" r="10" fill={C.terra} />
          <path d="M 43.5 54 L 47 57.5 L 53 50.5" stroke={C.white} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
      )}

      {kind === "call" && (
        <g>
          {/* 受話器 */}
          <path
            d="M 26 22 C 22 26 22 34 28 44 C 34 54 44 60 50 58 C 54 56.5 56 53 54 50 L 48 45 C 46 43.5 44 44 42.5 46 C 38 44 34 40 32 35.5 C 34.5 34 35 32 33.5 30 L 29 24.5 C 27.8 22.8 27 21.5 26 22 Z"
            fill={C.olive}
          />
          {/* 音波 */}
          <path d="M 50 24 C 54 26 56 30 56 34" stroke={C.terra} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 54 18 C 60 21 63 27 63 33" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      )}

      {kind === "survey" && (
        <g>
          {/* 家 */}
          <rect x="20" y="36" width="28" height="24" rx="2" fill={C.white} stroke={C.oliveSoft} strokeWidth="2" />
          <path d="M 17 38 L 34 24 L 51 38 Z" fill={C.oliveDeep} />
          <rect x="30" y="46" width="8" height="14" rx="1.5" fill={C.gold} />
          {/* 虫めがね */}
          <circle cx="53" cy="49" r="10" fill={C.sky} stroke={C.terra} strokeWidth="3" />
          <line x1="60" y1="57" x2="67" y2="64" stroke={C.terra} strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {kind === "plan" && (
        <g>
          {/* 図面 */}
          <rect x="18" y="22" width="40" height="34" rx="3" fill={C.white} stroke={C.olive} strokeWidth="2.5" />
          <path d="M 24 30 h 16 M 24 38 h 10" stroke={C.oliveSoft} strokeWidth="2.5" strokeLinecap="round" />
          <rect x="42" y="34" width="10" height="14" rx="1.5" fill="none" stroke={C.gold} strokeWidth="2" />
          {/* 鉛筆 */}
          <g transform="rotate(45 56 52)">
            <rect x="51" y="36" width="10" height="26" rx="2" fill={C.terra} />
            <path d="M 51 62 L 56 70 L 61 62 Z" fill={C.gold} />
            <rect x="51" y="33" width="10" height="5" rx="1.5" fill={C.olive} />
          </g>
        </g>
      )}

      {kind === "construction" && (
        <g>
          {/* ヘルメット */}
          <path d="M 22 46 C 22 32 30 24 40 24 C 50 24 58 32 58 46 Z" fill={C.white} stroke={C.oliveSoft} strokeWidth="2.5" />
          <rect x="37" y="24" width="6" height="22" fill={C.olive} />
          <rect x="16" y="45" width="48" height="7" rx="3.5" fill={C.white} stroke={C.oliveSoft} strokeWidth="2.5" />
          {/* キラキラ */}
          <path d="M 60 22 l 2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill={C.terra} />
          <path d="M 18 26 l 1.4 3.6 3.6 1.4 -3.6 1.4 -1.4 3.6 -1.4 -3.6 -3.6 -1.4 3.6 -1.4 Z" fill={C.gold} />
          {/* 完成の旗 */}
          <line x1="40" y1="58" x2="40" y2="70" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 40 58 L 54 61.5 L 40 65 Z" fill={C.terra} />
        </g>
      )}
    </svg>
  );
}
