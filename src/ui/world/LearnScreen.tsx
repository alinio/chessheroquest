"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Chess } from "chess.js";
import type { PieceDropHandlerArgs } from "react-chessboard";
import type { CSSProperties } from "react";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, LogoMark } from "@/src/ui/design-system/icons";
import { Button } from "@/src/ui/design-system/Button";
import { TestBoard } from "@/src/ui/design-system/TestBoard";
import { LINE_TREES, mainLine, playerPlies } from "@/src/domain/world/italian";
import { useWorldProgress } from "./useWorldProgress";
import { useSrs } from "./useSrs";

const START_FEN = new Chess().fen();

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;

function Shell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <GradientDefs />
      <header style={{ height: 56, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 20px", borderBottom: "1px solid var(--chq-line)" }}>
        <LogoMark size={26} />
        <span className="chq-display chq-gold-text" style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>
          {title}
        </span>
      </header>
      <main style={{ flex: 1, width: "100%", maxWidth: 560, margin: "0 auto", padding: "16px 20px 40px" }}>{children}</main>
    </div>
  );
}

export function LearnScreen() {
  const router = useRouter();
  const mounted = useHydrated();
  const updateProgress = useWorldProgress((s) => s.update);
  const seedOpening = useSrs((s) => s.seedOpening);
  const [step, setStep] = useState(0);
  const [nudge, setNudge] = useState(false);
  const seededRef = useRef(false);

  const openingId = mounted ? new URLSearchParams(window.location.search).get("opening") ?? "italian" : "italian";
  const tree = LINE_TREES[openingId];
  const line = useMemo(() => (tree ? mainLine(tree) : []), [tree]);

  const done = line.length > 0 && step >= line.length;
  const currentFen = step > 0 ? line[step - 1]!.fen : START_FEN;
  const expected = !done && line.length > 0 ? line[step]! : null;

  // Guide highlight: the from/to squares of the move to learn.
  const squareStyles = useMemo<Record<string, CSSProperties>>(() => {
    if (!expected) return {};
    try {
      const g = new Chess(currentFen);
      const mv = g.move(expected.san);
      return {
        [mv.from]: { boxShadow: "inset 0 0 0 4px var(--chq-gold-3)" },
        [mv.to]: { boxShadow: "inset 0 0 0 4px rgba(217,162,39,.5)" },
      };
    } catch {
      return {};
    }
  }, [currentFen, expected]);

  // On completion: mark the line learned + seed the SRS cards (once).
  useEffect(() => {
    if (done && tree && !seededRef.current) {
      seededRef.current = true;
      updateProgress(openingId, { linesLearned: 1 });
      seedOpening(openingId, playerPlies(tree).map(String));
    }
  }, [done, tree, openingId, updateProgress, seedOpening]);

  if (!mounted) {
    return (
      <Shell title="Learn">
        <p style={{ color: "var(--chq-text-muted)" }}>Loading…</p>
      </Shell>
    );
  }

  if (!tree) {
    return (
      <Shell title="Learn">
        <p style={{ color: "var(--chq-text-2)", textAlign: "center" }}>This opening isn&apos;t curated yet.</p>
        <Button onClick={() => router.push("/world")} style={{ margin: "16px auto 0", display: "flex" }}>← Back to the map</Button>
      </Shell>
    );
  }

  const onDrop = ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
    if (!expected || targetSquare === null) return false;
    const g = new Chess(currentFen);
    let san: string;
    try {
      san = g.move({ from: sourceSquare, to: targetSquare, promotion: "q" }).san;
    } catch {
      return false;
    }
    if (san === expected.san) {
      setNudge(false);
      setStep((s) => s + 1);
      return true;
    }
    setNudge(true);
    return false;
  };

  return (
    <Shell title={`${tree.name} · Learn`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ ...eyebrow, color: "var(--chq-text-2)" }}>Main line — guided</span>
        <span style={{ ...eyebrow, color: "var(--chq-gold-3)" }}>Move {Math.min(step + 1, line.length)} / {line.length}</span>
      </div>

      <div style={{ width: "min(480px, 86vw)", margin: "0 auto" }}>
        <TestBoard fen={currentFen} orientation={tree.side} onPieceDrop={onDrop} allowDragging={!done} squareStyles={squareStyles} />
      </div>

      {done ? (
        <div style={{ textAlign: "center", marginTop: 18, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          <p className="chq-display" style={{ color: "var(--chq-state-solid, #3fb371)", fontSize: 22, margin: 0 }}>✓ Line learned!</p>
          <p style={{ color: "var(--chq-text-2)", fontSize: 14 }}>
            Your spaced-repetition cards are ready — drill them to lock the line into memory.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <Button variant="primary" onClick={() => router.push(`/world/drill?opening=${openingId}`)}>Drill it →</Button>
            <Button variant="ghost" onClick={() => router.push("/world")}>Back to map</Button>
          </div>
        </div>
      ) : (
        <>
          <p style={{ textAlign: "center", fontSize: 13, color: "var(--chq-text-muted)", margin: "12px 0 6px" }}>
            {currentFen.split(" ")[1] === "w" ? "White" : "Black"} to move
          </p>
          <div style={{ background: "var(--chq-panel)", border: "1px solid var(--chq-line)", borderRadius: "var(--chq-r-panel)", padding: 16, textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span className="chq-display" style={{ fontSize: 20, color: "var(--chq-gold-3)" }}>{expected?.san}</span>
              {expected?.isCritical && (
                <span style={{ ...eyebrow, fontSize: 9, color: "#08080A", background: "var(--chq-gold-gradient)", padding: "3px 7px", borderRadius: "var(--chq-r-pill)", fontWeight: 700 }}>
                  Critical
                </span>
              )}
            </div>
            <p style={{ color: "var(--chq-text-2)", fontSize: 14, lineHeight: 1.5, marginTop: 8 }}>{expected?.comment}</p>
            {nudge && (
              <p style={{ color: "var(--chq-state-leak, #d1495b)", fontSize: 13, marginTop: 8 }}>
                Not the main line here — play {expected?.san} (drag it, or tap “Play it”).
              </p>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            <Button variant="ghost" onClick={() => { setNudge(false); setStep((s) => Math.max(0, s - 1)); }} disabled={step === 0}>
              ← Back
            </Button>
            <Button variant="primary" onClick={() => { setNudge(false); setStep((s) => s + 1); }}>
              Play it →
            </Button>
          </div>
        </>
      )}
    </Shell>
  );
}
