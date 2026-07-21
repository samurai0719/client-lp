// ─────────────────────────────────────────────────────────────────────────────
// 新築外構LP（/new-exterior）共通データ
// 悩み・工事内容・事例・選ばれる理由・流れ・FAQはすべて配列で管理。
// 実際の実績・写真が確定したらこのファイルの値を置き換えるだけで画面に反映されます。
// 料金表の価格は config/exterior-pricing.ts を参照（ベタ書き禁止）。
// 対応エリアはリフォームLPと共通のため components/gaikou/data.ts を参照する。
// ─────────────────────────────────────────────────────────────────────────────

import { newExteriorLpPriceTable } from "@/config/exterior-pricing";

// ── 新築外構でよくある悩み ──────────────────────────────────────────
export type ProblemItem = {
  iconKey: string;
  text: string;
  image?: string;
};

export const problems: ProblemItem[] = [
  { iconKey: "file-text", text: "ハウスメーカーの外構見積もりが高い" },
  { iconKey: "car-front", text: "駐車場やカーポートの費用感が分からない" },
  { iconKey: "sparkles", text: "建物に合うおしゃれな外構にしたい" },
  { iconKey: "wallet", text: "予算内でどこまでできるか知りたい" },
  { iconKey: "calendar-clock", text: "引き渡しまでに外構を間に合わせたい" },
  { iconKey: "layers", text: "門柱・フェンス・庭・アプローチをまとめて相談したい" },
];

// ── 直接相談するメリット ────────────────────────────────────────────
export type MeritItem = {
  iconKey: string;
  title: string;
  body: string;
};

export const merits: MeritItem[] = [
  {
    iconKey: "handshake",
    title: "中間マージンを抑えやすい",
    body: "外構専門会社へ直接ご相談いただくことで、紹介料や管理費などの中間コストを抑えられる可能性があります。",
  },
  {
    iconKey: "sparkles",
    title: "同じ予算でも内容を充実させやすい",
    body: "余計な中間費用がかからないぶん、同じご予算でもカーポートのグレードアップや植栽の追加など、施工内容を充実させやすくなります。",
  },
  {
    iconKey: "pencil-ruler",
    title: "建物に合うデザインを直接提案",
    body: "外構の専門スタッフが図面や現地を確認し、建物の外観・色味に合わせた外構プランを直接ご提案します。",
  },
  {
    iconKey: "messages-square",
    title: "要望を施工者へそのまま伝えられる",
    body: "お客様のご要望が営業会社を経由せず施工チームへ届くため、細かいニュアンスまで反映しやすくなります。",
  },
];

// ── 対応できる工事内容 ──────────────────────────────────────────────
export type ServiceItem = {
  iconKey: string;
  title: string;
  /** ミニイラストの種類（components/new-exterior/svg/ServiceIllust.tsx） */
  illust: import("./svg/ServiceIllust").ServiceIllustKind;
  /** 写真が用意できたらパスを入れるとイラストの代わりに表示される */
  image?: string;
};

export const services: ServiceItem[] = [
  { iconKey: "layers", title: "駐車場コンクリート", illust: "parking" },
  { iconKey: "warehouse", title: "カーポート", illust: "carport" },
  { iconKey: "mailbox", title: "門柱・ポスト", illust: "gate" },
  { iconKey: "footprints", title: "アプローチ", illust: "approach" },
  { iconKey: "fence", title: "フェンス・目隠し", illust: "fence" },
  { iconKey: "sprout", title: "人工芝・庭づくり", illust: "grass" },
  { iconKey: "grid-3x3", title: "砂利敷き・防草シート", illust: "gravel" },
  { iconKey: "square-stack", title: "ウッドデッキ", illust: "deck" },
  { iconKey: "sun", title: "テラス", illust: "terrace" },
  { iconKey: "brick-wall", title: "境界ブロック", illust: "block" },
  { iconKey: "tree-deciduous", title: "植栽", illust: "planting" },
  { iconKey: "home", title: "外構一式プラン", illust: "full" },
];

// ── 新築外構の人気プランと総額目安 ──────────────────────────────────
// image が空の間は「写真準備中」のプレースホルダーが表示される。
// 写真が確定したら public/images/new-exterior/works/ へ新しいファイル名で追加し、
// パスを入れるだけで差し替えできる（同名上書きはキャッシュが残るため避ける）。
// price は「総額目安」として大きく表示される（例: "98万円"）。
export type WorkItem = {
  id: number;
  image: string;
  title: string;
  price: string;
  duration: string;
  description: string;
};

export const works: WorkItem[] = [
  {
    id: 1,
    image: "/images/new-exterior/works/case1.png",
    title: "駐車場2台＋カーポートプラン",
    price: "98万円",
    duration: "7〜10日",
    description: "駐車場コンクリート、2台用カーポート、土間まわりをまとめた人気プランです。",
  },
  {
    id: 2,
    image: "/images/new-exterior/works/case2.png",
    title: "シンプルモダン外構プラン",
    price: "118万円",
    duration: "10〜14日",
    description: "駐車場、門柱、アプローチをシンプルにまとめた新築外構プランです。",
  },
  {
    id: 3,
    image: "/images/new-exterior/works/case3.png",
    title: "ナチュラル外構プラン",
    price: "128万円",
    duration: "10〜14日",
    description: "植栽や自然素材風のデザインを取り入れた、やわらかい雰囲気の外構プランです。",
  },
  {
    id: 4,
    image: "/images/new-exterior/works/case4.png",
    title: "門柱＋アプローチプラン",
    price: "49万円",
    duration: "5〜7日",
    description: "機能門柱、ポスト、表札、玄関までのアプローチを整えるプランです。",
  },
  {
    id: 5,
    image: "/images/new-exterior/works/case5.png",
    title: "目隠しフェンスプラン",
    price: "29万円",
    duration: "2〜4日",
    description: "道路や隣地からの視線を防ぐ、追加相談の多いプランです。",
  },
  {
    id: 6,
    image: "/images/new-exterior/works/case6.png",
    title: "人工芝の庭プラン",
    price: "19万円",
    duration: "2〜4日",
    description: "お手入れしやすく、見た目もきれいな庭に仕上げるプランです。",
  },
  {
    id: 7,
    image: "/images/new-exterior/works/case7.png",
    title: "コンクリート駐車場プラン",
    price: "39万円",
    duration: "3〜6日",
    description: "新築時に優先されやすい、駐車場まわりの基本プランです。",
  },
  {
    id: 8,
    image: "/images/new-exterior/works/case8.png",
    title: "外構一式プラン",
    price: "148万円",
    duration: "14〜21日",
    description: "駐車場、門柱、アプローチ、フェンス、庭まわりまで一社にまとめて依頼したい方向けの一式プランです。",
  },
];

// ── 外構デザイン例 ──────────────────────────────────────────────────
// 画像はシミュレーターのデザインテイストと共通（public/images/simulator/）。
// 差し替えるときは新しいファイル名で追加してパスを変更する。
export type DesignExample = {
  id: number;
  image: string;
  name: string;
  description: string;
};

export const designExamples: DesignExample[] = [
  {
    id: 1,
    image: "/images/simulator/simple-modern.png",
    name: "シンプルモダン",
    description: "白・グレー・黒を基調にした、直線的ですっきりとしたデザイン。",
  },
  {
    id: 2,
    image: "/images/simulator/natural.png",
    name: "ナチュラル",
    description: "木目や植栽、人工芝を取り入れた自然で明るいデザイン。",
  },
  {
    id: 3,
    image: "/images/simulator/japanese-modern.png",
    name: "和モダン",
    description: "自然石・砂利・木目を取り入れた落ち着きのあるデザイン。",
  },
  {
    id: 4,
    image: "/images/simulator/luxury-modern.png",
    name: "高級モダン",
    description: "大判タイルや石材、間接照明を使った上質なデザイン。",
  },
  {
    id: 5,
    image: "/images/simulator/scandinavian.png",
    name: "北欧風",
    description: "明るい色合いと木目を組み合わせたやわらかなデザイン。",
  },
  {
    id: 6,
    image: "/images/simulator/resort.png",
    name: "リゾート風",
    description: "明るいタイルと開放感のある植栽で仕上げる、非日常感のあるデザイン。",
  },
];

// ── 料金目安 ────────────────────────────────────────────────────────
export type PriceItem = {
  label: string;
  price: string;
  note?: string;
};

// 価格の実数値は config/exterior-pricing.ts が唯一のソース。
export const prices: PriceItem[] = newExteriorLpPriceTable.map((row) => ({
  label: row.label,
  price: row.price,
  note: row.note,
}));

// ── 選ばれる理由 ────────────────────────────────────────────────────
export type ReasonItem = {
  iconKey: string;
  title: string;
  body: string;
};

export const reasons: ReasonItem[] = [
  {
    iconKey: "map-pinned",
    title: "東海エリアに対応",
    body: "岐阜・愛知・三重の東海エリアに対応。地域密着だから、施工後のご相談もしやすい体制です。",
  },
  {
    iconKey: "circle-check-big",
    title: "現地調査・見積もり無料",
    body: "現地調査もお見積もりも無料です。内容にご納得いただけない場合、費用は一切かかりません。",
  },
  {
    iconKey: "pencil-ruler",
    title: "新築住宅に合う外構プランを提案",
    body: "建物の外観・色味・間取りに合わせて、住まい全体がまとまって見える外構デザインをご提案します。",
  },
  {
    iconKey: "list-checks",
    title: "予算に合わせて優先順位を整理",
    body: "「まず駐車場と門柱、庭はあとから」など、ご予算内でできることの優先順位を一緒に整理します。",
  },
  {
    iconKey: "layers",
    title: "駐車場から庭までまとめて相談可能",
    body: "駐車場・カーポート・門柱・フェンス・庭まで、窓口ひとつでまとめてご相談いただけます。",
  },
  {
    iconKey: "file-text",
    title: "ハウスメーカー見積もりとの比較相談も可能",
    body: "現在お持ちの外構見積もりをもとに、費用や施工内容を比較しながらご提案できます。",
  },
  {
    iconKey: "smartphone",
    title: "スマホから簡単に診断・相談できる",
    body: "30秒ほどの診断フォームに答えるだけで相談完了。忙しい引っ越し準備の合間でも簡単です。",
  },
];

// ── 相談から施工までの流れ ──────────────────────────────────────────
export type FlowStep = {
  step: number;
  title: string;
  body: string;
};

export const flowSteps: FlowStep[] = [
  { step: 1, title: "診断フォーム入力", body: "スマホから30秒ほどで完了します。建築中・引き渡し前でもOKです。" },
  { step: 2, title: "担当者から連絡", body: "内容を確認のうえ、担当者からご連絡します。" },
  { step: 3, title: "現地調査・ヒアリング", body: "現地や図面を確認し、ご希望・ご予算をお伺いします（無料）。" },
  { step: 4, title: "プラン・見積もり提案", body: "建物に合う外構プランとお見積もりをご提案します。" },
  { step: 5, title: "ご契約・施工開始", body: "内容にご納得いただいてからご契約。引き渡し時期に合わせて施工します。" },
];

// ── よくある質問 ────────────────────────────────────────────────────
export type FaqItem = {
  q: string;
  a: string;
};

export const faqs: FaqItem[] = [
  {
    q: "ハウスメーカーの外構見積もりと比較しても大丈夫ですか？",
    a: "はい、可能です。現在の見積もり内容をもとに、費用や施工内容を比較しながらご提案できます。",
  },
  {
    q: "まだ建築中でも相談できますか？",
    a: "はい、可能です。引き渡し前の段階でも、図面や現地状況を確認しながらご相談いただけます。",
  },
  {
    q: "外構の予算が決まっていなくても大丈夫ですか？",
    a: "はい、大丈夫です。希望内容をお聞きしたうえで、優先順位を整理しながらご提案します。",
  },
  {
    q: "駐車場とカーポートだけでも相談できますか？",
    a: "はい、部分工事の相談も可能です。",
  },
  {
    q: "見積もりは無料ですか？",
    a: "はい、現地調査・お見積もりは無料です。",
  },
  {
    q: "支払い方法とタイミングを教えてください",
    a: "現金でのお支払いに対応しています（銀行振込も可）。着工前に工事代金の20%、施工完了後に残り80%をお支払いいただく分割払いです。詳しくは契約時にご説明します。",
  },
];
