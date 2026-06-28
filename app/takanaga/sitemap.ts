import type { MetadataRoute } from "next";
import { publishedWorks } from "@/data/takanaga/works";
import { publishedNews } from "@/data/takanaga/news";
import { siteConfig } from "@/data/takanaga/siteConfig";

const BASE = `https://${siteConfig.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: `${BASE}/takanaga`, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE}/takanaga/services`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE}/takanaga/works`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE}/takanaga/strengths`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/takanaga/price`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/takanaga/flow`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/takanaga/company`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/takanaga/area`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/takanaga/faq`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${BASE}/takanaga/news`, priority: 0.6, changeFrequency: "weekly" as const },
    { url: `${BASE}/takanaga/contact`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE}/takanaga/privacy`, priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const workPages = publishedWorks.map((w) => ({
    url: `${BASE}/takanaga/works/${w.slug}`,
    priority: 0.7 as const,
    changeFrequency: "monthly" as const,
  }));

  const newsPages = publishedNews.map((n) => ({
    url: `${BASE}/takanaga/news/${n.slug}`,
    priority: 0.6 as const,
    changeFrequency: "monthly" as const,
    lastModified: new Date(n.publishedAt),
  }));

  return [...staticPages, ...workPages, ...newsPages];
}
