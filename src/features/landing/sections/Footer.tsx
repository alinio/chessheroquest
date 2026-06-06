import Link from "next/link";
import { FOOTER } from "../copy";

/**
 * Footer (kickoff §Footer) — dissolve to black. Wordmark + tagline + the four
 * allowed links. NO pricing on this page (LOCKED §11.6).
 */
export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-abyss to-black px-5 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <p className="font-display text-xl font-black tracking-wide text-gold">
          {FOOTER.wordmark}
        </p>
        <p className="text-sm text-text-mid">{FOOTER.tagline}</p>
        <nav className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {FOOTER.links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-text-low transition-colors hover:text-text-hi"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
