import type { MetadataRoute } from "next";
import { getBasePath, SITE_URL } from "@/lib/basePath";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = `${SITE_URL}${getBasePath()}`;
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/time-machine/`, changeFrequency: "monthly", priority: 0.4 },
  ];
}
