/**
 * 採用レスキューLPの線画イラスト用パーツ。
 * すべてのシーン（scenes.tsx）はここの人物・小物を組み合わせて作るため、タッチが自動的にそろう。
 *
 * ルール
 * ・主線は濃いグレー（INK）、太さは STROKE で統一
 * ・アクセントはブルー系（ACCENT / ACCENT_LIGHT）のみ。塗りは最小限
 * ・人物はバストアップ。原点(0,0)は顔の中心。肩は y≈31、胴は y=112 まで（シーン側で机や枠で切る）
 */
import type { ReactNode } from "react";

export const INK = "#2b3140";
export const ACCENT = "#1659e0";
export const ACCENT_LIGHT = "#dce8ff";
export const ACCENT_PALE = "#eef4ff";
export const GRAY_LIGHT = "#eef1f6";
export const HAIR = "#353b4a";
export const STROKE = 2.4;

/** 線の共通属性 */
const line = {
  stroke: INK,
  strokeWidth: STROKE,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ═══════════════════════ シーンの外枠 ═══════════════════════ */

export type IllustrationProps = {
  className?: string;
  width?: number | string;
  height?: number | string;
  /** 指定すると読み上げ対象になる（未指定なら装飾扱い） */
  title?: string;
};

export function Svg({
  viewBox,
  className,
  width,
  height,
  title,
  children,
}: IllustrationProps & { viewBox: string; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

/* ═══════════════════════ 人物 ═══════════════════════ */

export type Outfit = "suit" | "nurse" | "driver" | "builder" | "pharmacist" | "casual" | "blouse";
export type Expression = "smile" | "happy" | "worry" | "think" | "neutral" | "surprise";
export type Hair = "short" | "side" | "long" | "bun" | "bob";
export type Pose =
  | "down"
  | "wave"
  | "point"
  | "chin"
  | "headHold"
  | "cheer"
  | "holdDoc"
  | "typing"
  | "crossed"
  | "thumbsUp"
  | "chest"
  | "present"
  | "phone"
  | "calc";

/** 太さのある腕（外側を主線色、内側を服の色で2回描いて輪郭付きの筒にする） */
function Tube({ d, color, w = 11 }: { d: string; color: string; w?: number }) {
  return (
    <>
      <path d={d} stroke={INK} strokeWidth={w + STROKE * 2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function Hand({ x, y, r = 6 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill="#fff" {...line} />;
}

const OUTFIT_COLOR: Record<Outfit, string> = {
  suit: "#e6ecf6",
  nurse: ACCENT_LIGHT,
  driver: "#fff",
  builder: "#fff",
  pharmacist: "#fff",
  casual: ACCENT_LIGHT,
  blouse: "#fff",
};

/** 腕の形（右腕＝画面右側）。hands は手の位置 */
const POSES: Record<Pose, { arms: string[]; hands: [number, number][]; seams?: boolean }> = {
  down: { arms: [], hands: [], seams: true },
  wave: { arms: ["M26 40 Q46 34 46 2"], hands: [[46, -4]], seams: false },
  point: { arms: ["M26 40 Q46 50 66 38"], hands: [[70, 36]] },
  chin: { arms: ["M24 42 C42 72 22 70 12 34"], hands: [[11, 27]] },
  headHold: {
    arms: ["M-24 40 C-46 34 -42 4 -22 -12", "M24 40 C46 34 42 4 22 -12"],
    hands: [
      [-20, -15],
      [20, -15],
    ],
  },
  cheer: {
    arms: ["M-25 40 Q-46 22 -42 -14", "M25 40 Q46 22 42 -14"],
    hands: [
      [-42, -20],
      [42, -20],
    ],
  },
  holdDoc: {
    arms: ["M-25 42 Q-32 70 -12 72", "M25 42 Q32 70 12 72"],
    hands: [
      [-12, 70],
      [12, 70],
    ],
  },
  typing: {
    arms: ["M-25 42 Q-30 74 -14 88", "M25 42 Q30 74 14 88"],
    hands: [
      [-14, 90],
      [14, 90],
    ],
  },
  crossed: {
    arms: ["M-25 42 Q-30 70 16 66", "M25 42 Q30 74 -16 70"],
    hands: [
      [18, 65],
      [-18, 69],
    ],
  },
  thumbsUp: { arms: ["M26 42 Q48 64 44 34"], hands: [[44, 28]], seams: false },
  chest: { arms: ["M25 42 Q32 70 6 60"], hands: [[3, 58]] },
  present: { arms: ["M26 42 Q44 66 60 50"], hands: [[64, 48]] },
  phone: { arms: ["M25 42 Q34 72 12 56"], hands: [[10, 52]] },
  calc: {
    arms: ["M-25 42 Q-30 74 -10 80", "M25 42 Q32 72 14 74"],
    hands: [
      [-10, 80],
      [14, 74],
    ],
  },
};

export function Person({
  x = 0,
  y = 0,
  scale = 1,
  flip = false,
  outfit = "suit",
  expr = "smile",
  hair = "short",
  pose = "down",
  children,
}: {
  x?: number;
  y?: number;
  scale?: number;
  flip?: boolean;
  outfit?: Outfit;
  expr?: Expression;
  hair?: Hair;
  pose?: Pose;
  /** 手元に持たせる小物など（人物の座標系で描く。腕より手前・手より奥に入る） */
  children?: ReactNode;
}) {
  const color = OUTFIT_COLOR[outfit];
  const p = POSES[pose];
  const longHair = hair === "long" || hair === "bob";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {/* 後ろ髪 */}
      {hair === "long" && <path d="M-17 -2 C-21 -22 21 -22 17 -2 L19 30 Q0 36 -19 30 Z" fill={HAIR} {...line} />}
      {hair === "bob" && <path d="M-17 -2 C-21 -22 21 -22 17 -2 L18 16 Q0 22 -18 16 Z" fill={HAIR} {...line} />}
      {hair === "bun" && <circle cx={0} cy={-20} r={7} fill={HAIR} {...line} />}

      {/* 首 */}
      <path d="M-6 12 L-6 33 L6 33 L6 12" fill="#fff" {...line} />

      {/* 胴体（下端は開いたまま。シーン側で切る） */}
      <path d="M-31 112 L-31 50 Q-31 34 -16 31 L16 31 Q31 34 31 50 L31 112" fill={color} {...line} />
      <Outfit outfit={outfit} />
      {p.seams && (
        <>
          <path d="M-22 58 L-22 112" {...line} />
          <path d="M22 58 L22 112" {...line} />
        </>
      )}

      {/* 腕 */}
      {p.arms.map((d) => (
        <Tube key={d} d={d} color={color} />
      ))}

      {children}

      {p.hands.map(([hx, hy]) => (
        <Hand key={`${hx},${hy}`} x={hx} y={hy} />
      ))}
      {pose === "thumbsUp" && <path d="M44 22 L44 16" stroke={INK} strokeWidth={STROKE + 1.4} strokeLinecap="round" />}

      {/* 頭 */}
      <ellipse cx={-15} cy={2} rx={3.2} ry={4.6} fill="#fff" {...line} />
      <ellipse cx={15} cy={2} rx={3.2} ry={4.6} fill="#fff" {...line} />
      <ellipse cx={0} cy={0} rx={15} ry={17} fill="#fff" {...line} />
      <Face expr={expr} />
      <FrontHair hair={hair} longHair={longHair} />
      {outfit === "driver" && (
        <g>
          <path d="M-16 -5 C-17 -24 17 -24 16 -5 Z" fill={ACCENT} {...line} />
          <path d="M-2 -6 L22 -5 Q25 -2 21 0 L-2 -2 Z" fill={ACCENT} {...line} />
        </g>
      )}
      {outfit === "builder" && (
        <g>
          <path d="M-18 -4 C-18 -28 18 -28 18 -4 Z" fill="#fff" {...line} />
          <path d="M-22 -4 L22 -4" stroke={INK} strokeWidth={STROKE + 0.6} strokeLinecap="round" />
          <path d="M0 -24 L0 -6" {...line} />
          <path d="M-14 -10 L14 -10" stroke={ACCENT} strokeWidth={3} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

function Outfit({ outfit }: { outfit: Outfit }) {
  switch (outfit) {
    case "suit":
      return (
        <g>
          <path d="M-10 31 L0 54 L10 31 Z" fill="#fff" {...line} />
          <path d="M-3 35 L3 35 L4.5 54 L0 60 L-4.5 54 Z" fill={ACCENT} {...line} />
          <path d="M-16 31 L-5 64" {...line} />
          <path d="M16 31 L5 64" {...line} />
          <circle cx={0} cy={78} r={1.8} fill={INK} />
        </g>
      );
    case "blouse":
      return (
        <g>
          <path d="M-12 31 Q0 46 12 31" fill="#fff" {...line} />
          <path d="M-16 31 L-6 62" {...line} />
          <path d="M16 31 L6 62" {...line} />
          <path d="M-6 62 L6 62" {...line} />
          <circle cx={0} cy={44} r={2.6} fill={ACCENT} />
        </g>
      );
    case "nurse":
      return (
        <g>
          <path d="M-10 31 L0 46 L10 31" {...line} />
          <path d="M-13 32 Q-17 54 -5 60" stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" />
          <path d="M13 32 Q17 54 5 60" stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" />
          <circle cx={0} cy={63} r={4.5} fill="#fff" stroke={ACCENT} strokeWidth={2.6} />
          <rect x={12} y={70} width={12} height={12} rx={2} {...line} />
        </g>
      );
    case "driver":
      return (
        <g>
          <path d="M-10 31 L-2 44 L-12 46 Z" fill="#fff" {...line} />
          <path d="M10 31 L2 44 L12 46 Z" fill="#fff" {...line} />
          <path d="M0 44 L0 62" {...line} />
          <circle cx={0} cy={50} r={1.6} fill={INK} />
          <circle cx={0} cy={57} r={1.6} fill={INK} />
          <rect x={-24} y={58} width={13} height={9} rx={2} fill={ACCENT_LIGHT} {...line} />
        </g>
      );
    case "builder":
      return (
        <g>
          <path d="M-12 31 L0 44 L12 31" {...line} />
          <path d="M-31 50 Q-31 34 -16 31 L-8 33 L-8 112 L-31 112 Z" fill={ACCENT_LIGHT} {...line} />
          <path d="M31 50 Q31 34 16 31 L8 33 L8 112 L31 112 Z" fill={ACCENT_LIGHT} {...line} />
          <path d="M-30 74 L-9 74" stroke={ACCENT} strokeWidth={4} />
          <path d="M9 74 L30 74" stroke={ACCENT} strokeWidth={4} />
          <path d="M-30 86 L-9 86" stroke={ACCENT} strokeWidth={4} />
          <path d="M9 86 L30 86" stroke={ACCENT} strokeWidth={4} />
        </g>
      );
    case "pharmacist":
      return (
        <g>
          <path d="M-10 31 L0 50 L10 31 Z" fill={ACCENT_LIGHT} {...line} />
          <path d="M-16 31 L-3 70" {...line} />
          <path d="M16 31 L3 70" {...line} />
          <path d="M-3 70 L-3 112" {...line} />
          <rect x={10} y={66} width={13} height={14} rx={2} {...line} />
          <path d="M13 60 L13 70" stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" />
          <rect x={-24} y={58} width={12} height={8} rx={1.5} fill={ACCENT} />
        </g>
      );
    case "casual":
      return <path d="M-11 31 Q0 42 11 31" {...line} />;
  }
}

function Face({ expr }: { expr: Expression }) {
  const eyesDot = (
    <>
      <circle cx={-6} cy={1} r={1.9} fill={INK} />
      <circle cx={6} cy={1} r={1.9} fill={INK} />
    </>
  );
  const eyesHappy = (
    <>
      <path d="M-9 2 Q-6 -2 -3 2" {...line} />
      <path d="M3 2 Q6 -2 9 2" {...line} />
    </>
  );
  switch (expr) {
    case "smile":
      return (
        <g>
          {eyesDot}
          <path d="M-5 8 Q0 12.5 5 8" {...line} />
        </g>
      );
    case "happy":
      return (
        <g>
          {eyesHappy}
          <path d="M-6 7 Q0 15 6 7 Z" fill="#fff" {...line} />
          <circle cx={-10} cy={7} r={2.4} fill={ACCENT_LIGHT} />
          <circle cx={10} cy={7} r={2.4} fill={ACCENT_LIGHT} />
        </g>
      );
    case "worry":
      return (
        <g>
          <path d="M-10 -4 L-3 -7" {...line} />
          <path d="M3 -7 L10 -4" {...line} />
          {eyesDot}
          <path d="M-4.5 11 Q0 7.5 4.5 11" {...line} />
        </g>
      );
    case "think":
      return (
        <g>
          <path d="M-10 -6 L-3 -5" {...line} />
          <path d="M3 -7 L10 -9" {...line} />
          {eyesDot}
          <path d="M-3 10 L4 9" {...line} />
        </g>
      );
    case "surprise":
      return (
        <g>
          <path d="M-10 -7 Q-6 -10 -3 -8" {...line} />
          <path d="M3 -8 Q6 -10 10 -7" {...line} />
          {eyesDot}
          <ellipse cx={0} cy={10} rx={2.6} ry={3.2} fill="#fff" {...line} />
        </g>
      );
    case "neutral":
    default:
      return (
        <g>
          {eyesDot}
          <path d="M-3.5 9.5 L3.5 9.5" {...line} />
        </g>
      );
  }
}

function FrontHair({ hair, longHair }: { hair: Hair; longHair: boolean }) {
  if (hair === "short")
    return <path d="M-16 1 C-19 -15 -8 -22 2 -21 C13 -21 19 -13 16 1 C14 -7 9 -11 3 -10 C-3 -13 -11 -9 -16 1 Z" fill={HAIR} {...line} />;
  if (hair === "side")
    return <path d="M-16 2 C-19 -16 -6 -22 4 -21 C14 -20 19 -12 16 2 C14 -8 6 -12 -4 -11 C-9 -10 -13 -6 -16 2 Z" fill={HAIR} {...line} />;
  // long / bob / bun（前髪）
  return (
    <path
      d={
        longHair
          ? "M-16 0 C-16 -18 16 -20 16 0 C11 -9 3 -10 -2 -7 C-7 -10 -13 -7 -16 0 Z"
          : "M-16 -1 C-15 -19 15 -20 16 -1 C11 -10 4 -11 0 -9 C-5 -12 -12 -8 -16 -1 Z"
      }
      fill={HAIR}
      {...line}
    />
  );
}

/* ═══════════════════════ 小物 ═══════════════════════ */

type At = { x: number; y: number; s?: number };

const at = ({ x, y, s = 1 }: At) => `translate(${x} ${y}) scale(${s})`;

/** 机の天板（シーンの下端を隠して人物をバストアップにする） */
export function Desk({ y, x1 = 0, x2 = 240 }: { y: number; x1?: number; x2?: number }) {
  return (
    <g>
      <rect x={x1} y={y} width={x2 - x1} height={400} fill="#fff" />
      <path d={`M${x1 + 6} ${y} L${x2 - 6} ${y}`} stroke={INK} strokeWidth={STROKE + 0.4} strokeLinecap="round" />
    </g>
  );
}

/** ノートPC（背面）。原点は天板中央 */
export function LaptopBack(p: At) {
  return (
    <g transform={at(p)}>
      <path d="M-30 0 L-26 -40 L26 -40 L30 0 Z" fill={GRAY_LIGHT} {...line} />
      <circle cx={0} cy={-20} r={4} fill={ACCENT_LIGHT} />
    </g>
  );
}

/** ノートPC（画面が見える向き）。content で画面の中身を描く */
export function LaptopFront({ content = "lp", ...p }: At & { content?: "lp" | "wire" | "blank" | "error" }) {
  return (
    <g transform={at(p)}>
      <rect x={-34} y={-46} width={68} height={44} rx={3} fill="#fff" {...line} />
      <path d="M-44 0 L44 0 L40 -2 L-40 -2 Z" fill={GRAY_LIGHT} {...line} />
      {content === "lp" && (
        <g>
          <rect x={-28} y={-40} width={56} height={12} rx={1.5} fill={ACCENT_LIGHT} />
          <path d="M-26 -22 L10 -22 M-26 -16 L18 -16" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
          <rect x={-12} y={-12} width={24} height={6} rx={3} fill={ACCENT} />
        </g>
      )}
      {content === "wire" && (
        <g stroke={ACCENT} strokeWidth={1.8} strokeLinecap="round">
          <rect x={-28} y={-40} width={24} height={16} rx={1.5} strokeDasharray="3 3" />
          <path d="M2 -38 L26 -38 M2 -32 L22 -32 M2 -26 L18 -26 M-28 -16 L26 -16 M-28 -10 L14 -10" />
        </g>
      )}
      {content === "error" && (
        <g>
          <path d="M-20 -32 L20 -32 M-20 -24 L10 -24" stroke={GRAY_LIGHT} strokeWidth={3} strokeLinecap="round" />
          <text x={0} y={-8} textAnchor="middle" fontSize={16} fontWeight={900} fill={ACCENT}>
            ?
          </text>
        </g>
      )}
    </g>
  );
}

/** 書類（クリップボード）。原点は中央 */
export function Clipboard({ check = false, ...p }: At & { check?: boolean }) {
  return (
    <g transform={at(p)}>
      <rect x={-16} y={-20} width={32} height={40} rx={3} fill="#fff" {...line} />
      <rect x={-7} y={-24} width={14} height={7} rx={2} fill={ACCENT} {...line} />
      <path d="M-9 -6 L9 -6 M-9 2 L9 2 M-9 10 L3 10" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      {check && <path d="M-11 -7 L-8 -4 L-3 -10" stroke={ACCENT} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />}
    </g>
  );
}

/** 吹き出し。原点は本体の中央。tail は尻尾の向き */
export function Bubble({
  w = 40,
  h = 28,
  tail = "bl",
  children,
  fill = "#fff",
  ...p
}: At & { w?: number; h?: number; tail?: "bl" | "br"; children?: ReactNode; fill?: string }) {
  const tx = tail === "bl" ? -w / 2 + 8 : w / 2 - 8;
  const dir = tail === "bl" ? -1 : 1;
  return (
    <g transform={at(p)}>
      <path
        d={`M${tx - 4 * dir} ${h / 2 - 1} L${tx + 6 * dir} ${h / 2 + 10} L${tx + 8 * dir} ${h / 2 - 1}`}
        fill={fill}
        {...line}
      />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.4} fill={fill} {...line} />
      <path d={`M${tx - 3 * dir} ${h / 2 - 1.2} L${tx + 7 * dir} ${h / 2 - 1.2}`} stroke={fill} strokeWidth={STROKE + 0.6} />
      {children}
    </g>
  );
}

/** 吹き出しの中の点々（会話中） */
export function Dots({ color = ACCENT }: { color?: string }) {
  return (
    <g fill={color}>
      <circle cx={-8} cy={0} r={2.6} />
      <circle cx={0} cy={0} r={2.6} />
      <circle cx={8} cy={0} r={2.6} />
    </g>
  );
}

export function Mark({ x, y, children, size = 22, color = ACCENT }: { x: number; y: number; children: string; size?: number; color?: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight={900} fill={color} fontFamily="inherit">
      {children}
    </text>
  );
}

/** 汗（焦り・困り） */
export function Sweat(p: At) {
  return (
    <path
      transform={at(p)}
      d="M0 -7 C4 -1 5 2 5 4 A5 5 0 0 1 -5 4 C-5 2 -4 -1 0 -7 Z"
      fill={ACCENT_LIGHT}
      stroke={ACCENT}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  );
}

/** キラキラ（成功・喜び） */
export function Sparkle(p: At) {
  return <path transform={at(p)} d="M0 -8 Q1 -1 8 0 Q1 1 0 8 Q-1 1 -8 0 Q-1 -1 0 -8 Z" fill={ACCENT} />;
}

/** 困りの渦・もやもや線 */
export function Gloom(p: At) {
  return (
    <path
      transform={at(p)}
      d="M-8 0 C-8 -6 0 -8 2 -3 C3 -8 10 -6 9 0 C14 0 13 7 7 7 L-6 7 C-12 7 -12 0 -8 0 Z"
      fill={GRAY_LIGHT}
      {...line}
    />
  );
}

/** 上向きの棒グラフ＋矢印。原点は左下 */
export function BarChart({ rising = true, ...p }: At & { rising?: boolean }) {
  const hs = rising ? [16, 26, 38, 54] : [40, 30, 22, 14];
  return (
    <g transform={at(p)}>
      <path d="M0 -64 L0 0 L76 0" {...line} />
      {hs.map((h, i) => (
        <rect key={i} x={8 + i * 17} y={-h} width={11} height={h} rx={1.5} fill={i === 3 && rising ? ACCENT : ACCENT_LIGHT} {...line} />
      ))}
      {rising ? (
        <path d="M6 -26 L28 -36 L44 -32 L70 -62 M60 -62 L70 -62 L70 -52" stroke={ACCENT} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M6 -50 L30 -40 L48 -30 L70 -18 M62 -14 L70 -18 L66 -26" stroke={INK} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" />
      )}
    </g>
  );
}

/** ホワイトボード（イーゼル）。中にグラフを置く */
export function Board({ children, w = 96, h = 76, ...p }: At & { children?: ReactNode; w?: number; h?: number }) {
  return (
    <g transform={at(p)}>
      <path d={`M${w * 0.2} ${h} L${w * 0.12} ${h + 22} M${w * 0.8} ${h} L${w * 0.88} ${h + 22}`} {...line} />
      <rect x={0} y={0} width={w} height={h} rx={4} fill="#fff" {...line} />
      {children}
    </g>
  );
}

/** 電卓 */
export function Calculator(p: At) {
  return (
    <g transform={at(p)}>
      <rect x={-13} y={-18} width={26} height={36} rx={3} fill="#fff" {...line} />
      <rect x={-8} y={-13} width={16} height={8} rx={1} fill={ACCENT_LIGHT} {...line} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={-6 + c * 6} cy={1 + r * 6} r={1.6} fill={INK} />),
      )}
    </g>
  );
}

/** コイン（¥） */
export function Coin(p: At) {
  return (
    <g transform={at(p)}>
      <circle r={9} fill={ACCENT_LIGHT} {...line} />
      <text y={4.5} textAnchor="middle" fontSize={12} fontWeight={900} fill={ACCENT} fontFamily="inherit">
        ¥
      </text>
    </g>
  );
}

/** 応募者アイコン（人型） */
export function Applicant({ filled = true, ...p }: At & { filled?: boolean }) {
  return (
    <g transform={at(p)}>
      <circle cx={0} cy={-6} r={5} fill={filled ? ACCENT : "#fff"} stroke={filled ? ACCENT : INK} strokeWidth={STROKE} />
      <path d="M-9 9 Q-9 0 0 0 Q9 0 9 9 Z" fill={filled ? ACCENT : "#fff"} stroke={filled ? ACCENT : INK} strokeWidth={STROKE} strokeLinejoin="round" />
    </g>
  );
}

/** スマホ（LP表示） */
export function Phone({ content = "lp", ...p }: At & { content?: "lp" | "msg" }) {
  return (
    <g transform={at(p)}>
      <rect x={-14} y={-26} width={28} height={52} rx={5} fill="#fff" {...line} />
      {content === "lp" ? (
        <g>
          <rect x={-9} y={-19} width={18} height={10} rx={1.5} fill={ACCENT_LIGHT} />
          <path d="M-8 -3 L8 -3 M-8 3 L4 3" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
          <rect x={-8} y={10} width={16} height={6} rx={3} fill={ACCENT} />
        </g>
      ) : (
        <g>
          <rect x={-9} y={-16} width={14} height={8} rx={3} fill={GRAY_LIGHT} />
          <rect x={-5} y={-4} width={14} height={8} rx={3} fill={ACCENT} />
          <rect x={-9} y={8} width={12} height={8} rx={3} fill={GRAY_LIGHT} />
        </g>
      )}
    </g>
  );
}

/** 盾＋チェック（保証・安心） */
export function Shield(p: At) {
  return (
    <g transform={at(p)}>
      <path d="M0 -20 L-16 -13 L-16 0 C-16 11 -8 18 0 21 C8 18 16 11 16 0 L16 -13 Z" fill={ACCENT_LIGHT} {...line} />
      <path d="M-7 0 L-2 6 L8 -6" stroke={ACCENT} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** 丸チェック */
export function CheckBadge(p: At) {
  return (
    <g transform={at(p)}>
      <circle r={10} fill={ACCENT} />
      <path d="M-5 0 L-1.5 4 L5.5 -4" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** バツ印（ミスマッチ） */
export function Cross(p: At) {
  return (
    <g transform={at(p)}>
      <circle r={10} fill="#fff" {...line} />
      <path d="M-4.5 -4.5 L4.5 4.5 M4.5 -4.5 L-4.5 4.5" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
    </g>
  );
}

/** 時計（忙しさ） */
export function Clock(p: At) {
  return (
    <g transform={at(p)}>
      <circle r={13} fill="#fff" {...line} />
      <path d="M0 -7 L0 0 L6 4" stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** 書類の山 */
export function PaperStack(p: At) {
  return (
    <g transform={at(p)}>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-18 + (i % 2) * 3} y={-8 - i * 7} width={36} height={8} rx={1.5} fill="#fff" {...line} />
      ))}
    </g>
  );
}

/** 求人カード（比較用）。label は A / B など */
export function JobCard({ label, highlight = false, ...p }: At & { label: string; highlight?: boolean }) {
  return (
    <g transform={at(p)}>
      <rect x={-20} y={-26} width={40} height={52} rx={4} fill={highlight ? ACCENT_PALE : "#fff"} stroke={highlight ? ACCENT : INK} strokeWidth={STROKE} />
      <text y={-9} textAnchor="middle" fontSize={13} fontWeight={900} fill={highlight ? ACCENT : INK} fontFamily="inherit">
        {label}
      </text>
      <path d="M-12 2 L12 2 M-12 9 L12 9 M-12 16 L4 16" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

/** 封筒（メッセージ送信） */
export function Envelope(p: At) {
  return (
    <g transform={at(p)}>
      <rect x={-16} y={-11} width={32} height={22} rx={2.5} fill="#fff" {...line} />
      <path d="M-15 -9 L0 3 L15 -9" {...line} />
    </g>
  );
}

/** 点線の軌跡 */
export function DashPath({ d, color = ACCENT }: { d: string; color?: string }) {
  return <path d={d} stroke={color} strokeWidth={2} strokeLinecap="round" strokeDasharray="2 6" />;
}

/** 背景の淡い円（人物の後ろに敷く） */
export function Backdrop({ cx, cy, r, color = ACCENT_PALE }: { cx: number; cy: number; r: number; color?: string }) {
  return <circle cx={cx} cy={cy} r={r} fill={color} />;
}

