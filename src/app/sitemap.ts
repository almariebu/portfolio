import type { MetadataRoute } from "next";
import { caseStudies, site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...caseStudies
      .filter((study) => study.demo)
      .map((study) => ({
        url: `${site.url}${study.demo}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}
