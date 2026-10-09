/**
 * ドラテク企業向けLPのシーンイラスト。
 * 1枚ごとに「人物＋表情＋状況＋小物」で小さなストーリーを作り、
 * 文字を読まなくても何の場面かが分かる構図にしている（パーツは kit.tsx）。
 *
 * 人物の役割
 *   社長（ownerSuit / 白髪まじり / 眼鏡） … 運送会社の経営者
 *   採用担当（suit・shirt）               … 求人を出す側
 *   ドライバー（work / 作業帽）           … 入社する側
 *   求職中のドライバー（tee・hoodie / 作業帽）… 求人を見て自分で選ぶ側
 */
import type { ReactNode } from "react";
import {
  ACCENT,
  ACCENT_LIGHT,
  ACCENT_PALE,
  Arm,
  Body,
  Bubble,
  Buzz,
  Calendar,
  CheckBadge,
  Coin,
  CrossBadge,
  DashPath,
  Desk,
  GRAY_LIGHT,
  Ground,
  Hand,
  Handset,
  Head,
  INK,
  JobSheet,
  L,
  Laptop,
  LicenseCard,
  Magnifier,
  Mark,
  NAVY,
  Person,
  Phone,
  Shield,
  Sparkle,
  Svg,
  Sweat,
  ThumbUp,
  Truck,
  TruckIcon,
  Txt,
  YELLOW,
  YELLOW_PALE,
  ZeroTag,
  type IllustrationProps,
} from "./kit";

function At({ x, y, r = 0, s = 1, children }: { x: number; y: number; r?: number; s?: number; children: ReactNode }) {
  return <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>{children}</g>;
}

/** 請求書（社長が手に持つ）。人物の座標系で描く */
function Invoice({ title, amount, y = 24, h = 58 }: { title: string; amount: string; y?: number; h?: number }) {
  return (
    <g transform="rotate(-4)">
      <rect x={-38} y={y} width={76} height={h} rx={3} fill="#fff" {...L} />
      <Txt x={0} y={y + 14} size={9}>
        {title}
      </Txt>
      <path d={`M-16 ${y + 18} L16 ${y + 18}`} stroke={INK} strokeWidth={1.4} />
      <Txt x={0} y={y + 34} size={12.5} color={ACCENT}>
        {amount}
      </Txt>
      {h > 46 && <path d={`M-24 ${y + 43} L24 ${y + 43} M-24 ${y + 50} L10 ${y + 50}`} stroke={GRAY_LIGHT} strokeWidth={3} strokeLinecap="round" />}
    </g>
  );
}

/* ═══════════════════════ お悩み（8点） ═══════════════════════ */

/** ① 求人媒体に毎月何十万円も使っている：毎月の掲載料の請求書に頭を抱える社長 */
export function ProblemMediaCost(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={110} cy={112} r={74} />
      <Calendar x={172} y={16} />
      <DashPath d="M196 70 Q204 88 200 104" />
      <Coin x={198} y={116} />
      <Coin x={222} y={140} s={0.8} />
      <Coin x={30} y={58} s={0.85} />
      <Coin x={44} y={32} s={0.65} />
      <At x={106} y={104} r={-3}>
        <Body outfit="ownerSuit" />
        <Head hair="owner" brow="worry" mouth="wavy" glasses />
        <Arm d="M-24 10 Q-50 44 -34 72" outfit="ownerSuit" />
        <Arm d="M24 10 Q50 44 34 70" outfit="ownerSuit" />
        <Invoice title="求人媒体 掲載料" amount="¥300,000" />
        <Hand x={-34} y={72} r={-20} />
        <Hand x={34} y={70} r={20} />
        <Sweat x={20} y={-50} />
        <Sweat x={-22} y={-40} s={0.8} />
      </At>
    </Svg>
  );
}

/** ② 求人を出しても応募が来ない：画面の「応募0件」を見つめる採用担当 */
export function ProblemNoApply(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={120} cy={104} r={74} />
      <Mark x={36} y={58} size={30}>
        ?
      </Mark>
      <Mark x={52} y={36} size={20}>
        ?
      </Mark>
      <At x={74} y={114}>
        <Body outfit="shirt" />
        <Head hair="bob" brow="worry" mouth="frown" look={[1.2, 0.6]} />
        <Arm d="M24 10 Q44 26 56 38" outfit="shirt" />
        <Sweat x={18} y={-48} />
      </At>
      <Desk y={152} />
      <Laptop x={164} y={152}>
        <Txt x={0} y={-38} size={9.5} color={INK}>
          今月の応募
        </Txt>
        <Txt x={0} y={-12} size={24} color={ACCENT}>
          0件
        </Txt>
      </Laptop>
      <Hand x={130} y={152} r={-70} />
      {/* 届かないメール */}
      <g transform="translate(206 44)">
        <rect x={-16} y={-11} width={32} height={22} rx={2.5} fill="#fff" {...L} />
        <path d="M-15 -9 L0 3 L15 -9" {...L} />
        <circle cx={14} cy={-11} r={7} fill={GRAY_LIGHT} {...L} strokeWidth={1.8} />
        <Txt x={14} y={-7.5} size={9}>
          0
        </Txt>
      </g>
    </Svg>
  );
}

/** ③ 応募が来ても面接につながらない：電話がつながらず、面接の席は空いたまま */
export function ProblemNoInterview(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={92} cy={104} r={70} />
      <At x={78} y={114}>
        <Body outfit="suit" />
        <Head hair="part" brow="worry" mouth="wavy" look={[1, 0]} />
        <Arm d="M-24 10 Q-36 50 -14 60" outfit="suit" />
        <Arm d="M24 10 Q40 -4 22 -22" outfit="suit" />
        <Phone x={20} y={-34} s={0.42} r={20} />
        <Hand x={22} y={-22} r={-30} />
        <Buzz x={40} y={-46} r={20} />
        <Sweat x={-22} y={-46} />
      </At>
      <Bubble x={150} y={30} w={64} h={26} tail="bl">
        <Txt x={0} y={4} size={9.5}>
          つながらない…
        </Txt>
      </Bubble>
      {/* 空いたままの面接席 */}
      <g>
        <rect x={164} y={92} width={36} height={30} rx={4} fill={ACCENT_PALE} {...L} />
        <path d="M160 124 L204 124 M166 124 L166 160 M198 124 L198 160" {...L} />
        <g transform="translate(182 72)">
          <rect x={-24} y={-11} width={48} height={20} rx={4} fill="#fff" {...L} strokeWidth={1.8} />
          <Txt x={0} y={3.5} size={8.5} color={NAVY}>
            面接 10:00
          </Txt>
        </g>
        <CrossBadge x={208} y={62} s={0.85} />
      </g>
      <Person x={226} y={118} s={0.8} filled={false} />
      <DashPath d="M206 140 Q216 132 222 128" />
    </Svg>
  );
}

/** ④ 人手不足で仕事を断っている：止まったトラックの前で、依頼の電話にお詫びする社長 */
export function ProblemTurnDown(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={110} cy={100} r={72} />
      <Truck x={84} y={172} s={0.92} dim />
      <CrossBadge x={202} y={92} />
      <At x={64} y={116} r={7}>
        <Body outfit="ownerSuit" />
        <Head hair="owner" brow="worry" mouth="wavy" eye="squeeze" glasses />
        <Arm d="M-24 10 Q-38 42 -18 50" outfit="ownerSuit" />
        <Arm d="M24 10 Q34 -6 18 -20" outfit="ownerSuit" />
        <Handset x={16} y={-26} r={-8} s={0.9} />
        <Hand x={20} y={-18} r={-30} />
        <Hand x={-18} y={50} r={-60} />
        <Sweat x={-24} y={-44} />
        <Sweat x={-30} y={-28} s={0.7} />
      </At>
      <Bubble x={152} y={30} w={108} h={28} tail="bl">
        <Txt x={0} y={4} size={9.5}>
          人が足りず…すみません
        </Txt>
      </Bubble>
    </Svg>
  );
}

/** ⑤ 大型ドライバーがなかなか採用できない：大型免許の持ち主を探しても見つからない */
export function ProblemLargeLicense(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={150} cy={96} r={70} />
      <Truck x={78} y={174} s={0.95} label="大型" />
      <At x={52} y={118}>
        <Body outfit="suit" />
        <Head hair="tidy" brow="think" mouth="side" look={[1, -1]} />
        <Arm d="M-24 10 Q-34 46 -12 56" outfit="suit" />
        <Arm d="M24 10 Q46 -2 44 -24" outfit="suit" />
        <Magnifier x={50} y={-40} r={-10} />
        <Hand x={44} y={-24} r={-10} />
      </At>
      <LicenseCard x={150} y={38} r={-6} label="大型" />
      <Mark x={192} y={50} size={28}>
        ?
      </Mark>
      <Person x={218} y={40} s={0.85} filled={false} />
    </Svg>
  );
}

/** ⑥ 採用担当者がおらず求人まで手が回らない：電話と配車に追われ、求人票は手つかず */
export function ProblemNoHR(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={110} cy={100} r={72} />
      {/* 時計 */}
      <g transform="translate(34 40)">
        <circle r={15} fill="#fff" {...L} />
        <path d="M0 -8 L0 0 L7 4" stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <At x={104} y={114}>
        <Body outfit="shirt" />
        <Head hair="messy" brow="worry" eye="squeeze" mouth="wavy" />
        <Arm d="M24 10 Q36 -6 18 -20" outfit="shirt" />
        <Handset x={16} y={-26} r={-8} s={0.9} />
        <Hand x={20} y={-18} r={-30} />
        <Buzz x={40} y={-40} r={20} />
        <Arm d="M-24 10 Q-46 30 -48 50" outfit="shirt" />
        <Sweat x={-22} y={-48} />
      </At>
      <Desk y={150} />
      {/* 配車表の山 */}
      <g transform="translate(52 150)">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={-22 + (i % 2) * 3} y={-9 - i * 8} width={44} height={9} rx={1.5} fill="#fff" {...L} />
        ))}
        <Txt x={0} y={-36.5} size={6.5}>
          配車表
        </Txt>
      </g>
      <Hand x={56} y={110} r={10} />
      {/* 手つかずの求人票 */}
      <JobSheet x={188} y={112} s={0.78} r={8} badge="未作成" lines={["勤務地", "給与", "休日"]} />
    </Svg>
  );
}

/** ⑦ 複数の求人媒体を使っていて採用費が膨らんでいる：媒体ごとの費用が1枚の請求にのしかかる */
export function ProblemMultiMedia(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={150} cy={110} r={70} />
      <JobSheet x={34} y={42} s={0.56} title="媒体A" lines={["掲載料"]} />
      <JobSheet x={80} y={34} s={0.56} title="媒体B" lines={["掲載料"]} />
      <JobSheet x={126} y={42} s={0.56} title="媒体C" lines={["掲載料"]} />
      <DashPath d="M34 70 Q60 120 128 132" />
      <DashPath d="M80 62 Q96 110 132 124" />
      <DashPath d="M126 70 Q130 100 140 118" />
      <Coin x={50} y={98} s={0.8} />
      <Coin x={92} y={92} s={0.8} />
      <Coin x={130} y={94} s={0.8} />
      <At x={176} y={108}>
        <Body outfit="ownerSuit" />
        <Head hair="owner" brow="raised" eye="wide" mouth="o" glasses />
        <Arm d="M-24 10 Q-48 40 -40 62" outfit="ownerSuit" />
        <Arm d="M24 10 Q48 40 40 62" outfit="ownerSuit" />
        <Invoice title="採用費 合計" amount="¥900,000" y={20} h={46} />
        <Hand x={-40} y={62} r={-20} />
        <Hand x={40} y={62} r={20} />
        <path d="M44 -36 L44 -58 M36 -50 L44 -58 L52 -50" stroke={ACCENT} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </At>
    </Svg>
  );
}

/** ⑧ 採用できるか分からないのに先にお金を払うのが怖い：中身の見えない箱へ、先にお金を入れるのをためらう */
export function ProblemPayFirst(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={100} cy={104} r={72} />
      <At x={74} y={112}>
        <Body outfit="ownerSuit" />
        <Head hair="owner" brow="worry" mouth="wavy" look={[1.2, 0]} glasses />
        <Arm d="M-24 10 Q-40 40 -20 56" outfit="ownerSuit" />
        <Arm d="M24 10 Q50 30 66 18" outfit="ownerSuit" />
        <Hand x={-20} y={56} r={-60} />
        <Coin x={76} y={10} gold />
        <Hand x={66} y={18} r={-80} />
        <Sweat x={20} y={-52} />
      </At>
      {/* 中身の見えない箱 */}
      <g>
        <rect x={160} y={84} width={64} height={70} rx={6} fill={GRAY_LIGHT} {...L} />
        <path d="M176 94 L208 94" stroke={INK} strokeWidth={3.2} strokeLinecap="round" />
        <Txt x={192} y={136} size={34} color="#8a93a6">
          ?
        </Txt>
        <g transform="translate(192 64)">
          <rect x={-26} y={-11} width={52} height={20} rx={4} fill={YELLOW_PALE} {...L} strokeWidth={1.8} />
          <Txt x={0} y={3.5} size={9} color={NAVY}>
            先に支払い
          </Txt>
        </g>
      </g>
      <Bubble x={56} y={26} w={84} h={26} tail="br">
        <Txt x={0} y={4} size={9}>
          採用できるかな…
        </Txt>
      </Bubble>
    </Svg>
  );
}

/* ═══════════════════════ 問題提起・転換 ═══════════════════════ */

/** 応募0件でも広告費は出ていく：穴に吸い込まれていくお金 */
export function MoneyDrain(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={90} cy={104} r={70} />
      <g transform="translate(176 44)">
        <rect x={-46} y={-30} width={92} height={60} rx={6} fill="#fff" {...L} />
        <Txt x={0} y={-8} size={11}>
          応募 0件
        </Txt>
        <path d="M-34 0 L34 0" stroke={GRAY_LIGHT} strokeWidth={2} />
        <Txt x={0} y={19} size={11}>
          採用 0人
        </Txt>
        <path d="M-20 30 L-20 46 M20 30 L20 46" {...L} />
      </g>
      <ellipse cx={168} cy={160} rx={42} ry={10} fill={NAVY} {...L} />
      <Coin x={132} y={104} />
      <Coin x={150} y={126} s={0.9} />
      <Coin x={170} y={146} s={0.75} />
      <DashPath d="M112 92 Q140 120 162 150" />
      <At x={70} y={116}>
        <Body outfit="ownerSuit" />
        <Head hair="owner" brow="worry" mouth="frown" look={[1, 0.6]} glasses />
        <Arm d="M-24 10 Q-40 40 -24 56" outfit="ownerSuit" />
        <Arm d="M24 10 Q40 30 46 20" outfit="ownerSuit" />
        <Hand x={-24} y={56} r={-60} />
        <Hand x={46} y={18} r={-80} />
        <Sweat x={-22} y={-46} />
      </At>
    </Svg>
  );
}

/** ドラテクなら採用できるまで0円：0円の札を見てほっとする社長 */
export function ZeroRelief(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={112} cy={100} r={74} />
      <Truck x={118} y={176} s={0.72} />
      <At x={76} y={112}>
        <Body outfit="ownerSuit" />
        <Head hair="owner" eye="happy" mouth="grin" blush glasses />
        <Arm d="M-24 10 Q-40 40 -22 56" outfit="ownerSuit" />
        <Hand x={-22} y={56} r={-60} />
        <Arm d="M24 10 Q48 34 44 6" outfit="ownerSuit" />
        <ThumbUp x={44} y={0} s={1.1} />
      </At>
      <ZeroTag x={172} y={52} s={1.35} r={6} />
      <Sparkle x={214} y={24} />
      <Sparkle x={130} y={24} s={0.7} />
      <Sparkle x={222} y={84} s={0.6} />
    </Svg>
  );
}

/* ═══════════════════════ 4STEP ═══════════════════════ */

/** STEP1 企業情報・求人情報を登録：ノートPCで求人の条件を入力する */
export function StepRegister(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={120} cy={100} r={72} />
      <At x={70} y={114}>
        <Body outfit="shirt" />
        <Head hair="bun" mouth="smile" look={[1.2, 0.8]} />
        <Arm d="M24 10 Q42 30 58 38" outfit="shirt" />
      </At>
      <Desk y={152} />
      <Laptop x={164} y={152}>
        {[
          ["勤務地", 0],
          ["給与", 1],
          ["免許", 2],
        ].map(([t, i]) => (
          <g key={t as string}>
            <Txt x={-34} y={-38 + (i as number) * 11} size={7} anchor="start" weight={700}>
              {t as string}
            </Txt>
            <rect x={-10} y={-44 + (i as number) * 11} width={42} height={7} rx={2} fill={ACCENT_PALE} stroke={ACCENT} strokeWidth={1} />
          </g>
        ))}
        <rect x={-14} y={-12} width={28} height={8} rx={4} fill={YELLOW} {...L} strokeWidth={1.2} />
      </Laptop>
      <Hand x={128} y={152} r={-70} />
      <CheckBadge x={214} y={78} />
      <Sparkle x={40} y={40} s={0.7} />
    </Svg>
  );
}

/** STEP2 ドライバーへ求人情報を配信：1枚の求人票が、たくさんのスマホに届く */
export function StepDeliver(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={120} cy={96} r={74} />
      <JobSheet x={120} y={54} s={0.86} highlight />
      <DashPath d="M98 86 Q60 100 46 120" />
      <DashPath d="M120 92 L120 116" />
      <DashPath d="M142 86 Q180 100 194 120" />
      {[46, 120, 194].map((px, i) => (
        <g key={px}>
          <Phone x={px} y={148} s={0.82} r={i === 0 ? -8 : i === 2 ? 8 : 0} />
          <circle cx={px + 13} cy={122} r={6} fill={YELLOW} {...L} strokeWidth={1.6} />
        </g>
      ))}
    </Svg>
  );
}

/** STEP3 求職者が求人を選択：ドライバー本人が求人を見比べて、気になる1社に応募する */
export function StepChoose(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={100} cy={104} r={72} />
      <At x={78} y={118}>
        <Body outfit="tee" />
        <Head hair="buzz" cap brow="raised" mouth="smile" look={[1, -0.6]} />
        <Arm d="M-24 10 Q-36 46 -14 54" outfit="tee" />
        <Arm d="M24 10 Q46 26 44 -2" outfit="tee" />
        <Phone x={46} y={-26} s={0.8} r={6} />
        <Hand x={44} y={-2} r={-10} />
      </At>
      <JobSheet x={168} y={58} s={0.62} r={-6} title="A社" lines={["勤務地", "給与"]} />
      <JobSheet x={208} y={98} s={0.62} r={6} title="B社" lines={["勤務地", "給与"]} highlight />
      <g transform="translate(212 140)">
        <rect x={-22} y={-10} width={44} height={20} rx={10} fill={YELLOW} {...L} strokeWidth={1.8} />
        <Txt x={0} y={4} size={9.5} color={NAVY}>
          応募
        </Txt>
      </g>
      <CheckBadge x={228} y={76} s={0.9} />
    </Svg>
  );
}

/** STEP4 直接連絡・面接・採用：トラックの前で、社長とドライバーが握手 */
export function StepHire(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={120} cy={96} r={76} />
      <Truck x={46} y={150} s={0.95} />
      <At x={78} y={126}>
        <Body outfit="ownerSuit" />
        <Head hair="owner" eye="happy" mouth="grin" glasses />
        <Arm d="M24 10 Q36 30 42 26" outfit="ownerSuit" />
      </At>
      <At x={162} y={126}>
        <Body outfit="work" />
        <Head hair="buzz" cap eye="happy" mouth="grin" blush />
        <Arm d="M-24 10 Q-36 30 -42 26" outfit="work" />
      </At>
      <Hand x={120} y={152} r={90} s={1.1} />
      <g transform="translate(120 28)">
        <rect x={-30} y={-14} width={60} height={28} rx={14} fill={YELLOW} {...L} />
        <Txt x={0} y={5.5} size={13} color={NAVY}>
          入社！
        </Txt>
      </g>
      <Sparkle x={70} y={34} s={0.8} />
      <Sparkle x={176} y={26} />
    </Svg>
  );
}

/* ═══════════════════════ 選ばれる理由 ═══════════════════════ */

/** 理由① ドライバー集客の実績：右肩上がりのグラフに応募者が並ぶ */
export function ReasonResults(props: IllustrationProps) {
  const bars = [30, 52, 74, 104];
  return (
    <Svg {...props}>
      <Ground cx={120} cy={96} r={74} />
      <rect x={36} y={26} width={168} height={130} rx={8} fill="#fff" {...L} />
      <path d="M54 140 L190 140" {...L} />
      {bars.map((h, i) => (
        <g key={h}>
          <rect x={64 + i * 32} y={140 - h} width={20} height={h} rx={2} fill={i === 3 ? ACCENT : ACCENT_LIGHT} {...L} />
          <Person x={74 + i * 32} y={130 - h} s={0.6} filled={i === 3} />
        </g>
      ))}
      <path d="M62 112 L98 96 L130 74 L178 34 M166 34 L178 34 L178 46" stroke={YELLOW} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 112 L98 96 L130 74 L178 34 M166 34 L178 34 L178 46" stroke={INK} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" opacity={0.35} />
    </Svg>
  );
}

/** 理由② 広告集客のノウハウ：スマホ広告からドライバーが集まってくる */
export function ReasonAds(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={120} cy={96} r={74} />
      {/* メガホン */}
      <g transform="translate(44 70) rotate(-14)">
        <path d="M-14 -8 L10 -20 L10 20 L-14 8 Z" fill={ACCENT_LIGHT} {...L} />
        <rect x={-24} y={-9} width={11} height={18} rx={3} fill="#fff" {...L} />
        <path d="M-18 9 L-14 24" {...L} />
        <path d="M18 -12 Q24 0 18 12 M24 -18 Q34 0 24 18" stroke={ACCENT} strokeWidth={2.4} strokeLinecap="round" />
      </g>
      <Phone x={120} y={92} s={1.5}>
        <g>
          <rect x={-12} y={-21} width={24} height={16} rx={2} fill={ACCENT_PALE} />
          <TruckIcon x={0} y={-13} s={0.6} />
          <Txt x={0} y={4} size={6}>
            募集中
          </Txt>
          <rect x={-11} y={12} width={22} height={9} rx={4.5} fill={YELLOW} {...L} strokeWidth={1} />
          <Txt x={0} y={18.6} size={5} color={NAVY}>
            応募する
          </Txt>
        </g>
      </Phone>
      <DashPath d="M150 70 Q176 56 196 52" />
      <DashPath d="M152 100 Q180 104 198 104" />
      <DashPath d="M150 130 Q176 146 196 152" />
      <Person x={208} y={50} s={0.9} />
      <Person x={212} y={104} s={0.9} />
      <Person x={206} y={154} s={0.9} />
    </Svg>
  );
}

/** 理由③ 求職者が自分で求人を選ぶ：求人を見比べて考えるドライバー */
export function ReasonSelfChoice(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={120} cy={104} r={72} />
      <JobSheet x={46} y={60} s={0.62} r={-8} title="A社" lines={["勤務地", "給与"]} />
      <JobSheet x={194} y={60} s={0.62} r={8} title="B社" lines={["勤務地", "給与"]} highlight />
      <At x={120} y={120}>
        <Body outfit="hoodie" />
        <Head hair="buzz" cap brow="think" mouth="side" look={[1.2, -0.6]} />
        <Arm d="M-24 10 Q-40 40 -12 44" outfit="hoodie" />
        <Arm d="M24 10 Q36 30 14 32" outfit="hoodie" />
        <Hand x={14} y={32} r={-30} />
        <Hand x={-12} y={44} r={30} />
      </At>
      <Bubble x={186} y={128} w={56} h={24} tail="bl">
        <Txt x={0} y={4} size={9}>
          ここに応募！
        </Txt>
      </Bubble>
    </Svg>
  );
}

/** 理由④ 応募後は直接やり取り：社長とドライバーが間に誰も挟まず直接話す */
export function ReasonDirect(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={120} cy={100} r={74} />
      <At x={62} y={118}>
        <Body outfit="ownerSuit" />
        <Head hair="owner" mouth="smile" look={[1, 0]} glasses />
        <Arm d="M24 10 Q40 34 28 52" outfit="ownerSuit" />
        <Hand x={28} y={52} r={-60} />
      </At>
      <At x={178} y={118}>
        <Body outfit="tee" />
        <Head hair="buzz" cap mouth="smile" look={[-1, 0]} />
        <Arm d="M-24 10 Q-40 34 -28 52" outfit="tee" />
        <Hand x={-28} y={52} r={60} />
      </At>
      <Bubble x={84} y={30} w={74} h={26} tail="bl">
        <Txt x={0} y={4} size={9}>
          面接しましょう
        </Txt>
      </Bubble>
      <Bubble x={164} y={46} w={66} h={26} tail="br">
        <Txt x={0} y={4} size={9}>
          お願いします
        </Txt>
      </Bubble>
      <path d="M100 150 L140 150 M132 144 L140 150 L132 156 M108 144 L100 150 L108 156" stroke={ACCENT} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** 理由⑤ 完全成果報酬：掲載・応募・面接は0円、入社のときだけ支払い */
export function ReasonSuccessFee(props: IllustrationProps) {
  const steps = ["掲載", "応募", "面接"];
  return (
    <Svg {...props}>
      <Ground cx={120} cy={96} r={74} />
      {steps.map((t, i) => (
        <g key={t} transform={`translate(${36 + i * 56} 82)`}>
          <circle r={22} fill="#fff" {...L} />
          <Txt x={0} y={4} size={10.5}>
            {t}
          </Txt>
          <g transform="translate(0 38)">
            <rect x={-20} y={-10} width={40} height={20} rx={6} fill={YELLOW} {...L} strokeWidth={1.8} />
            <Txt x={0} y={4.5} size={11} color={NAVY}>
              0円
            </Txt>
          </g>
          <path d={`M24 0 L32 0`} stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" />
        </g>
      ))}
      <g transform="translate(206 82)">
        <circle r={24} fill={NAVY} {...L} />
        <Txt x={0} y={4.5} size={11} color="#fff">
          入社
        </Txt>
        <Coin x={0} y={40} s={1.15} gold />
      </g>
      <Sparkle x={226} y={46} s={0.8} />
    </Svg>
  );
}

/* ═══════════════════════ その他 ═══════════════════════ */

/** 実績セクション：スマホから応募してくるドライバーたち */
export function DriversApplying(props: IllustrationProps) {
  const people: { x: number; hair: "buzz" | "tidy" | "messy"; outfit: "tee" | "hoodie" | "work" }[] = [
    { x: 58, hair: "buzz", outfit: "hoodie" },
    { x: 120, hair: "buzz", outfit: "work" },
    { x: 182, hair: "buzz", outfit: "tee" },
  ];
  return (
    <Svg {...props}>
      <Ground cx={120} cy={104} r={74} />
      {people.map((p, i) => (
        <At key={p.x} x={p.x} y={i === 1 ? 118 : 128} s={i === 1 ? 0.92 : 0.8}>
          <Body outfit={p.outfit} />
          <Head hair={p.hair} cap mouth={i === 1 ? "grin" : "smile"} eye={i === 1 ? "happy" : "dot"} />
          <Arm d="M24 10 Q42 24 34 -2" outfit={p.outfit} />
          <Phone x={34} y={-22} s={0.6} />
          <Hand x={34} y={-2} r={-10} />
        </At>
      ))}
      {[40, 120, 200].map((x, i) => (
        <g key={x} transform={`translate(${x + 26} ${i === 1 ? 22 : 40})`}>
          <rect x={-18} y={-9} width={36} height={18} rx={9} fill={YELLOW} {...L} strokeWidth={1.6} />
          <Txt x={0} y={3.5} size={8.5} color={NAVY}>
            応募
          </Txt>
        </g>
      ))}
    </Svg>
  );
}

/** よくある質問：あごに手を当てて考える社長 */
export function OwnerQuestion(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 150" {...props}>
      <Ground cx={120} cy={88} r={64} />
      <Mark x={64} y={46} size={30}>
        ?
      </Mark>
      <Mark x={182} y={36} size={22}>
        ?
      </Mark>
      <At x={120} y={98}>
        <Body outfit="ownerSuit" />
        <Head hair="owner" brow="think" mouth="side" look={[0.8, -0.8]} glasses />
        <Arm d="M24 10 Q40 38 12 -4" outfit="ownerSuit" />
        <Hand x={10} y={-6} r={-20} />
      </At>
    </Svg>
  );
}

/** 早期退職時の返金制度：盾と戻ってくるお金 */
export function RefundShield(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 150" {...props}>
      <Ground cx={120} cy={80} r={62} />
      <Shield x={120} y={78} s={2.4} />
      <Coin x={52} y={96} gold />
      <Coin x={188} y={96} gold />
      <path d="M66 84 Q80 60 92 58 M86 52 L92 58 L86 64" stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M174 84 Q160 60 148 58 M154 52 L148 58 L154 64" stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}
