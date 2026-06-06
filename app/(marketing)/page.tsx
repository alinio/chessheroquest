/**
 * Marketing landing ("/") — the premium viral quiz funnel (kickoff). One goal:
 * the free Chess DNA Test.
 *
 * The channel-aware H1 (§4) is resolved HERE on the server from `searchParams`
 * so the correct headline is in the SSR HTML (no flash / hydration mismatch) and
 * doubles as the `headline_variant` analytics dimension (§10).
 */
import type { Metadata } from "next";
import { LandingPage } from "@/src/features/landing/LandingPage";
import { LANDING_ASSETS } from "@/src/features/landing/assets";
import {
  resolveHeadlineVariant,
  firstParam,
} from "@/src/features/landing/variants";

const TITLE = "ChessHeroQuest — What's Your Chess DNA?";
const DESCRIPTION =
  "Take the free 2-minute Chess DNA Test to reveal your Opening IQ, your chess style, and the opening weaknesses holding back your rating. The RPG of chess openings.";

// Canonical/OG must resolve to the public domain — NOT the env URL (prod
// NEXT_PUBLIC_APP_URL is localhost) and NOT the Vercel preview URL.
const SITE_URL = "https://chessheroquest.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "ChessHeroQuest",
    images: [
      { url: LANDING_ASSETS.ogImage, width: 1600, height: 900, alt: TITLE },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [LANDING_ASSETS.ogImage],
  },
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function MarketingHome({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const variant = resolveHeadlineVariant({
    v: firstParam(sp.v),
    utmSource: firstParam(sp.utm_source),
    utmCampaign: firstParam(sp.utm_campaign),
    keyword: firstParam(sp.keyword),
  });

  return <LandingPage variant={variant} />;
}
