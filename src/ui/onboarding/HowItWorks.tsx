"use client";

/**
 * How-it-works — first-visit concept onboarding for the hub. Presents the
 * pedagogical loop (Learn → Drill → Prove → Seal) once, then never again
 * (localStorage). Skippable, Esc-closable, reduced-motion safe. The goal:
 * a brand-new player understands in 15 seconds why training here works.
 */
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "chq.howitworks.v1";

const STEPS = [
  {
    glyph: "♞",
    title: "Learn",
    text: "Pick an opening and play its line move by move on a real board — guided, never lectured.",
  },
  {
    glyph: "⚔",
    title: "Drill",
    text: "Short daily reviews lock the moves in, scheduled right before you'd forget them.",
  },
  {
    glyph: "♛",
    title: "Prove",
    text: "Face the Opening Guardian in a quest. Beat it to prove the line is truly yours.",
  },
  {
    glyph: "🛡",
    title: "Seal",
    text: "Every Guardian defeated stamps a seal in your Passport. 20 seals. One repertoire.",
  },
] as const;

export function HowItWorks() {
  const [open, setOpen] = useState(false);

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Best effort — closing still works for this session.
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    // Replay on demand: the rail's "How it works" links to /train?intro=1.
    const forced = new URLSearchParams(window.location.search).get("intro") === "1";
    let seen = true;
    try {
      seen = window.localStorage.getItem(STORAGE_KEY) != null;
    } catch {
      // Private mode without storage: skip the intro rather than loop it.
      seen = true;
    }
    if (seen && !forced) return;
    // Reveal after first paint — avoids a synchronous setState-in-effect cascade.
    const t = window.setTimeout(() => setOpen(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  // Rail "How it works" re-opens the intro even when already on /train.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("chq:intro", onOpen);
    return () => window.removeEventListener("chq:intro", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div className="hiw-overlay" role="dialog" aria-modal="true" aria-labelledby="hiw-title">
      <div className="hiw-panel">
        <p className="hiw-eyebrow">Welcome to ChessHeroQuest</p>
        <h2 id="hiw-title" className="serif">
          Master openings like a hero.
        </h2>
        <ol className="hiw-steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="hiw-glyph" aria-hidden="true">
                {s.glyph}
              </span>
              <span className="hiw-step-n">{i + 1}</span>
              <h3 className="serif">{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="hiw-promise">
          5 minutes a day. Your Opening IQ only rises when you actually improve.
        </p>
        <div className="hiw-actions">
          <button className="btn-gold" type="button" onClick={dismiss}>
            Begin training →
          </button>
          <button className="hiw-skip" type="button" onClick={dismiss}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
