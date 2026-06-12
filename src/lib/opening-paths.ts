/**
 * Opening → curated starter-path mapping. Quest-map nodes are keyed by
 * OpeningId (the art registry); the real training routes (/train/[slug]/learn,
 * /drill/[slug]) are keyed by STARTER_PATHS ids. Openings without a curated
 * path yet map to null — UI must fall back to a safe route, never a 404.
 */
import { ASSETS, type OpeningId, type RealmId } from "@/src/lib/assets";

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
  scotch: "scotch-classical",
  "smith-morra": "smith-morra-gambit",
  "ruy-lopez": "ruy-lopez-closed",
  "nimzo-indian": "nimzo-indian-rubinstein",
  catalan: "catalan-open",
  english: "english-four-knights",
  petroff: "petroff-classical",
  stafford: "stafford-gambit",
  "blackmar-diemer": "blackmar-diemer-gambit",
};

/** Learn route for an opening, or null when no curated path exists yet. */
export function learnHref(id: OpeningId): string | null {
  const path = OPENING_TO_PATH[id];
  return path ? `/train/${path}/learn` : null;
}

/** The realm's opening ids, in registry order (the gauntlet sequence). */
export function realmOpeningIds(realm: RealmId): OpeningId[] {
  return (Object.keys(ASSETS.openings) as OpeningId[]).filter(
    (id) => ASSETS.openings[id].realm === realm,
  );
}

/** The realm's curated path ids, in registry order (the gauntlet sequence). */
export function realmPathIds(realm: RealmId): string[] {
  return (Object.keys(ASSETS.openings) as OpeningId[])
    .filter((id) => ASSETS.openings[id].realm === realm)
    .map((id) => OPENING_TO_PATH[id])
    .filter((p): p is string => Boolean(p));
}

/**
 * ALL curated lines per opening, mainline first (OPENING_TO_PATH stays the
 * canonical mainline — Guardians duel on it; extra lines deepen Learn/Drill).
 */
export const OPENING_LINES: Partial<Record<OpeningId, string[]>> = Object.fromEntries(
  Object.entries(OPENING_TO_PATH).map(([opening, path]) => [opening, [path]]),
);
OPENING_LINES.italian!.push("evans-gambit", "italian-two-knights");
OPENING_LINES["ruy-lopez"]!.push("ruy-lopez-exchange");
OPENING_LINES.scotch!.push("scotch-mieses");
OPENING_LINES["sicilian-dragon"]!.push("sicilian-dragon-yugoslav");
OPENING_LINES["queens-gambit"]!.push("queens-gambit-accepted");
OPENING_LINES.london!.push("london-vs-kings-indian");
OPENING_LINES["caro-kann"]!.push("caro-kann-advance");
OPENING_LINES.french!.push("french-advance");

/** Reverse lookup: curated path id → OpeningId (covers every line). */
export const PATH_TO_OPENING: Record<string, OpeningId> = Object.fromEntries(
  Object.entries(OPENING_LINES).flatMap(([opening, paths]) =>
    (paths ?? []).map((p) => [p, opening as OpeningId]),
  ),
);
