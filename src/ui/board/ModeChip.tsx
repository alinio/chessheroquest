/**
 * ModeChip — the training-mode contract, readable in 200ms, permanently above
 * the board (target-experience-spec §B3). The board stays identical across
 * modes; only this chrome changes:
 *   guided (gold)    Learn — the move is shown.
 *   recall (steel)   Drill/Review — from memory.
 *   exam   (realm)   Duel — one slip forgiven.
 */
import "./board-ui.css";

export type TrainingMode = "guided" | "recall" | "exam";

const COPY: Record<TrainingMode, { word: string; rest: string }> = {
  guided: { word: "GUIDED", rest: "the move is shown" },
  recall: { word: "RECALL", rest: "from memory" },
  exam: { word: "EXAM", rest: "1 slip forgiven" },
};

export function ModeChip({ mode }: { mode: TrainingMode }) {
  const c = COPY[mode];
  return (
    <span className={`chq-modechip chq-modechip--${mode}`}>
      <b>{c.word}</b> — {c.rest}
    </span>
  );
}
