import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowRight, HelpCircle } from "lucide-react";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import { siteConfig } from "@/data/takanaga/siteConfig";
import { serviceDetails, serviceDetailBySlug } from "@/data/takanaga/serviceDetails";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return serviceDetails.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceDetailBySlug.get(slug);
  if (!service) return {};

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `https://${siteConfig.domain}/services/${slug}` },
    keywords: service.keywords.join(", "),
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = serviceDetailBySlug.get(slug);
  if (!service) notFound();

  const siteUrl = `https://${siteConfig.domain}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "外構工事・事業内容", item: `${siteUrl}/services` },
      { "@type": "ListItem", position: 3, name: service.title, item: `${siteUrl}/services/${slug}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <PageHero
        eyebrow="Services"
        title={service.title}
        breadcrumbs={[
          { label: "外構工事・事業内容", href: "/takanaga/services" },
          { label: service.title },
        ]}
      />

      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
        <div className="mx-auto max-w-3xl">

          {/* メイン画像 */}
          {service.image && (
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-(--tkn-warm-gray)">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 768px, 100vw"
                priority
              />
            </div>
          )}

          {/* リード文 */}
          <p className="text-base leading-relaxed text-(--tkn-text) mb-10">
            {service.lead}
          </p>

          {/* 費用目安 */}
          {service.priceFrom && (
            <div className="mb-10 p-5 bg-(--tkn-blue-light) border border-(--tkn-blue-bright)/30 rounded-xl">
              <p className="text-xs font-semibold text-(--tkn-blue) mb-1">費用目安</p>
              <p className="text-2xl font-black text-(--tkn-navy-deep)">{service.priceFrom}</p>
              <p className="text-xs text-(--tkn-text-muted) mt-1">※現地状況により変わります。無料見積もりで正確な金額をご案内します。</p>
            </div>
          )}

          {/* 特長 */}
          <h2 className="text-lg font-bold text-(--tkn-navy-deep) mb-5">施工のポイント</h2>
          <div className="space-y-4 mb-12">
            {service.features.map((f, i) => (
              <div key={i} className="flex gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5 text-(--tkn-blue)" aria-hidden />
                <div>
                  <p className="font-semibold text-(--tkn-navy-deep) mb-1">{f.title}</p>
                  <p className="text-sm text-(--tkn-text) leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <h2 className="text-lg font-bold text-(--tkn-navy-deep) mb-5 flex items-center gap-2">
            <HelpCircle size={20} aria-hidden />
            よくある質問
          </h2>
          <div className="space-y-4 mb-12">
            {service.faqs.map((faq, i) => (
              <div key={i} className="tkn-card">
                <div className="flex gap-3 mb-2">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-(--tkn-blue-light) text-(--tkn-blue) flex items-center justify-center text-xs font-bold" aria-hidden>Q</span>
                  <p className="font-semibold text-(--tkn-navy-deep) leading-snug">{faq.question}</p>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-(--tkn-blue) text-white flex items-center justify-center text-xs font-bold" aria-hidden>A</span>
                  <p className="text-sm text-(--tkn-text) leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 他の工事内容へ */}
          <div className="pt-8 border-t border-(--tkn-border)">
            <Link href="/takanaga/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--tkn-blue-bright) hover:underline">
              <ArrowRight size={14} aria-hidden />
              すべての工事内容を見る
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
