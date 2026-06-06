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
    // setTimeout (even 0ms) keeps this off the synchronous effect path.
    const id = setTimeout(() => setShown(true), reduce ? 0 : 600);
    return () => clearTimeout(id);
  }, [reduce]);

  return (
    <div
      className={`transition-[opacity,transform] duration-700 ease-out ${
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
  );
}
