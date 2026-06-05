/**
 * Curated repertoire model (domain — pure, framework-free).
 * A CuratedPath is editorial content (the one place chess expertise is hand-encoded,
 * per CLAUDE.md DATA SOURCES). Its legality is certified by chess.js in tests.
 */

export type Archetype = "warrior" | "strategist" | "defender" | "trickster";

export interface CuratedPath {
  /** Stable slug id. */
  id: string;
  /** Human name shown in the HUD. */
  name: string;
  /** ECO code (e.g. "C50"). */
  eco: string;
  /** DNA archetype this line belongs to. */
  archetype: Archetype;
  /** One-line description for the Learn panel. */
  description: string;
  /**
   * Mainline in SAN, from the initial position, alternating White/Black.
   * Validated for legality via chess.js (see line.test.ts).
   */
  moves: string[];
}
