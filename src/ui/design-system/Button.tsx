import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

/**
 * Design-system button (art-direction-bible §1 / §7). Primary = gold gradient on
 * obsidian text (the signature CTA); ghost = hairline-bordered. Min-height 48 for
 * thumb-friendly mobile taps.
 */
type Variant = "primary" | "ghost";

const base: CSSProperties = {
  minHeight: 48,
  padding: "0 24px",
  borderRadius: "var(--chq-r-pill)",
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  border: 0,
};

export function Button({
  variant = "primary",
  children,
  style,
  ...rest
}: { variant?: Variant; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const variantStyle: CSSProperties =
    variant === "primary"
      ? { background: "var(--chq-gold-gradient)", color: "#08080A" }
      : { background: "transparent", color: "var(--chq-text-1)", border: "1px solid var(--chq-line)" };
  return (
    <button {...rest} style={{ ...base, ...variantStyle, ...style }}>
      {children}
    </button>
  );
}
