import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 旧パス /takanaga/contact/thanks は301で /contact/thanks へ集約されるため記載不要
        disallow: ["/contact/thanks", "/admin/", "/api/"],
      },
    ],
    sitemap: `https://${siteConfig.domain}/sitemap.xml`,
  };
}
