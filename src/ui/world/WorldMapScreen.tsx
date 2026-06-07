"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, LogoMark, MapNode, Medal, type NodeState } from "@/src/ui/design-system/icons";
import { Button } from "@/src/ui/design-system/Button";
import { HERO_ACCENTS } from "@/src/ui/design-system/tokens";
import { BRAND_LOGO, WORLD_MAP, KINGDOM_TILE, CREST_ART } from "@/src/ui/design-system/art";
import { WORLDS } from "@/src/domain/recommend/worlds";
import { WORLD_OPENINGS, WORLD_BOSS_POS, type WorldOpeningMeta } from "@/src/domain/world/openings";
import { type Archetype } from "@/src/domain/style-quiz/types";
import { useHeroSelect } from "@/src/ui/hero-select/useHeroSelect";
import { AccountBoot } from "@/src/ui/account/AccountBoot";
import { useWorldProgress, progressFor } from "./useWorldProgress";

const MAP_W = 400; // framed portrait map column

function useHydrated() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;

export function WorldMapScreen() {
  const router = useRouter();
  const mounted = useHydrated();
  const selectedHero = useHeroSelect((s) => s.selectedHero);
  const progress = useWorldProgress((s) => s.progress);
  const [openId, setOpenId] = useState<string | null>(null);
  const [dismissedIntro, setDismissedIntro] = useState(false);

  if (!mounted) {
    return <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "grid", placeItems: "center", color: "var(--chq-text-muted)" }}>Loading…</div>;
  }

  const archetype: Archetype = selectedHero ?? "warrior";
  const noHero = selectedHero === null;
  const accent = HERO_ACCENTS[archetype];
  const world = WORLDS[archetype];
  const openings = WORLD_OPENINGS[archetype];
  const bossPos = WORLD_BOSS_POS[archetype];

  // Worlds beyond the seed aren't laid out — show a themed "realm awaits" gate.
  if (!openings || !bossPos) {
    return (
      <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", position: "relative", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
        <GradientDefs />
        <div aria-hidden="true" style={{ position: "fixed", inset: 0 }}>
          <Image src={WORLD_MAP[archetype]} alt="" fill sizes="100vw" style={{ objectFit: "cover", opacity: 0.25 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,10,.75), rgba(8,8,10,.92))" }} />
        </div>
        <div style={{ position: "relative", maxWidth: 360 }}>
          <Image src={CREST_ART[archetype]} alt="" width={72} height={72} style={{ height: 64, width: 64, objectFit: "contain", margin: "0 auto", mixBlendMode: "screen" }} />
          <h1 className="chq-display" style={{ color: accent.base, fontSize: 24, textTransform: "uppercase", marginTop: 12 }}>{world.name}</h1>
          <p style={{ color: "var(--chq-text-2)", marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>
            This realm awaits its full forging. Conquer the Ember Marches first — or go Pro to claim every world as it opens.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
            <Button variant="primary" onClick={() => { useHeroSelect.getState().selectHero("warrior"); router.push("/world"); }}>Enter the Ember Marches →</Button>
            <Button variant="ghost" onClick={() => router.push("/hero-select")}>← Heroes</Button>
          </div>
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

  const continueOpening = openings.find((o, i) => stateFor(i, o) === "available" || stateFor(i, o) === "inProgress") ?? null;
  const open = openId ? openings.find((o) => o.id === openId) ?? null : null;
  const allConquered = openings.every((o) => progressFor(progress, o.id).conquered);
  const firstFresh = progressFor(progress, openings[0]!.id).linesLearned === 0 && !progressFor(progress, openings[0]!.id).conquered;
  const showIntro = !dismissedIntro && firstFresh && !open;

  const tileFor = (o: WorldOpeningMeta) => KINGDOM_TILE[o.id] ?? o.tileArt;

  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh" }}>
      <GradientDefs />
      <AccountBoot />

      <header style={{ position: "fixed", top: 0, left: 0, right: 0, height: 56, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", background: "linear-gradient(180deg, rgba(8,8,10,.92), transparent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image src={BRAND_LOGO} alt="ChessHeroQuest" width={1478} height={418} priority style={{ height: 26, width: "auto" }} />
          <span className="chq-display" style={{ fontSize: 12, color: accent.base, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>{world.name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="mailto:alain@monkeoz.com?subject=ChessHeroQuest%20feedback" style={{ color: "var(--chq-text-2)", fontSize: 12, textDecoration: "none" }}>Feedback</a>
          <button type="button" onClick={() => router.push("/hero-select")} style={{ background: "transparent", border: 0, color: "var(--chq-text-2)", fontSize: 12, cursor: "pointer" }}>Heroes</button>
        </div>
      </header>

      {noHero && (
        <p style={{ position: "fixed", top: 56, left: 0, right: 0, zIndex: 20, textAlign: "center", ...eyebrow, color: "var(--chq-gold-3)", fontSize: 10, padding: 4, pointerEvents: "none" }}>
          Sample — defaulting to the Warrior. Pick yours in Heroes.
        </p>
      )}

      {/* Framed, scrollable portrait map (vignette blends edges into obsidian). */}
      <div style={{ position: "relative", width: "100%", maxWidth: MAP_W, margin: "0 auto", padding: "72px 0 132px" }}>
        <div style={{ position: "relative", width: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={WORLD_MAP[archetype]} alt={`${world.name} map`} style={{ width: "100%", display: "block", borderRadius: 16 }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, borderRadius: 16, boxShadow: "inset 0 0 90px 30px #08080A", pointerEvents: "none" }} />

          {/* connecting path */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            {openings.map((o, i) => {
              const to = i < openings.length - 1 ? openings[i + 1]!.pos : bossPos;
              const conquered = progressFor(progress, o.id).conquered;
              return <line key={o.id} x1={o.pos.x} y1={o.pos.y} x2={to.x} y2={to.y} stroke={conquered ? "url(#chq-gold)" : "rgba(8,8,10,.85)"} strokeWidth={1.4} strokeLinecap="round" />;
            })}
          </svg>

          {/* opening nodes + labels */}
          {openings.map((o, i) => {
            const st = stateFor(i, o);
            const isStart = continueOpening?.id === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => st !== "locked" && setOpenId(o.id)}
                aria-label={`${o.name} — ${st}`}
                style={{ position: "absolute", left: `${o.pos.x}%`, top: `${o.pos.y}%`, transform: "translate(-50%,-50%)", background: "transparent", border: 0, padding: 0, cursor: st === "locked" ? "default" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
              >
                <MapNode state={st} size={isStart ? 76 : 60} progress={progressFor(progress, o.id).drillAccuracy} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".02em", color: isStart ? "var(--chq-gold-1)" : st === "locked" ? "var(--chq-text-muted)" : "var(--chq-text-1)", background: "rgba(8,8,10,.85)", border: `1px solid ${isStart ? accent.border : "var(--chq-line)"}`, borderRadius: 999, padding: "2px 8px", whiteSpace: "nowrap" }}>
                  {isStart ? `▶ ${o.name}` : o.name}
                </span>
              </button>
            );
          })}

          {/* kingdom boss node */}
          <button
            type="button"
            onClick={() => allConquered && router.push("/boss?kingdom=1")}
            aria-label="Kingdom Boss"
            style={{ position: "absolute", left: `${bossPos.x}%`, top: `${bossPos.y}%`, transform: "translate(-50%,-50%)", background: "transparent", border: 0, cursor: allConquered ? "pointer" : "default", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
          >
            <MapNode state={allConquered ? "available" : "locked"} size={88} />
            <span style={{ ...eyebrow, fontSize: 9, color: accent.base, background: "rgba(8,8,10,.85)", border: "1px solid var(--chq-line)", borderRadius: 999, padding: "2px 8px" }}>Kingdom Boss</span>
          </button>
        </div>
      </div>

      {/* Continue banner */}
      {continueOpening && !open && !showIntro && (
        <button
          type="button"
          onClick={() => setOpenId(continueOpening.id)}
          style={{ position: "fixed", bottom: 16, left: 16, right: 16, zIndex: 20, maxWidth: 460, margin: "0 auto", background: "var(--chq-panel)", border: `1px solid ${accent.border}`, borderRadius: "var(--chq-r-panel)", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", boxShadow: "0 8px 30px rgba(0,0,0,.5)" }}
        >
          <span style={{ color: "var(--chq-text-2)", fontSize: 13 }}>
            ▸ Continue: <b style={{ color: "var(--chq-text-1)" }}>{continueOpening.name}</b>
          </span>
          <span style={{ color: accent.base, fontSize: 13, fontWeight: 600 }}>Open →</span>
        </button>
      )}

      {/* First-visit onboarding */}
      {showIntro && continueOpening && (
        <div style={{ position: "fixed", inset: 0, zIndex: 40, display: "grid", placeItems: "center", background: "rgba(8,8,10,.82)", padding: 24 }}>
          <div style={{ maxWidth: 360, textAlign: "center", background: "var(--chq-panel)", border: `1px solid ${accent.border}`, borderRadius: "var(--chq-r-card)", padding: 24 }}>
            <Image src={CREST_ART[archetype]} alt="" width={64} height={64} style={{ height: 56, width: 56, objectFit: "contain", margin: "0 auto", mixBlendMode: "screen" }} />
            <h2 className="chq-display" style={{ color: accent.base, fontSize: 22, textTransform: "uppercase", marginTop: 10 }}>{world.name}</h2>
            <p style={{ color: "var(--chq-text-2)", fontSize: 14, lineHeight: 1.6, marginTop: 8 }}>
              This is your path up the mountain. Tap the glowing gate — <b style={{ color: "var(--chq-text-1)" }}>{continueOpening.name}</b> — to <b>Learn</b> the line, <b>Drill</b> it into memory, then defeat its <b>Opening Guardian</b> to light the next gate.
            </p>
            <Button variant="primary" onClick={() => { setDismissedIntro(true); setOpenId(continueOpening.id); }} style={{ marginTop: 18 }}>
              Begin · {continueOpening.name} →
            </Button>
            <button type="button" onClick={() => setDismissedIntro(true)} style={{ display: "block", margin: "10px auto 0", background: "transparent", border: 0, color: "var(--chq-text-muted)", fontSize: 12, cursor: "pointer" }}>
              Just show me the map
            </button>
          </div>
        </div>
      )}

      {open && (
        <OpeningPanel opening={open} tile={tileFor(open)} progress={progressFor(progress, open.id)} accent={accent.base} onClose={() => setOpenId(null)} router={router} />
      )}
    </div>
  );
}

function OpeningPanel({
  opening,
  tile,
  progress,
  accent,
  onClose,
  router,
}: {
  opening: WorldOpeningMeta;
  tile?: string;
  progress: { masteryTier: "none" | "bronze" | "silver" | "gold"; conquered: boolean };
  accent: string;
  onClose: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  const q = `?opening=${opening.id}`;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 30, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.65)" }} aria-hidden="true" />
      <div style={{ position: "relative", maxWidth: 460, width: "100%", margin: "0 auto", background: "var(--chq-panel)", border: `1px solid ${accent}`, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 28 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {tile ? (
            <Image src={tile} alt="" width={72} height={72} style={{ height: 72, width: 72, borderRadius: 12, objectFit: "cover", border: `1px solid ${accent}` }} />
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: 12, background: `radial-gradient(circle at 50% 35%, ${accent}, var(--chq-panel) 80%)`, border: `1px solid ${accent}`, display: "grid", placeItems: "center" }}>
              <LogoMark size={30} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h2 className="chq-display" style={{ fontSize: 20, color: "var(--chq-text-1)", margin: 0 }}>{opening.name}</h2>
            <p style={{ ...eyebrow, color: "var(--chq-text-muted)", marginTop: 4 }}>{opening.eco} · {opening.side === "white" ? "White" : "Black"}</p>
          </div>
          {progress.masteryTier !== "none" && <Medal tier={progress.masteryTier} size={36} />}
        </div>

        <p style={{ color: "var(--chq-text-2)", fontSize: 14, lineHeight: 1.5, margin: "14px 0 6px" }}>{opening.description}</p>

        {!opening.playable && (
          <p style={{ ...eyebrow, color: "var(--chq-gold-3)", fontSize: 10, marginBottom: 10 }}>Lines not curated yet — coming soon</p>
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
