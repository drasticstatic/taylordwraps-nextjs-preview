import type { MetadataRoute } from "next";
import { getBasePath, SITE_URL } from "@/lib/basePath";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}${getBasePath()}/sitemap.xml` };
}
