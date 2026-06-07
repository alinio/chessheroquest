"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, LogoMark, MapNode, Medal, type NodeState } from "@/src/ui/design-system/icons";
import { Button } from "@/src/ui/design-system/Button";
import { HERO_ACCENTS } from "@/src/ui/design-system/tokens";
import { WORLDS } from "@/src/domain/recommend/worlds";
import { WORLD_OPENINGS, WORLD_BOSS_POS, type WorldOpeningMeta } from "@/src/domain/world/openings";
import { type Archetype } from "@/src/domain/style-quiz/types";
import { useHeroSelect } from "@/src/ui/hero-select/useHeroSelect";
import { AccountBoot } from "@/src/ui/account/AccountBoot";
import { useWorldProgress, progressFor } from "./useWorldProgress";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;

export function WorldMapScreen() {
  const router = useRouter();
  const mounted = useHydrated();
  const selectedHero = useHeroSelect((s) => s.selectedHero);
  const progress = useWorldProgress((s) => s.progress);
  const [openId, setOpenId] = useState<string | null>(null);

  if (!mounted) {
    return <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "grid", placeItems: "center", color: "var(--chq-text-muted)" }}>Loading…</div>;
  }

  const archetype: Archetype = selectedHero ?? "warrior";
  const noHero = selectedHero === null;
  const accent = HERO_ACCENTS[archetype];
  const world = WORLDS[archetype];
  const openings = WORLD_OPENINGS[archetype];
  const bossPos = WORLD_BOSS_POS[archetype];

  if (!openings || !bossPos) {
    return (
      <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
        <div>
          <p className="chq-display" style={{ color: accent.base, fontSize: 22 }}>{world.name}</p>
          <p style={{ color: "var(--chq-text-muted)", marginTop: 8 }}>This world isn&apos;t laid out yet. {/* TODO: node maps for other worlds (GDD §11) */}</p>
          <Button onClick={() => router.push("/hero-select")} style={{ marginTop: 16 }}>← Hero Select</Button>
        </div>
      </div>
    );
  }

  const stateFor = (i: number, o: WorldOpeningMeta): NodeState => {
    const p = progressFor(progress, o.id);
    if (p.conquered) return "conquered";
    const prevConquered = i === 0 || progressFor(progress, openings[i - 1]!.id).conquered;
    if (!prevConquered) return "locked";
    return p.linesLearned > 0 ? "inProgress" : "available";
  };

  // First not-conquered, unlocked opening = the "Continue" target.
  const continueOpening = openings.find((o, i) => stateFor(i, o) === "available" || stateFor(i, o) === "inProgress") ?? null;
  const open = openId ? openings.find((o) => o.id === openId) ?? null : null;
  const allConquered = openings.every((o) => progressFor(progress, o.id).conquered);

  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh" }}>
      <GradientDefs />
      <AccountBoot />

      {/* transparent overlay top bar */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, height: 56, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", background: "linear-gradient(180deg, rgba(8,8,10,.85), transparent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LogoMark size={24} />
          <span className="chq-display" style={{ fontSize: 12, color: accent.base, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>{world.name}</span>
        </div>
        <button type="button" onClick={() => router.push("/hero-select")} style={{ background: "transparent", border: 0, color: "var(--chq-text-2)", fontSize: 12, cursor: "pointer" }}>Heroes</button>
      </header>

      {noHero && (
        <p style={{ position: "fixed", top: 56, left: 0, right: 0, zIndex: 10, textAlign: "center", ...eyebrow, color: "var(--chq-gold-3)", fontSize: 10, padding: "4px" }}>
          Sample — no hero selected (defaulting to Warrior)
        </p>
      )}

      {/* Scrollable map */}
      <div style={{ position: "relative", width: "100%", maxWidth: 560, margin: "0 auto" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/art/worlds/world-${archetype}-map.png`} alt="" style={{ width: "100%", display: "block" }} />

        {/* connecting path */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          {openings.map((o, i) => {
            const next = i < openings.length - 1 ? openings[i + 1]! : null;
            const to = next ? next.pos : bossPos;
            const conquered = progressFor(progress, o.id).conquered;
            return <line key={o.id} x1={o.pos.x} y1={o.pos.y} x2={to.x} y2={to.y} stroke={conquered ? "url(#chq-gold)" : "#1C1C22"} strokeWidth={1} strokeLinecap="round" />;
          })}
        </svg>

        {/* opening nodes */}
        {openings.map((o, i) => {
          const st = stateFor(i, o);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => st !== "locked" && setOpenId(o.id)}
              aria-label={`${o.name} — ${st}`}
              style={{ position: "absolute", left: `${o.pos.x}%`, top: `${o.pos.y}%`, transform: "translate(-50%,-50%)", background: "transparent", border: 0, padding: 0, cursor: st === "locked" ? "default" : "pointer" }}
            >
              <MapNode state={st} size={64} progress={progressFor(progress, o.id).drillAccuracy} />
            </button>
          );
        })}

        {/* kingdom boss node */}
        <button
          type="button"
          onClick={() => router.push("/boss?kingdom=1")}
          aria-label="Kingdom Boss"
          style={{ position: "absolute", left: `${bossPos.x}%`, top: `${bossPos.y}%`, transform: "translate(-50%,-50%)", background: "transparent", border: 0, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <MapNode state={allConquered ? "available" : "locked"} size={92} />
          <span style={{ ...eyebrow, fontSize: 9, color: accent.base, marginTop: 2 }}>Kingdom Boss</span>
        </button>
      </div>

      {/* Continue banner */}
      {continueOpening && !open && (
        <button
          type="button"
          onClick={() => setOpenId(continueOpening.id)}
          style={{ position: "fixed", bottom: 16, left: 16, right: 16, zIndex: 10, maxWidth: 528, margin: "0 auto", background: "var(--chq-panel)", border: "1px solid var(--chq-line)", borderRadius: "var(--chq-r-panel)", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
        >
          <span style={{ color: "var(--chq-text-2)", fontSize: 13 }}>
            ▸ Continue: <b style={{ color: "var(--chq-text-1)" }}>{continueOpening.name}</b>
          </span>
          <span style={{ color: accent.base, fontSize: 13 }}>Open →</span>
        </button>
      )}

      {/* Opening Node panel (bottom sheet) */}
      {open && (
        <OpeningPanel
          opening={open}
          progress={progressFor(progress, open.id)}
          accent={accent.base}
          onClose={() => setOpenId(null)}
          router={router}
        />
      )}
    </div>
  );
}

function OpeningPanel({
  opening,
  progress,
  accent,
  onClose,
  router,
}: {
  opening: WorldOpeningMeta;
  progress: { masteryTier: "none" | "bronze" | "silver" | "gold"; conquered: boolean };
  accent: string;
  onClose: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const q = `?opening=${opening.id}`;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 30, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)" }} aria-hidden="true" />
      <div style={{ position: "relative", maxWidth: 560, width: "100%", margin: "0 auto", background: "var(--chq-panel)", border: "1px solid var(--chq-line)", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 28 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {/* tile (art if present, else coded fallback) */}
          {opening.tileArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={opening.tileArt} alt="" width={72} height={72} style={{ borderRadius: 12, objectFit: "cover" }} />
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: 12, background: `radial-gradient(circle at 50% 35%, ${accent}, var(--chq-panel) 80%)`, border: `1px solid ${accent}`, display: "grid", placeItems: "center" }}>
              <LogoMark size={30} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h2 className="chq-display" style={{ fontSize: 20, color: "var(--chq-text-1)", margin: 0 }}>{opening.name}</h2>
            <p style={{ ...eyebrow, color: "var(--chq-text-muted)", marginTop: 4 }}>
              {opening.eco} · {opening.side === "white" ? "White" : "Black"}
            </p>
          </div>
          {progress.masteryTier !== "none" && <Medal tier={progress.masteryTier} size={36} />}
        </div>

        <p style={{ color: "var(--chq-text-2)", fontSize: 14, lineHeight: 1.5, margin: "14px 0 6px" }}>{opening.description}</p>

        {!opening.playable && (
          <p style={{ ...eyebrow, color: "var(--chq-gold-3)", fontSize: 10, marginBottom: 10 }}>
            Lines not curated yet {/* TODO: full line tree pending (GDD §11) */}
          </p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
          <Button variant="primary" disabled={!opening.playable} onClick={() => router.push(`/world/learn${q}`)}>Learn</Button>
          <Button variant="ghost" disabled={!opening.playable} onClick={() => router.push(`/world/drill${q}`)}>Drill</Button>
          <Button variant="ghost" disabled={!opening.playable} onClick={() => router.push(`/boss${q}`)} style={{ gridColumn: "1 / -1" }}>
            Boss — Opening Guardian
          </Button>
        </div>

        <button type="button" onClick={onClose} style={{ width: "100%", marginTop: 14, background: "transparent", border: 0, color: "var(--chq-text-muted)", fontSize: 13, cursor: "pointer" }}>Close</button>
      </div>
    </div>
  );
}
