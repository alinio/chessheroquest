"use client";

/**
 * Progress-bar fill that animates to its real width when it first enters the
 * viewport (once, IntersectionObserver). prefers-reduced-motion renders the
 * final state immediately. Imperative style writes only — no re-renders.
 * Drop-in replacement for `<span style={{ width: pct% }} />` fills.
 */
import { useEffect, useRef } from "react";

export function BarFill({ pct, className }: { pct: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const target = Math.max(0, Math.min(100, pct));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transition = "none";
      el.style.width = `${target}%`;
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.style.width = `${target}%`;
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ width: 0, transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }}
    />
  );
}
