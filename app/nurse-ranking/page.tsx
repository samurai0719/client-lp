import type { Metadata } from "next";
import Header from "@/components/nurse-ranking/Header";
import HeroSection from "@/components/nurse-ranking/HeroSection";
import AdBannerSlot from "@/components/nurse-ranking/AdBannerSlot";
import ComparisonSection from "@/components/nurse-ranking/ComparisonSection";
import RankCard from "@/components/nurse-ranking/RankCard";
import TypeRecommendationSection from "@/components/nurse-ranking/TypeRecommendationSection";
import HowToChooseSection from "@/components/nurse-ranking/HowToChooseSection";
import FlowSection from "@/components/nurse-ranking/FlowSection";
import FaqSection from "@/components/nurse-ranking/FaqSection";
import RankingBasisSection from "@/components/nurse-ranking/RankingBasisSection";
import Footer from "@/components/nurse-ranking/Footer";
import StickyMobileCta from "@/components/nurse-ranking/StickyMobileCta";
import { services, siteMeta, adBanners, faqs } from "@/config/nurse-ranking";

const PAGE_TITLE = "看護師転職サイトおすすめランキング3選｜特徴を比較";
const PAGE_DESCRIPTION =
  "看護師向け転職サービスを、求人の探しやすさやサポート内容、連絡手段から比較。レバウェル看護・ナース専科 転職・ナースではたらこの特徴をまとめて紹介します。";

const canonicalUrl = siteMeta.domain ? `https://${siteMeta.domain}/nurse-ranking` : undefined;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [siteMeta.ogImage],
    type: "website",
  },
};

export default function NurseRankingPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s) => ({
      "@type": "ListItem",
      position: s.rank,
      name: s.name,
      url: s.officialReferenceUrl,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "トップ", item: canonicalUrl ?? "/nurse-ranking" },
      { "@type": "ListItem", position: 2, name: "看護師転職サイトおすすめランキング" },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="bg-white text-slate-900">
        <Header />
        <StickyMobileCta />

        <main className="pb-24 sm:pb-0">
          <HeroSection />

          <div className="px-4 pt-8 sm:px-6">
            <div className="mx-auto max-w-[1100px]">
              <AdBannerSlot
                banner={adBanners.top}
                slotLabel="広告バナー枠A"
                sizeLabelDesktop="推奨 728×90"
                sizeLabelMobile="推奨 320×100"
                heightClassMobile="h-[100px]"
                heightClassDesktop="lg:h-[90px]"
              />
            </div>
          </div>

          <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[1fr_300px] lg:items-start lg:gap-8 lg:py-14">
            <div className="lg:min-w-0">
              <ComparisonSection />

              <section id="ranking" className="bg-white px-0 py-12 sm:py-16" aria-labelledby="ranking-heading">
                <div className="mb-8 text-center">
                  <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">Ranking</span>
                  <h2 id="ranking-heading" className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                    1位〜3位 サービス詳細
                  </h2>
                </div>
                <div className="space-y-6">
                  {services.map((s) => (
                    <RankCard key={s.name} service={s} />
                  ))}
                </div>
              </section>

              <div className="py-2">
                <AdBannerSlot
                  banner={adBanners.middle}
                  slotLabel="広告バナー枠B"
                  sizeLabelDesktop="推奨 728×90 / 970×250"
                  sizeLabelMobile="推奨 320×100 / 300×250"
                  heightClassMobile="h-[100px]"
                  heightClassDesktop="lg:h-[120px]"
                />
              </div>
            </div>

            {/* PC右サイドバー広告枠C */}
            <aside className="hidden lg:sticky lg:top-24 lg:block">
              <AdBannerSlot
                banner={adBanners.sidebar}
                slotLabel="広告バナー枠C"
                sizeLabelDesktop="推奨 300×250"
                heightClassMobile="h-[250px]"
                heightClassDesktop="lg:h-[250px]"
                hideOnMobile
              />
            </aside>
          </div>

          <TypeRecommendationSection />
          <HowToChooseSection />
          <FlowSection />
          <FaqSection />
          <RankingBasisSection />
        </main>

        <Footer />
      </div>
    </>
  );
}
