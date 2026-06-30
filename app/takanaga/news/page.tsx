import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import { publishedNews } from "@/data/takanaga/news";
import { siteConfig } from "@/data/takanaga/siteConfig";

export const metadata: Metadata = {
  title: "お知らせ・コラム",
  description: "高長建設からのお知らせと、外構リフォームに関するコラムをご覧いただけます。",
  alternates: { canonical: `https://${siteConfig.domain}/takanaga/news` },
};

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="News & Column"
        title="お知らせ・コラム"
        breadcrumbs={[{ label: "お知らせ・コラム" }]}
      />

      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
        <div className="mx-auto max-w-4xl">
          {publishedNews.length > 0 ? (
            <ul className="space-y-4">
              {publishedNews.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/news/${item.slug}`}
                    className="group flex flex-col sm:flex-row gap-4 tkn-card p-5 hover:border-(--tkn-blue-bright) transition-colors"
                  >
                    <div className="shrink-0 text-xs text-(--tkn-text-muted)">
                      <span className="font-bold text-(--tkn-blue-bright) bg-(--tkn-blue-light) px-2 py-0.5 rounded mr-2">
                        {item.category}
                      </span>
                      {item.publishedAt}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-(--tkn-navy-deep) mb-1 group-hover:text-(--tkn-blue-bright) transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-sm text-(--tkn-text-muted) leading-relaxed line-clamp-2">
                        {item.excerpt}
                      </p>
                    </div>
                    <div className="sm:ml-auto shrink-0 self-center">
                      <ArrowRight size={16} className="text-(--tkn-blue-bright)" aria-hidden />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-16">
              <p className="text-(--tkn-text-muted)">
                現在、掲載できるお知らせ・コラムを準備中です。
              </p>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
