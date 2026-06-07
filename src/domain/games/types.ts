/**
 * Platform-neutral game-sync types. A GameSource (Lichess, Chess.com, …) fetches
 * a user's PUBLIC games and normalises them to NormalizedGame; one shared
 * aggregator turns those into a PlayerProfileSummary (per-opening + per-color
 * performance) that feeds the result (strongest / weakness / Road to Elo).
 *
 * Truth: real platform data only — never fabricated. Empty/private → empty state.
 */
export type Platform = "lichess" | "chesscom";
export type GameResult = "win" | "draw" | "loss";
export type Speed = "bullet" | "blitz" | "rapid" | "classical" | "other";
export type Color = "white" | "black";

export interface NormalizedGame {
  platform: Platform;
  color: Color;
  result: GameResult;
  eco?: string; // ECO code if the platform provided it
  openingFamily: string; // mapped to our families (or "Uncategorized")
  speed: Speed;
  date: string; // ISO (game end/created)
  rating?: number; // the user's rating in that game
}

export interface OpeningPerf {
  openingFamily: string;
  games: number;
  wins: number;
  draws: number;
  losses: number;
  scorePct: number; // (wins + draws/2) / games * 100
}

export interface ColorPerf {
  color: Color;
  games: number;
  wins: number;
  draws: number;
  losses: number;
  scorePct: number;
}

export interface PlayerProfileSummary {
  sources: Platform[]; // which platforms fed this summary
  usernames: Partial<Record<Platform, string>>;
  totalGames: number;
  byOpening: OpeningPerf[]; // sorted: most-played first
  byColor: ColorPerf[];
  mostPlayed: OpeningPerf[]; // top N by games
  strongest: OpeningPerf | null; // best scorePct among openings with enough games
  weakest: OpeningPerf | null; // worst scorePct among openings with enough games
  recentForm: GameResult[]; // last ~20 results, newest first
  fetchedAt: string; // ISO
  emptyReason?: string; // set when no rated games / private / not found
}

/** Pluggable per-platform fetcher. */
export interface GameSource {
  platform: Platform;
  fetchGames(username: string, opts: SyncOptions): Promise<NormalizedGame[]>;
}

export interface SyncOptions {
  maxPerSpeed: number; // cap per perf type
  sinceMonths: number; // window
  speeds: Exclude<Speed, "other">[];
}

/** Baked defaults (CONFIRM with founder). */
export const DEFAULT_SYNC_OPTIONS: SyncOptions = {
  maxPerSpeed: 300, // // CONFIRM: ~300 games per speed
  sinceMonths: 12, // // CONFIRM: last 12 months
  speeds: ["blitz", "rapid", "classical"],
};

export const MIN_GAMES_FOR_RANKING = 4; // an opening needs this many to be "strongest/weakest"
