/**
 * 職人採用エージェント LP（/shokunin-agent）の文言・数字。
 * 差し替えはこのファイルだけで完結するようにしている。
 *
 * ── 表現の決まり（変更しないこと） ──────────────────────────────────
 * ・本文の説明は「建設業特化型の採用代行」「企業の採用担当として業務を代行」。
 *   「職人採用エージェント」はサービス名としてだけ使う
 * ・応募者の選考、採用可否、雇用条件の最終決定、内定通知は必ず依頼企業が行う
 * ・紹介・推薦・選定・マッチング、応募や採用の保証に当たる表現は使わない
 * ・料金は月額69,800円のみ（初期費用・成果報酬は書かない）。採用人数による追加料金はない
 * ・税区分、広告費の扱い、支払期限、契約期間、解約条件は未確定。内容を書かず、UNDECIDED の定型文に留める
 * ・実績は応募獲得実績として出し、採用人数に置き換えない
 *
 * 見出しなどの "|" は改行してよい位置（<wbr>）、"\n" は必ず改行する位置。
 */

export const SERVICE_NAME = "職人採用エージェント";

export const SITE = {
  origin: "https://saiyo.adofy-site.com",
  path: "/shokunin-agent",
  title: "職人採用エージェント｜建設業・職人の採用代行｜月額69,800円で採用し放題",
  description:
    "建設会社の職人採用を代行。鳶・足場・塗装・大工・電気工事などの求人制作、採用LP、広告運用、応募者対応、面接日程の調整までまとめて対応します。月額69,800円で、何人採用しても追加費用なしの採用し放題。",
  ogImage: "/images/shokunin-agent/og.png",
} as const;

export const CTA_HREF = "#contact";
export const PHONE = "090-2342-7385";
export const CTA_WAITING = "転職したい職人が待機中";
export const CTA_MAIN = "無料で採用について相談する";
export const CTA_SUB = "相談しただけで料金が発生することはありません";

/** 未確定の条件を聞かれたときの定型文 */
export const UNDECIDED = "無料相談時に採用条件を確認したうえで個別にご案内します。";

export const NAV = [
  { href: "#results", label: "実績" },
  { href: "#service", label: "サービスの仕組み" },
  { href: "#scope", label: "代行内容" },
  { href: "#pricing", label: "料金" },
  { href: "#flow", label: "ご利用の流れ" },
  { href: "#faq", label: "よくある質問" },
] as const;

/* ─── 料金（このLPの唯一の価格ソース） ─── */
/** 月額のサブスクのみ。何人採用しても月額は変わらない */
export const PRICE = { monthly: 69_800 } as const;
export const yen = (n: number) => n.toLocaleString("ja-JP");
export const MONTHLY = `月額${yen(PRICE.monthly)}円`;
export const UNLIMITED = "採用し放題";

export const PRICE_LINE = [MONTHLY, `何人採用しても${UNLIMITED}`] as const;
export const PRICE_FOOTNOTE = "詳細な料金条件は、ご契約前に書面でご案内します。";

/* ─── FV ─── */
export const HERO = {
  label: "建設会社専属の外部採用担当",
  title: "職人の応募獲得から、|面接設定まで。\n**採用業務を|丸ごと代行。**",
  steps: [
    { who: "企業", text: "採用条件を伝える", owner: "company" },
    { who: SERVICE_NAME, text: "求人制作・広告運用・応募者対応・面接調整", owner: "us" },
    { who: "企業", text: "面接・採用判断", owner: "company" },
  ],
  /** 建設版の採用レスキュー（/kensetsu）と同じFV画像。見出し・料金は画像に焼き込み済み */
  image: {
    pc: { src: "/images/shokunin-agent/hero-pc.webp", w: 1672, h: 941 },
    sp: { src: "/images/shokunin-agent/hero-sp.webp", w: 941, h: 1672 },
    alt: "建設業に特化した採用支援。人が足りずに、仕事を断っていませんか？職人・現場スタッフの応募獲得を支援。月額費用69,800円、何人採用しても追加費用なしの採用し放題。",
  },
} as const;

/* ─── 採用コスト比較 ─── */
export const COST = {
  title: { before: "1人の採用に", highlight: "平均約100万円", after: "かかっています" },
  survey: {
    name: "中途採用の|平均採用コスト",
    note: "調査上の|平均値",
    big: "103.3万円",
    rows: [
      ["採用コスト", "103.3万円"],
      ["月額費用", "採用方法に|よって発生"],
      ["成功報酬", "―"],
      ["1人|採用した場合", "103.3万円"],
      ["応募者対応", "自社対応を|含む"],
      ["面接日程の|調整", "自社対応を|含む"],
    ],
  },
  agent: {
    name: "職人採用|エージェント",
    note: "月額のみ（何人採用しても|追加費用なし）",
    big: `月${yen(PRICE.monthly)}円`,
    rows: [
      ["採用コスト", `月額|${yen(PRICE.monthly)}円`],
      ["月額費用", `${yen(PRICE.monthly)}円`],
      ["成功報酬", "なし"],
      ["1人|採用した場合", `月額|${yen(PRICE.monthly)}円の|まま`],
      ["応募者対応", "当社が|代行"],
      ["面接日程の|調整", "当社が|代行"],
    ],
  },
  calc: [["3人採用した場合", `${MONTHLY}のまま`]],
  diff: `何人採用しても、|**${MONTHLY}で|${UNLIMITED}**`,
  cta: "採用コストを相談する",
  notes: [
    "出典：株式会社リクルート 就職みらい研究所『就職白書2020』。103.3万円は2019年度の中途採用1人あたりの平均採用コストであり、リクルートが提供する特定サービスの料金ではありません。",
    // 指定文の「広告費などの実費は含んでいません」は、広告費の負担条件を確認できるまで掲載しない
    `職人採用エージェントの料金は月額${yen(PRICE.monthly)}円で、採用人数による追加料金はありません。広告費の扱いは、無料相談時に個別にご案内します。`,
  ],
} as const;

/* ─── お悩みエリア ─── */
export type WorryArt = "noApplicant" | "missedCall" | "monthlyCost" | "quickQuit" | "declined";

export const WORRY = {
  title: "こんな採用のお悩み、|抱えていませんか？",
  items: [
    { text: "求人を出しても|職人から|**応募が来ない**", art: "noApplicant" },
    { text: "現場に出ているため|**応募者からの電話に|対応できない**", art: "missedCall" },
    { text: "採用するたびに|**高い成功報酬が|かかる**", art: "monthlyCost" },
    { text: "採用しても|**すぐやめてしまう**", art: "quickQuit" },
    { text: "人手不足によって|**新しい仕事を|断っている**", art: "declined" },
  ] as { text: string; art: WorryArt }[],
} as const;

/* ─── サービス全体図 ─── */
export const SERVICE_FLOW = {
  title: "その採用業務、|職人採用エージェントが|**代わりに担当します。**",
  steps: [
    { text: "建設会社から|採用したい職種・|条件を確認", owner: "both" },
    { text: "職人採用エージェントが|**求人原稿・採用LP・|広告を制作**", owner: "us" },
    { text: "広告を配信して|職人から|**応募を獲得**", owner: "us" },
    { text: "職人採用エージェントが|**応募者へ連絡し**、|**仕事内容と条件を説明**", owner: "us" },
    { text: "職人採用エージェントが|企業と応募者の|**面接日程を調整**", owner: "us" },
    { text: "企業が面接を行い、|**採用可否を決定**", owner: "company" },
  ] as { text: string; owner: "both" | "us" | "company" }[],
} as const;

export const OWNER_LABEL = { both: "企業 → 職人採用エージェント", us: "職人採用エージェントが担当", company: "企業が担当" } as const;

/* ─── Before／After ─── */
export const BEFORE_AFTER = {
  before: {
    title: "これまでは、|**すべて社長が対応**",
    items: ["求人を考える", "原稿を作る", "広告を出す", "応募者へ連絡する", "仕事内容を説明する", "面接日程を調整する", "面接する", "採用判断をする"],
  },
  after: {
    title: "導入後は、|**面接と採用判断に|集中**",
    usLabel: "職人採用エージェントが代行する業務",
    us: ["求人制作", "採用LP制作", "広告制作・運用", "応募獲得", "応募者への初期対応", "企業指定内容の説明", "面接日程調整"],
    companyLabel: "企業が行う業務",
    company: ["面接", "採用判断", "雇用条件の最終決定", "内定通知"],
  },
} as const;

/* ─── 代行業務の範囲 ─── */
export const SCOPE = [
  "採用したい職種・人物像の整理",
  "求人原稿・採用LPの制作",
  "広告クリエイティブの制作",
  "求人広告の配信・改善",
  "応募者への初期対応",
  "企業指定項目に基づく確認",
  "面接日程の調整",
  "応募状況の共有",
] as const;

export const COMPANY_TASKS = ["面接", "雇用"] as const;

export const SCOPE_NOTE = "企業による面接・採用判断へ進みます。**当社が独自の判断で応募者を選別・推薦することはありません。**";

/* ─── 建設業特化の強み ─── */
export const STRENGTHS: { title: string; body: string }[] = [
  { title: "職種ごとの違いを|踏まえる", body: "鳶と電気工事では、仕事内容も経験の見方も違います。職種ごとの違いを踏まえて採用を設計します。" },
  { title: "訴求する情報を整理する", body: "資格、経験年数、現場内容、勤務エリアなどを整理し、求職者が判断しやすい形で伝えます。" },
  { title: "職人に伝わる言葉で作る", body: "一般的な求人の言い回しではなく、**職人に伝わる言葉**で求人を作ります。" },
  { title: "面接につながる|応募を増やす", body: "応募単価だけを見ず、**面接につながる応募**を増やすことを目指します。" },
  { title: "データを見て改善する", body: "応募データを見ながら、広告とLPを改善します。" },
];

export const CREW_IMAGE = {
  src: "/images/saiyo-rescue/kensetsu/crew-wide.webp",
  w: 941,
  h: 520,
  alt: "ヘルメットをかぶり、木材や単管を担いで現場で働く職人",
} as const;

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

/* ─── ご利用の流れ ─── */
export const FLOW = [
  "無料相談",
  "採用条件のヒアリング",
  "ご契約",
  "採用LP・求人広告の制作",
  "広告配信・応募者対応開始",
  "面接",
  "企業による採用決定",
] as const;

/* ─── よくある質問 ─── */
export const FAQS: { q: string; a: string[] }[] = [
  {
    q: "料金はいくらですか？",
    a: [`**${MONTHLY}**です。何人採用しても、採用人数による追加料金はかかりません。${PRICE_FOOTNOTE}`],
  },
  { q: "どのような職種に対応していますか？", a: [`${TRADES.join("、")}などの職種に対応しています。`] },
  {
    q: "応募者への電話対応も任せられますか？",
    a: [`応募者への初期対応は当社が代行します。具体的な連絡方法は、${UNDECIDED}`],
  },
  {
    q: "採用する人は誰が決めますか？",
    a: ["**依頼企業が決めます。**応募者の選考、採用可否、雇用条件の最終決定、内定通知は、必ず依頼企業に行っていただきます。"],
  },
  { q: "求人原稿や採用ページも作ってもらえますか？", a: ["はい。求人原稿と採用LPの制作も代行します。"] },
  { q: "採用が決まったら、追加の料金はかかりますか？", a: [`かかりません。成果報酬はなく、**何人採用しても${MONTHLY}のまま**です。`] },
  { q: "広告費は料金に含まれますか？", a: [UNDECIDED] },
  { q: "対応可能な地域を教えてください", a: [UNDECIDED] },
  { q: "契約期間はありますか？", a: [UNDECIDED] },
];

/* ─── 最終CTA・フォーム ─── */
export const FINAL_TITLE = "人手不足で仕事を|断る前に、|**職人採用の仕組みを|つくりませんか？**";

export const FORM_JOBS = [...TRADES, "複数の職種", "その他"] as const;
export const FORM_HIRES = ["1名", "2〜3名", "4〜5名", "6名以上", "未定"] as const;
export const FORM_PLACEHOLDER = "例）求人を出しても応募が来ない。応募者への連絡まで手が回らない。など";
export const FORM_ERROR = "送信に失敗しました。お手数ですが、時間をおいて再度お試しください。";
