"use client";

import { useEffect, useState } from "react";

/**
 * Animated count-up for hero numbers (the Opening IQ reveal). easeOutCubic.
 * Honors prefers-reduced-motion (jumps to the target in one frame).
 */
export function useCountUp(target: number, durationMs = 1200): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const total = reduce ? 0 : durationMs;
    let raf = 0;
    let start = 0;
    const step = (t: number) => {
      if (!start) start = t;
      const p = total <= 0 ? 1 : Math.min(1, (t - start) / total);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}
