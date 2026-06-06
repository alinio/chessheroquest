/**
 * Parametric marks — value-driven versions of the svg-icon-kit DYNAMIC items.
 * Geometry/maths transcribed from the kit; the spec IS the geometry.
 * Reference <GradientDefs/> (mount once per page). Server-component safe.
 */
import { GOLD_GLOW } from "./GradientDefs";
import { NodeLocked, NodeAvailable, NodeConquered } from "./marks";
import { IQ_MAX } from "../tokens";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/* ── Map node (all 4 states; in-progress draws a parametric arc) ──────────── */

export type NodeState = "locked" | "available" | "inProgress" | "conquered";

export function MapNode({
  state,
  progress = 0,
  size = 76,
  pulse = true,
  className,
}: {
  state: NodeState;
  /** 0–1, only used for `inProgress`. */
  progress?: number;
  size?: number;
  pulse?: boolean;
  className?: string;
}) {
  if (state === "locked") return <NodeLocked size={size} className={className} />;
  if (state === "conquered") return <NodeConquered size={size} className={className} />;
  if (state === "available") {
    return <NodeAvailable size={size} className={[pulse && "chq-pulse", className].filter(Boolean).join(" ")} />;
  }

  // in progress — progress arc (kit: r=30, stroke 4, rotate -90 so it starts at top)
  const C = 2 * Math.PI * 30; // ≈ 188.5
  const filled = clamp01(progress) * C;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className={className} role="img" aria-label={`In progress ${Math.round(clamp01(progress) * 100)}%`}>
      <circle cx="40" cy="40" r="30" fill="#14141A" stroke="#1C1C22" strokeWidth="4" />
      <circle
        cx="40"
        cy="40"
        r="30"
        fill="none"
        stroke="url(#chq-gold)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${C - filled}`}
        transform="rotate(-90 40 40)"
      />
      <path fill="#A7A7B2" d="M40 28 a4 4 0 1 0 .01 0 Z M34 52 c0-5 3-8 6-8 s6 3 6 8 Z" />
    </svg>
  );
}

/* ── Opening IQ gauge (270° arc, fills value/1000) ───────────────────────── */

export function OpeningIQGauge({
  value,
  size = 120,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const C = 2 * Math.PI * 50; // ≈ 314.16
  const TRACK = (270 / 360) * C; // ≈ 235.6 (the open 270° arc)
  const v = Math.max(0, Math.min(IQ_MAX, Math.round(value)));
  const fill = (v / IQ_MAX) * TRACK;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} role="img" aria-label={`Opening IQ ${v} of ${IQ_MAX}`}>
      <circle cx="60" cy="60" r="50" fill="none" stroke="#1C1C22" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${TRACK} ${C}`} transform="rotate(135 60 60)" />
      <circle cx="60" cy="60" r="50" fill="none" stroke="url(#chq-gold)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${fill} ${C}`} transform="rotate(135 60 60)" />
      <text x="60" y="62" textAnchor="middle" fontFamily="var(--font-cinzel), serif" fontWeight="700" fontSize="30" fill="#F3CF77">
        {v}
      </text>
      <text x="60" y="80" textAnchor="middle" fontFamily="var(--font-inter), sans-serif" fontSize="10" letterSpacing="2" fill="#A7A7B2">
        IQ
      </text>
    </svg>
  );
}

/* ── Progress / XP bar (gold fill = %) ───────────────────────────────────── */

export function ProgressBar({
  value,
  height = 14,
  className,
  ariaLabel,
}: {
  /** 0–1. */
  value: number;
  height?: number;
  className?: string;
  ariaLabel?: string;
}) {
  const pct = clamp01(value);
  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 240 14"
      preserveAspectRatio="none"
      className={className}
      role="img"
      aria-label={ariaLabel ?? `${Math.round(pct * 100)}%`}
    >
      <rect x="1" y="1" width="238" height="12" rx="6" fill="#14141A" stroke="#1C1C22" />
      <rect x="2" y="2" width={236 * pct} height="10" rx="5" fill="url(#chq-gold)" />
    </svg>
  );
}

/* ── Streak flame (active / at-risk / broken) + optional day count ───────── */

export type FlameState = "active" | "risk" | "broken";

const FLAME_D =
  "M13 1 C9 7 6 10 8 17 a6.5 6.5 0 0 0 12 1 c1-4-1-7-2-9 c-1.5 3-3 2.5-3.5 .5 C13.5 6 14 3.5 13 1 Z";

export function StreakFlame({
  state = "active",
  count,
  size = 30,
  className,
}: {
  state?: FlameState;
  count?: number;
  size?: number;
  className?: string;
}) {
  const pathProps =
    state === "active"
      ? { fill: "url(#chq-gold)" }
      : state === "risk"
        ? { fill: "none", stroke: "#6E6E78", strokeWidth: 1.6 }
        : { fill: "#3A3A44" };
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <svg
        width={size}
        height={(size * 30) / 24}
        viewBox="0 0 24 30"
        style={state === "active" ? { filter: GOLD_GLOW } : undefined}
        aria-hidden="true"
      >
        <path {...pathProps} d={FLAME_D} />
      </svg>
      {count != null && (
        <span
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontWeight: 700,
            fontSize: 16,
            color: state === "active" ? "#F3CF77" : "#6E6E78",
          }}
        >
          {count}
        </span>
      )}
    </span>
  );
}
