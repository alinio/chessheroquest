/**
 * Subtle film-grain overlay (kickoff pass 2 §3/§8) — a tiled SVG fractal-noise
 * data-URI composited at low opacity. Kills the flat "digital" look on panels
 * and dark sections. Pure CSS, no asset, GPU-cheap (static background).
 */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function GrainOverlay({
  opacity = 0.05,
  className = "",
}: {
  opacity?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 [mix-blend-mode:soft-light] ${className}`}
      style={{ backgroundImage: NOISE, opacity }}
    />
  );
}
