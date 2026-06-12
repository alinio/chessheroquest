/**
 * Opening Passport (domain — pure). Maps real mastery + Guardian victories to
 * the four medallion states (target-experience-spec §C Passport) and picks the
 * "Next seal" — the not-yet-sealed opening closest to its seal.
 *
 * The seal rule (the game's contract, said on the Passport cover):
 *   1. Study the line — every position, to the end.
 *   2. Drill it to Gold — prove you remember.
 *   3. Defeat its Guardian — play it from memory, one slip forgiven.
 * Sealed = gold mastery AND Guardian defeated. No shortcuts (LAW #1).
 */
import type { MasteryState } from "@/src/domain/mastery";

export type MedallionState = "unexplored" | "training" | "ready" | "sealed";

export interface PassportProgress {
  /** Positions of the line studied / total (real FSRS coverage). */
  studied: number;
  total: number;
  /** Mastery state of the line (coverage + retention). */
  state: MasteryState;
  /** True once the Opening Guardian duel was won. */
  guardianDefeated: boolean;
}

/** The four medallion states. `null` = no curated path yet → unexplored. */
export function medallionState(p: PassportProgress | null): MedallionState {
  if (!p || p.studied <= 0) return "unexplored";
  if (p.state !== "gold") return "training";
  return p.guardianDefeated ? "sealed" : "ready";
}

/** In-training chip wording (always paired with shape/colour — never colour alone). */
export function trainingChip(state: MasteryState): "Leak" | "Fading" | "Solid" {
  if (state === "leak") return "Leak";
  if (state === "review") return "Fading";
  return "Solid";
}

/**
 * Index of the "Next seal" candidate: the not-yet-sealed opening closest to
 * its seal — gold (ready) beats solid beats best coverage. Openings with no
 * studied position are never candidates (there is nothing "close" yet).
 * Returns -1 when no candidate exists.
 */
export function nextSealIndex(entries: readonly (PassportProgress | null)[]): number {
  let best = -1;
  let bestScore = -1;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (!e || e.studied <= 0 || e.total <= 0) continue;
    if (medallionState(e) === "sealed") continue;
    const coverage = e.studied / e.total;
    const score =
      e.state === "gold" ? 3 + coverage : e.state === "solid" ? 2 + coverage : coverage;
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return best;
}
