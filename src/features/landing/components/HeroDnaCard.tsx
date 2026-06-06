"use client";

import { useEffect, useState } from "react";
import { DNACard } from "./DNACard";
import { EXAMPLE_DNA } from "../exampleData";
import { useReducedMotion } from "../hooks";

/**
 * Hero DNA Card with a delayed reveal (kickoff pass 2 §1). On load the cinematic
 * king + H1 land first; the card materializes after ~0.6s (fade + scale-in) so it
 * never hides the animation on first impression. Then it floats with a pulsing
 * gold halo. Under `prefers-reduced-motion` it's present immediately and static.
 */
export function HeroDnaCard() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // ~1.2s beat: the king animates first, then the card materializes (Round 2 §1).
    const id = setTimeout(() => setShown(true), reduce ? 0 : 1200);
    return () => clearTimeout(id);
  }, [reduce]);

  return (
    <div className="relative">
      {/* soft radial vignette for separation (not a hard panel) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 bg-[radial-gradient(closest-side,rgba(8,9,14,0.85),transparent)]"
      />
      <div
        className={`relative w-[18.5rem] transition-[opacity,transform] duration-[900ms] ease-out sm:w-[20rem] ${
          shown
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="animate-[chq-float_6s_ease-in-out_infinite] [will-change:transform]">
          <div className="rounded-card animate-[chq-card-glow_4.5s_ease-in-out_infinite]">
            <DNACard data={EXAMPLE_DNA} />
          </div>
        </div>
      </div>
    </div>
  );
}
