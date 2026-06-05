/**
 * Marketing index ("/"). Placeholder for Step 0 — exists to validate that the
 * DESIGN.md tokens + Cinzel/Manrope fonts are wired. The real landing (Stop Losing
 * In The Opening → Take The Free Chess DNA Test) comes later.
 */
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
      <div
        className="font-display text-gold-bright text-6xl font-black"
        style={{ textShadow: "0 0 24px rgba(227, 178, 60, 0.5)" }}
        aria-label="Opening IQ placeholder"
      >
        0
      </div>
      <p className="text-text-low text-xs">
        Étape 0 — scaffolding. Board, Chess DNA Test & Opening IQ à venir.
      </p>
    </main>
  );
}
