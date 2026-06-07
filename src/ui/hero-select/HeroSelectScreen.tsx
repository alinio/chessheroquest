"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, LockIcon } from "@/src/ui/design-system/icons";
import { OrnateFrame } from "@/src/ui/design-system/OrnateFrame";
import { Button } from "@/src/ui/design-system/Button";
import { HERO_ACCENTS } from "@/src/ui/design-system/tokens";
import { BRAND_LOGO, HERO_ART, CREST_ART } from "@/src/ui/design-system/art";
import { WORLDS } from "@/src/domain/recommend/worlds";
import { ARCHETYPES, type Archetype } from "@/src/domain/style-quiz/types";
import { useStyleQuiz } from "@/src/ui/style-quiz/useStyleQuiz";
import { useEntitlement } from "@/src/ui/entitlement/useEntitlement";
import { AccountBoot } from "@/src/ui/account/AccountBoot";
import { track } from "@/src/lib/track";
import { useHeroSelect } from "./useHeroSelect";

function useHydrated() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <GradientDefs />
      <AccountBoot />
      <header style={{ height: 92, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px", borderBottom: "1px solid var(--chq-line)" }}>
        <Image src={BRAND_LOGO} alt="ChessHeroQuest" width={1478} height={418} priority style={{ height: 64, width: "auto" }} />
      </header>
      <main style={{ flex: 1, width: "100%", padding: "20px 0 48px" }}>{children}</main>
    </div>
  );
}

function HeroCard({
  archetype,
  recommended,
  matchPercent,
  isPro,
  onEnter,
  onGoPro,
}: {
  archetype: Archetype;
  recommended: boolean;
  matchPercent: number | null;
  isPro: boolean;
  onEnter: () => void;
  onGoPro: () => void;
}) {
  const accent = HERO_ACCENTS[archetype];
  const world = WORLDS[archetype];
  const firstOpening = world.openings[0]!;

  return (
    <OrnateFrame variant="hero" hero={archetype} corners={false} style={{ width: 300, flexShrink: 0, scrollSnapAlign: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Hero illustration + crest + ribbon */}
        <div style={{ position: "relative", aspectRatio: "1 / 1", width: "100%", overflow: "hidden" }}>
          <Image src={HERO_ART[archetype]} alt={`The ${accent.label}`} fill sizes="300px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--chq-panel) 4%, rgba(13,13,16,.2) 45%, transparent)" }} />
          <div style={{ position: "absolute", left: 12, top: 12, width: 44, height: 44, borderRadius: "50%", border: `1px solid ${accent.border}`, background: "rgba(8,8,10,.7)", display: "grid", placeItems: "center", backdropFilter: "blur(4px)" }}>
            <Image src={CREST_ART[archetype]} alt="" width={40} height={40} style={{ height: 30, width: 30, objectFit: "contain", mixBlendMode: "screen" }} />
          </div>
          {recommended && (
            <span style={{ position: "absolute", right: 12, top: 12, ...eyebrow, fontSize: 9, background: "var(--chq-gold-gradient)", color: "#08080A", padding: "5px 9px", borderRadius: "var(--chq-r-pill)", fontWeight: 700 }}>
              ★ Recommended
            </span>
          )}
        </div>

        {/* Copy */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 16px 16px" }}>
          <h2 className="chq-display" style={{ fontSize: 22, color: accent.base, textTransform: "uppercase", margin: 0 }}>
            The {accent.label}
          </h2>
          <p style={{ ...eyebrow, color: "var(--chq-text-2)", fontSize: 10 }}>{world.name}</p>
          <p style={{ color: "var(--chq-text-2)", fontSize: 13, fontStyle: "italic", margin: 0 }}>{world.tagline}</p>
          {recommended && matchPercent != null && (
            <p style={{ color: "var(--chq-gold-3)", fontSize: 13, fontWeight: 600, margin: 0 }}>{matchPercent}% match with your Chess DNA</p>
          )}

          {/* What you'll train — free vs Pro */}
          <p style={{ ...eyebrow, color: "var(--chq-text-muted)", fontSize: 9, marginTop: 6 }}>Openings in this world</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: 5 }}>
            {world.openings.map((o, i) => {
              const free = i === 0 || isPro;
              return (
                <li key={o.id} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: free ? "var(--chq-text-1)" : "var(--chq-text-muted)", background: "var(--chq-raised)", border: `1px solid ${i === 0 ? accent.border : "var(--chq-line)"}`, borderRadius: "var(--chq-r-pill)", padding: "3px 8px" }}>
                  {o.name}
                  {i === 0 && !isPro && <span style={{ color: accent.base, fontSize: 9, fontWeight: 700 }}>· FREE</span>}
                  {i > 0 && !isPro && <LockIcon size={11} />}
                </li>
              );
            })}
          </ul>

          <div style={{ marginTop: 8, fontSize: 11.5, lineHeight: 1.5 }}>
            <p style={{ margin: 0, color: "var(--chq-text-2)" }}>
              <b style={{ color: accent.base }}>Free</b> · {firstOpening.name}: Learn, Drill &amp; the Opening Guardian
            </p>
            <p style={{ margin: "2px 0 0", color: "var(--chq-text-muted)" }}>
              <b style={{ color: "var(--chq-gold-3)" }}>Pro</b> · all {world.openings.length} openings · Hard mode · unlimited drills · Lichess · analytics
            </p>
          </div>

          <Button variant={recommended ? "primary" : "ghost"} onClick={onEnter} style={{ marginTop: 10 }}>
            Enter {world.name} →
          </Button>
          {!isPro && (
            <button type="button" onClick={onGoPro} style={{ marginTop: 4, background: "transparent", border: 0, color: "var(--chq-text-muted)", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
              or go Pro for everything
            </button>
          )}
        </div>
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
    return <Shell><p style={{ color: "var(--chq-text-muted)", textAlign: "center" }}>Loading…</p></Shell>;
  }

  const recommended = quiz?.primary ?? null;
  const matchPercent = quiz?.matchPercent ?? null;
  const ordered: Archetype[] = recommended ? [recommended, ...ARCHETYPES.filter((a) => a !== recommended)] : [...ARCHETYPES];

  const enter = (a: Archetype) => {
    track("hero_selected", { hero: a });
    selectHero(a);
    router.push("/world");
  };

  return (
    <Shell>
      <div style={{ padding: "8px 20px 0", textAlign: "center", marginBottom: 10, maxWidth: 680, marginInline: "auto" }}>
        <h1 className="chq-display chq-gold-text" style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Choose your Hero</h1>
        <p className="chq-display" style={{ fontSize: 17, color: "var(--chq-text-1)", marginTop: 10, lineHeight: 1.35 }}>
          Stop losing in the opening. Master a battle-tested repertoire, conquer its Guardians, and climb.
        </p>
        <p style={{ ...eyebrow, color: "var(--chq-text-muted)", marginTop: 8 }}>
          {recommended ? "Your Chess DNA points one way — but the choice is yours. Every hero is free to start." : "Pick any hero — the first opening is free."}
        </p>
      </div>

      <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "12px 20px 16px", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", alignItems: "stretch", justifyContent: "center" }}>
        {ordered.map((a) => (
          <HeroCard
            key={a}
            archetype={a}
            recommended={a === recommended}
            matchPercent={a === recommended ? matchPercent : null}
            isPro={isPro}
            onEnter={() => enter(a)}
            onGoPro={() => router.push(`/paywall?hero=${a}`)}
          />
        ))}
      </div>

      {/* Pro pricing band — make the plans visible right here */}
      {!isPro && (
        <div style={{ maxWidth: 560, margin: "20px auto 0", padding: "0 20px" }}>
          <OrnateFrame>
            <div style={{ padding: "18px 20px", textAlign: "center" }}>
              <p className="chq-display chq-gold-text" style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Unlock everything with Pro</p>
              <p style={{ color: "var(--chq-text-2)", fontSize: 12.5, margin: "6px 0 12px" }}>
                All four heroes · every opening · Hard mode · unlimited drills · Lichess · analytics
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 14 }}>
                {[
                  { label: "Monthly", price: "$9.99", per: "/mo" },
                  { label: "Yearly", price: "$79", per: "/yr", badge: "Save 34%" },
                  { label: "Lifetime", price: "$129", per: "once", badge: "Best value" },
                ].map((p) => (
                  <div key={p.label} style={{ background: "var(--chq-raised)", border: `1px solid ${p.badge === "Best value" ? "var(--chq-gold-3)" : "var(--chq-line)"}`, borderRadius: "var(--chq-r-panel)", padding: "8px 12px", minWidth: 92 }}>
                    <div style={{ ...eyebrow, fontSize: 9, color: "var(--chq-text-muted)" }}>{p.label}</div>
                    <div style={{ color: "var(--chq-text-1)", fontWeight: 700, fontSize: 15 }}>{p.price}<span style={{ color: "var(--chq-text-muted)", fontSize: 11, fontWeight: 400 }}> {p.per}</span></div>
                    {p.badge && <div style={{ color: "var(--chq-gold-3)", fontSize: 9, fontWeight: 600, marginTop: 2 }}>{p.badge}</div>}
                  </div>
                ))}
              </div>
              <Button variant="primary" onClick={() => router.push("/paywall")}>Go Pro →</Button>
            </div>
          </OrnateFrame>
        </div>
      )}
    </Shell>
  );
}
