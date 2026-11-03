import { OPERATOR } from "@/components/saiyo-rescue/config";
import { FAQS, PRICE, SERVICE_NAME, SITE } from "./config";

const plain = (s: string) => s.replace(/\*\*/g, "").replace(/\|/g, "");

/** 検索エンジン向けの構造化データ（サービス・料金・運営者・よくある質問）。画面には何も出さない */
export default function StructuredData() {
  const url = `${SITE.origin}${SITE.path}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${OPERATOR.siteUrl}#organization`,
        name: OPERATOR.name,
        url: OPERATOR.siteUrl,
        email: OPERATOR.email,
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: SERVICE_NAME,
        serviceType: "建設業特化の採用代行",
        description: SITE.description,
        url,
        areaServed: { "@type": "Country", name: "日本" },
        audience: { "@type": "BusinessAudience", audienceType: "建設会社・工務店・専門工事会社" },
        provider: { "@id": `${OPERATOR.siteUrl}#organization` },
        offers: [
          {
            "@type": "Offer",
            name: "月額プラン（採用し放題）",
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
