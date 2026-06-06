/**
 * Refined reassurance row (kickoff pass 2 §1) — the "Free · no signup · ~2 min"
 * line as a centered inline row with subtle gold-dot separators, not a cheap
 * left-aligned afterthought.
 */
export function Microcopy({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  return (
    <p
      className={`flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-text-low ${className}`}
    >
      {items.map((item, i) => (
        <span key={item} className="inline-flex items-center gap-2.5">
          {i > 0 && (
            <span aria-hidden className="size-1 rounded-full bg-gold/70" />
          )}
          {item}
        </span>
      ))}
    </p>
  );
}
