import type { MetadataRoute } from "next";

// saiyo.adofy-site.com のサイトマップ（検索に載せるLPと求職者向けの規約だけ。送信完了・noindex のページは載せない）。
// next.config.ts のホスト条件付き rewrite で /sitemap.xml → /saiyo-rescue/sitemap.xml に割り当てる。
const ORIGIN = "https://saiyo.adofy-site.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${ORIGIN}/`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${ORIGIN}/shokunin-agent`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${ORIGIN}/shokunin-entry`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${ORIGIN}/kensetsu`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${ORIGIN}/shokunin-entry/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${ORIGIN}/shokunin-entry/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${ORIGIN}/shokunin-entry/operator`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
