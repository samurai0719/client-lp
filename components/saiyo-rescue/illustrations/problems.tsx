/**
 * 「こんなお悩みありませんか？」専用の描き下ろしSVGイラスト（6点）。
 *
 * 1枚ごとに「人物＋表情＋ポーズ＋状況＋小物」で小さなストーリーを作り、
 * 文字を読まなくても何に困っているかが分かる構図にしている。
 *
 * 統一ルール（全カット共通）
 * ・線：SW=2.4 / 色 INK / 角丸
 * ・顔：同じ輪郭・目・鼻・口のパーツ体系（Head）で、眉・目・口の組み合わせで感情を出す
 * ・配色：白・淡い水色・薄いグレーが基本。服や小物の一部だけブルー
 * ・人物ごとに髪型・服装・役割（経営者／採用担当／求職者）を変える
 */
import type { ReactNode } from "react";
import { ACCENT, ACCENT_LIGHT, ACCENT_PALE, GRAY_LIGHT, INK, Svg, type IllustrationProps } from "./parts";

const SW = 2.4;
const HAIR = "#2f3546";
const HAIR_GRAY = "#c3cad7";
const SKIN = "#fff";
const L = { stroke: INK, strokeWidth: SW, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/* ═══════════════════════ 顔 ═══════════════════════ */

type HairStyle = "tidy" | "part" | "owner" | "long" | "bob" | "bun" | "messy";
type Brow = "flat" | "worry" | "raised" | "think";
type Eye = "dot" | "wide" | "squeeze" | "happy";
type Mouth = "smile" | "frown" | "wavy" | "flat" | "grimace" | "o" | "side";

const HAIR_BACK: Partial<Record<HairStyle, ReactNode>> = {
  long: <path d="M-16 -8 C-19 -26 19 -26 16 -8 C17 6 18 18 21 30 C8 34 -8 34 -21 30 C-18 18 -17 6 -16 -8 Z" fill={HAIR} {...L} />,
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
  owner: (
    <g fill={HAIR_GRAY}>
      <path d="M-15 3 C-17 -9 -14 -17 -8 -20 C-10 -14 -12 -8 -13 -2 Z" {...L} />
      <path d="M15 3 C17 -9 14 -17 8 -20 C10 -14 12 -8 13 -2 Z" {...L} />
      <path d="M-8 -20 C-3 -24 3 -24 8 -20 C3 -21 -3 -21 -8 -20 Z" {...L} />
    </g>
  ),
  long: (
    <path d="M-15 0 C-17 -18 -7 -26 2 -25 C12 -24 18 -16 15 0 C13 -9 9 -14 4 -15 C1 -10 -7 -6 -15 0 Z" fill={HAIR} {...L} />
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
};

const BROWS: Record<Brow, string> = {
  flat: "M-9 -6 L-3.5 -6 M3.5 -6 L9 -6",
  worry: "M-9.5 -4 L-3 -7.5 M3 -7.5 L9.5 -4",
  raised: "M-9 -7 Q-6 -10 -3 -8 M3 -8 Q6 -10 9 -7",
  think: "M-9 -6 L-3.5 -6 M3.5 -8.5 L9 -10",
};

const MOUTHS: Record<Mouth, ReactNode> = {
  smile: <path d="M-4.5 10.5 Q0 14.5 4.5 10.5" {...L} />,
  frown: <path d="M-4 13 Q0 9.5 4 13" {...L} />,
  wavy: <path d="M-5 12 Q-2.5 10 0 12 Q2.5 14 5 12" {...L} />,
  flat: <path d="M-3 12 L3 12" {...L} />,
  side: <path d="M-1.5 12.5 Q2 10.5 5 11.5" {...L} />,
  o: <ellipse cx={0} cy={12} rx={2.2} ry={2.8} fill="#fff" {...L} />,
  grimace: (
    <g>
      <path d="M-5.5 10.5 Q0 9.5 5.5 10.5 L5 13.5 Q0 14.6 -5 13.5 Z" fill="#fff" {...L} />
      <path d="M-5 12 L5 12" stroke={INK} strokeWidth={1.2} />
    </g>
  ),
};

function Eyes({ eye, look }: { eye: Eye; look: [number, number] }) {
  const [lx, ly] = look;
  if (eye === "squeeze")
    return <path d="M-8.5 -1 L-4 1 L-8.5 3 M8.5 -1 L4 1 L8.5 3" {...L} />;
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

function Head({
  x = 0,
  y = 0,
  r = 0,
  s = 1,
  hair,
  brow = "flat",
  eye = "dot",
  mouth = "smile",
  look = [0, 0],
  glasses = false,
  blush = false,
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
      {HAIR_FRONT[hair]}
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

/** 胴体（原点＝首の付け根。下は 120 まで描いて枠や机で切る） */
const TORSO = "M-30 120 L-30 16 Q-30 0 -14 -2 L14 -2 Q30 0 30 16 L30 120";

type Outfit = "suit" | "ownerSuit" | "cardigan" | "hoodie" | "shirt" | "tee" | "blouse";

const OUTFIT_FILL: Record<Outfit, string> = {
  suit: "#e4eaf5",
  ownerSuit: "#d5deee",
  cardigan: "#fff",
  hoodie: ACCENT_LIGHT,
  shirt: "#fff",
  tee: GRAY_LIGHT,
  blouse: "#fff",
};

function Body({ outfit }: { outfit: Outfit }) {
  const fill = OUTFIT_FILL[outfit];
  return (
    <g>
      {outfit === "hoodie" && <path d="M-18 -4 Q0 16 18 -4 Q10 -8 0 -6 Q-10 -8 -18 -4 Z" fill={ACCENT_LIGHT} {...L} />}
      <path d={TORSO} fill={fill} {...L} />
      {(outfit === "suit" || outfit === "ownerSuit") && (
        <g>
          <path d="M-10 -2 L0 24 L10 -2 Z" fill="#fff" {...L} />
          <path d="M-3 3 L3 3 L4.5 22 L0 28 L-4.5 22 Z" fill={outfit === "ownerSuit" ? "#0a1f4e" : ACCENT} {...L} />
          <path d="M-14 -2 L-3 32 M14 -2 L3 32" {...L} />
          <path d="M15 48 L24 48" {...L} />
          <circle cx={0} cy={42} r={1.8} fill={INK} />
          <circle cx={0} cy={54} r={1.8} fill={INK} />
        </g>
      )}
      {outfit === "cardigan" && (
        <g>
          <path d="M-30 120 L-30 16 Q-30 0 -14 -2 L-9 2 L-6 120 Z" fill={ACCENT_LIGHT} {...L} />
          <path d="M30 120 L30 16 Q30 0 14 -2 L9 2 L6 120 Z" fill={ACCENT_LIGHT} {...L} />
          <path d="M-9 -1 Q0 10 9 -1" {...L} />
        </g>
      )}
      {outfit === "blouse" && (
        <g>
          <path d="M-11 -2 Q-8 9 0 6 Q8 9 11 -2" fill="#fff" {...L} />
          <path d="M0 6 L0 60" {...L} strokeWidth={1.6} />
          <circle cx={0} cy={20} r={1.5} fill={ACCENT} />
          <circle cx={0} cy={34} r={1.5} fill={ACCENT} />
        </g>
      )}
      {outfit === "hoodie" && (
        <g>
          <path d="M-5 6 L-6 24 M5 6 L6 24" {...L} />
          <path d="M-17 76 Q0 68 17 76" {...L} />
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
      {outfit === "tee" && <path d="M-9 -2 Q0 7 9 -2" {...L} />}
    </g>
  );
}

/** 腕（輪郭付きの太い線）。色は服に合わせる */
function Arm({ d, color, w = 12 }: { d: string; color: string; w?: number }) {
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={w + SW * 2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** 手（握り・添え手）。r で向きを変える */
function Hand({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M-6 -3 C-6 -8.5 6 -8.5 6 -3 L6 3 C6 7.5 -6 7.5 -6 3 Z" fill={SKIN} {...L} />
      <path d="M-2 -6.5 L-2 -1.5 M2 -6.5 L2 -1.5" stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
      <path d="M-6 0 C-9.5 0 -9.5 5 -5.5 4.5" fill={SKIN} {...L} />
    </g>
  );
}

/* ═══════════════════════ 小物・記号 ═══════════════════════ */

function Sweat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
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

function Txt({
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

function Coin({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={10} fill={ACCENT_LIGHT} {...L} />
      <circle r={6.5} fill="none" stroke={ACCENT} strokeWidth={1.4} />
      <Txt x={0} y={4.5} size={11} color={ACCENT}>
        ¥
      </Txt>
    </g>
  );
}

function CrossBadge({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={10} fill="#fff" {...L} />
      <path d="M-4.5 -4.5 L4.5 4.5 M4.5 -4.5 L-4.5 4.5" stroke={INK} strokeWidth={2.8} strokeLinecap="round" />
    </g>
  );
}

function CheckBadge({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={9} fill={ACCENT} />
      <path d="M-4.5 0 L-1.2 3.5 L5 -3.5" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** 動きの線（震え・着信など） */
function Buzz({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return <path transform={`translate(${x} ${y}) rotate(${r})`} d="M0 -6 L0 6 M6 -4 L6 4 M-6 -4 L-6 4" {...L} strokeWidth={2} />;
}

/** 淡い背景（円＋ドット） */
function Ground({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={ACCENT_PALE} />
      <g fill={ACCENT_LIGHT}>
        {[0, 1, 2].map((i) =>
          [0, 1, 2].map((j) => <circle key={`${i}${j}`} cx={cx + r * 0.62 + i * 7} cy={cy - r * 0.95 + j * 7} r={1.6} />),
        )}
      </g>
    </g>
  );
}

/* ═══════════════════════ ① 広告費ばかりかかる ═══════════════════════ */

/** 経営者が高額な求人媒体の請求書を手に、上がり続ける広告費に焦っている */
export function ProblemCost(props: IllustrationProps) {
  const jacket = OUTFIT_FILL.ownerSuit;
  return (
    <Svg viewBox="0 0 240 180" {...props}>
      <Ground cx={112} cy={112} r={74} />

      {/* 広告費の上昇グラフ */}
      <g transform="translate(166 12)">
        <rect width={64} height={54} rx={6} fill="#fff" {...L} />
        <Txt x={8} y={15} size={9.5} anchor="start">
          広告費
        </Txt>
        <rect x={10} y={36} width={8} height={10} rx={1.5} fill={ACCENT_LIGHT} {...L} strokeWidth={1.8} />
        <rect x={24} y={30} width={8} height={16} rx={1.5} fill={ACCENT_LIGHT} {...L} strokeWidth={1.8} />
        <rect x={38} y={22} width={8} height={24} rx={1.5} fill={ACCENT} {...L} strokeWidth={1.8} />
        <path d="M10 30 L28 22 L40 16 L55 8 M48 8 L55 8 L55 15" stroke={ACCENT} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* 出ていくお金 */}
      <path d="M150 104 Q176 90 190 76" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" strokeDasharray="2 6" />
      <Coin x={198} y={92} />
      <Coin x={220} y={118} s={0.85} />
      <Coin x={30} y={56} s={0.9} />
      <Coin x={46} y={30} s={0.7} />

      {/* 経営者 */}
      <g transform="translate(108 104) rotate(-3)">
        <Body outfit="ownerSuit" />
        <Head y={-25} r={-8} hair="owner" brow="worry" eye="dot" mouth="wavy" glasses />
        <Arm d="M-24 10 Q-50 44 -34 72" color={jacket} />
        <Arm d="M24 10 Q50 44 34 70" color={jacket} />
        {/* 請求書 */}
        <g transform="rotate(-4)">
          <rect x={-36} y={24} width={72} height={58} rx={3} fill="#fff" {...L} />
          <Txt x={0} y={38} size={9.5}>
            請求書
          </Txt>
          <path d="M-14 41 L14 41" stroke={INK} strokeWidth={1.4} />
          <Txt x={0} y={58} size={12.5} color={ACCENT}>
            ¥480,000
          </Txt>
          <path d="M-24 66 L24 66 M-24 73 L10 73" stroke={GRAY_LIGHT} strokeWidth={3} strokeLinecap="round" />
        </g>
        <Hand x={-34} y={72} r={-20} />
        <Hand x={34} y={70} r={20} />
        <Sweat x={20} y={-50} />
        <Sweat x={-22} y={-40} s={0.8} />
      </g>
    </Svg>
  );
}

/* ═══════════════════════ ② 欲しい人材ではない ═══════════════════════ */

function Applicant({
  x,
  y,
  outfit,
  hair,
  mouth = "smile",
}: {
  x: number;
  y: number;
  outfit: Outfit;
  hair: HairStyle;
  mouth?: Mouth;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(0.62)`}>
      <Body outfit={outfit} />
      <path d="M-22 14 L-22 120 M22 14 L22 120" {...L} />
      <Head y={-25} hair={hair} mouth={mouth} />
    </g>
  );
}

/** 応募者は来ているが、求める人物と合わない（全員に×） */
export function ProblemMismatch(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 180" {...props}>
      <Ground cx={66} cy={118} r={64} />

      {/* 求める人物（思い浮かべている理想） */}
      <g>
        <rect x={112} y={10} width={118} height={38} rx={14} fill={ACCENT_PALE} {...L} />
        <circle cx={104} cy={56} r={4} fill={ACCENT_PALE} {...L} />
        <circle cx={96} cy={66} r={2.6} fill={ACCENT_PALE} {...L} />
        <g transform="translate(132 30)">
          <circle cx={0} cy={-5} r={5} fill={ACCENT} />
          <path d="M-9 10 Q-9 1 0 1 Q9 1 9 10 Z" fill={ACCENT} />
        </g>
        <Txt x={147} y={27} size={9} anchor="start" color={INK} weight={700}>
          欲しいのは
        </Txt>
        <Txt x={147} y={40} size={11} anchor="start" color={ACCENT}>
          即戦力の経験者
        </Txt>
      </g>

      {/* 応募者（条件に合わない） */}
      <Applicant x={138} y={128} outfit="tee" hair="messy" mouth="flat" />
      <Applicant x={176} y={124} outfit="hoodie" hair="long" />
      <Applicant x={213} y={130} outfit="shirt" hair="tidy" mouth="side" />
      <CrossBadge x={152} y={92} s={0.85} />
      <CrossBadge x={190} y={88} s={0.85} />
      <CrossBadge x={227} y={94} s={0.85} />

      {/* 採用担当（困って頬に手） */}
      <g transform="translate(64 110) rotate(3)">
        <Body outfit="cardigan" />
        <Arm d="M-24 10 Q-36 42 -12 50" color={ACCENT_LIGHT} />
        <g transform="translate(-6 50) rotate(-10)">
          <rect x={-15} y={-18} width={30} height={38} rx={3} fill="#fff" {...L} />
          <rect x={-6} y={-22} width={12} height={6} rx={2} fill={ACCENT} {...L} strokeWidth={1.8} />
          <path d="M-9 -6 L-6 -3 L-1 -9" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 -6 L10 -6" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
          <path d="M-9 4 L-3 10 M-3 4 L-9 10" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          <path d="M2 7 L10 7" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        </g>
        <Hand x={-12} y={50} r={-30} />
        <Head y={-25} r={7} hair="bob" brow="worry" eye="dot" mouth="frown" look={[1.6, 0]} />
        <Arm d="M24 10 Q40 40 14 -12" color={ACCENT_LIGHT} />
        <Hand x={13} y={-15} r={160} />
        <Sweat x={-18} y={-54} s={0.9} />
      </g>
    </Svg>
  );
}

/* ═══════════════════════ ③ 条件だけで比較される ═══════════════════════ */

/**
 * 求人票。ラベル（小・グレー）と値（大・ブルー）を別の行に分け、
 * 文字同士が重ならないよう各 text の y を個別に指定している（行間 11〜12px 以上）。
 */
function JobSheet({
  x,
  y,
  label,
  salary,
  holidays,
  r = 0,
}: {
  x: number;
  y: number;
  label: string;
  salary: string;
  holidays: string;
  r?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x={-30} y={-42} width={60} height={84} rx={5} fill="#fff" {...L} />
      <path d="M-30 -24 L30 -24" {...L} />
      <rect x={-28.8} y={-40.8} width={57.6} height={15.6} rx={4} fill={ACCENT_LIGHT} />
      <Txt x={0} y={-29} size={11}>
        {label}
      </Txt>

      <Txt x={-23} y={-11} size={7.5} anchor="start" color="#6b7486" weight={700}>
        給与（月給）
      </Txt>
      <Txt x={-23} y={2} size={11} anchor="start" color={ACCENT}>
        {salary}
      </Txt>
      <path d="M-23 7 L23 7" stroke={GRAY_LIGHT} strokeWidth={1.6} />

      <Txt x={-23} y={18} size={7.5} anchor="start" color="#6b7486" weight={700}>
        年間休日
      </Txt>
      <Txt x={-23} y={31} size={11} anchor="start" color={ACCENT}>
        {holidays}
      </Txt>
    </g>
  );
}

/** 求職者がA社・B社の求人票を見比べている。条件が同じで決め手がない／企業側は魅力が伝わらず困っている */
export function ProblemCompare(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 180" {...props}>
      <Ground cx={120} cy={112} r={70} />

      {/* 求職者 */}
      <g transform="translate(120 112)">
        <Body outfit="hoodie" />
        <Arm d="M-24 10 Q-50 30 -62 10" color={ACCENT_LIGHT} />
        <Arm d="M24 10 Q50 30 62 10" color={ACCENT_LIGHT} />
        <Head y={-25} r={-4} hair="messy" brow="think" eye="dot" mouth="side" look={[-1.8, -0.6]} />
        <Txt x={-4} y={-58} size={14} color={ACCENT}>
          ?
        </Txt>
        <Txt x={10} y={-64} size={10} color={INK}>
          ?
        </Txt>
      </g>
      <JobSheet x={54} y={78} label="A社" salary="25万円" holidays="120日" r={-5} />
      <JobSheet x={186} y={78} label="B社" salary="26万円" holidays="115日" r={5} />
      <Hand x={58} y={122} r={-10} />
      <Hand x={182} y={122} r={10} />

      {/* 魅力が伝わらず困っている企業側 */}
      <g transform="translate(220 168)">
        <path d="M-26 20 L-26 8 Q-26 -4 -12 -6 L12 -6 Q26 -4 26 8 L26 20" fill={OUTFIT_FILL.suit} {...L} />
        <path d="M-6 -6 L0 6 L6 -6" fill="#fff" {...L} />
        <Head y={-28} s={0.8} r={-10} hair="part" brow="worry" mouth="wavy" look={[-1.5, -1]} />
        <Sweat x={-16} y={-46} s={0.75} />
      </g>
      <g transform="translate(186 146)">
        <rect x={-14} y={-9} width={28} height={18} rx={8} fill="#fff" {...L} />
        <g fill={INK}>
          <circle cx={-6} cy={0} r={1.6} />
          <circle cx={0} cy={0} r={1.6} />
          <circle cx={6} cy={0} r={1.6} />
        </g>
      </g>
    </Svg>
  );
}

/* ═══════════════════════ ④ 何を書けばいいか分からない ═══════════════════════ */

/** 白紙の画面を前に、書こうとした手が止まっている採用担当 */
export function ProblemBlankPage(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 180" {...props}>
      <Ground cx={84} cy={104} r={68} />

      {/* モニター（白紙） */}
      <g>
        <path d="M178 124 L178 140 M164 142 L192 142" {...L} />
        <rect x={132} y={52} width={96} height={72} rx={6} fill="#fff" {...L} />
        <rect x={132} y={52} width={96} height={13} rx={6} fill={ACCENT_LIGHT} {...L} />
        <g fill="#fff">
          <circle cx={140} cy={58.5} r={1.8} />
          <circle cx={146} cy={58.5} r={1.8} />
        </g>
        <Txt x={144} y={80} size={9} anchor="start" color="#9aa5b8" weight={700}>
          採用ページ原稿
        </Txt>
        <path d="M144 90 L144 102" stroke={ACCENT} strokeWidth={2.4} strokeLinecap="round" />
      </g>

      {/* 机 */}
      <rect x={0} y={150} width={240} height={40} fill="#fff" />
      <path d="M8 150 L232 150" {...L} strokeWidth={SW + 0.4} />
      <path d="M142 146 L206 146 L212 150 L136 150 Z" fill={GRAY_LIGHT} {...L} />
      {/* コーヒー */}
      <path d="M26 132 L26 148 Q26 150 28 150 L40 150 Q42 150 42 148 L42 132 Z" fill="#fff" {...L} />
      <path d="M42 136 Q48 136 48 141 Q48 146 42 146" {...L} />
      <path d="M31 126 Q29 122 31 118 M37 126 Q35 122 37 118" stroke="#9aa5b8" strokeWidth={1.8} strokeLinecap="round" />

      {/* 採用担当（頬杖・手が止まる） */}
      <g transform="translate(86 112) rotate(6)">
        <Body outfit="blouse" />
        <Head y={-25} r={10} hair="bun" brow="worry" eye="dot" mouth="flat" look={[2, -0.8]} />
        <Arm d="M-24 10 Q-32 40 -13 -8" color="#fff" />
        <Hand x={-13} y={-10} r={170} />
        <Arm d="M24 10 Q44 34 58 34" color="#fff" />
        <Hand x={60} y={33} r={-80} />
      </g>
      {/* 机の手前（腕を机に乗せる） */}
      <path d="M8 150 L232 150" {...L} strokeWidth={SW + 0.4} />

      {/* 何を書けば… */}
      <g transform="translate(56 26)">
        <path d="M14 18 L22 30 L24 16" fill="#fff" {...L} />
        <rect x={-22} y={-16} width={44} height={34} rx={14} fill="#fff" {...L} />
        <path d="M14 17 L23 17" stroke="#fff" strokeWidth={SW + 0.6} />
        <Txt x={0} y={9} size={22} color={ACCENT}>
          ?
        </Txt>
      </g>
      <Txt x={104} y={30} size={14} color={INK}>
        ?
      </Txt>
    </Svg>
  );
}

/* ═══════════════════════ ⑤ 面接につながらない ═══════════════════════ */

/** 求職者 → 応募 までは来るが、その先で線が途切れて面接にたどり着かない */
export function ProblemDropOff(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 180" {...props}>
      <Ground cx={120} cy={138} r={60} />

      {/* 求職者 */}
      <g transform="translate(22 40) scale(0.5)">
        <path d="M-26 46 L-26 30 Q-26 16 -12 14 L12 14 Q26 16 26 30 L26 46" fill={ACCENT_LIGHT} {...L} strokeWidth={SW * 2} />
        <Head y={-8} hair="long" mouth="smile" />
      </g>
      <Txt x={22} y={74} size={9}>
        求職者
      </Txt>
      <path d="M42 40 L60 40 M54 35 L60 40 L54 45" stroke={ACCENT} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />

      {/* 応募 */}
      <rect x={64} y={22} width={46} height={38} rx={8} fill="#fff" stroke={ACCENT} strokeWidth={SW} />
      <g transform="translate(87 36)">
        <rect x={-10} y={-7} width={20} height={14} rx={2} fill={ACCENT_LIGHT} {...L} strokeWidth={1.8} />
        <path d="M-9 -6 L0 1 L9 -6" {...L} strokeWidth={1.8} />
      </g>
      <Txt x={87} y={55} size={9} color={ACCENT}>
        応募
      </Txt>
      <CheckBadge x={110} y={22} s={0.8} />

      {/* 途切れる導線 */}
      <path d="M112 41 L130 41" stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" />
      <path d="M130 34 L136 40 L132 44 L138 50" {...L} />
      <path d="M146 32 L142 38 L147 42 L143 48" {...L} />
      <path d="M152 41 L186 41" stroke="#b4bccb" strokeWidth={2.4} strokeLinecap="round" strokeDasharray="3 6" />

      {/* 面接（たどり着かない） */}
      <rect x={188} y={22} width={46} height={38} rx={8} fill={GRAY_LIGHT} stroke="#b4bccb" strokeWidth={SW} strokeDasharray="5 4" />
      <g transform="translate(211 36)" stroke="#9aa5b8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M-6 -8 L-6 4 L6 4 M-6 -2 L5 -2 L5 8 M-6 4 L-6 8" />
      </g>
      <Txt x={211} y={55} size={9} color="#9aa5b8">
        面接
      </Txt>

      {/* 離脱していく候補者 */}
      <g transform="translate(150 78)" stroke={ACCENT} strokeWidth={2} strokeDasharray="3 3" fill="#fff">
        <circle cx={0} cy={-6} r={6} />
        <path d="M-10 12 Q-10 2 0 2 Q10 2 10 12 Z" strokeLinejoin="round" />
      </g>
      <path d="M140 62 Q138 48 132 44" stroke={ACCENT} strokeWidth={1.8} strokeLinecap="round" strokeDasharray="2 4" />
      <path d="M164 82 Q186 86 196 100 M190 100 L196 100 L196 94" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 4" />
      <Txt x={210} y={114} size={9} color={ACCENT}>
        離脱
      </Txt>

      {/* 連絡を待つ採用担当 */}
      <g transform="translate(96 150)">
        <Body outfit="shirt" />
        <Arm d="M24 10 Q32 34 12 34" color="#fff" />
        <g transform="translate(10 26) rotate(-12)">
          <rect x={-8} y={-13} width={16} height={26} rx={3.5} fill="#fff" {...L} />
          <path d="M-4 -6 L4 -6 M-4 -1 L2 -1" stroke={GRAY_LIGHT} strokeWidth={2.4} strokeLinecap="round" />
        </g>
        <Hand x={12} y={34} r={-20} />
        <Head y={-25} r={-6} hair="tidy" brow="worry" mouth="frown" look={[1, 1.6]} />
        <Arm d="M-24 10 Q-46 -12 -16 -42" color="#fff" />
        <Hand x={-13} y={-45} r={150} />
        <Sweat x={20} y={-54} />
      </g>
    </Svg>
  );
}

/* ═══════════════════════ ⑥ 採用を担当できる人がいない ═══════════════════════ */

/** 電話・書類・PC作業に追われ、採用まで手が回らない */
export function ProblemBusy(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 180" {...props}>
      <Ground cx={116} cy={104} r={70} />

      {/* 時計 */}
      <g transform="translate(34 34)">
        <circle r={17} fill="#fff" {...L} />
        <path d="M0 -9 L0 0 L7 5" stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-14 -20 L-10 -15 M14 -20 L10 -15" {...L} />
      </g>
      <path d="M58 22 L64 18 M58 34 L66 34" {...L} strokeWidth={2} />

      {/* 舞う書類 */}
      <g transform="translate(196 34) rotate(14)">
        <rect x={-14} y={-18} width={28} height={36} rx={2} fill="#fff" {...L} />
        <path d="M-8 -8 L8 -8 M-8 -1 L8 -1 M-8 6 L3 6" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      </g>
      <g transform="translate(222 70) rotate(-10)">
        <rect x={-10} y={-10} width={20} height={20} rx={2} fill={ACCENT_LIGHT} {...L} />
        <path d="M-5 -2 L5 -2 M-5 4 L2 4" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      </g>

      {/* 本人：電話しながら書類を抱える */}
      <g transform="translate(112 112) rotate(-4)">
        <Body outfit="suit" />
        <Arm d="M-24 10 Q-46 34 -58 20" color={OUTFIT_FILL.suit} />
        <g transform="translate(-62 8) rotate(-12)">
          <rect x={-16} y={-14} width={30} height={36} rx={2} fill="#fff" {...L} />
          <rect x={-12} y={-18} width={30} height={36} rx={2} fill="#fff" {...L} />
          <path d="M-6 -8 L12 -8 M-6 -1 L12 -1 M-6 6 L6 6" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        </g>
        <Hand x={-58} y={22} r={-30} />
        <Head y={-25} r={-12} hair="part" brow="worry" eye="squeeze" mouth="grimace" />
        <Arm d="M24 10 Q50 20 30 -20" color={OUTFIT_FILL.suit} />
        <g transform="translate(22 -30) rotate(28)">
          <rect x={-6} y={-13} width={12} height={26} rx={3.5} fill={ACCENT} {...L} />
        </g>
        <Hand x={27} y={-22} r={-150} />
        <Sweat x={-24} y={-48} />
        <Sweat x={30} y={-60} s={0.8} />
        <Txt x={-34} y={-58} size={18} color={ACCENT}>
          !
        </Txt>
      </g>

      {/* 机：PC・書類の山・鳴り続ける電話 */}
      <rect x={0} y={150} width={240} height={40} fill="#fff" />
      <path d="M8 150 L232 150" {...L} strokeWidth={SW + 0.4} />
      <path d="M84 150 L88 118 L136 118 L140 150 Z" fill={GRAY_LIGHT} {...L} />
      <circle cx={112} cy={134} r={4} fill={ACCENT_LIGHT} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={20 + (i % 2) * 3} y={140 - i * 8} width={40} height={9} rx={1.5} fill="#fff" {...L} />
      ))}
      <g transform="translate(196 140)">
        <path d="M-20 10 L-16 -4 L16 -4 L20 10 Z" fill="#fff" {...L} />
        <path d="M-16 -6 Q-16 -14 -8 -14 L8 -14 Q16 -14 16 -6" fill={ACCENT_LIGHT} {...L} />
        <g fill={INK}>
          <circle cx={-6} cy={3} r={1.5} />
          <circle cx={0} cy={3} r={1.5} />
          <circle cx={6} cy={3} r={1.5} />
        </g>
      </g>
      <Buzz x={172} y={116} r={-30} />
      <Buzz x={222} y={116} r={30} />
    </Svg>
  );
}
