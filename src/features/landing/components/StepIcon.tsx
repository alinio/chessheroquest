/**
 * Coded micro-illustrations for the three steps (kickoff pass 2 §6) — small,
 * looping, CSS-driven (no AI video). Clarifies each step "at a glance":
 *  - positions: tiles flashing through (the test)
 *  - score: a ring filling (the Opening IQ)
 *  - streak: a flame + days lighting up (the daily habit)
 * All motion is keyframe-based, so reduced-motion stills it (globals.css).
 */
export function StepIcon({ kind }: { kind: "positions" | "score" | "streak" }) {
  if (kind === "positions") return <PositionsIcon />;
  if (kind === "score") return <ScoreIcon />;
  return <StreakIcon />;
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-card border border-gold/30 bg-abyss/50">
      {children}
    </div>
  );
}

function PositionsIcon() {
  return (
    <Frame>
      <div className="grid grid-cols-2 gap-1" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="size-3.5 rounded-[3px] bg-gold animate-[chq-flash_1.6s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </Frame>
  );
}

function ScoreIcon() {
  return (
    <Frame>
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="4"
        />
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="113"
          transform="rotate(-90 22 22)"
          className="animate-[chq-ring_3s_ease-in-out_infinite]"
          style={{ filter: "drop-shadow(0 0 4px rgba(227,178,60,0.5))" }}
        />
      </svg>
    </Frame>
  );
}

function StreakIcon() {
  return (
    <Frame>
      <div className="flex flex-col items-center gap-1.5" aria-hidden>
        <span className="text-lg leading-none animate-[chq-crest-pulse_1.8s_ease-in-out_infinite]">
          🔥
        </span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-gold animate-[chq-flash_2s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.25}s` }}
            />
          ))}
        </div>
      </div>
    </Frame>
  );
}
