"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, LogoMark, LockIcon } from "@/src/ui/design-system/icons";
import { OrnateFrame } from "@/src/ui/design-system/OrnateFrame";
import { Button } from "@/src/ui/design-system/Button";
import { HERO_ACCENTS } from "@/src/ui/design-system/tokens";
import { WORLDS } from "@/src/domain/recommend/worlds";
import { ARCHETYPES, type Archetype } from "@/src/domain/style-quiz/types";
import { useStyleQuiz } from "@/src/ui/style-quiz/useStyleQuiz";
import { useEntitlement } from "@/src/ui/entitlement/useEntitlement";
import { useHeroSelect } from "./useHeroSelect";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const cleanLabel = (a: Archetype) => HERO_ACCENTS[a].label.replace("Aggressive ", "");
const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <GradientDefs />
      <header style={{ height: 56, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 20px", borderBottom: "1px solid var(--chq-line)" }}>
        <LogoMark size={26} />
        <span className="chq-display chq-gold-text" style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>
          Choose your Hero
        </span>
      </header>
      <main style={{ flex: 1, width: "100%", padding: "20px 0 40px" }}>{children}</main>
    </div>
  );
}

function HeroCard({
  archetype,
  recommended,
  matchPercent,
  unlocked,
  onSelect,
  onLocked,
}: {
  archetype: Archetype;
  recommended: boolean;
  matchPercent: number | null;
  unlocked: boolean;
  onSelect: () => void;
  onLocked: () => void;
}) {
  const accent = HERO_ACCENTS[archetype];
  const world = WORLDS[archetype];
  return (
    <OrnateFrame
      variant={unlocked ? "hero" : "locked"}
      hero={archetype}
      style={{ width: 280, flexShrink: 0, scrollSnapAlign: "center" }}
    >
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Hero art — coded fallback. TODO: real art public/art/heroes/hero-{archetype}.webp */}
        <div
          style={{
            aspectRatio: "3 / 4",
            borderRadius: "var(--chq-r-panel)",
            background: `radial-gradient(circle at 50% 32%, ${accent.base}, var(--chq-panel) 80%)`,
            border: `1px solid ${accent.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div style={{ width: 88, height: 88, borderRadius: "50%", background: "rgba(8,8,10,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogoMark size={44} />
          </div>
          {recommended && (
            <span style={{ position: "absolute", top: 10, left: 10, ...eyebrow, fontSize: 9, background: "var(--chq-gold-gradient)", color: "#08080A", padding: "4px 8px", borderRadius: "var(--chq-r-pill)", fontWeight: 700 }}>
              Recommended
            </span>
          )}
          {!unlocked && (
            <span style={{ position: "absolute", top: 10, right: 10, ...eyebrow, fontSize: 9, background: "var(--chq-raised)", color: "var(--chq-gold-3)", padding: "4px 8px", borderRadius: "var(--chq-r-pill)", border: "1px solid var(--chq-line)" }}>
              Pro
            </span>
          )}
        </div>

        <h2 className="chq-display" style={{ fontSize: 20, color: accent.base, textTransform: "uppercase", margin: 0 }}>
          The {cleanLabel(archetype)}
        </h2>
        <p style={{ ...eyebrow, color: "var(--chq-text-2)", fontSize: 11 }}>{world.name}</p>
        <p style={{ color: "var(--chq-text-2)", fontSize: 13, fontStyle: "italic", margin: 0 }}>{world.tagline}</p>

        {recommended && matchPercent != null && (
          <p style={{ color: "var(--chq-gold-3)", fontSize: 13, fontWeight: 600 }}>★ {matchPercent}% match</p>
        )}

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {world.openings.map((o) => (
            <li key={o.id} style={{ fontSize: 11, color: "var(--chq-text-2)", background: "var(--chq-raised)", border: "1px solid var(--chq-line)", borderRadius: "var(--chq-r-pill)", padding: "3px 8px" }}>
              {o.name}
            </li>
          ))}
        </ul>

        {unlocked ? (
          <Button variant="primary" onClick={onSelect} style={{ marginTop: 6 }}>
            Enter {world.name} →
          </Button>
        ) : (
          <Button variant="ghost" onClick={onLocked} style={{ marginTop: 6 }}>
            <LockIcon size={16} /> Unlock with Pro
          </Button>
        )}
      </div>
    </OrnateFrame>
  );
}

export function HeroSelectScreen() {
  const router = useRouter();
  const mounted = useHydrated();
  const quiz = useStyleQuiz((s) => s.result);
  const isPro = useEntitlement((s) => s.isPro);
  const selectHero = useHeroSelect((s) => s.selectHero);

  if (!mounted) {
    return (
      <Shell>
        <p style={{ color: "var(--chq-text-muted)", textAlign: "center" }}>Loading…</p>
      </Shell>
    );
  }

  const recommended = quiz?.primary ?? null;
  const matchPercent = quiz?.matchPercent ?? null;

  // Recommended first, then the rest in canonical order.
  const ordered: Archetype[] = recommended
    ? [recommended, ...ARCHETYPES.filter((a) => a !== recommended)]
    : [...ARCHETYPES];

  const choose = (a: Archetype) => {
    selectHero(a);
    router.push("/world");
  };

  return (
    <Shell>
      <div style={{ padding: "0 20px", textAlign: "center", marginBottom: 16 }}>
        <p style={{ ...eyebrow, color: "var(--chq-text-muted)" }}>
          {recommended ? "Recommended for your Chess DNA" : "No DNA yet — choose any hero free (sample)"}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          padding: "4px 20px 12px",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {ordered.map((a) => {
          // Free = the recommended hero; Pro unlocks all. No M3 → all free (flagged).
          const unlocked = isPro || recommended === null || a === recommended;
          return (
            <HeroCard
              key={a}
              archetype={a}
              recommended={a === recommended}
              matchPercent={a === recommended ? matchPercent : null}
              unlocked={unlocked}
              onSelect={() => choose(a)}
              onLocked={() => router.push(`/paywall?hero=${a}`)}
            />
          );
        })}
      </div>

      <p style={{ color: "var(--chq-text-muted)", fontSize: 12, textAlign: "center", padding: "12px 20px 0" }}>
        Your hero is free. Unlock the other three (and Hard mode) with Pro.
      </p>
    </Shell>
  );
}
