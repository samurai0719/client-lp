import type { MetadataRoute } from "next";
import { SCOUT_PATHS } from "@/components/driver-scout/content";
import { SITE_URL } from "@/components/driver-scout/seo";

// scout.adofy-site.com のサイトマップ（LPと匿名プロフィール一覧。無料登録フォームは noindex なので載せない）。
// next.config.ts のホスト条件付き rewrite で /sitemap.xml → /driver/scout/sitemap.xml に割り当てる。
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}${SCOUT_PATHS.profiles}`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  ];
}
