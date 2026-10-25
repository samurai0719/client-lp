import type { MetadataRoute } from "next";
import { SITE_URL } from "@/components/driver-scout/seo";

// scout.adofy-site.com のサイトマップ（公開URLは / の1ページ）。
// next.config.ts のホスト条件付き rewrite で /sitemap.xml → /driver/scout/sitemap.xml に割り当てる。
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
