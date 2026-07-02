import type { MetadataRoute } from "next";
import { businessConfig } from "@/lib/config/business";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = businessConfig.domain;
  const routes = [
    "",
    "/services",
    "/pricing",
    "/about",
    "/contact",
    "/book",
    "/privacy",
    "/terms",
    "/service-agreement",
    "/cancellation",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/book" ? 0.9 : 0.7,
  }));
}
