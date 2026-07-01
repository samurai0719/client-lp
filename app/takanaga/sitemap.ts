import type { MetadataRoute } from "next";
import { publishedWorks } from "@/data/takanaga/works";
import { publishedNews } from "@/data/takanaga/news";
import { siteConfig } from "@/data/takanaga/siteConfig";
import { serviceDetails } from "@/data/takanaga/serviceDetails";
import { prefectureDetails } from "@/data/takanaga/prefectureDetails";

const BASE = `https://${siteConfig.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,            priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/services`,    priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE}/works`,       priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/strengths`,   priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/price`,       priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/flow`,        priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/company`,     priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/area`,        priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/faq`,         priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/news`,        priority: 0.6, changeFrequency: "weekly" },
    { url: `${BASE}/contact`,     priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/simulation`,  priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE}/privacy`,     priority: 0.3, changeFrequency: "yearly" },
  ];

  const serviceDetailPages: MetadataRoute.Sitemap = serviceDetails.map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const areaPages: MetadataRoute.Sitemap = prefectureDetails.map((p) => ({
    url: `${BASE}/area/${p.slug}`,
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  const workPages: MetadataRoute.Sitemap = publishedWorks.map((w) => ({
    url: `${BASE}/works/${w.slug}`,
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  const newsPages: MetadataRoute.Sitemap = publishedNews.map((n) => ({
    url: `${BASE}/news/${n.slug}`,
    priority: 0.6,
    changeFrequency: "monthly",
    lastModified: new Date(n.publishedAt),
  }));

  return [...staticPages, ...serviceDetailPages, ...areaPages, ...workPages, ...newsPages];
}
