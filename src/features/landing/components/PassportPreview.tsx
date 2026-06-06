/**
 * Opening Passport preview (kickoff §S5). Coded in the design system — a grid of
 * heraldic seals; conquered openings are stamped gold, the rest await. The "pride
 * object" you fill by beating kingdoms.
 */
const STAMPS = [
  { name: "Italian", done: true },
  { name: "London", done: true },
  { name: "Caro-Kann", done: false },
  { name: "French", done: false },
  { name: "Sicilian", done: false },
  { name: "Scotch", done: false },
];

export function PassportPreview() {
  return (
    <div className="rounded-card border border-hairline bg-surface p-4">
      <p className="font-display text-[0.62rem] uppercase tracking-[0.3em] text-text-low">
        Opening Passport
      </p>
      <ul className="mt-3 grid grid-cols-3 gap-2">
        {STAMPS.map((s) => (
          <li
            key={s.name}
            className={`flex aspect-square flex-col items-center justify-center rounded-full border text-center ${
              s.done
                ? "border-gold bg-gold/10 text-gold shadow-[0_0_16px_-4px_rgba(227,178,60,0.6)]"
                : "border-dashed border-hairline text-text-low"
            }`}
          >
            <span className="text-lg leading-none" aria-hidden>
              {s.done ? "★" : "○"}
            </span>
            <span className="mt-1 text-[0.55rem] font-medium leading-tight">
              {s.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
