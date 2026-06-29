import type { Metadata } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";
import HeroSection from "@/components/takanaga/home/HeroSection";
import AboutSection from "@/components/takanaga/home/AboutSection";
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

export const metadata: Metadata = {
  title: `${siteConfig.siteName}｜岐阜・愛知・三重の外構リフォーム専門会社`,
  description: siteConfig.description,
  alternates: {
    canonical: `https://${siteConfig.domain}/`,
  },
  openGraph: {
    title: `${siteConfig.siteName}｜岐阜・愛知・三重の外構リフォーム専門会社`,
    description: siteConfig.description,
    url: `https://${siteConfig.domain}/`,
  },
};

export default function TakanagaTopPage() {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://${siteConfig.domain}`,
    name: siteConfig.siteName,
    description: siteConfig.description,
    url: `https://${siteConfig.domain}/`,
    image: `https://${siteConfig.domain}${siteConfig.seo.ogImage}`,
    areaServed: siteConfig.seo.serviceArea.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    ...(siteConfig.company.address
      ? { address: { "@type": "PostalAddress", addressLocality: siteConfig.company.address } }
      : {}),
    ...(siteConfig.company.phone
      ? { telephone: siteConfig.company.phone }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
      <HeroSection />
      <AboutSection />
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
