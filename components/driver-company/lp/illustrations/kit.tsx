/**
 * ドラテク企業向けLPの線画イラスト用パーツ。
 *
 * 採用レスキューの描き下ろしSVG（components/saiyo-rescue/illustrations/problems.tsx）と
 * 同じ線幅・顔のパーツ体系・配色ルールで描き、運送業向けの人物（ドライバー・運送会社の社長・
 * 配車／採用担当）と小物（大型トラック・求人票・スマホ・配車表）を足している。
 * 採用レスキュー側を変更してもこちらに影響しないよう、パーツは独立して持つ。
 *
 * 統一ルール
 * ・線：SW=2.4 / 色 INK / 角丸
 * ・配色：白・淡い水色・薄いグレーが基本。服や小物の一部だけブルー、
 *   「0円」など料金の要点だけイエロー（YELLOW）
 * ・人物：原点＝首の付け根。頭は Head を y=-25 に置く。胴は y=120 まで描き、枠や机で切る
 */
import type { ReactNode } from "react";

export const INK = "#2b3140";
export const ACCENT = "#1659e0";
export const ACCENT_LIGHT = "#dce8ff";
export const ACCENT_PALE = "#eef4ff";
export const GRAY_LIGHT = "#eef1f6";
export const NAVY = "#0a1f4e";
export const YELLOW = "#ffc400";
export const YELLOW_PALE = "#fff3c4";
export const SW = 2.4;

const HAIR = "#2f3546";
const HAIR_GRAY = "#c3cad7";
const SKIN = "#fff";

export const L = { stroke: INK, strokeWidth: SW, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/* ═══════════════════════ 外枠 ═══════════════════════ */

export type IllustrationProps = {
  className?: string;
  /** 指定すると読み上げ対象になる（未指定なら装飾扱い） */
  title?: string;
};

export function Svg({
  viewBox = "0 0 240 180",
  className,
  title,
  children,
}: IllustrationProps & { viewBox?: string; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
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

/* ═══════════════════════ 顔 ═══════════════════════ */

export type HairStyle = "tidy" | "part" | "owner" | "bob" | "bun" | "messy" | "buzz";
type Brow = "flat" | "worry" | "raised" | "think" | "angry";
type Eye = "dot" | "wide" | "squeeze" | "happy";
type Mouth = "smile" | "grin" | "frown" | "wavy" | "flat" | "o" | "side" | "open";

const HAIR_BACK: Partial<Record<HairStyle, ReactNode>> = {
  bob: <path d="M-17 -8 C-20 -27 20 -27 17 -8 L19 12 C12 17 -12 17 -19 12 Z" fill={HAIR} {...L} />,
  bun: <circle cx={4} cy={-26} r={7.5} fill={HAIR} {...L} />,
};

const HAIR_FRONT: Record<HairStyle, ReactNode> = {
  tidy: (
    <path
      d="M-15 -3 C-17 -18 -8 -26 2 -25 C12 -24 17 -17 15 -3 C14 -10 11 -14 6 -15 C1 -12 -7 -12 -11 -15 C-13 -11 -14 -7 -15 -3 Z"
      fill={HAIR}
      {...L}
    />
  ),
  part: (
    <g>
      <path
        d="M-15 -1 C-18 -19 -5 -27 5 -25 C14 -23 18 -14 15 -1 C14 -9 11 -14 7 -16 C2 -13 -6 -14 -9 -17 C-12 -12 -14 -7 -15 -1 Z"
        fill={HAIR}
        {...L}
      />
      <path d="M-1 -24 Q-4 -20 -8 -17" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" />
    </g>
  ),
  /** 白髪まじりの社長 */
  owner: (
    <g fill={HAIR_GRAY}>
      <path d="M-15 3 C-17 -9 -14 -17 -8 -20 C-10 -14 -12 -8 -13 -2 Z" {...L} />
      <path d="M15 3 C17 -9 14 -17 8 -20 C10 -14 12 -8 13 -2 Z" {...L} />
      <path d="M-8 -20 C-3 -24 3 -24 8 -20 C3 -21 -3 -21 -8 -20 Z" {...L} />
    </g>
  ),
  bob: (
    <path d="M-15 -2 C-16 -19 -6 -25 1 -25 C10 -25 17 -18 15 -2 C11 -7 4 -12 -3 -13 C-7 -9 -11 -5 -15 -2 Z" fill={HAIR} {...L} />
  ),
  bun: (
    <path d="M-15 -2 C-16 -19 -7 -25 0 -25 C7 -25 16 -19 15 -2 C13 -11 6 -16 0 -16 C-6 -16 -13 -11 -15 -2 Z" fill={HAIR} {...L} />
  ),
  messy: (
    <path
      d="M-15 -2 C-18 -16 -10 -27 0 -25 C3 -28 9 -27 11 -23 C17 -20 18 -10 15 -2 C13 -8 10 -12 7 -13 L5 -10 L2 -14 L-2 -10 L-5 -14 C-9 -12 -13 -8 -15 -2 Z"
      fill={HAIR}
      {...L}
    />
  ),
  /** 短髪（帽子の下からのぞく程度） */
  buzz: <path d="M-14 -2 C-15 -12 -12 -18 -6 -20 L6 -20 C12 -18 15 -12 14 -2 C12 -8 6 -11 0 -11 C-6 -11 -12 -8 -14 -2 Z" fill={HAIR} {...L} />,
};

const BROWS: Record<Brow, string> = {
  flat: "M-9 -6 L-3.5 -6 M3.5 -6 L9 -6",
  worry: "M-9.5 -4 L-3 -7.5 M3 -7.5 L9.5 -4",
  raised: "M-9 -7 Q-6 -10 -3 -8 M3 -8 Q6 -10 9 -7",
  think: "M-9 -6 L-3.5 -6 M3.5 -8.5 L9 -10",
  angry: "M-9.5 -8 L-3 -5 M3 -5 L9.5 -8",
};

const MOUTHS: Record<Mouth, ReactNode> = {
  smile: <path d="M-4.5 10.5 Q0 14.5 4.5 10.5" {...L} />,
  grin: <path d="M-6 9.5 Q0 17 6 9.5 Z" fill="#fff" {...L} />,
  frown: <path d="M-4 13 Q0 9.5 4 13" {...L} />,
  wavy: <path d="M-5 12 Q-2.5 10 0 12 Q2.5 14 5 12" {...L} />,
  flat: <path d="M-3 12 L3 12" {...L} />,
  side: <path d="M-1.5 12.5 Q2 10.5 5 11.5" {...L} />,
  o: <ellipse cx={0} cy={12} rx={2.2} ry={2.8} fill="#fff" {...L} />,
  open: <path d="M-4.5 10 Q0 9 4.5 10 Q4 16 0 16 Q-4 16 -4.5 10 Z" fill="#fff" {...L} />,
};

function Eyes({ eye, look }: { eye: Eye; look: [number, number] }) {
  const [lx, ly] = look;
  if (eye === "squeeze") return <path d="M-8.5 -1 L-4 1 L-8.5 3 M8.5 -1 L4 1 L8.5 3" {...L} />;
  if (eye === "happy") return <path d="M-8.5 2 Q-5.5 -2 -2.5 2 M2.5 2 Q5.5 -2 8.5 2" {...L} />;
  if (eye === "wide")
    return (
      <g>
        <circle cx={-5.5} cy={1} r={3.2} fill="#fff" {...L} />
        <circle cx={5.5} cy={1} r={3.2} fill="#fff" {...L} />
        <circle cx={-5.5 + lx} cy={1 + ly} r={1.5} fill={INK} />
        <circle cx={5.5 + lx} cy={1 + ly} r={1.5} fill={INK} />
      </g>
    );
  return (
    <g fill={INK}>
      <ellipse cx={-5.5 + lx} cy={1 + ly} rx={1.9} ry={2.3} />
      <ellipse cx={5.5 + lx} cy={1 + ly} rx={1.9} ry={2.3} />
    </g>
  );
}

export function Head({
  x = 0,
  y = -25,
  r = 0,
  s = 1,
  hair,
  brow = "flat",
  eye = "dot",
  mouth = "smile",
  look = [0, 0],
  glasses = false,
  blush = false,
  cap = false,
}: {
  x?: number;
  y?: number;
  r?: number;
  s?: number;
  hair: HairStyle;
  brow?: Brow;
  eye?: Eye;
  mouth?: Mouth;
  look?: [number, number];
  glasses?: boolean;
  blush?: boolean;
  /** ドライバーの作業帽 */
  cap?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      {HAIR_BACK[hair]}
      <path d="M-6 12 L-6 27 L6 27 L6 12" fill={SKIN} {...L} />
      <ellipse cx={-14} cy={1} rx={3.2} ry={4.6} fill={SKIN} {...L} />
      <ellipse cx={14} cy={1} rx={3.2} ry={4.6} fill={SKIN} {...L} />
      <path d="M-14 -4 C-14 -19 -7 -22 0 -22 C7 -22 14 -19 14 -4 C14 8 8 18 0 18 C-8 18 -14 8 -14 -4 Z" fill={SKIN} {...L} />
      {blush && (
        <g fill={ACCENT_LIGHT}>
          <ellipse cx={-9} cy={7} rx={3} ry={1.8} />
          <ellipse cx={9} cy={7} rx={3} ry={1.8} />
        </g>
      )}
      <path d={BROWS[brow]} {...L} />
      <Eyes eye={eye} look={look} />
      <path d="M0.2 3 Q2 6.5 -0.8 7.2" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      {MOUTHS[mouth]}
      {!cap && HAIR_FRONT[hair]}
      {cap && (
        <g>
          <path d="M-15.5 -6 C-17 -27 17 -27 15.5 -6 Z" fill={NAVY} {...L} />
          <path d="M-15.5 -6 L15.5 -6" {...L} />
          <path d="M-4 -7 L21 -7.5 Q25.5 -4.5 20.5 -2.5 L-4 -3 Z" fill={NAVY} {...L} />
          <rect x={-5} y={-19} width={10} height={6} rx={1.5} fill={YELLOW} />
        </g>
      )}
      {glasses && (
        <g>
          <rect x={-10.5} y={-3} width={9.5} height={7.5} rx={2.5} fill="none" {...L} strokeWidth={1.8} />
          <rect x={1} y={-3} width={9.5} height={7.5} rx={2.5} fill="none" {...L} strokeWidth={1.8} />
          <path d="M-1 0 L1 0" {...L} strokeWidth={1.8} />
        </g>
      )}
    </g>
  );
}

/* ═══════════════════════ 体・腕・手 ═══════════════════════ */

const TORSO = "M-30 120 L-30 16 Q-30 0 -14 -2 L14 -2 Q30 0 30 16 L30 120";

/**
 * suit：採用担当（スーツ） / ownerSuit：運送会社の社長 / work：ドライバーの作業着 /
 * shirt：配車・事務担当 / tee・hoodie：求職中のドライバー（私服）
 */
export type Outfit = "suit" | "ownerSuit" | "work" | "shirt" | "tee" | "hoodie";

export const OUTFIT_FILL: Record<Outfit, string> = {
  suit: "#e4eaf5",
  ownerSuit: "#d5deee",
  work: "#c9d8f5",
  shirt: "#fff",
  tee: GRAY_LIGHT,
  hoodie: ACCENT_LIGHT,
};

export function Body({ outfit }: { outfit: Outfit }) {
  const fill = OUTFIT_FILL[outfit];
  return (
    <g>
      {outfit === "hoodie" && <path d="M-18 -4 Q0 16 18 -4 Q10 -8 0 -6 Q-10 -8 -18 -4 Z" fill={ACCENT_LIGHT} {...L} />}
      <path d={TORSO} fill={fill} {...L} />
      {(outfit === "suit" || outfit === "ownerSuit") && (
        <g>
          <path d="M-10 -2 L0 24 L10 -2 Z" fill="#fff" {...L} />
          <path d="M-3 3 L3 3 L4.5 22 L0 28 L-4.5 22 Z" fill={outfit === "ownerSuit" ? NAVY : ACCENT} {...L} />
          <path d="M-14 -2 L-3 32 M14 -2 L3 32" {...L} />
          <path d="M15 48 L24 48" {...L} />
          <circle cx={0} cy={42} r={1.8} fill={INK} />
          <circle cx={0} cy={54} r={1.8} fill={INK} />
        </g>
      )}
      {outfit === "work" && (
        <g>
          {/* 襟・ファスナー・胸ポケット・反射テープ */}
          <path d="M-12 -2 L-3 10 L-14 12 Z" fill="#fff" {...L} />
          <path d="M12 -2 L3 10 L14 12 Z" fill="#fff" {...L} />
          <path d="M0 8 L0 120" {...L} strokeWidth={1.8} />
          <rect x={-24} y={22} width={14} height={11} rx={2} fill="#fff" {...L} strokeWidth={1.8} />
          <path d="M-29 64 L-2 64 M2 64 L29 64" stroke={YELLOW} strokeWidth={4.5} />
        </g>
      )}
      {outfit === "shirt" && (
        <g>
          <path d="M-9 -2 L0 12 L9 -2" {...L} />
          <path d="M-9 -2 L-13 8 L-3 6 M9 -2 L13 8 L3 6" fill="#fff" {...L} />
          <path d="M0 12 L0 120" {...L} strokeWidth={1.6} />
          <rect x={-22} y={22} width={12} height={10} rx={1.5} fill={ACCENT_LIGHT} {...L} strokeWidth={1.8} />
        </g>
      )}
      {outfit === "hoodie" && (
        <g>
          <path d="M-5 6 L-6 24 M5 6 L6 24" {...L} />
          <path d="M-17 76 Q0 68 17 76" {...L} />
        </g>
      )}
      {outfit === "tee" && <path d="M-9 -2 Q0 7 9 -2" {...L} />}
    </g>
  );
}

/** 腕（輪郭付きの太い線）。色は服に合わせる */
export function Arm({ d, outfit, w = 12 }: { d: string; outfit: Outfit; w?: number }) {
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={w + SW * 2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={OUTFIT_FILL[outfit]} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** 手（握り）。r で向きを変える */
export function Hand({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M-6 -3 C-6 -8.5 6 -8.5 6 -3 L6 3 C6 7.5 -6 7.5 -6 3 Z" fill={SKIN} {...L} />
      <path d="M-2 -6.5 L-2 -1.5 M2 -6.5 L2 -1.5" stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
      <path d="M-6 0 C-9.5 0 -9.5 5 -5.5 4.5" fill={SKIN} {...L} />
    </g>
  );
}

/** 親指を立てた手 */
export function ThumbUp({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-7 -2 L-7 9 Q-7 11 -5 11 L5 11 Q8 11 8 7 L8 -1 Q8 -4 4 -4 L1 -4 L2 -11 Q2 -14 -1 -13 L-7 -2 Z" fill={SKIN} {...L} />
      <path d="M-1 2 L7 2 M-1 6 L7 6" stroke={INK} strokeWidth={1.3} strokeLinecap="round" />
    </g>
  );
}

/* ═══════════════════════ 記号・背景 ═══════════════════════ */

export function Txt({
  x,
  y,
  size = 10,
  color = INK,
  weight = 900,
  anchor = "middle",
  children,
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
  weight?: number;
  anchor?: "start" | "middle" | "end";
  children: ReactNode;
}) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={weight} fill={color} textAnchor={anchor} fontFamily="inherit">
      {children}
    </text>
  );
}

export function Sweat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -7 C4 -1 5 2 5 4 A5 5 0 0 1 -5 4 C-5 2 -4 -1 0 -7 Z"
      fill={ACCENT_LIGHT}
      stroke={ACCENT}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  );
}

export function Sparkle({ x, y, s = 1, color = YELLOW }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 -9 Q1.2 -1.2 9 0 Q1.2 1.2 0 9 Q-1.2 1.2 -9 0 Q-1.2 -1.2 0 -9 Z"
      fill={color}
      stroke={INK}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  );
}

export function Coin({ x, y, s = 1, gold = false }: { x: number; y: number; s?: number; gold?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={10} fill={gold ? YELLOW : ACCENT_LIGHT} {...L} />
      <circle r={6.5} fill="none" stroke={gold ? "#b98000" : ACCENT} strokeWidth={1.4} />
      <Txt x={0} y={4.5} size={11} color={gold ? NAVY : ACCENT}>
        ¥
      </Txt>
    </g>
  );
}

export function CrossBadge({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={10} fill="#fff" {...L} />
      <path d="M-4.5 -4.5 L4.5 4.5 M4.5 -4.5 L-4.5 4.5" stroke={INK} strokeWidth={2.8} strokeLinecap="round" />
    </g>
  );
}

export function CheckBadge({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={9} fill={ACCENT} />
      <path d="M-4.5 0 L-1.2 3.5 L5 -3.5" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** 動きの線（震え・着信など） */
export function Buzz({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return <path transform={`translate(${x} ${y}) rotate(${r})`} d="M0 -6 L0 6 M6 -4 L6 4 M-6 -4 L-6 4" {...L} strokeWidth={2} />;
}

/** ？／！ などの記号 */
export function Mark({ x, y, size = 24, color = ACCENT, children }: { x: number; y: number; size?: number; color?: string; children: string }) {
  return (
    <Txt x={x} y={y} size={size} color={color}>
      {children}
    </Txt>
  );
}

/** 淡い背景（円＋ドット） */
export function Ground({ cx, cy, r, color = ACCENT_PALE }: { cx: number; cy: number; r: number; color?: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} />
      <g fill={ACCENT_LIGHT}>
        {[0, 1, 2].map((i) =>
          [0, 1, 2].map((j) => <circle key={`${i}${j}`} cx={cx + r * 0.62 + i * 7} cy={cy - r * 0.95 + j * 7} r={1.6} />),
        )}
      </g>
    </g>
  );
}

/** 点線の軌跡 */
export function DashPath({ d, color = ACCENT }: { d: string; color?: string }) {
  return <path d={d} stroke={color} strokeWidth={2} strokeLinecap="round" strokeDasharray="2 6" />;
}

/** 地面の線 */
export function Floor({ y, x1 = 8, x2 = 232 }: { y: number; x1?: number; x2?: number }) {
  return <path d={`M${x1} ${y} L${x2} ${y}`} stroke={INK} strokeWidth={SW} strokeLinecap="round" />;
}

/** 机の天板（シーンの下端を隠して人物をバストアップにする） */
export function Desk({ y, x1 = 0, x2 = 240 }: { y: number; x1?: number; x2?: number }) {
  return (
    <g>
      <rect x={x1} y={y} width={x2 - x1} height={400} fill="#fff" />
      <path d={`M${x1 + 6} ${y} L${x2 - 6} ${y}`} stroke={INK} strokeWidth={SW + 0.4} strokeLinecap="round" />
    </g>
  );
}

/* ═══════════════════════ 運送業の小物 ═══════════════════════ */

/**
 * 大型トラック（側面・右向き）。原点＝左後輪の接地点あたりの地面（y=0 が地面）。
 * 全長はおよそ 0〜156。label を渡すと荷台に文字を入れる。
 */
export function Truck({
  x,
  y,
  s = 1,
  flip = false,
  label,
  dim = false,
}: {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  label?: string;
  /** 動いていない・止まっている表現（荷台を灰色に）。flip 時は label を付けない（文字が反転するため） */
  dim?: boolean;
}) {
  const box = dim ? GRAY_LIGHT : "#fff";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})${flip ? " translate(-156 0)" : ""}`}>
      {/* 荷台（アルミバン） */}
      <rect x={0} y={-70} width={110} height={56} rx={3} fill={box} {...L} />
      {[18, 36, 54, 72, 90].map((lx) => (
        <path key={lx} d={`M${lx} -66 L${lx} -18`} stroke={INK} strokeWidth={1} opacity={0.18} />
      ))}
      <path d="M2 -26 L108 -26" stroke={dim ? "#c3cad7" : ACCENT} strokeWidth={5} />
      {label && (
        <text x={55} y={-40} fontSize={15} fontWeight={900} fill={dim ? "#8a93a6" : NAVY} textAnchor="middle" fontFamily="inherit">
          {label}
        </text>
      )}
      {/* シャーシ */}
      <path d="M-2 -14 L152 -14" {...L} strokeWidth={SW + 0.6} />
      {/* キャブ */}
      <path d="M113 -14 L113 -62 Q113 -66 117 -66 L138 -66 Q144 -66 147 -58 L154 -38 L154 -16 Q154 -14 152 -14 Z" fill={dim ? "#dfe5ef" : ACCENT_LIGHT} {...L} />
      <path d="M119 -60 L137 -60 Q141 -60 143 -55 L148 -42 L119 -42 Z" fill="#fff" {...L} strokeWidth={1.8} />
      <path d="M128 -38 L128 -18" {...L} strokeWidth={1.6} />
      <rect x={147} y={-30} width={7} height={5} rx={1} fill={YELLOW} {...L} strokeWidth={1.2} />
      {/* タイヤ */}
      {[20, 42, 134].map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy={-6} r={10} fill={INK} />
          <circle cx={wx} cy={-6} r={4.5} fill="#fff" />
        </g>
      ))}
    </g>
  );
}

/** 小さいトラックのアイコン（求人票やスマホの中に入れる）。原点は中央 */
export function TruckIcon({ x, y, s = 1, color = ACCENT }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-14} y={-9} width={17} height={12} rx={1.5} fill={color} />
      <path d="M4 -5 L10 -5 L14 0 L14 3 L4 3 Z" fill={color} />
      <circle cx={-8} cy={5} r={2.6} fill={INK} />
      <circle cx={9} cy={5} r={2.6} fill={INK} />
    </g>
  );
}

/** 求人票。原点は中央。title は見出し、badge は右上のバッジ文字 */
export function JobSheet({
  x,
  y,
  s = 1,
  r = 0,
  title = "求人票",
  badge,
  lines = ["勤務地", "給与", "免許"],
  highlight = false,
}: {
  x: number;
  y: number;
  s?: number;
  r?: number;
  title?: string;
  badge?: string;
  lines?: string[];
  highlight?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <rect x={-30} y={-38} width={60} height={76} rx={4} fill={highlight ? ACCENT_PALE : "#fff"} stroke={highlight ? ACCENT : INK} strokeWidth={SW} />
      <rect x={-30} y={-38} width={60} height={17} rx={4} fill={highlight ? ACCENT : NAVY} />
      <Txt x={0} y={-25.5} size={9.5} color="#fff">
        {title}
      </Txt>
      <TruckIcon x={0} y={-8} s={0.8} />
      {lines.map((t, i) => (
        <g key={t}>
          <Txt x={-24} y={12 + i * 9} size={6.5} anchor="start" weight={700}>
            {t}
          </Txt>
          <path d={`M-4 ${10 + i * 9} L22 ${10 + i * 9}`} stroke={GRAY_LIGHT} strokeWidth={3} strokeLinecap="round" />
        </g>
      ))}
      {badge && (
        <g transform="translate(26 -38)">
          <rect x={-16} y={-8} width={32} height={15} rx={7.5} fill={YELLOW} {...L} strokeWidth={1.6} />
          <Txt x={0} y={3.5} size={8.5} color={NAVY}>
            {badge}
          </Txt>
        </g>
      )}
    </g>
  );
}

/** スマホ（求人を表示）。原点は中央。screen で中身を差し替える */
export function Phone({ x, y, s = 1, r = 0, children }: { x: number; y: number; s?: number; r?: number; children?: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <rect x={-17} y={-30} width={34} height={60} rx={6} fill="#fff" {...L} />
      <path d="M-5 -25 L5 -25" {...L} strokeWidth={1.6} />
      {children ?? (
        <g>
          <rect x={-12} y={-19} width={24} height={14} rx={2} fill={ACCENT_LIGHT} />
          <TruckIcon x={0} y={-12} s={0.55} />
          <path d="M-11 1 L11 1 M-11 7 L5 7" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
          <rect x={-11} y={14} width={22} height={8} rx={4} fill={YELLOW} {...L} strokeWidth={1.2} />
        </g>
      )}
    </g>
  );
}

/** ノートPC（画面が見える向き）。原点は天板中央 */
export function Laptop({ x, y, s = 1, children }: { x: number; y: number; s?: number; children?: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-40} y={-54} width={80} height={52} rx={3} fill="#fff" {...L} />
      <path d="M-50 0 L50 0 L46 -2 L-46 -2 Z" fill={GRAY_LIGHT} {...L} />
      {children}
    </g>
  );
}

/** 電話の受話器（固定電話・スマホ通話の手元） */
export function Handset({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M-4 -16 Q-10 -16 -10 -10 L-10 10 Q-10 16 -4 16 L1 16 L1 8 L-3 8 L-3 -8 L1 -8 L1 -16 Z" fill={NAVY} {...L} />
    </g>
  );
}

/** カレンダー（毎月の支払いなど）。原点は左上 */
export function Calendar({ x, y, s = 1, label = "毎月" }: { x: number; y: number; s?: number; label?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect width={52} height={48} rx={5} fill="#fff" {...L} />
      <rect width={52} height={14} rx={5} fill={ACCENT} />
      <path d="M0 9 L52 9" stroke={ACCENT} strokeWidth={10} />
      <Txt x={26} y={11} size={8.5} color="#fff">
        {label}
      </Txt>
      <path d="M14 -4 L14 4 M38 -4 L38 4" {...L} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect key={`${r}${c}`} x={6 + c * 11} y={20 + r * 9} width={7} height={5} rx={1} fill={r === 2 && c === 3 ? ACCENT : GRAY_LIGHT} />
        )),
      )}
    </g>
  );
}

/** 「0円」の札（料金の要点）。原点は中央 */
export function ZeroTag({ x, y, s = 1, r = 0, text = "0円" }: { x: number; y: number; s?: number; r?: number; text?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <rect x={-26} y={-15} width={52} height={30} rx={8} fill={YELLOW} {...L} />
      <Txt x={0} y={7} size={18} color={NAVY}>
        {text}
      </Txt>
    </g>
  );
}

/** 免許証カード */
export function LicenseCard({ x, y, s = 1, r = 0, label = "大型" }: { x: number; y: number; s?: number; r?: number; label?: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <rect x={-24} y={-15} width={48} height={30} rx={4} fill="#fff" {...L} />
      <rect x={-19} y={-10} width={13} height={17} rx={2} fill={ACCENT_LIGHT} {...L} strokeWidth={1.4} />
      <Txt x={8} y={-1} size={9.5} color={NAVY}>
        {label}
      </Txt>
      <path d="M-1 6 L18 6" stroke={GRAY_LIGHT} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

/** 虫眼鏡。原点はレンズ中央 */
export function Magnifier({ x, y, s = 1, r = 0 }: { x: number; y: number; s?: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M9 9 L20 20" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d="M9 9 L20 20" stroke={NAVY} strokeWidth={3} strokeLinecap="round" />
      <circle r={12} fill="#fff" fillOpacity={0.75} {...L} />
      <path d="M-6 -4 Q-4 -8 0 -8" stroke={ACCENT_LIGHT} strokeWidth={2.4} strokeLinecap="round" />
    </g>
  );
}

/** 盾＋チェック（返金・安心） */
export function Shield({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -20 L-16 -13 L-16 0 C-16 11 -8 18 0 21 C8 18 16 11 16 0 L16 -13 Z" fill={ACCENT_LIGHT} {...L} />
      <path d="M-7 0 L-2 6 L8 -6" stroke={ACCENT} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** 吹き出し。原点は本体の中央 */
export function Bubble({
  x,
  y,
  w = 44,
  h = 28,
  tail = "bl",
  fill = "#fff",
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  tail?: "bl" | "br";
  fill?: string;
  children?: ReactNode;
}) {
  const tx = tail === "bl" ? -w / 2 + 9 : w / 2 - 9;
  const dir = tail === "bl" ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${tx - 4 * dir} ${h / 2 - 1} L${tx + 6 * dir} ${h / 2 + 10} L${tx + 8 * dir} ${h / 2 - 1}`} fill={fill} {...L} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2.4} fill={fill} {...L} />
      <path d={`M${tx - 3 * dir} ${h / 2 - 1.2} L${tx + 7 * dir} ${h / 2 - 1.2}`} stroke={fill} strokeWidth={SW + 0.6} />
      {children}
    </g>
  );
}

/** 応募者アイコン（人型） */
export function Person({ x, y, s = 1, filled = true }: { x: number; y: number; s?: number; filled?: boolean }) {
  const c = filled ? ACCENT : "#fff";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={-6} r={5} fill={c} stroke={filled ? ACCENT : INK} strokeWidth={SW} />
      <path d="M-9 9 Q-9 0 0 0 Q9 0 9 9 Z" fill={c} stroke={filled ? ACCENT : INK} strokeWidth={SW} strokeLinejoin="round" />
    </g>
  );
}
