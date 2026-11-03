import { OPERATOR } from "@/components/saiyo-rescue/config";
import { FAQS, PRICE, SERVICE_NAME, SITE } from "./config";

const plain = (s: string) => s.replace(/\*\*/g, "").replace(/\|/g, "");

/** 「職人採用エージェント」で指名検索されたときに、このページをサービスの公式ページとして伝えるための別名 */
const ALTERNATE_NAMES = ["職人採用 エージェント", "しょくにんさいようエージェント", "職人採用エージェント（建設業の採用代行）"];

/**
 * 検索エンジン向けの構造化データ（ページ・サービス・ブランド・料金・運営者・よくある質問・パンくず）。
 * 画面には何も出さない
 */
export default function StructuredData() {
  const url = `${SITE.origin}${SITE.path}`;
  const image = `${SITE.origin}${SITE.ogImage}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${OPERATOR.siteUrl}#organization`,
        name: OPERATOR.name,
        url: OPERATOR.siteUrl,
        email: OPERATOR.email,
        founder: { "@type": "Person", name: OPERATOR.representative },
        brand: { "@id": `${url}#brand` },
      },
      {
        "@type": "Brand",
        "@id": `${url}#brand`,
        name: SERVICE_NAME,
        alternateName: ALTERNATE_NAMES,
        url,
        logo: image,
        description: SITE.description,
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: SITE.title,
        headline: SERVICE_NAME,
        description: SITE.description,
        inLanguage: "ja-JP",
        primaryImageOfPage: { "@type": "ImageObject", url: image, width: 1200, height: 630 },
        about: { "@id": `${url}#service` },
        mainEntity: { "@id": `${url}#service` },
        publisher: { "@id": `${OPERATOR.siteUrl}#organization` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: OPERATOR.name, item: OPERATOR.siteUrl },
          { "@type": "ListItem", position: 2, name: SERVICE_NAME, item: url },
        ],
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: SERVICE_NAME,
        alternateName: ALTERNATE_NAMES,
        serviceType: "建設業特化の採用代行",
        category: "採用代行（RPO）",
        description: SITE.description,
        url,
        image,
        brand: { "@id": `${url}#brand` },
        areaServed: { "@type": "Country", name: "日本" },
        audience: { "@type": "BusinessAudience", audienceType: "建設会社・工務店・専門工事会社" },
        provider: { "@id": `${OPERATOR.siteUrl}#organization` },
        offers: [
          {
            "@type": "Offer",
            name: "月額プラン（採用し放題）",
            url,
            price: PRICE.monthly,
            priceCurrency: "JPY",
            priceSpecification: { "@type": "UnitPriceSpecification", price: PRICE.monthly, priceCurrency: "JPY", unitCode: "MON" },
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a.map(plain).join("") },
        })),
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
