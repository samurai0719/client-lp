import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /contact/thanks はrewrite後の公開URL、/takanaga/contact/thanks は直接パス
        disallow: ["/contact/thanks", "/takanaga/contact/thanks", "/admin/", "/api/"],
      },
    ],
    sitemap: `https://${siteConfig.domain}/sitemap.xml`,
  };
}
