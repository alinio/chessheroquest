"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIsClient, useReducedMotion } from "../hooks";
import { Panel } from "./Panel";
import { REALMS, type Realm } from "../realms";

/**
 * Kingdom Boss section — a 3-layer hierarchy that makes boss ↔ realm ↔ openings
 * one clear story:
 *   L1 Concept (constant): heading + the establishing arena cinematic (generic;
 *      does NOT change with the realm).
 *   L2 Realm selector: 4 accent chips (Ember default).
 *   L3 Boss Dossier (swaps with the realm): the realm's boss cinematic + name
 *      plate ("Kingdom Boss of {Realm}") + THE GAUNTLET (that realm's openings +
 *      ECO, format, seal reward). The realm name is the through-line.
 *
 * prefers-reduced-motion → every video falls back to its poster still.
 * Kingdom Boss = per-realm; Opening Guardian = per-opening.
 */
const ARENA_VIDEO = "/landing/scene-guardian.mp4";
const ARENA_POSTER = "/landing/scene-guardian-poster.jpg";

export function BossBlock() {
  const [idx, setIdx] = useState(0);
  const realm = REALMS[idx] ?? REALMS[0];
  const { boss, accent } = realm;
  const bossShort = boss.name.split(",")[0]?.split(" ")[0] ?? boss.name;

  return (
    <div className="mx-auto flex max-w-[1040px] flex-col items-center">
      {/* ---- LAYER 1 · concept (constant) ---- */}
      <p
        className="font-display text-xs font-semibold uppercase tracking-[0.32em] text-gold"
      >
        Kingdom Boss
      </p>
      <h3 className="font-display mt-3 text-center text-3xl font-bold text-text-hi sm:text-4xl">
        Face the Kingdom Bosses.
      </h3>
      <p className="mt-4 max-w-xl text-center text-[0.95rem] leading-relaxed text-[#E9E9EE]">
        Each realm ends in a Kingdom Boss — its hardest variations in one
        gauntlet. Outplay it over the board to prove your mastery and conquer the
        realm.
      </p>

      <Panel variant="ornate" className="mt-6 w-full" innerClassName="p-1.5">
        <div className="relative aspect-[2.4/1] w-full overflow-hidden rounded-[12px]">
          <ArenaCinematic />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4 text-center">
            <p className="text-[0.78rem] font-medium text-text-hi">
              Every realm&apos;s final battle is fought in an arena like this —
              one boss, one world, its openings on the line.
            </p>
          </div>
        </div>
      </Panel>

      {/* ---- LAYER 2 · realm selector (boss thumbnails — clearly tappable) ---- */}
      <div className="mt-7 w-full">
        <p className="mb-3 text-center text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-text-low">
          Pick a realm to face its Kingdom Boss
        </p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {REALMS.map((r, i) => {
            const active = i === idx;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => setIdx(i)}
                aria-pressed={active}
                className="group relative overflow-hidden rounded-card border transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  borderColor: active ? r.accent : "var(--color-hairline)",
                  boxShadow: active
                    ? `0 0 0 1px ${r.accent}, 0 12px 30px -12px ${r.accent}`
                    : undefined,
                }}
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={r.boss.poster}
                    alt={r.boss.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 240px"
                    className={`object-cover transition duration-300 ${
                      active
                        ? "saturate-100"
                        : "opacity-55 saturate-[0.55] group-hover:opacity-90"
                    }`}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(8,9,14,0.94), transparent 68%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-2 text-left">
                    <span
                      className="block text-[0.5rem] font-semibold uppercase tracking-wide"
                      style={{ color: r.accent }}
                    >
                      {r.name}
                    </span>
                    <span className="block text-[0.66rem] font-bold leading-tight text-text-hi">
                      {r.boss.name.split(",")[0]}
                    </span>
                  </div>
                  <span
                    className="absolute right-2 top-2 text-[0.5rem] font-semibold uppercase tracking-wide opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ color: r.accent }}
                  >
                    {active ? "" : "View"}
                  </span>
                  {active && (
                    <span
                      aria-hidden
                      className="absolute right-2 top-2 h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: r.accent,
                        boxShadow: `0 0 8px ${r.accent}`,
                      }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- LAYER 3 · boss dossier (swaps with the realm) ---- */}
      <Panel
        variant="ornate"
        glow={accent}
        className="mt-6 w-full"
        innerClassName="p-1.5"
      >
        <div className="grid overflow-hidden rounded-[12px] md:grid-cols-2 md:items-center">
          {/* boss cinematic — fixed 16:9 so every boss video is the same size */}
          <div className="bg-abyss/40 p-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <BossCinematic key={realm.key} realm={realm} />
              <span
                className="absolute left-2.5 top-2.5 rounded-chip border px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide backdrop-blur-sm"
                style={{
                  color: accent,
                  borderColor: `${accent}88`,
                  backgroundColor: "rgba(8,9,14,0.6)",
                }}
              >
                Kingdom Boss
              </span>
            </div>
          </div>

          {/* dossier: name plate + gauntlet */}
          <div className="bg-abyss/50 p-5 text-left sm:p-6">
            {/* name plate */}
            <p
              className="font-display text-2xl font-bold leading-tight"
              style={{ color: accent, textShadow: `0 0 22px ${accent}66` }}
            >
              {boss.name}
            </p>
            <p className="mt-0.5 text-sm font-medium text-text-mid">
              {boss.title}
            </p>
            <p
              className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em]"
              style={{ color: accent }}
            >
              Kingdom Boss of {realm.name}
            </p>
            <p className="mt-2 text-[0.8rem] leading-snug text-text-low">
              {boss.lore}
            </p>

            {/* the gauntlet */}
            <div
              className="mt-4 border-t pt-4"
              style={{ borderColor: "var(--color-hairline)" }}
            >
              <p
                className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
                style={{ color: accent }}
              >
                The Gauntlet
              </p>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-text-hi">
                Outplay <strong>{bossShort}</strong> across every opening of{" "}
                {realm.name}:
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {realm.gauntlet.openings.map((o) => (
                  <li
                    key={o.name}
                    className="rounded-chip border border-hairline bg-raised px-2.5 py-1 text-[0.7rem] text-text-hi"
                  >
                    {o.name} <span className="text-text-low">{o.eco}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2.5 text-[0.72rem] text-text-low">
                {realm.gauntlet.format}
              </p>
              <p className="mt-3 text-[0.82rem] font-medium text-text-mid">
                Conquer {realm.name} → earn its seal in your Opening Passport.
              </p>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function ArenaCinematic() {
  return (
    <Cinematic
      video={ARENA_VIDEO}
      poster={ARENA_POSTER}
      alt="A hall of giant chess pieces — the Kingdom Boss arena"
      sizes="(max-width: 1080px) 100vw, 1040px"
    />
  );
}

function BossCinematic({ realm }: { realm: Realm }) {
  const { boss } = realm;
  return (
    <Cinematic
      video={boss.video}
      poster={boss.poster}
      alt={`${boss.name} — ${boss.title}`}
      sizes="(max-width: 768px) 100vw, 520px"
    />
  );
}

/**
 * Poster-behind-video: the poster shows instantly and the video fades in only
 * once it actually has frames — so a large clip buffering (preload=none + play)
 * never leaves a black gap, including when switching realms. reduced-motion /
 * SSR → poster still only.
 */
function Cinematic({
  video,
  poster,
  alt,
  sizes,
}: {
  video: string;
  poster: string;
  alt: string;
  sizes: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const stillOnly = useStillOnly(ref);
  const [ready, setReady] = useState(false);

  return (
    <>
      <Image src={poster} alt={alt} fill sizes={sizes} className="object-cover" />
      {!stillOnly && (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          onLoadedData={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
    </>
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
