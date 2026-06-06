import Link from "next/link";
import Image from "next/image";

/**
 * The ChessHeroQuest logo — the original full brand lockup (emblem + gold
 * wordmark) as ONE image, luma-keyed to transparency and auto-trimmed so the
 * emblem/text alignment is exactly as designed (no crop, no offset). Height-
 * controlled. Used in the sticky header + footer.
 */
export function Wordmark({
  size = "md",
  href = "/",
}: {
  size?: "md" | "lg";
  href?: string;
}) {
  const h = size === "lg" ? 50 : 38;

  return (
    <Link
      href={href}
      aria-label="ChessHeroQuest home"
      className="group inline-flex shrink-0 items-center"
    >
      <Image
        src="/brand/logo.png"
        alt="ChessHeroQuest"
        width={1478}
        height={418}
        priority
        style={{ height: h, width: "auto" }}
        className="object-contain transition-transform duration-300 group-hover:-translate-y-0.5"
      />
    </Link>
  );
}
