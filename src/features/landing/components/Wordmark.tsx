import Link from "next/link";
import Image from "next/image";

/**
 * The ChessHeroQuest logo — the FULL brand lockup as real art: the gold emblem
 * (crowned queen in a filigree shield) + the rendered gold "ChessHeroQuest"
 * wordmark, both cropped from the brand render. Backgrounds are crushed to pure
 * black, so `mix-blend-mode: screen` drops them over the dark UI (no coded text).
 * Used in the sticky header + footer.
 */
export function Wordmark({
  size = "md",
  href = "/",
}: {
  size?: "md" | "lg";
  href?: string;
}) {
  // Emblem sits a touch taller than the wordmark cap-height (matches the brand
  // lockup); both vertically centered so the icon and text align.
  const emblemH = size === "lg" ? 84 : 56;
  const textH = size === "lg" ? 50 : 34;

  return (
    <Link
      href={href}
      aria-label="ChessHeroQuest home"
      className="group inline-flex items-center gap-2 sm:gap-2.5"
    >
      <Image
        src="/brand/emblem-3.png"
        alt=""
        width={372}
        height={386}
        priority
        style={{ height: emblemH, width: "auto" }}
        className="shrink-0 object-contain transition-transform duration-300 group-hover:-translate-y-0.5"
      />
      <Image
        src="/brand/wordmark-3.png"
        alt="ChessHeroQuest"
        width={856}
        height={132}
        priority
        // descender (Q tail) pads the box bottom → nudge up a hair to center on caps
        style={{ height: textH, width: "auto", marginTop: -2 }}
        className="shrink-0 object-contain"
      />
    </Link>
  );
}
