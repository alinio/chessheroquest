/**
 * Road to Elo — deterministic opening recommendations (pure, NEVER an LLM).
 * Built from the player's archetype roster (catalog) intersected with their weak
 * area (M2 per-opening performance). Plus the provisional percentile for the card.
 */
import type { Archetype } from "@/src/domain/style-quiz/types";
import { WORLDS } from "./worlds";

export interface OpeningRec {
  id: string;
  name: string;
  eco: string;
  reason: string;
}

/**
 * Recommend openings to train next: lead with the player's weakest family if it's
 * in their archetype roster, then fill from the roster. Deterministic.
 * TODO: confirm roster ↔ weak-area mapping once families are fully curated (GDD §11).
 */
export function roadToElo(
  archetype: Archetype,
  weakestFamily: string | null,
  count = 3,
): OpeningRec[] {
  const roster = WORLDS[archetype].openings;
  const recs: OpeningRec[] = [];

  const weak = weakestFamily
    ? roster.find((o) => o.name.toLowerCase() === weakestFamily.toLowerCase())
    : undefined;
  if (weak) recs.push({ ...weak, reason: "Shore up your weakest area" });

  for (const o of roster) {
    if (recs.length >= count) break;
    if (weak && o.id === weak.id) continue;
    recs.push({ ...o, reason: "Core of your repertoire" });
  }
  return recs;
}

/**
 * Provisional "Top X%" from the Opening IQ — part of the same calibration story.
 * TODO: calibrated percentile mapping (GDD §11). Single swappable function.
 */
export function provisionalTopPercent(openingIq: number): number {
  const iq = Math.max(0, Math.min(1000, openingIq));
  return Math.max(1, Math.min(99, Math.round((1 - iq / 1000) * 100)));
}
