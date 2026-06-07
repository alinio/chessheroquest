/**
 * Lichess game source (GameSource). Pulls a user's PUBLIC rated games via the
 * games-export NDJSON endpoint, normalises each to NormalizedGame. Server-side
 * only (UA + rate-limit handling). Real data only; 404/empty → SyncError/empty.
 *
 * API (verify against https://lichess.org/api when changing):
 *   GET /api/games/user/{username}?rated=true&perfType=<speed>&since=<ms>&max=<n>
 *       &opening=true&moves=false&pgnInJson=false   (Accept: application/x-ndjson)
 */
import type { GameSource, NormalizedGame, SyncOptions, Speed, GameResult, Color } from "./types";
import { toOpeningFamily } from "./openingFamily";

const UA = "ChessHeroQuest/1.0 (https://chessheroquest.com; contact alain@monkeoz.com)";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class SyncError extends Error {
  constructor(public code: "not_found" | "rate_limited" | "network") {
    super(code);
  }
}

function mapSpeed(s: string): Speed {
  return s === "blitz" || s === "rapid" || s === "classical" || s === "bullet" ? s : "other";
}

export const lichessSource: GameSource = {
  platform: "lichess",
  async fetchGames(username: string, opts: SyncOptions): Promise<NormalizedGame[]> {
    const user = username.trim();
    const u = user.toLowerCase();
    const since = Date.now() - opts.sinceMonths * 30 * 24 * 60 * 60 * 1000;
    const out: NormalizedGame[] = [];

    for (const speed of opts.speeds) {
      const url = `https://lichess.org/api/games/user/${encodeURIComponent(user)}?rated=true&perfType=${speed}&since=${since}&max=${opts.maxPerSpeed}&opening=true&moves=false&pgnInJson=false`;
      let res: Response | undefined;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          res = await fetch(url, { headers: { Accept: "application/x-ndjson", "User-Agent": UA } });
        } catch {
          throw new SyncError("network");
        }
        if (res.status === 429) { await sleep(61_000); continue; }
        break;
      }
      if (!res) throw new SyncError("network");
      if (res.status === 404) throw new SyncError("not_found");
      if (!res.ok) { await sleep(1100); continue; } // skip this speed on transient error

      const text = await res.text();
      for (const line of text.split("\n")) {
        const t = line.trim();
        if (!t) continue;
        let g: Record<string, unknown>;
        try { g = JSON.parse(t); } catch { continue; }
        const players = (g.players ?? {}) as { white?: { user?: { name?: string }; rating?: number }; black?: { user?: { name?: string }; rating?: number } };
        const w = (players.white?.user?.name ?? "").toLowerCase();
        const b = (players.black?.user?.name ?? "").toLowerCase();
        const color: Color | null = w === u ? "white" : b === u ? "black" : null;
        if (!color) continue;

        const status = g.status as string | undefined;
        if (status === "aborted" || status === "noStart") continue;

        const winner = g.winner as "white" | "black" | undefined;
        const result: GameResult = winner === color ? "win" : winner ? "loss" : "draw";

        const opening = g.opening as { eco?: string; name?: string } | undefined;
        out.push({
          platform: "lichess",
          color,
          result,
          eco: opening?.eco,
          openingFamily: toOpeningFamily(opening?.name, opening?.eco),
          speed: mapSpeed((g.speed as string) ?? speed),
          date: new Date((g.lastMoveAt as number) ?? (g.createdAt as number) ?? Date.now()).toISOString(),
          rating: players[color]?.rating,
        });
      }
      await sleep(1100); // polite between speed requests
    }
    return out;
  },
};
