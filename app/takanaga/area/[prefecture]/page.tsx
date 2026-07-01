import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, CheckCircle, ArrowRight, HelpCircle } from "lucide-react";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import { siteConfig } from "@/data/takanaga/siteConfig";
import { prefectureDetails, prefectureBySlug } from "@/data/takanaga/prefectureDetails";

type Props = { params: Promise<{ prefecture: string }> };

export async function generateStaticParams() {
  return prefectureDetails.map((p) => ({ prefecture: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { prefecture } = await params;
  const pref = prefectureBySlug.get(prefecture);
  if (!pref) return {};

  return {
    title: pref.metaTitle,
    description: pref.metaDescription,
    alternates: { canonical: `https://${siteConfig.domain}/area/${prefecture}` },
  };
}

export default async function PrefectureAreaPage({ params }: Props) {
  const { prefecture } = await params;
  const pref = prefectureBySlug.get(prefecture);
  if (!pref) notFound();

  const siteUrl = `https://${siteConfig.domain}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "対応地域", item: `${siteUrl}/area` },
      { "@type": "ListItem", position: 3, name: `${pref.name}の外構工事`, item: `${siteUrl}/area/${prefecture}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pref.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#organization`,
    name: siteConfig.siteName,
    url: siteUrl,
    description: siteConfig.description,
    areaServed: {
      "@type": "AdministrativeArea",
      name: pref.name,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />

      <PageHero
        eyebrow="Service Area"
        title={`${pref.name}の外構工事`}
        subtitle={`${pref.name}全域で現地調査・お見積もりに伺います。`}
        breadcrumbs={[
          { label: "対応地域", href: "/takanaga/area" },
          { label: `${pref.name}` },
        ]}
      />

      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
        <div className="mx-auto max-w-3xl">

          {/* リード文 */}
          <p className="text-base leading-relaxed text-(--tkn-text) mb-10">
            {pref.lead}
          </p>

          {/* 対応市区町村 */}
          <div className="mb-10 p-6 bg-(--tkn-blue-light) rounded-xl">
            <h2 className="text-base font-bold text-(--tkn-navy-deep) mb-4 flex items-center gap-2">
              <MapPin size={18} aria-hidden />
              {pref.name}の対応エリア
            </h2>
            <div className="flex flex-wrap gap-2">
              {pref.cities.map((city) => (
                <span
                  key={city}
                  className="text-sm px-3 py-1 bg-white border border-(--tkn-blue-bright)/30 rounded-full text-(--tkn-navy-deep)"
                >
                  {city}
                </span>
              ))}
            </div>
            <p className="text-xs text-(--tkn-text-muted) mt-3">
              ※上記以外のエリアもご相談ください。対応可能な場合があります。
            </p>
          </div>

          {/* よく依頼される工事 */}
          <h2 className="text-lg font-bold text-(--tkn-navy-deep) mb-5">{pref.name}でよくご依頼いただく工事</h2>
          <ul className="space-y-2 mb-12">
            {pref.popularServices.map((service, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle size={18} className="shrink-0 text-(--tkn-blue)" aria-hidden />
                <span className="text-sm text-(--tkn-text)">{service}</span>
              </li>
            ))}
          </ul>

          {/* 特長 */}
          <h2 className="text-lg font-bold text-(--tkn-navy-deep) mb-5">高長建設の{pref.name}対応について</h2>
          <div className="space-y-4 mb-12">
            {pref.features.map((f, i) => (
              <div key={i} className="tkn-card">
                <p className="font-semibold text-(--tkn-navy-deep) mb-2">{f.title}</p>
                <p className="text-sm text-(--tkn-text) leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <h2 className="text-lg font-bold text-(--tkn-navy-deep) mb-5 flex items-center gap-2">
            <HelpCircle size={20} aria-hidden />
            {pref.name}のお客様からよくあるご質問
          </h2>
          <div className="space-y-4 mb-12">
            {pref.faqs.map((faq, i) => (
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

          {/* 全国エリアへ */}
          <div className="pt-8 border-t border-(--tkn-border) flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/takanaga/area" className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--tkn-blue-bright) hover:underline">
              <ArrowRight size={14} aria-hidden />
              対応地域一覧に戻る
            </Link>
            <Link href="/takanaga/contact" className="tkn-btn-primary">
              無料現地調査を申し込む
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
