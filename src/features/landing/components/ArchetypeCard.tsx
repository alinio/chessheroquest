import Image from "next/image";
import type { CSSProperties } from "react";
import { LANDING_ASSETS } from "../assets";
import type { ArchetypeInfo } from "../exampleData";

/**
 * One of the four DNA tribe cards (kickoff §6/§S3). Crest art + the tribe's
 * signature color (DESIGN.md). Crest PNG is on black → `mix-blend-mode: screen`
 * drops the bg over the dark card.
 */
export function ArchetypeCard({ archetype }: { archetype: ArchetypeInfo }) {
  const tint: CSSProperties = { color: archetype.colorVar };

  return (
    <div className="flex flex-col items-center rounded-card border border-hairline bg-surface p-4 text-center">
      <div
        className="relative flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          background: `radial-gradient(circle at center, ${archetype.colorVar}30, transparent 70%)`,
        }}
      >
        <Image
          src={LANDING_ASSETS.crests[archetype.key]}
          alt={`${archetype.label} crest`}
          width={80}
          height={80}
          className="h-16 w-16 object-contain [mix-blend-mode:screen]"
        />
      </div>
      <p className="font-display mt-2 text-sm font-bold" style={tint}>
        {archetype.label}
      </p>
      <p className="mt-0.5 text-xs text-text-mid">{archetype.tagline}</p>
    </div>
  );
}
