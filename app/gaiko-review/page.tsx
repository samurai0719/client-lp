import type { Metadata } from "next";
import { seoContent, heroContent } from "@/data/gaiko-review/content";
import { getGalleryImages } from "@/lib/gaikoReview/gallery";
import "./gaiko-review.css";

import SimpleHeader from "@/components/gaiko-review/SimpleHeader";
import SimpleFooter from "@/components/gaiko-review/SimpleFooter";
import Hero from "@/components/gaiko-review/Hero";
import IntroSection from "@/components/gaiko-review/IntroSection";
import ComparisonSection from "@/components/gaiko-review/ComparisonSection";
import DirectReasonsSection from "@/components/gaiko-review/DirectReasonsSection";
import ChosenReasonsSection from "@/components/gaiko-review/ChosenReasonsSection";
import ConcernsSection from "@/components/gaiko-review/ConcernsSection";
import FlowSection from "@/components/gaiko-review/FlowSection";
import AfterChangeSection from "@/components/gaiko-review/AfterChangeSection";
import FitForSection from "@/components/gaiko-review/FitForSection";
import FaqSection from "@/components/gaiko-review/FaqSection";
import FinalSummarySection from "@/components/gaiko-review/FinalSummarySection";
import FinalCtaSection from "@/components/gaiko-review/FinalCtaSection";
import StickyMobileCta from "@/components/gaiko-review/StickyMobileCta";

export const metadata: Metadata = {
  metadataBase: new URL(seoContent.siteUrl),
  title: seoContent.title,
  description: seoContent.description,
  alternates: { canonical: seoContent.path },
  openGraph: {
    type: "article",
    title: seoContent.title,
    description: seoContent.description,
    url: seoContent.path,
    siteName: "高長建設",
    locale: "ja_JP",
    images: [
      {
        url: seoContent.ogImage,
        width: heroContent.desktopWidth,
        height: heroContent.desktopHeight,
        alt: seoContent.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoContent.title,
    description: seoContent.description,
    images: [seoContent.ogImage],
  },
};

export default function GaikoReviewPage() {
  const galleryImages = getGalleryImages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: seoContent.title,
    description: seoContent.description,
    inLanguage: "ja",
    author: {
      "@type": "Person",
      name: seoContent.author,
    },
    image: `${seoContent.siteUrl}${seoContent.ogImage}`,
    mainEntityOfPage: `${seoContent.siteUrl}${seoContent.path}`,
    publisher: {
      "@type": "Organization",
      name: "高長建設",
    },
  };

  return (
    <div className="gr-page min-h-screen flex flex-col" style={{ backgroundColor: "#F8F4EC" }}>
      {/* 見出し用の明朝フォント（React 19の<link>ホイスティングでheadへ配置される） */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;500;600;700&display=swap"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SimpleHeader />

      <main className="flex-1">
        <Hero />
        <IntroSection />
        <ComparisonSection />
        <DirectReasonsSection />
        <ChosenReasonsSection />
        <ConcernsSection />
        <FlowSection />
        <AfterChangeSection galleryImages={galleryImages} />
        <FitForSection />
        <FaqSection />
        <FinalSummarySection />
        <FinalCtaSection />
      </main>

      <SimpleFooter />
      <StickyMobileCta />
    </div>
  );
}
