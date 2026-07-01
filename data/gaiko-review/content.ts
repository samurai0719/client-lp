// ─────────────────────────────────────────────────────────────────────────────
// /gaiko-review 体験談型記事LP コンテンツデータ
//
// 重要：このファイルの本文・数値・比較内容は「制作時の仮原稿」です。
// 実在しない口コミ・金額・人物情報を事実として公開しないでください。
// 公開前に、実際にヒアリングした体験内容へ差し替えてから公開してください。
// confirmed: false の項目は「高長建設への確認が未了」であることを示します。
// ─────────────────────────────────────────────────────────────────────────────

export const DRAFT_NOTICE =
  "このページの体験談・金額・比較内容は制作時の仮原稿です。実際の体験内容を確認のうえ、公開前に差し替えてください。";

// 画像を差し替えるときは、同じファイル名を上書きせず新しいファイル名（-2, -3 …）で
// public/images/gaiko-review/ に追加してからここのパスを差し替えること。
// ファイル名を変えずに中身だけ上書きすると、VercelのImage Optimizationキャッシュが
// 古い画像を返し続けて反映されない（クエリ文字列での回避はNext 16でlocalPatterns設定が
// 必須になり、誤って他ページの画像まで巻き込んでブロックする事故につながるため使わない）。
export const heroContent = {
  mobileImage: "/images/gaiko-review/fv-mobile-2.png",
  desktopImage: "/images/gaiko-review/fv-desktop-2.png",
  mobileWidth: 941,
  mobileHeight: 1672,
  desktopWidth: 1672,
  desktopHeight: 941,
  alt: "外構エクステリアは施工会社に直接頼んだら50万円以上安くなった。岐阜県在住・40代夫婦の体験談。施工前後の駐車場の比較写真。",
  // 画像上のコピーとは別に、画面読み上げ用（SEO）の見出し。視覚的には表示しない。
  seoHeading: "外構エクステリアを施工会社へ直接依頼したら50万円以上安くなった話",
  priceDiffNote:
    "※掲載している費用差は、このご家庭の工事内容と相見積もり結果に基づくものです。工事内容や敷地条件によって金額は異なります。",
};

export const introContent = {
  heading: "外構をきれいにしたい。でも、どこに頼めばいいのか分かりませんでした",
  paragraphs: [
    "私たちが外構リフォームを考え始めたきっかけは、**駐車場の使いにくさ**でした。",
    "雨の日は足元が汚れやすく、雑草や砂利の手入れも負担になっていました。カーポートもなかったため、買い物から帰ったときや子どもを車へ乗せるときに**不便を感じることも増えていました**。",
    "最初は外構工事の相場も、どの会社へ頼めばいいのかも分かりませんでした。",
    "そこで、まずは**複数の会社から見積もりを取る**ことにしました。",
  ],
};

export const problemsContent = {
  heading: "リフォーム前に感じていた4つの悩み",
  items: [
    "砂利や雑草の手入れに時間がかかる",
    "雨の日に車から玄関まで濡れてしまう",
    "**駐車場が狭く見え**、車を止めにくい",
    "家の外観全体が古く見えてしまう",
  ],
};

export type ComparisonRow = {
  label: string;
  points: string[];
};

export const comparisonContent = {
  heading: "同じような工事でも、**見積もり金額に大きな差**がありました",
  // 比較表を画像化したもの（駐車場2台+カーポート施工の比較例）。金額は仮の内容です。
  graphicImage: "/images/gaiko-review/comparison-graphic.png",
  graphicAlt: "同じような工事内容でも見積もりに大きな差があった比較表。駐車場2台とカーポート施工で、高長建設80万円、他社A158万円、他社B168万円、最大88万円差。",
  graphicWidth: 1122,
  graphicHeight: 1402,
  // 会社名・金額は仮の内容です。実際の相見積もり結果に差し替えてください。
  rows: [
    {
      label: "紹介会社経由",
      points: [
        "営業担当者が窓口",
        "中間費用を含む場合がある",
        "連絡に時間がかかる場合がある",
      ],
    },
    {
      label: "地域のリフォーム会社",
      points: [
        "外構以外の工事にも対応",
        "実際の施工は協力会社の場合がある",
        "見積もりの内訳が分かりにくい場合がある",
      ],
    },
    {
      label: "施工会社へ直接相談",
      points: [
        "施工担当者へ要望を伝えやすい",
        "余計な中間費用を抑えやすい",
        "現場に合わせた提案を受けやすい",
      ],
    },
  ] as ComparisonRow[],
  resultNote:
    "今回の私たちのケースでは、同等の希望内容で比較した結果、最も高い見積もりとの差が**最大88万円**ありました。",
  disclaimer:
    "上記は私たちの家庭の見積もり内容を比較した個別の結果です。同じ差額になることをお約束するものではありません。",
};

export type DirectReason = {
  number: string;
  title: string;
  body: string;
};

export const directReasonsContent = {
  heading: "施工会社へ直接相談したことで、話が早くなりました",
  // 「営業会社を通す場合」と「施工会社へ直接頼む場合」を比較した図解。金額は仮の内容です。
  graphicImage: "/images/gaiko-review/direct-reason-graphic.png",
  graphicAlt: "なぜ施工会社に直接頼むのが良いのかを示す比較図。営業会社を通す場合は160万円〜170万円、施工会社へ直接頼む場合は80万円で、最大で半分以上安くなった。",
  graphicWidth: 1122,
  graphicHeight: 1402,
  items: [
    {
      number: "01",
      title: "要望が施工担当者へ直接伝わる",
      body: "営業担当者から現場担当者へ伝言されるのではなく、駐車台数、カーポートの幅、動線、予算などを**直接相談できました**。",
    },
    {
      number: "02",
      title: "不要な工事を減らせる",
      body: "見栄えだけではなく、実際の暮らし方に合わせて**必要な工事と不要な工事を整理**してもらえました。",
    },
    {
      number: "03",
      title: "見積もりの理由が分かりやすい",
      body: "材料費、施工費、撤去費、残土処分費など、どこに費用がかかるのかを**確認しやすかった**です。",
    },
  ] as DirectReason[],
};

export const chosenReasonsContent = {
  heading: "私たちが最終的に**高長建設さん**を選んだ理由",
  items: [
    "最初から施工内容の説明が具体的だった",
    "予算内で優先順位を考えてくれた",
    "駐車のしやすさまで考えて提案してくれた",
    "質問に対する返答が分かりやすかった",
    "公式サイトの**AIシミュレーション**で、完成イメージを事前に確認できた",
  ],
};

// 公式サイトで使えるAIシミュレーションのPR用コンテンツ
export const simulatorContent = {
  heading: "完成イメージは**AIシミュレーション**でも確認できます",
  body: "高長建設の公式サイトでは、写真とAIを使って外構の完成イメージを**事前に確認できる**シミュレーションが公開されています。私たちも打ち合わせの前に試してみて、仕上がりのイメージをすり合わせるのに役立ちました。",
  linkLabel: "AIシミュレーションを試してみる",
  // 外構LP（/gaikou）内のAIシミュレーションセクションへ直接リンク
  href: "/gaikou#exterior-simulator",
  screenshotImage: "/images/gaiko-review/official-site.png",
  screenshotAlt: "高長建設 公式サイトのトップページ画面",
  screenshotWidth: 2768,
  screenshotHeight: 1674,
};

export type ConcernItem = {
  question: string;
  answer: string;
};

export const concernsContent = {
  heading: "契約する前は、正直こんな不安もありました",
  // 保証内容・年数・資格・施工件数などの事実確認が取れていない情報は追記しないこと。
  items: [
    {
      question: "追加費用が発生しないか",
      answer:
        "見積もりの内訳について事前に確認し、想定外の工事が必要になった場合の進め方を聞いておくことで、**不安を減らす**ことができました。",
    },
    {
      question: "完成後の見た目が想像と違わないか",
      answer:
        "プラン図や使用する材料の説明に加えて、公式サイトの**AIシミュレーション**で完成イメージを事前に確認できたことで、仕上がりのイメージをすり合わせることができました。",
    },
    {
      question: "工事中に車をどこへ止めるのか",
      answer:
        "工事期間中の駐車スペースについて事前に相談し、段取りを確認しておくことで**当日困ることがありませんでした**。",
    },
    {
      question: "近所へ迷惑がかからないか",
      answer:
        "工事の音や車両の出入りについて事前に説明を受けたことで、**近隣への配慮**についても確認できました。",
    },
    {
      question: "工事後に不具合が起きないか",
      answer:
        "完成後の確認の流れについて事前に説明を受け、気になる点は**その場で相談できる体制**であることを確認しました。",
    },
  ] as ConcernItem[],
};

export type FlowStep = {
  step: number;
  title: string;
  description: string;
};

export const flowContent = {
  heading: "相談してから完成するまでの流れ",
  steps: [
    { step: 1, title: "無料相談", description: "電話またはフォームから、現在の悩みや希望を伝えます。" },
    { step: 2, title: "現地調査", description: "実際の敷地や駐車場の状況を確認してもらいます。" },
    { step: 3, title: "希望内容と予算の確認", description: "暮らし方に合わせて、優先したい工事を整理します。" },
    { step: 4, title: "プランと見積もりの提案", description: "**内訳が分かる見積もり**とプランを提示してもらいます。" },
    { step: 5, title: "契約・施工", description: "内容に納得したうえで契約し、工事が始まります。" },
    { step: 6, title: "完成確認・引き渡し", description: "仕上がりを確認してから引き渡しとなります。" },
  ] as FlowStep[],
};

export const afterChangeContent = {
  heading: "見た目だけではなく、毎日の使いやすさが変わりました",
  items: [
    "**車の出し入れがしやすく**なった",
    "雨の日の乗り降りが楽になった",
    "雑草や砂利の**手入れが減った**",
    "玄関までの動線が歩きやすくなった",
    "家全体の印象が明るくなった",
  ],
  galleryHeading: "施工後の様子",
  galleryDir: "/images/gaiko-review/gallery",
};

export const fitForContent = {
  heading: "高長建設さんは、こんな方に合うと思います",
  // 施工会社と営業会社の違いをまとめた図解。
  graphicImage: "/images/gaiko-review/fit-for-graphic-2.png",
  graphicAlt: "施工会社か営業会社か、見分けがつきにくい理由。営業会社の場合はお客様→営業会社→下請け施工会社→現場となり中間コストが重なりやすいが、高長建設は施工会社のためお客様→高長建設→現場と直接つながり、費用の理由が分かりやすく中間コストを抑えやすい。会社の見た目ではなく実際に誰が施工するのかを確認することが大切。",
  graphicWidth: 1122,
  graphicHeight: 1402,
  items: [
    "**営業会社ではなく施工会社へ直接**相談したい",
    "外構リフォームの費用をできるだけ抑えたい",
    "駐車場やカーポートを使いやすくしたい",
    "予算に合わせて工事内容を相談したい",
    "岐阜・愛知・三重で外構会社を探している",
  ],
};

export const notFitForContent = {
  heading: "すべての方に同じ工事内容が合うわけではありません",
  paragraphs: [
    "工事費用や施工内容は、敷地の広さ、既存の外構、道路との高低差、使用する材料、残土処分の量などによって変わります。",
    "そのため、写真だけで正確な金額を判断するのではなく、まずは**現地を確認してもらう**ことをおすすめします。",
  ],
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  confirmed: boolean;
};

export const faqContent = {
  heading: "よくある質問",
  items: [
    {
      id: "gr-faq-01",
      question: "相談や現地調査に費用はかかりますか？",
      answer: "**無料相談・現地調査**に対応しています（詳細な条件は高長建設へご確認ください）。",
      confirmed: false,
    },
    {
      id: "gr-faq-02",
      question: "見積もりだけでも相談できますか？",
      answer: "見積もりのみのご相談も可能です。**契約を急がせることはありません**。",
      confirmed: false,
    },
    {
      id: "gr-faq-03",
      question: "駐車場の一部だけでも工事できますか？",
      answer: "駐車場の一部のみの工事にも対応しています。現地の状況に合わせてご提案します。",
      confirmed: false,
    },
    {
      id: "gr-faq-04",
      question: "砂利からコンクリートへの変更はできますか？",
      answer: "対応可能です。既存の砂利の状態や下地によって工事内容が変わるため、現地確認のうえご案内します。",
      confirmed: false,
    },
    {
      id: "gr-faq-05",
      question: "カーポートだけ設置できますか？",
      answer: "カーポートのみの設置にも対応しています。",
      confirmed: false,
    },
    {
      id: "gr-faq-06",
      question: "工事中も自宅で生活できますか？",
      answer: "多くの場合、工事中も自宅での生活は可能です。駐車スペースの確保など、事前に相談しておくと安心です。",
      confirmed: false,
    },
    {
      id: "gr-faq-07",
      question: "岐阜県以外にも対応していますか？",
      answer: "**岐阜県・愛知県・三重県**での対応を行っています。",
      confirmed: false,
    },
    {
      id: "gr-faq-08",
      question: "相見積もり中でも相談できますか？",
      answer: "相見積もりの途中でもご相談いただけます。まずは現地を見てもらい、内容を比較するとよいと思います。",
      confirmed: false,
    },
    {
      id: "gr-faq-09",
      question: "AIシミュレーションは使えますか？",
      answer: "はい、公式サイトで**AIシミュレーション**を使って完成イメージを確認できます。相談前のイメージ合わせにも活用できます。",
      confirmed: false,
    },
  ] as FaqItem[],
};

export const finalSummaryContent = {
  heading: "最初から施工会社へ相談しておけばよかったと思いました",
  paragraphs: [
    "外構工事は決して安い買い物ではありません。",
    "私たちも最初は、どの会社へ頼んでも大きな違いはないと思っていました。",
    "しかし実際に見積もりと提案内容を比較してみると、金額だけでなく、説明の分かりやすさや提案内容にも違いがありました。",
    "**高長建設さんへ直接相談したこと**で、希望と予算の両方を整理しながら、私たちの家に合った内容を考えてもらえました。",
    "まだ工事を決めていない方も、まずは自宅の場合にどのような工事ができるのかを**相談してみるとよいと思います**。",
  ],
};

export const ctaContent = {
  heading: "自宅の外構について、**高長建設**に相談してみる",
  buttonLabel: "無料で相談・現地調査を依頼する",
  subText: "まだ工事内容が決まっていなくても相談できます",
  stickyLabel: "無料相談はこちら",
  // CTAの飛び先は高長建設の外構広告LP（見積もり相談フォームあり）
  href: "/gaikou",
};

export const workTypeOptions = [
  "駐車場のコンクリート工事",
  "カーポート設置",
  "砂利・雑草対策",
  "人工芝",
  "フェンス・目隠し",
  "門柱・アプローチ",
  "庭全体のリフォーム",
  "まだ決まっていない",
];

export const priorityPrefectures = ["岐阜県", "愛知県", "三重県"];

// ── ヘッダー・フッター用の最小限の会社表記 ─────────────────────────────
// 第三者目線の体験談記事という体裁を保つため、フッターには社名・会社情報を出さない。
export const companyInfo = {
  name: "高長建設",
  privacyPolicyPath: "/takanaga/privacy",
  contactPath: "/gaikou",
};

export const seoContent = {
  title: "外構工事を施工会社へ直接頼んだ体験談｜高長建設",
  description:
    "外構リフォームを検討した40代夫婦が、複数社の見積もりを比較し、施工会社へ直接相談した体験を紹介。駐車場のコンクリート工事やカーポート設置を検討している方へ。",
  // 架空の著者名は設定しない。事実に合わせて後から変更できるようにする。
  author: "岐阜県在住・40代夫婦（匿名）",
  ogImage: "/images/gaiko-review/fv-desktop-2.png",
  siteUrl: "https://takanagakensetu.com",
  path: "/gaiko-review",
};

// ── GAイベント名（既存GA/GTM/Meta Pixelが導入済みの場合に発火） ─────────────
export const analyticsEvents = {
  articleCtaClick: "gaiko_article_cta_click",
  stickyCtaClick: "gaiko_sticky_cta_click",
} as const;
