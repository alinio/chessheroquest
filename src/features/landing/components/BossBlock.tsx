"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIsClient, useReducedMotion } from "../hooks";
import { Panel } from "./Panel";

/**
 * Kingdom Boss showcase (Round 3 §1). The per-WORLD boss tier ("Kingdom Boss /
 * Gauntlet" — the per-opening boss is the "Opening Guardian" elsewhere). A real
 * world-boss cinematic plays inside the ornate gold frame with a CODED name plate
 * (name · title · realm · lore) tinted by the world accent; a row of 4 accent
 * selectors swaps the featured boss. Names/titles/lore are verbatim from
 * docs/opening-boss-catalog.md. prefers-reduced-motion → poster still.
 */
interface KingdomBoss {
  world: string;
  archetype: string;
  accent: string;
  name: string;
  title: string;
  lore: string;
  video: string;
  poster: string;
}

// Boss section — world-boss plates (canonical, from docs/opening-boss-catalog.md)
const BOSSES: [KingdomBoss, KingdomBoss, KingdomBoss, KingdomBoss] = [
  {
    world: "Ember Marches",
    archetype: "Warrior",
    accent: "#E0413B",
    name: "Ignar, the Crowned Conflagration",
    title: "Warlord of the Ember Marches",
    lore: "Every Warrior opening ends at his throne of molten swords. Break him, and the Ember Marches are yours.",
    video: "/art/bosses/endboss-warrior-cinematic.mp4",
    poster: "/art/bosses/endboss-warrior.webp",
  },
  {
    world: "Obsidian Court",
    archetype: "Strategist",
    accent: "#8B6CFF",
    name: "Theron the Eternal",
    title: "Regent of the Obsidian Court",
    lore: "The supreme strategist who reads the whole board in the stars. Outthink him to claim the Court.",
    video: "/art/bosses/endboss-strategist-cinematic.mp4",
    poster: "/art/bosses/endboss-strategist.webp",
  },
  {
    world: "Aegis Bastion",
    archetype: "Defender",
    accent: "#2FB67A",
    name: "Aegidius, the Last Wall",
    title: "Bastion Keeper of the Aegis",
    lore: "A living fortress that has never been breached. Outlast him, and the Aegis Bastion falls.",
    video: "/art/bosses/endboss-defender-cinematic.mp4",
    poster: "/art/bosses/endboss-defender.webp",
  },
  {
    world: "Mirage Bazaar",
    archetype: "Trickster",
    accent: "#38C7D6",
    name: "Vesper, the Hall of Mirrors",
    title: "Masked Illusionist of the Mirage Bazaar",
    lore: "Every reflection hides a different trap. See through him to conquer the Mirage Bazaar.",
    video: "/art/bosses/endboss-trickster-cinematic.mp4",
    poster: "/art/bosses/endboss-trickster.webp",
  },
];

export function BossBlock() {
  const [idx, setIdx] = useState(0);
  const boss = BOSSES[idx] ?? BOSSES[0];

  return (
    <div className="mx-auto flex max-w-[1040px] flex-col items-center text-center">
      <p
        className="font-display text-xs font-semibold uppercase tracking-[0.32em]"
        style={{ color: boss.accent }}
      >
        Kingdom Boss
      </p>
      <h3 className="font-display mt-3 text-3xl font-bold text-text-hi sm:text-4xl">
        Face the Kingdom Bosses.
      </h3>
      <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-[#E9E9EE]">
        Four realms, four Kingdom Bosses — each the final gauntlet of an entire
        world.
      </p>

      {/* world selectors */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {BOSSES.map((b, i) => {
          const active = i === idx;
          return (
            <button
              key={b.world}
              type="button"
              onClick={() => setIdx(i)}
              aria-pressed={active}
              className="rounded-chip border px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-wide transition-colors duration-200"
              style={{
                borderColor: active ? b.accent : "var(--color-hairline)",
                color: active ? "#0F1015" : b.accent,
                backgroundColor: active ? b.accent : "transparent",
              }}
            >
              {b.world}
            </button>
          );
        })}
      </div>

      {/* cinematic in the ornate frame + coded name plate */}
      <Panel
        variant="ornate"
        glow={boss.accent}
        className="mt-6 w-full"
        innerClassName="p-1.5"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-[12px]">
          <BossCinematic key={boss.world} boss={boss} />

          {/* coded name plate (text never baked into the video) */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-4 text-left sm:p-6">
            <p
              className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.2em]"
              style={{ color: boss.accent }}
            >
              Kingdom Boss · {boss.world}
            </p>
            <p
              className="font-display mt-1 text-2xl font-bold leading-tight sm:text-3xl"
              style={{
                color: boss.accent,
                textShadow: `0 0 22px ${boss.accent}66`,
              }}
            >
              {boss.name}
            </p>
            <p className="mt-0.5 text-sm font-medium text-text-mid">
              {boss.title}
            </p>
            <p className="mt-1.5 max-w-xl text-[0.8rem] leading-snug text-text-low">
              {boss.lore}
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function BossCinematic({ boss }: { boss: KingdomBoss }) {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement | null>(null);
  const stillOnly = !isClient || reduce;

  useEffect(() => {
    if (stillOnly) return;
    const v = ref.current;
    if (!v || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [stillOnly]);

  if (stillOnly) {
    return (
      <Image
        src={boss.poster}
        alt={`${boss.name} — ${boss.title}`}
        fill
        sizes="(max-width: 1080px) 100vw, 1040px"
        className="object-cover"
      />
    );
  }

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={boss.poster}
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={boss.video} type="video/mp4" />
    </video>
  );
}
