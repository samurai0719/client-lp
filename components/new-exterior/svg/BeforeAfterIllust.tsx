// シミュレーター導入用：「更地 → 新築＋外構完成」のビフォーアフターイラスト。
const C = {
  ink: "#4a4a3f",
  olive: "#5a6b46",
  oliveSoft: "#8a9573",
  oliveDeep: "#3f4d33",
  terra: "#c96b3f",
  gold: "#cdb98a",
  wood: "#b98d5f",
  concrete: "#dcd8cc",
  cream: "#f0ebdc",
  dirt: "#e0d5bc",
  white: "#ffffff",
  sky: "#edf0e8",
};

export default function BeforeAfterIllust({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 340 130"
      className={className}
      role="img"
      aria-label="更地の写真から、新築住宅と外構の完成イメージを生成するイラスト"
    >
      {/* ── Before：更地 ── */}
      <g>
        <rect x="4" y="8" width="140" height="106" rx="10" fill={C.white} stroke={C.gold} strokeWidth="2" />
        <rect x="12" y="16" width="124" height="76" rx="6" fill={C.sky} />
        {/* 地面（土） */}
        <path d="M 12 62 L 136 62 L 136 92 L 12 92 Z" fill={C.dirt} />
        <ellipse cx="40" cy="74" rx="10" ry="3" fill="#d0c2a2" />
        <ellipse cx="96" cy="82" rx="12" ry="3.5" fill="#d0c2a2" />
        {/* 草 */}
        <path d="M 28 62 l 2 -6 M 32 62 l 2 -5 M 116 62 l 2 -6 M 120 62 l 2 -5" stroke={C.oliveSoft} strokeWidth="2" strokeLinecap="round" />
        {/* 売地の札 */}
        <rect x="62" y="40" width="26" height="14" rx="2" fill={C.white} stroke={C.oliveSoft} strokeWidth="1.5" />
        <line x1="75" y1="54" x2="75" y2="62" stroke={C.wood} strokeWidth="3" />
        <line x1="67" y1="47" x2="83" y2="47" stroke={C.oliveSoft} strokeWidth="2" strokeLinecap="round" />
        <text x="74" y="106" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill={C.ink}>
          更地・建築中でもOK
        </text>
      </g>

      {/* ── 矢印＋キラキラ ── */}
      <g>
        <path d="M 152 60 L 182 60" stroke={C.terra} strokeWidth="5" strokeLinecap="round" />
        <path d="M 176 51 L 186 60 L 176 69" fill="none" stroke={C.terra} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 166 36 l 1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6 Z" fill={C.gold} />
        <path d="M 170 82 l 1.4 3.4 3.4 1.4 -3.4 1.4 -1.4 3.4 -1.4 -3.4 -3.4 -1.4 3.4 -1.4 Z" fill={C.terra} />
      </g>

      {/* ── After：新築＋外構 ── */}
      <g>
        <rect x="196" y="8" width="140" height="106" rx="10" fill={C.white} stroke={C.olive} strokeWidth="2.5" />
        <rect x="204" y="16" width="124" height="76" rx="6" fill={C.sky} />
        {/* 家 */}
        <rect x="252" y="40" width="44" height="36" rx="2" fill={C.white} stroke={C.concrete} strokeWidth="2" />
        <path d="M 248 42 L 274 24 L 300 42 Z" fill={C.oliveDeep} />
        <rect x="260" y="48" width="10" height="9" rx="1.5" fill={C.sky} stroke={C.concrete} strokeWidth="1.5" />
        <rect x="280" y="54" width="10" height="22" rx="1.5" fill={C.wood} />
        {/* 駐車場コンクリート */}
        <path d="M 208 76 L 244 76 L 240 92 L 204 92 Z" fill={C.concrete} />
        {/* 門柱 */}
        <rect x="240" y="58" width="9" height="18" rx="2" fill={C.cream} stroke={C.gold} strokeWidth="1.5" />
        <rect x="242" y="62" width="5" height="4" rx="1" fill={C.terra} />
        {/* フェンス */}
        <path d="M 302 62 h 24 M 302 70 h 24" stroke={C.wood} strokeWidth="2.5" />
        <path d="M 306 58 v 18 M 316 58 v 18 M 324 58 v 18" stroke="#9a7248" strokeWidth="2" />
        {/* 木・芝 */}
        <circle cx="222" cy="58" r="9" fill={C.oliveSoft} />
        <circle cx="216" cy="62" r="6" fill={C.olive} />
        <rect x="220" y="64" width="3.5" height="10" rx="1.5" fill="#9a7248" />
        <ellipse cx="300" cy="88" rx="24" ry="5" fill="#b3cc93" />
        <text x="266" y="106" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill={C.oliveDeep}>
          完成イメージを確認
        </text>
      </g>
    </svg>
  );
}
