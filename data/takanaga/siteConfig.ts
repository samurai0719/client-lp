// ─────────────────────────────────────────────────────────────────────────────
// 高長建設 コーポレートサイト 共通設定
// 未確定の項目は null にしてください。null の項目は画面に表示されません。
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = {
  siteName: "高長建設",
  siteNameEn: "Takanaga Construction",
  tagline: "今の暮らしに合う、外構リフォームを。",
  description:
    "岐阜県・愛知県・三重県エリアの外構リフォーム専門会社。駐車場・カーポート・フェンス・お庭など、住まいの外まわりの工事に対応しています。現地調査・お見積もり無料。",
  domain: "takanagakensetu.com",
  siteUrl: "https://takanagakensetu.com",

  // ── 会社情報（未確定の項目は null ） ─────────────────────────────────
  company: {
    name: "高長建設",
    nameKana: null as string | null, // 例: "タカナガケンセツ"
    representativeName: null as string | null, // 代表者名
    founded: null as string | null, // 例: "2010年"
    established: null as string | null, // 法人設立年月（例: "2015年4月"）
    businessType: "外構工事・エクステリア工事", // 事業内容
    address: null as string | null, // 例: "岐阜県岐阜市〇〇町 1-2-3"
    addressLine2: null as string | null, // 建物名など
    phone: null as string | null, // 例: "058-XXX-XXXX"
    phoneNote: null as string | null, // 電話に関する注記
    email: null as string | null, // 例: "info@takanagakensetu.com"
    businessHours: null as string | null, // 例: "8:00〜18:00"
    closedDays: null as string | null, // 例: "日曜・祝日"
    constructionLicenseNumber: null as string | null, // 建設業許可番号
    invoiceRegistrationNumber: null as string | null, // インボイス登録番号
    googleMapsUrl: null as string | null, // Googleマップ埋め込みURL
    googleMapsEmbedUrl: null as string | null, // iframe src URL
  },

  // ── SNS（未設定は null） ────────────────────────────────────────────
  sns: {
    instagram: null as string | null,
    facebook: null as string | null,
    line: null as string | null,
    youtube: null as string | null,
    x: null as string | null,
  },

  // ── 連絡先クイックアクセス ──────────────────────────────────────────
  contact: {
    phone: null as string | null, // null の間はクリックしても発信しない
    formPath: "/takanaga/contact",
    thanksPath: "/takanaga/contact/thanks",
    crmWebhookUrl: process.env.CRM_WEBHOOK_URL ?? null,
  },

  // ── 外構LP・シミュレーターへのリンク ────────────────────────────────
  externalLinks: {
    gaikouLpUrl: "/gaikou", // 既存広告LP
    simulatorUrl: "/gaikou/diagnosis", // AIシミュレーター
  },

  // ── SEO共通設定 ──────────────────────────────────────────────────────
  seo: {
    titleSuffix: "｜高長建設",
    ogImage: "/images/gaikou/logo.png",
    twitterCard: "summary_large_image" as const,
    locale: "ja_JP",
    serviceArea: ["岐阜県", "愛知県", "三重県"],
  },

  // ── CTA文言 ──────────────────────────────────────────────────────────
  cta: {
    primary: "無料で現地調査を相談する",
    secondary: "電話で相談する",
    simulation: "AIで完成イメージを試す",
    worksLink: "施工事例を見る",
    ctaSectionHeading: "外構について、まずはお気軽にご相談ください",
    ctaSectionSubtext:
      "現地調査・お見積もりは無料です。お断りいただいても費用は一切かかりません。",
  },
} as const;
