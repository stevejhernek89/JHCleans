import type { MetadataRoute } from "next";
import { businessConfig } from "@/lib/config/business";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${businessConfig.domain}/sitemap.xml`,
  };
}
