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
  /** `gold` is the loud 3D primary; `ghost` is a quiet outline pill. */
  variant?: "gold" | "ghost";
  /** Flat gold (symmetric shadow, no 3D bottom offset) — for the header bar. */
  flat?: boolean;
  className?: string;
  href?: string;
}

/**
 * The single conversion action (kickoff §1: "spectacle serves the CTA").
 *
 * The `gold` variant is a fantasy/MMO-style 3D button: an extruded gold face
 * (solid offset shadow = the button's "thickness"), a glossy top highlight, a
 * periodic shine sweep, hover-lift + glow, and a real press-down on `:active`.
 * Always ≥44px (thumb target, LAW #4) and fires its analytics event before
 * navigating. All motion sits behind `prefers-reduced-motion` (globals.css).
 */
export function CTAButton({
  section,
  label,
  variant = "gold",
  flat = false,
  className = "",
  href = CTA_HREF,
}: CTAButtonProps) {
  if (variant === "ghost") {
    return (
      <Link
        href={href}
        data-cta-section={section}
        onClick={() => track(EVENT_BY_SECTION[section], { section })}
        className={`inline-flex min-h-[48px] items-center justify-center rounded-chip border border-gold/60 bg-abyss/70 px-7 text-base font-semibold tracking-wide text-gold backdrop-blur transition-colors duration-150 hover:border-gold hover:text-gold-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-abyss ${className}`}
      >
        {label}
      </Link>
    );
  }

  // Flat = symmetric shadow (header bar → equal top/bottom). 3D = extruded
  // offset shadow + press (hero / sections).
  const fx = flat
    ? "shadow-[0_3px_16px_-4px_rgba(0,0,0,0.7),0_0_26px_-8px_rgba(244,206,106,0.55)] transition-[box-shadow,filter] duration-150 hover:brightness-[1.07] hover:shadow-[0_3px_18px_-4px_rgba(0,0,0,0.7),0_0_38px_-6px_rgba(244,206,106,0.85)]"
    : "shadow-[0_6px_0_0_var(--color-gold-deep),0_14px_28px_-8px_rgba(0,0,0,0.85),0_0_30px_-8px_rgba(227,178,60,0.6)] transition-[transform,box-shadow,filter] duration-150 ease-out hover:-translate-y-0.5 hover:brightness-[1.07] hover:shadow-[0_8px_0_0_var(--color-gold-deep),0_18px_36px_-8px_rgba(0,0,0,0.85),0_0_48px_-6px_rgba(244,206,106,0.8)] active:translate-y-1 active:shadow-[0_2px_0_0_var(--color-gold-deep),0_8px_16px_-8px_rgba(0,0,0,0.85)]";

  return (
    <Link
      href={href}
      data-cta-section={section}
      onClick={() => track(EVENT_BY_SECTION[section], { section })}
      className={`group relative inline-flex min-h-[54px] items-center justify-center overflow-hidden rounded-chip border border-gold-bright/70 bg-gradient-to-b from-gold-bright via-gold to-gold-deep px-8 text-base font-bold uppercase tracking-[0.06em] text-abyss [text-shadow:0_1px_0_rgba(255,255,255,0.45),0_-1px_0_rgba(0,0,0,0.18)] ${fx} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-abyss ${className}`}
    >
      {/* glossy top highlight (the beveled face) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-chip bg-gradient-to-b from-white/40 to-transparent"
      />
      {/* periodic shine sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-chip"
      >
        <span className="absolute -inset-y-2 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/55 to-transparent animate-[chq-btn-shine_4.5s_ease-in-out_infinite]" />
      </span>
      <span className="relative">{label}</span>
    </Link>
  );
}
