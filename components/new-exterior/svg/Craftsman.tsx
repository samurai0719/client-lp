// 笑顔の職人キャラクター（バストアップ・フラットイラスト風のinline SVG）。
// 白い作業服×オリーブの差し色×白ヘルメットで、LPの配色と揃えている。
// pose: "point"…片手で案内するポーズ / "ok"…両手で丸をつくらず胸元でグッdrポーズ

type CraftsmanProps = {
  className?: string;
  /** 左右反転（キャラを右側に置くときは true で視線を左へ） */
  flip?: boolean;
  pose?: "point" | "guide";
};

export default function Craftsman({ className = "", flip = false, pose = "point" }: CraftsmanProps) {
  return (
    <svg
      viewBox="0 0 220 210"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      role="img"
      aria-label="案内する職人スタッフのイラスト"
    >
      {/* ── 胴体（白い作業服） ── */}
      <path
        d="M 56 210 C 56 168 74 146 110 146 C 146 146 164 168 164 210 Z"
        fill="#fdfcf7"
        stroke="#cfc9b4"
        strokeWidth="3"
      />
      {/* 作業服のオリーブの差し色（両肩） */}
      <path d="M 62 210 C 62 178 72 158 88 151 C 76 168 72 188 72 210 Z" fill="#5a6b46" />
      <path d="M 158 210 C 158 178 148 158 132 151 C 144 168 148 188 148 210 Z" fill="#5a6b46" />
      {/* 襟 */}
      <path d="M 96 148 L 110 162 L 124 148 L 118 144 L 110 152 L 102 144 Z" fill="#3f4d33" />
      {/* 胸ポケット＋オレンジのペン */}
      <rect x="126" y="172" width="20" height="16" rx="3" fill="#f4f0e2" stroke="#cfc9b4" strokeWidth="2" />
      <rect x="131" y="166" width="4" height="10" rx="2" fill="#c96b3f" />
      {/* ファスナー */}
      <line x1="110" y1="162" x2="110" y2="210" stroke="#d8d2c0" strokeWidth="3" />

      {/* ── 案内する腕（画面右へ差し出す） ── */}
      {pose === "point" ? (
        <g>
          <path
            d="M 150 162 C 168 154 184 142 196 128"
            fill="none"
            stroke="#fdfcf7"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 150 162 C 168 154 184 142 196 128"
            fill="none"
            stroke="#cfc9b4"
            strokeWidth="20"
            strokeLinecap="round"
            strokeOpacity="0.25"
          />
          {/* 手（指し示す） */}
          <circle cx="199" cy="124" r="11" fill="#f6d7ba" />
          <path d="M 204 116 L 216 106" stroke="#f6d7ba" strokeWidth="9" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          {/* 胸の前でグッと親指を立てる */}
          <path
            d="M 148 166 C 160 168 168 176 170 188"
            fill="none"
            stroke="#fdfcf7"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <circle cx="172" cy="192" r="12" fill="#f6d7ba" />
          <path d="M 172 182 L 172 170" stroke="#f6d7ba" strokeWidth="9" strokeLinecap="round" />
        </g>
      )}
      {/* 反対の腕（体側） */}
      <path
        d="M 70 164 C 60 176 56 190 56 204"
        fill="none"
        stroke="#fdfcf7"
        strokeWidth="19"
        strokeLinecap="round"
      />

      {/* ── 顔 ── */}
      <circle cx="110" cy="102" r="37" fill="#f6d7ba" />
      {/* 耳 */}
      <circle cx="72" cy="104" r="7" fill="#f6d7ba" />
      <circle cx="148" cy="104" r="7" fill="#f6d7ba" />
      {/* 前髪 */}
      <path
        d="M 76 92 C 78 76 92 66 110 66 C 128 66 142 76 144 92 C 132 86 124 84 110 84 C 96 84 88 86 76 92 Z"
        fill="#5a4632"
      />
      {/* にっこり目 */}
      <path d="M 90 102 Q 96 95 102 102" fill="none" stroke="#3a3a30" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 118 102 Q 124 95 130 102" fill="none" stroke="#3a3a30" strokeWidth="3.5" strokeLinecap="round" />
      {/* 眉 */}
      <path d="M 89 92 Q 96 88 103 92" fill="none" stroke="#5a4632" strokeWidth="3" strokeLinecap="round" />
      <path d="M 117 92 Q 124 88 131 92" fill="none" stroke="#5a4632" strokeWidth="3" strokeLinecap="round" />
      {/* ほっぺ */}
      <circle cx="86" cy="112" r="6" fill="#f0b49a" opacity="0.55" />
      <circle cx="134" cy="112" r="6" fill="#f0b49a" opacity="0.55" />
      {/* 笑顔の口 */}
      <path d="M 100 117 Q 110 127 120 117" fill="none" stroke="#3a3a30" strokeWidth="3.5" strokeLinecap="round" />

      {/* ── ヘルメット ── */}
      <path d="M 68 84 C 68 58 86 42 110 42 C 134 42 152 58 152 84 Z" fill="#ffffff" stroke="#d8d2c0" strokeWidth="3" />
      {/* 中央のオリーブライン */}
      <path d="M 104 43 L 104 84 L 116 84 L 116 43 C 114 42.6 112 42.4 110 42.4 C 108 42.4 106 42.6 104 43 Z" fill="#5a6b46" />
      {/* つば */}
      <rect x="58" y="82" width="104" height="12" rx="6" fill="#ffffff" stroke="#d8d2c0" strokeWidth="3" />
      {/* 家マーク */}
      <path d="M 110 56 L 118 63 L 116 63 L 116 70 L 104 70 L 104 63 L 102 63 Z" fill="#c96b3f" />
    </svg>
  );
}

// 顔だけのミニ版（FAQの回答者アイコンなどに使う）
export function CraftsmanFace({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="54 34 112 110" className={className} role="img" aria-label="職人スタッフの顔イラスト">
      {/* 顔 */}
      <circle cx="110" cy="102" r="37" fill="#f6d7ba" />
      <circle cx="72" cy="104" r="7" fill="#f6d7ba" />
      <circle cx="148" cy="104" r="7" fill="#f6d7ba" />
      <path
        d="M 76 92 C 78 76 92 66 110 66 C 128 66 142 76 144 92 C 132 86 124 84 110 84 C 96 84 88 86 76 92 Z"
        fill="#5a4632"
      />
      <path d="M 90 102 Q 96 95 102 102" fill="none" stroke="#3a3a30" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 118 102 Q 124 95 130 102" fill="none" stroke="#3a3a30" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="86" cy="112" r="6" fill="#f0b49a" opacity="0.55" />
      <circle cx="134" cy="112" r="6" fill="#f0b49a" opacity="0.55" />
      <path d="M 100 117 Q 110 127 120 117" fill="none" stroke="#3a3a30" strokeWidth="3.5" strokeLinecap="round" />
      {/* ヘルメット */}
      <path d="M 68 84 C 68 58 86 42 110 42 C 134 42 152 58 152 84 Z" fill="#ffffff" stroke="#d8d2c0" strokeWidth="3" />
      <path d="M 104 43 L 104 84 L 116 84 L 116 43 C 114 42.6 112 42.4 110 42.4 C 108 42.4 106 42.6 104 43 Z" fill="#5a6b46" />
      <rect x="58" y="82" width="104" height="12" rx="6" fill="#ffffff" stroke="#d8d2c0" strokeWidth="3" />
      <path d="M 110 56 L 118 63 L 116 63 L 116 70 L 104 70 L 104 63 L 102 63 Z" fill="#c96b3f" />
    </svg>
  );
}
