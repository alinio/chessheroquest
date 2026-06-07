/**
 * The ONE shared aggregator. Turns normalized games (from any GameSource) into a
 * PlayerProfileSummary. Pure + deterministic — no LLM, no fabrication.
 */
import type { NormalizedGame, PlayerProfileSummary, OpeningPerf, ColorPerf, Platform, Color } from "./types";
import { MIN_GAMES_FOR_RANKING } from "./types";
import { UNCATEGORIZED } from "./openingFamily";

const score = (w: number, d: number, g: number) => (g > 0 ? Math.round(((w + d / 2) / g) * 1000) / 10 : 0);

export function aggregate(
  games: NormalizedGame[],
  meta: { usernames: Partial<Record<Platform, string>>; sources: Platform[]; emptyReason?: string },
): PlayerProfileSummary {
  const openings = new Map<string, OpeningPerf>();
  const colors = new Map<Color, ColorPerf>();

  // newest-first for recent form
  const sorted = [...games].sort((a, b) => (a.date < b.date ? 1 : -1));

  for (const g of sorted) {
    const o = openings.get(g.openingFamily) ?? { openingFamily: g.openingFamily, games: 0, wins: 0, draws: 0, losses: 0, scorePct: 0 };
    o.games++;
    if (g.result === "win") o.wins++;
    else if (g.result === "draw") o.draws++;
    else o.losses++;
    openings.set(g.openingFamily, o);

    const c = colors.get(g.color) ?? { color: g.color, games: 0, wins: 0, draws: 0, losses: 0, scorePct: 0 };
    c.games++;
    if (g.result === "win") c.wins++;
    else if (g.result === "draw") c.draws++;
    else c.losses++;
    colors.set(g.color, c);
  }

  const byOpening = [...openings.values()].map((o) => ({ ...o, scorePct: score(o.wins, o.draws, o.games) })).sort((a, b) => b.games - a.games);
  const byColor = [...colors.values()].map((c) => ({ ...c, scorePct: score(c.wins, c.draws, c.games) }));

  // strongest / weakest among categorized openings with enough games
  const ranked = byOpening.filter((o) => o.openingFamily !== UNCATEGORIZED && o.games >= MIN_GAMES_FOR_RANKING);
  const strongest = ranked.length ? ranked.reduce((a, b) => (b.scorePct > a.scorePct ? b : a)) : null;
  const weakest = ranked.length ? ranked.reduce((a, b) => (b.scorePct < a.scorePct ? b : a)) : null;

  return {
    sources: meta.sources,
    usernames: meta.usernames,
    totalGames: sorted.length,
    byOpening,
    byColor,
    mostPlayed: byOpening.slice(0, 6),
    strongest,
    weakest,
    recentForm: sorted.slice(0, 20).map((g) => g.result),
    fetchedAt: new Date().toISOString(),
    emptyReason: sorted.length === 0 ? (meta.emptyReason ?? "No rated games found in this window.") : undefined,
  };
}

/** Merge per-platform summaries into one (the user's OWN results combine fine across platforms). */
export function mergeSummaries(parts: { games: NormalizedGame[]; username: string; platform: Platform }[]): PlayerProfileSummary {
  const all = parts.flatMap((p) => p.games);
  const usernames: Partial<Record<Platform, string>> = {};
  for (const p of parts) usernames[p.platform] = p.username;
  return aggregate(all, { usernames, sources: parts.map((p) => p.platform) });
}
