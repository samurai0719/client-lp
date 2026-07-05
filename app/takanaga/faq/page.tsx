import type { Metadata } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";
import { faqs } from "@/data/takanaga/faqs";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import FaqClient from "@/components/takanaga/faq/FaqClient";

export const metadata: Metadata = {
  title: "よくある質問｜外構工事・無料見積もり",
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
        title="外構工事についてのよくある質問"
        subtitle="外構工事の費用や工期、無料の現地調査・お見積もり、対応エリア、工事中の生活、アフターサポートなど、高長建設へお客様からよくいただくご質問と回答をまとめました。掲載のないご質問は、お問い合わせフォームからお気軽にご相談ください。"
        path="/faq"
        breadcrumbs={[{ label: "よくある質問" }]}
      />
      <FaqClient />
      <CTASection />
    </>
  );
}
