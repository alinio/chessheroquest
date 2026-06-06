import type { LucideIcon } from "lucide-react";

/**
 * Generic UI icons come from lucide (nav, hint, skip, share, settings…), gold-
 * themed. The bespoke marks are drawn by hand (see marks.tsx / parametric.tsx).
 * lucide strokes use currentColor → setting `color` recolors the glyph.
 */
export function Icon({
  icon: Glyph,
  size = 20,
  color = "var(--chq-gold-3)",
  strokeWidth = 1.75,
  className,
}: {
  icon: LucideIcon;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}) {
  return <Glyph size={size} strokeWidth={strokeWidth} className={className} style={{ color }} aria-hidden="true" />;
}
