"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, LogoMark, ProgressBar } from "@/src/ui/design-system/icons";
import { OrnateFrame } from "@/src/ui/design-system/OrnateFrame";
import { Button } from "@/src/ui/design-system/Button";
import { TestBoard } from "@/src/ui/design-system/TestBoard";
import { track } from "@/src/lib/track";
import { DNA_TEST_BANK, TEST_LENGTH } from "@/src/domain/dna-test/bank";
import type { TestPosition } from "@/src/domain/dna-test/types";
import { useDnaTest } from "./useDnaTest";

const SELECT_MS = 120; // gold-fill confirmation before auto-advance (wireframe §1)

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

// Subscribe to external state the idiomatic way — no setState-in-effect.
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(REDUCED_QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

// Hydration gate: false on the server, true once mounted on the client.
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--chq-text-muted)" } as const;

function TestShell({ children }: { children: ReactNode }) {
  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <GradientDefs />
      <header
        style={{
          height: 56,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 20px",
          borderBottom: "1px solid var(--chq-line)",
        }}
      >
        <LogoMark size={26} />
        <span className="chq-display chq-gold-text" style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>
          Chess DNA Test
        </span>
      </header>
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", padding: "24px 20px" }}>
        {children}
      </main>
    </div>
  );
}

function TestRunner({
  position,
  index,
  reduced,
  onAnswer,
}: {
  position: TestPosition;
  index: number;
  reduced: boolean;
  onAnswer: (chosen: number | null, latencyMs?: number) => void;
}) {
  const [selected, setSelected] = useState<number | "skip" | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);

  // Mounts per position (parent keys on position.id) → counts up 1s/tick. Subtle,
  // informational; no impure time reads (purity-clean).
  useEffect(() => {
    const id = window.setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const commit = (chosen: number | null, key: number | "skip") => {
    if (selected !== null) return; // one answer per position
    setSelected(key);
    window.setTimeout(() => onAnswer(chosen), reduced ? 0 : SELECT_MS);
  };

  return (
    <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ ...eyebrow, color: "var(--chq-text-2)" }}>
          Position {index + 1} / {TEST_LENGTH}
        </span>
        <span style={{ fontSize: 12, color: "var(--chq-text-muted)", fontVariantNumeric: "tabular-nums" }}>⏱ {fmt(elapsedSec)}</span>
      </div>

      <ProgressBar value={index / TEST_LENGTH} height={4} ariaLabel={`Position ${index + 1} of ${TEST_LENGTH}`} />

      <div style={{ width: "min(480px, 86vw)", margin: "6px auto 0" }}>
        <TestBoard fen={position.fen} orientation={position.sideToMove} />
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: "var(--chq-text-muted)" }}>
        <span style={{ color: "var(--chq-gold-3)" }}>●</span> {position.sideToMove === "white" ? "White" : "Black"} to play
      </p>

      <p className="chq-display" style={{ textAlign: "center", fontSize: 18, color: "var(--chq-text-1)" }}>
        {position.prompt}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {position.options.map((o, i) => (
          <button
            key={o.san}
            type="button"
            className="chq-chip"
            data-selected={selected === i}
            disabled={selected !== null}
            onClick={() => commit(i, i)}
          >
            {o.san}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => commit(null, "skip")}
        disabled={selected !== null}
        style={{
          background: "transparent",
          border: 0,
          color: selected === "skip" ? "var(--chq-gold-3)" : "var(--chq-text-muted)",
          fontSize: 13,
          textDecoration: "underline",
          cursor: selected !== null ? "default" : "pointer",
          marginTop: 2,
        }}
      >
        I&apos;m not sure (skip)
      </button>
    </div>
  );
}

export function DnaTestScreen() {
  const router = useRouter();
  const mounted = useHydrated();
  const reduced = useReducedMotion();

  const started = useDnaTest((s) => s.started);
  const finished = useDnaTest((s) => s.finished);
  const currentId = useDnaTest((s) => s.currentId);
  const answers = useDnaTest((s) => s.answers);
  const result = useDnaTest((s) => s.result);
  const start = useDnaTest((s) => s.start);
  const answer = useDnaTest((s) => s.answer);
  const reset = useDnaTest((s) => s.reset);

  // Avoid SSR/persist hydration mismatch — render after mount.
  if (!mounted) {
    return (
      <TestShell>
        <span style={{ color: "var(--chq-text-muted)" }}>Loading…</span>
      </TestShell>
    );
  }

  // Intro
  if (!started) {
    return (
      <TestShell>
        <OrnateFrame style={{ maxWidth: 420, width: "100%" }}>
          <div style={{ padding: 28, textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <p style={eyebrow}>Chess DNA</p>
            <h1 className="chq-display chq-gold-text" style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
              Discover your Chess DNA
            </h1>
            <p style={{ color: "var(--chq-text-2)", fontSize: 15, lineHeight: 1.6 }}>
              {TEST_LENGTH} positions · ~2 minutes · no signup. Pick the best move — the difficulty adapts to you.
            </p>
            <Button onClick={() => { track("dna_test_started"); start(); }} style={{ marginTop: 4 }}>
              Begin the test
            </Button>
          </div>
        </OrnateFrame>
      </TestShell>
    );
  }

  // Finished → stub placeholder (Style Quiz = M3, DNA Card = M4)
  if (finished && result) {
    return (
      <TestShell>
        <OrnateFrame style={{ maxWidth: 420, width: "100%" }}>
          <div style={{ padding: 28, textAlign: "center", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            <p style={eyebrow}>Test complete</p>
            <p style={{ ...eyebrow, color: "var(--chq-text-2)" }}>Provisional Opening IQ</p>
            <div className="chq-display chq-gold-text" style={{ fontSize: 72, fontWeight: 700, lineHeight: 1 }}>
              {result.openingIq}
            </div>
            <p style={{ color: "var(--chq-text-2)", fontSize: 13, lineHeight: 1.6 }}>
              {result.positionsAnswered} positions answered · strongest: <b style={{ color: "var(--chq-text-1)" }}>{result.strongestFamily}</b> · weakest:{" "}
              <b style={{ color: "var(--chq-text-1)" }}>{result.weakestFamily}</b>
            </p>
            <p style={{ color: "var(--chq-text-muted)", fontSize: 12, lineHeight: 1.6 }}>
              Next up: the Style Quiz, then your shareable DNA Card. (Coming in the following modules.) Your result is saved on this device.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap", justifyContent: "center" }}>
              <Button variant="primary" onClick={() => router.push("/style-quiz")}>
                Continue → Style Quiz
              </Button>
              <Button variant="ghost" onClick={reset}>
                Retake the test
              </Button>
            </div>
          </div>
        </OrnateFrame>
      </TestShell>
    );
  }

  // In test
  const position = DNA_TEST_BANK.find((p) => p.id === currentId);
  if (!position) {
    return (
      <TestShell>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <p style={{ color: "var(--chq-text-2)" }}>Something went wrong loading the position.</p>
          <Button onClick={reset}>Restart</Button>
        </div>
      </TestShell>
    );
  }

  return (
    <TestShell>
      <TestRunner key={position.id} position={position} index={answers.length} reduced={reduced} onAnswer={answer} />
    </TestShell>
  );
}
