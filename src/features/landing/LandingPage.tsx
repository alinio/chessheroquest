import { StickyCTA } from "./components/StickyCTA";
import { LandingAnalytics } from "./components/LandingAnalytics";
import { Hero } from "./sections/Hero";
import { Pain } from "./sections/Pain";
import { WhatYouGet } from "./sections/WhatYouGet";
import { HowItWorks } from "./sections/HowItWorks";
import { Kingdoms } from "./sections/Kingdoms";
import { FinalCTA } from "./sections/FinalCTA";
import { Footer } from "./sections/Footer";
import { HEADLINES, type HeadlineVariant } from "./variants";

/**
 * The marketing landing (kickoff §5 — locked section order §11.4):
 * Hero → Pain → What you get → How it works → Kingdoms → Final CTA → Footer.
 *
 * Server component: composes the page so all copy is in the SSR HTML (SEO).
 * Interactivity lives only in the leaf client components (StickyCTA, CTAButton,
 * HeroMedia, Reveal, analytics). The headline `variant` is resolved on the
 * server and threaded into both the H1 and the analytics dimension.
 */
export function LandingPage({ variant }: { variant: HeadlineVariant }) {
  const headline = HEADLINES[variant];

  return (
    <>
      <LandingAnalytics variant={variant} />
      <StickyCTA />
      <main className="flex flex-col">
        <Hero headline={headline} />
        <Pain />
        <WhatYouGet />
        <HowItWorks />
        <Kingdoms />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
