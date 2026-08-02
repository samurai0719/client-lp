// ─────────────────────────────────────────────────────────────────────────────
// 看護師転職サイトランキング（/nurse-ranking） 設定ファイル
//
// ランキング情報・CTA URL・広告バナー・更新日はこのファイルに集約し、UIコンポーネント側に
// 数値・文言をハードコードしない。サービスの並び順は rank の昇順で固定（自動並べ替え禁止）。
//
// 【要対応】affiliateUrl が "#" のサービスは、正式なアフィリエイトリンクが未設定。
// 本番公開前に必ず実際のリンクへ差し替えること（"#" のままだと AffiliateLink コンポーネントが
// クリックを無効化し、開発時にコンソール警告を出す）。
// ─────────────────────────────────────────────────────────────────────────────

export type Service = {
  rank: 1 | 2 | 3;
  name: string;
  shortConclusion: string;
  points: string[];
  recommendedFor: string[];
  caution: string;
  affiliateUrl: string;
  officialReferenceUrl: string;
  sourceCheckedAt: string;

  // ── 以下は表示用の付加情報（最低限の型に対する拡張） ──────────────────
  /** 比較表・カードで使う結論の要約（〜がおすすめ、を除いた名詞句） */
  catchphrase: string;
  /** 相談料金（比較表に表示。数値をでっち上げず「無料」等の確認済み事実のみ記載） */
  consultationFee: string;
  /** 連絡手段 */
  contactMethods: string;
  /** 比較表「おすすめポイント」列の要約（1行） */
  comparisonHighlight: string;
  /** 比較表「向いている人」列の要約（1行） */
  comparisonSuitableFor: string;
  /** メインCTA文言 */
  ctaLabel: string;
  /**
   * 規模・実績に関する事実（求人数など）。公式サイトに掲載されている情報のみを記載し、
   * リアルタイムで変動する数値は「時点」を明記する。ここに書いていない数値をUI側で
   * 作らないこと（sourceCheckedAt・officialReferenceUrlとセットで必ず出典を示す）。
   */
  scaleFact: string;
};

// サービスの並び順は rank の昇順で固定。求人数・評価点等で自動的に並び替えないこと。
export const services: Service[] = [
  {
    rank: 1,
    name: "レバウェル看護",
    catchphrase: "職場のリアルな情報を確認しながら選びたい方に",
    shortConclusion:
      "職場の雰囲気や内部事情まで確認しながら選びたい方におすすめ",
    points: [
      "実際に働く方へのインタビュー等から、表に出にくい職場情報を提供",
      "給与や残業など、自分では聞きにくい内容の確認をサポート",
      "面接対策や転職相談にも対応",
    ],
    recommendedFor: [
      "人間関係や職場の雰囲気を重視したい",
      "初めての転職でサポートがほしい",
      "転職するか迷っており、まず情報収集から始めたい",
    ],
    caution:
      "担当者との連絡頻度や提案内容が自分に合うか、最初の面談で希望を具体的に伝えて確認してください。",
    affiliateUrl: "#",
    officialReferenceUrl: "https://kango-oshigoto.jp/",
    sourceCheckedAt: "2026-07-29",
    consultationFee: "無料",
    contactMethods: "電話・メール・LINE（公式サイトで要確認）",
    comparisonHighlight: "職場のリアルな内部情報の提供に強い",
    comparisonSuitableFor: "職場の雰囲気を重視したい人",
    ctaLabel: "公式サイトで無料相談する",
    // 公式サイト記載。全国の医療施設・介護福祉施設等の求人を掲載（同サイトの注記では2023年8月21日時点の数値）。
    scaleFact: "全国60,000件以上の医療施設・介護福祉施設等の求人を掲載（公式サイト記載、2023年8月時点）",
  },
  {
    rank: 2,
    name: "ナース専科 転職",
    catchphrase: "地域事情に詳しい担当者に幅広い選択肢から探したい方に",
    shortConclusion:
      "豊富な選択肢から地域事情に合う求人を探したい方におすすめ",
    points: [
      "看護師専門の転職支援サービス",
      "地域専任のキャリアパートナーが求人探しを支援",
      "転職するか迷っている段階でも相談可能",
    ],
    recommendedFor: [
      "地域密着の情報を重視したい",
      "多くの選択肢を比較したい",
      "希望条件がまだ明確に決まっていない",
    ],
    caution:
      "求人数の表記には累計・公開求人・取り扱い求人など複数の集計方法があるため、必ず注記と確認日を表示してください。",
    affiliateUrl: "#",
    // nursejinzaibank.com は tenshoku.nurse-senka.com へ301リダイレクトされるため、
    // 実際に情報を確認したリダイレクト先URLを出典として記載する。
    officialReferenceUrl: "https://tenshoku.nurse-senka.com/support_service/",
    sourceCheckedAt: "2026-07-29",
    consultationFee: "無料",
    contactMethods: "電話・メール（公式サイトで要確認）",
    comparisonHighlight: "地域専任パートナーによる求人探しの支援",
    comparisonSuitableFor: "地域密着の情報を重視したい人",
    ctaLabel: "公式サイトで無料相談する",
    // 公式サイト記載。「4年連続転職No.1」等の第三者調査に基づく訴求は、当サイトの独自ランキングと
    // 混同を招くおそれがあるため掲載せず、事実として確認できる求人数・利用者数のみ記載する。
    scaleFact: "掲載求人数240,000件以上、累計利用者130万人以上（公式サイト記載）",
  },
  {
    rank: 3,
    name: "ナースではたらこ",
    catchphrase: "気になる病院への確認や手厚いサポートを希望する方に",
    shortConclusion:
      "気になる病院への確認や、手厚い転職サポートを希望する方におすすめ",
    points: [
      "専任キャリアアドバイザーが求人紹介から条件交渉までサポート",
      "希望する医療機関へ求人状況を確認する「逆指名」に対応",
      "履歴書・面接対策から入職後の相談まで対応",
    ],
    recommendedFor: [
      "働きたい病院・施設がある",
      "条件交渉や日程調整を任せたい",
      "非公開求人も含めて相談したい",
    ],
    caution:
      "希望する医療機関の求人状況や条件は時期によって異なることを明記してください。",
    affiliateUrl: "#",
    officialReferenceUrl: "https://www.hatarako.net/agent/nurse/service/index.html",
    sourceCheckedAt: "2026-07-29",
    consultationFee: "無料",
    contactMethods: "電話・メール（公式サイトで要確認）",
    comparisonHighlight: "逆指名による希望病院への求人確認に対応",
    comparisonSuitableFor: "働きたい病院・施設が決まっている人",
    ctaLabel: "公式サイトで無料相談する",
    // 公式サイトに掲載求人数の記載が確認できなかったため、数値の代わりに確認できた運営実績のみ記載する
    // （求人数は検索結果によって値が変動するため、根拠の弱い数値をここに追加しない）。
    scaleFact: "2009年サービス開始（厚生労働大臣許可番号 13-ユ-303788、公式サイト記載）",
  },
];

export const getServiceByRank = (rank: 1 | 2 | 3): Service =>
  services.find((s) => s.rank === rank) ?? services[0];

// ── ページ全体の設定 ─────────────────────────────────────────────────────

export const siteMeta = {
  siteName: "看護師転職サイトおすすめランキング",
  // 実際のコンテンツ更新日をここで管理する（公開日ではない）
  contentUpdatedAt: "2026-07-29",
  // TODO: 本番公開ドメインが決まり次第、正しいドメインに差し替える
  domain: null as string | null,
  ogImage: "/images/nurse-ranking-hero.jpg",
};

export const editorialBasisText =
  "当サイトでは、公式情報をもとに「求人の探しやすさ」「サポート内容」「連絡手段」「職場情報の充実度」「運営・サービス実績」を比較し、編集方針に基づいて掲載順を決定しています。掲載順位は利用者全員に最適な順番を保証するものではありません。";

export const comparisonFootnote =
  "※ 求人数・実績は各社公式サイトに掲載されている情報を出典・確認日とともに記載しています（各サービスの詳細内の「情報確認日」を参照）。数値は変動するため、最新の情報は必ず各サービスの公式サイトでご確認ください。";

// FAQPageの構造化データは、この配列を唯一の情報源として画面表示とJSON-LDの両方に使う
// （表示内容と構造化データを一致させるため、ここ以外に質問文・回答文を複製しないこと）。
export const faqs: { question: string; answer: string }[] = [
  {
    question: "本当に無料で利用できますか？",
    answer:
      "各サービスとも、看護師の方が利用する際の相談・求人紹介にかかる費用は無料です。詳しい料金体系は各サービスの公式サイト・利用規約でご確認ください。",
  },
  {
    question: "転職するか決めていなくても相談できますか？",
    answer:
      "多くのサービスで、転職するか迷っている段階からの相談を受け付けています。まずは情報収集だけしたい場合も、その旨を担当者に伝えて相談を始められます。",
  },
  {
    question: "複数のサービスへ登録しても問題ありませんか？",
    answer:
      "複数のサービスに登録すること自体は可能です。ただし、複数登録すれば必ず転職が成功するわけではありません。比較検討のために活用しつつ、ご自身に合うサービスを選んでください。",
  },
  {
    question: "担当者からの連絡が多い場合はどうすればよいですか？",
    answer:
      "連絡の頻度や時間帯の希望は、担当者に直接伝えることで調整してもらえる場合があります。改善されない場合は、各サービスの窓口へ相談することをおすすめします。",
  },
  {
    question: "希望と違う求人を紹介された場合は断れますか？",
    answer:
      "希望条件と異なる求人は断って問題ありません。断りづらい場合も、希望条件を改めて具体的に伝えることで、その後の提案が改善されることがあります。",
  },
  {
    question: "個人情報は勤務先に知られませんか？",
    answer:
      "各サービスとも個人情報の取り扱いには一定のルールを設けています。具体的な管理方法や第三者提供の範囲は、各サービスのプライバシーポリシー・利用規約でご確認ください。",
  },
];

// ── 広告バナー枠 ─────────────────────────────────────────────────────────
// 画像URL・遷移URL・alt・表示/非表示をこのオブジェクトのみで管理する。
// enabled: false の間は、レイアウトが崩れない薄いグレーのプレースホルダーを表示する。
// desktopImage / mobileImage は public/images/nurse-ranking/ 配下の相対パスを想定。

type AdBanner = {
  enabled: boolean;
  desktopImage: string;
  mobileImage: string;
  href: string;
  alt: string;
};

type SidebarAdBanner = {
  enabled: boolean;
  desktopImage: string;
  href: string;
  alt: string;
};

export const adBanners: {
  top: AdBanner;
  middle: AdBanner;
  sidebar: SidebarAdBanner;
} = {
  top: {
    enabled: false,
    desktopImage: "",
    mobileImage: "",
    href: "",
    alt: "広告",
  },
  middle: {
    enabled: false,
    desktopImage: "",
    mobileImage: "",
    href: "",
    alt: "広告",
  },
  sidebar: {
    enabled: false,
    desktopImage: "",
    href: "",
    alt: "広告",
  },
};
