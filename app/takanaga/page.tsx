import type { Metadata } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";
import HeroSection from "@/components/takanaga/home/HeroSection";
import AboutSection from "@/components/takanaga/home/AboutSection";
import SiteGuideSection from "@/components/takanaga/home/SiteGuideSection";
import ProblemsSection from "@/components/takanaga/home/ProblemsSection";
import ServicesSection from "@/components/takanaga/home/ServicesSection";
import WorksSection from "@/components/takanaga/home/WorksSection";
import ReasonsSection from "@/components/takanaga/home/ReasonsSection";
import SimulatorSection from "@/components/takanaga/home/SimulatorSection";
import PriceSection from "@/components/takanaga/home/PriceSection";
import FlowSection from "@/components/takanaga/home/FlowSection";
import AreaSection from "@/components/takanaga/home/AreaSection";
import FaqSection from "@/components/takanaga/home/FaqSection";
import CTASection from "@/components/takanaga/common/CTASection";

const siteUrl = `https://${siteConfig.domain}`;

export const metadata: Metadata = {
  title: `${siteConfig.siteName}｜岐阜・愛知・三重の外構工事・外構リフォーム`,
  description:
    "高長建設は岐阜県・愛知県・三重県で、駐車場コンクリート、カーポート、フェンス、庭リフォームなどに対応する外構工事会社です。現地調査・お見積もり無料。",
  alternates: {
    // 2026-07-04切替済み: ルート（/）＝コーポレートHPが正規URL
    canonical: `${siteUrl}/`,
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${siteConfig.siteName}｜岐阜・愛知・三重の外構工事・外構リフォーム`,
    description:
      "高長建設は岐阜県・愛知県・三重県で、駐車場コンクリート、カーポート、フェンス、庭リフォームなどに対応する外構工事会社です。現地調査・お見積もり無料。",
    url: `${siteUrl}/`,
  },
};

export default function TakanagaTopPage() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteConfig.siteName,
    description: siteConfig.description,
    inLanguage: "ja",
    publisher: { "@id": `${siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/works?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  // Organization（LocalBusinessとは別ノードとして出力し、WebSiteのpublisherから参照する）
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteConfig.siteName,
    url: `${siteUrl}/`,
    logo: `${siteUrl}/images/gaikou/logo.png`,
    ...(siteConfig.company.phone ? { telephone: siteConfig.company.phone } : {}),
    address: {
      "@type": "PostalAddress",
      postalCode: siteConfig.company.postalCode ?? undefined,
      addressRegion: "岐阜県",
      addressLocality: "各務原市",
      streetAddress: "那加桐野町1-65",
      addressCountry: "JP",
    },
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    // 外構・エクステリア工事業者に最も近いスキーマ種別
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    name: siteConfig.siteName,
    description: siteConfig.description,
    url: siteUrl,
    image: `${siteUrl}${siteConfig.seo.ogImage}`,
    logo: `${siteUrl}/images/gaikou/logo.png`,
    areaServed: siteConfig.seo.serviceArea.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    address: {
      "@type": "PostalAddress",
      postalCode: siteConfig.company.postalCode ?? undefined,
      addressRegion: "岐阜県",
      addressLocality: "各務原市",
      streetAddress: "那加桐野町1-65",
      addressCountry: "JP",
    },
    ...(siteConfig.company.googleMapsUrl ? { hasMap: siteConfig.company.googleMapsUrl } : {}),
    ...(siteConfig.company.phone ? { telephone: siteConfig.company.phone } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <HeroSection />
      <AboutSection />
      <SiteGuideSection />
      <ProblemsSection />
      <ServicesSection />
      <WorksSection />
      <ReasonsSection />
      <SimulatorSection />
      <PriceSection />
      <FlowSection />
      <AreaSection />
      <FaqSection />
      <CTASection />
    </>
  );
}
