import type { MetadataRoute } from "next";
import { CORP_PAGES, CORP_SITE } from "@/components/adofy-corp/seo";

/*
  adofy-site.com のサイトマップ。
  公開URLは next.config.ts のホスト条件付きrewriteで
  /adofy-corp/* → / , /profile , /works/* に変換されるため、
  ここでは公開URLをそのまま列挙する。
*/
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return Object.values(CORP_PAGES).map((p) => ({
    url: `${CORP_SITE.url}${p.path}`,
    lastModified: now,
    changeFrequency: p.path === "/" ? "weekly" : "monthly",
    priority: p.priority,
  }));
}
