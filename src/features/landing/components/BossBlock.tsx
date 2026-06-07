"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIsClient, useReducedMotion } from "../hooks";
import { Panel } from "./Panel";
import { REALMS, type Realm } from "../realms";

/**
 * Kingdom Boss showcase (Round-3). A Kingdom Boss is a realm's final Gauntlet —
 * its hardest variations, beaten by outplaying them on the board, which validates
 * mastery and conquers the realm. The featured boss plays as a cinematic in the
 * ornate gold frame (accent-tinted) with a coded name plate; a coded "THE
 * GAUNTLET" panel makes the chess test explicit. A 4-realm selector swaps
 * video + plate + gauntlet. prefers-reduced-motion → poster still.
 *
 * Terminology: Kingdom Boss = per-realm (here); Opening Guardian = per-opening.
 */
export function BossBlock() {
  const [idx, setIdx] = useState(0);
  const realm = REALMS[idx] ?? REALMS[0];
  const { boss, accent } = realm;

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

      {/* cinematic in the ornate frame + coded name plate */}
      <Panel
        variant="ornate"
        glow={accent}
        className="mt-6 w-full"
        innerClassName="p-1.5"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-[12px]">
          <BossCinematic key={realm.key} realm={realm} />

          {/* coded name plate (text never baked into the video) */}
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

      {/* THE GAUNTLET — coded chess-test panel */}
      <div
        className="mt-6 w-full rounded-card border bg-abyss/40 p-5 text-left sm:p-6"
        style={{ borderColor: `${accent}55` }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p
            className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
            style={{ color: accent }}
          >
            The Gauntlet
          </p>
          <p className="text-[0.72rem] text-text-low">
            {realm.gauntlet.format}
          </p>
        </div>

        <ul className="mt-3 flex flex-wrap gap-2">
          {realm.gauntlet.openings.map((o) => (
            <li
              key={o.name}
              className="rounded-chip border border-hairline bg-raised px-2.5 py-1 text-[0.72rem] text-text-hi"
            >
              {o.name}{" "}
              <span className="text-text-low">{o.eco}</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[0.82rem] leading-relaxed text-text-mid">
          Win it over the board → prove your mastery of the realm → earn its seal
          in your Opening Passport.
        </p>
        {/* TODO(chess-curation): representative tabiya FEN per Gauntlet — the
            catalog gives move-sequences, not pinned boss FENs (GDD §11). */}
      </div>
    </div>
  );
}

function BossCinematic({ realm }: { realm: Realm }) {
  const isClient = useIsClient();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement | null>(null);
  const stillOnly = !isClient || reduce;
  const { boss } = realm;

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
