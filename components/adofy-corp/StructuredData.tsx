import { CORP_SITE, CORP_PAGES } from "./seo";

/**
 * 構造化データ。
 * Organization / WebSite / Service を1つのグラフにまとめ、
 * 下層ページではパンくずも出す。
 * 実績のない断定的な表現は入れない。
 */
export function CorpStructuredData({
  breadcrumb,
}: {
  /** 下層ページのパンくず。トップでは省略する */
  breadcrumb?: { name: string; path: string }[];
}) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": `${CORP_SITE.url}/#organization`,
      name: CORP_SITE.name,
      url: CORP_SITE.url,
      description:
        "岐阜を拠点に、Web広告運用とLP・ホームページ制作を行うWebマーケティング会社。",
      areaServed: { "@type": "Country", name: "日本" },
      address: {
        "@type": "PostalAddress",
        addressRegion: CORP_SITE.area,
        addressCountry: "JP",
      },
      knowsAbout: [
        "Web広告運用",
        "Meta広告",
        "ランディングページ制作",
        "ホームページ制作",
        "SEO",
        "建設業のWeb集客",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${CORP_SITE.url}/#website`,
      url: CORP_SITE.url,
      name: CORP_SITE.name,
      inLanguage: "ja",
      publisher: { "@id": `${CORP_SITE.url}/#organization` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${CORP_SITE.url}/#service`,
      name: "Web広告運用・ホームページ制作",
      provider: { "@id": `${CORP_SITE.url}/#organization` },
      areaServed: { "@type": "Country", name: "日本" },
      serviceType: ["Web広告運用", "ランディングページ制作", "ホームページ制作"],
      description:
        "ターゲット分析からクリエイティブ改善、LP最適化まで一貫して行い、広告から問い合わせまでの導線を設計します。",
    },
  ];

  if (breadcrumb && breadcrumb.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "ホーム",
          item: CORP_SITE.url,
        },
        ...breadcrumb.map((b, i) => ({
          "@type": "ListItem",
          position: i + 2,
          name: b.name,
          item: `${CORP_SITE.url}${b.path}`,
        })),
      ],
    });
  }

  return (
    <script
      type="application/ld+json"
      // 自前の静的データのみを流し込む
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}

/** 実績ページ用のパンくず */
export function worksBreadcrumb(key: keyof typeof CORP_PAGES) {
  const page = CORP_PAGES[key];
  return [{ name: page.title.split("｜")[0], path: page.path }];
}
