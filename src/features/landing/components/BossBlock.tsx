"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIsClient, useReducedMotion } from "../hooks";
import { Panel } from "./Panel";
import { REALMS, type Realm } from "../realms";

/**
 * Kingdom Boss showcase (Round-3). A Kingdom Boss is a realm's final Gauntlet —
 * its hardest variations, beaten by outplaying them on the board, which validates
 * mastery and conquers the realm.
 *
 * Layout: realm selector → the boss cinematic (endboss portrait, accent-tinted
 * ornate frame + coded name plate) → THE GAUNTLET card pairing the 3D chess-hall
 * cinematic (scene-guardian) with a plain-language explanation of the test.
 * prefers-reduced-motion → poster stills. Kingdom Boss = per-realm; Opening
 * Guardian = per-opening.
 */
const ARENA_VIDEO = "/landing/scene-guardian.mp4";
const ARENA_POSTER = "/landing/scene-guardian-poster.jpg";

export function BossBlock() {
  const [idx, setIdx] = useState(0);
  const realm = REALMS[idx] ?? REALMS[0];
  const { boss, accent } = realm;
  const bossShort = boss.name.split(",")[0]?.split(" ")[0] ?? boss.name;

  return (
    <div className="mx-auto flex max-w-[1040px] flex-col items-center text-center">
      <p
        className="font-display text-xs font-semibold uppercase tracking-[0.32em]"
        style={{ color: accent }}
      >
        Kingdom Boss
      </p>
      <h3 className="font-display mt-3 text-3xl font-bold text-text-hi sm:text-4xl">
        Face the Kingdom Bosses.
      </h3>
      <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-[#E9E9EE]">
        Each realm ends in a Kingdom Boss — its hardest variations in one
        gauntlet. Outplay it over the board to prove your mastery and conquer the
        realm.
      </p>

      {/* realm selectors */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {REALMS.map((r, i) => {
          const active = i === idx;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => setIdx(i)}
              aria-pressed={active}
              className="rounded-chip border px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-wide transition-colors duration-200"
              style={{
                borderColor: active ? r.accent : "var(--color-hairline)",
                color: active ? "#0F1015" : r.accent,
                backgroundColor: active ? r.accent : "transparent",
              }}
            >
              {r.name}
            </button>
          );
        })}
      </div>

      {/* boss cinematic + coded name plate */}
      <Panel
        variant="ornate"
        glow={accent}
        className="mt-6 w-full"
        innerClassName="p-1.5"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-[12px]">
          <BossCinematic key={realm.key} realm={realm} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-4 text-left sm:p-6">
            <p
              className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.2em]"
              style={{ color: accent }}
            >
              Kingdom Boss · {realm.name}
            </p>
            <p
              className="font-display mt-1 text-2xl font-bold leading-tight sm:text-3xl"
              style={{ color: accent, textShadow: `0 0 22px ${accent}66` }}
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

      {/* THE GAUNTLET — the 3D chess-hall cinematic paired with a plain-language
          explanation so it reads unmistakably as a chess test. */}
      <Panel
        variant="ornate"
        glow={accent}
        className="mt-6 w-full"
        innerClassName="p-1.5"
      >
        <div className="grid overflow-hidden rounded-[12px] md:grid-cols-2">
          {/* arena cinematic (re-integrated 3D cinematic) */}
          <div className="relative min-h-[180px] overflow-hidden md:min-h-full">
            <GauntletArena />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent 55%, rgba(8,9,14,0.85) 100%)`,
              }}
            />
            <span
              className="absolute left-3 top-3 rounded-chip border px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide backdrop-blur-sm"
              style={{
                color: accent,
                borderColor: `${accent}88`,
                backgroundColor: "rgba(8,9,14,0.6)",
              }}
            >
              The Arena
            </span>
          </div>

          {/* the test, explained */}
          <div className="bg-abyss/50 p-5 text-left sm:p-6">
            <p
              className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
              style={{ color: accent }}
            >
              The Gauntlet
            </p>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-text-hi">
              Sit down and outplay <strong>{bossShort}</strong> over the board —
              a timed run through every opening of {realm.name}:
            </p>

            <ul className="mt-3 flex flex-wrap gap-2">
              {realm.gauntlet.openings.map((o) => (
                <li
                  key={o.name}
                  className="rounded-chip border border-hairline bg-raised px-2.5 py-1 text-[0.72rem] text-text-hi"
                >
                  {o.name} <span className="text-text-low">{o.eco}</span>
                </li>
              ))}
            </ul>

            <p className="mt-3 text-[0.72rem] text-text-low">
              {realm.gauntlet.format}
            </p>

            <p
              className="mt-4 border-t pt-3 text-[0.82rem] leading-relaxed text-text-mid"
              style={{ borderColor: "var(--color-hairline)" }}
            >
              Beat the gauntlet → conquer {realm.name} → earn its seal in your
              Opening Passport.
            </p>
            {/* TODO(chess-curation): representative tabiya FEN per Gauntlet —
                the catalog gives move-sequences, not pinned boss FENs (GDD §11). */}
          </div>
        </div>
      </Panel>
    </div>
  );
}

function BossCinematic({ realm }: { realm: Realm }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const stillOnly = useStillOnly(ref);
  const { boss } = realm;

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

function GauntletArena() {
  const ref = useRef<HTMLVideoElement | null>(null);
  const stillOnly = useStillOnly(ref);

  if (stillOnly) {
    return (
      <Image
        src={ARENA_POSTER}
        alt="A hall of giant chess pieces — the gauntlet arena"
        fill
        sizes="(max-width: 768px) 100vw, 520px"
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
      poster={ARENA_POSTER}
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={ARENA_VIDEO} type="video/mp4" />
    </video>
  );
}

/** Play a video only while in view; reduced-motion / SSR → poster still. */
function useStillOnly(ref: React.RefObject<HTMLVideoElement | null>) {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
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
  }, [stillOnly, ref]);

  return stillOnly;
}
