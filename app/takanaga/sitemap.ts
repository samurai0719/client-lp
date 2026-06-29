import type { MetadataRoute } from "next";
import { publishedWorks } from "@/data/takanaga/works";
import { publishedNews } from "@/data/takanaga/news";
import { siteConfig } from "@/data/takanaga/siteConfig";

// 公開URL（next.config.ts の rewrite により /takanaga/* → /* として配信）
const BASE = `https://${siteConfig.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: `${BASE}/`,                  priority: 1.0, changeFrequency: "weekly"  as const },
    { url: `${BASE}/services`,          priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE}/works`,             priority: 0.9, changeFrequency: "weekly"  as const },
    { url: `${BASE}/strengths`,         priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/price`,             priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/flow`,              priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/company`,           priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/area`,              priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/faq`,               priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/news`,              priority: 0.6, changeFrequency: "weekly"  as const },
    { url: `${BASE}/contact`,           priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/lp/gaikou-reform`,  priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/simulation`,        priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/privacy`,           priority: 0.3, changeFrequency: "yearly"  as const },
  ];

  const workPages = publishedWorks.map((w) => ({
    url: `${BASE}/works/${w.slug}`,
    priority: 0.7 as const,
    changeFrequency: "monthly" as const,
  }));

  const newsPages = publishedNews.map((n) => ({
    url: `${BASE}/news/${n.slug}`,
    priority: 0.6 as const,
    changeFrequency: "monthly" as const,
    lastModified: new Date(n.publishedAt),
  }));

  return [...staticPages, ...workPages, ...newsPages];
}
