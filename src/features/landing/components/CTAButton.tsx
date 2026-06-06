"use client";

import Link from "next/link";
import { CTA_HREF } from "../copy";
import { track, type CtaSection, type LandingEvent } from "../analytics";

/** Each CTA section fires its own event, all carrying the session context (§10). */
const EVENT_BY_SECTION: Record<CtaSection, LandingEvent> = {
  hero: "hero_cta_click",
  sticky: "sticky_cta_click",
  pain: "pain_section_cta_click",
  kingdoms: "kingdoms_cta_click",
  final: "final_cta_click",
};

interface CTAButtonProps {
  section: CtaSection;
  label: string;
  /** Visual weight. `gold` is the loud primary; `ghost` is the sticky-bar pill. */
  variant?: "gold" | "ghost";
  className?: string;
  href?: string;
}

/**
 * The single conversion action (kickoff §1: "spectacle serves the CTA").
 * Always ≥44px tall (mobile thumb target, LAW #4) and always fires its analytics
 * event with full source context before navigating to the DNA Test.
 */
export function CTAButton({
  section,
  label,
  variant = "gold",
  className = "",
  href = CTA_HREF,
}: CTAButtonProps) {
  const base =
    "inline-flex min-h-[52px] items-center justify-center rounded-chip px-8 text-center text-base font-semibold tracking-wide transition-transform duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-abyss";

  const skin =
    variant === "gold"
      ? "bg-gold text-abyss shadow-[0_10px_40px_-8px_rgba(227,178,60,0.55)] hover:bg-gold-bright"
      : "border border-gold/60 bg-abyss/70 text-gold backdrop-blur hover:border-gold hover:text-gold-bright";

  return (
    <Link
      href={href}
      data-cta-section={section}
      onClick={() => track(EVENT_BY_SECTION[section], { section })}
      className={`${base} ${skin} ${className}`}
    >
      {label}
    </Link>
  );
}
