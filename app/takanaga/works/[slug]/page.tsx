import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import { publishedWorks } from "@/data/takanaga/works";
import { siteConfig } from "@/data/takanaga/siteConfig";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return publishedWorks.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = publishedWorks.find((w) => w.slug === slug);
  if (!work) return {};

  return {
    title: work.title,
    description: `${work.prefecture}${work.city}の施工事例。${work.customerConcern}`,
    alternates: { canonical: `https://${siteConfig.domain}/works/${slug}` },
    openGraph: {
      title: `${work.title}${siteConfig.seo.titleSuffix}`,
      images: [{ url: work.afterImage }],
    },
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const work = publishedWorks.find((w) => w.slug === slug);
  if (!work) notFound();

  const currentIndex = publishedWorks.indexOf(work);
  const prevWork = currentIndex > 0 ? publishedWorks[currentIndex - 1] : null;
  const nextWork = currentIndex < publishedWorks.length - 1 ? publishedWorks[currentIndex + 1] : null;

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: work.title,
    image: [`https://${siteConfig.domain}${work.afterImage}`],
    publisher: { "@type": "Organization", name: siteConfig.siteName },
    description: work.customerConcern,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
      <PageHero
        eyebrow="Works"
        title={work.title}
        breadcrumbs={[
          { label: "施工事例", href: "/takanaga/works" },
          { label: work.title },
        ]}
      />

      <article className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
        <div className="mx-auto max-w-4xl">
          {/* メタ情報 */}
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="flex items-center gap-1.5 text-sm text-(--tkn-blue-bright) font-semibold bg-(--tkn-blue-light) px-3 py-1.5 rounded-full">
              <Tag size={14} aria-hidden />
              {work.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-(--tkn-text-muted)">
              <MapPin size={14} aria-hidden />
              {work.prefecture}{work.city}
            </span>
            {work.duration && (
              <span className="flex items-center gap-1.5 text-sm text-(--tkn-text-muted)">
                <Clock size={14} aria-hidden />
                工期 {work.duration}
              </span>
            )}
            {work.priceRange && (
              <span className="text-sm text-(--tkn-text-muted)">
                費用目安 {work.priceRange}
              </span>
            )}
          </div>

          {/* Before/After 画像 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div>
              <p className="text-xs font-bold text-(--tkn-text-muted) mb-2 uppercase tracking-widest">
                Before
              </p>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-(--tkn-warm-gray)">
                <Image
                  src={work.beforeImage}
                  alt={`${work.title} Before`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 50vw, 100vw"
                  priority
                />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-(--tkn-blue-bright) mb-2 uppercase tracking-widest">
                After
              </p>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-(--tkn-warm-gray)">
                <Image
                  src={work.afterImage}
                  alt={`${work.title} After`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 50vw, 100vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/* 詳細情報 */}
          <div className="space-y-8">
            <section aria-labelledby="concern-heading">
              <h2 id="concern-heading" className="text-lg font-bold text-(--tkn-navy-deep) mb-3 pb-2 border-b border-(--tkn-border)">
                お客様のお悩み
              </h2>
              <p className="text-(--tkn-text) leading-relaxed">{work.customerConcern}</p>
            </section>

            <section aria-labelledby="proposal-heading">
              <h2 id="proposal-heading" className="text-lg font-bold text-(--tkn-navy-deep) mb-3 pb-2 border-b border-(--tkn-border)">
                高長建設からのご提案
              </h2>
              <p className="text-(--tkn-text) leading-relaxed">{work.proposal}</p>
            </section>

            <section aria-labelledby="content-heading">
              <h2 id="content-heading" className="text-lg font-bold text-(--tkn-navy-deep) mb-3 pb-2 border-b border-(--tkn-border)">
                工事内容
              </h2>
              <ul className="space-y-2">
                {work.workContent.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-(--tkn-text)">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-(--tkn-blue-light) text-(--tkn-blue) flex items-center justify-center text-xs font-bold mt-0.5" aria-hidden>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {work.materials && work.materials.length > 0 && (
              <section aria-labelledby="materials-heading">
                <h2 id="materials-heading" className="text-lg font-bold text-(--tkn-navy-deep) mb-3 pb-2 border-b border-(--tkn-border)">
                  使用した商品・素材
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {work.materials.map((m, i) => (
                    <li key={i} className="text-sm bg-(--tkn-warm-gray) text-(--tkn-text) px-3 py-1.5 rounded border border-(--tkn-border)">
                      {m}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {work.point && (
              <section aria-labelledby="point-heading">
                <h2 id="point-heading" className="text-lg font-bold text-(--tkn-navy-deep) mb-3 pb-2 border-b border-(--tkn-border)">
                  施工のポイント
                </h2>
                <p className="text-(--tkn-text) leading-relaxed">{work.point}</p>
              </section>
            )}

            {work.staffComment && (
              <div className="p-5 bg-(--tkn-blue-light) rounded-xl">
                <p className="text-xs font-bold text-(--tkn-blue) mb-2 uppercase tracking-widest">担当者コメント</p>
                <p className="text-(--tkn-text) leading-relaxed">{work.staffComment}</p>
              </div>
            )}
          </div>

          {/* 前後ナビゲーション */}
          <nav className="mt-12 pt-8 border-t border-(--tkn-border) flex justify-between gap-4" aria-label="施工事例ナビゲーション">
            {prevWork ? (
              <Link href={`/takanaga/works/${prevWork.slug}`} className="flex items-center gap-2 text-sm text-(--tkn-blue-bright) hover:text-(--tkn-blue) transition-colors">
                <ArrowLeft size={16} aria-hidden />
                <span className="line-clamp-1">{prevWork.title}</span>
              </Link>
            ) : <div />}
            {nextWork ? (
              <Link href={`/takanaga/works/${nextWork.slug}`} className="flex items-center gap-2 text-sm text-(--tkn-blue-bright) hover:text-(--tkn-blue) transition-colors">
                <span className="line-clamp-1">{nextWork.title}</span>
                <ArrowRight size={16} aria-hidden />
              </Link>
            ) : <div />}
          </nav>

          <div className="text-center mt-6">
            <Link href="/takanaga/works" className="inline-flex items-center gap-2 text-sm font-semibold text-(--tkn-blue-bright) hover:text-(--tkn-blue) transition-colors">
              <ArrowLeft size={14} aria-hidden />
              施工事例一覧に戻る
            </Link>
          </div>
        </div>
      </article>

      <CTASection />
    </>
  );
}
