"use client";

import { useEffect, useRef, useState } from "react";
import { Panel } from "./Panel";
import { WaxSeal } from "./WaxSeal";
import { REALMS } from "../realms";

/**
 * Opening Passport (Round-3 rework) — fully coded trophy wall. The 20 openings
 * are grouped by their 4 realms; each opening is a coded wax seal (gold + realm
 * accent when earned, dim embossed slot when locked). A gold progress bar tracks
 * "N / 20 sealed". Earned seals stamp in on scroll (reduced-motion → final
 * state). No stock imagery.
 */
// Demo earned state — a representative spread across all four realms.
const EARNED = new Set([
  "Italian Game",
  "King's Gambit",
  "Scotch Game",
  "Ruy Lopez",
  "Queen's Gambit",
  "London System",
  "Caro-Kann",
  "Scandinavian",
]);
const TOTAL = REALMS.reduce((n, r) => n + r.gauntlet.openings.length, 0);
const SEALED = REALMS.reduce(
  (n, r) => n + r.gauntlet.openings.filter((o) => EARNED.has(o.name)).length,
  0,
);

export function PassportBlock() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let earnedSeen = 0;

  return (
    <Panel variant="ornate" innerClassName="p-6 sm:p-8">
      <div ref={ref}>
        {/* header + progress */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Your Opening Passport
            </p>
            <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-[#E9E9EE]">
              Master an opening, earn its seal. Collect all 20 across the four
              realms.
            </p>
          </div>
          <div className="w-full sm:w-64">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-sm font-semibold text-gold">
                {SEALED} / {TOTAL}
              </span>
              <span className="text-[0.62rem] uppercase tracking-wide text-text-low">
                openings sealed
              </span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-chip border border-hairline bg-abyss">
              <div
                className="h-full rounded-chip bg-gradient-to-r from-gold-deep via-gold to-gold-bright transition-[width] duration-700"
                style={{ width: `${started ? (SEALED / TOTAL) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* realm clusters */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {REALMS.map((realm) => (
            <div
              key={realm.key}
              className="rounded-card border border-hairline/70 bg-abyss/40 p-4"
            >
              <p
                className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.18em]"
                style={{ color: realm.accent }}
              >
                {realm.name}
              </p>
              <ul className="mt-3 grid grid-cols-5 gap-2">
                {realm.gauntlet.openings.map((o) => {
                  const earned = EARNED.has(o.name);
                  const delay = earned ? 0.2 + earnedSeen++ * 0.35 : 0;
                  return (
                    <li
                      key={o.name}
                      className="flex flex-col items-center gap-1 text-center"
                    >
                      <WaxSeal
                        earned={earned}
                        accent={realm.accent}
                        animate={started && earned}
                        delaySec={delay}
                        size={48}
                      />
                      <span
                        className={`text-[0.5rem] leading-tight ${earned ? "text-text-mid" : "text-text-low"}`}
                      >
                        {o.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
