// 対応工事12種のミニイラスト（フラットなinline SVG）。
// LPの配色（オリーブ・テラコッタ・金茶・生成り）に揃えたやさしいタッチで描く。

const C = {
  ink: "#4a4a3f",
  olive: "#5a6b46",
  oliveSoft: "#8a9573",
  oliveDeep: "#3f4d33",
  terra: "#c96b3f",
  terraDeep: "#b0502f",
  gold: "#cdb98a",
  wood: "#b98d5f",
  woodDeep: "#9a7248",
  concrete: "#dcd8cc",
  concreteDeep: "#c9c4b4",
  cream: "#f0ebdc",
  white: "#ffffff",
  sky: "#edf0e8",
};

export type ServiceIllustKind =
  | "parking"
  | "carport"
  | "gate"
  | "approach"
  | "fence"
  | "grass"
  | "gravel"
  | "deck"
  | "terrace"
  | "block"
  | "planting"
  | "full";

// 共通の地面
function Ground() {
  return <rect x="0" y="72" width="140" height="18" fill={C.cream} />;
}

// 小さな車（正面向き）
function MiniCar({ x = 0, y = 0, scale = 1, color = C.oliveSoft }: { x?: number; y?: number; scale?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="0" y="10" width="44" height="16" rx="7" fill={color} />
      <path d="M 7 12 C 9 4 35 4 37 12 Z" fill={color} opacity="0.85" />
      <rect x="12" y="6" width="20" height="8" rx="3" fill={C.sky} />
      <circle cx="10" cy="27" r="5" fill={C.ink} />
      <circle cx="34" cy="27" r="5" fill={C.ink} />
      <circle cx="10" cy="27" r="2" fill={C.white} />
      <circle cx="34" cy="27" r="2" fill={C.white} />
    </g>
  );
}

// 小さな木
function MiniTree({ x = 0, y = 0, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="10" y="18" width="4" height="14" rx="2" fill={C.woodDeep} />
      <circle cx="12" cy="12" r="11" fill={C.oliveSoft} />
      <circle cx="6" cy="16" r="7" fill={C.olive} />
    </g>
  );
}

export default function ServiceIllust({ kind, className = "" }: { kind: ServiceIllustKind; className?: string }) {
  return (
    <svg viewBox="0 0 140 90" className={className} aria-hidden="true">
      {kind === "parking" && (
        <g>
          <Ground />
          <rect x="18" y="62" width="104" height="18" rx="3" fill={C.concrete} />
          <line x1="52" y1="62" x2="52" y2="80" stroke={C.white} strokeWidth="3" />
          <line x1="88" y1="62" x2="88" y2="80" stroke={C.white} strokeWidth="3" />
          <MiniCar x={48} y={34} />
        </g>
      )}

      {kind === "carport" && (
        <g>
          <Ground />
          <rect x="20" y="64" width="100" height="12" rx="3" fill={C.concrete} />
          <path d="M 16 26 L 124 26 L 118 16 L 22 16 Z" fill={C.oliveDeep} />
          <rect x="24" y="26" width="5" height="40" fill={C.ink} />
          <rect x="111" y="26" width="5" height="40" fill={C.ink} />
          <MiniCar x={48} y={34} color={C.gold} />
        </g>
      )}

      {kind === "gate" && (
        <g>
          <Ground />
          <rect x="52" y="22" width="26" height="52" rx="3" fill={C.cream} stroke={C.gold} strokeWidth="2" />
          <rect x="58" y="32" width="14" height="9" rx="2" fill={C.terraDeep} />
          <rect x="58" y="46" width="14" height="3" rx="1.5" fill={C.ink} opacity="0.6" />
          <circle cx="62" cy="58" r="2.5" fill={C.gold} />
          {/* 表札灯 */}
          <circle cx="65" cy="18" r="4" fill="#f2dc8d" stroke={C.gold} strokeWidth="1.5" />
          <MiniTree x={92} y={40} />
          <MiniTree x={22} y={48} scale={0.8} />
        </g>
      )}

      {kind === "approach" && (
        <g>
          <Ground />
          {/* 飛び石 */}
          <ellipse cx="34" cy="76" rx="16" ry="6" fill={C.concrete} />
          <ellipse cx="64" cy="66" rx="15" ry="5.5" fill={C.concreteDeep} />
          <ellipse cx="92" cy="56" rx="14" ry="5" fill={C.concrete} />
          {/* 玄関ドア */}
          <rect x="104" y="24" width="24" height="34" rx="3" fill={C.wood} />
          <circle cx="110" cy="42" r="2" fill={C.gold} />
          <MiniTree x={14} y={38} scale={0.9} />
          <circle cx="52" cy="80" r="2.5" fill={C.oliveSoft} />
          <circle cx="80" cy="72" r="2.5" fill={C.oliveSoft} />
        </g>
      )}

      {kind === "fence" && (
        <g>
          <Ground />
          {/* 基礎ブロック */}
          <rect x="16" y="68" width="108" height="10" rx="2" fill={C.concreteDeep} />
          {/* 支柱（地面まで） */}
          <rect x="26" y="24" width="5" height="46" fill={C.ink} />
          <rect x="68" y="24" width="5" height="46" fill={C.ink} />
          <rect x="110" y="24" width="5" height="46" fill={C.ink} />
          {/* 横板5枚（目隠しの高さ感） */}
          <rect x="16" y="26" width="108" height="6.5" rx="2" fill={C.wood} />
          <rect x="16" y="35" width="108" height="6.5" rx="2" fill={C.woodDeep} />
          <rect x="16" y="44" width="108" height="6.5" rx="2" fill={C.wood} />
          <rect x="16" y="53" width="108" height="6.5" rx="2" fill={C.woodDeep} />
          <rect x="16" y="62" width="108" height="6.5" rx="2" fill={C.wood} />
        </g>
      )}

      {kind === "grass" && (
        <g>
          <Ground />
          <ellipse cx="70" cy="76" rx="52" ry="12" fill="#9dbb7e" />
          <ellipse cx="70" cy="73" rx="52" ry="11" fill="#b3cc93" />
          {/* 芝の毛 */}
          <path d="M 34 68 l 3 -6 M 54 72 l 3 -6 M 76 68 l 3 -6 M 96 72 l 3 -6" stroke={C.olive} strokeWidth="2" strokeLinecap="round" />
          <MiniTree x={100} y={30} />
          {/* ボール */}
          <circle cx="42" cy="60" r="6" fill={C.terra} />
          <path d="M 36 60 a 6 6 0 0 0 12 0" fill={C.white} opacity="0.7" />
        </g>
      )}

      {kind === "gravel" && (
        <g>
          <Ground />
          <path d="M 16 78 L 30 52 L 110 52 L 124 78 Z" fill={C.cream} stroke={C.gold} strokeWidth="2" />
          {[
            [40, 62], [56, 58], [72, 64], [88, 58], [100, 66],
            [48, 70], [64, 72], [80, 70], [96, 74], [34, 72],
          ].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="4.5" ry="3.2" fill={i % 2 ? C.concreteDeep : C.concrete} />
          ))}
          <MiniTree x={112} y={34} scale={0.8} />
        </g>
      )}

      {kind === "deck" && (
        <g>
          <Ground />
          {/* 家の外壁と掃き出し窓 */}
          <rect x="16" y="14" width="70" height="44" fill={C.white} stroke={C.concreteDeep} strokeWidth="2" />
          <rect x="26" y="22" width="34" height="36" rx="2" fill={C.sky} stroke={C.concreteDeep} strokeWidth="2" />
          <line x1="43" y1="22" x2="43" y2="58" stroke={C.concreteDeep} strokeWidth="2" />
          {/* デッキ本体（板張り） */}
          <path d="M 16 58 L 118 58 L 126 70 L 16 70 Z" fill={C.wood} />
          <line x1="36" y1="58" x2="40" y2="70" stroke={C.woodDeep} strokeWidth="2" />
          <line x1="58" y1="58" x2="62" y2="70" stroke={C.woodDeep} strokeWidth="2" />
          <line x1="80" y1="58" x2="84" y2="70" stroke={C.woodDeep} strokeWidth="2" />
          <line x1="100" y1="58" x2="105" y2="70" stroke={C.woodDeep} strokeWidth="2" />
          {/* 束柱 */}
          <rect x="20" y="70" width="6" height="8" fill={C.woodDeep} />
          <rect x="114" y="70" width="6" height="8" fill={C.woodDeep} />
          {/* クッション */}
          <rect x="94" y="46" width="15" height="12" rx="4" fill={C.terra} />
          <MiniTree x={116} y={26} scale={0.85} />
        </g>
      )}

      {kind === "terrace" && (
        <g>
          <Ground />
          {/* タイル床 */}
          <path d="M 24 78 L 36 56 L 104 56 L 116 78 Z" fill={C.concrete} />
          <line x1="52" y1="56" x2="46" y2="78" stroke={C.white} strokeWidth="2" />
          <line x1="76" y1="56" x2="76" y2="78" stroke={C.white} strokeWidth="2" />
          <line x1="94" y1="56" x2="100" y2="78" stroke={C.white} strokeWidth="2" />
          {/* パラソル */}
          <path d="M 70 20 L 96 38 L 44 38 Z" fill={C.terra} />
          <path d="M 70 20 L 83 38 L 57 38 Z" fill="#e08b5d" />
          <line x1="70" y1="24" x2="70" y2="62" stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {kind === "block" && (
        <g>
          <Ground />
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={22 + col * 25 + (row % 2 ? 12 : 0)}
                y={40 + row * 13}
                width="23"
                height="11"
                rx="2"
                fill={row % 2 ? C.concrete : C.concreteDeep}
                stroke={C.white}
                strokeWidth="1.5"
              />
            ))
          )}
          <MiniTree x={4} y={30} scale={0.8} />
        </g>
      )}

      {kind === "planting" && (
        <g>
          <Ground />
          <MiniTree x={28} y={24} scale={1.4} />
          <MiniTree x={78} y={38} />
          {/* 低木 */}
          <circle cx="110" cy="68" r="9" fill={C.olive} />
          <circle cx="120" cy="70" r="7" fill={C.oliveSoft} />
          {/* 花 */}
          <circle cx="56" cy="72" r="3" fill={C.terra} />
          <circle cx="64" cy="76" r="3" fill="#e5c665" />
        </g>
      )}

      {kind === "full" && (
        <g>
          <Ground />
          {/* 家 */}
          <rect x="52" y="34" width="44" height="40" rx="2" fill={C.white} stroke={C.concreteDeep} strokeWidth="2" />
          <path d="M 48 36 L 74 18 L 100 36 Z" fill={C.oliveDeep} />
          <rect x="60" y="44" width="10" height="9" rx="1.5" fill={C.sky} stroke={C.concreteDeep} strokeWidth="1.5" />
          <rect x="80" y="52" width="10" height="22" rx="1.5" fill={C.wood} />
          {/* 門柱 */}
          <rect x="34" y="52" width="10" height="22" rx="2" fill={C.cream} stroke={C.gold} strokeWidth="1.5" />
          <rect x="36.5" y="56" width="5" height="4" rx="1" fill={C.terraDeep} />
          {/* フェンス */}
          <path d="M 104 58 h 28 M 104 66 h 28" stroke={C.wood} strokeWidth="3" />
          <path d="M 108 54 v 20 M 120 54 v 20 M 130 54 v 20" stroke={C.woodDeep} strokeWidth="2.5" />
          <MiniTree x={8} y={40} />
        </g>
      )}
    </svg>
  );
}
