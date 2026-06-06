import { Panel } from "./Panel";

/**
 * Opening Passport preview (kickoff §S5 + pass 2 §7). Ornate panel; a grid of
 * heraldic seals — conquered openings stamped gold, the rest awaiting. One
 * clarifying line keeps it an intriguing teaser, not a manual.
 */
// Only the five openings we actually ship (no "Scotch").
const STAMPS = [
  { name: "Italian", done: true },
  { name: "London", done: true },
  { name: "Caro-Kann", done: false },
  { name: "French", done: false },
  { name: "Sicilian", done: false },
];

export function PassportPreview() {
  return (
    <Panel variant="ornate" interactive innerClassName="h-full p-4">
      <p className="font-display text-[0.62rem] uppercase tracking-[0.3em] text-text-low">
        Opening Passport
      </p>
      <p className="mt-1 text-xs text-text-mid">
        Collect a seal for every opening you master.
      </p>
      <ul className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-3">
        {STAMPS.map((s) => (
          <li
            key={s.name}
            className={`flex aspect-square flex-col items-center justify-center rounded-full border text-center ${
              s.done
                ? "border-gold bg-gold/10 text-gold shadow-[0_0_16px_-4px_rgba(227,178,60,0.6)]"
                : "border-dashed border-hairline text-text-low"
            }`}
          >
            <span className="text-base leading-none" aria-hidden>
              {s.done ? "★" : "○"}
            </span>
            <span className="mt-0.5 text-[0.5rem] font-medium leading-tight">
              {s.name}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
