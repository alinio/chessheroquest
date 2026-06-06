import type { CSSProperties, ReactNode } from "react";
import { FrameCorner } from "./icons/marks";
import { HERO_ACCENTS, type HeroKey } from "./tokens";

/**
 * The Ornate Gold Frame (art-direction-bible §1.4) — the signature container.
 * 1px gold-gradient border (a 1px gradient pad wrapping a panel) + 4 SVG corner
 * flourishes + inner shadow + faint radial vignette.
 * Variants: gold (default) · hero (border + glow take the hero accent) · locked
 * (dashed, no glow, 55% opacity).
 */
type Variant = "gold" | "hero" | "locked";

function FrameCorners() {
  const base: CSSProperties = { position: "absolute", width: 28, height: 28, pointerEvents: "none" };
  return (
    <div aria-hidden="true">
      <span style={{ ...base, top: 0, left: 0 }}>
        <FrameCorner />
      </span>
      <span style={{ ...base, top: 0, right: 0, transform: "scaleX(-1)" }}>
        <FrameCorner />
      </span>
      <span style={{ ...base, bottom: 0, left: 0, transform: "scaleY(-1)" }}>
        <FrameCorner />
      </span>
      <span style={{ ...base, bottom: 0, right: 0, transform: "scale(-1,-1)" }}>
        <FrameCorner />
      </span>
    </div>
  );
}

export function OrnateFrame({
  variant = "gold",
  hero,
  corners = true,
  className,
  style,
  children,
}: {
  variant?: Variant;
  /** Hero accent for variant="hero". */
  hero?: HeroKey;
  corners?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const radius = "var(--chq-r-frame)";

  if (variant === "locked") {
    return (
      <div
        className={className}
        style={{
          position: "relative",
          borderRadius: radius,
          border: "1.5px dashed var(--chq-locked)",
          background: "var(--chq-panel)",
          opacity: 0.55,
          ...style,
        }}
      >
        {children}
      </div>
    );
  }

  const accent = variant === "hero" && hero ? HERO_ACCENTS[hero] : null;
  const borderBg = accent ? accent.base : "var(--chq-gold-gradient)";
  const glow = accent ? `0 0 22px ${accent.glow}` : "var(--chq-glow-gold)";

  return (
    <div
      className={className}
      style={{
        position: "relative",
        borderRadius: `calc(${radius} + 1px)`,
        padding: 1, // the 1px gradient / accent border
        background: borderBg,
        boxShadow: glow,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          height: "100%",
          borderRadius: radius,
          background: "var(--chq-panel)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.04)",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(120% 80% at 50% 0%, rgba(217,162,39,.05), transparent 60%)",
            pointerEvents: "none",
          }}
        />
        {corners && <FrameCorners />}
        <div style={{ position: "relative" }}>{children}</div>
      </div>
    </div>
  );
}
