/**
 * Specialized titles (domain — pure). Earned by conquering an opening
 * (master-vision §28.6). Each opening has a flavourful title; anything else falls
 * back to "<Opening> Master".
 */
const OPENING_TITLES: Record<string, string> = {
  "sicilian-dragon": "Dragon Slayer",
  "london-system": "London Grandmaster",
  "french-defense": "French Fortress Master",
  "caro-kann-classical": "Caro-Kann Wall",
  "italian-giuoco-pianissimo": "Italian Maestro",
  "evans-gambit": "Evans Gambiteer",
  "kings-gambit": "King's Gambit Romantic",
  "queens-gambit-declined": "Queen's Gambit Scholar",
  "slav-defense": "Slav Stonewall",
  "scandinavian-mainline": "Scandinavian Raider",
  "budapest-gambit": "Budapest Trickster",
  "englund-gambit": "Englund Trapper",
};

export function openingTitle(slug: string, name: string): string {
  return OPENING_TITLES[slug] ?? `${name} Master`;
}
