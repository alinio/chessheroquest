"use client";

import Link from "next/link";
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
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-3 sm:px-6">
        <Wordmark size="md" />
        {/* Over the hero: logo only (the hero owns the CTA). The whole action
            group — Log in + Take the Test — fades in together once past the fold. */}
        <div
          className={`flex shrink-0 items-center gap-2 transition-all duration-300 sm:gap-3 ${
            pastHero
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
          }`}
        >
          <LoginButton />

          <div>
            {/* short label on mobile (logo + full label don't fit on a phone bar) */}
            <span className="sm:hidden">
              <CTAButton
                section="sticky"
                label="Take the Test"
                variant="gold"
                flat
                className="whitespace-nowrap px-3.5 text-xs"
              />
            </span>
            <span className="hidden sm:block">
              <CTAButton
                section="sticky"
                label={CTA_LABEL}
                variant="gold"
                flat
                className="whitespace-nowrap sm:px-5 sm:text-sm"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * "Log in" for returning heroes — a quiet gold-outline pill (secondary to the
 * loud gold CTA), with a small key glyph for the heroic-RPG feel. Always present.
 */
function LoginButton() {
  return (
    <Link
      href="/signin"
      aria-label="Log in"
      className="group inline-flex shrink-0 items-center gap-1.5 rounded-chip border border-gold/45 bg-abyss/40 px-2.5 py-2.5 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-gold backdrop-blur-sm transition-colors duration-200 hover:border-gold hover:bg-gold/10 hover:text-gold-bright sm:px-3.5 sm:py-2"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-px sm:h-3.5 sm:w-3.5"
      >
        <circle cx="8.5" cy="8.5" r="4.5" />
        <path d="M11.7 11.7 L20 20" />
        <path d="M17 17 l2.4 -2.4" />
      </svg>
      {/* label appears from sm up; icon-only on phones so the bar fits */}
      <span className="hidden sm:inline">Log in</span>
    </Link>
  );
}
