import Image from "next/image";
import { LANDING_ASSETS } from "../assets";
import { Panel } from "./Panel";

/**
 * Boss Fight preview (kickoff §S5 + pass 2 §7). Ornate panel framing an
 * atmospheric kingdom still with a coded HUD — a dramatic gate at the end of a
 * kingdom. Age-appropriate epic/noble framing (DESIGN.md), no violence. One
 * clarifying line keeps it a teaser.
 */
export function BossPreview() {
  return (
    <Panel variant="ornate" interactive innerClassName="h-full">
      <div className="relative min-h-[12rem] overflow-hidden rounded-[15px]">
        <Image
          src={LANDING_ASSETS.kingdoms.sicilian}
          alt="Sicilian Defense boss kingdom"
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/55 to-abyss/20" />

        <div className="relative flex flex-col gap-2.5 p-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-[0.62rem] uppercase tracking-[0.3em] text-warrior">
              Kingdom Boss
            </p>
            <span className="rounded-chip border border-warrior/60 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-warrior">
              Sicilian
            </span>
          </div>

          <p className="font-display text-lg font-bold text-text-hi">
            The Dragon Variation
          </p>
          <p className="text-xs leading-snug text-text-mid">
            Each opening&apos;s toughest variation — beat it to conquer the
            kingdom.
          </p>

          {/* boss health bar */}
          <div className="mt-0.5 h-2 w-full overflow-hidden rounded-chip bg-abyss/80">
            <div
              className="h-full rounded-chip bg-gradient-to-r from-warrior to-gold"
              style={{ width: "62%" }}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}
