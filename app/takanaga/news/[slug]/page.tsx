import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import { publishedNews } from "@/data/takanaga/news";
import { siteConfig } from "@/data/takanaga/siteConfig";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return publishedNews.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = publishedNews.find((n) => n.slug === slug);
  if (!item) return {};

  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `https://${siteConfig.domain}/takanaga/news/${slug}` },
    openGraph: {
      title: `${item.title}${siteConfig.seo.titleSuffix}`,
      description: item.excerpt,
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = publishedNews.find((n) => n.slug === slug);
  if (!item) notFound();

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    datePublished: item.publishedAt,
    publisher: { "@type": "Organization", name: siteConfig.siteName },
    description: item.excerpt,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
      <PageHero
        eyebrow={item.category}
        title={item.title}
        breadcrumbs={[
          { label: "お知らせ・コラム", href: "/takanaga/news" },
          { label: item.title },
        ]}
      />

      <article className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs text-(--tkn-text-muted) mb-8">{item.publishedAt}</p>
          <div
            className="prose prose-sm max-w-none text-(--tkn-text) leading-relaxed [&>p]:mb-4 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-(--tkn-navy-deep) [&>h2]:mt-8 [&>h2]:mb-3"
            dangerouslySetInnerHTML={{ __html: item.body }}
          />

          <div className="mt-10 pt-6 border-t border-(--tkn-border)">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-semibold text-(--tkn-blue-bright) hover:text-(--tkn-blue) transition-colors"
            >
              <ArrowLeft size={14} aria-hidden />
              お知らせ・コラム一覧に戻る
            </Link>
          </div>
        </div>
      </article>

      <CTASection />
    </>
  );
}
