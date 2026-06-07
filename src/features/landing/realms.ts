/**
 * Canonical realm data — from docs/opening-boss-catalog.md (names, openings, ECO,
 * Gauntlet) + the Art Direction Bible hero accents. Single source for the Boss
 * section and the Opening Passport so the 4-realm / 20-opening structure stays
 * consistent. Kingdom Boss names/titles/lore are the locked canonical copy.
 */
export interface RealmOpening {
  name: string;
  eco: string;
}

export interface Realm {
  key: "ember" | "obsidian" | "aegis" | "mirage";
  name: string;
  accent: string;
  archetype: string;
  boss: {
    name: string;
    title: string;
    lore: string;
    video: string;
    poster: string;
  };
  /** What the Kingdom Boss's Gauntlet tests (catalog "Tests (Gauntlet)"). */
  gauntlet: {
    format: string;
    openings: RealmOpening[];
  };
}

export const REALMS: [Realm, Realm, Realm, Realm] = [
  {
    key: "ember",
    name: "Ember Marches",
    accent: "#E0413B",
    archetype: "Warrior",
    boss: {
      name: "Ignar, the Crowned Conflagration",
      title: "Warlord of the Ember Marches",
      lore: "Every Warrior opening ends at his throne of molten swords. Break him, and the Ember Marches are yours.",
      video: "/art/bosses/endboss-warrior-cinematic.mp4",
      poster: "/art/bosses/endboss-warrior.webp",
    },
    gauntlet: {
      format: "~10 timed variations · White attacking lines + the Dragon as Black",
      openings: [
        { name: "Italian Game", eco: "C50–C54" },
        { name: "King's Gambit", eco: "C30–C39" },
        { name: "Scotch Game", eco: "C44–C45" },
        { name: "Smith-Morra Gambit", eco: "B21" },
        { name: "Sicilian Dragon", eco: "B70–B79" },
      ],
    },
  },
  {
    key: "obsidian",
    name: "Obsidian Court",
    accent: "#8B6CFF",
    archetype: "Strategist",
    boss: {
      name: "Theron the Eternal",
      title: "Regent of the Obsidian Court",
      lore: "The supreme strategist who reads the whole board in the stars. Outthink him to claim the Court.",
      video: "/art/bosses/endboss-strategist-cinematic.mp4",
      poster: "/art/bosses/endboss-strategist.webp",
    },
    gauntlet: {
      format: "~10 timed variations · White positional lines + the Nimzo as Black",
      openings: [
        { name: "Ruy Lopez", eco: "C60–C99" },
        { name: "Queen's Gambit", eco: "D06–D69" },
        { name: "Nimzo-Indian", eco: "E20–E59" },
        { name: "Catalan", eco: "E00–E09" },
        { name: "English Opening", eco: "A10–A39" },
      ],
    },
  },
  {
    key: "aegis",
    name: "Aegis Bastion",
    accent: "#2FB67A",
    archetype: "Defender",
    boss: {
      name: "Aegidius, the Last Wall",
      title: "Bastion Keeper of the Aegis",
      lore: "A living fortress that has never been breached. Outlast him, and the Aegis Bastion falls.",
      video: "/art/bosses/endboss-defender-cinematic.mp4",
      poster: "/art/bosses/endboss-defender.webp",
    },
    gauntlet: {
      format: "~10 timed variations · London as White + the four defenses as Black",
      openings: [
        { name: "London System", eco: "D02 / A48" },
        { name: "Caro-Kann", eco: "B10–B19" },
        { name: "French Defense", eco: "C00–C19" },
        { name: "Slav Defense", eco: "D10–D19" },
        { name: "Petroff Defense", eco: "C42–C43" },
      ],
    },
  },
  {
    key: "mirage",
    name: "Mirage Bazaar",
    accent: "#38C7D6",
    archetype: "Trickster",
    boss: {
      name: "Vesper, the Hall of Mirrors",
      title: "Masked Illusionist of the Mirage Bazaar",
      lore: "Every reflection hides a different trap. See through him to conquer the Mirage Bazaar.",
      video: "/art/bosses/endboss-trickster-cinematic.mp4",
      poster: "/art/bosses/endboss-trickster.webp",
    },
    gauntlet: {
      format: "~10 timed variations · mixed colors · heavy on trap recognition",
      openings: [
        { name: "Scandinavian", eco: "B01" },
        { name: "Budapest Gambit", eco: "A51–A52" },
        { name: "Stafford Gambit", eco: "C42" },
        { name: "Blackmar-Diemer Gambit", eco: "D00" },
        { name: "Englund Gambit", eco: "A40" },
      ],
    },
  },
];
