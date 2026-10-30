/**
 * 職人採用エージェントLPの場面イラスト（inline SVG）。
 * 建設業LP（/kensetsu）と同じ parts.tsx の人物・小物で描き、タッチ・線幅・配色をそろえている。
 * 色は kensetsu.css の属性セレクタでオレンジ系に置き換わる。文字は SVG に入れず HTML で出す。
 *
 * 登場人物：経営者＝builder（hair="side"）／採用担当＝suit／応募する職人＝casual
 */
import {
  ACCENT,
  ACCENT_LIGHT,
  Applicant,
  Backdrop,
  Bubble,
  CheckBadge,
  Clipboard,
  Clock,
  Cross,
  DashPath,
  Dots,
  GRAY_LIGHT,
  INK,
  LaptopBack,
  PaperStack,
  Person,
  Phone,
  STROKE,
  Sparkle,
  Svg,
  Sweat,
} from "@/components/saiyo-rescue/illustrations/parts";

const line = { stroke: INK, strokeWidth: STROKE, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const PAPER = "#fbf9f4";

type P = { className?: string };

/** 地面・机のライン（下側をカード地の色で塗って人物の足元を切る） */
function Floor({ y, w = 240 }: { y: number; w?: number }) {
  return (
    <g>
      <rect x={0} y={y} width={w} height={60} fill={PAPER} />
      <path d={`M6 ${y} L${w - 6} ${y}`} stroke={INK} strokeWidth={STROKE + 0.4} strokeLinecap="round" />
    </g>
  );
}

function Scaffold({ x, y, cols, rows, cell = 32 }: { x: number; y: number; cols: number; rows: number; cell?: number }) {
  const w = cols * cell;
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: cols + 1 }, (_, i) => (
        <path key={i} d={`M${i * cell} 0 L${i * cell} ${-rows * cell}`} {...line} />
      ))}
      {Array.from({ length: rows }, (_, r) => (
        <g key={r}>
          <rect x={-2} y={-(r + 1) * cell - 3} width={w + 4} height={6} rx={1.5} fill={ACCENT_LIGHT} {...line} />
          <path d={`M${(r % cols) * cell} ${-r * cell} L${((r % cols) + 1) * cell} ${-(r + 1) * cell}`} stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

function Calendar({ x, y, s = 1, conflict = false }: { x: number; y: number; s?: number; conflict?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-30} y={-28} width={60} height={56} rx={4} fill="#fff" {...line} />
      <rect x={-30} y={-28} width={60} height={14} rx={4} fill={ACCENT} {...line} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={-23 + c * 12} y={-8 + r * 11} width={8} height={7} rx={1} fill={GRAY_LIGHT} />),
      )}
      {conflict && (
        <>
          <rect x={-11} y={3} width={24} height={9} rx={1.5} fill={ACCENT} {...line} strokeWidth={1.6} />
          <rect x={-3} y={8} width={24} height={9} rx={1.5} fill={INK} />
        </>
      )}
    </g>
  );
}

function Building({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-30} y={-62} width={60} height={62} fill="#fff" {...line} />
      <rect x={-32} y={-68} width={64} height={7} rx={1.5} fill={ACCENT} {...line} />
      {[0, 1].map((r) =>
        [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-22 + c * 17} y={-52 + r * 18} width={10} height={11} fill={GRAY_LIGHT} {...line} strokeWidth={1.4} />),
      )}
    </g>
  );
}

function Hammer({ x, y, r = 0, s = 1 }: { x: number; y: number; r?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <rect x={-3} y={-4} width={6} height={36} rx={2} fill={ACCENT_LIGHT} {...line} />
      <path d="M-14 -13 L12 -13 L17 -8 L12 -3 L-14 -3 Z" fill={INK} />
    </g>
  );
}

/** 着信の波線 */
function Rings({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const f = flip ? -1 : 1;
  return (
    <g stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round">
      <path d={`M${x} ${y - 7} Q${x + 6 * f} ${y} ${x} ${y + 7}`} />
      <path d={`M${x + 7 * f} ${y - 12} Q${x + 17 * f} ${y} ${x + 7 * f} ${y + 12}`} />
    </g>
  );
}

/** 着信の吹き出し */
function CallBubble({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <Bubble x={x} y={y} s={s} w={44} h={30} tail="bl">
      <path d="M-10 -7 Q-9 6 6 9 L9 3 L3 0 L0 2 Q-4 1 -5 -3 L-2 -5 L-5 -10 Z" fill={ACCENT} />
    </Bubble>
  );
}

/* ═══════════════════════ お悩みエリア ═══════════════════════ */

/** メイン：現場と採用業務を同時に抱えて困る経営者（スマホ＋応募書類、背景に足場・工具・着信） */
export function ProblemOwnerIllustration({ className }: P) {
  return (
    <Svg viewBox="0 0 360 192" className={className}>
      <Backdrop cx={180} cy={112} r={92} />
      <Scaffold x={24} y={190} cols={2} rows={4} cell={34} />
      <Scaffold x={270} y={190} cols={2} rows={3} cell={34} />
      <Hammer x={304} y={42} r={24} s={1.1} />
      <Clock x={70} y={36} />
      <CallBubble x={276} y={78} />
      <CallBubble x={94} y={96} s={0.8} />
      <Person x={180} y={84} scale={1.05} outfit="builder" hair="side" expr="worry" pose="phone">
        <Phone x={10} y={46} s={0.8} content="msg" />
        <Clipboard x={-44} y={70} s={1.05} />
      </Person>
      <Sweat x={148} y={66} />
      <Sweat x={214} y={58} s={0.8} />
      <path d="M6 190 L354 190" stroke={INK} strokeWidth={STROKE + 0.4} strokeLinecap="round" />
    </Svg>
  );
}

/** 1. 求人を掲載しても応募通知が0件 */
export function NoApplicantIllustration({ className }: P) {
  return (
    <Svg viewBox="0 0 240 170" className={className}>
      <Backdrop cx={84} cy={94} r={62} />
      <Person x={80} y={66} outfit="builder" hair="side" expr="worry" pose="phone">
        <Phone x={10} y={46} s={0.8} content="msg" />
      </Person>
      <g transform="translate(180 84)">
        <rect x={-42} y={-56} width={84} height={112} rx={8} fill="#fff" {...line} />
        <Applicant x={-20} y={-22} filled={false} />
        <Applicant x={20} y={-22} filled={false} />
        <Applicant x={0} y={18} filled={false} />
      </g>
      <Cross x={222} y={32} />
    </Svg>
  );
}

/** 2. 現場作業中で電話に出られない経営者 */
export function MissedCallIllustration({ className }: P) {
  return (
    <Svg viewBox="0 0 240 170" className={className}>
      <Backdrop cx={100} cy={92} r={62} />
      <Scaffold x={8} y={160} cols={1} rows={4} cell={36} />
      <Person x={104} y={66} outfit="builder" hair="side" expr="worry" pose="point">
        <Hammer x={72} y={32} r={60} s={0.9} />
      </Person>
      <Sweat x={132} y={46} />
      <Floor y={160} />
      <Phone x={204} y={128} s={0.72} />
      <Rings x={222} y={120} />
      <Rings x={186} y={120} flip />
    </Svg>
  );
}

/** 3. 折り返したときには応募者が他社に決まっている */
export function LostApplicantIllustration({ className }: P) {
  return (
    <Svg viewBox="0 0 240 170" className={className}>
      <Backdrop cx={72} cy={94} r={58} />
      <Person x={68} y={68} outfit="builder" hair="side" expr="surprise" pose="phone">
        <Phone x={10} y={46} s={0.8} content="msg" />
      </Person>
      <Building x={204} y={160} s={0.92} />
      <Person x={150} y={84} scale={0.86} flip outfit="casual" hair="short" expr="happy" pose="thumbsUp" />
      <CheckBadge x={204} y={84} />
      <Floor y={160} />
    </Svg>
  );
}

/** 4. 面接予定表と現場予定が重なっている */
export function ScheduleConflictIllustration({ className }: P) {
  return (
    <Svg viewBox="0 0 240 170" className={className}>
      <Backdrop cx={84} cy={94} r={62} />
      <Person x={84} y={68} outfit="builder" hair="side" expr="worry" pose="headHold" />
      <Calendar x={184} y={72} s={1.2} conflict />
      <Cross x={218} y={36} s={0.9} />
      <Sweat x={124} y={44} />
    </Svg>
  );
}

/** 5. 人手不足で仕事の依頼を断っている */
export function DeclinedProjectIllustration({ className }: P) {
  return (
    <Svg viewBox="0 0 240 170" className={className}>
      <Backdrop cx={80} cy={94} r={62} />
      <Person x={76} y={66} outfit="builder" hair="side" expr="worry" pose="phone">
        <Phone x={10} y={46} s={0.8} content="msg" />
      </Person>
      <Scaffold x={142} y={156} cols={2} rows={3} cell={36} />
      <Cross x={160} y={32} />
      {[160, 196, 228].map((x) => (
        <g key={x} transform={`translate(${x} 150)`}>
          <path d="M-13 6 C-13 -13 13 -13 13 6 Z" fill="#fff" stroke={INK} strokeWidth={1.8} strokeDasharray="3 3" />
        </g>
      ))}
      <Floor y={157} />
    </Svg>
  );
}

/* ═══════════════════════ サービスの流れ ═══════════════════════ */

const scenes = [
  /* 1 経営者が採用したい人物像を伝える */
  <>
    <Backdrop cx={120} cy={96} r={64} />
    <Person x={66} y={70} outfit="builder" hair="side" expr="smile" pose="point" />
    <Person x={180} y={70} flip outfit="suit" hair="short" expr="smile" pose="holdDoc">
      <Clipboard x={0} y={58} check />
    </Person>
    <Bubble x={116} y={28} w={46} h={28} tail="bl" fill={ACCENT_LIGHT}>
      <Dots color={INK} />
    </Bubble>
  </>,
  /* 2 採用担当がPCで採用LP・広告を作る */
  <>
    <Backdrop cx={120} cy={92} r={64} />
    <Person x={92} y={64} outfit="suit" hair="short" expr="smile" pose="typing" />
    <Floor y={140} />
    <LaptopBack x={92} y={140} s={1.1} />
    <Phone x={186} y={86} s={1.2} />
    <Sparkle x={218} y={34} s={0.8} />
  </>,
  /* 3 職人がスマホで求人を見て応募を考える */
  <>
    <Backdrop cx={90} cy={96} r={62} />
    <Person x={86} y={68} outfit="casual" hair="short" expr="think" pose="phone">
      <Phone x={10} y={46} s={0.8} />
    </Person>
    <DashPath d="M126 96 Q150 66 166 62" />
    <g transform="translate(192 62)">
      <rect x={-30} y={-24} width={60} height={48} rx={4} fill="#fff" {...line} />
      <rect x={-23} y={-17} width={22} height={18} fill={ACCENT} />
      <path d="M5 -13 L23 -13 M5 -5 L18 -5 M-23 11 L23 11" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
    </g>
    <Applicant x={194} y={124} />
  </>,
  /* 4 採用担当が応募者へ連絡する */
  <>
    <Backdrop cx={120} cy={96} r={64} />
    <Person x={66} y={70} outfit="suit" hair="short" expr="smile" pose="phone">
      <Phone x={10} y={46} s={0.8} content="msg" />
    </Person>
    <Person x={176} y={70} flip outfit="casual" hair="short" expr="smile" pose="phone">
      <Phone x={10} y={46} s={0.8} content="msg" />
    </Person>
    <DashPath d="M100 44 Q120 22 142 44" />
  </>,
  /* 5 採用担当が面接日程を調整する */
  <>
    <Backdrop cx={120} cy={96} r={64} />
    <Person x={78} y={68} outfit="suit" hair="short" expr="smile" pose="present" />
    <Calendar x={174} y={84} s={1.2} />
    <CheckBadge x={206} y={50} />
  </>,
];

/** 面接の場面。経営者と応募者が直接向き合い、経営者の側に判断の印を置く */
function Interview({ decide }: { decide: boolean }) {
  return (
    <>
      <Backdrop cx={120} cy={92} r={64} />
      <Person x={66} y={64} outfit="builder" hair="side" expr="smile" pose="holdDoc">
        <Clipboard x={0} y={58} />
      </Person>
      <Person x={176} y={68} flip outfit="casual" hair="short" expr="smile" pose="down" />
      <Floor y={142} />
      {decide && <CheckBadge x={102} y={28} />}
    </>
  );
}

/** サービスの流れ。step（1〜6）の場面を描く */
export function ServiceFlowIllustration({ step, className }: P & { step: number }) {
  return (
    <Svg viewBox="0 0 240 170" className={className}>
      {step === 6 ? <Interview decide /> : scenes[step - 1]}
    </Svg>
  );
}

/* ═══════════════════════ Before／After ═══════════════════════ */

export function BeforeAfterIllustration({ variant, className }: P & { variant: "before" | "after" }) {
  return (
    <Svg viewBox="0 0 240 170" className={className}>
      {variant === "after" ? (
        <Interview decide={false} />
      ) : (
        <>
          <Backdrop cx={120} cy={92} r={64} />
          <Clock x={196} y={34} />
          <CallBubble x={50} y={38} />
          <Person x={120} y={66} outfit="builder" hair="side" expr="worry" pose="headHold" />
          <Sweat x={158} y={44} />
          <Floor y={142} />
          <PaperStack x={46} y={142} />
          <PaperStack x={198} y={142} s={0.9} />
        </>
      )}
    </Svg>
  );
}
