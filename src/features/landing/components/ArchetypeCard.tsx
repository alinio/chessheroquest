import type { ArchetypeInfo } from "../exampleData";
import { Panel } from "./Panel";
import { AnimatedCrest } from "./AnimatedCrest";

/**
 * One of the four DNA tribe cards (kickoff §6/§S3 + pass 2 §2/§5). Ornate RPG
 * panel, crest art with a slow glow pulse, the tribe's signature color, the
 * punchy tagline, and a one-line plain-language blurb. Crest PNG is on black →
 * `mix-blend-mode: screen` drops the bg over the dark card.
 */
export function ArchetypeCard({ archetype }: { archetype: ArchetypeInfo }) {
  return (
    <Panel
      variant="ornate"
      glow={archetype.colorVar}
      interactive
      innerClassName="flex h-full flex-col items-center p-4 text-center"
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full animate-[chq-crest-pulse_5s_ease-in-out_infinite]"
          style={{
            background: `radial-gradient(circle at center, ${archetype.colorVar}40, transparent 70%)`,
          }}
        />
        <AnimatedCrest
          archetype={archetype.key}
          size={64}
          className="relative h-16 w-16"
        />
      </div>
      <p
        className="font-display mt-2 text-sm font-bold"
        style={{ color: archetype.colorVar }}
      >
        {archetype.label}
      </p>
      <p className="mt-0.5 text-xs font-medium text-text-mid">
        {archetype.tagline}
      </p>
      <p className="mt-2 text-[0.72rem] leading-snug text-text-low">
        {archetype.blurb}
      </p>
    </Panel>
  );
}
