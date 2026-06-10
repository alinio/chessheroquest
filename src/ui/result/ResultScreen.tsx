"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import { track } from "@/src/lib/track";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, LogoMark, OpeningIQGauge } from "@/src/ui/design-system/icons";
import { OrnateFrame } from "@/src/ui/design-system/OrnateFrame";
import { Button } from "@/src/ui/design-system/Button";
import { HERO_ACCENTS, type HeroKey } from "@/src/ui/design-system/tokens";
import { WORLDS } from "@/src/domain/recommend/worlds";
import { roadToElo, provisionalTopPercent } from "@/src/domain/recommend/road-to-elo";
import { useDnaTest } from "@/src/ui/dna-test/useDnaTest";
import { useStyleQuiz } from "@/src/ui/style-quiz/useStyleQuiz";
import { SaveProgress } from "@/src/ui/account/SaveProgress";
import { ASSETS, getRankInsignia } from "@/src/lib/assets";
import { DnaShareCard } from "./DnaShareCard";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--chq-text-muted)" } as const;

/** Sample shown when the player lands here without taking M2/M3 (flagged in UI). */
const SAMPLE = {
  iq: 428,
  strongest: "Italian Game",
  weakest: "Sicilian Defense",
  archetype: "strategist" as HeroKey,
  matchPercent: 78,
  reasons: ["You build up before you strike", "You prize a small, lasting edge"],
};

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", position: "relative" }}>
      <GradientDefs />
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ASSETS.backgrounds.resultsReveal} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,10,.6), rgba(8,8,10,.85))" }} />
      </div>
      <header style={{ position: "relative", zIndex: 1, height: 56, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 20px", borderBottom: "1px solid var(--chq-line)" }}>
        <LogoMark size={26} />
        <span className="chq-display chq-gold-text" style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>
          Your Chess DNA
        </span>
      </header>
      <main style={{ position: "relative", zIndex: 1, flex: 1, width: "100%", maxWidth: 480, margin: "0 auto", padding: "24px 20px 48px" }}>{children}</main>
    </div>
  );
}

const cleanLabel = (a: HeroKey) => HERO_ACCENTS[a].label.replace("Aggressive ", "");

export function ResultScreen() {
  const router = useRouter();
  const mounted = useHydrated();
  const dna = useDnaTest((s) => s.result);
  const quiz = useStyleQuiz((s) => s.result);
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    track("result_viewed");
  }, []);

  if (!mounted) {
    return (
      <Shell>
        <p style={{ color: "var(--chq-text-muted)" }}>Loading…</p>
      </Shell>
    );
  }

  const isSample = !dna || !quiz;
  const iq = dna?.openingIq ?? SAMPLE.iq;
  const strongest = dna?.strongestFamily ?? SAMPLE.strongest;
  const weakest = dna?.weakestFamily ?? SAMPLE.weakest;
  const archetype: HeroKey = quiz?.primary ?? SAMPLE.archetype;
  const matchPercent = quiz?.matchPercent ?? SAMPLE.matchPercent;
  const reasons = quiz?.reasons?.length ? quiz.reasons : SAMPLE.reasons;

  const accent = HERO_ACCENTS[archetype];
  const label = cleanLabel(archetype);
  const topPercent = provisionalTopPercent(iq);
  const world = WORLDS[archetype];
  const recs = roadToElo(archetype, weakest);
  const tagline = world.tagline;

  async function exportCard(): Promise<string | null> {
    if (!cardRef.current) return null;
    await document.fonts.ready;
    return toPng(cardRef.current, { width: 1080, height: 1350, pixelRatio: 1, cacheBust: true, backgroundColor: "#08080A" });
  }

  async function onDownload() {
    setBusy(true);
    try {
      const url = await exportCard();
      if (url) {
        const a = document.createElement("a");
        a.href = url;
        a.download = "chess-dna.png";
        a.click();
      }
    } finally {
      setBusy(false);
    }
  }

  async function onShare() {
    setBusy(true);
    try {
      const url = await exportCard();
      if (!url) return;
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], "chess-dna.png", { type: "image/png" });
      const data = { files: [file], title: "My Chess DNA", text: `My Opening IQ is ${iq} — discover yours:` };
      if (typeof navigator !== "undefined" && navigator.canShare?.(data)) {
        await navigator.share(data);
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = "chess-dna.png";
        a.click();
      }
    } catch {
      /* user cancelled / unsupported */
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      {isSample && (
        <p style={{ ...eyebrow, color: "var(--chq-gold-3)", textAlign: "center", marginBottom: 12 }}>
          Sample data — take the test &amp; quiz for your real result
        </p>
      )}

      {/* On-screen DNA card (frame--hero) */}
      <OrnateFrame variant="hero" hero={archetype}>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: "50%",
              background: `radial-gradient(circle at 50% 38%, ${accent.base}, var(--chq-panel) 78%)`,
              border: `2px solid ${accent.base}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogoMark size={40} />
          </div>
          <h1 className="chq-display" style={{ fontSize: 26, fontWeight: 700, color: accent.base, textTransform: "uppercase", margin: 0 }}>
            The {label}
          </h1>
          <OpeningIQGauge value={iq} size={150} />
          <p style={{ ...eyebrow, color: "var(--chq-text-2)" }}>Top {topPercent}% · {matchPercent}% match</p>

          {reasons.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, margin: "2px 0", display: "flex", flexDirection: "column", gap: 5 }}>
              {reasons.map((r) => (
                <li key={r} style={{ color: "var(--chq-text-2)", fontSize: 14 }}>
                  <span style={{ color: accent.base }}>◆</span> {r}
                </li>
              ))}
            </ul>
          )}

          <div style={{ display: "flex", gap: 10, width: "100%", marginTop: 4 }}>
            {[
              ["Best Opening", strongest],
              ["Biggest Weakness", weakest],
            ].map(([l, v]) => (
              <div key={l} style={{ flex: 1, background: "var(--chq-raised)", borderRadius: "var(--chq-r-frame)", padding: "12px 10px" }}>
                <div style={{ ...eyebrow, fontSize: 10, color: "var(--chq-text-muted)" }}>{l}</div>
                <div style={{ color: "var(--chq-text-1)", fontSize: 14, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </OrnateFrame>

      {/* Share / download */}
      <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "center" }}>
        <Button variant="ghost" onClick={onShare} disabled={busy}>
          Share
        </Button>
        <Button variant="ghost" onClick={onDownload} disabled={busy}>
          {busy ? "Rendering…" : "Download card"}
        </Button>
      </div>

      {/* Save your progress (after the payoff — not a blocker to starting). */}
      <div style={{ marginTop: 16 }}>
        <SaveProgress />
      </div>

      {/* Road to Elo */}
      <section style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--chq-line)", paddingBottom: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getRankInsignia(1000)} alt="" width={34} height={34} style={{ display: "block" }} />
          <p className="chq-display" style={{ fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--chq-gold-3)", margin: 0 }}>
            Your Road to Elo
          </p>
        </div>
        <p style={{ color: "var(--chq-text-muted)", fontSize: 12, margin: "8px 0 12px" }}>
          Train these next in {world.name}:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {recs.map((r) => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--chq-panel)", border: "1px solid var(--chq-line)", borderRadius: "var(--chq-r-panel)", padding: "12px 14px" }}>
              <span style={{ color: "var(--chq-text-1)", fontWeight: 600, fontSize: 15 }}>
                {r.name} <span style={{ color: "var(--chq-text-muted)", fontWeight: 400, fontSize: 12 }}>{r.eco}</span>
              </span>
              <span style={{ color: "var(--chq-text-2)", fontSize: 12 }}>{r.reason}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Primary CTA → Hero Select (M5 stub) */}
      <Button variant="primary" onClick={() => router.push("/hero-select")} style={{ width: "100%", marginTop: 24 }}>
        Meet your Hero →
      </Button>

      {/* Offscreen 1080×1350 node for pixel-exact export */}
      <div aria-hidden="true" style={{ position: "fixed", left: -100000, top: 0, pointerEvents: "none" }}>
        <div ref={cardRef} className={inter.variable}>
          <DnaShareCard
            iq={iq}
            topPercent={topPercent}
            archetypeLabel={`The ${label}`}
            accent={accent.base}
            strongestOpening={strongest}
            weakestOpening={weakest}
            tagline={tagline}
          />
        </div>
      </div>
    </Shell>
  );
}
