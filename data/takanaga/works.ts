// ─────────────────────────────────────────────────────────────────────────────
// 施工事例データ
// 画像は /images/gaikou/works/ の既存画像を再利用しています。
// 新しい事例を追加する場合はこのファイルに追記してください。
// ─────────────────────────────────────────────────────────────────────────────

export type WorkCategory =
  | "駐車場・土間コンクリート"
  | "カーポート・ガレージ"
  | "フェンス・目隠し"
  | "門柱・門扉"
  | "玄関アプローチ"
  | "人工芝・防草対策"
  | "ウッドデッキ・テラス"
  | "庭リフォーム"
  | "砂利敷き"
  | "排水・水たまり対策"
  | "外構全体のリフォーム";

export type WorkDesignStyle =
  | "シンプルモダン"
  | "ナチュラル"
  | "和モダン"
  | "洋風"
  | "リゾート風";

export type WorkItem = {
  slug: string;
  title: string;
  category: WorkCategory;
  prefecture: "岐阜県" | "愛知県" | "三重県";
  city: string;
  beforeImage: string;
  afterImage: string;
  thumbnail?: string;
  designStyle?: WorkDesignStyle;
  customerConcern: string;
  proposal: string;
  workContent: string[];
  materials?: string[];
  duration?: string;
  priceRange?: string; // 例: "50万円台"
  point?: string;
  staffComment?: string;
  published: boolean;
};

export const works: WorkItem[] = [
  {
    slug: "case-01-doma-concrete",
    title: "砂利敷きの駐車場を土間コンクリートへ",
    category: "駐車場・土間コンクリート",
    prefecture: "岐阜県",
    city: "岐阜市",
    beforeImage: "/images/gaikou/works/case1-before.png",
    afterImage: "/images/gaikou/works/case1-after.png",
    customerConcern:
      "砂利が雨の日にぬかるみ、車の乗り降りが不便でした。また砂利が道路に飛び出してしまうことも気になっていました。",
    proposal:
      "既存の砂利を撤去し、排水勾配を考慮した土間コンクリートに打ち替えることをご提案しました。",
    workContent: ["既存砂利撤去", "掘削・地盤整備", "砕石敷き・転圧", "土間コンクリート打設（刷毛引き仕上げ）"],
    duration: "7日間",
    priceRange: "60万円台",
    published: true,
  },
  {
    slug: "case-02-design-concrete",
    title: "デザインコンクリートと植栽の外構リフォーム",
    category: "外構全体のリフォーム",
    prefecture: "愛知県",
    city: "一宮市",
    beforeImage: "/images/gaikou/works/case2-before.png",
    afterImage: "/images/gaikou/works/case2-after.png",
    designStyle: "ナチュラル",
    customerConcern:
      "外構全体が古くなっており、見た目をきれいにしたいとのご要望でした。",
    proposal:
      "アクセントにレンガ調のデザインを取り入れたコンクリートと、管理しやすい植栽でリフォームをご提案しました。",
    workContent: ["既存外構撤去", "土間コンクリート打設（デザイン仕上げ）", "植栽工事"],
    duration: "10日間",
    priceRange: "80万円台",
    published: true,
  },
  {
    slug: "case-03-approach",
    title: "玄関アプローチと駐車場のリフォーム",
    category: "玄関アプローチ",
    prefecture: "三重県",
    city: "桑名市",
    beforeImage: "/images/gaikou/works/case3-before.png",
    afterImage: "/images/gaikou/works/case3-after.png",
    designStyle: "シンプルモダン",
    customerConcern:
      "駐車場と玄関アプローチが古く、雨の日に足元が滑りやすかったとのことでした。",
    proposal:
      "滑りにくい仕上げのコンクリートアプローチと、使いやすい駐車場への改修をご提案しました。",
    workContent: ["既存アプローチ・駐車場撤去", "土間コンクリート打設", "玄関アプローチ整備"],
    duration: "6日間",
    priceRange: "50万円台",
    published: true,
  },
  {
    slug: "case-04-parking-expansion",
    title: "庭を撤去して駐車スペースを1台分増設",
    category: "駐車場・土間コンクリート",
    prefecture: "岐阜県",
    city: "各務原市",
    beforeImage: "/images/gaikou/works/case4-before.png",
    afterImage: "/images/gaikou/works/case4-after.png",
    customerConcern:
      "お子さんが独立して車が増え、駐車場が1台分足りなくなっていました。",
    proposal:
      "使われていない庭スペースを駐車場に転用する工事をご提案しました。植木の撤去から土間コンクリートまで一括で対応しました。",
    workContent: ["庭木・植栽撤去", "土工事", "砕石敷き・転圧", "土間コンクリート打設"],
    duration: "9日間",
    priceRange: "80万円台",
    published: true,
  },
  {
    slug: "case-05-artificial-grass",
    title: "タイルテラスと人工芝のお庭リフォーム",
    category: "人工芝・防草対策",
    prefecture: "愛知県",
    city: "春日井市",
    beforeImage: "/images/gaikou/works/case5-before.png",
    afterImage: "/images/gaikou/works/case5-after.png",
    designStyle: "ナチュラル",
    customerConcern:
      "雑草が毎年大量に生えてきて手入れが大変。庭でくつろげるスペースも欲しいとのご要望でした。",
    proposal:
      "タイルテラスと人工芝の組み合わせで、手入れのいらない使いやすいお庭にリフォームするご提案をしました。",
    workContent: ["既存庭撤去", "防草シート施工", "人工芝敷設", "タイルテラス施工"],
    duration: "7日間",
    priceRange: "70万円台",
    published: true,
  },
  {
    slug: "case-06-carport",
    title: "2台用カーポートと土間コンクリート工事",
    category: "カーポート・ガレージ",
    prefecture: "岐阜県",
    city: "大垣市",
    beforeImage: "/images/gaikou/works/case6-before.png",
    afterImage: "/images/gaikou/works/case6-after.png",
    customerConcern:
      "雨の日に車の乗り降りが大変で、カーポートを付けたいとのご要望でした。",
    proposal:
      "2台用カーポートの設置と、あわせて駐車場の土間コンクリート化をご提案しました。",
    workContent: ["既存砂利撤去", "土間コンクリート打設", "2台用カーポート設置"],
    duration: "12日間",
    priceRange: "110万円台",
    published: true,
  },
  {
    slug: "case-07-brick-parking",
    title: "レンガ目地を取り入れた洋風駐車場リフォーム",
    category: "駐車場・土間コンクリート",
    prefecture: "愛知県",
    city: "名古屋市守山区",
    beforeImage: "/images/gaikou/works/case7-before.png",
    afterImage: "/images/gaikou/works/case7-after.png",
    designStyle: "洋風",
    customerConcern:
      "せっかくリフォームするなら、おしゃれな雰囲気にしたいとのご要望でした。",
    proposal:
      "目地にレンガを使ったデザインコンクリートで、洋風の外観に合わせた駐車場をご提案しました。",
    workContent: ["既存撤去", "土間コンクリート打設", "レンガ目地施工"],
    duration: "8日間",
    priceRange: "70万円台",
    published: true,
  },
  {
    slug: "case-08-lighting",
    title: "洋風コンクリートと外構ライトアップ工事",
    category: "外構全体のリフォーム",
    prefecture: "三重県",
    city: "四日市市",
    beforeImage: "/images/gaikou/works/case8-before.png",
    afterImage: "/images/gaikou/works/case8-after.png",
    designStyle: "洋風",
    customerConcern:
      "夜の外構が暗く、雰囲気も古くなっていたため全体的にリフォームしたいとのご希望でした。",
    proposal:
      "デザイン性の高いコンクリートとライティングの組み合わせで、夜でも美しい外構をご提案しました。",
    workContent: ["既存外構撤去", "土間コンクリート打設（デザイン仕上げ）", "照明工事"],
    duration: "9日間",
    priceRange: "90万円台",
    published: true,
  },
];

export const publishedWorks = works.filter((w) => w.published);
