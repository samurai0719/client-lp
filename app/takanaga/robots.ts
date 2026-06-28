import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/takanaga/",
      disallow: ["/takanaga/contact/thanks", "/admin/"],
    },
    sitemap: `https://${siteConfig.domain}/takanaga/sitemap.xml`,
  };
}
