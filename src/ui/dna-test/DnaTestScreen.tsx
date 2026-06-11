"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, ProgressBar } from "@/src/ui/design-system/icons";
import { OrnateFrame } from "@/src/ui/design-system/OrnateFrame";
import { Button } from "@/src/ui/design-system/Button";
import { TestBoard } from "@/src/ui/design-system/TestBoard";
import { MoveExplorerList, type ExplorerRow } from "@/src/ui/world/MoveExplorerList";
import { BRAND_LOGO } from "@/src/ui/design-system/art";
import { ASSETS } from "@/src/lib/assets";
import { PictureBg } from "@/src/ui/PictureBg";
import { HERO_ACCENTS, type HeroKey } from "@/src/ui/design-system/tokens";
import { DNA_TEST_BANK, TEST_LENGTH } from "@/src/domain/dna-test/bank";
import type { TestPosition } from "@/src/domain/dna-test/types";
import { track } from "@/src/analytics/events";
import { AnalyticsBoot } from "@/src/ui/analytics/AnalyticsBoot";
import { useDnaTest } from "./useDnaTest";

function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
function useHydrated() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;
const isTodo = (s?: string) => !s || s.trim() === "" || s.startsWith("// TODO");

/** "1.e4 e5 2.Nf3 Nc6 3.Bc4" from a SAN array. */
function formatLine(sans: readonly string[]): string {
  let out = "";
  for (let i = 0; i < sans.length; i++) {
    out += i % 2 === 0 ? `${i / 2 + 1}.${sans[i]} ` : `${sans[i]} `;
  }
  return out.trim();
}

function TestShell({ children }: { children: ReactNode }) {
  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", position: "relative" }}>
      <GradientDefs />
      <AnalyticsBoot />
      {/* Home hero video backdrop — faint; reduced-motion shows the poster only. */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <PictureBg landscape={ASSETS.backgrounds.dnaTest} portrait={ASSETS.backgrounds.dnaTestPortrait} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,10,.5), rgba(8,8,10,.72) 55%, rgba(8,8,10,.82))" }} />
      </div>
      <header style={{ position: "relative", zIndex: 1, minHeight: 100, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 20px", borderBottom: "1px solid var(--chq-line)" }}>
        <Image src={BRAND_LOGO} alt="ChessHeroQuest" width={1478} height={418} priority style={{ height: 72, width: "auto" }} />
      </header>
      <main style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", padding: "24px 20px" }}>
        {children}
      </main>
    </div>
  );
}

/* The RPG context/explanation panel — light before answering, rich after. */
function ContextPanel({ position, answered, chosenIdx }: { position: TestPosition; answered: boolean; chosenIdx: number | null }) {
  const isSkill = position.questionType === "skill";
  const chosen = chosenIdx != null ? position.options[chosenIdx] : undefined;
  const best = position.options.find((o) => o.isBest);

  return (
    <OrnateFrame style={{ width: "100%", maxWidth: 340 }}>
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Opening name: shown for skill always; for style only AFTER answering. */}
        {(isSkill || answered) && (
          <p className="chq-display" style={{ fontSize: 15, color: "var(--chq-gold-3)", margin: 0 }}>
            {position.openingName} <span style={{ color: "var(--chq-text-muted)", fontSize: 12 }}>{position.eco}</span>
          </p>
        )}
        <p style={{ ...eyebrow, color: "var(--chq-text-2)", fontSize: 10 }}>The line so far</p>
        <p style={{ fontFamily: "var(--font-cinzel), serif", color: "var(--chq-text-1)", fontSize: 14, letterSpacing: ".02em", margin: 0 }}>
          {formatLine(position.lineSan)}
        </p>
        <p style={{ color: "var(--chq-text-muted)", fontSize: 12 }}>
          <span style={{ color: "var(--chq-gold-3)" }}>●</span> {position.sideToMove === "white" ? "White" : "Black"} to move
        </p>

        {!answered ? (
          !isTodo(position.contextRpg) && (
            <p style={{ color: "var(--chq-text-2)", fontSize: 13, lineHeight: 1.5, marginTop: 4 }}>{position.contextRpg}</p>
          )
        ) : (
          <div className="chq-rise" style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 8 }}>
            {/* skill verdict / style note */}
            {isSkill ? (
              <p style={{ fontSize: 13, fontWeight: 600, color: chosen?.isBest ? "var(--chq-state-solid, #3fb371)" : "var(--chq-state-leak, #d1495b)" }}>
                {chosen?.isBest ? "✓ Best move" : `✗ Best was ${best?.san ?? "—"}`}
              </p>
            ) : (
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--chq-gold-3)" }}>
                ◆ Your style — both are main-line theory, no wrong answer.
              </p>
            )}
            <p style={{ color: "var(--chq-text-1)", fontSize: 13.5, lineHeight: 1.55 }}>
              {isTodo(position.explanationRpg) ? "Full breakdown coming soon — the moves and verdict above are real." : position.explanationRpg}
            </p>
            {chosen && !isTodo(chosen.optionNote) && (
              <p style={{ color: "var(--chq-text-2)", fontSize: 13, lineHeight: 1.5, borderLeft: "2px solid var(--chq-line)", paddingLeft: 10 }}>
                {chosen.optionNote}
                {chosen.archetypeLean && (
                  <span style={{ display: "block", marginTop: 4, ...eyebrow, fontSize: 9, color: HERO_ACCENTS[chosen.archetypeLean as HeroKey].base }}>
                    Leans {HERO_ACCENTS[chosen.archetypeLean as HeroKey].label}
                    {/* TODO: how/if style-fork leans feed the archetype profile (kept out of IQ) */}
                  </span>
                )}
              </p>
            )}
          </div>
        )}
      </div>
    </OrnateFrame>
  );
}

function TestRunner({ position, index, reduced, onAnswer }: { position: TestPosition; index: number; reduced: boolean; onAnswer: (chosen: number | null) => void }) {
  const [chosen, setChosen] = useState<number | "skip" | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const answered = chosen !== null;
  const chosenIdx = typeof chosen === "number" ? chosen : null;
  const isSkill = position.questionType === "skill";

  // POST-ANSWER explorer enrichment (§5b) — built here, rendered only when answered.
  const explorerRows: ExplorerRow[] = position.options.map((o, i) => ({
    san: o.san,
    name: isSkill ? (o.isBest ? "Best move" : "Alternative") : o.archetypeLean ? HERO_ACCENTS[o.archetypeLean as HeroKey].label : "Main line",
    explorer: o.explorer,
    highlight: isSkill ? o.isBest : chosenIdx === i,
    tag: isSkill
      ? o.isBest
        ? { label: "best", tone: "good" }
        : chosenIdx === i
          ? { label: "your pick", tone: "bad" }
          : undefined
      : chosenIdx === i
        ? { label: "your pick", tone: "gold" }
        : undefined,
  }));
  const hasExplorer = position.options.some((o) => o.explorer);
  const band = position.options.find((o) => o.explorer)?.explorer?.ratingBand;

  const pick = (c: number | "skip") => {
    if (answered) return;
    setChosen(c);
  };
  const cont = () => onAnswer(chosenIdx);

  return (
    <div style={{ width: "100%", maxWidth: 880, display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ textAlign: "center", color: "var(--chq-text-2)", fontSize: 14, lineHeight: 1.5, margin: "0 auto 6px", maxWidth: 520 }}>
        Answer all {TEST_LENGTH} positions to reveal your <span style={{ color: "var(--chq-gold-3)", fontWeight: 600 }}>Chess DNA</span>.
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ ...eyebrow, color: "var(--chq-text-2)" }}>Position {index + 1} / {TEST_LENGTH}</span>
        <span style={{ fontSize: 12, color: "var(--chq-text-muted)", fontVariantNumeric: "tabular-nums" }}>⏱ {fmt(elapsedSec)}</span>
      </div>
      <ProgressBar value={index / TEST_LENGTH} height={4} ariaLabel={`Position ${index + 1} of ${TEST_LENGTH}`} />

      {/* board + RPG context panel (side-by-side desktop, stacked mobile via wrap) */}
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
        <div style={{ width: "min(440px, 86vw)" }}>
          <TestBoard fen={position.fen} orientation="white" />
          <p style={{ textAlign: "center", marginTop: 8, fontSize: 13 }}>
            <span style={{ color: "var(--chq-gold-3)" }}>●</span>{" "}
            <span style={{ color: "var(--chq-text-1)", fontWeight: 600 }}>{position.sideToMove === "white" ? "White" : "Black"} to move</span>
          </p>
          <p className="chq-display" style={{ textAlign: "center", fontSize: 18, color: "var(--chq-text-1)", marginTop: 2 }}>
            {isSkill ? "Best move?" : "Your move?"}
          </p>
        </div>
        <div style={{ flex: "1 1 280px", maxWidth: 340 }}>
          <ContextPanel position={position} answered={answered} chosenIdx={chosenIdx} />
        </div>
      </div>

      {/* option chips */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, maxWidth: 520, margin: "0 auto", width: "100%" }}>
        {position.options.map((o, i) => {
          const selected = chosen === i;
          // after answering a skill question, mark best ✓ / wrong choice ✗
          const mark = answered && isSkill ? (o.isBest ? " ✓" : selected ? " ✗" : "") : "";
          return (
            <button key={o.san} type="button" className="chq-chip" data-selected={selected || (answered && isSkill && o.isBest)} disabled={answered} onClick={() => pick(i)}>
              {o.san}{mark}
            </button>
          );
        })}
      </div>

      {answered && hasExplorer && (
        <div className="chq-rise" style={{ maxWidth: 520, margin: "0 auto", width: "100%" }}>
          <p style={{ ...eyebrow, color: "var(--chq-text-muted)", fontSize: 9, margin: "0 0 8px" }}>
            How players choose here{band ? ` · ~${band} rated` : ""}
          </p>
          <MoveExplorerList rows={explorerRows} compact ariaLabel="Move popularity and engine eval" />
        </div>
      )}

      {answered && (
        <Button variant="primary" onClick={cont} style={{ margin: "2px auto 0", minWidth: 200 }}>
          {index + 1 >= TEST_LENGTH ? "See my result →" : "Continue →"}
        </Button>
      )}
      {/* reduced-motion: the .chq-rise reveal is disabled by the global guard */}
      <span style={{ display: "none" }}>{reduced ? "" : ""}</span>
    </div>
  );
}

export function DnaTestScreen() {
  const mounted = useHydrated();
  const reduced = useReducedMotion();
  const router = useRouter();

  const started = useDnaTest((s) => s.started);
  const finished = useDnaTest((s) => s.finished);
  const currentId = useDnaTest((s) => s.currentId);
  const answers = useDnaTest((s) => s.answers);
  const result = useDnaTest((s) => s.result);
  const start = useDnaTest((s) => s.start);
  const answer = useDnaTest((s) => s.answer);
  const reset = useDnaTest((s) => s.reset);

  useEffect(() => {
    if (finished && result) track("test_complete", { scoreRaw: result.openingIq });
  }, [finished, result]);

  if (!mounted) {
    return <TestShell><span style={{ color: "var(--chq-text-muted)" }}>Loading…</span></TestShell>;
  }

  if (!started) {
    return (
      <TestShell>
        <OrnateFrame style={{ maxWidth: 420, width: "100%" }}>
          <div style={{ padding: 28, textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <p style={eyebrow}>Chess DNA</p>
            <h1 className="chq-display chq-gold-text" style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Discover your Chess DNA</h1>
            <p style={{ color: "var(--chq-text-2)", fontSize: 15, lineHeight: 1.6 }}>
              {TEST_LENGTH} positions · ~2 minutes · no signup. Read the position, choose — and learn something on every one.
            </p>
            <Button onClick={() => { track("test_start"); start(); }} style={{ marginTop: 4 }}>Begin the test</Button>
          </div>
        </OrnateFrame>
      </TestShell>
    );
  }

  if (finished && result) {
    return (
      <TestShell>
        <OrnateFrame style={{ maxWidth: 420, width: "100%" }}>
          <div style={{ padding: 28, textAlign: "center", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            <p style={eyebrow}>Test complete</p>
            <p style={{ ...eyebrow, color: "var(--chq-text-2)" }}>Provisional Opening IQ</p>
            <div className="chq-display chq-gold-text" style={{ fontSize: 72, fontWeight: 700, lineHeight: 1 }}>{result.openingIq}</div>
            <p style={{ color: "var(--chq-text-2)", fontSize: 13, lineHeight: 1.6 }}>
              {result.positionsAnswered} positions · strongest: <b style={{ color: "var(--chq-text-1)" }}>{result.strongestFamily}</b> · weakest: <b style={{ color: "var(--chq-text-1)" }}>{result.weakestFamily}</b>
            </p>
            {/* ONE job: carry momentum into the Style Quiz (?fresh=1 resets any
                stale quiz state). Email capture lives AFTER the payoff (/result);
                retake lives on the Profile — never right after finishing. */}
            <div style={{ marginTop: 6 }}>
              <Button variant="primary" onClick={() => router.push("/style-quiz?fresh=1")}>Continue → Style Quiz</Button>
            </div>
          </div>
        </OrnateFrame>
      </TestShell>
    );
  }

  const position = DNA_TEST_BANK.find((p) => p.id === currentId);
  if (!position) {
    return (
      <TestShell>
        <Button onClick={reset}>Restart</Button>
      </TestShell>
    );
  }

  return (
    <TestShell>
      <TestRunner key={position.id} position={position} index={answers.length} reduced={reduced} onAnswer={answer} />
    </TestShell>
  );
}
