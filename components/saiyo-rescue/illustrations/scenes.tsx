/**
 * 採用レスキューLPの線画イラスト（シーン）。
 * すべて parts.tsx の人物・小物の組み合わせで描いているため、タッチ・線幅・配色が統一される。
 * 各コンポーネントは width / height / className / title を受け取れる。
 */
import {
  ACCENT,
  ACCENT_LIGHT,
  Applicant,
  Backdrop,
  BarChart,
  Board,
  Bubble,
  Calculator,
  CheckBadge,
  Clipboard,
  Clock,
  Coin,
  Cross,
  DashPath,
  Desk,
  Dots,
  Envelope,
  Gloom,
  INK,
  JobCard,
  LaptopBack,
  LaptopFront,
  Mark,
  PaperStack,
  Person,
  Phone,
  Shield,
  Sparkle,
  Svg,
  Sweat,
  type IllustrationProps,
} from "./parts";

/* ═══════════════════════ 悩み・課題 ═══════════════════════ */

/** 1. 悩む採用担当者（応募が来ない） */
export function ConcernedManager(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={120} cy={92} r={70} />
      <Gloom x={182} y={36} s={1.4} />
      <Mark x={64} y={46} size={30}>?</Mark>
      <Person x={120} y={64} outfit="suit" hair="short" expr="worry" pose="headHold" />
      <Sweat x={150} y={52} />
    </Svg>
  );
}

/** 3. ノートPCの前で困っている人物（何を書けばいいか分からない） */
export function LaptopTrouble(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={120} cy={86} r={68} />
      <Bubble x={186} y={32} w={44} h={30} tail="bl">
        <Mark x={0} y={8} size={20}>?</Mark>
      </Bubble>
      <Person x={118} y={66} outfit="blouse" hair="bob" expr="worry" pose="typing" />
      <Sweat x={88} y={50} />
      <Desk y={140} />
      <LaptopBack x={118} y={140} s={1.15} />
    </Svg>
  );
}

/** 9. コストに悩んでいる人物（求人媒体にお金がかかる） */
export function CostWorry(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={110} cy={90} r={68} />
      <DashPath d="M150 104 Q180 70 196 40" />
      <Coin x={198} y={34} />
      <Coin x={214} y={62} s={0.85} />
      <Coin x={182} y={84} s={0.75} />
      <Person x={104} y={64} outfit="suit" hair="side" expr="worry" pose="calc">
        <Calculator x={2} y={74} s={1.05} />
      </Person>
      <Sweat x={74} y={46} />
    </Svg>
  );
}

/** 16. 応募が来ても欲しい人材ではない（ミスマッチ） */
export function Mismatch(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={90} cy={92} r={64} />
      <Person x={84} y={66} outfit="suit" hair="short" expr="think" pose="holdDoc">
        <Clipboard x={0} y={58} />
      </Person>
      <Applicant x={170} y={54} filled={false} />
      <Applicant x={204} y={54} filled={false} />
      <Applicant x={187} y={100} filled={false} />
      <Cross x={182} y={44} s={0.8} />
      <Cross x={216} y={44} s={0.8} />
      <Mark x={140} y={38} size={24}>?</Mark>
    </Svg>
  );
}

/** 17. 忙しそうな担当者（採用を担当できる人がいない） */
export function BusyStaff(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={120} cy={88} r={68} />
      <Clock x={196} y={36} />
      <Person x={120} y={66} outfit="suit" hair="side" expr="worry" pose="typing" />
      <Sweat x={150} y={48} />
      <Sweat x={90} y={56} s={0.8} />
      <Desk y={140} />
      <PaperStack x={46} y={140} />
      <PaperStack x={196} y={140} s={0.9} />
      <LaptopBack x={120} y={140} />
    </Svg>
  );
}

/** 8. 比較検討している人物（条件だけで比較される／競合に取られる） */
export function Comparing(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={84} cy={92} r={62} />
      <Person x={80} y={66} outfit="casual" hair="short" expr="think" pose="chin" />
      <JobCard x={160} y={74} label="A社" />
      <JobCard x={208} y={74} label="B社" />
      <Mark x={184} y={34} size={22}>?</Mark>
      <Mark x={132} y={40} size={16} color={INK}>?</Mark>
    </Svg>
  );
}

/** 応募が面接につながらない */
export function NoInterview(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={150} cy={92} r={64} />
      <Applicant x={34} y={40} />
      <Applicant x={60} y={30} s={0.85} />
      <DashPath d="M48 58 Q70 92 98 104" />
      <Cross x={104} y={108} s={0.9} />
      <Person x={160} y={66} outfit="suit" hair="short" expr="worry" pose="phone" flip>
        <Phone x={10} y={46} s={0.85} />
      </Person>
    </Svg>
  );
}

/* ═══════════════════════ 相談・説明・信頼 ═══════════════════════ */

/** 2. 2人で相談している人物（無料相談・ヒアリング） */
export function Consulting(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 260 170" {...props}>
      <Backdrop cx={130} cy={96} r={74} />
      <Bubble x={92} y={26} w={46} h={28} tail="br">
        <Dots />
      </Bubble>
      <Bubble x={172} y={22} w={40} h={26} tail="bl" fill={ACCENT_LIGHT}>
        <Dots color={INK} />
      </Bubble>
      <Person x={72} y={72} outfit="suit" hair="short" expr="smile" pose="present" />
      <Person x={190} y={72} outfit="blouse" hair="long" expr="smile" pose="holdDoc" flip>
        <Clipboard x={0} y={58} check />
      </Person>
      <Desk y={146} />
    </Svg>
  );
}

/** 4. 資料を持って説明する人物 */
export function Presentation(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={70} cy={98} r={60} />
      <Board x={118} y={26} w={108} h={78}>
        <rect x={12} y={12} width={36} height={26} rx={3} fill={ACCENT_LIGHT} />
        <path d="M56 16 L94 16 M56 26 L88 26 M56 36 L80 36" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <path d="M14 54 L19 59 L28 49 M36 54 L94 54" stroke={ACCENT} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 66 L19 71 L28 61 M36 66 L84 66" stroke={ACCENT} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </Board>
      <Person x={64} y={68} outfit="blouse" hair="bun" expr="smile" pose="point" />
    </Svg>
  );
}

/** 5. グラフを見せている人物（実績・成果） */
export function GrowthChart(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={70} cy={98} r={60} />
      <Board x={116} y={20} w={110} h={86}>
        <BarChart x={16} y={76} />
      </Board>
      <Sparkle x={232} y={16} s={0.9} />
      <Person x={62} y={70} outfit="suit" hair="side" expr="smile" pose="point" />
    </Svg>
  );
}

/** 親身に話を聞く・サポートする担当者（相談歓迎） */
export function Support(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 220 170" {...props}>
      <Backdrop cx={104} cy={94} r={70} />
      <Bubble x={170} y={34} w={70} h={34} tail="bl" fill={ACCENT}>
        <text y={5} textAnchor="middle" fontSize={13} fontWeight={900} fill="#fff" fontFamily="inherit">
          相談無料
        </text>
      </Bubble>
      <Person x={100} y={66} outfit="suit" hair="short" expr="smile" pose="wave" />
    </Svg>
  );
}

/** 分析・改善している人物 */
export function Analyzing(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={120} cy={88} r={68} />
      <g transform="translate(170 18)">
        <rect width={58} height={44} rx={5} fill="#fff" stroke={INK} strokeWidth={2.4} />
        <BarChart x={8} y={38} s={0.5} />
      </g>
      <Sparkle x={32} y={34} s={0.8} />
      <Person x={110} y={66} outfit="suit" hair="side" expr="think" pose="typing" />
      <Desk y={140} />
      <LaptopBack x={110} y={140} />
    </Svg>
  );
}

/* ═══════════════════════ 前向き・成果 ═══════════════════════ */

/** 6. 成果に喜ぶ人物（応募が集まる） */
export function Celebrate(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={120} cy={92} r={70} />
      <Applicant x={36} y={60} />
      <Applicant x={204} y={60} />
      <Applicant x={30} y={112} s={0.9} />
      <Applicant x={210} y={112} s={0.9} />
      <Sparkle x={70} y={22} />
      <Sparkle x={176} y={20} s={0.8} />
      <Person x={120} y={70} outfit="blouse" hair="long" expr="happy" pose="cheer" />
    </Svg>
  );
}

/** 応募者がLPに集まってくる（求人媒体以外からも応募） */
export function ApplicantsGather(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={170} cy={88} r={62} />
      <DashPath d="M40 32 Q110 30 150 66" />
      <DashPath d="M30 90 Q100 96 150 88" />
      <DashPath d="M54 146 Q110 130 150 108" />
      <Applicant x={28} y={30} />
      <Applicant x={18} y={92} />
      <Applicant x={44} y={146} />
      <Phone x={176} y={88} s={1.7} />
      <CheckBadge x={204} y={42} />
    </Svg>
  );
}

/** 選ばれる会社（比較されても魅力が伝わる） */
export function ChosenCompany(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={84} cy={92} r={62} />
      <JobCard x={160} y={80} label="他社" />
      <JobCard x={208} y={80} label="自社" highlight />
      <CheckBadge x={224} y={50} />
      <Person x={78} y={66} outfit="casual" hair="bob" expr="happy" pose="point" />
    </Svg>
  );
}

/** 18. パソコンで設計している人物（採用戦略・LP制作） */
export function Designing(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={84} cy={92} r={62} />
      <g transform="translate(150 16)">
        <rect width={74} height={40} rx={5} fill="#fff" stroke={INK} strokeWidth={2.4} />
        <rect x={8} y={8} width={22} height={24} rx={2} stroke={ACCENT} strokeWidth={1.8} strokeDasharray="3 3" />
        <path d="M38 12 L64 12 M38 20 L60 20 M38 28 L54 28" stroke={ACCENT} strokeWidth={1.8} strokeLinecap="round" />
      </g>
      <DashPath d="M150 60 Q140 80 150 96" />
      <Person x={70} y={70} outfit="suit" hair="short" expr="smile" pose="present" />
      <Desk y={146} />
      <LaptopFront x={176} y={146} s={1.15} content="wire" />
    </Svg>
  );
}

/** 公開されたLPを見て喜ぶ人物（公開・応募開始） */
export function LaunchSuccess(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={90} cy={92} r={64} />
      <Phone x={186} y={84} s={1.5} />
      <Applicant x={150} y={30} s={0.8} />
      <Applicant x={222} y={34} s={0.8} />
      <Applicant x={226} y={132} s={0.8} />
      <CheckBadge x={208} y={54} s={0.9} />
      <Sparkle x={146} y={120} s={0.8} />
      <Person x={82} y={68} outfit="suit" hair="side" expr="happy" pose="thumbsUp" />
    </Svg>
  );
}

/* ═══════════════════════ 不安解消・安心・申込み ═══════════════════════ */

/** 疑問を持っている人物（FAQ） */
export function Questioning(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 220 170" {...props}>
      <Backdrop cx={100} cy={92} r={66} />
      <Bubble x={172} y={34} w={48} h={34} tail="bl">
        <Mark x={0} y={8} size={22}>?</Mark>
      </Bubble>
      <Person x={96} y={68} outfit="suit" hair="short" expr="think" pose="chin" />
    </Svg>
  );
}

/** 資料を見て納得・安心している人物 */
export function Relief(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 220 170" {...props}>
      <Backdrop cx={100} cy={92} r={66} />
      <CheckBadge x={170} y={40} s={1.3} />
      <Sparkle x={36} y={40} s={0.8} />
      <Person x={100} y={68} outfit="blouse" hair="bob" expr="happy" pose="chest" />
    </Svg>
  );
}

/** 10. 安心して申し込む人物（返金保証） */
export function GuaranteeRelief(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 220 170" {...props}>
      <Backdrop cx={96} cy={92} r={66} />
      <Shield x={172} y={58} s={1.7} />
      <Sparkle x={206} y={18} s={0.8} />
      <Person x={88} y={68} outfit="suit" hair="short" expr="happy" pose="thumbsUp" />
    </Svg>
  );
}

/** プランを比較している人物（料金） */
export function PlanCompare(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={82} cy={92} r={62} />
      <g transform="translate(140 30)">
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={i * 30}
            y={i === 2 ? -8 : 0}
            width={26}
            height={i === 2 ? 70 : 62}
            rx={4}
            fill={i === 2 ? ACCENT_LIGHT : "#fff"}
            stroke={i === 2 ? ACCENT : INK}
            strokeWidth={2.4}
          />
        ))}
        <path d="M6 14 L20 14 M36 14 L50 14 M66 8 L80 8" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      </g>
      <CheckBadge x={213} y={18} s={0.8} />
      <Person x={78} y={68} outfit="suit" hair="side" expr="think" pose="calc">
        <Calculator x={2} y={74} />
      </Person>
    </Svg>
  );
}

/** メッセージを送る人物（問い合わせ） */
export function SendMessage(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Backdrop cx={92} cy={92} r={64} />
      <DashPath d="M120 92 Q160 40 196 36" />
      <Envelope x={204} y={34} />
      <Bubble x={176} y={98} w={46} h={28} tail="bl" fill={ACCENT_LIGHT}>
        <Dots color={INK} />
      </Bubble>
      <Person x={86} y={68} outfit="blouse" hair="long" expr="smile" pose="phone">
        <Phone x={10} y={46} s={0.8} content="msg" />
      </Person>
    </Svg>
  );
}

/* ═══════════════════════ 業種別の人物（単体） ═══════════════════════ */

const SOLO = "0 0 120 150";

/** 11. 看護師 */
export function NurseFigure(props: IllustrationProps) {
  return (
    <Svg viewBox={SOLO} {...props}>
      <Backdrop cx={60} cy={84} r={52} />
      <Person x={60} y={52} outfit="nurse" hair="bob" expr="smile" pose="down" />
    </Svg>
  );
}

/** 12. ドライバー */
export function DriverFigure(props: IllustrationProps) {
  return (
    <Svg viewBox={SOLO} {...props}>
      <Backdrop cx={60} cy={84} r={52} />
      <Person x={56} y={52} outfit="driver" hair="short" expr="smile" pose="thumbsUp" />
    </Svg>
  );
}

/** 13. 建設業 */
export function BuilderFigure(props: IllustrationProps) {
  return (
    <Svg viewBox={SOLO} {...props}>
      <Backdrop cx={60} cy={84} r={52} />
      <Person x={60} y={54} outfit="builder" hair="short" expr="smile" pose="crossed" />
    </Svg>
  );
}

/** 14. 薬剤師・医療系 */
export function PharmacistFigure(props: IllustrationProps) {
  return (
    <Svg viewBox={SOLO} {...props}>
      <Backdrop cx={60} cy={84} r={52} />
      <Person x={60} y={52} outfit="pharmacist" hair="long" expr="smile" pose="down" />
    </Svg>
  );
}

/** 15. 会社員・経営者 */
export function BusinessFigure(props: IllustrationProps) {
  return (
    <Svg viewBox={SOLO} {...props}>
      <Backdrop cx={60} cy={84} r={52} />
      <Person x={60} y={52} outfit="suit" hair="side" expr="smile" pose="crossed" />
    </Svg>
  );
}

/** 複数業種の人物が並ぶ（FV・CTA用） */
export function TeamLineup(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 440 150" {...props}>
      <ellipse cx={220} cy={150} rx={210} ry={70} fill={ACCENT} opacity={0.08} />
      <Sparkle x={24} y={30} s={0.9} />
      <Sparkle x={420} y={24} s={0.7} />
      <Person x={60} y={56} outfit="nurse" hair="bob" expr="smile" pose="wave" />
      <Person x={140} y={52} outfit="driver" hair="short" expr="happy" pose="down" />
      <Person x={220} y={48} outfit="suit" hair="side" expr="smile" pose="thumbsUp" />
      <Person x={300} y={54} outfit="builder" hair="short" expr="happy" pose="down" />
      <Person x={380} y={56} outfit="pharmacist" hair="long" expr="smile" pose="down" />
    </Svg>
  );
}
