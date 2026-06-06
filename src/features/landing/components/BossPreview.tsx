import Image from "next/image";
import { LANDING_ASSETS } from "../assets";

/**
 * Boss Fight preview (kickoff §S5). Coded HUD over an atmospheric kingdom still —
 * a dramatic gate at the end of a kingdom. Age-appropriate epic/noble framing
 * (DESIGN.md): a "Kingdom Boss" with a health bar, no violence.
 */
export function BossPreview() {
  return (
    <div className="relative min-h-[12rem] overflow-hidden rounded-card border border-hairline">
      <Image
        src={LANDING_ASSETS.kingdoms.sicilian}
        alt="Sicilian Defense boss kingdom"
        fill
        sizes="(max-width: 768px) 100vw, 360px"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/50 to-abyss/20" />

      <div className="relative flex flex-col gap-3 p-4">
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

        {/* boss health bar */}
        <div className="h-2 w-full overflow-hidden rounded-chip bg-abyss/80">
          <div
            className="h-full rounded-chip bg-gradient-to-r from-warrior to-gold"
            style={{ width: "62%" }}
          />
        </div>
        <p className="text-[0.65rem] uppercase tracking-wide text-text-mid">
          Beat the boss · earn the seal
        </p>
      </div>
    </div>
  );
}
