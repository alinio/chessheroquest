/**
 * Social proof — an overlapping "avatar stack" + a count, under the CTA.
 *
 * Avatars are CHESS-PIECE marks in the four realm-accent rings (on-brand, and
 * honest — no fabricated photos of people who aren't real customers).
 *
 * TEST_TAKERS is owner-declared and bumped manually as tests accumulate. When
 * ready, wire it to the live DB count of completed tests so it grows on its own
 * (keep it real — a fabricated count is a dark pattern, CLAUDE.md THE LAWS #5).
 */
const TEST_TAKERS = "1,351"; // bump as real tests accumulate (or wire live)

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
