"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/src/lib/track";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import Image from "next/image";
import { GradientDefs, LogoMark, OpeningIQGauge } from "@/src/ui/design-system/icons";
import { BRAND_LOGO } from "@/src/ui/design-system/art";
import { OrnateFrame } from "@/src/ui/design-system/OrnateFrame";
import { Button } from "@/src/ui/design-system/Button";
import { HERO_ACCENTS, type HeroKey } from "@/src/ui/design-system/tokens";
import { roadToElo, provisionalTopPercent } from "@/src/domain/recommend/road-to-elo";
import { useDnaTest } from "@/src/ui/dna-test/useDnaTest";
import { DNA_TEST_BANK } from "@/src/domain/dna-test/bank";
import { PENDING_DNA_KEY } from "@/src/ui/PendingDnaSync";
import { useStyleQuiz } from "@/src/ui/style-quiz/useStyleQuiz";
import { ASSETS, getRankInsignia } from "@/src/lib/assets";
import { PictureBg } from "@/src/ui/PictureBg";
import { SaveProgress } from "@/src/ui/account/SaveProgress";
import { MiniBoard } from "@/src/ui/board/MiniBoard";
import { useCountUp } from "@/src/ui/hooks/useCountUp";
import "./result-reveal.css";

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
        <PictureBg landscape={ASSETS.backgrounds.resultsReveal} portrait={ASSETS.backgrounds.resultsRevealPortrait} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,10,.6), rgba(8,8,10,.85))" }} />
      </div>
      <header style={{ position: "relative", zIndex: 1, minHeight: 100, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 20px", borderBottom: "1px solid var(--chq-line)" }}>
        <Image src={BRAND_LOGO} alt="ChessHeroQuest" width={1478} height={418} priority style={{ height: 72, width: "auto" }} />
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

  const iq = dna?.openingIq ?? SAMPLE.iq;
  // Gauge count-up (800ms) — part of the sequenced reveal; reduced-motion jumps.
  const gaugeIq = useCountUp(iq, 800);

  useEffect(() => {
    track("result_viewed");
  }, []);

  // F1 FIX: stash the REAL result for account attachment. PendingDnaSync (hub
  // layout) POSTs it to /api/dna-test after signup — without this, every new
  // account was asked to retake the test it just finished.
  useEffect(() => {
    if (!mounted || !dna || !quiz) return;
    try {
      const skill = dna.answers.filter((a) => a.questionType === "skill");
      const weakPos = dna.weakestFamily
        ? DNA_TEST_BANK.find((p) => p.openingFamily === dna.weakestFamily)
        : undefined;
      const byFam = (f: string | null) =>
        f ? dna.byFamily.find((x) => x.family === f) : undefined;
      const payload = {
        archetype: quiz.primary,
        core: dna.rawAccuracy,
        initialIq: dna.openingIq,
        rank: "provisional",
        percentile: provisionalTopPercent(dna.openingIq),
        strongestArchetype: quiz.primary,
        weakestArchetype: quiz.secondary ?? quiz.primary,
        recommendedPathId: roadToElo(quiz.primary, dna.weakestFamily)[0]?.id ?? "italian",
        answered: dna.positionsAnswered,
        correctCount: skill.filter((a) => a.quality >= 0.95).length,
        strongestFamily: dna.strongestFamily ?? undefined,
        weakestFamily: dna.weakestFamily,
        strongestPct: dna.strongestFamily
          ? Math.round((byFam(dna.strongestFamily)?.avgQuality ?? 1) * 100)
          : undefined,
        weakestPct: dna.weakestFamily
          ? Math.round((byFam(dna.weakestFamily)?.avgQuality ?? 0) * 100)
          : undefined,
        weakFen: weakPos?.fen,
        weakOrientation: weakPos?.sideToMove,
        weakEco: weakPos?.eco,
      };
      window.localStorage.setItem(PENDING_DNA_KEY, JSON.stringify(payload));
    } catch {
      // Storage unavailable — signup still works, just without the seed.
    }
  }, [mounted, dna, quiz]);

  if (!mounted) {
    return (
      <Shell>
        <p style={{ color: "var(--chq-text-muted)" }}>Loading…</p>
      </Shell>
    );
  }

  const isSample = !dna || !quiz;
  const strongest = dna?.strongestFamily ?? SAMPLE.strongest;
  // null weakest on a REAL result = flawless run (never re-brand it with sample data)
  const weakest = dna ? dna.weakestFamily : SAMPLE.weakest;
  const weakestLabel = weakest ?? "None found — flawless run";
  const archetype: HeroKey = quiz?.primary ?? SAMPLE.archetype;
  const matchPercent = quiz?.matchPercent ?? SAMPLE.matchPercent;
  const reasons = quiz?.reasons?.length ? quiz.reasons : SAMPLE.reasons;

  const accent = HERO_ACCENTS[archetype];
  const label = cleanLabel(archetype);
  const topPercent = provisionalTopPercent(iq);
  const recs = roadToElo(archetype, weakest);
  // The weak family's REAL test position (DNA_TEST_BANK) — null when flawless
  // or when the family has no bank position (then nothing is shown).
  const weakBoard = weakest ? DNA_TEST_BANK.find((p) => p.openingFamily === weakest) : undefined;

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
            className="chq-rr chq-rr-crest"
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
          <h1 className="chq-display chq-rr chq-rr-crest" style={{ fontSize: 26, fontWeight: 700, color: accent.base, textTransform: "uppercase", margin: 0 }}>
            The {label}
          </h1>
          <div className="chq-rr chq-rr-gauge" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <OpeningIQGauge value={gaugeIq} size={150} />
            <p style={{ ...eyebrow, color: "var(--chq-text-2)", margin: 0 }}>Top ~{topPercent}% (provisional) · {matchPercent}% match</p>
          </div>

          {reasons.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, margin: "2px 0", display: "flex", flexDirection: "column", gap: 5 }}>
              {reasons.map((r, i) => (
                <li
                  key={r}
                  className="chq-rr chq-rr-reason"
                  style={{ color: "var(--chq-text-2)", fontSize: 14, "--rr-i": i } as React.CSSProperties}
                >
                  <span style={{ color: accent.base }}>◆</span> {r}
                </li>
              ))}
            </ul>
          )}

          <div className="chq-rr chq-rr-facts" style={{ display: "flex", gap: 10, width: "100%", marginTop: 4 }}>
            {[
              ["Best Opening", strongest],
              ["Biggest Weakness", weakestLabel],
            ].map(([l, v]) => (
              <div key={l} style={{ flex: 1, background: "var(--chq-raised)", borderRadius: "var(--chq-r-frame)", padding: "12px 10px" }}>
                <div style={{ ...eyebrow, fontSize: 10, color: "var(--chq-text-muted)" }}>{l}</div>
                <div style={{ color: "var(--chq-text-1)", fontSize: 14, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </OrnateFrame>

      {/* The weak family's real test position — the board IS the diagnosis. */}
      {weakBoard && weakest && (
        <section
          className="chq-rr chq-rr-board"
          style={{ marginTop: 16, display: "flex", justifyContent: "center" }}
        >
          <MiniBoard
            fen={weakBoard.fen}
            orientation={weakBoard.sideToMove}
            px={120}
            caption={
              <>
                <b>{weakest}</b> · This is where it goes wrong for you.
              </>
            }
          />
        </section>
      )}

      {/* Road to Elo — the plan, explained (founder: no share/save detours here). */}
      <section className="chq-rr chq-rr-road" style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--chq-line)", paddingBottom: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getRankInsignia(1000)} alt="" width={34} height={34} style={{ display: "block" }} />
          <p className="chq-display" style={{ fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--chq-gold-3)", margin: 0 }}>
            Your Road to Elo
          </p>
        </div>
        <p style={{ color: "var(--chq-text-2)", fontSize: 13, lineHeight: 1.6, margin: "10px 0 12px" }}>
          Your training plan: the first three openings to master, picked from your test and your
          style. You&apos;ll learn them line by line in the game — in this order.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {recs.map((r, i) => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--chq-panel)", border: "1px solid var(--chq-line)", borderRadius: "var(--chq-r-panel)", padding: "12px 14px" }}>
              <span className="chq-display" style={{ color: "var(--chq-gold-3)", fontSize: 18, fontWeight: 700, width: 22, flexShrink: 0, textAlign: "center" }}>{i + 1}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", color: "var(--chq-text-1)", fontWeight: 600, fontSize: 15 }}>
                  {r.name} <span style={{ color: "var(--chq-text-muted)", fontWeight: 400, fontSize: 12 }}>{r.eco}</span>
                </span>
                <span style={{ display: "block", color: "var(--chq-text-2)", fontSize: 12, marginTop: 2 }}>
                  {r.reason !== "Core of your repertoire"
                    ? r.reason
                    : i === 0
                      ? "Start here — the backbone of your repertoire"
                      : i === 1
                        ? "Your second weapon"
                        : "Rounds out your base"}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Email capture at the emotional peak (spec §C Funnel) — never blocking:
          one optional field; the primary CTA below stays the visual primary. */}
      <section className="chq-rr chq-rr-late" style={{ marginTop: 24 }}>
        <SaveProgress
          title="Keep your result"
          sub="Your DNA card + your 3-opening plan, in your inbox. One email, no spam."
          cta="Email me my Chess DNA"
          trackEvent="result_email_capture"
        />
      </section>

      {/* Primary CTA → Hero Select (M5 stub) */}
      <Button variant="primary" onClick={() => router.push("/hero-select")} style={{ width: "100%", marginTop: 24 }}>
        Meet your Hero →
      </Button>

    </Shell>
  );
}
