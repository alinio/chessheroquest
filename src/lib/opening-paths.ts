/**
 * Opening → curated starter-path mapping. Quest-map nodes are keyed by
 * OpeningId (the art registry); the real training routes (/train/[slug]/learn,
 * /drill/[slug]) are keyed by STARTER_PATHS ids. Openings without a curated
 * path yet map to null — UI must fall back to a safe route, never a 404.
 */
import type { OpeningId } from "@/src/lib/assets";

export const OPENING_TO_PATH: Partial<Record<OpeningId, string>> = {
  italian: "italian-giuoco-pianissimo",
  "kings-gambit": "kings-gambit",
  "sicilian-dragon": "sicilian-dragon",
  "queens-gambit": "queens-gambit-declined",
  london: "london-system",
  french: "french-defense",
  slav: "slav-defense",
  "caro-kann": "caro-kann-classical",
  scandinavian: "scandinavian-mainline",
  budapest: "budapest-gambit",
  englund: "englund-gambit",
};

/** Learn route for an opening, or null when no curated path exists yet. */
export function learnHref(id: OpeningId): string | null {
  const path = OPENING_TO_PATH[id];
  return path ? `/train/${path}/learn` : null;
}
