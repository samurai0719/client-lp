import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/contact/thanks", "/admin/", "/takanaga/contact/thanks"],
    },
    sitemap: `https://${siteConfig.domain}/takanaga/sitemap.xml`,
  };
}
