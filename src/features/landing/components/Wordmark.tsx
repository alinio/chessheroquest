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
  const emblemH = size === "lg" ? 60 : 38;
  const textH = size === "lg" ? 34 : 22;

  return (
    <Link
      href={href}
      aria-label="ChessHeroQuest home"
      className="group inline-flex items-center gap-2 sm:gap-2.5"
    >
      <Image
        src="/brand/emblem-2.png"
        alt=""
        width={360}
        height={372}
        priority
        style={{ height: emblemH, width: "auto" }}
        className="shrink-0 object-contain transition-transform duration-300 group-hover:-translate-y-0.5"
      />
      <Image
        src="/brand/wordmark-2.png"
        alt="ChessHeroQuest"
        width={854}
        height={165}
        priority
        style={{ height: textH, width: "auto" }}
        className="shrink-0 object-contain"
      />
    </Link>
  );
}
