/**
 * Archetype display meta — a SHARED module (no "use client") so both server
 * and client components can import it. Importing a const/function from a
 * "use client" module into a server component hands you a client-reference
 * proxy in production (properties undefined, calls throw) — that exact trap
 * 500'd /profile while dev mode hid it.
 */
import type { Archetype } from "@/src/domain/repertoire/types";

export interface ArchetypeMeta {
  label: string;
  tagline: string;
  colorVar: string;
}

export const ARCHETYPE_META: Record<Archetype, ArchetypeMeta> = {
  warrior: { label: "Warrior", tagline: "Attack relentlessly", colorVar: "var(--color-warrior)" },
  strategist: { label: "Strategist", tagline: "Outmaneuver, then crush", colorVar: "var(--color-strategist)" },
  defender: { label: "Defender", tagline: "Unbreakable and patient", colorVar: "var(--color-defender)" },
  trickster: { label: "Trickster", tagline: "Surprise and bewilder", colorVar: "var(--color-trickster)" },
};

const FALLBACK_META: ArchetypeMeta = { label: "Hero", tagline: "", colorVar: "var(--color-strategist)" };

/** Safe lookup — stored archetype strings must never crash a page. */
export function archetypeMeta(key: string | null | undefined): ArchetypeMeta {
  return (key && ARCHETYPE_META[key as Archetype]) || FALLBACK_META;
}
