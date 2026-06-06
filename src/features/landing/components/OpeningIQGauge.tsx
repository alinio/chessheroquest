"use client";

import { useEffect, useRef, useState } from "react";
import { useCountUp } from "@/src/ui/hooks/useCountUp";

/**
 * The Opening IQ Gauge (kickoff §6) — the hero number rendered as treasure.
 * A gold ring fills + the IQ counts up when it scrolls into view (DESIGN.md:
 * "IQ counts up with gold glow"). Reuses the app's `useCountUp` (easeOutCubic,
 * reduced-motion aware) so the marketing gauge and the real product match.
 */
interface OpeningIQGaugeProps {
  value: number;
  /** Ring fill is value/max — purely decorative scale (Opening IQ tops ~800). */
  max?: number;
  size?: number;
  label?: string;
}

export function OpeningIQGauge({
  value,
  max = 800,
  size = 200,
  label = "Opening IQ",
}: OpeningIQGaugeProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setStart(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStart(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  const offset = start ? circ * (1 - pct) : circ;

  return (
    <div
      ref={ref}
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)",
            filter: "drop-shadow(0 0 8px rgba(227,178,60,0.45))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-text-mid text-[0.6rem] uppercase tracking-[0.25em]">
          {label}
        </span>
        {start ? (
          <GaugeNumber value={value} />
        ) : (
          <span className="font-display text-gold-bright text-5xl font-black tabular-nums opacity-30">
            0
          </span>
        )}
      </div>
    </div>
  );
}

function GaugeNumber({ value }: { value: number }) {
  const n = useCountUp(value, 1200);
  return (
    <span
      className="font-display text-gold-bright text-5xl font-black tabular-nums"
      style={{ textShadow: "0 0 24px rgba(227,178,60,0.5)" }}
    >
      {n}
    </span>
  );
}
