"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * CSS-first scroll reveal (DESIGN.md §"Motion": "CSS-first for mobile
 * performance"). An IntersectionObserver toggles a `data-shown` attribute; the
 * actual transition is plain CSS, so it's cheap on mid-range phones and degrades
 * to instant under `prefers-reduced-motion` (globals.css zeroes durations).
 *
 * This replaces GSAP/Lenis/ScrollTrigger from the kickoff: those recipes live in
 * a `chq-landing` skill that isn't present, and the design system explicitly
 * prefers CSS for the mobile light-cut. No heavy scroll deps shipped.
 */
interface RevealProps {
  children: ReactNode;
  /** Stagger index → small delay, for sequenced reveals within a section. */
  index?: number;
  className?: string;
  as?: "div" | "li" | "section";
}

export function Reveal({
  children,
  index = 0,
  className = "",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IO support → reveal on the next frame (deferred, never hide content).
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as "div";
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      data-shown={shown}
      style={{ transitionDelay: `${Math.min(index, 6) * 80}ms` }}
      className={`translate-y-6 opacity-0 transition-[opacity,transform] duration-700 ease-out data-[shown=true]:translate-y-0 data-[shown=true]:opacity-100 ${className}`}
    >
      {children}
    </Tag>
  );
}
