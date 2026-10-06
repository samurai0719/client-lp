/**
 * 採用レスキュー LP の設定・掲載内容。
 * 文言・数字・価格・画像の差し替えはこのファイルだけで完結するようにしている。
 *
 * 訴求の軸は「LP制作」ではなく「応募を増やす採用導線を作るサービス」。
 * 読者の心理導線：
 *   今の採用方法ではまずいかも → 応募が来ない理由が分かった → この会社は実績がある
 *   → 自社でも改善できそう → 返金保証もあるなら相談してみよう
 */

/* ═══════════════════════════════════════════════════════════════════════════
   ▼▼▼ CTA ▼▼▼
   すべてのCTA（ヘッダー / 各セクション / 料金プラン / 追従CTA）は
   このページ下部の相談フォーム（#contact）へスクロールする。
   ═══════════════════════════════════════════════════════════════════════════ */
export const CTA_HREF = "#contact";
export const CTA_LABEL = "無料で採用相談する";

export const SITE = {
  name: "採用レスキュー",
  catch: "人が欲しい時に好きなだけ。",
  title: "採用レスキュー｜採用LP×広告クリエイティブで応募が集まる導線をつくる｜人が欲しい時に好きなだけ。",
  description:
    "求人媒体に掲載するだけの採用から、「応募が集まる仕組み」を持つ採用へ。採用レスキューは、求職者が「ここで働きたい」と思う流れから逆算して、採用LPと広告クリエイティブ（バナー・動画）をセットで制作し、応募導線まで設計します。最短2日で応募。累計応募実績2,465件・面談率40%以上・全業種対応。35万円プランは求人の応募が来なければ全額返金保証（適用条件あり）。",
} as const;

/** 返金保証の注記（FV・料金・FAQ・CTAで共通） */
export const GUARANTEE_NOTE = "※35万円プラン限定・適用条件あり";

/* ─── ファーストビュー ─── */
export const HERO_IMAGE = {
  pc: "/images/saiyo-rescue/hero-pc.webp",
  sp: "/images/saiyo-rescue/hero-sp.webp",
  pcW: 1672,
  pcH: 941,
  spW: 941,
  spH: 1672,
  alt:
    "採用レスキュー。人が欲しい時に好きなだけ。累計応募実績2,465件。求人の応募が来なければ全額返金保証（35万円プラン限定・適用条件あり）。看護師・ドライバー・建設・設備・薬剤師などで実績。全業種対応。",
} as const;

export const HERO_COPY = {
  lead: ["求人媒体に掲載するだけの採用から、", "「応募が集まる仕組み」を持つ採用へ。"],
  body: "採用レスキューは、求職者が「ここで働きたい」と思う流れから逆算して、採用LPと広告クリエイティブをセットで制作し、応募導線まで設計します。",
  reassure: "無理な営業はしません。現在の採用状況を確認したうえで、改善できる可能性がある場合のみご提案します。",
} as const;

/* ─── 実績 ─── */
export const RESULTS_TOTAL = 2465;

/** 面談率（%）。表示は「40%以上」 */
export const INTERVIEW_RATE = 40;

/** 実績の中で最も低い応募単価（円）。導き手セクションの信頼要素に使う */
export const BEST_UNIT_PRICE = 2689;

/**
 * count = 応募実績（人） / unitPrice = 応募単価（円）
 * name の「|」はスマホでの改行位置（表示時は <wbr> に変換）
 */
export const RESULTS: { name: string; category: string; count: number; unitPrice: number }[] = [
  { name: "ナース専科", category: "看護師", count: 818, unitPrice: 6549 },
  { name: "ドライバー転職|パーソル", category: "ドライバー", count: 604, unitPrice: 2689 },
  { name: "カラフルエージェント|ドライバー", category: "ドライバー", count: 399, unitPrice: 3675 },
  { name: "ドライバー転職|レバジョブ", category: "ドライバー", count: 309, unitPrice: 4678 },
  { name: "レバウェル看護", category: "看護師", count: 224, unitPrice: 6890 },
  { name: "建設・設備|求人データベース", category: "建設・設備", count: 80, unitPrice: 7800 },
  { name: "マイナビ薬剤師", category: "薬剤師", count: 31, unitPrice: 16793 },
];

/**
 * 実際に運用した動画広告（縦型 9:16）。public/videos/saiyo-rescue に「冒頭5秒」だけを540pで切り出して配置（ループ再生）。
 * count は RESULTS の応募実績と対応させている。
 */
export const AD_VIDEOS: { id: string; media: string; category: string; count: number }[] = [
  { id: "nurse-senka", media: "ナース専科", category: "看護師", count: 818 },
  { id: "persol-driver", media: "ドライバー転職パーソル", category: "ドライバー", count: 604 },
  { id: "colorful-driver", media: "カラフルエージェントドライバー", category: "ドライバー", count: 399 },
  { id: "levjob-driver", media: "ドライバー転職レバジョブ", category: "ドライバー", count: 309 },
  { id: "levwell-nurse", media: "レバウェル看護", category: "看護師", count: 224 },
  { id: "construction", media: "建設・設備求人データベース", category: "建設業", count: 80 },
  { id: "mynavi-pharmacist", media: "マイナビ薬剤師", category: "薬剤師", count: 31 },
];

/** 応募獲得に携わったLPのモックアップ */
export const MOCKUPS: { src: string; title: string; caption: string }[] = [
  {
    src: "/images/saiyo-rescue/work-nurse.webp",
    title: "看護師領域",
    caption: "看護師向けの比較・ランキング型LP",
  },
  {
    src: "/images/saiyo-rescue/work-mynavi.webp",
    title: "薬剤師領域",
    caption: "マイナビ薬剤師の診断型LP（LINE相談導線）",
  },
];

/** 応募獲得の集計期間（実績の数字を出す箇所すべてに注記する） */
export const RESULTS_PERIOD = "※応募獲得期間：2025年11月〜2026年10月";

export const RESULTS_NOTE = `${RESULTS_PERIOD}。過去実績の一例です。業種・地域・募集条件・広告費等により成果は異なります。`;

/* ─── お悩み ─── */
export const PROBLEMS = [
  "求人媒体に何十万円使っても応募が少ない",
  "応募が来ても欲しい人材ではない",
  "求人票の条件だけで比較されてしまう",
  "会社の良さを伝えたいが、何を書けばいいか分からない",
  "採用ページが古い、または存在しない",
  "Indeedや求人媒体に掲載して終わりになっている",
  "応募単価が高騰している",
  "競合他社に人材を取られてしまう",
  "応募から面接につながらない",
  "採用を担当できる人が社内にいない",
  "人が足りず現場に負担が出ている",
  "採用したいのに何から改善すればいいか分からない",
] as const;

/** 求職者が求人を見た瞬間に判断していること */
export const SEEKER_CHECKS = [
  "この会社は自分に合っているか",
  "他社より魅力があるか",
  "本当に応募して大丈夫か",
] as const;

/** 多くの求人ページが「これだけ」で終わっている項目 */
export const ONLY_CONDITIONS = ["給与", "勤務地", "勤務時間", "仕事内容"] as const;

/* ─── 価値の提案 ─── */
export const SEEKER_FEELINGS = ["ここなら働いてみたい", "この会社なら安心できそう", "一度話を聞いてみたい"] as const;

export const DESIGN_POINTS = [
  "誰を採用したいのか",
  "その人が転職時に何を不安に感じるのか",
  "何を伝えれば応募したくなるのか",
  "競合求人との違いは何なのか",
  "どのタイミングで応募ボタンを押してもらうのか",
] as const;

export const BENEFITS = [
  { title: "応募数アップを狙える", icon: "up" },
  { title: "採用単価改善を狙える", icon: "yen" },
  { title: "会社の魅力を正しく伝えられる", icon: "heart" },
  { title: "欲しい人材に刺さる訴求ができる", icon: "target" },
  { title: "求人媒体以外からも応募を集められる", icon: "route" },
  { title: "広告を止めてもLP自体は資産として残る", icon: "asset" },
  { title: "採用活動を属人化しにくくなる", icon: "team" },
  { title: "複数職種の募集にも展開しやすい", icon: "layers" },
] as const;

export type BenefitIcon = (typeof BENEFITS)[number]["icon"];

/** 「求人媒体は場所、採用LPは営業マン」の比較 */
export const MEDIA_VS_LP = {
  media: {
    role: "場所",
    points: ["数百社の求人の中に埋もれる", "給与・勤務地などの条件で比較される", "伝えられる情報量に限りがある"],
  },
  lp: {
    role: "営業マン",
    points: ["なぜこの会社なのか", "ここで働くとどうなるのか", "他社と何が違うのか"],
  },
} as const;

/* ─── 導き手 ─── */
export const GUIDE_FIELDS = ["看護師", "ドライバー", "建設業", "薬剤師"] as const;

/** 応募が少ないときに見直してきた箇所 */
export const IMPROVE_POINTS = ["ファーストビュー", "訴求", "文章", "CTA", "フォーム", "広告クリエイティブ"] as const;

export const TRUST_TAGS = [
  "累計応募実績 2,465件",
  "応募単価2,689円の実績あり",
  "面談率40%以上",
  "複数業種での採用実績",
  "全業種対応",
  "35万円プランは返金保証",
] as const;

/* ─── 導入の流れ ─── */
export const STEPS: { no: string; title: string; body: string; tags?: string[] }[] = [
  {
    no: "01",
    title: "無料相談・ヒアリング",
    body: "現在の採用状況、採用したい人物、募集条件、困っていることを確認します。",
  },
  {
    no: "02",
    title: "お申込み・お支払い",
    body: "プランを決定してお申込み。制作開始前に料金の全額（前金100%）を銀行振込でお支払いいただきます。",
    tags: ["プラン決定", "前金100%", "銀行振込"],
  },
  {
    no: "03",
    title: "入金確認後、制作開始",
    body: "求職者が何を重視しているかを整理し、採用LPと広告クリエイティブをセットで制作します。",
    tags: ["構成", "コピー", "デザイン", "CTA", "バナーCR", "動画CR"],
  },
  {
    no: "04",
    title: "完成・公開・応募開始",
    body: "完成したLPを公開。さまざまな経路から求職者を誘導できます。",
    tags: ["求人媒体", "Meta広告", "Instagram", "Google広告", "Indeed", "自社ホームページ"],
  },
];

/* ─── よくある不安（反論処理） ─── */
export type Objection = {
  q: string;
  /** 段落ごと。"**" で囲んだ部分は強調表示 */
  a: string[];
  /** 回答内で並べて見せたい項目 */
  list?: string[];
  /** list を差し込む段落の位置（この段落の直後に出す） */
  listAfter?: number;
  /** 料金の比較（月額×12ヶ月）を図で見せる */
  calc?: boolean;
};

export const OBJECTIONS: Objection[] = [
  {
    q: "本当に応募が増えますか？",
    a: [
      "必ず増えると保証することはできません。採用は、次のような条件によって変わります。",
      "ただし採用レスキューでは、応募実績をもとに**「応募につながりやすい構成」**を考えて制作します。",
      "また35万円プランでは、条件を満たしたうえで応募が来なかった場合の**全額返金保証**を用意しています（料金は前金100%でお支払いいただき、条件を満たした場合に全額を返金します）。",
    ],
    list: ["業種", "地域", "給与", "勤務条件", "競合", "広告予算"],
    listAfter: 0,
  },
  {
    q: "自社の強みが分かりません。",
    a: [
      "問題ありません。むしろ、多くの企業様が同じ状態です。",
      "ヒアリングを行い、次のような観点から**求職者に刺さるポイント**を一緒に整理します。",
    ],
    list: ["給与", "休み", "人間関係", "働き方", "会社の雰囲気", "キャリア", "設備", "教育体制", "社長の考え方"],
    listAfter: 1,
  },
  {
    q: "写真や文章がありません。",
    a: [
      "写真がある場合は活用します。文章については、必要な情報をヒアリングしたうえで構成します。",
      "**「何を書けばいいか分からない」**という状態からでも始められます。",
    ],
  },
  {
    q: "どんな業種でもできますか？",
    a: [
      "はい。**全業種対応**です。これまで、次の業種で応募獲得実績があります。",
      "他業種でも、求職者心理と採用導線の考え方は共通しています。",
    ],
    list: ["看護師", "ドライバー", "建設業", "薬剤師"],
    listAfter: 0,
  },
  {
    q: "求人媒体があるので、LPはいらないのでは？",
    a: [
      "求人媒体は、求職者と出会うための**「場所」**です。",
      "しかし、他社と比較されたときに「この会社で働きたい」と思ってもらうためには、会社の魅力を詳しく伝える場所が必要です。",
      "その役割を**採用LP**が担います。",
    ],
  },
  {
    q: "料金が高く感じます。",
    a: [
      "例えば、求人媒体へ毎月20万円を支払い続けた場合、年間240万円です。",
      "採用LPは一度作れば、今後の採用活動でも**繰り返し利用できます**。",
      "採用単価が改善できれば、長期的には採用コスト削減につながる可能性があります。",
    ],
    calc: true,
  },
  {
    q: "支払いはいつですか？",
    a: [
      "**制作開始前に料金の100%**をお支払いいただきます（銀行振込）。",
      "ご入金確認後、ヒアリングおよび制作を開始します。",
    ],
  },
  {
    q: "分割払いはできますか？",
    a: ["原則として**前金100%**でお願いしております。"],
  },
  {
    q: "前金100%なのに、返金保証はどうなりますか？",
    a: [
      "制作料金は前金100%となります。",
      "プレミアムプランでは、所定の返金保証条件をすべて満たしたうえで、規定期間内に**応募が0件だった場合**、お支払いいただいた**350,000円を全額返金**いたします。",
      "※適用条件あり",
    ],
  },
];

/* ─── 料金プラン ─── */
export type PlanId = "light" | "standard" | "premium";

export type Plan = {
  id: PlanId;
  name: string;
  /** 円（税込・税別は PRICE_TAX_NOTE で表記） */
  price: number;
  target: string;
  features: string[];
  cta: string;
  badge?: string;
  guarantee?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "light",
    name: "ライト",
    price: 150000,
    target: "まずは採用LPを用意したい企業向け",
    features: ["採用LP 1ページ", "広告バナーCR制作", "スマホ最適化", "基本構成", "応募フォーム導線", "CTA設計", "基本原稿調整"],
    cta: "ライトプランを相談する",
  },
  {
    id: "standard",
    name: "スタンダード",
    price: 250000,
    badge: "人気No.1",
    target: "応募獲得を本格的に強化したい企業向け",
    features: [
      "採用LP 1ページ",
      "広告バナー＋動画CR制作",
      "スマホ最適化",
      "応募フォーム導線",
      "求職者心理に基づく構成設計",
      "訴求整理",
      "コピー設計",
      "CTA改善",
      "競合を意識した差別化",
      "業種別最適化",
    ],
    cta: "スタンダードプランを相談する",
  },
  {
    id: "premium",
    name: "プレミアム",
    price: 350000,
    badge: "返金保証付き",
    guarantee: true,
    target: "採用を本気で改善したい企業向け",
    features: [
      "スタンダードプランの内容すべて",
      "広告CR（バナー・動画）の追加制作・改善",
      "採用戦略設計",
      "より詳細な競合分析",
      "応募導線全体の最適化",
      "優先対応",
      "全額返金保証",
    ],
    cta: "返金保証付きプランを相談する",
  },
];

/** 価格の表記（すべて税込） */
export const PRICE_TAX_NOTE = "（税込）";

/** 支払条件。料金表・FAQ・特商法・フォームで共通（全プラン「制作開始前の前金100%」・銀行振込） */
export const PAYMENT = {
  short: "お支払い：制作開始前・前金100%",
  method: "銀行振込",
  timing: "ご契約後、制作開始前までに全額をお支払いいただきます。ご入金確認後、制作を開始します。",
  /** 前金100%と返金保証が矛盾して見えないための説明 */
  guarantee:
    "制作料金は前金100%となります。プレミアムプランでは、所定の返金保証条件を満たしても応募が0件だった場合、お支払いいただいた制作料金を全額返金いたします。",
} as const;

export const PRICING_HELP = "どのプランが合うか分からない場合は、無料相談時に現在の採用状況を確認したうえでご提案します。";

/* ─── 最終CTA ─── */
export const VICIOUS_CYCLE = [
  "既存社員の負担が増える",
  "残業が増える",
  "受けられる仕事が減る",
  "売上機会を逃す",
  "社員が辞める",
] as const;

export const CTA_REASSURE = [
  "相談したからといって、必ず契約する必要はありません。",
  "ご契約後の料金は、制作開始前に前金100%（銀行振込）でお支払いいただきます。",
  "現在の採用状況を確認し、採用レスキューで改善できる可能性があるかをお伝えします。",
] as const;

/* ─── 相談フォームの選択肢 ─── */
export const FORM_JOB_TYPES = [
  "看護師・医療",
  "ドライバー・運送",
  "建設・設備",
  "薬剤師",
  "介護・福祉",
  "製造・工場",
  "飲食・販売",
  "事務・営業",
  "その他",
] as const;

export const FORM_PLAN_OPTIONS: { value: PlanId | "undecided"; label: string }[] = [
  { value: "undecided", label: "まだ決めていない・相談して決めたい" },
  { value: "light", label: "ライト（150,000円・税込）" },
  { value: "standard", label: "スタンダード（250,000円・税込）" },
  { value: "premium", label: "プレミアム（350,000円・税込・返金保証付き）" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ▼▼▼ 運営者情報 / 会社概要 / プライバシーポリシー / 特定商取引法 差し替え箇所 ▼▼▼
   確定前に仮の内容を掲載しないよう、未確定の項目は PREPARING を表示する。
   ═══════════════════════════════════════════════════════════════════════════ */
const PREPARING = "内容が確定次第、掲載します。お急ぎの場合はお問い合わせフォームよりご連絡ください。";

/** 運営会社（adofy）の情報。フッター・特商法・プライバシーポリシーで共通利用 */
export const OPERATOR = {
  name: "adofy",
  representative: "塚本 隼平",
  area: "岐阜県（全国対応）",
  email: "info@tenshoku-gpt.com",
  siteUrl: "https://adofy-site.com",
  profileUrl: "https://adofy-site.com/profile",
  business:
    "成果報酬型広告運用、LP・ホームページ制作、広告クリエイティブ制作、採用支援（採用レスキュー）、トラックドライバー向け転職支援サービス「ドラテク」の運営",
} as const;

export const LEGAL: { id: string; title: string; items: { term: string; desc: string; href?: string }[] }[] = [
  {
    id: "operator",
    title: "運営者情報",
    items: [
      { term: "サービス名", desc: "採用レスキュー（採用LP・広告クリエイティブ制作／採用支援）" },
      { term: "運営者", desc: OPERATOR.name },
      { term: "代表者", desc: OPERATOR.representative },
      { term: "代表プロフィール", desc: OPERATOR.profileUrl, href: OPERATOR.profileUrl },
      { term: "メールアドレス", desc: OPERATOR.email, href: `mailto:${OPERATOR.email}` },
      { term: "ホームページ", desc: OPERATOR.siteUrl, href: OPERATOR.siteUrl },
    ],
  },
  {
    id: "company",
    title: "会社概要",
    items: [
      { term: "会社名", desc: OPERATOR.name },
      { term: "代表者", desc: OPERATOR.representative },
      { term: "所在地", desc: OPERATOR.area },
      { term: "事業内容", desc: OPERATOR.business },
      { term: "メールアドレス", desc: OPERATOR.email, href: `mailto:${OPERATOR.email}` },
      { term: "ホームページ", desc: OPERATOR.siteUrl, href: OPERATOR.siteUrl },
    ],
  },
  {
    id: "privacy",
    title: "プライバシーポリシー",
    items: [
      { term: "事業者", desc: `${OPERATOR.name}（代表：${OPERATOR.representative}）` },
      {
        term: "個人情報の利用目的",
        desc: "お問い合わせフォームでいただいた情報は、ご相談への回答・ご提案・ご連絡のためにのみ利用します。",
      },
      {
        term: "アクセス解析・広告計測",
        desc: "サービス改善と広告効果測定のため、Meta Pixel等の計測ツールおよび広告パラメータ（utm等）を利用しています。",
      },
      { term: "第三者提供", desc: "法令に基づく場合を除き、ご本人の同意なく第三者へ提供することはありません。" },
      { term: "お問い合わせ窓口", desc: OPERATOR.email, href: `mailto:${OPERATOR.email}` },
    ],
  },
  {
    id: "tokushoho",
    title: "特定商取引法に基づく表記",
    items: [
      { term: "販売事業者", desc: OPERATOR.name },
      { term: "運営統括責任者", desc: OPERATOR.representative },
      { term: "所在地", desc: `${OPERATOR.area}　※詳細はご請求があれば遅滞なく開示します` },
      { term: "電話番号", desc: "ご請求があれば遅滞なく開示します" },
      { term: "メールアドレス", desc: OPERATOR.email, href: `mailto:${OPERATOR.email}` },
      { term: "販売価格", desc: "ライト 150,000円（税込） / スタンダード 250,000円（税込） / プレミアム 350,000円（税込）" },
      { term: "支払時期", desc: PAYMENT.timing },
      { term: "支払方法", desc: PAYMENT.method },
      { term: "役務の提供時期", desc: "ご入金確認後、ヒアリングおよび制作を開始します（最短2日で応募獲得の実績あり）" },
      {
        term: "返金について",
        desc: `プレミアムプラン（350,000円・税込）のみ、前金100%でお支払いいただいた制作料金を、所定の返金保証条件をすべて満たしたうえで規定期間内に応募が0件だった場合に全額返金します。適用条件：${PREPARING}`,
      },
    ],
  },
];
