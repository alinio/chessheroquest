"use client";

import { useEffect, useState } from "react";
import { CTAButton } from "./CTAButton";
import { Wordmark } from "./Wordmark";
import { CTA_LABEL } from "../copy";

/**
 * Sticky header (kickoff §S0 + pass 2 §1). The wordmark is always present with
 * top breathing room (not flush to the edge). The header CTA stays HIDDEN over
 * the hero — the hero already has its own CTA — and fades in once you scroll past
 * the hero fold, when the bar also gains a solid backdrop. Keeps the DNA Test one
 * tap away without doubling the CTA on first impression.
 */
export function StickyCTA() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setPastHero(window.scrollY > window.innerHeight * 0.8);
    const id = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        pastHero
          ? "border-b border-gold/15 bg-abyss/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Wordmark size="md" />
        <div
          className={`transition-all duration-300 ${
            pastHero
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
          }`}
        >
          <CTAButton
            section="sticky"
            label={CTA_LABEL}
            variant="gold"
            className="whitespace-nowrap px-4 text-xs sm:px-5 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}
