// 線画タッチの人物イラスト（inline SVG）。
// 参考LPの「グレーの線画＋服だけ差し色」のスタイルに合わせている。
// 線: #82827c / 髪: #c9c9c3 / 服: マスタード #f0c952（お客様）・白＋オリーブ（スタッフ）

const L = {
  line: "#82827c",
  hair: "#c9c9c3",
  skin: "#ffffff",
  mustard: "#f0c952",
  mustardShade: "#e0b83e",
  white: "#ffffff",
  olive: "#5a6b46",
  terra: "#c96b3f",
  sweat: "#a8c8d8",
};

const S = 2.2; // 基本の線幅

// ── 悩みの渦マーク ──────────────────────────────────────────────────
function Swirl({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round">
      <path d="M 0 14 C -8 10 -8 0 0 -2 C 8 -4 12 4 6 8 C 2 11 -2 8 0 4" />
    </g>
  );
}

// ── 悩む女性（頬に手・ロングヘア） ──────────────────────────────────
export function WorryWoman({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 230"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      role="img"
      aria-label="外構の費用に悩む女性のイラスト"
    >
      <Swirl x={162} y={30} />
      {/* 後ろ髪 */}
      <path
        d="M 62 210 C 54 150 52 96 62 74 C 72 50 90 40 104 40 C 118 40 136 50 146 74 C 156 96 154 150 146 210"
        fill={L.hair}
        stroke={L.line}
        strokeWidth={S}
      />
      {/* 首 */}
      <path d="M 94 118 L 94 136 L 114 136 L 114 118 Z" fill={L.skin} stroke={L.line} strokeWidth={S} />
      {/* 顔 */}
      <ellipse cx="104" cy="90" rx="32" ry="34" fill={L.skin} stroke={L.line} strokeWidth={S} />
      {/* 前髪 */}
      <path
        d="M 72 88 C 70 60 86 46 104 46 C 122 46 138 60 136 88 C 128 72 122 66 112 64 C 104 74 86 80 72 88 Z"
        fill={L.hair}
        stroke={L.line}
        strokeWidth={S}
      />
      {/* 困り眉・目 */}
      <path d="M 84 84 Q 90 81 95 84" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <path d="M 113 84 Q 118 81 124 84" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <path d="M 86 94 L 94 94" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <path d="M 114 94 L 122 94" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      {/* 口（困り） */}
      <path d="M 100 110 Q 104 108 108 110" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      {/* 体（マスタードのトップス） */}
      <path
        d="M 56 230 C 56 172 76 134 104 134 C 132 134 152 172 152 230 Z"
        fill={L.mustard}
        stroke={L.line}
        strokeWidth={S}
      />
      {/* 袖のしわ */}
      <path d="M 74 176 C 78 172 84 170 90 172" fill="none" stroke={L.mustardShade} strokeWidth={S} strokeLinecap="round" />
      <path d="M 118 172 C 124 170 130 172 134 176" fill="none" stroke={L.mustardShade} strokeWidth={S} strokeLinecap="round" />
      {/* 頬に手を当てる腕 */}
      <path
        d="M 146 210 C 150 186 148 160 136 138 C 132 130 128 122 128 114"
        fill="none"
        stroke={L.line}
        strokeWidth={S}
      />
      <path
        d="M 152 214 C 158 186 156 156 142 132"
        fill={L.mustard}
        stroke="none"
      />
      {/* 手 */}
      <path
        d="M 126 116 C 122 108 126 100 134 100 C 140 100 144 106 142 112 C 140 118 132 122 126 116 Z"
        fill={L.skin}
        stroke={L.line}
        strokeWidth={S}
      />
    </svg>
  );
}

// ── 悩む男性（スマホを見る・汗） ────────────────────────────────────
export function WorryMan({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 230"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      role="img"
      aria-label="外構の見積もりに悩む男性のイラスト"
    >
      {/* 汗 */}
      <path
        d="M 156 44 C 162 52 164 58 160 62 C 156 66 150 64 149 58 C 148 53 151 48 156 44 Z"
        fill={L.white}
        stroke={L.sweat}
        strokeWidth={S}
      />
      {/* 首 */}
      <path d="M 92 116 L 92 134 L 112 134 L 112 116 Z" fill={L.skin} stroke={L.line} strokeWidth={S} />
      {/* 顔 */}
      <ellipse cx="102" cy="88" rx="31" ry="33" fill={L.skin} stroke={L.line} strokeWidth={S} />
      {/* 短髪 */}
      <path
        d="M 71 84 C 69 56 84 42 102 42 C 120 42 135 56 133 84 C 128 66 120 60 110 58 C 100 66 84 72 71 84 Z"
        fill={L.hair}
        stroke={L.line}
        strokeWidth={S}
      />
      {/* 耳 */}
      <ellipse cx="70" cy="90" rx="5" ry="7" fill={L.skin} stroke={L.line} strokeWidth={S} />
      <ellipse cx="134" cy="90" rx="5" ry="7" fill={L.skin} stroke={L.line} strokeWidth={S} />
      {/* 困り眉・目（伏し目でスマホを見る） */}
      <path d="M 82 82 Q 88 79 93 82" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <path d="M 111 82 Q 116 79 122 82" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <path d="M 85 93 Q 89 96 93 93" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <path d="M 111 93 Q 115 96 119 93" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      {/* 口 */}
      <path d="M 97 108 Q 102 106 107 108" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      {/* 体（マスタードの長袖） */}
      <path
        d="M 54 230 C 54 172 74 132 102 132 C 130 132 150 172 150 230 Z"
        fill={L.mustard}
        stroke={L.line}
        strokeWidth={S}
      />
      {/* スマホを持つ腕（体の前） */}
      <path
        d="M 62 196 C 70 178 82 168 94 166"
        fill="none"
        stroke={L.mustardShade}
        strokeWidth={S}
        strokeLinecap="round"
      />
      <path
        d="M 142 196 C 134 178 122 168 110 166"
        fill="none"
        stroke={L.mustardShade}
        strokeWidth={S}
        strokeLinecap="round"
      />
      {/* スマホ */}
      <rect x="88" y="152" width="28" height="44" rx="5" fill={L.white} stroke={L.line} strokeWidth={S} transform="rotate(8 102 174)" />
      {/* 手 */}
      <ellipse cx="88" cy="192" rx="8" ry="7" fill={L.skin} stroke={L.line} strokeWidth={S} />
      <ellipse cx="118" cy="188" rx="8" ry="7" fill={L.skin} stroke={L.line} strokeWidth={S} />
    </svg>
  );
}

// ── 案内するスタッフ（線画・ヘルメット・笑顔） ──────────────────────
export function StaffGuide({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 210 230"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      role="img"
      aria-label="案内する外構スタッフのイラスト"
    >
      {/* 首 */}
      <path d="M 92 120 L 92 138 L 112 138 L 112 120 Z" fill={L.skin} stroke={L.line} strokeWidth={S} />
      {/* 顔 */}
      <ellipse cx="102" cy="92" rx="31" ry="33" fill={L.skin} stroke={L.line} strokeWidth={S} />
      {/* 耳 */}
      <ellipse cx="70" cy="94" rx="5" ry="7" fill={L.skin} stroke={L.line} strokeWidth={S} />
      <ellipse cx="134" cy="94" rx="5" ry="7" fill={L.skin} stroke={L.line} strokeWidth={S} />
      {/* もみあげ */}
      <path d="M 72 82 C 72 78 73 74 76 72 L 76 86 Z" fill={L.hair} stroke={L.line} strokeWidth={1.5} />
      <path d="M 132 82 C 132 78 131 74 128 72 L 128 86 Z" fill={L.hair} stroke={L.line} strokeWidth={1.5} />
      {/* にっこり目・眉 */}
      <path d="M 82 82 Q 88 80 93 82" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <path d="M 111 82 Q 116 80 122 82" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <path d="M 85 94 Q 89 89 93 94" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <path d="M 111 94 Q 115 89 119 94" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      {/* 笑顔の口 */}
      <path d="M 94 106 Q 102 114 110 106" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      {/* ヘルメット */}
      <path d="M 68 76 C 68 52 84 38 102 38 C 120 38 136 52 136 76 Z" fill={L.white} stroke={L.line} strokeWidth={S} />
      <path d="M 97 39 L 97 76 L 107 76 L 107 39 C 104 38.6 100 38.6 97 39 Z" fill={L.olive} />
      <rect x="60" y="74" width="84" height="10" rx="5" fill={L.white} stroke={L.line} strokeWidth={S} />
      {/* ヘルメットの家マーク */}
      <path d="M 102 52 L 109 58 L 107 58 L 107 64 L 97 64 L 97 58 L 95 58 Z" fill={L.terra} />
      {/* 体（白い作業服） */}
      <path
        d="M 54 230 C 54 174 74 136 102 136 C 130 136 150 174 150 230 Z"
        fill={L.white}
        stroke={L.line}
        strokeWidth={S}
      />
      {/* 襟・ファスナー */}
      <path d="M 92 138 L 102 150 L 112 138" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <line x1="102" y1="150" x2="102" y2="230" stroke={L.line} strokeWidth={1.6} strokeDasharray="4 3" />
      {/* 肩のオリーブライン */}
      <path d="M 60 206 C 62 180 70 158 84 146" fill="none" stroke={L.olive} strokeWidth="5" strokeLinecap="round" />
      {/* 胸ポケット */}
      <rect x="112" y="164" width="20" height="15" rx="3" fill="none" stroke={L.line} strokeWidth={1.8} />
      <rect x="116" y="158" width="4" height="9" rx="2" fill={L.terra} />
      {/* 案内する腕（右上へ） */}
      <path
        d="M 142 170 C 158 160 172 146 182 130"
        fill="none"
        stroke={L.line}
        strokeWidth={S}
      />
      <path
        d="M 136 178 C 154 168 170 152 181 134"
        fill={L.white}
        stroke="none"
      />
      <path
        d="M 140 182 C 156 172 172 156 184 138"
        fill="none"
        stroke={L.line}
        strokeWidth={S}
      />
      {/* 手のひら（上向きに案内） */}
      <path
        d="M 180 128 C 178 120 184 112 192 114 C 200 116 202 126 196 132 C 190 138 182 136 180 128 Z"
        fill={L.skin}
        stroke={L.line}
        strokeWidth={S}
      />
    </svg>
  );
}

// ── 羽の生えたお金（中間コストが飛んでいく図解用） ──────────────────
export function FlyingMoney({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 60" className={className} aria-hidden="true">
      {/* 羽 */}
      <path d="M 24 30 C 10 18 6 10 14 6 C 22 2 28 12 28 24" fill={L.white} stroke={L.line} strokeWidth="2" />
      <path d="M 66 30 C 80 18 84 10 76 6 C 68 2 62 12 62 24" fill={L.white} stroke={L.line} strokeWidth="2" />
      {/* お札 */}
      <rect x="26" y="20" width="38" height="24" rx="3" fill="#f2dc8d" stroke="#c2a13e" strokeWidth="2" />
      <circle cx="45" cy="32" r="7" fill="none" stroke="#c2a13e" strokeWidth="2" />
      <text x="45" y="36" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#9a7d22">
        ¥
      </text>
    </svg>
  );
}

// ── スタッフの顔だけ（FAQの回答者アイコンなど） ──────────────────────
export function StaffFace({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="56 34 92 96" className={className} role="img" aria-label="外構スタッフの顔イラスト">
      <ellipse cx="102" cy="92" rx="31" ry="33" fill={L.skin} stroke={L.line} strokeWidth={S} />
      <ellipse cx="70" cy="94" rx="5" ry="7" fill={L.skin} stroke={L.line} strokeWidth={S} />
      <ellipse cx="134" cy="94" rx="5" ry="7" fill={L.skin} stroke={L.line} strokeWidth={S} />
      <path d="M 82 82 Q 88 80 93 82" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <path d="M 111 82 Q 116 80 122 82" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <path d="M 85 94 Q 89 89 93 94" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <path d="M 111 94 Q 115 89 119 94" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <path d="M 94 106 Q 102 114 110 106" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <path d="M 68 76 C 68 52 84 38 102 38 C 120 38 136 52 136 76 Z" fill={L.white} stroke={L.line} strokeWidth={S} />
      <path d="M 97 39 L 97 76 L 107 76 L 107 39 C 104 38.6 100 38.6 97 39 Z" fill={L.olive} />
      <rect x="60" y="74" width="84" height="10" rx="5" fill={L.white} stroke={L.line} strokeWidth={S} />
      <path d="M 102 52 L 109 58 L 107 58 L 107 64 L 97 64 L 97 58 L 95 58 Z" fill={L.terra} />
    </svg>
  );
}

// ── 腕を組んで考える年配男性（メガネ） ──────────────────────────────
export function ThinkingMan({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 230"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      role="img"
      aria-label="外構のデザインを検討する男性のイラスト"
    >
      {/* 首 */}
      <path d="M 92 116 L 92 134 L 112 134 L 112 116 Z" fill={L.skin} stroke={L.line} strokeWidth={S} />
      {/* 顔 */}
      <ellipse cx="102" cy="88" rx="31" ry="33" fill={L.skin} stroke={L.line} strokeWidth={S} />
      {/* 髪（サイド残し） */}
      <path
        d="M 71 80 C 71 56 84 42 102 42 C 120 42 133 56 133 80 C 128 62 118 56 102 56 C 86 56 76 62 71 80 Z"
        fill={L.hair}
        stroke={L.line}
        strokeWidth={S}
      />
      {/* 耳 */}
      <ellipse cx="70" cy="90" rx="5" ry="7" fill={L.skin} stroke={L.line} strokeWidth={S} />
      <ellipse cx="134" cy="90" rx="5" ry="7" fill={L.skin} stroke={L.line} strokeWidth={S} />
      {/* メガネ */}
      <rect x="78" y="80" width="20" height="15" rx="6" fill="none" stroke={L.line} strokeWidth={S} />
      <rect x="106" y="80" width="20" height="15" rx="6" fill="none" stroke={L.line} strokeWidth={S} />
      <line x1="98" y1="86" x2="106" y2="86" stroke={L.line} strokeWidth={S} />
      {/* 目（メガネの中） */}
      <line x1="85" y1="88" x2="91" y2="88" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      <line x1="113" y1="88" x2="119" y2="88" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      {/* 口（への字ぎみ） */}
      <path d="M 97 108 Q 102 107 107 108" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" />
      {/* ひげ */}
      <path d="M 92 116 Q 102 121 112 116" fill="none" stroke={L.hair} strokeWidth={3.5} strokeLinecap="round" />
      {/* 体（白シャツ） */}
      <path
        d="M 54 230 C 54 172 74 132 102 132 C 130 132 150 172 150 230 Z"
        fill={L.white}
        stroke={L.line}
        strokeWidth={S}
      />
      {/* 襟 */}
      <path d="M 92 134 L 102 146 L 112 134" fill="none" stroke={L.line} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      {/* 腕組み */}
      <path
        d="M 62 186 C 76 172 96 168 118 174 C 130 178 140 184 142 192"
        fill={L.white}
        stroke={L.line}
        strokeWidth={S}
      />
      <path
        d="M 142 188 C 128 200 106 204 84 198 C 72 194 63 189 61 182"
        fill={L.white}
        stroke={L.line}
        strokeWidth={S}
      />
      {/* 手 */}
      <ellipse cx="66" cy="184" rx="8" ry="7" fill={L.skin} stroke={L.line} strokeWidth={S} />
      <ellipse cx="138" cy="192" rx="8" ry="7" fill={L.skin} stroke={L.line} strokeWidth={S} />
    </svg>
  );
}
