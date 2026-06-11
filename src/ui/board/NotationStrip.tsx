/**
 * NotationStrip — the curated line as a ribbon of SAN ("1.e4 e5 2.Nf3 …").
 * Three variants (target-experience-spec §B2):
 *  - "full"       Learn: the whole line; played moves clear, the current move
 *                 gold/bold, future moves dimmed.
 *  - "path"       Drill/Review: only the path walked so far — a recall cue
 *                 that never reveals the answer.
 *  - "scoresheet" Duel: the moves actually played, styled as a game sheet.
 * SAN strings come straight from the curated path (chess.js-certified) —
 * this component formats, it never invents (LAW #2).
 */
import "./board-ui.css";

export type NotationVariant = "full" | "path" | "scoresheet";

export function NotationStrip({
  sans,
  currentPly,
  variant,
  slips,
}: {
  /** The line's SAN moves, from the initial position. */
  sans: string[];
  /** Half-moves already played (0 = nothing played yet). */
  currentPly: number;
  variant: NotationVariant;
  /** Plies where the player slipped — marked in leak red (duel recap). */
  slips?: number[];
}) {
  const visible = variant === "full" ? sans.length : Math.min(currentPly, sans.length);
  const slipSet = new Set(slips ?? []);

  const tokens: React.ReactNode[] = [];
  for (let i = 0; i < visible; i++) {
    const cls =
      i < currentPly ? "played" : i === currentPly && variant === "full" ? "current" : "future";
    tokens.push(
      <span key={i} className={`mv ${cls}${slipSet.has(i) ? " slip" : ""}`}>
        {i % 2 === 0 && <span className="num">{i / 2 + 1}.</span>}
        {sans[i]}
      </span>,
    );
  }
  // The line continues past what is shown → say so ("2.Nf3 …").
  const more = visible < sans.length && variant !== "full";

  return (
    <p
      className={`chq-notation${variant === "scoresheet" ? " chq-notation--scoresheet" : ""}`}
      aria-label={`Line notation — ${currentPly} of ${sans.length} moves played`}
    >
      {tokens.length === 0 && (
        <span className="mv future">
          <span className="num">1.</span>?
        </span>
      )}
      {tokens}
      {more && tokens.length > 0 && <span className="ellipsis">…</span>}
    </p>
  );
}
