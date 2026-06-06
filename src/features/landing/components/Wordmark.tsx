import Link from "next/link";

/**
 * The ChessHeroQuest wordmark + crest (premium logo). An inline gold crown
 * emblem (crisp at any size, no asset needed) beside gradient-gold Cinzel type
 * with a soft glow — heraldic and noble per DESIGN.md, not flat text. Used in the
 * sticky bar and the footer.
 */
export function Wordmark({
  size = "md",
  href = "/",
  /** Hide the wordmark text below `sm` (emblem-only) to save room in tight bars. */
  compact = false,
}: {
  size?: "md" | "lg";
  href?: string;
  compact?: boolean;
}) {
  const emblem = size === "lg" ? 34 : 26;
  const text = size === "lg" ? "text-2xl" : "text-base sm:text-lg";

  return (
    <Link
      href={href}
      aria-label="ChessHeroQuest home"
      className="group inline-flex items-center gap-2.5"
    >
      <CrownEmblem px={emblem} />
      <span
        className={`font-display font-bold tracking-[0.04em] ${text} ${
          compact ? "hidden sm:inline" : ""
        } bg-gradient-to-b from-gold-bright via-gold to-gold-deep bg-clip-text text-transparent [filter:drop-shadow(0_1px_6px_rgba(227,178,60,0.35))] transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_1px_10px_rgba(244,206,106,0.6))]`}
      >
        ChessHeroQuest
      </span>
    </Link>
  );
}

/** Heraldic crown — gold gradient with jewels, soft glow. Decorative. */
function CrownEmblem({ px }: { px: number }) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      aria-hidden
      style={{ width: px, height: px }}
    >
      <svg
        viewBox="0 0 32 30"
        width={px}
        height={px}
        className="[filter:drop-shadow(0_2px_6px_rgba(227,178,60,0.5))] transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        <defs>
          <linearGradient id="chq-crown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F4CE6A" />
            <stop offset="0.55" stopColor="#E3B23C" />
            <stop offset="1" stopColor="#9A7A22" />
          </linearGradient>
        </defs>
        {/* crown body */}
        <path
          d="M3 23 L5.2 10 L11 16.5 L16 6 L21 16.5 L26.8 10 L29 23 Z"
          fill="url(#chq-crown)"
          stroke="#F4CE6A"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        {/* base band */}
        <rect
          x="3.5"
          y="22.5"
          width="25"
          height="4.6"
          rx="1.4"
          fill="url(#chq-crown)"
          stroke="#9A7A22"
          strokeWidth="0.5"
        />
        {/* jewels on the points */}
        <circle cx="5.2" cy="9.4" r="1.7" fill="#F4CE6A" />
        <circle cx="16" cy="5.2" r="1.9" fill="#FBE9B4" />
        <circle cx="26.8" cy="9.4" r="1.7" fill="#F4CE6A" />
        {/* center band gem */}
        <circle cx="16" cy="24.8" r="1.3" fill="#0F1015" opacity="0.55" />
      </svg>
    </span>
  );
}
