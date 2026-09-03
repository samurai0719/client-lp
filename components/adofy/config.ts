/**
 * adofy LP の設定・掲載内容をまとめたファイル。
 * 文言や価格の変更はこのファイルだけを触れば済むようにしている。
 */

/* ═══════════════════════════════════════════════════════════════════════════
   ▼▼▼ CTAリンク差し替え箇所 ▼▼▼
   すべてのCTA（ヘッダー / ハンバーガー / 各セクション / 料金プラン /
   最終CTA / スマホ追従）が この2つの値を参照している。

     現在        : 無料相談フォーム（別ページ）へ遷移
     LINEの場合  : CTA_HREF = "https://lin.ee/xxxx"  CTA_EXTERNAL = true
     外部フォーム: CTA_HREF = "https://..."          CTA_EXTERNAL = true
   ═══════════════════════════════════════════════════════════════════════════ */
export const CTA_HREF = "/contact";
export const CTA_EXTERNAL = false;

/**
 * 料金プランのCTAから遷移したとき、フォームでそのプランを選択済みにするためのURL。
 * 例: /contact?plan=growth
 */
export function ctaHrefForPlan(planId: string): string {
  if (CTA_EXTERNAL) return CTA_HREF;
  return `${CTA_HREF}?plan=${encodeURIComponent(planId)}`;
}

export const CTA_LABEL = "無料で相談してみる";

export const SITE = {
  name: "adofy",
  tagline: "建設業専門の集客ホームページ制作",
  description:
    "建設業に特化した集客ホームページ制作。外構工事の集客実績と広告運用のノウハウをもとに、問い合わせ・受注・採用につながるホームページを制作します。",
  /** コーポレートサイト（メインドメイン） */
  url: "https://adofy-site.com",
  /** 建設業特化LP（サブドメイン）。LPのOGP・構造化データが参照する */
  lpUrl: "https://lp.adofy-site.com",
} as const;

export const NAV = [
  { href: "#features", label: "特徴" },
  { href: "#pricing", label: "料金プラン" },
  { href: "#flow", label: "制作の流れ" },
  { href: "#faq", label: "よくある質問" },
] as const;

export const CTA_NOTES = ["相談無料", "無理な営業なし", "オンライン相談対応"] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   ▼▼▼ ファーストビュー画像差し替え箇所 ▼▼▼
   完成画像ができたら、public に画像を置いてここにパスを入れるだけで反映される。
   （null の間は、高さを確保した白紙エリアが表示される）

     pc : PC・タブレット用（現在 1672 × 941 = 16:9）
     sp : スマートフォン用（現在 1086 × 1448 = 3:4）

   差し替える際は pcW/pcH・spW/spH も実寸に更新し、
   adofy.css の .adf-hero__frame の aspect-ratio も同じ比率に合わせること。
   比率がずれると object-fit: cover で画像内の文字が切れる。

   画像が入ると、マスク解除とわずかなズームアウトの登場演出が有効になる
   （prefers-reduced-motion 時は停止する）。
   ═══════════════════════════════════════════════════════════════════════════ */
export const HERO_IMAGE: {
  pc: string | null;
  sp: string | null;
  alt: string;
  pcW: number; pcH: number;
  spW: number; spH: number;
} = {
  pc: "/images/adofy/hero-pc.webp",
  sp: "/images/adofy/hero-sp.webp",
  // 画像内の文言をそのまま読み上げられるようにする（画像内の注記も省略しない）
  alt:
    "建設業に特化した、集客できるホームページ制作 adofy。最短3日で集客。集客実績を、あなたの会社へ。受注・採用・信頼。" +
    "※自社運用実績。成果を保証するものではありません。",
  // 実寸。CSSの aspect-ratio と揃えてレイアウトシフトを防ぐ
  pcW: 1672, pcH: 941,
  spW: 1086, spH: 1448,
};

/* ═══════════════════════════════════════════════════════════════════════════
   ▼▼▼ 集客実績差し替え箇所 ▼▼▼
   実績画像・数値が決まったら各項目を埋めるだけで、
   カードの順次表示・数字のカウントアップ・グラフ線のアニメーションが有効になる。

     image   : 実績画像のパス（null なら白紙のまま高さだけ確保）
     w / h   : 画像の実寸。比率で高さを確保するので必ず実寸を入れる
     alt     : 画像内の数字は読み上げられないため、同じ情報を文章で持たせる
     label   : 事例名（お客様名・業種など）
     caption : 補足（エリア・制作範囲など）
     value   : 画像とは別に数値をカウントアップ表示したいときだけ指定

   事例は増減自由。1件なら大きく1枚、2件以上ならPCで2列に自動で切り替わる。
   スマホは常に縦並び。
   ═══════════════════════════════════════════════════════════════════════════ */
export type ResultItem = {
  image: string | null;
  /** 画像の実寸。比率で高さを確保しレイアウトシフトを防ぐ */
  w?: number;
  h?: number;
  alt?: string;
  /** 数値を別途カウントアップ表示したい場合のみ指定（画像に数字が入っている場合は不要） */
  value?: number | null;
  unit?: string;
  label?: string;
  caption?: string;
};

export const RESULTS: ResultItem[] = [
  {
    image: "/images/adofy/case-01-takanaga.webp",
    w: 1672,
    h: 941,
    // 画像内の数字は読み上げられないため、alt に同じ情報を持たせる
    alt:
      "CASE STUDY 01 高長建設様。公開から3日で集客。1ヶ月で問い合わせ0件から22件。" +
      "PC・モバイル完全対応、建設業に特化した集客設計。",
    label: "高長建設様｜外構・エクステリア",
    caption: "岐阜・愛知・三重／コーポレートサイト制作・集客設計",
  },
  {
    image: "/images/adofy/case-02-paintnet.webp",
    w: 1672,
    h: 941,
    alt:
      "CASE STUDY 02 Paint Net様。公開から4日で集客。1ヶ月で問い合わせ0件から18件。" +
      "PC・モバイル完全対応、外壁塗装に特化した集客設計。",
    label: "Paint Net様｜外壁塗装",
    caption: "集客ページ制作・問い合わせ導線設計",
  },
  {
    image: "/images/adofy/ad-01-rizap-golf.webp",
    w: 1672,
    h: 941,
    alt:
      "AD PERFORMANCE 01 RIZAP GOLF。広告運用と記事LP制作。高単価商材でも、予約につながる導線へ。" +
      "ターゲット分析、クリエイティブ改善、記事LP最適化。広告から予約まで一貫して設計。",
    label: "RIZAP GOLF｜広告運用 × 記事LP制作",
    caption: "ターゲット分析・クリエイティブ改善・記事LP最適化",
  },
  {
    image: "/images/adofy/ad-02-mynavi-pharmacist.webp",
    w: 1672,
    h: 941,
    alt:
      "AD PERFORMANCE 02 マイナビ薬剤師。広告運用と診断LP制作。好条件の求人を、求職者につなげる。" +
      "ターゲット分析、クリエイティブ改善、診断LP最適化。広告から応募まで一貫設計。",
    label: "マイナビ薬剤師｜広告運用 × 診断LP制作",
    caption: "ターゲット分析・クリエイティブ改善・診断LP最適化",
  },
];

/**
 * 実績の注記。個別事例であることを明示し、結果を断定しないための表記。
 * 事例を追加しても必ず表示される。
 */
export const RESULTS_NOTE =
  "掲載しているのは個別の事例です。地域、競合、サービス内容、広告予算などによって結果は異なります。";

/* ── 4. お悩み ──────────────────────────────────────────────────────────── */
export type ProblemId = "profit" | "direct" | "hire" | "price" | "payment";

export const PROBLEMS: { id: ProblemId; text: string }[] = [
  { id: "profit", text: "下請け仕事ばかりで利益が残らない" },
  { id: "direct", text: "元請けとして自社で集客できるようになりたい" },
  { id: "hire", text: "求人を出しても従業員が集まらない" },
  { id: "price", text: "元請けから支払われる金額が安い" },
  { id: "payment", text: "入金や支払いが遅れることがある" },
];

/* ── 5. 解決策 ──────────────────────────────────────────────────────────── */
export const SOLUTIONS = [
  {
    title: "実際の集客データをもとに設計",
    body: "外構工事をはじめとしたWeb集客の経験をもとに、お客様が問い合わせるまでの流れを逆算して設計します。",
  },
  {
    title: "大手案件で培った集客ノウハウ",
    body: "さまざまな業界の集客に携わってきた経験を活かし、感覚ではなく、反応を得るための構成と訴求を考えます。",
  },
  {
    title: "建設業に特化",
    body: "建設業のお客様が何を不安に感じ、何を比較して工事会社を選ぶのかを踏まえて、信頼につながる情報を整理します。",
  },
  {
    title: "問い合わせ導線まで設計",
    body: "施工事例、対応エリア、選ばれる理由、料金の目安、相談までの流れを整理し、迷わず問い合わせできる導線を作ります。",
  },
  {
    title: "集客と採用の両方に対応",
    body: "工事の受注だけでなく、職人や従業員の採用にも活用できるホームページを制作できます。",
  },
] as const;

/* ── 6. 選ばれる理由 ────────────────────────────────────────────────────── */
export type ReasonId = "planner" | "writing" | "mobile" | "operation";

export const REASONS: { id: ReasonId; title: string; body: string }[] = [
  {
    id: "planner",
    title: "制作会社ではなく、集客経験者が設計",
    body: "実際に広告を運用し、問い合わせを取ってきた立場から構成を組み立てます。デザインの前に、何を伝えれば相談につながるかを整理します。",
  },
  {
    id: "writing",
    title: "建設業に合わせた文章とページ構成",
    body: "工事の内容、対応範囲、価格の考え方など、建設業のお客様が知りたい情報を優先して掲載します。",
  },
  {
    id: "mobile",
    title: "スマートフォンからの問い合わせを重視",
    body: "現場からでも施主様からでも、スマートフォンで見て迷わず連絡できることを前提に設計します。",
  },
  {
    id: "operation",
    title: "公開して終わりではなく、運用を見据えて制作",
    body: "施工事例の追加や情報の更新がしやすい形にし、公開後に改善していける状態でお渡しします。",
  },
];

/* ── 7. ホームページの特徴 ──────────────────────────────────────────────── */
export const FEATURES = [
  "会社の強みが一目で伝わる",
  "施工事例を分かりやすく掲載できる",
  "対応エリアを明確にできる",
  "電話・LINE・フォームへ迷わず移動できる",
  "スマートフォンで見やすい",
  "Google検索を意識した基本的なSEO設計",
  "お客様の不安を解消する情報を掲載",
  "従業員募集ページも制作可能",
  "公開後に内容を追加・変更しやすい",
] as const;

/* ── 8. 料金プラン ──────────────────────────────────────────────────────── */
export type Plan = {
  id: string;
  label: string;
  name: string;
  /** 表示価格（万円）。税込・税別の表記は未確定のため付けない */
  price: number;
  badge?: string;
  featured?: boolean;
  for: string;
  items: { text: string; inherit?: boolean }[];
  guard?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "start",
    label: "PLAN 01",
    name: "スタートプラン",
    price: 30,
    for: "まずは会社のホームページを整えたい事業者向け",
    items: [
      { text: "オリジナルデザイン" },
      { text: "5ページ程度" },
      { text: "スマートフォン対応" },
      { text: "お問い合わせフォーム" },
      { text: "施工事例掲載機能" },
      { text: "基本的なSEO設定" },
      { text: "電話CTA設置" },
      { text: "公開作業" },
    ],
  },
  {
    id: "growth",
    label: "PLAN 02",
    name: "集客強化プラン",
    price: 50,
    badge: "おすすめ",
    featured: true,
    for: "ホームページから継続的に問い合わせを獲得したい事業者向け",
    items: [
      { text: "スタートプランの全内容", inherit: true },
      { text: "集客用ページ設計" },
      { text: "競合サイト調査" },
      { text: "訴求・文章構成の作成" },
      { text: "LINE・電話・フォームの導線設計" },
      { text: "Googleアナリティクス等の計測設定" },
      { text: "採用ページまたは追加サービスページ" },
      { text: "公開後の改善提案" },
    ],
  },
  {
    id: "max",
    label: "PLAN 03",
    name: "MAXプラン",
    price: 70,
    badge: "全額返金保証付き",
    for: "本気でWeb集客の仕組みを作りたい事業者向け",
    items: [
      { text: "集客強化プランの全内容", inherit: true },
      { text: "複数の集客用ページ制作" },
      { text: "広告配信を想定したLP設計" },
      { text: "高度なアクセス計測" },
      { text: "問い合わせ獲得に向けた改善対応" },
      { text: "優先サポート" },
      { text: "条件付き全額返金保証" },
    ],
    guard: true,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ▼▼▼ SNS広告限定の割引 ▼▼▼
   PERCENT を 0 にすると、バッジも割引後価格もページから消える。
   割引率を変える場合もここだけ書き換えればよい。
   ═══════════════════════════════════════════════════════════════════════════ */
export const AD_DISCOUNT_PERCENT = 10;
export const AD_DISCOUNT_LABEL = "SNS広告限定";

/** 割引の対象と条件。断定を避け、詳細は相談時に案内する旨だけを示す */
export const AD_DISCOUNT_NOTE =
  "10%OFFはSNS広告経由でお申し込みいただいた方が対象です。適用条件は無料相談時にご案内します。";

/** 割引後の金額（万円）。端数が出ないよう四捨五入する */
export function discountedPrice(price: number): number {
  return Math.round(price * (100 - AD_DISCOUNT_PERCENT)) / 100;
}

/** 返金保証の説明（仮の条件を断定して載せない） */
export const REFUND_DISCLOSURE =
  "全額返金保証の適用条件、対象期間、お客様にご協力いただく事項、対象外となるケースについては、ご契約前に書面でご案内します。";

/* ── 9. 対応業種 ────────────────────────────────────────────────────────── */
export type IndustryId =
  | "exterior"
  | "painting"
  | "roof"
  | "demolition"
  | "reform"
  | "electric"
  | "plumbing"
  | "interior"
  | "scaffold"
  | "grading";

export const INDUSTRIES: { id: IndustryId; name: string }[] = [
  { id: "exterior", name: "外構・エクステリア" },
  { id: "painting", name: "外壁塗装" },
  { id: "roof", name: "屋根工事" },
  { id: "demolition", name: "解体工事" },
  { id: "reform", name: "リフォーム" },
  { id: "electric", name: "電気工事" },
  { id: "plumbing", name: "水道工事" },
  { id: "interior", name: "内装工事" },
  { id: "scaffold", name: "足場工事" },
  { id: "grading", name: "造成工事" },
];

/* ── 10. 制作の流れ ─────────────────────────────────────────────────────── */
export const FLOW_STEPS = [
  "無料相談",
  "現状・目標のヒアリング",
  "ご提案・お見積もり",
  "ご契約",
  "構成・デザイン制作",
  "内容確認・修正",
  "ホームページ公開",
  "公開後の運用・改善",
] as const;

/* ── 11. よくある質問 ───────────────────────────────────────────────────── */
export const FAQS = [
  {
    q: "建設業以外でも依頼できますか？",
    a: "基本的には建設業に特化していますが、業種によっては対応可能です。まずはご相談ください。",
  },
  {
    q: "ホームページに掲載する文章がなくても大丈夫ですか？",
    a: "はい。ヒアリング内容をもとに、強みやサービスが伝わる文章構成をご提案します。",
  },
  {
    q: "写真がなくても制作できますか？",
    a: "施工写真やスタッフ写真があると、より信頼されやすいホームページになります。写真が不足している場合の対応方法もご提案します。",
  },
  {
    q: "公開後に自分で更新できますか？",
    a: "使用するシステムやご希望に合わせて、施工事例やお知らせを更新しやすい構成にできます。",
  },
  {
    q: "制作期間はどのくらいですか？",
    a: "ページ数や資料の準備状況によって異なるため、ヒアリング後に具体的なスケジュールをご案内します。",
  },
  {
    q: "本当に集客できますか？",
    a: "問い合わせ獲得を目的とした設計を行いますが、地域、競合、サービス内容、広告予算などによって結果は異なります。事前に状況を確認し、現実的な集客方法をご提案します。",
  },
  {
    q: "MAXプランの全額返金保証には条件がありますか？",
    a: "はい。適用条件、対象期間、お客様にご協力いただく事項などがあります。詳細はご契約前に書面でご案内します。",
  },
] as const;
