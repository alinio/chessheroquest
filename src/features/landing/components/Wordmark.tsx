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
  // Responsive height — clearly bigger than before; mobile kept a touch smaller
  // so the scrolled sticky bar (logo + CTA) still fits a phone.
  // Desktop: header matches the footer (h-32). Mobile: header stays small so the
  // logo + CTA fit a phone bar; the footer (alone, centered) can be larger.
  const h = size === "lg" ? "h-24 sm:h-32" : "h-11 sm:h-32";

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
        className={`${h} w-auto object-contain transition-transform duration-300 group-hover:-translate-y-0.5`}
      />
    </Link>
  );
}
