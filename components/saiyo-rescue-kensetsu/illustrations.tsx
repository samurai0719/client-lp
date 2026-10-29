/**
 * 建設業向けLPの線画イラスト。
 * 採用レスキュー本体の parts.tsx（人物・小物）を組み合わせて描き、タッチ・線幅・配色をそろえる。
 * 足場・クレーンなど建設現場の小物だけ、このファイルで足している。
 *
 * 色について：parts の ACCENT（ブルー系）はそのまま使い、kensetsu.css の
 * 属性セレクタ（[fill="#1659e0"] など）でFV画像に合わせたオレンジ系に置き換えている。
 */
import {
  ACCENT,
  ACCENT_LIGHT,
  Applicant,
  Backdrop,
  BarChart,
  Board,
  Bubble,
  CheckBadge,
  Clipboard,
  Clock,
  Coin,
  Cross,
  DashPath,
  GRAY_LIGHT,
  INK,
  JobCard,
  LaptopFront,
  Mark,
  Person,
  Phone,
  STROKE,
  Sparkle,
  Svg,
  Sweat,
  type IllustrationProps,
} from "@/components/saiyo-rescue/illustrations/parts";

const line = {
  stroke: INK,
  strokeWidth: STROKE,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* ═══════════════════════ 現場の小物 ═══════════════════════ */

/** 足場（単管の格子＋踏み板）。原点は左下 */
function Scaffold({ x, y, cols = 3, rows = 3, cell = 34 }: { x: number; y: number; cols?: number; rows?: number; cell?: number }) {
  const w = cols * cell;
  const h = rows * cell;
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: cols + 1 }, (_, i) => (
        <path key={`v${i}`} d={`M${i * cell} 0 L${i * cell} ${-h}`} {...line} />
      ))}
      {Array.from({ length: rows }, (_, r) => (
        <g key={`r${r}`}>
          {/* 踏み板 */}
          <rect x={-2} y={-(r + 1) * cell - 3} width={w + 4} height={6} rx={1.5} fill={ACCENT_LIGHT} {...line} />
          {/* 筋交い */}
          <path
            d={`M${(r % cols) * cell} ${-r * cell} L${((r % cols) + 1) * cell} ${-(r + 1) * cell}`}
            stroke={INK}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </g>
      ))}
      {/* ジャッキベース */}
      {Array.from({ length: cols + 1 }, (_, i) => (
        <path key={`b${i}`} d={`M${i * cell - 5} 0 L${i * cell + 5} 0`} stroke={INK} strokeWidth={STROKE + 1} strokeLinecap="round" />
      ))}
    </g>
  );
}

/** カレンダー（予定が埋められない＝仕事を断る） */
function Calendar({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-22} y={-20} width={44} height={40} rx={4} fill="#fff" {...line} />
      <rect x={-22} y={-20} width={44} height={11} rx={4} fill={ACCENT} {...line} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect key={`${r}${c}`} x={-16 + c * 9} y={-3 + r * 8} width={5} height={4} rx={1} fill={r === 1 && c === 2 ? ACCENT : GRAY_LIGHT} />
        )),
      )}
    </g>
  );
}

/** カード地の色（地面より下を塗って人物の足元を切るのに使う） */
const PAPER = "#fbf9f4";

/** 地面のライン（下側をカード地の色で塗って人物の足元を切る） */
function Ground({ y, x1 = 0, x2 = 240 }: { y: number; x1?: number; x2?: number }) {
  return (
    <g>
      <rect x={x1} y={y} width={x2 - x1} height={400} fill={PAPER} />
      <path d={`M${x1 + 6} ${y} L${x2 - 6} ${y}`} stroke={INK} strokeWidth={STROKE + 0.4} strokeLinecap="round" />
    </g>
  );
}

/* ═══════════════════════ シーン ═══════════════════════ */

/** 悩み1：求人広告にお金を払っても応募が来ない */
export function ProblemCost(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={96} cy={92} r={66} />
      <DashPath d="M136 100 Q170 70 186 44" />
      <Coin x={190} y={36} />
      <Coin x={210} y={66} s={0.85} />
      <JobCard x={196} y={118} label="求人" />
      <Mark x={222} y={104} size={20}>0</Mark>
      <Person x={92} y={66} outfit="builder" hair="short" expr="worry" pose="headHold" />
      <Sweat x={122} y={50} />
    </Svg>
  );
}

/** 悩み2：人手が足りず、受けたい仕事を断っている */
export function ProblemDecline(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={100} cy={92} r={66} />
      <Calendar x={192} y={52} />
      <Cross x={212} y={34} s={0.85} />
      <Person x={98} y={66} outfit="builder" hair="side" expr="worry" pose="phone">
        <Phone x={10} y={46} s={0.8} content="msg" />
      </Person>
      <Bubble x={182} y={118} w={86} h={28} tail="bl">
        <text x={0} y={5} textAnchor="middle" fontSize={12} fontWeight={900} fill={INK} fontFamily="inherit">
          すみません…
        </text>
      </Bubble>
    </Svg>
  );
}

/** 悩み3：社長が現場に出ていて採用まで手が回らない */
export function ProblemBusy(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={110} cy={90} r={66} />
      <Scaffold x={150} y={150} cols={2} rows={3} cell={32} />
      <Clock x={44} y={38} />
      <Person x={104} y={68} outfit="builder" hair="short" expr="worry" pose="holdDoc">
        <Clipboard x={0} y={58} />
      </Person>
      <Sweat x={134} y={50} />
      <Sweat x={76} y={58} s={0.8} />
      <Ground y={150} />
    </Svg>
  );
}

/** 悩み4：求人原稿や広告の作り方が分からない */
export function ProblemWriting(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={110} cy={90} r={66} />
      <Bubble x={186} y={38} w={46} h={32} tail="bl">
        <Mark x={0} y={8} size={20}>?</Mark>
      </Bubble>
      <Person x={104} y={66} outfit="builder" hair="side" expr="think" pose="chin" />
      <g transform="translate(184 118)">
        <rect x={-26} y={-30} width={52} height={60} rx={4} fill="#fff" {...line} />
        <text x={0} y={-12} textAnchor="middle" fontSize={11} fontWeight={900} fill={ACCENT} fontFamily="inherit">
          求人原稿
        </text>
        <path d="M-16 0 L16 0 M-16 9 L10 9" stroke={GRAY_LIGHT} strokeWidth={3} strokeLinecap="round" />
        <Mark x={0} y={26} size={14} color={INK}>?</Mark>
      </g>
    </Svg>
  );
}

/** 最終CTA：応募が届いて安心する社長と職人 */
export function CrewRelief(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 300 170" {...props}>
      <ellipse cx={150} cy={170} rx={150} ry={70} fill={ACCENT} opacity={0.1} />
      <Sparkle x={40} y={34} s={0.9} />
      <Sparkle x={262} y={28} s={0.7} />
      <Person x={90} y={64} outfit="builder" hair="side" expr="happy" pose="thumbsUp" />
      <Person x={170} y={70} outfit="builder" hair="short" expr="smile" pose="down" />
      <Person x={240} y={72} outfit="builder" hair="short" expr="happy" pose="wave" />
    </Svg>
  );
}

/* ═══════════════════════ サービス内容 ═══════════════════════ */

/** 01 採用LP制作：社長の話をもとに、スマホで読める採用ページを作る */
export function ServiceLp(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={86} cy={96} r={62} />
      <Person x={84} y={68} outfit="builder" hair="side" expr="smile" pose="point" />
      <g transform="translate(184 86)">
        <rect x={-30} y={-54} width={60} height={108} rx={9} fill="#fff" {...line} />
        <rect x={-22} y={-42} width={44} height={26} rx={2} fill={ACCENT_LIGHT} />
        <path d="M-22 -6 L18 -6 M-22 2 L10 2 M-22 10 L16 10" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        <rect x={-20} y={22} width={40} height={12} rx={6} fill={ACCENT} />
      </g>
      <Sparkle x={222} y={24} s={0.8} />
    </Svg>
  );
}

/** 02 広告クリエイティブ制作：バナーと動画 */
export function ServiceCreative(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={120} cy={90} r={66} />
      <g transform="translate(70 92)">
        <rect x={-44} y={-34} width={88} height={68} rx={6} fill="#fff" {...line} />
        <rect x={-36} y={-26} width={72} height={34} rx={3} fill={ACCENT_LIGHT} />
        <path d="M-28 18 L20 18 M-28 26 L6 26" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        <text x={0} y={-4} textAnchor="middle" fontSize={13} fontWeight={900} fill={ACCENT} fontFamily="inherit">
          募集中
        </text>
      </g>
      <g transform="translate(176 88)">
        <rect x={-28} y={-50} width={56} height={100} rx={8} fill="#fff" {...line} />
        <rect x={-21} y={-40} width={42} height={70} rx={3} fill={INK} />
        <path d="M-7 -18 L11 -5 L-7 8 Z" fill="#fff" />
        <rect x={-18} y={36} width={36} height={6} rx={3} fill={ACCENT} />
      </g>
      <Sparkle x={128} y={34} s={0.8} />
      <Sparkle x={220} y={30} s={0.6} />
    </Svg>
  );
}

/** 03 広告運用：広告から求職者を採用ページへ集める */
export function ServiceAds(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={120} cy={92} r={66} />
      <g transform="translate(64 92)">
        <path d="M-26 -12 L6 -28 L6 28 L-26 12 Z" fill={ACCENT} {...line} />
        <rect x={-38} y={-14} width={14} height={28} rx={3} fill="#fff" {...line} />
        <path d="M-30 14 L-24 36 L-14 36 L-18 14" fill="#fff" {...line} />
        <path d="M16 -18 Q26 0 16 18 M26 -28 Q42 0 26 28" stroke={ACCENT} strokeWidth={3} strokeLinecap="round" />
      </g>
      <DashPath d="M110 92 Q150 60 182 72" />
      <Applicant x={168} y={110} />
      <Applicant x={194} y={98} />
      <Applicant x={210} y={126} filled={false} />
      <Phone x={196} y={56} s={0.85} />
    </Svg>
  );
}

/** 04 改善：数字を見ながら、反応の良い見せ方を伸ばす */
export function ServiceImprove(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={160} cy={92} r={62} />
      <Board x={110} y={30} w={104} h={80}>
        <BarChart x={14} y={70} s={0.95} />
      </Board>
      <Person x={66} y={68} outfit="builder" hair="short" expr="happy" pose="thumbsUp" />
      <CheckBadge x={214} y={30} />
    </Svg>
  );
}

/** 相談〜開始の流れ：打ち合わせ */
export function Meeting(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={120} cy={96} r={66} />
      <Person x={66} y={70} outfit="builder" hair="side" expr="smile" pose="down" />
      <Person x={176} y={70} flip outfit="suit" hair="short" expr="smile" pose="present">
        <LaptopFront x={-50} y={66} s={0.6} />
      </Person>
      <Bubble x={120} y={28} w={44} h={28} tail="bl" fill={ACCENT_LIGHT}>
        <text x={0} y={5} textAnchor="middle" fontSize={13} fontWeight={900} fill={INK} fontFamily="inherit">
          OK!
        </text>
      </Bubble>
      <rect x={0} y={146} width={240} height={30} fill={PAPER} />
      <path d="M10 146 L230 146" stroke={INK} strokeWidth={STROKE + 0.4} strokeLinecap="round" />
    </Svg>
  );
}

/* ═══════════════════════ 区切り・装飾 ═══════════════════════ */

/**
 * 設計図風の現場シルエット（セクションの区切り用・横長）。
 * クレーン・建物の骨組み・足場・寸法線を細い線で描く。
 */
export function BlueprintSkyline(props: IllustrationProps) {
  const thin = { stroke: INK, strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <Svg viewBox="0 0 1200 180" {...props}>
      {/* 地面 */}
      <path d="M0 176 L1200 176" stroke={INK} strokeWidth={2} />
      {/* クレーン */}
      <g {...thin}>
        <path d="M150 176 L150 30 M164 176 L164 30" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M150 ${176 - i * 12} L164 ${164 - i * 12}`} />
        ))}
        <path d="M100 30 L420 30 L420 22 L100 22 Z" />
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={`M${104 + i * 20} 30 L${114 + i * 20} 22`} />
        ))}
        <path d="M157 22 L157 4 L100 22 M157 4 L420 22" />
        <path d="M380 30 L380 92" />
      </g>
      <path d="M100 22 L420 22 L420 30 L100 30 Z" fill={ACCENT} opacity={0.85} />
      <rect x={364} y={92} width={32} height={10} fill={ACCENT_LIGHT} stroke={INK} strokeWidth={1.4} />
      {/* 建物の骨組み */}
      <g {...thin}>
        {[0, 1, 2, 3, 4].map((c) => (
          <path key={`c${c}`} d={`M${520 + c * 60} 176 L${520 + c * 60} 56`} />
        ))}
        {[0, 1, 2, 3].map((r) => (
          <path key={`r${r}`} d={`M512 ${176 - (r + 1) * 30} L768 ${176 - (r + 1) * 30}`} />
        ))}
        <path d="M520 146 L580 116 M640 116 L700 86 M580 86 L640 56" />
      </g>
      <path d="M512 56 L768 56 L768 50 L512 50 Z" fill={ACCENT} opacity={0.85} />
      {/* 足場 */}
      <g {...thin}>
        {[0, 1, 2, 3].map((c) => (
          <path key={`s${c}`} d={`M${860 + c * 34} 176 L${860 + c * 34} 92`} />
        ))}
        {[0, 1, 2].map((r) => (
          <path key={`t${r}`} d={`M852 ${176 - (r + 1) * 28} L970 ${176 - (r + 1) * 28}`} strokeWidth={3} />
        ))}
        <path d="M860 176 L894 148 M928 148 L962 120 M894 120 L928 92" />
      </g>
      {/* 寸法線 */}
      <g stroke={ACCENT} strokeWidth={1.2} fill="none">
        <path d="M520 40 L760 40 M520 34 L520 46 M760 34 L760 46" />
        <path d="M1010 56 L1010 176 M1004 56 L1016 56 M1004 176 L1016 176" />
        <path d="M860 80 L962 80 M860 74 L860 86 M962 74 L962 86" />
      </g>
      <text x={640} y={34} textAnchor="middle" fontSize={11} fill={ACCENT} fontFamily="inherit">3,640</text>
      <text x={1024} y={120} fontSize={11} fill={ACCENT} fontFamily="inherit">2,730</text>
      <text x={911} y={74} textAnchor="middle" fontSize={11} fill={ACCENT} fontFamily="inherit">910</text>
      <path d="M1080 176 L1080 150 L1150 150 L1150 176" {...thin} />
      <path d="M1090 150 L1115 132 L1140 150" {...thin} />
    </Svg>
  );
}
