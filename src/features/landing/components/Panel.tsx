import type { CSSProperties, ReactNode } from "react";
import { GrainOverlay } from "./GrainOverlay";

/**
 * The ornate RPG panel system (kickoff pass 2 §2 — highest priority). ONE shared
 * card language so nothing reads as a plain SaaS box:
 *  - gradient-gold border (not a flat hairline)
 *  - beveled inner edge + inner gold glow
 *  - gold filigree corner flourishes
 *  - subtle film grain
 *
 * Variants:
 *  - `ornate` — full treatment on a solid surface (kingdom-card feel).
 *  - `glass`  — translucent + backdrop-blur so cinematic shows through (hero).
 *
 * `glow` tints the rim with an archetype color (violet = Strategist, etc.).
 * `interactive` adds hover lift + a faint holographic sheen.
 */
interface PanelProps {
  children: ReactNode;
  variant?: "ornate" | "glass";
  /** Archetype rim glow color (CSS color / var). Defaults to gold. */
  glow?: string;
  interactive?: boolean;
  filigree?: boolean;
  className?: string;
  innerClassName?: string;
}

export function Panel({
  children,
  variant = "ornate",
  glow,
  interactive = false,
  filigree = true,
  className = "",
  innerClassName = "",
}: PanelProps) {
  const rim = glow ?? "var(--color-gold)";
  // color-mix lets the rim be a CSS var (var(--color-strategist)) AND carry alpha,
  // which plain hex-suffix concatenation can't do.
  const mix = (pct: number) => `color-mix(in srgb, ${rim} ${pct}%, transparent)`;

  const surface =
    variant === "glass"
      ? "bg-surface/70 backdrop-blur-xl"
      : "bg-gradient-to-b from-raised/90 to-surface";

  const borderStyle: CSSProperties = {
    background: `linear-gradient(160deg, ${mix(60)}, ${mix(14)} 38%, rgba(46,49,66,0.6) 60%, ${mix(40)})`,
  };

  const glowStyle: CSSProperties = {
    boxShadow: `inset 0 1px 0 rgba(244,206,106,0.28), inset 0 0 36px -14px ${mix(85)}, 0 0 0 1px rgba(0,0,0,0.4)`,
  };

  return (
    <div
      style={borderStyle}
      className={`group relative rounded-card p-[1.5px] shadow-[0_28px_70px_-20px_rgba(0,0,0,0.85)] transition-transform duration-300 ${
        interactive ? "hover:-translate-y-1" : ""
      } ${className}`}
    >
      <div
        className={`relative overflow-hidden rounded-[15px] ${surface} ${innerClassName}`}
      >
        {/* beveled inner edge + inner glow */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[15px]"
          style={glowStyle}
        />
        <GrainOverlay opacity={0.045} />

        {filigree && <FiligreeCorners color={rim} />}

        {/* holographic sheen (hover only) */}
        {interactive && (
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-x-1/2 top-0 h-full -translate-x-1/3 bg-[linear-gradient(115deg,transparent_40%,rgba(244,206,106,0.12)_50%,transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

/** Four gold filigree corner flourishes (one SVG, rotated). */
function FiligreeCorners({ color }: { color: string }) {
  const corner = (
    <svg viewBox="0 0 36 36" className="h-7 w-7" fill="none" aria-hidden>
      <path
        d="M2 16 C2 8 8 2 16 2"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M2 9 C2 5 5 2 9 2"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="3.5" cy="3.5" r="1.4" fill={color} opacity="0.9" />
    </svg>
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <span className="absolute left-1.5 top-1.5">{corner}</span>
      <span className="absolute right-1.5 top-1.5 rotate-90">{corner}</span>
      <span className="absolute bottom-1.5 right-1.5 rotate-180">{corner}</span>
      <span className="absolute bottom-1.5 left-1.5 -rotate-90">{corner}</span>
    </div>
  );
}
