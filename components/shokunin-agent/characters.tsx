/**
 * 職人採用エージェントLP専用のキャラクターと場面イラスト（inline SVG）。
 *
 * ・全員 Figure で描く。顔・目・線幅・頭身（肩幅88／頭50）・影はここで統一される
 * ・Figure の原点は首の付け根。肩は (±42, 24)、胴は y=140 まで（シーン側で机や枠で切る）
 * ・色は CSS 変数（--sa-c-*。shokunin.css の .sa-lp で定義）。ブランド色の変更は CSS だけで済む
 * ・文字は SVG に入れず HTML で出す。装飾なので aria-hidden
 */
import type { ReactNode } from "react";

const C = {
  ink: "var(--sa-c-ink)",
  navy: "var(--sa-c-navy)",
  orange: "var(--sa-c-orange)",
  yellow: "var(--sa-c-yellow)",
  yellowSoft: "var(--sa-c-yellow-soft)",
  gray: "var(--sa-c-gray)",
  grayLight: "var(--sa-c-gray-light)",
  white: "var(--sa-c-white)",
  skin: "var(--sa-c-skin)",
  shade: "var(--sa-c-shade)",
  hair: "var(--sa-c-hair)",
};

const line = { stroke: C.ink, strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const thin = { ...line, strokeWidth: 1.6 };

type P = { className?: string };

function Art({ viewBox, className, children }: P & { viewBox: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} className={className} aria-hidden="true" focusable="false" fill="none" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

/* ═══════════════════════ 人物 ═══════════════════════ */

type Who = "owner" | "staff" | "applicant";
type Expr = "tired" | "worried" | "calm" | "smile" | "thinking" | "shocked" | "sorry";
type ArmDef = { d: string; hand: [number, number] };

function Eye({ cx, expr }: { cx: number; expr: Expr }) {
  if (expr === "smile") return <path d={`M${cx - 6} 1 Q${cx} -6 ${cx + 6} 1`} {...line} />;
  if (expr === "sorry") return <path d={`M${cx - 6} -1 Q${cx} 3 ${cx + 6} -1`} {...line} />;
  const half = expr === "tired";
  const top = half ? -3 : expr === "shocked" ? -7 : -5;
  return (
    <g>
      <path d={`M${cx - 6.5} ${top + 1} Q${cx} ${top - 2} ${cx + 6.5} ${top + 1}`} {...line} />
      <ellipse cx={cx} cy={half ? 0.8 : -0.5} rx={expr === "shocked" ? 2.2 : 3} ry={half ? 2.8 : 3.8} fill={C.ink} />
      <circle cx={cx + 1} cy={half ? -0.4 : -2} r={1} fill={C.white} />
      {half && <path d={`M${cx - 4.5} 6 Q${cx} 7.5 ${cx + 4.5} 6`} stroke={C.shade} strokeWidth={1.6} strokeLinecap="round" />}
    </g>
  );
}

const BROWS: Record<Expr, [string, string]> = {
  tired: ["M-16 -9 L-5 -13", "M16 -9 L5 -13"],
  worried: ["M-16 -8 L-5 -14", "M16 -8 L5 -14"],
  sorry: ["M-16 -8 L-5 -13", "M16 -8 L5 -13"],
  shocked: ["M-16 -15 Q-10 -18 -5 -15", "M16 -15 Q10 -18 5 -15"],
  calm: ["M-16 -12 Q-10 -14 -5 -12", "M16 -12 Q10 -14 5 -12"],
  smile: ["M-16 -12 Q-10 -15 -5 -12", "M16 -12 Q10 -15 5 -12"],
  thinking: ["M-16 -11 L-5 -12", "M16 -14 Q10 -16 5 -12"],
};

const MOUTHS: Record<Expr, ReactNode> = {
  tired: <path d="M-5 16 Q0 13 5 16" {...line} />,
  worried: <path d="M-6 16 Q-3 13 0 15 Q3 17 6 14" {...line} />,
  sorry: <path d="M-5 15 Q0 13.5 5 15" {...line} />,
  shocked: <ellipse cx={0} cy={15} rx={3.6} ry={4.2} fill={C.ink} />,
  calm: <path d="M-6 14 Q0 17 6 14" {...line} />,
  smile: <path d="M-8 12 Q0 21 8 12 Z" fill={C.white} {...line} />,
  thinking: <path d="M-3 15 L5 14" {...line} />,
};

function Head({ who, expr, tilt = 0 }: { who: Who; expr: Expr; tilt?: number }) {
  return (
    <g transform={`translate(0 -46) rotate(${tilt})`}>
      <path d="M-10 18 L-10 44 L10 44 L10 18" fill={C.skin} {...line} />
      <path d="M-10 26 Q0 34 10 26 L10 32 Q0 38 -10 32 Z" fill={C.shade} />
      <ellipse cx={-21} cy={2} rx={3.6} ry={6} fill={C.skin} {...line} />
      <ellipse cx={21} cy={2} rx={3.6} ry={6} fill={C.skin} {...line} />
      <path d="M-21 -8 C-21 -32 21 -32 21 -8 C21 10 12 24 0 27 C-12 24 -21 10 -21 -8 Z" fill={C.skin} {...line} />
      {who === "owner" && <path d="M-15 12 Q0 31 15 12 Q10 22 0 26 Q-10 22 -15 12 Z" fill={C.shade} />}
      <Eye cx={-10} expr={expr} />
      <Eye cx={10} expr={expr} />
      <path d={BROWS[expr][0]} stroke={C.hair} strokeWidth={who === "owner" ? 3 : 2.4} strokeLinecap="round" />
      <path d={BROWS[expr][1]} stroke={C.hair} strokeWidth={who === "owner" ? 3 : 2.4} strokeLinecap="round" />
      <path d="M0 3 L-2 9 L1.5 9.5" {...thin} />
      {MOUTHS[expr]}
      {who === "owner" && (
        <g>
          <path d="M-21 -6 L-21 6 L-17 -2 Z M21 -6 L21 6 L17 -2 Z" fill={C.hair} />
          <path d="M-20 -6 Q-23 14 -7 25 M20 -6 Q23 14 7 25" stroke={C.gray} strokeWidth={2.2} strokeLinecap="round" />
          <path d="M-26 -10 C-26 -46 26 -46 26 -10 Z" fill={C.white} {...line} />
          <path d="M-5 -36 L5 -36 L6 -11 L-6 -11 Z" fill={C.orange} />
          <path d="M-31 -9 Q0 -16 31 -9 Q33 -6 30 -5 Q0 -11 -30 -5 Q-33 -6 -31 -9 Z" fill={C.white} {...line} />
        </g>
      )}
      {who === "staff" && <path d="M-23 -2 C-29 -38 26 -42 23 -2 C20 -14 14 -19 8 -21 C0 -14 -12 -15 -17 -13 Q-21 -8 -23 -2 Z" fill={C.hair} {...line} />}
      {who === "applicant" && (
        <path d="M-23 -3 C-30 -34 -10 -41 6 -37 C24 -37 30 -18 23 -3 L18 -14 L11 -9 L6 -18 L-2 -11 L-9 -19 L-16 -10 Z" fill={C.hair} {...line} />
      )}
    </g>
  );
}

function Body({ who }: { who: Who }) {
  const shape = "M-46 150 L-46 38 Q-46 10 -14 3 L0 12 L14 3 Q46 10 46 38 L46 150 Z";
  if (who === "staff") {
    return (
      <g>
        <path d={shape} fill={C.white} {...line} />
        <path d="M-14 3 L-4 22 L0 12 L4 22 L14 3" fill={C.white} {...line} />
        <path d="M-46 150 L-46 38 Q-46 12 -20 5 L-10 150 Z M46 150 L46 38 Q46 12 20 5 L10 150 Z" fill={C.navy} {...line} />
        <path d="M-9 8 L0 60 L9 8" stroke={C.orange} strokeWidth={2.6} />
        <rect x={-10} y={60} width={20} height={26} rx={2} fill={C.yellow} {...thin} />
      </g>
    );
  }
  const jacket = who === "owner" ? C.navy : C.gray;
  const trim = who === "owner" ? C.orange : C.yellow;
  return (
    <g>
      <path d={shape} fill={jacket} {...line} />
      {who === "applicant" && <path d="M-11 4 L0 34 L11 4 L0 12 Z" fill={C.white} {...thin} />}
      <path d="M-16 2 L-4 26 L0 12 L4 26 L16 2 L14 -1 L0 8 L-14 -1 Z" fill={jacket} {...line} />
      <path d="M0 26 L0 150" {...thin} />
      <path d="M-46 74 L46 74" stroke={trim} strokeWidth={6} />
      <rect x={-34} y={40} width={22} height={18} rx={2} {...thin} />
      <rect x={12} y={40} width={22} height={18} rx={2} {...thin} />
    </g>
  );
}

function Arm({ who, d }: { who: Who; d: string }) {
  const color = who === "owner" ? C.navy : who === "staff" ? C.navy : C.gray;
  return (
    <>
      <path d={d} stroke={C.ink} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={color} strokeWidth={19.6} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function Figure({
  who,
  x,
  y,
  s = 1,
  flip = false,
  expr = "calm",
  tilt = 0,
  arms = [],
  held,
}: {
  who: Who;
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  expr?: Expr;
  tilt?: number;
  arms?: ArmDef[];
  held?: ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Body who={who} />
      {arms.map((a) => (
        <Arm key={a.d} who={who} d={a.d} />
      ))}
      {held}
      {arms.map((a) => (
        <g key={a.d}>
          <circle cx={a.hand[0]} cy={a.hand[1]} r={10} fill={C.skin} {...line} />
          <path d={`M${a.hand[0] - 5} ${a.hand[1] - 2} l6 -3`} {...thin} />
        </g>
      ))}
      <Head who={who} expr={expr} tilt={tilt} />
    </g>
  );
}

/* 腕のポーズ（肩から手へ） */
const POSE = {
  phoneEar: { d: "M42 30 Q78 52 34 -36", hand: [32, -40] },
  phoneFront: { d: "M42 30 Q66 78 22 62", hand: [20, 62] },
  paperLow: { d: "M-42 30 Q-74 72 -44 92", hand: [-44, 92] },
  headHold: { d: "M-42 30 Q-82 22 -34 -58", hand: [-30, -62] },
  headHoldR: { d: "M42 30 Q82 22 34 -58", hand: [30, -62] },
  point: { d: "M42 30 Q74 44 96 16", hand: [100, 12] },
  apologyL: { d: "M-42 30 Q-60 66 -12 44", hand: [-8, 42] },
  type: { d: "M42 30 Q54 84 16 100", hand: [14, 102] },
  typeL: { d: "M-42 30 Q-54 84 -16 100", hand: [-14, 102] },
  open: { d: "M-42 30 Q-72 64 -86 40", hand: [-90, 36] },
  hammer: { d: "M42 30 Q84 34 88 -18", hand: [88, -22] },
  pipe: { d: "M-42 30 Q-78 30 -76 -24", hand: [-76, -28] },
} satisfies Record<string, ArmDef>;

/* ═══════════════════════ 小物 ═══════════════════════ */

const at = (x: number, y: number, r = 0, s = 1) => `translate(${x} ${y}) rotate(${r}) scale(${s})`;

function Phone({ x, y, r = 0, s = 1, lit = false }: { x: number; y: number; r?: number; s?: number; lit?: boolean }) {
  return (
    <g transform={at(x, y, r, s)}>
      <rect x={-13} y={-24} width={26} height={48} rx={4} fill={C.ink} {...line} />
      <rect x={-10} y={-20} width={20} height={38} rx={1.5} fill={lit ? C.yellowSoft : C.grayLight} />
    </g>
  );
}

function Resume({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={at(x, y, r, s)}>
      <rect x={-24} y={-32} width={48} height={64} rx={2} fill={C.white} {...line} />
      <rect x={6} y={-25} width={12} height={15} fill={C.grayLight} {...thin} />
      <path d="M-18 -22 L0 -22 M-18 -14 L0 -14 M-18 0 L18 0 M-18 9 L18 9 M-18 18 L8 18" {...thin} />
    </g>
  );
}

function Rings({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const f = flip ? -1 : 1;
  return (
    <g stroke={C.orange} strokeWidth={3} strokeLinecap="round">
      <path d={`M${x} ${y - 10} Q${x + 8 * f} ${y} ${x} ${y + 10}`} />
      <path d={`M${x + 9 * f} ${y - 17} Q${x + 23 * f} ${y} ${x + 9 * f} ${y + 17}`} />
    </g>
  );
}

function Sweat({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={at(x, y, 0, s)} d="M0 -8 C5 -1 6 2 6 4 A6 6 0 0 1 -6 4 C-6 2 -5 -1 0 -8 Z" fill={C.white} stroke={C.navy} strokeWidth={1.8} />;
}

/** 着信の通知バッジ（受話器＋赤点） */
function CallBadge({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={at(x, y, 0, s)}>
      <rect x={-26} y={-20} width={52} height={40} rx={10} fill={C.white} {...line} />
      <path d="M-13 -7 Q-12 8 7 11 L11 4 L3 0 L0 3 Q-5 1 -6 -4 L-2 -7 L-6 -13 Z" fill={C.navy} />
      <circle cx={25} cy={-19} r={8} fill={C.orange} {...line} />
    </g>
  );
}

function Mark({ x, y, kind, s = 1 }: { x: number; y: number; kind: "ok" | "no"; s?: number }) {
  return (
    <g transform={at(x, y, 0, s)}>
      <circle r={15} fill={kind === "ok" ? C.orange : C.white} {...line} />
      {kind === "ok" ? (
        <path d="M-7 0 L-2 6 L8 -6" stroke={C.white} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke={C.ink} strokeWidth={3.4} strokeLinecap="round" />
      )}
    </g>
  );
}

function Scaffold({ x, y, cols, rows, cell = 44 }: { x: number; y: number; cols: number; rows: number; cell?: number }) {
  const w = cols * cell;
  const h = rows * cell;
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: cols + 1 }, (_, i) => (
        <path key={i} d={`M${i * cell} 0 L${i * cell} ${-h}`} stroke={C.gray} strokeWidth={3.6} />
      ))}
      {Array.from({ length: rows }, (_, r) => (
        <g key={r}>
          <rect x={-3} y={-(r + 1) * cell - 3} width={w + 6} height={7} fill={C.yellowSoft} stroke={C.gray} strokeWidth={1.6} />
          <path d={`M${(r % cols) * cell} ${-r * cell} L${((r % cols) + 1) * cell} ${-(r + 1) * cell}`} stroke={C.gray} strokeWidth={1.8} />
        </g>
      ))}
    </g>
  );
}

function Hammer({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={at(x, y, r, s)}>
      <rect x={-4} y={-6} width={8} height={56} rx={2} fill={C.yellow} {...line} />
      <path d="M-20 -18 L18 -18 L24 -10 L18 -4 L-20 -4 Z" fill={C.gray} {...line} />
    </g>
  );
}

function Wrench({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return <path transform={at(x, y, r, s)} d="M-5 -14 L-5 30 Q0 36 5 30 L5 -14 L12 -22 L10 -34 L3 -28 L-3 -28 L-10 -34 L-12 -22 Z" fill={C.gray} {...line} />;
}

function Laptop({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={at(x, y, 0, s)}>
      <rect x={-58} y={-74} width={116} height={72} rx={4} fill={C.white} {...line} />
      <rect x={-50} y={-66} width={46} height={30} fill={C.yellow} />
      <path d="M3 -62 L48 -62 M3 -52 L40 -52 M3 -42 L46 -42 M-50 -26 L48 -26 M-50 -16 L24 -16" {...thin} />
      <path d="M-70 -2 L70 -2 L62 8 L-62 8 Z" fill={C.gray} {...line} />
    </g>
  );
}

function Table({ y, w = 320 }: { y: number; w?: number }) {
  return (
    <g>
      <rect x={0} y={y} width={w} height={60} fill={C.grayLight} />
      <path d={`M0 ${y} L${w} ${y}`} {...line} strokeWidth={3} />
    </g>
  );
}

function Calendar({ x, y, s = 1, conflict = false, ok = false }: { x: number; y: number; s?: number; conflict?: boolean; ok?: boolean }) {
  return (
    <g transform={at(x, y, 0, s)}>
      <rect x={-56} y={-50} width={112} height={100} rx={5} fill={C.white} {...line} />
      <path d="M-56 -30 L-56 -45 Q-56 -50 -51 -50 L51 -50 Q56 -50 56 -45 L56 -30 Z" fill={C.navy} {...line} />
      {[0, 1, 2, 3].map((c) =>
        [0, 1, 2].map((r) => <rect key={`${c}${r}`} x={-46 + c * 24} y={-22 + r * 22} width={18} height={15} fill={C.grayLight} />),
      )}
      {conflict && (
        <>
          <rect x={-24} y={-3} width={44} height={16} rx={2} fill={C.orange} {...thin} />
          <rect x={-10} y={5} width={44} height={16} rx={2} fill={C.yellow} {...thin} opacity={0.92} />
        </>
      )}
      {ok && <rect x={2} y={0} width={18} height={15} fill={C.orange} />}
    </g>
  );
}

function Building({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={at(x, y, 0, s)}>
      <path d="M-34 0 L-34 -70 L34 -70 L34 0 Z" fill={C.grayLight} {...line} />
      <path d="M-42 -70 L0 -94 L42 -70 Z" fill={C.gray} {...line} />
      <rect x={-22} y={-54} width={16} height={16} fill={C.white} {...thin} />
      <rect x={6} y={-54} width={16} height={16} fill={C.white} {...thin} />
      <rect x={-9} y={-28} width={18} height={28} fill={C.white} {...thin} />
    </g>
  );
}

const Backdrop = ({ cx, cy, r, color = C.yellowSoft }: { cx: number; cy: number; r: number; color?: string }) => <circle cx={cx} cy={cy} r={r} fill={color} />;

/* ═══════════════════════ お悩みエリア ═══════════════════════ */

/** メイン：現場と採用を同時に抱えて困る建設会社の経営者 */
export function ProblemOwnerIllustration({ className }: P) {
  return (
    <Art viewBox="0 20 420 348" className={className}>
      <Backdrop cx={210} cy={210} r={180} />
      <Scaffold x={24} y={330} cols={2} rows={5} />
      <Scaffold x={304} y={330} cols={2} rows={3} />
      <path d="M0 330 L420 330" {...line} />
      <Hammer x={356} y={70} r={28} s={0.9} />
      <Wrench x={62} y={80} r={-30} s={0.9} />
      <CallBadge x={330} y={150} />
      <CallBadge x={70} y={196} s={0.8} />
      <Figure
        who="owner"
        x={210}
        y={190}
        s={1.2}
        expr="tired"
        tilt={-4}
        arms={[POSE.paperLow, POSE.phoneEar]}
        held={
          <>
            <Resume x={-58} y={78} r={-10} s={0.9} />
            <Phone x={40} y={-46} r={14} s={0.8} lit />
          </>
        }
      />
      <Rings x={272} y={110} />
      <Sweat x={164} y={112} />
    </Art>
  );
}

/** 1. 求人を掲載しても応募通知が0件 */
export function NoApplicantIllustration({ className }: P) {
  return (
    <Art viewBox="0 0 320 220" className={className}>
      <Backdrop cx={110} cy={130} r={92} />
      <Figure
        who="owner"
        x={102}
        y={108}
        s={0.86}
        expr="worried"
        tilt={6}
        arms={[POSE.phoneFront]}
        held={<Phone x={32} y={54} r={-12} s={0.8} lit />}
      />
      <g transform="translate(232 104)">
        <rect x={-56} y={-72} width={112} height={144} rx={10} fill={C.white} {...line} />
        <path d="M-40 -48 L40 -48 M-40 -36 L18 -36" {...thin} />
        <path d="M-17 18 C-17 -18 17 -18 17 18 L24 26 L-24 26 Z" fill={C.grayLight} {...line} />
        <path d="M-7 30 Q0 38 7 30" {...line} />
        <ellipse cx={30} cy={-12} rx={12} ry={15} fill={C.white} stroke={C.orange} strokeWidth={5} />
      </g>
    </Art>
  );
}

/** 2. 現場作業中で電話に出られない経営者 */
export function MissedCallIllustration({ className }: P) {
  return (
    <Art viewBox="0 0 320 220" className={className}>
      <Backdrop cx={160} cy={120} r={96} />
      <Scaffold x={8} y={220} cols={3} rows={4} cell={46} />
      <Scaffold x={230} y={220} cols={2} rows={4} cell={46} />
      <Figure
        who="owner"
        x={150}
        y={90}
        s={0.86}
        expr="worried"
        tilt={-5}
        arms={[POSE.pipe, POSE.hammer]}
        held={<Hammer x={92} y={-34} r={40} s={0.8} />}
      />
      <g>
        <Phone x={262} y={160} r={14} s={0.95} lit />
        <Rings x={288} y={150} />
        <Rings x={236} y={150} flip />
      </g>
      <Sweat x={198} y={40} s={0.9} />
    </Art>
  );
}

/** 3. 折り返したときには応募者が他社に決まっている */
export function LostApplicantIllustration({ className }: P) {
  return (
    <Art viewBox="0 0 320 220" className={className}>
      <Backdrop cx={92} cy={132} r={86} />
      <Figure
        who="owner"
        x={86}
        y={110}
        s={0.84}
        expr="shocked"
        arms={[POSE.phoneEar]}
        held={<Phone x={38} y={-46} r={14} s={0.75} lit />}
      />
      <Building x={268} y={216} s={1.05} />
      <Figure who="applicant" x={196} y={124} s={0.72} flip expr="smile" arms={[POSE.open]} />
      <Mark x={268} y={46} kind="ok" />
    </Art>
  );
}

/** 4. 面接予定表と現場予定が重なっている */
export function ScheduleConflictIllustration({ className }: P) {
  return (
    <Art viewBox="0 0 320 220" className={className}>
      <Backdrop cx={92} cy={132} r={86} />
      <Figure who="owner" x={92} y={110} s={0.86} expr="tired" tilt={5} arms={[POSE.headHold, POSE.headHoldR]} />
      <Calendar x={234} y={96} s={1.2} conflict />
      <g transform="translate(286 170)">
        <path d="M0 -24 L24 18 L-24 18 Z" fill={C.yellow} {...line} />
        <path d="M0 -8 L0 5" stroke={C.ink} strokeWidth={3.6} strokeLinecap="round" />
        <circle cx={0} cy={12} r={2.4} fill={C.ink} />
      </g>
    </Art>
  );
}

/** 5. 人手不足で仕事の依頼を断っている */
export function DeclinedProjectIllustration({ className }: P) {
  return (
    <Art viewBox="0 0 320 220" className={className}>
      <Backdrop cx={96} cy={132} r={88} />
      <Figure who="owner" x={92} y={112} s={0.84} expr="sorry" tilt={8} arms={[POSE.phoneEar, POSE.apologyL]} held={<Phone x={38} y={-46} r={14} s={0.75} lit />} />
      <Building x={246} y={146} s={1} />
      {[204, 246, 288].map((x) => (
        <g key={x} transform={`translate(${x} 182)`}>
          <path d="M-18 8 C-18 -16 18 -16 18 8 Z" fill={C.grayLight} stroke={C.gray} strokeWidth={2} strokeDasharray="4 4" />
          <path d="M-22 8 L22 8" stroke={C.gray} strokeWidth={2.4} strokeLinecap="round" />
        </g>
      ))}
      <Mark x={166} y={54} kind="no" />
    </Art>
  );
}

/* ═══════════════════════ サービスの流れ ═══════════════════════ */

function Flow1() {
  return (
    <>
      <Backdrop cx={160} cy={126} r={92} />
      <Figure who="owner" x={80} y={112} s={0.84} expr="calm" arms={[POSE.point]} />
      <Figure who="staff" x={246} y={112} s={0.84} flip expr="smile" arms={[POSE.type]} held={<Resume x={18} y={84} r={-6} s={0.7} />} />
      <g transform="translate(166 36)">
        <rect x={-38} y={-24} width={76} height={48} rx={12} fill={C.white} {...line} />
        <path d="M-12 8 C-12 -16 12 -16 12 8 Z" fill={C.orange} {...thin} />
        <path d="M-16 8 L16 8" {...line} />
      </g>
    </>
  );
}

function Flow2() {
  return (
    <>
      <Backdrop cx={160} cy={110} r={92} />
      <Figure who="staff" x={110} y={92} s={0.84} expr="calm" tilt={3} arms={[POSE.type, POSE.typeL]} />
      <Table y={182} />
      <Laptop x={126} y={182} s={0.8} />
      <g transform="translate(262 92)">
        <rect x={-38} y={-50} width={76} height={100} rx={4} fill={C.white} {...line} />
        <rect x={-30} y={-42} width={60} height={34} fill={C.yellow} />
        <path d="M-30 4 L30 4 M-30 14 L18 14" {...thin} />
        <rect x={-30} y={28} width={60} height={13} rx={6} fill={C.orange} />
      </g>
    </>
  );
}

function Flow3() {
  return (
    <>
      <Backdrop cx={120} cy={126} r={92} />
      <Figure who="applicant" x={110} y={104} s={0.86} expr="thinking" tilt={7} arms={[POSE.phoneFront]} held={<Phone x={30} y={56} r={-14} s={0.85} lit />} />
      <g transform="translate(244 86)">
        <rect x={-42} y={-30} width={84} height={60} rx={4} fill={C.white} {...line} />
        <rect x={-34} y={-22} width={32} height={26} fill={C.orange} />
        <path d="M6 -18 L34 -18 M6 -8 L28 -8 M-34 16 L34 16" {...thin} />
      </g>
      <path d="M204 118 Q182 136 170 146" stroke={C.orange} strokeWidth={3} strokeDasharray="3 8" strokeLinecap="round" />
    </>
  );
}

function Flow4() {
  return (
    <>
      <Backdrop cx={160} cy={126} r={92} />
      <Figure who="staff" x={84} y={112} s={0.84} expr="smile" arms={[POSE.phoneEar]} held={<Phone x={38} y={-46} r={14} s={0.75} lit />} />
      <Figure who="applicant" x={244} y={112} s={0.84} flip expr="calm" arms={[POSE.phoneEar]} held={<Phone x={38} y={-46} r={14} s={0.75} />} />
      <path d="M136 60 Q164 36 192 60" stroke={C.orange} strokeWidth={3} strokeDasharray="3 8" strokeLinecap="round" />
      <Rings x={150} y={82} />
    </>
  );
}

function Flow5() {
  return (
    <>
      <Backdrop cx={160} cy={126} r={92} />
      <Figure who="staff" x={160} y={136} s={0.72} expr="smile" arms={[POSE.phoneFront]} held={<Phone x={26} y={56} s={0.7} lit />} />
      <Calendar x={160} y={46} s={0.72} ok />
      <g transform="translate(46 96) scale(0.62)">
        <Head who="owner" expr="calm" />
      </g>
      <g transform="translate(274 96) scale(0.62)">
        <Head who="applicant" expr="calm" />
      </g>
      <path d="M70 92 Q94 62 112 56 M250 92 Q226 62 208 56" stroke={C.orange} strokeWidth={3} strokeDasharray="3 8" strokeLinecap="round" />
      <Mark x={204} y={18} kind="ok" s={0.7} />
    </>
  );
}

/** 面接の場面（経営者と応募者が直接向き合う。経営者の側に採用判断の印を置く） */
function Interview({ decide = true }: { decide?: boolean }) {
  return (
    <>
      <Backdrop cx={160} cy={118} r={94} />
      <Figure who="owner" x={80} y={100} s={0.86} expr="calm" arms={[POSE.type]} held={<Resume x={40} y={96} r={6} s={0.62} />} />
      <Figure who="applicant" x={244} y={102} s={0.84} flip expr="smile" arms={[POSE.type]} />
      <Table y={184} />
      {decide && <Mark x={128} y={34} kind="ok" s={1.05} />}
    </>
  );
}

const FLOW_SCENES = [Flow1, Flow2, Flow3, Flow4, Flow5, Interview];

/** サービスの流れ。step（1〜6）の場面を描く */
export function ServiceFlowIllustration({ step, className }: P & { step: number }) {
  const Scene = FLOW_SCENES[step - 1];
  return (
    <Art viewBox="0 0 320 220" className={className}>
      <Scene />
    </Art>
  );
}

/* ═══════════════════════ Before／After ═══════════════════════ */

export function BeforeAfterIllustration({ variant, className }: P & { variant: "before" | "after" }) {
  if (variant === "after") {
    return (
      <Art viewBox="0 0 320 220" className={className}>
        <Interview decide={false} />
      </Art>
    );
  }
  return (
    <Art viewBox="0 0 320 220" className={className}>
      <Backdrop cx={160} cy={122} r={94} />
      <Figure who="owner" x={160} y={100} s={0.86} expr="tired" tilt={-5} arms={[POSE.phoneEar, POSE.paperLow]} held={<><Phone x={38} y={-46} r={14} s={0.75} lit /><Resume x={-52} y={72} r={-8} s={0.75} /></>} />
      <Table y={190} />
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={36 + (i % 2) * 6} y={180 - i * 9} width={56} height={9} fill={C.white} {...thin} />
        ))}
        <Calendar x={262} y={70} s={0.62} conflict />
        <CallBadge x={56} y={72} s={0.8} />
        <Hammer x={262} y={150} r={70} s={0.7} />
      </g>
      <Sweat x={204} y={50} />
    </Art>
  );
}
