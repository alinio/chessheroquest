/**
 * Marketing index ("/"). The pain hook + the free DNA Test CTA (master-vision §8).
 */
import Link from "next/link";

export default function MarketingHome() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-display text-gold text-sm uppercase tracking-[0.3em]">
        ChessHeroQuest
      </p>
      <h1 className="font-display text-text-hi max-w-md text-4xl font-bold">
        Stop Losing In The Opening
      </h1>
      <p className="font-body text-text-mid max-w-sm">
        Discover your Chess DNA. Train your weaknesses. Gain Elo faster.
      </p>
      <Link
        href="/dna"
        className="rounded-chip bg-gold text-abyss mt-2 min-h-[48px] px-8 text-base font-semibold shadow-lg"
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        Take The Free Chess DNA Test
      </Link>
    </main>
  );
}
