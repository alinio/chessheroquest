import { SITE, ORG } from "@/src/lib/site";

/**
 * Schema.org JSON-LD (@graph) for the homepage — Organization + WebSite +
 * the product as a SoftwareApplication/WebApplication. Helps Google rich
 * results and answer engines (Google AI Overviews, ChatGPT, Perplexity)
 * understand and cite the product. No ratings/claims that aren't real.
 */
export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: ORG.name,
        url: SITE.url,
        logo: { "@type": "ImageObject", url: ORG.logo, width: 512, height: 512 },
        description: SITE.descriptionShort,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        name: SITE.name,
        url: SITE.url,
        inLanguage: SITE.lang,
        publisher: { "@id": `${SITE.url}/#organization` },
      },
      {
        "@type": ["SoftwareApplication", "WebApplication"],
        "@id": `${SITE.url}/#app`,
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        applicationCategory: "GameApplication",
        operatingSystem: "Web",
        inLanguage: SITE.lang,
        image: `${SITE.url}${SITE.ogImage}`,
        provider: { "@id": `${SITE.url}/#organization` },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          description: "Free Chess DNA Test — no signup to begin.",
        },
        featureList: [
          "Free Chess DNA Test (Opening IQ + play-style archetype)",
          "Personalized Road to Elo — the exact openings to train next",
          "Opening trainer with spaced repetition",
          "Opening Guardian & Kingdom Boss battles over the board",
          "Opening Passport — collect a seal for every opening mastered",
          "Analysis powered by Stockfish and real master games",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
