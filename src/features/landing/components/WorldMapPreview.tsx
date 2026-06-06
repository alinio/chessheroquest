import Image from "next/image";
import { LANDING_ASSETS } from "../assets";
import { KINGDOMS_PREVIEW } from "../exampleData";
import { Panel } from "./Panel";

/**
 * World Map preview (kickoff §6/§S5 + pass 2 §7). Each kingdom is an ornate
 * collectible card framing the 1:1 artwork rendered SQUARE (no crop). Conquered =
 * gold rim + glowing seal; locked = dim + desaturate + a lock and one clarifying
 * line. Hover: lift + subtle 3D tilt.
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
    </ul>
  );
}
