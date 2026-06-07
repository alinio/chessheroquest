import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/src/features/landing/components/Wordmark";
import { CTAButton } from "@/src/features/landing/components/CTAButton";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-abyss px-5 py-16 text-center">
      <Wordmark size="md" />

      <p className="font-display mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
        404 · Off the board
      </p>
      <h1 className="font-display text-4xl font-black leading-tight text-text-hi sm:text-5xl">
        This square doesn&apos;t exist
      </h1>
      <p className="max-w-md text-base leading-relaxed text-text-mid">
        The position you&apos;re looking for isn&apos;t on any board we know.
        Let&apos;s get you back in the game.
      </p>

      <div className="mt-4 flex flex-col items-center gap-3">
        <CTAButton section="hero" label="Take the free Chess DNA Test" />
        <Link
          href="/"
          className="text-[0.75rem] uppercase tracking-wide text-text-low transition-colors hover:text-text-hi"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
