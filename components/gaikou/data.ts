// ─────────────────────────────────────────────────────────────────────────────
// 外構リフォームLP（/gaikou）共通データ
// 施工事例・料金・FAQなどはすべて配列で管理。実際の実績・金額が確定したら
// このファイルの値を置き換えるだけで画面に反映されます。
// 料金表の価格は config/exterior-pricing.ts を参照（ベタ書き禁止）。
// ─────────────────────────────────────────────────────────────────────────────

import { lpPriceTable } from "@/config/exterior-pricing";
import { municipalities } from "@/data/gaikou/municipalities";

export type WorkItem = {
  id: number;
  image: string;
  beforeImage?: string;
  afterImage?: string;
  category: string;
  title: string;
  area: string;
  price: string;
  duration: string;
};

// 施工事例8件（写真・施工内容・エリア・金額・工期確定済み）
export const works: WorkItem[] = [
  {
    id: 1,
    image: "",
    beforeImage: "/images/gaikou/works/case1-before.png",
    afterImage: "/images/gaikou/works/case1-after.png",
    category: "",
    title: "砂利敷きの駐車場を土間コンクリートへ",
    area: "岐阜県岐阜市",
    price: "68万円",
    duration: "7日間",
  },
  {
    id: 2,
    image: "",
    beforeImage: "/images/gaikou/works/case2-before.png",
    afterImage: "/images/gaikou/works/case2-after.png",
    category: "",
    title: "デザインコンクリートと植栽の外構リフォーム",
    area: "愛知県一宮市",
    price: "88万円",
    duration: "10日間",
  },
  {
    id: 3,
    image: "",
    beforeImage: "/images/gaikou/works/case3-before.png",
    afterImage: "/images/gaikou/works/case3-after.png",
    category: "",
    title: "玄関アプローチと駐車場のリフォーム",
    area: "三重県桑名市",
    price: "52万円",
    duration: "6日間",
  },
  {
    id: 4,
    image: "",
    beforeImage: "/images/gaikou/works/case4-before.png",
    afterImage: "/images/gaikou/works/case4-after.png",
    category: "",
    title: "庭を撤去して駐車スペースを1台分増設",
    area: "岐阜県各務原市",
    price: "82万円",
    duration: "9日間",
  },
  {
    id: 5,
    image: "",
    beforeImage: "/images/gaikou/works/case5-before.png",
    afterImage: "/images/gaikou/works/case5-after.png",
    category: "",
    title: "タイルテラスと人工芝のお庭リフォーム",
    area: "愛知県春日井市",
    price: "78万円",
    duration: "7日間",
  },
  {
    id: 6,
    image: "",
    beforeImage: "/images/gaikou/works/case6-before.png",
    afterImage: "/images/gaikou/works/case6-after.png",
    category: "",
    title: "2台用カーポートと土間コンクリート工事",
    area: "岐阜県大垣市",
    price: "118万円",
    duration: "12日間",
  },
  {
    id: 7,
    image: "",
    beforeImage: "/images/gaikou/works/case7-before.png",
    afterImage: "/images/gaikou/works/case7-after.png",
    category: "",
    title: "レンガ目地を取り入れた洋風駐車場リフォーム",
    area: "愛知県名古屋市守山区",
    price: "78万円",
    duration: "8日間",
  },
  {
    id: 8,
    image: "",
    beforeImage: "/images/gaikou/works/case8-before.png",
    afterImage: "/images/gaikou/works/case8-after.png",
    category: "",
    title: "洋風コンクリートと外構ライトアップ工事",
    area: "三重県四日市市",
    price: "95万円",
    duration: "9日間",
  },
];

export type ProblemItem = {
  iconKey: string;
  text: string;
  image?: string;
};

export const problems: ProblemItem[] = [
  { iconKey: "wind", text: "砂利が道路や玄関に飛び散る", image: "/images/gaikou/problems/problem-1.png" },
  { iconKey: "cloud-rain", text: "雨の日に駐車場がぬかるむ", image: "/images/gaikou/problems/problem-2.png" },
  { iconKey: "sprout", text: "毎年の草むしりが大変", image: "/images/gaikou/problems/problem-3.png" },
  { iconKey: "car-front", text: "子どもの車が増えて駐車場が足りない", image: "/images/gaikou/problems/problem-4.png" },
  { iconKey: "tree-deciduous", text: "庭木や庭石の管理が大変", image: "/images/gaikou/problems/problem-5.png" },
  { iconKey: "eye", text: "外からの視線が気になる", image: "/images/gaikou/problems/problem-6.png" },
  { iconKey: "warehouse", text: "カーポートを付けたい", image: "/images/gaikou/problems/problem-7.png" },
  { iconKey: "circle-help", text: "外構工事の適正価格が分からない", image: "/images/gaikou/problems/problem-8.png" },
  { iconKey: "shield-check", text: "ちゃんと施工してくれる会社へ頼みたい", image: "/images/gaikou/problems/problem-9.png" },
];

export type SolutionItem = {
  iconKey: string;
  problem: string;
  solution: string;
  beforeImage: string;
  afterImage: string;
};

export const solutions: SolutionItem[] = [
  { iconKey: "layers", problem: "砂利・泥・水たまり", solution: "土間コンクリート", beforeImage: "/images/gaikou/solutions/solution1-before.png", afterImage: "/images/gaikou/solutions/solution1-after.png" },
  { iconKey: "car-front", problem: "駐車場不足", solution: "庭を撤去して駐車場を拡張", beforeImage: "/images/gaikou/solutions/solution2-before.png", afterImage: "/images/gaikou/solutions/solution2-after.png" },
  { iconKey: "sprout", problem: "雑草", solution: "防草シート・砂利・人工芝・コンクリート", beforeImage: "/images/gaikou/solutions/solution3-before.png", afterImage: "/images/gaikou/solutions/solution3-after.png" },
  { iconKey: "umbrella", problem: "雨や日差し", solution: "カーポート", beforeImage: "/images/gaikou/solutions/solution4-before.png", afterImage: "/images/gaikou/solutions/solution4-after.png" },
  { iconKey: "eye", problem: "視線", solution: "目隠しフェンス", beforeImage: "/images/gaikou/solutions/solution5-before.png", afterImage: "/images/gaikou/solutions/solution5-after.png" },
  { iconKey: "tree-deciduous", problem: "庭の管理", solution: "庭木・庭石撤去", beforeImage: "/images/gaikou/solutions/solution6-before.png", afterImage: "/images/gaikou/solutions/solution6-after.png" },
  { iconKey: "move-diagonal", problem: "段差", solution: "スロープ・手すり・段差解消", beforeImage: "/images/gaikou/solutions/solution7-before.png", afterImage: "/images/gaikou/solutions/solution7-after.png" },
];

export type ServiceCategory = {
  iconKey: string;
  title: string;
  items: string[];
  image?: string;
};

export const serviceCategories: ServiceCategory[] = [
  {
    iconKey: "car-front",
    title: "駐車場リフォーム",
    items: [
      "砂利からコンクリート",
      "駐車場の拡張",
      "庭を駐車場へ変更",
      "古いコンクリートの補修",
      "排水・水たまり改善",
    ],
    image: "/images/gaikou/services/service-parking.png",
  },
  {
    iconKey: "sprout",
    title: "雑草・庭管理対策",
    items: ["防草シート", "砂利敷き", "人工芝", "庭木・庭石撤去", "土間コンクリート"],
    image: "/images/gaikou/services/service-garden.png",
  },
  {
    iconKey: "fence",
    title: "エクステリア",
    items: [
      "カーポート",
      "目隠しフェンス",
      "門扉・門柱",
      "宅配ボックス",
      "テラス屋根",
      "ウッドデッキ",
      "タイルデッキ",
    ],
    image: "/images/gaikou/services/service-exterior.png",
  },
];

export type ReasonItem = {
  iconKey: string;
  title: string;
  body: string;
};

export const reasons: ReasonItem[] = [
  {
    iconKey: "handshake",
    title: "中間業者をできる限り挟まない直接対応",
    body: "受付から施工まで自社で対応するため、紹介料や管理費などの中間コストを抑えられます。",
  },
  {
    iconKey: "clipboard-check",
    title: "現地調査から施工完了まで一貫管理",
    body: "現地調査・お見積もり・施工・完成確認まで、同じチームが責任を持って対応します。",
  },
  {
    iconKey: "file-text",
    title: "工事内容と費用を分かりやすく説明",
    body: "見積書の内容や工程について、契約前にしっかりご説明し、納得いただいてから進めます。",
  },
  {
    iconKey: "layers",
    title: "小さな部分工事から外構全体まで対応",
    body: "駐車場の一部補修から外構全体のリフォームまで、規模を問わずご相談いただけます。",
  },
  {
    iconKey: "camera",
    title: "工事中の進捗を写真で報告",
    body: "現場の状況を写真でお伝えするので、工事の進み方を安心してご確認いただけます。",
  },
  {
    iconKey: "map-pinned",
    title: "地域密着で施工後も相談しやすい",
    body: "岐阜県内を中心に対応しているため、工事後の相談やメンテナンスもしやすい体制です。",
  },
];

export type PriceItem = {
  label: string;
  price: string;
  note?: string;
  confirmed: boolean;
  badge?: string;
};

// 価格の実数値は config/exterior-pricing.ts が唯一のソース。
// ここでは表示用に変換するだけで、金額をベタ書きしない。
export const prices: PriceItem[] = lpPriceTable.map((row) => ({
  label: row.label,
  price: row.price,
  note: row.note,
  confirmed: true,
}));

export const priceIncludes: string[] = [
  "現地調査",
  "掘削・高さ調整",
  "残土・既存砂利の処分",
  "砕石",
  "転圧",
  "型枠",
  "ワイヤーメッシュ",
  "生コンクリート",
  "刷毛引き仕上げ",
  "養生・清掃",
];

export const additionalCostCases: string[] = [
  "重機が入れない",
  "ポンプ車が必要",
  "残土が想定以上に多い",
  "地盤が軟弱",
  "庭木・庭石・物置の撤去",
  "ブロック塀の解体",
  "排水設備の追加",
  "桝や水道メーターの高さ調整",
  "道路との高低差が大きい",
];

export type QualityPoint = {
  label: string;
  body: string;
};

export const qualityPoints: QualityPoint[] = [
  { label: "コンクリートの厚み", body: "車両の重さに耐えられる適切な厚みで施工します" },
  { label: "砕石の厚み", body: "地盤を安定させるため十分な厚みで敷き込みます" },
  { label: "転圧", body: "地盤と砕石をしっかり締め固め、不同沈下を防ぎます" },
  { label: "ワイヤーメッシュ", body: "ひび割れを抑えるための補強材を内部に設置します" },
  { label: "水勾配", body: "水たまりができないよう適切な傾斜をつけます" },
  { label: "伸縮目地", body: "気温の変化によるひび割れを防ぐ目地を設けます" },
  { label: "養生期間", body: "コンクリートが必要な強度になるまでしっかり養生します" },
  { label: "車を乗せられるまでの日数", body: "強度を確認した上で車両の利用開始をご案内します" },
];

export type FlowStep = {
  step: number;
  title: string;
};

export const flowSteps: FlowStep[] = [
  { step: 1, title: "Webまたは電話でお問い合わせ" },
  { step: 2, title: "現場写真・希望内容の確認" },
  { step: 3, title: "無料の現地調査" },
  { step: 4, title: "正式見積もり・プラン提案" },
  { step: 5, title: "内容に納得いただいてから契約" },
  { step: 6, title: "着工・施工状況の報告" },
  { step: 7, title: "完成確認・引き渡し" },
];

export type PlanItem = {
  id: number;
  title: string;
  image: string;
  price: string;
  duration: string;
};

export const plans: PlanItem[] = [
  { id: 1, title: "砂利からコンクリート", image: "/images/gaikou/plans/plan-4.png", price: "35万円から", duration: "工期 3〜5日" },
  { id: 2, title: "駐車場＋雑草対策", image: "/images/gaikou/plans/plan-2.png", price: "42万円から", duration: "工期 4〜6日" },
  { id: 3, title: "庭撤去＋駐車場拡張", image: "/images/gaikou/plans/plan-3.png", price: "58万円から", duration: "工期 5〜8日" },
  { id: 4, title: "駐車場＋カーポート＋フェンス", image: "/images/gaikou/plans/plan-1.png", price: "98万円から", duration: "工期 7〜12日" },
];

export type WarrantyItem = {
  iconKey: string;
  title: string;
  body: string;
};

export const warrantyItems: WarrantyItem[] = [
  { iconKey: "message-circle", title: "工事後の不具合相談", body: "施工後に気になる点や不具合があった場合は、状況を確認のうえ迅速に対応します。" },
  { iconKey: "wrench", title: "補修対応", body: "当社の施工に起因する不具合については、保証内容に基づき補修対応を行います。" },
  { iconKey: "badge-check", title: "メーカー商品保証", body: "カーポート・フェンス・門柱などの商品は、各メーカーが定める保証内容が適用されます。" },
  { iconKey: "clipboard-check", title: "完工後確認", body: "工事完了後はお客様と施工箇所を確認し、仕上がりや使用方法をご説明します。" },
  { iconKey: "circle-check-big", title: "保証対象", body: "保証書または契約書に記載された施工箇所・商品・期間を保証対象とします。" },
  { iconKey: "circle-alert", title: "保証対象外", body: "自然災害・経年劣化・お客様による破損・当社以外の工事による不具合は対象外となる場合があります。" },
  { iconKey: "calendar-check", title: "保証期間", body: "保証期間は工事内容や使用商品によって異なります。詳しい内容はお見積もり時にご説明します。" },
];

export type FaqItem = {
  q: string;
  a: string;
};

export const faqs: FaqItem[] = [
  { q: "見積もりは無料ですか？", a: "はい、現地調査・お見積もりは無料です。お見積もり内容にご納得いただけない場合、費用は一切かかりません。" },
  { q: "小さな工事でも依頼できますか？", a: "可能です。駐車場の一部補修やフェンスの新設など、部分的な工事のみでもご相談いただけます。" },
  { q: "工事期間はどのくらいですか？", a: "工事内容や規模によって異なります。現地調査の際に、おおよその工期をご案内します。" },
  { q: "工事中は車を停められますか？", a: "工事の内容や進行状況によって異なります。事前にご都合をお伺いし、可能な範囲で調整いたします。" },
  { q: "コンクリートはいつから車で乗れますか？", a: "気温や天候によって硬化のスピードが変わるため、現場の状況を確認のうえご案内します。" },
  { q: "現地調査後に断っても大丈夫ですか？", a: "もちろん大丈夫です。現地調査やお見積もりを受けたあとにお断りいただいても、費用は発生しません。" },
  { q: "追加料金は発生しますか？", a: "現地の状況によって追加工事が必要になる場合があります。その際は事前にご説明し、お客様の承諾なく追加工事を行うことはありません。" },
  { q: "支払いのタイミングはいつですか？", a: "工事内容によって異なります。契約時に支払いタイミングについても合わせてご説明します。" },
  { q: "銀行のリフォームローンは利用できますか？", a: "ご利用いただける場合があります。詳しくはお問い合わせ時にご相談ください。" },
  { q: "対応エリアはどこですか？", a: "岐阜県は全域に対応しています。愛知県・三重県の一部エリアにも対応。エリア外でも、まずはお気軽にご相談ください。" },
];

export type PrefectureAreas = {
  prefecture: string;
  cities: string[];
  /** 県内全域対応（対応エリアセクションで「全域対応」と表示する） */
  coversAll?: boolean;
};

export const serviceAreasByPrefecture: PrefectureAreas[] = [
  {
    prefecture: "岐阜県",
    // 岐阜県は全域対応。市町村一覧は data/gaikou/municipalities.ts を単一ソースとする
    cities: [...municipalities.岐阜県],
    coversAll: true,
  },
  {
    prefecture: "愛知県",
    cities: ["名古屋市", "一宮市", "春日井市", "小牧市", "稲沢市", "清須市", "江南市", "犬山市", "岩倉市"],
  },
  {
    prefecture: "三重県",
    cities: ["桑名市", "四日市市", "津市", "鈴鹿市", "いなべ市", "東員町", "菰野町"],
  },
];

export const serviceAreas: string[] = serviceAreasByPrefecture.flatMap((p) => p.cities);
