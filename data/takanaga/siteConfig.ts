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
  // 正規URLはwwwあり・httpsに統一（canonical・sitemap・JSON-LDすべてこの形式）
  domain: "www.takanagakensetu.com",
  siteUrl: "https://www.takanagakensetu.com",

  // ── 会社情報 ─────────────────────────────────────────────────────────
  company: {
    name: "高長建設",
    nameKana: null as string | null,
    representativeName: "長屋彰人" as string | null,
    founded: null as string | null,
    established: null as string | null,
    businessType: "外構工事・エクステリア工事",
    postalCode: "504-0008" as string | null,
    address: "岐阜県各務原市那加桐野町1-65" as string | null,
    addressLine2: null as string | null,
    phone: "090-6598-4896" as string | null,
    phoneNote: null as string | null,
    email: null as string | null,
    businessHours: null as string | null,
    closedDays: null as string | null,
    constructionLicenseNumber: null as string | null,
    invoiceRegistrationNumber: null as string | null,
    // Googleマップ共有URLはGoogle Mapsで住所検索→「共有」→「リンクをコピー」で取得
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("岐阜県各務原市那加桐野町1-65")}` as string | null,
    // iframe埋め込みURLはGoogle Maps→「共有」→「地図を埋め込む」→srcを貼り付け
    googleMapsEmbedUrl: null as string | null,
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
    phone: "090-6598-4896" as string | null,
    formPath: "/contact",
    thanksPath: "/contact/thanks",
    crmWebhookUrl: process.env.CRM_WEBHOOK_URL ?? null,
  },

  // ── 外構LP・シミュレーターへのリンク ────────────────────────────────
  externalLinks: {
    // 外構広告LPは /takanaga で配信（2026-07-04のURL構成変更）
    gaikouLpUrl: "/takanaga",
    simulatorUrl: "/simulation",
  },

  // ── SEO共通設定 ──────────────────────────────────────────────────────
  seo: {
    titleSuffix: "｜高長建設",
    // OGPは1200×630推奨。施工事例写真から生成（public/images/takanaga/og-image.jpg）
    ogImage: "/images/takanaga/og-image.jpg",
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
