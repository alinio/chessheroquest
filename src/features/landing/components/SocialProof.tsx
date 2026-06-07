/**
 * Social proof — an overlapping "avatar stack" + a count, under the CTA.
 *
 * Avatars are CHESS-PIECE marks in the four realm-accent rings (on-brand, and
 * honest — no fabricated photos of people who aren't real customers).
 *
 * TODO: set TEST_TAKERS to the REAL number of completed tests (or wire it to a
 * live DB/analytics count). Do NOT ship a fabricated figure — a fake user count
 * is a dark pattern (CLAUDE.md THE LAWS #5). Placeholder shown until then.
 */
const TEST_TAKERS = "2,000+"; // TODO: replace with the real test-taker count

const AVATARS: { glyph: string; accent: string }[] = [
  { glyph: "♞", accent: "#E0413B" }, // Ember
  { glyph: "♝", accent: "#8B6CFF" }, // Obsidian
  { glyph: "♜", accent: "#2FB67A" }, // Aegis
  { glyph: "♛", accent: "#38C7D6" }, // Mirage
  { glyph: "♚", accent: "#F3CF77" }, // gold
];

export function SocialProof({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex -space-x-2.5">
        {AVATARS.map((a, i) => (
          <span
            key={i}
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full border bg-abyss text-[0.8rem] leading-none"
            style={{
              borderColor: a.accent,
              color: a.accent,
              boxShadow: `0 0 10px -3px ${a.accent}`,
              zIndex: AVATARS.length - i,
            }}
          >
            {a.glyph}
          </span>
        ))}
      </div>
      <p className="text-sm leading-snug text-text-mid">
        <span className="font-semibold text-text-hi">{TEST_TAKERS}</span> players
        have taken the test
      </p>
    </div>
  );
}
