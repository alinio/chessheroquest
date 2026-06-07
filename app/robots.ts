import type { MetadataRoute } from "next";
import { SITE } from "@/src/lib/site";

/** Crawl policy. We *welcome* AI/answer-engine crawlers (GEO/LLM visibility),
 *  and only keep API + private/app surfaces out of the index. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/paywall", "/preview"],
      },
      {
        // Explicitly allow answer-engine / LLM crawlers.
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "Google-Extended",
          "PerplexityBot",
          "Perplexity-User",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "cohere-ai",
          "Applebot-Extended",
          "Bingbot",
          "DuckDuckBot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
