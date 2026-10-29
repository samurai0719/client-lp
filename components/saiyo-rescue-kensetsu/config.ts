/**
 * 採用レスキュー 建設業向けLP（/kensetsu）の設定・掲載内容。
 * 文言・数字・価格の差し替えはこのファイルだけで完結するようにしている。
 *
 * 見た目・部品は採用レスキュー本体（components/saiyo-rescue, sr- クラス）を流用し、
 * このLP固有の部分だけ ks- クラスで足している。
 *
 * 掲載ルール（公開前に条件が確定していないものは書かない）
 * ・本体LPの「全額返金保証」「最短2日」「面談率40%以上」「累計2,465件」は、
 *   今回の料金体系の条件として確認できていないため使わない
 * ・税区分・広告費の扱い・成果報酬の発生条件・支払時期・返金条件は未確定。
 *   決めつけた文言を足さず「ご契約前にご説明します」に留める
 * ・職業紹介と誤認される表現（人材を紹介する／選定する）は使わない
 */

export const CTA_HREF = "#contact";
export const CTA_LABEL = "建設業の採用について無料相談する";
/** ヘッダーなど幅の狭い場所用 */
export const CTA_LABEL_SHORT = "無料で採用相談";

/** 本番の公開URL（saiyo.adofy-site.com/kensetsu → 物理ルート /saiyo-rescue/kensetsu） */
export const SITE_ORIGIN = "https://saiyo.adofy-site.com";
export const SITE_PATH = "/kensetsu";

export const SITE = {
  name: "採用レスキュー 建設業",
  title: "建設業の採用支援｜職人・現場スタッフの応募を採用LPと広告運用で｜採用レスキュー",
  description:
    "人が足りずに、仕事を断っていませんか？足場・鳶・塗装・外構・土木・解体・内装・設備など、建設会社の職人・現場スタッフ採用を、建設業向けの採用LP制作と広告運用で支援します。初期費用89,800円・月額費用0円・成果報酬は採用した方の想定年収の10%。まずは無料相談から。",
  ogImage: "/images/saiyo-rescue/kensetsu/og.png",
  ogW: 1200,
  ogH: 630,
} as const;

/* ─── 料金（このLPの唯一の価格ソース） ─── */
export const PRICE = {
  initial: 89800,
  monthly: 0,
  /** 成果報酬：採用した方の想定年収に対する割合（%） */
  successRate: 10,
} as const;

/** 料金例：想定年収400万円で1名採用 */
export const PRICE_EXAMPLE = {
  annualIncome: 4_000_000,
  hires: 1,
} as const;

export const yen = (n: number) => n.toLocaleString("ja-JP");

/** 万円表記（400万円 など） */
export const man = (n: number) => `${(n / 10000).toLocaleString("ja-JP")}万円`;

export const successFee = (annualIncome: number) => Math.round((annualIncome * PRICE.successRate) / 100);

/**
 * 契約条件の未確定事項について、公開文言で言えるのはここまで。
 * 確定したら PRICING_NOTES / FAQ を更新する。
 */
export const PRICING_NOTES = [
  "成果報酬は、採用した方1名ごとに、その方の想定年収の10%です。",
  "広告媒体に支払う広告費の扱いは、無料相談時にご説明します。",
  "税区分・成果報酬の発生条件・お支払い時期などの契約条件は、ご契約前にご説明します。",
] as const;

/* ─── ファーストビュー ─── */
/** FV画像（見出し・料金は画像に焼き込み済み）。元画像はユーザー支給（Downloads/Unknown-19,20.png） */
export const HERO_IMAGE = {
  pc: "/images/saiyo-rescue/kensetsu/hero-pc.webp",
  sp: "/images/saiyo-rescue/kensetsu/hero-sp.webp",
  pcW: 1672,
  pcH: 941,
  spW: 941,
  spH: 1672,
  alt: "建設業に特化した採用支援。人が足りずに、仕事を断っていませんか？職人・現場スタッフの応募獲得を支援。月額費用0円、初期費用89,800円、成果報酬は想定年収の10%。",
} as const;

export const HERO = {
  eyebrow: "建設会社の職人・現場スタッフ採用",
  title: ["人が足りずに、", "仕事を断って", "いませんか？"],
  body: "建設業に特化した採用LPと広告運用で、職人・現場スタッフの応募獲得を支援します。",
  trades: ["足場・鳶", "塗装", "外構", "土木", "解体", "内装", "設備"],
  reassure: "相談は無料です。現在の採用状況を伺ったうえで、ご提案します。",
} as const;

/** 強みセクションの写真（FV画像から職人部分を切り出したもの） */
export const CREW_IMAGE = {
  src: "/images/saiyo-rescue/kensetsu/crew-wide.webp",
  w: 941,
  h: 520,
  alt: "ヘルメットをかぶり、木材や単管を担いで現場で働く職人",
} as const;

/* ─── 建設会社によくある悩み ─── */
export type ProblemArt = "cost" | "decline" | "busy" | "writing";

export const PROBLEMS: { title: string; body: string; art: ProblemArt }[] = [
  {
    title: "求人広告にお金を払っても、応募が来ない",
    body: "掲載料を払い続けているのに、問い合わせの電話すら鳴らない。",
    art: "cost",
  },
  {
    title: "人手が足りず、受けたい仕事を断っている",
    body: "元請けから声がかかっても、現場に出せる人がいない。",
    art: "decline",
  },
  {
    title: "社長自身が現場に出ていて、採用まで手が回らない",
    body: "日中は現場、夜は見積もりと段取り。求人のことを考える時間がない。",
    art: "busy",
  },
  {
    title: "求人原稿や広告の作り方が分からない",
    body: "何を書けば職人さんに響くのか、どこに出せばいいのかが分からない。",
    art: "writing",
  },
];

export const PROBLEMS_MORE = [
  "ハローワークに出しているだけになっている",
  "若手が入らず、職人の高齢化が進んでいる",
  "自社の求人ページ・採用ページがない",
  "応募が来ても、連絡がつかないまま終わる",
] as const;

/* ─── 実績 ─── */
/** 応募獲得の集計期間（採用レスキュー本体LPの表記と同じ） */
export const RESULTS_PERIOD = "※応募獲得期間：2025年11月〜2026年10月";

export const RESULTS_NOTE =
  "※過去に運用した案件の応募件数・応募単価の一例です。応募件数は採用人数ではありません。業種・職種・地域・募集条件・広告費等により成果は異なり、同様の成果を保証するものではありません。";

/** 建設・設備求人関連の実績（最優先で見せる） */
export const CONSTRUCTION_RESULT = {
  label: "建設・設備の求人関連",
  count: 80,
  unitPrice: 7800,
} as const;

/**
 * 他業種での応募獲得実績。
 * 社名・サービス名の掲載可否が確認できていないため、既定では業種名のみを表示する。
 * 掲載許可を確認できたら SHOW_CLIENT_NAMES を true にすると name が表示される。
 */
export const SHOW_CLIENT_NAMES = false;

export const OTHER_RESULTS: { name: string; anon: string; category: string; count: number; unitPrice: number }[] = [
  { name: "ナース専科", anon: "看護師求人 案件A", category: "看護師", count: 818, unitPrice: 6549 },
  { name: "パーソル", anon: "ドライバー求人 案件A", category: "ドライバー", count: 604, unitPrice: 2689 },
  { name: "カラフル", anon: "ドライバー求人 案件B", category: "ドライバー", count: 399, unitPrice: 3675 },
  { name: "レバジョブ", anon: "ドライバー求人 案件C", category: "ドライバー", count: 309, unitPrice: 4678 },
  { name: "レバウェル看護", anon: "看護師求人 案件B", category: "看護師", count: 224, unitPrice: 6890 },
  { name: "マイナビ", anon: "薬剤師求人 案件A", category: "薬剤師", count: 31, unitPrice: 16793 },
];

/**
 * 全案件（建設・設備＋他業種）の合計。
 * 応募単価は足し合わせられないため「合計の広告費 ÷ 合計の応募件数」の加重平均で出す
 * （各案件の 応募件数×応募単価 を広告費とみなして計算）。
 */
const ALL_RESULTS = [CONSTRUCTION_RESULT, ...OTHER_RESULTS];
export const RESULTS_TOTAL = {
  count: ALL_RESULTS.reduce((n, r) => n + r.count, 0),
  avgUnitPrice: Math.round(ALL_RESULTS.reduce((n, r) => n + r.count * r.unitPrice, 0) / ALL_RESULTS.reduce((n, r) => n + r.count, 0)),
};

export const RESULTS_TOTAL_NOTE =
  "※建設・設備の求人関連と、看護師・ドライバー・薬剤師など他業種の求人の合計です。平均応募単価は、各案件の応募件数×応募単価の合計を総応募件数で割って算出しています。";

/* ─── サービス内容 ─── */
export type ServiceIcon = "lp" | "creative" | "ads" | "improve";

export const SERVICES: { no: string; title: string; body: string; points: string[]; icon: ServiceIcon }[] = [
  {
    no: "01",
    title: "採用LP制作",
    body: "求人票だけでは伝わらない、会社の雰囲気・仕事内容・待遇・社長の考え方を、職人・現場スタッフの目線で1ページにまとめます。",
    points: ["スマホで読みやすい構成", "応募フォームまでの導線設計", "ヒアリングをもとに原稿を作成"],
    icon: "lp",
  },
  {
    no: "02",
    title: "広告クリエイティブ制作",
    body: "求職者が最初に目にする広告のバナー・動画を制作します。現場の写真や動画がある場合は活用します。",
    points: ["バナー広告", "動画広告", "訴求の切り口を複数用意"],
    icon: "creative",
  },
  {
    no: "03",
    title: "広告運用",
    body: "採用LPへ求職者を集めるための広告を配信・運用します。募集職種やエリアに合わせて配信内容を調整します。",
    points: ["配信設定", "予算・配信内容の調整", "応募状況の確認"],
    icon: "ads",
  },
  {
    no: "04",
    title: "改善",
    body: "応募の集まり方を見ながら、広告やLPの見せ方を見直します。作って終わりにはしません。",
    points: ["広告クリエイティブの見直し", "LPの訴求・フォームの改善", "反応の良い訴求を伸ばす"],
    icon: "improve",
  },
];

/* ─── 取り組みと強み ─── */
export const STRENGTHS: { title: string; body: string }[] = [
  {
    title: "建設・設備の求人で、応募獲得に取り組んできました",
    body: "建設・設備の求人関連で、応募件数80件・応募単価7,800円の実績があります（応募獲得期間：2025年11月〜2026年10月）。",
  },
  {
    title: "看護師・ドライバー・薬剤師など、他業種の応募獲得の経験も活かします",
    body: "人が集まりにくいと言われる職種で、広告とLPを改善しながら応募を獲得してきました。業種は違っても、求職者が「応募しよう」と決めるまでの流れを設計する考え方は共通しています。",
  },
  {
    title: "広告からLP・応募フォームまでを一貫して設計します",
    body: "広告だけ・LPだけを作るのではなく、求職者が広告を見て、LPを読み、応募するまでの流れをまとめて設計します。",
  },
  {
    title: "原稿や写真がなくても始められます",
    body: "「何を書けばいいか分からない」状態からで大丈夫です。ヒアリングでお話を伺い、原稿や構成はこちらで作成します。現場で忙しい社長様の手間を増やしません。",
  },
];

/** 職人・現場スタッフが求人を見るときに気にしていること（強みセクションの導入） */
export const SEEKER_CHECKS = ["日給・月給はいくらか", "未経験から始められるか", "どんな人と働くのか", "休みは取れるのか", "道具や資格の支援はあるか"] as const;

/* ─── 相談から開始までの流れ ─── */
export const STEPS: { no: string; title: string; body: string }[] = [
  {
    no: "01",
    title: "無料相談",
    body: "フォームからお申し込みください。現在の採用状況・募集職種・採用エリア・お困りごとを伺います。",
  },
  {
    no: "02",
    title: "ご提案・ご契約",
    body: "採用状況をもとに進め方をご提案します。料金と契約条件をご確認いただいたうえで、ご契約となります。",
  },
  {
    no: "03",
    title: "ヒアリング・制作",
    body: "仕事内容・待遇・会社の魅力を伺い、採用LPと広告クリエイティブを制作します。",
  },
  {
    no: "04",
    title: "広告配信スタート",
    body: "採用LPを公開し、広告の配信を開始します。",
  },
  {
    no: "05",
    title: "応募状況を見ながら改善",
    body: "応募の集まり方を確認しながら、広告やLPを改善していきます。",
  },
];

/* ─── よくある質問 ─── */
export const FAQS: { q: string; a: string[] }[] = [
  {
    q: "本当に応募は来ますか？",
    a: [
      "応募件数・採用人数をお約束することはできません。職種・地域・給与などの募集条件や、競合の求人、広告費によって結果は変わります。",
      "無料相談で現在の採用状況を伺い、改善できそうな点があるかを正直にお伝えします。",
    ],
  },
  {
    q: "月額費用は本当に0円ですか？",
    a: [
      "はい、月額費用は0円です。料金は、初期費用89,800円と、採用が決まった方についての成果報酬（想定年収の10%）です。",
      "広告媒体に支払う広告費の扱いは、無料相談時にご説明します。",
    ],
  },
  {
    q: "成果報酬はいくらになりますか？",
    a: [
      "採用した方の想定年収の10%です。たとえば想定年収400万円の方を1名採用した場合、成果報酬は40万円です（初期費用89,800円は別途かかります）。",
      "成果報酬の発生条件やお支払い時期などの契約条件は、ご契約前にご説明します。",
    ],
  },
  {
    q: "人材紹介のサービスですか？",
    a: [
      "いいえ。人材を紹介するサービスではありません。採用LPの制作と広告運用によって、貴社の求人への応募獲得を支援するサービスです。",
    ],
  },
  {
    q: "どんな職種の募集に対応していますか？",
    a: [
      "足場・鳶・塗装・外構・土木・解体・内装・設備など、建設会社の職人・現場スタッフの募集についてご相談いただけます。まずは募集したい職種をお聞かせください。",
    ],
  },
  {
    q: "求人原稿や写真がありません。",
    a: [
      "問題ありません。写真がある場合は活用し、原稿はヒアリングで伺った内容をもとに作成します。「何を書けばいいか分からない」状態からでも始められます。",
    ],
  },
  {
    q: "現場に出ていて、なかなか時間が取れません。",
    a: [
      "お手間をできるだけ増やさないよう、原稿や構成の作成はこちらで行います。ご相談時に、ご都合のよい連絡方法やお時間をお知らせください。",
    ],
  },
  {
    q: "相談したら、必ず契約しないといけませんか？",
    a: ["いいえ。ご相談だけでも大丈夫です。お話を伺ったうえで、ご検討ください。"],
  },
];

/* ─── 相談フォーム ─── */
export const FORM_JOB_TYPES = [
  "足場・鳶",
  "塗装",
  "外構・エクステリア",
  "土木",
  "解体",
  "内装",
  "設備（電気・空調・水道など）",
  "施工管理",
  "複数の職種",
  "その他（建設業）",
] as const;

export const FORM_HIRE_COUNTS = ["1名", "2〜3名", "4〜5名", "6名以上", "未定・相談して決めたい"] as const;

export const FORM_REASSURE = [
  "相談したからといって、必ず契約する必要はありません。",
  "現在の採用状況を伺い、改善できそうな点があるかをお伝えします。",
] as const;
