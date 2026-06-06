/**
 * Ornamental divider (kickoff pass 2 §3) — replaces plain hairline rules with a
 * gold filigree line + a central heraldic diamond. Heraldic, not a flat border.
 */
export function OrnamentalDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50 sm:w-28" />
      <span className="relative flex items-center justify-center">
        <span className="block size-2 rotate-45 border border-gold/70 bg-gold/20" />
        <span className="absolute size-1 rotate-45 bg-gold-bright" />
      </span>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50 sm:w-28" />
    </div>
  );
}
