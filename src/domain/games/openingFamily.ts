/**
 * Map a platform's opening (name + ECO) to one of our opening families
 * (chess-curation-spec / opening roster). Deterministic, name-first (the platform
 * gives the specific opening name), ECO as a fallback. Unknown/blank → "Uncategorized"
 * — never fabricated. Order matters: specific entries before broader ones.
 */
const NAME_RULES: { keywords: string[]; family: string }[] = [
  // Ember Marches (Warrior)
  { keywords: ["evans", "giuoco", "two knights", "fried liver", "italian", "hungarian defense"], family: "Italian Game" },
  { keywords: ["king's gambit", "kings gambit"], family: "King's Gambit" },
  { keywords: ["scotch"], family: "Scotch Game" },
  { keywords: ["smith-morra", "morra"], family: "Smith-Morra Gambit" },
  { keywords: ["dragon"], family: "Sicilian Dragon" },
  // Obsidian Court (Strategist)
  { keywords: ["ruy lopez", "spanish game", "spanish opening"], family: "Ruy Lopez" },
  { keywords: ["nimzo-indian", "nimzo indian"], family: "Nimzo-Indian" },
  { keywords: ["catalan"], family: "Catalan" },
  { keywords: ["english opening", "english, ", "english:"], family: "English Opening" },
  // Aegis Bastion (Defender)
  { keywords: ["london"], family: "London System" },
  { keywords: ["slav"], family: "Slav Defense" },
  { keywords: ["stafford"], family: "Stafford Gambit" }, // before Petroff (it's a Petroff sub-line)
  { keywords: ["petrov", "petroff", "russian game"], family: "Petroff Defense" },
  { keywords: ["caro-kann", "caro kann"], family: "Caro-Kann Defense" },
  { keywords: ["french"], family: "French Defense" },
  { keywords: ["queen's gambit", "queens gambit", "qgd", "qga"], family: "Queen's Gambit" },
  // Mirage Bazaar (Trickster)
  { keywords: ["scandinavian", "center counter", "centre counter"], family: "Scandinavian Defense" },
  { keywords: ["budapest"], family: "Budapest Gambit" },
  { keywords: ["blackmar"], family: "Blackmar-Diemer Gambit" },
  { keywords: ["englund"], family: "Englund Gambit" },
];

// Coarse ECO-range fallback (start inclusive, end inclusive) for our families.
const ECO_RULES: { lo: string; hi: string; family: string }[] = [
  { lo: "C50", hi: "C54", family: "Italian Game" },
  { lo: "C30", hi: "C39", family: "King's Gambit" },
  { lo: "C44", hi: "C45", family: "Scotch Game" },
  { lo: "B21", hi: "B21", family: "Smith-Morra Gambit" },
  { lo: "B70", hi: "B79", family: "Sicilian Dragon" },
  { lo: "C60", hi: "C99", family: "Ruy Lopez" },
  { lo: "E20", hi: "E59", family: "Nimzo-Indian" },
  { lo: "E00", hi: "E09", family: "Catalan" },
  { lo: "A10", hi: "A39", family: "English Opening" },
  { lo: "D10", hi: "D19", family: "Slav Defense" },
  { lo: "C42", hi: "C43", family: "Petroff Defense" },
  { lo: "B10", hi: "B19", family: "Caro-Kann Defense" },
  { lo: "C00", hi: "C19", family: "French Defense" },
  { lo: "D06", hi: "D69", family: "Queen's Gambit" },
  { lo: "B01", hi: "B01", family: "Scandinavian Defense" },
  { lo: "A51", hi: "A52", family: "Budapest Gambit" },
  { lo: "A40", hi: "A40", family: "Englund Gambit" },
];

export const UNCATEGORIZED = "Uncategorized";

export function toOpeningFamily(name?: string, eco?: string): string {
  const n = (name ?? "").toLowerCase();
  if (n) {
    for (const r of NAME_RULES) {
      if (r.keywords.some((k) => n.includes(k))) return r.family;
    }
  }
  const e = (eco ?? "").toUpperCase().trim();
  if (/^[A-E]\d{2}$/.test(e)) {
    for (const r of ECO_RULES) {
      if (e >= r.lo && e <= r.hi) return r.family;
    }
  }
  return UNCATEGORIZED;
}
