"use client";

import { useEffect, useState } from "react";
import { CTAButton } from "./CTAButton";
import { CTA_LABEL } from "../copy";

/**
 * Sticky CTA bar (kickoff §S0 / §1: the DNA Test is one tap from the top).
 * Always present; gains a solid backdrop once you scroll past the hero fold so
 * it stays legible over light kingdom art. Mobile-first: full-width, thumb-zone
 * CTA, ≥44px target.
 */
export function StickyCTA() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    // Defer the initial read off the effect body (avoid sync setState-in-effect).
    const id = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-hairline bg-abyss/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <span className="font-display text-sm font-bold tracking-wide text-gold">
          ChessHeroQuest
        </span>
        <CTAButton
          section="sticky"
          label={CTA_LABEL}
          variant="gold"
          className="min-h-[44px] px-4 text-sm sm:px-6"
        />
      </div>
    </div>
  );
}
