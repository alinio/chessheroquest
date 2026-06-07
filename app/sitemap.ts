import type { MetadataRoute } from "next";
import { SITE } from "@/src/lib/site";
import { allCategories, allPosts } from "@/src/features/blog/lib";

/** Public, indexable pages. App/funnel screens (test, world, result…) are
 *  intentionally excluded — they're stateful flow steps, not landing targets. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
    lastModified: Date = now,
  ) => ({ url: `${SITE.url}${path}`, lastModified, changeFrequency, priority });

  // Core marketing pages. (privacy/terms are noindex; auth + funnel excluded.)
  const core: MetadataRoute.Sitemap = [
    page("/", 1, "weekly"),
    page("/pricing", 0.8, "monthly"),
    page("/blog", 0.8, "daily"),
  ];

  const categories: MetadataRoute.Sitemap = allCategories().map((c) =>
    page(`/blog/category/${c.slug}`, 0.5, "weekly"),
  );

  const posts: MetadataRoute.Sitemap = allPosts().map((p) =>
    page(
      `/blog/${p.slug}`,
      0.7,
      "monthly",
      new Date(`${p.updated ?? p.date}T00:00:00Z`),
    ),
  );

  return [...core, ...categories, ...posts];
}
