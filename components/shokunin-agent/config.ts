/**
 * 職人採用エージェント LP（/shokunin-agent）の文言・数字。
 * 差し替えはこのファイルだけで完結するようにしている。
 *
 * ── 表現の決まり（変更しないこと） ──────────────────────────────────
 * ・本文の説明は「建設業特化型の採用代行」「企業の採用担当として業務を代行」。
 *   「職人採用エージェント」はサービス名としてだけ使う
 * ・応募者の選考、採用可否、雇用条件の最終決定、内定通知は必ず依頼企業が行う
 * ・紹介・推薦・選定・マッチング、応募や採用の保証に当たる表現は使わない
 * ・税区分、広告費の扱い、成功報酬が発生する正確な時点、支払期限、早期退職時の返金条件は
 *   未確定。内容を書かず、UNDECIDED の定型文に留める
 * ・実績は応募獲得実績として出し、採用人数に置き換えない
 *
 * 見出しなどの "|" は改行してよい位置（<wbr>）、"\n" は必ず改行する位置。
 */

export const SERVICE_NAME = "職人採用エージェント";

export const SITE = {
  origin: "https://saiyo.adofy-site.com",
  path: "/shokunin-agent",
  title: "職人採用エージェント｜建設業特化の採用代行｜adofy",
  description:
    "職人採用エージェントは、建設会社の求人制作、採用LP、広告運用、応募者対応、面接調整までを代行する建設業特化型の採用代行サービスです。初期費用89,800円、月額0円。",
  ogImage: "/images/shokunin-agent/og.png",
} as const;

export const CTA_HREF = "#contact";
export const CTA_MAIN = "無料で採用について相談する";
export const CTA_SUB = "相談しただけで料金が発生することはありません";

/** 未確定の条件を聞かれたときの定型文 */
export const UNDECIDED = "無料相談時に採用条件を確認したうえで個別にご案内します。";

export const NAV = [
  { href: "#features", label: "サービスの特徴" },
  { href: "#scope", label: "代行内容" },
  { href: "#pricing", label: "料金" },
  { href: "#results", label: "実績" },
  { href: "#flow", label: "ご利用の流れ" },
  { href: "#faq", label: "よくある質問" },
] as const;

/* ─── 料金（このLPの唯一の価格ソース） ─── */
export const PRICE = { initial: 89800, monthly: 0, rate: 10 } as const;
export const EXAMPLE_INCOME = 4_000_000;
export const EXAMPLE_FEE = (EXAMPLE_INCOME * PRICE.rate) / 100;
export const EXAMPLE_TOTAL = PRICE.initial + EXAMPLE_FEE;
export const yen = (n: number) => n.toLocaleString("ja-JP");

export const PRICE_LINE = [`初期費用${yen(PRICE.initial)}円`, `月額${PRICE.monthly}円`, `採用成功時は想定年収の${PRICE.rate}%`] as const;
export const PRICE_FOOTNOTE = "詳細な料金条件は、ご契約前に書面でご案内します。";

/* ─── FV ─── */
export const HERO = {
  tags: ["建設業特化", "採用業務を代行"],
  title: "職人採用を、\n丸ごと|任せられる。",
  body: "建設業に特化した採用代行。|求人づくりから|広告運用、|応募者対応、|面接調整まで|代行するから、|経営者は|面接と|採用判断に|集中できます。",
  /** 建設版の採用レスキュー（/kensetsu）と同じFV画像。見出し・料金は画像に焼き込み済み */
  image: {
    pc: { src: "/images/saiyo-rescue/kensetsu/hero-pc.webp", w: 1672, h: 941 },
    sp: { src: "/images/saiyo-rescue/kensetsu/hero-sp.webp", w: 941, h: 1672 },
    alt: "建設業に特化した採用支援。人が足りずに、仕事を断っていませんか？職人・現場スタッフの応募獲得を支援。月額費用0円、初期費用89,800円、成果報酬は想定年収の10%。",
  },
} as const;

/* ─── 採用コスト比較 ─── */
export const COST = {
  title: "職人1人の採用に、|100万円以上|かけていませんか？",
  lead: "リクルート就職みらい研究所の『就職白書2020』では、2019年度の中途採用1人あたりの平均採用コストは103.3万円と報告されています。",
  survey: {
    name: "中途採用の平均採用コスト",
    note: "調査上の平均値",
    big: "103.3万円",
    rows: [
      ["採用コスト", "103.3万円"],
      ["月額費用", "採用方法によって発生"],
      ["成功報酬", "―"],
      ["想定年収400万円の場合", "103.3万円"],
      ["応募者対応", "自社対応を含む"],
      ["面接日程の調整", "自社対応を含む"],
    ],
  },
  agent: {
    name: SERVICE_NAME,
    note: "初期費用（採用成功時は別途、成功報酬）",
    big: `${yen(PRICE.initial)}円`,
    rows: [
      ["採用コスト", `初期費用${yen(PRICE.initial)}円＋成功報酬`],
      ["月額費用", "0円"],
      ["成功報酬", `想定年収の${PRICE.rate}%`],
      ["想定年収400万円の場合", `${yen(EXAMPLE_TOTAL)}円`],
      ["応募者対応", "当社が代行"],
      ["面接日程の調整", "当社が代行"],
    ],
  },
  calc: [
    ["初期費用", `${yen(PRICE.initial)}円`],
    ["成功報酬", `${yen(EXAMPLE_FEE)}円`],
    ["合計", `${yen(EXAMPLE_TOTAL)}円`],
  ],
  diff: "想定年収400万円の採用なら、|サービス料金は|平均採用コストより|約54万円低い設計",
  cta: "採用コストを相談する",
  notes: [
    "出典：株式会社リクルート 就職みらい研究所『就職白書2020』。103.3万円は2019年度の中途採用1人あたりの平均採用コストであり、リクルートが提供する特定サービスの料金ではありません。",
    // 指定文の「広告費などの実費は含んでいません」は、広告費の負担条件を確認できるまで掲載しない
    "職人採用エージェントの金額は、想定年収400万円で採用した場合の初期費用と成功報酬を合計した計算例です。広告費の扱いは、無料相談時に個別にご案内します。実際の費用は採用条件によって異なります。",
  ],
} as const;

/* ─── 経営者の悩み ─── */
export type ProblemIcon = "noApply" | "noResponse" | "noContact" | "busy" | "schedule" | "young" | "noStaff" | "decline" | "site" | "leave";

export const PROBLEMS: { icon: ProblemIcon; text: string }[] = [
  { icon: "noApply", text: "求人を出しても|職人から|応募が来ない" },
  { icon: "noResponse", text: "求人媒体へ|掲載しても|反応がない" },
  { icon: "noContact", text: "応募が来ても|連絡が|つながらない" },
  { icon: "busy", text: "現場が忙しく|応募者へ|すぐ対応できない" },
  { icon: "schedule", text: "面接調整や|応募者対応まで|手が回らない" },
  { icon: "young", text: "若手職人を採用したい" },
  { icon: "noStaff", text: "採用担当者を|雇う余裕がない" },
  { icon: "decline", text: "人手不足で|仕事を断っている" },
  { icon: "site", text: "経営者自身が|現場から|抜けられない" },
  { icon: "leave", text: "採用しても|早期離職が|続いている" },
];

/* ─── 解決策 ─── */
export const SOLUTION = {
  ads: { label: "広告を出すだけの場合", items: ["求人を掲載・配信する", "応募が届く", "連絡・調整は自社で対応"] },
  agent: {
    label: `${SERVICE_NAME}の場合`,
    items: ["採用戦略と求人をつくる", "広告を配信・改善する", "応募者へ初期対応する", "確認事項を聞き、面接日程を調整する", "応募状況を報告し、改善する"],
  },
  close: "**広告を出すだけではなく、応募獲得後の対応まで行う。**それが、職人採用エージェントの一番の違いです。",
} as const;

/* ─── 代行業務の範囲 ─── */
export const SCOPE: { title: string; owner: "us" | "company" }[] = [
  { title: "採用したい職種・|人物像の整理", owner: "us" },
  { title: "求人原稿・採用LPの制作", owner: "us" },
  { title: "広告クリエイティブの制作", owner: "us" },
  { title: "求人広告の配信・改善", owner: "us" },
  { title: "応募者への初期対応", owner: "us" },
  { title: "企業指定項目に|基づく確認", owner: "us" },
  { title: "面接日程の調整", owner: "us" },
  { title: "応募状況の共有", owner: "us" },
  { title: "企業による|面接・採用判断", owner: "company" },
];

export const COMPANY_TASKS = ["募集条件の決定", "選考基準の決定", "面接", "採用可否の判断", "雇用条件の最終決定", "内定通知", "雇用契約"] as const;

export const SCOPE_NOTE = "当社が独自の判断で応募者を選別・推薦することはありません。";

/* ─── 建設業特化の強み ─── */
export const STRENGTHS: { title: string; body: string }[] = [
  { title: "職種ごとの違いを|踏まえる", body: "鳶と電気工事では、仕事内容も経験の見方も違います。職種ごとの違いを踏まえて採用を設計します。" },
  { title: "訴求する情報を整理する", body: "資格、経験年数、現場内容、勤務エリアなどを整理し、求職者が判断しやすい形で伝えます。" },
  { title: "職人に伝わる言葉で作る", body: "一般的な求人の言い回しではなく、職人に伝わる言葉で求人を作ります。" },
  { title: "面接につながる|応募を増やす", body: "応募単価だけを見ず、面接につながる応募を増やすことを目指します。" },
  { title: "データを見て改善する", body: "応募データを見ながら、広告とLPを改善します。" },
];

export const TRADES = ["鳶", "足場", "塗装", "防水", "左官", "土木", "型枠", "大工", "溶接", "鉄骨", "解体", "外構", "電気工事", "設備工事", "配管", "屋根", "内装", "施工管理"] as const;

/* ─── 実績 ─── */
export const RESULTS: { name: string; count: number; unitPrice: number; construction?: boolean }[] = [
  { name: "ナース専科", count: 818, unitPrice: 6549 },
  { name: "パーソル", count: 604, unitPrice: 2689 },
  { name: "カラフル", count: 399, unitPrice: 3675 },
  { name: "レバジョブ", count: 309, unitPrice: 4678 },
  { name: "レバウェル看護", count: 224, unitPrice: 6890 },
  { name: "建設・設備求人", count: 80, unitPrice: 7800, construction: true },
  { name: "マイナビ", count: 31, unitPrice: 16793 },
];
export const RESULTS_TOTAL = RESULTS.reduce((n, r) => n + r.count, 0);
export const RESULTS_NOTES = [
  "他業種を含む当社運用案件の応募獲得実績／当社集計",
  "掲載数値は過去の運用実績であり、応募数や採用を保証するものではありません。",
] as const;

/* ─── 他の採用方法との比較 ─── */
export const COMPARE_COLS = ["求人媒体への掲載のみ", "自社で採用活動", SERVICE_NAME] as const;
export const COMPARE_ROWS: { label: string; values: [string, string, string] }[] = [
  { label: "求人制作", values: ["自社で用意（媒体により支援あり）", "自社で対応", "当社が代行"] },
  { label: "採用LP制作", values: ["サービス範囲外の場合が多い", "自社で対応", "当社が代行"] },
  { label: "広告運用", values: ["媒体内の掲載が中心", "自社で対応", "当社が代行"] },
  { label: "応募者への初期対応", values: ["自社で対応", "自社で対応", "当社が代行"] },
  { label: "面接日程調整", values: ["自社で対応", "自社で対応", "当社が代行"] },
  { label: "月額固定費", values: ["掲載プランによる", "採用方法による", "0円"] },
  { label: "採用業務の負担", values: ["応募後の対応は自社", "担当者の時間が必要", "面接と採用判断が中心"] },
];

/* ─── ご利用の流れ ─── */
export const FLOW = [
  "無料相談",
  "採用条件のヒアリング",
  "契約・初期費用の支払い",
  "採用LP・求人広告の制作",
  "広告配信・応募者対応開始",
  "面接",
  "企業による採用決定",
] as const;

/* ─── よくある質問 ─── */
export const FAQS: { q: string; a: string[] }[] = [
  {
    q: "本当に月額費用はかかりませんか？",
    a: [`はい。月額費用は0円です。料金は、初期費用${yen(PRICE.initial)}円と、採用成功時の成功報酬（想定年収の${PRICE.rate}%）です。${PRICE_FOOTNOTE}`],
  },
  { q: "どのような職種に対応していますか？", a: [`${TRADES.join("、")}などの職種に対応しています。`] },
  {
    q: "応募者への電話対応も任せられますか？",
    a: [`応募者への初期対応は当社が代行します。具体的な連絡方法は、${UNDECIDED}`],
  },
  {
    q: "採用する人は誰が決めますか？",
    a: ["依頼企業が決めます。応募者の選考、採用可否、雇用条件の最終決定、内定通知は、必ず依頼企業に行っていただきます。"],
  },
  { q: "求人原稿や採用ページも作ってもらえますか？", a: ["はい。求人原稿と採用LPの制作も代行します。"] },
  { q: "採用できなかった場合、成果報酬はかかりますか？", a: [`成功報酬は、採用成功時にかかる料金です。発生の条件は、${UNDECIDED}`] },
  { q: "広告費は料金に含まれますか？", a: [UNDECIDED] },
  { q: "対応可能な地域を教えてください", a: [UNDECIDED] },
  { q: "契約期間はありますか？", a: [UNDECIDED] },
];

/* ─── 最終CTA・フォーム ─── */
export const FINAL_TITLE = "人手不足で仕事を|断る前に、|職人採用の仕組みを|つくりませんか？";

export const FORM_JOBS = [...TRADES, "複数の職種", "その他"] as const;
export const FORM_HIRES = ["1名", "2〜3名", "4〜5名", "6名以上", "未定"] as const;
export const FORM_PLACEHOLDER = "例）求人を出しても応募が来ない。応募者への連絡まで手が回らない。など";
export const FORM_ERROR = "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。";
