"use client";

/**
 * Post-seal Passport arrival: when a seal was just stamped (SealCelebration
 * arms sessionStorage `chq.stamp.pending.v1` with the path id), the first
 * Passport visit auto-scrolls to that medallion and scale-stamps its seal in,
 * ONCE (the flag is consumed on read). prefers-reduced-motion: instant scroll,
 * no scale-in. Imperative DOM only — renders nothing.
 */
import { useEffect } from "react";
import { PATH_TO_OPENING } from "@/src/lib/opening-paths";

const KEY = "chq.stamp.pending.v1";

export function StampArrival() {
  useEffect(() => {
    let pathId: string | null = null;
    try {
      pathId = window.sessionStorage.getItem(KEY);
      if (pathId) window.sessionStorage.removeItem(KEY); // one-shot
    } catch {
      return;
    }
    if (!pathId) return;
    const openingId = PATH_TO_OPENING[pathId];
    if (!openingId) return;
    const el = document.getElementById(`pp-med-${openingId}`);
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    if (!reduced) el.classList.add("stamp-arrive");
  }, []);
  return null;
}
