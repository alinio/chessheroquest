import Image from "next/image";
import { LANDING_ASSETS } from "../assets";
import type { ArchetypeInfo } from "../exampleData";
import { Panel } from "./Panel";

/**
 * Archetype tribe card (Round 2 §3). The Higgsfield illustration is the card's
 * hero image (top), the circular crest sits as a small badge, and the copy is
 * high-contrast: title in the tribe accent, sub mid-light, description near-white
 * for readability. Accent rim follows the tribe color.
 */
export function ArchetypeCard({ archetype }: { archetype: ArchetypeInfo }) {
  return (
    <Panel
      variant="ornate"
      glow={archetype.colorVar}
      interactive
      filigree={false}
      innerClassName="flex h-full flex-col overflow-hidden"
    >
      {/* illustration hero + crest badge */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={LANDING_ASSETS.archetypeArt[archetype.key]}
          alt={`${archetype.label} illustration`}
          fill
          sizes="(max-width: 640px) 50vw, 260px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
        <div
          className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border bg-abyss/70 backdrop-blur-sm"
          style={{ borderColor: archetype.colorVar }}
        >
          <Image
            src={LANDING_ASSETS.crests[archetype.key]}
            alt=""
            width={40}
            height={40}
            className="h-8 w-8 object-contain [mix-blend-mode:screen]"
          />
        </div>
      </div>

      {/* copy */}
      <div className="flex flex-1 flex-col p-4">
        <h3
          className="font-display text-base font-bold"
          style={{ color: archetype.colorVar }}
        >
          {archetype.label}
        </h3>
        <p className="mt-0.5 text-[0.8rem] font-medium text-text-mid">
          {archetype.tagline}
        </p>
        <p className="mt-2 text-[0.92rem] leading-snug text-[#E9E9EE]">
          {archetype.blurb}
        </p>
      </div>
    </Panel>
  );
}
