/**
 * ドライバー採用サービス（候補者プロフィール検索）LPの線画イラスト。
 * パーツはドラテク企業向けLPの kit.tsx を使い、文字を読まなくても場面が分かる構図にしている。
 * 青系の色は scout.css で、このLPの深緑系に置き換えて表示する（.ds-lp svg の属性セレクタ）。
 *
 * 人物の役割
 *   社長（ownerSuit / 白髪まじり / 眼鏡）… 運送会社の経営者
 *   ドライバー（work / 作業帽）           … 候補者・社員
 */
import type { ReactNode } from "react";
import {
  ACCENT,
  Arm,
  Body,
  Bubble,
  Calendar,
  CheckBadge,
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
  Magnifier,
  Mark,
  NAVY,
  Person,
  Phone,
  Sparkle,
  Svg,
  Sweat,
  ThumbUp,
  Truck,
  Txt,
  YELLOW,
  YELLOW_PALE,
  type IllustrationProps,
} from "../driver-company/lp/illustrations/kit";

export { ProblemTurnDown } from "../driver-company/lp/illustrations/scenes";

function At({ x, y, r = 0, s = 1, children }: { x: number; y: number; r?: number; s?: number; children: ReactNode }) {
  return <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>{children}</g>;
}

/** ノートPCの画面に並ぶ候補者の行（匿名。人型アイコンと灰色の線だけ） */
function ProfileRows({ pick }: { pick?: number }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(-34 ${-49 + i * 15})`}>
          <rect x={-2} y={-1} width={72} height={13} rx={3} fill={pick === i ? YELLOW_PALE : "#fff"} stroke={pick === i ? YELLOW : "none"} strokeWidth={1.6} />
          <Person x={6} y={7.5} s={0.42} filled={pick === i} />
          <rect x={14} y={2} width={34} height={3.4} rx={1.7} fill={GRAY_LIGHT} />
          <rect x={14} y={7.5} width={22} height={2.6} rx={1.3} fill={GRAY_LIGHT} />
          <rect x={52} y={2.5} width={14} height={7} rx={3.5} fill={pick === i ? ACCENT : GRAY_LIGHT} />
        </g>
      ))}
    </g>
  );
}

/* ═══════════════════════ 概要の3段階 ═══════════════════════ */

/** ① どんな人がいるか見る：社長がノートPCで候補者の一覧を見ている */
export function SceneLook(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Ground cx={124} cy={92} r={70} />
      <At x={62} y={104}>
        <Body outfit="ownerSuit" />
        <Head hair="owner" brow="raised" mouth="smile" look={[1.2, 0.4]} glasses />
        <Arm d="M24 10 Q46 26 60 42" outfit="ownerSuit" />
        <Hand x={60} y={42} r={-30} />
      </At>
      <Desk y={150} />
      <Laptop x={168} y={150} s={1.05}>
        <ProfileRows />
      </Laptop>
      <Magnifier x={206} y={46} s={0.95} r={-8} />
    </Svg>
  );
}

/** ② 会ってみたい人を選ぶ：一覧の1人に印を付け、社長が親指を立てる */
export function SceneChoose(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Ground cx={124} cy={92} r={70} />
      <At x={60} y={104}>
        <Body outfit="ownerSuit" />
        <Head hair="owner" eye="happy" mouth="grin" glasses />
        <Arm d="M-24 10 Q-40 4 -34 -18" outfit="ownerSuit" />
        <ThumbUp x={-34} y={-26} s={1.1} />
      </At>
      <Desk y={150} />
      <Laptop x={168} y={150} s={1.05}>
        <ProfileRows pick={1} />
      </Laptop>
      <CheckBadge x={214} y={84} s={1.1} />
      <Bubble x={160} y={28} w={104} h={28} tail="bl">
        <Txt x={0} y={4} size={10}>
          この人に会いたい
        </Txt>
      </Bubble>
    </Svg>
  );
}

/** ③ 相手の同意後に連絡する：社長とドライバーが電話で話す */
export function SceneContact(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Ground cx={120} cy={96} r={72} />
      <At x={58} y={110}>
        <Body outfit="ownerSuit" />
        <Head hair="owner" mouth="open" glasses />
        <Arm d="M24 10 Q34 -6 18 -20" outfit="ownerSuit" />
        <Handset x={16} y={-26} r={-8} s={0.9} />
        <Hand x={20} y={-18} r={-30} />
      </At>
      <At x={182} y={110}>
        <Body outfit="work" />
        <Head hair="buzz" cap eye="happy" mouth="grin" blush />
        <Arm d="M-24 10 Q-34 -6 -18 -20" outfit="work" />
        <Phone x={-16} y={-28} s={0.5} r={8} />
        <Hand x={-20} y={-18} r={30} />
      </At>
      <DashPath d="M86 72 Q120 50 154 72" />
      <Desk y={154} />
      <Bubble x={120} y={24} w={124} h={28} tail="bl">
        <Txt x={0} y={4} size={10}>
          お話を聞かせてください
        </Txt>
      </Bubble>
    </Svg>
  );
}

/* ═══════════════════════ 経営者の悩み ═══════════════════════ */

/** トラックはあるのに、乗る人がいない：止まったトラックと、空いた運転席 */
export function ProblemNoDriver(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={120} cy={96} r={72} />
      <Truck x={30} y={160} s={1.15} dim />
      <Mark x={196} y={58} size={34}>
        ?
      </Mark>
      <Person x={60} y={46} s={1.2} filled={false} />
      <CrossBadge x={76} y={36} s={0.9} />
    </Svg>
  );
}

/** 採用してもすぐ辞めてしまい、また募集している：出ていく人と、また貼られる求人票 */
export function ProblemRepeat(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={120} cy={96} r={72} />
      <JobSheet x={72} y={92} s={1.05} r={-6} title="募集" badge="また" lines={["勤務地", "給与", "免許"]} />
      <path d="M128 70 L196 70" stroke={INK} strokeWidth={2.4} strokeDasharray="2 6" strokeLinecap="round" />
      <path d="M188 62 L198 70 L188 78" {...L} />
      <Person x={150} y={104} s={1.05} filled={false} />
      <Person x={184} y={110} s={1.05} filled={false} />
      <path d="M120 134 Q160 160 200 134" stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" fill="none" />
      <path d="M126 126 L120 134 L129 139" stroke={ACCENT} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

/** 欠員を埋めるために、社員の負担が増えている：残業続きで疲れたドライバー */
export function ProblemOverload(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={120} cy={96} r={72} />
      <Calendar x={150} y={34} s={1.1} label="残業" />
      <At x={92} y={112}>
        <Body outfit="work" />
        <Head hair="buzz" cap brow="worry" eye="squeeze" mouth="wavy" />
        <Arm d="M-24 10 Q-36 40 -16 50" outfit="work" />
        <Arm d="M24 10 Q30 -10 10 -22" outfit="work" />
        <Hand x={12} y={-22} r={-40} />
        <Hand x={-16} y={50} r={-60} />
        <Sweat x={-26} y={-46} />
        <Sweat x={-34} y={-28} s={0.7} />
      </At>
      <Desk y={170} />
    </Svg>
  );
}

/** 社長自身が運転していて、会社のことを考える時間がない：ハンドルを握る社長と、手つかずの書類 */
export function ProblemOwnerDrives(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Ground cx={120} cy={96} r={72} />
      <JobSheet x={196} y={70} s={0.7} r={8} title="経営" lines={["売上", "採用"]} />
      <Mark x={196} y={26} size={22}>
        …
      </Mark>
      <At x={86} y={108}>
        <Body outfit="ownerSuit" />
        <Head hair="owner" cap brow="worry" mouth="flat" glasses />
        <Arm d="M-24 10 Q-30 34 -10 44" outfit="ownerSuit" />
        <Arm d="M24 10 Q30 34 10 44" outfit="ownerSuit" />
      </At>
      {/* ハンドル */}
      <g transform="translate(86 154)">
        <circle r={30} fill="none" stroke={INK} strokeWidth={6} />
        <circle r={30} fill="none" stroke={NAVY} strokeWidth={3} />
        <path d="M-28 6 L28 6 M0 6 L0 28" stroke={NAVY} strokeWidth={5} strokeLinecap="round" />
      </g>
      <Hand x={64} y={146} r={-80} />
      <Hand x={108} y={146} r={80} />
      <Sweat x={52} y={52} />
    </Svg>
  );
}

/* ═══════════════════════ 入社前に話すこと ═══════════════════════ */

/** 面接で、社長とドライバーが働き方の話をしている */
export function SceneInterview(props: IllustrationProps) {
  return (
    <Svg viewBox="0 0 240 170" {...props}>
      <Ground cx={120} cy={96} r={72} />
      <At x={62} y={112}>
        <Body outfit="ownerSuit" />
        <Head hair="owner" mouth="smile" look={[1, 0]} glasses />
        <Arm d="M24 10 Q40 30 52 36" outfit="ownerSuit" />
      </At>
      <At x={178} y={112}>
        <Body outfit="work" />
        <Head hair="buzz" cap mouth="smile" look={[-1, 0]} />
        <Arm d="M-24 10 Q-40 30 -52 36" outfit="work" />
      </At>
      <Desk y={150} />
      <JobSheet x={120} y={140} s={0.5} title="条件" lines={["休日", "給与"]} />
      <Bubble x={58} y={26} w={84} h={28} tail="br">
        <Txt x={0} y={4} size={10}>
          休みは？
        </Txt>
      </Bubble>
      <Bubble x={184} y={30} w={96} h={28} tail="bl">
        <Txt x={0} y={4} size={10}>
          手積みは？
        </Txt>
      </Bubble>
      <Sparkle x={120} y={60} s={0.8} color={YELLOW} />
    </Svg>
  );
}
