/**
 * XP & levels (domain — pure). The engagement layer (master-vision §12).
 * XP rewards real actions only — never time spent or volume (LAW #5 / §12.0).
 */

export const XP_REWARDS = {
  drillCorrect: 5,
  questComplete: 50,
  weaknessBattle: 40,
  bossDefeated: 150,
  dnaTest: 100,
} as const;

/** Level from total XP. Gentle quadratic curve: level L starts at 50·(L-1)². */
export function xpForLevel(level: number): number {
  const l = Math.max(1, Math.floor(level));
  return 50 * (l - 1) ** 2;
}

export function levelForXp(xp: number): number {
  if (xp <= 0) return 1;
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

/** Level + progress into the current level, for a progress bar. */
export function xpProgress(xp: number): {
  level: number;
  into: number;
  needed: number;
} {
  const level = levelForXp(xp);
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  return { level, into: Math.max(0, xp - floor), needed: ceil - floor };
}
