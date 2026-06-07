import Image from "next/image";
import Link from "next/link";
import { LANDING_ASSETS } from "../assets";
import { KINGDOMS_PREVIEW } from "../exampleData";
import { Panel } from "./Panel";
import { CTA_HREF } from "../copy";

/**
 * Openings preview — each opening is an ornate collectible card framing the 1:1
 * castle artwork rendered SQUARE (no crop). Conquered = gold rim + glowing seal;
 * locked = dim + desaturate + a lock and one clarifying line. A final "scope"
 * card backs the 20-opening claim. (Realms are surfaced in the Boss section and
 * the Passport, not mixed onto the opening tiles.)
 */
export function WorldMapPreview() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {KINGDOMS_PREVIEW.map((k) => (
        <li key={k.key}>
          <Panel
            variant="ornate"
            glow={k.conquered ? "var(--color-gold)" : "var(--color-hairline)"}
            interactive
            innerClassName="p-1.5"
          >
            <div className="relative aspect-square overflow-hidden rounded-[12px] transition-transform duration-300 group-hover:[transform:perspective(900px)_rotateX(6deg)]">
              <Image
                src={LANDING_ASSETS.kingdoms[k.key]}
                alt={`${k.name} kingdom`}
                fill
                sizes="(max-width: 640px) 50vw, 220px"
                className={`object-cover transition duration-500 ${
                  k.conquered
                    ? "saturate-100"
                    : "opacity-55 saturate-[0.35] group-hover:opacity-75"
                }`}
              />

              {/* locked: centered lock */}
              {!k.conquered && (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-2xl text-text-hi/70 [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]"
                >
                  🔒
                </span>
              )}

              {/* label + state */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss via-abyss/65 to-transparent p-2 pt-7">
                <p className="font-display text-xs font-semibold text-text-hi">
                  {k.name}
                </p>
                {k.conquered ? (
                  <p className="text-[0.6rem] font-semibold uppercase tracking-wide text-gold animate-[chq-crest-pulse_3s_ease-in-out_infinite]">
                    ★ Conquered
                  </p>
                ) : (
                  <p className="text-[0.58rem] leading-tight text-text-low">
                    Conquer it in training to unlock
                  </p>
                )}
              </div>
            </div>
          </Panel>
        </li>
      ))}

      {/* scope card — backs the "20 openings" claim */}
      <li>
        <Link href={CTA_HREF} className="group block h-full">
          <Panel variant="ornate" interactive innerClassName="h-full p-1.5">
            <div className="flex aspect-square flex-col items-center justify-center rounded-[12px] bg-abyss/50 p-4 text-center">
              <p className="font-display text-3xl font-black text-gold">+15</p>
              <p className="mt-1 font-display text-sm font-bold text-text-hi">
                more openings
              </p>
              <p className="mt-1.5 text-[0.62rem] uppercase tracking-wide text-text-low">
                20 kingdoms · 4 realms
              </p>
              <span className="mt-3 rounded-chip border border-gold/60 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-wide text-gold transition-colors group-hover:bg-gold group-hover:text-abyss">
                Take the test
              </span>
            </div>
          </Panel>
        </Link>
      </li>
    </ul>
  );
}
