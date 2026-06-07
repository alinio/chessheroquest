import type { MetadataRoute } from "next";
import { SITE } from "@/src/lib/site";

/** Public, indexable pages. App/funnel screens (test, world, result…) are
 *  intentionally excluded — they're stateful flow steps, not landing targets. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  ) => ({ url: `${SITE.url}${path}`, lastModified: now, changeFrequency, priority });

  // Only indexable marketing pages. (privacy/terms are noindex; auth + funnel
  // screens are excluded.)
  return [
    page("/", 1, "weekly"),
    page("/pricing", 0.8, "monthly"),
  ];
}
