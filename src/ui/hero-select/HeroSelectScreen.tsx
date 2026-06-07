"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, LockIcon } from "@/src/ui/design-system/icons";
import { OrnateFrame } from "@/src/ui/design-system/OrnateFrame";
import { HERO_ACCENTS } from "@/src/ui/design-system/tokens";
import { BRAND_LOGO, HERO_ART, CREST_ART } from "@/src/ui/design-system/art";
import { WORLDS } from "@/src/domain/recommend/worlds";
import { ARCHETYPES, type Archetype } from "@/src/domain/style-quiz/types";
import { useStyleQuiz } from "@/src/ui/style-quiz/useStyleQuiz";
import { useEntitlement } from "@/src/ui/entitlement/useEntitlement";
import { AccountBoot } from "@/src/ui/account/AccountBoot";
import { track } from "@/src/lib/track";
import { useHeroSelect } from "./useHeroSelect";

type Tier = "free" | "premium";
type PlanKey = "monthly" | "yearly" | "lifetime";

const PLANS: Record<PlanKey, { label: string; price: string; per: string; short: string; badge?: string }> = {
  monthly: { label: "Monthly", price: "$9.99", per: "/mo", short: "$9.99/mo" },
  yearly: { label: "Yearly", price: "$79", per: "/yr", short: "$79/yr", badge: "Save 34%" },
  lifetime: { label: "Lifetime", price: "$129", per: "once", short: "$129", badge: "Best value" },
};

function useHydrated() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;
const cleanLabel = (a: Archetype) => HERO_ACCENTS[a].label.replace("Aggressive ", "");

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={`chq-root chq-checker ${inter.variable}`} style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <GradientDefs />
      <AccountBoot />
      <header style={{ height: 92, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px", borderBottom: "1px solid var(--chq-line)" }}>
        <Image src={BRAND_LOGO} alt="ChessHeroQuest" width={1478} height={418} priority style={{ height: 64, width: "auto" }} />
      </header>
      <main style={{ flex: 1, width: "100%", padding: "20px 0 56px" }}>{children}</main>
    </div>
  );
}

function Bullet({ children, color, locked }: { children: ReactNode; color: string; locked?: boolean }) {
  return (
    <p style={{ margin: "5px 0 0", fontSize: 12, color: locked ? "var(--chq-text-muted)" : "var(--chq-text-1)", lineHeight: 1.4, display: "flex", gap: 6, alignItems: "flex-start" }}>
      {locked ? <LockIcon size={12} /> : <span style={{ color, flexShrink: 0 }}>✓</span>}
      <span>{children}</span>
    </p>
  );
}

function HeroCard({
  archetype,
  recommended,
  matchPercent,
  tier,
  planShort,
  onEnter,
  onGoPremium,
}: {
  archetype: Archetype;
  recommended: boolean;
  matchPercent: number | null;
  tier: Tier;
  planShort: string;
  onEnter: () => void;
  onGoPremium: () => void;
}) {
  const accent = HERO_ACCENTS[archetype];
  const world = WORLDS[archetype];
  const first = world.openings[0]!;
  const premium = tier === "premium";

  return (
    <OrnateFrame variant="hero" hero={archetype} corners={false} style={{ width: 300, flexShrink: 0, scrollSnapAlign: "center", display: "flex" }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ position: "relative", aspectRatio: "1 / 1", width: "100%", overflow: "hidden" }}>
          <Image src={HERO_ART[archetype]} alt={`The ${cleanLabel(archetype)}`} fill sizes="300px" style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--chq-panel) 4%, rgba(13,13,16,.15) 45%, transparent)" }} />
          <div style={{ position: "absolute", left: 12, top: 12, width: 44, height: 44, borderRadius: "50%", border: `1px solid ${accent.border}`, background: "rgba(8,8,10,.7)", display: "grid", placeItems: "center", backdropFilter: "blur(4px)" }}>
            <Image src={CREST_ART[archetype]} alt="" width={40} height={40} style={{ height: 30, width: 30, objectFit: "contain", mixBlendMode: "screen" }} />
          </div>
          {recommended && (
            <span style={{ position: "absolute", right: 12, top: 12, ...eyebrow, fontSize: 9, background: "var(--chq-gold-gradient)", color: "#08080A", padding: "5px 9px", borderRadius: "var(--chq-r-pill)", fontWeight: 700 }}>★ Recommended</span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: "0 16px 16px", flex: 1 }}>
          <h2 className="chq-display" style={{ fontSize: 22, color: accent.base, textTransform: "uppercase", margin: 0 }}>The {cleanLabel(archetype)}</h2>
          <p style={{ ...eyebrow, color: "var(--chq-text-2)", fontSize: 10 }}>{world.name}</p>
          <p style={{ color: "var(--chq-text-2)", fontSize: 13, fontStyle: "italic", margin: 0 }}>{world.tagline}</p>
          {recommended && matchPercent != null && (
            <p style={{ color: "var(--chq-gold-3)", fontSize: 13, fontWeight: 600, margin: 0 }}>{matchPercent}% match with your Chess DNA</p>
          )}

          <p style={{ ...eyebrow, color: "var(--chq-text-muted)", fontSize: 9, marginTop: 6 }}>Master this repertoire</p>
          <p style={{ fontSize: 12, color: "var(--chq-text-2)", margin: 0, lineHeight: 1.45 }}>{world.openings.map((o) => o.name).join(" · ")}</p>

          {/* Benefits adapt to the Free/Premium toggle */}
          <div style={{ marginTop: 8, flex: 1 }}>
            {premium ? (
              <>
                <Bullet color={accent.base}>Master all {world.openings.length} {world.name} openings — a complete repertoire</Bullet>
                <Bullet color={accent.base}>Raise your win rate — stop getting crushed out of the opening</Bullet>
                <Bullet color="var(--chq-gold-3)">Boost your ELO with drills that actually stick (spaced repetition)</Bullet>
                <Bullet color="var(--chq-gold-3)">Level up faster — all 4 heroes &amp; worlds + Hard mode</Bullet>
                <Bullet color="var(--chq-gold-3)">Train on your real games (Lichess) + weakness analytics</Bullet>
              </>
            ) : (
              <>
                <Bullet color={accent.base}>{first.name}: full Learn, Drill &amp; the Opening Guardian</Bullet>
                <Bullet color={accent.base}>Your Opening IQ + shareable Chess DNA card</Bullet>
                <Bullet color={accent.base} locked>+ {world.openings.length - 1} more openings, Hard mode, unlimited drills</Bullet>
                <Bullet color={accent.base} locked>Lichess sync &amp; weakness analytics — boost your ELO</Bullet>
              </>
            )}
          </div>

          {premium ? (
            <button type="button" className="chq-cta" onClick={onGoPremium} style={{ marginTop: 12, width: "100%" }}>
              Go Premium · {planShort} →
            </button>
          ) : (
            <button type="button" className="chq-cta" onClick={onEnter} style={{ marginTop: 12, width: "100%" }}>
              Start free · {cleanLabel(archetype)} →
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
  const [tier, setTier] = useState<Tier>("free");
  const [plan, setPlan] = useState<PlanKey>("yearly");

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
  const goPremium = (a: Archetype) => router.push(`/paywall?hero=${a}&plan=${plan}`);

  return (
    <Shell>
      <div style={{ padding: "8px 20px 0", textAlign: "center", maxWidth: 680, marginInline: "auto" }}>
        <h1 className="chq-display chq-gold-text" style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Choose your Hero</h1>
        <p className="chq-display" style={{ fontSize: 17, color: "var(--chq-text-1)", marginTop: 10, lineHeight: 1.35 }}>
          Master a real repertoire, raise your win rate, and climb the ranks.
        </p>
        <p style={{ ...eyebrow, color: "var(--chq-text-muted)", marginTop: 8 }}>
          {recommended ? "Your Chess DNA points one way — but the choice is yours. Every hero is free to start." : "Pick any hero — the first opening is free."}
        </p>
      </div>

      {/* Free / Premium toggle */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <div className="chq-seg" role="tablist" aria-label="Free or Premium">
          <button type="button" data-active={tier === "free"} onClick={() => setTier("free")}>Free</button>
          <button type="button" data-active={tier === "premium"} onClick={() => setTier("premium")}>Premium</button>
        </div>
      </div>

      {/* Plan toggle (premium only) */}
      {tier === "premium" && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          <div className="chq-seg" role="tablist" aria-label="Billing plan">
            {(Object.keys(PLANS) as PlanKey[]).map((k) => (
              <button key={k} type="button" data-active={plan === k} onClick={() => setPlan(k)}>
                {PLANS[k].label} · {PLANS[k].price}{PLANS[k].badge ? "" : ""}
              </button>
            ))}
          </div>
        </div>
      )}
      {tier === "premium" && PLANS[plan].badge && (
        <p style={{ textAlign: "center", marginTop: 8, ...eyebrow, fontSize: 10, color: "var(--chq-gold-3)" }}>{PLANS[plan].label}: {PLANS[plan].price} {PLANS[plan].per} · {PLANS[plan].badge}</p>
      )}

      <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "16px 20px", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", alignItems: "stretch", justifyContent: "center" }}>
        {ordered.map((a) => (
          <HeroCard
            key={a}
            archetype={a}
            recommended={a === recommended}
            matchPercent={a === recommended ? matchPercent : null}
            tier={isPro ? "premium" : tier}
            planShort={PLANS[plan].short}
            onEnter={() => enter(a)}
            onGoPremium={() => goPremium(a)}
          />
        ))}
      </div>
    </Shell>
  );
}
