import Link from "next/link";
import Image from "next/image";

/**
 * The ChessHeroQuest logo — the real gold emblem (crowned queen in a filigree
 * shield, Higgsfield art) + the gold wordmark. The emblem PNG sits on near-black,
 * so `mix-blend-mode: screen` drops the background over the dark UI (same trick as
 * the crests), keeping the embers for atmosphere. Used in the sticky bar + footer.
 */
export function Wordmark({
  size = "md",
  href = "/",
}: {
  size?: "md" | "lg";
  href?: string;
}) {
  const h = size === "lg" ? 52 : 34;
  const text =
    size === "lg" ? "text-2xl sm:text-3xl" : "text-sm sm:text-lg";

  return (
    <Link
      href={href}
      aria-label="ChessHeroQuest home"
      className="group inline-flex items-center gap-2"
    >
      <Image
        src="/brand/emblem.png"
        alt="ChessHeroQuest"
        width={372}
        height={400}
        priority
        style={{ height: h, width: "auto" }}
        className="shrink-0 object-contain [mix-blend-mode:screen] transition-transform duration-300 group-hover:-translate-y-0.5"
      />
      <span
        className={`font-display font-bold tracking-[0.04em] ${text} bg-gradient-to-b from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent [filter:drop-shadow(0_1px_6px_rgba(227,178,60,0.35))] transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_1px_10px_rgba(244,206,106,0.6))]`}
      >
        ChessHeroQuest
      </span>
    </Link>
  );
}
