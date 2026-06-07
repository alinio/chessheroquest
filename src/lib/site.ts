/**
 * Central SEO / site constants — single source of truth for metadata, sitemap,
 * robots, manifest, structured data and the OG image. Canonical host is the
 * public domain (NOT the env/preview URL).
 */
export const SITE = {
  url: "https://chessheroquest.com",
  name: "ChessHeroQuest",
  shortName: "ChessHeroQuest",
  // The default <title> and the OG/Twitter title.
  title: "ChessHeroQuest — What's Your Chess DNA?",
  // Used as the brand template suffix on inner pages: "Pricing — ChessHeroQuest".
  titleTemplate: "%s — ChessHeroQuest",
  tagline: "The RPG of chess openings",
  description:
    "Take the free 2-minute Chess DNA Test to reveal your Opening IQ, your chess style, and the opening weaknesses holding back your rating. Then train your openings, beat the bosses, and gain Elo — the RPG of chess openings.",
  // Concise description for cards / structured data.
  descriptionShort:
    "Discover your Chess DNA, train your openings, and gain Elo — the RPG of chess openings.",
  locale: "en_US",
  lang: "en",
  themeColor: "#08080A",
  ogImage: "/og.png",
  twitter: "@chessheroquest", // TODO: confirm/update the real handle
  keywords: [
    "chess openings",
    "chess opening trainer",
    "Chess DNA test",
    "Opening IQ",
    "chess style quiz",
    "learn chess openings",
    "chess opening repertoire",
    "chess training app",
    "improve chess rating",
    "gain Elo",
    "chess archetype",
    "chess tactics trainer",
    "opening repertoire builder",
    "chess for beginners",
    "Stockfish chess analysis",
  ],
} as const;

export const ORG = {
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/icon.png`,
} as const;
