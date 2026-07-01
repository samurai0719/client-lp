import type { Metadata } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";
import { faqs } from "@/data/takanaga/faqs";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import FaqClient from "@/components/takanaga/faq/FaqClient";

export const metadata: Metadata = {
  title: "よくある質問",
  description: "高長建設への外構工事に関するよくある質問。費用・工事内容・対応エリア・手続き・アフターサポートなど、お客様からよくいただくご質問をまとめました。",
  alternates: { canonical: `https://${siteConfig.domain}/faq` },
};

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHero
        eyebrow="FAQ"
        title="よくある質問"
        subtitle="お客様からよくいただくご質問をまとめました。"
        breadcrumbs={[{ label: "よくある質問" }]}
      />
      <FaqClient />
      <CTASection />
    </>
  );
}
