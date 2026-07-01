import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/contact/thanks", "/admin/"],
      },
    ],
    sitemap: `https://${siteConfig.domain}/sitemap.xml`,
  };
}
