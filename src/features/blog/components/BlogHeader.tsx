import Link from "next/link";
import { Wordmark } from "@/src/features/landing/components/Wordmark";
import { CTAButton } from "@/src/features/landing/components/CTAButton";
import { CTA_LABEL } from "@/src/features/landing/copy";

/**
 * Static blog header (heroic) — logo home, a Blog link, Log in, and the test
 * CTA. Solid bar (unlike the landing's scroll-reveal sticky) so it reads on
 * content pages.
 */
export function BlogHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-abyss/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-4 py-2.5 sm:gap-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Wordmark size="md" />
          <Link
            href="/blog"
            className="hidden font-display text-sm font-semibold uppercase tracking-[0.14em] text-gold/80 transition-colors hover:text-gold sm:inline"
          >
            Blog
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
              className="h-4 w-4 sm:h-3.5 sm:w-3.5"
            >
              <circle cx="8.5" cy="8.5" r="4.5" />
              <path d="M11.7 11.7 L20 20" />
              <path d="M17 17 l2.4 -2.4" />
            </svg>
            <span className="hidden sm:inline">Log in</span>
          </Link>
          <span className="sm:hidden">
            <CTAButton section="sticky" label="Take the Test" variant="gold" flat className="whitespace-nowrap px-3.5 text-xs" />
          </span>
          <span className="hidden sm:block">
            <CTAButton section="sticky" label={CTA_LABEL} variant="gold" flat className="whitespace-nowrap sm:px-5 sm:text-sm" />
          </span>
        </div>
      </div>
    </header>
  );
}
