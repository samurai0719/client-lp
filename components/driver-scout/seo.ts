/**
 * ドライバー採用サービス（候補者プロフィール検索）LP のSEO設定。
 * 公開URL … https://scout.adofy-site.com/（物理ルート /driver/scout）
 * ドメインを変えるときは SITE_URL と next.config.ts / proxy.ts の scoutHosts を合わせて変える。
 */
import { FAQS, FLOW, PRICE_NOTE, SERVICE_KIND, SERVICE_NAME } from "./content";

export const SITE_URL = "https://scout.adofy-site.com";
export const OG_IMAGE = { url: "/images/driver/scout/og.jpg", width: 1200, height: 630 };

/** 検索結果に出るタイトル（32文字前後に収める） */
export const TITLE = `愛知の運送会社向けドライバー採用サービス｜初期費用・月額0円｜${SERVICE_NAME}`;

/** 検索結果の説明文（120文字前後） */
export const DESCRIPTION =
  "愛知県（名古屋・尾張・三河）の運送会社向けドライバー採用サービス。トラックドライバー希望者の匿名プロフィールを年齢・免許・経験・希望勤務地を登録なしで確認し、連絡先の開示を依頼できます。初期費用・月額0円、採用決定時のみ想定年収の10％。";

/** "**強調**" 記法を外す */
const plain = (s: string) => s.replace(/\*\*/g, "");

/** 構造化データ（JSON-LD）。料金・地域・FAQ・利用の流れを検索エンジンへ正確に伝える */
export function buildJsonLd() {
  const orgId = `${SITE_URL}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SERVICE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/images/driver/logo.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${SERVICE_NAME} ${SERVICE_KIND}`,
        inLanguage: "ja",
        publisher: { "@id": orgId },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "ja",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        primaryImageOfPage: { "@type": "ImageObject", url: `${SITE_URL}${OG_IMAGE.url}` },
        breadcrumb: { "@id": `${SITE_URL}/#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/#breadcrumb`,
        itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: `${SITE_URL}/` }],
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#service`,
        name: `運送会社向け ${SERVICE_KIND}（候補者プロフィール検索）`,
        serviceType: "ドライバー採用支援",
        provider: { "@id": orgId },
        areaServed: { "@type": "State", name: "愛知県" },
        audience: { "@type": "BusinessAudience", audienceType: "運送会社・物流会社の経営者・採用担当者" },
        description:
          "トラックドライバー希望者の匿名プロフィールを登録なしで閲覧し、無料登録のうえ連絡先の開示を依頼できる採用サービス。連絡先は候補者本人が企業と求人内容を確認し、同意した場合にのみ開示されます。",
        offers: {
          "@type": "Offer",
          name: "初期費用0円・月額0円・採用決定時のみ成功報酬",
          description: `初期費用0円、月額費用0円。採用決定時に想定年収の10％の成功報酬。${PRICE_NOTE}`,
          priceCurrency: "JPY",
          price: "0",
        },
      },
      {
        "@type": "HowTo",
        "@id": `${SITE_URL}/#flow`,
        name: "利用開始までの流れ",
        step: FLOW.map((f, i) => ({ "@type": "HowToStep", position: i + 1, name: f.title, text: f.body })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: plain(f.a.join("")) },
        })),
      },
    ],
  };
}
