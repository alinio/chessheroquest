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
import { SITE } from "@/src/lib/site";
import {
  resolveHeadlineVariant,
  firstParam,
} from "@/src/features/landing/variants";

const TITLE = SITE.title;
const DESCRIPTION = SITE.description;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  // `absolute` bypasses the root title template (TITLE already includes the brand).
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [...SITE.keywords],
  alternates: {
    canonical: "/",
    languages: { "en-US": "/", "x-default": "/" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: SITE.name,
    url: SITE.url,
    locale: SITE.locale,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE.ogImage],
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
