import type { MetadataRoute } from "next";
import { CORP_SITE } from "@/components/adofy-corp/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 管理画面と内部ルートは検索結果に出さない
      disallow: ["/admin", "/adofy-admin", "/api/", "/adofy-corp", "/contact/thanks"],
    },
    sitemap: `${CORP_SITE.url}/sitemap.xml`,
    host: CORP_SITE.url,
  };
}
