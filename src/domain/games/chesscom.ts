/**
 * Chess.com game source (GameSource). Pulls a user's PUBLIC games via the
 * Published-Data API (monthly archives), normalises each to NormalizedGame and
 * feeds the SAME aggregator. Server-side only (UA + polite rate limits).
 * Real data only; 404/private/empty → SyncError / empty.
 *
 * API (verify against https://www.chess.com/news/view/published-data-api):
 *   GET /pub/player/{username}/games/archives        → { archives: [monthlyUrl, …] }
 *   GET {monthlyUrl}                                  → { games: [ {pgn,time_class,rated,white,black,end_time,eco}, … ] }
 * Username is lowercased (the API wants lowercase).
 */
import type { GameSource, NormalizedGame, SyncOptions, Speed, GameResult, Color } from "./types";
import { toOpeningFamily } from "./openingFamily";
import { SyncError } from "./lichess";

const UA = "ChessHeroQuest/1.0 (https://chessheroquest.com; contact alain@monkeoz.com)";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const DRAW = new Set(["agreed", "repetition", "stalemate", "insufficient", "50move", "timevsinsufficient"]);
const LOSS = new Set(["checkmated", "resigned", "timeout", "abandoned", "lose", "kingofthehill", "threecheck", "bughousepartnerlose"]);

function mapResult(r: string, color: Color): GameResult | null {
  void color;
  if (r === "win") return "win";
  if (DRAW.has(r)) return "draw";
  if (LOSS.has(r)) return "loss";
  return null;
}

function mapSpeed(tc: string): Speed {
  if (tc === "bullet" || tc === "blitz" || tc === "rapid") return tc;
  if (tc === "daily") return "classical"; // correspondence → our slow bucket
  return "other";
}

function pgnTag(pgn: string | undefined, tag: string): string | undefined {
  if (!pgn) return undefined;
  const m = pgn.match(new RegExp(`\\[${tag} "([^"]*)"\\]`));
  return m?.[1];
}

export const chesscomSource: GameSource = {
  platform: "chesscom",
  async fetchGames(username: string, opts: SyncOptions): Promise<NormalizedGame[]> {
    const u = username.trim().toLowerCase();
    let archRes: Response;
    try {
      archRes = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(u)}/games/archives`, { headers: { "User-Agent": UA, Accept: "application/json" } });
    } catch {
      throw new SyncError("network");
    }
    if (archRes.status === 404) throw new SyncError("not_found");
    if (archRes.status === 429) throw new SyncError("rate_limited");
    if (!archRes.ok) throw new SyncError("network");

    const { archives = [] } = (await archRes.json()) as { archives?: string[] };
    const recent = archives.slice(-opts.sinceMonths); // last N months (archives are oldest→newest)
    const cap = opts.maxPerSpeed * opts.speeds.length;
    const speeds = new Set<Speed>(opts.speeds);
    const out: NormalizedGame[] = [];

    for (let i = recent.length - 1; i >= 0 && out.length < cap; i--) {
      let res: Response;
      try {
        res = await fetch(recent[i]!, { headers: { "User-Agent": UA, Accept: "application/json" } });
      } catch {
        continue;
      }
      if (res.status === 429) { await sleep(30_000); i++; continue; }
      if (!res.ok) continue;
      const { games = [] } = (await res.json()) as { games?: Record<string, unknown>[] };
      for (const g of games) {
        if (out.length >= cap) break;
        if (g.rated !== true) continue;
        const tc = (g.time_class as string) ?? "";
        const speed = mapSpeed(tc);
        if (!speeds.has(speed)) continue;
        const white = g.white as { username?: string; rating?: number; result?: string } | undefined;
        const black = g.black as { username?: string; rating?: number; result?: string } | undefined;
        const color: Color | null = (white?.username ?? "").toLowerCase() === u ? "white" : (black?.username ?? "").toLowerCase() === u ? "black" : null;
        if (!color) continue;
        const raw = (color === "white" ? white?.result : black?.result) ?? "";
        const result = mapResult(raw, color);
        if (!result) continue;
        const pgn = g.pgn as string | undefined;
        const eco = pgnTag(pgn, "ECO");
        const ecoUrl = pgnTag(pgn, "ECOUrl");
        const name = ecoUrl ? decodeURIComponent(ecoUrl.split("/").pop() ?? "").replace(/-/g, " ") : undefined;
        out.push({
          platform: "chesscom",
          color,
          result,
          eco,
          openingFamily: toOpeningFamily(name, eco),
          speed,
          date: new Date(((g.end_time as number) ?? 0) * 1000).toISOString(),
          rating: color === "white" ? white?.rating : black?.rating,
        });
      }
      await sleep(900); // polite between archive fetches
    }
    return out;
  },
};
