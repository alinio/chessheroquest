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
import { useSrs, dueCount } from "./useSrs";

const START_FEN = new Chess().fen();

function useHydrated() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;

function Shell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <GradientDefs />
      <header style={{ height: 56, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 20px", borderBottom: "1px solid var(--chq-line)" }}>
        <LogoMark size={26} />
        <span className="chq-display chq-gold-text" style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>{title}</span>
      </header>
      <main style={{ flex: 1, width: "100%", maxWidth: 560, margin: "0 auto", padding: "16px 20px 40px" }}>{children}</main>
    </div>
  );
}

export function DrillScreen() {
  const router = useRouter();
  const mounted = useHydrated();
  const cardsByOpening = useSrs((s) => s.cards);
  const seedOpening = useSrs((s) => s.seedOpening);
  const review = useSrs((s) => s.review);
  const updateProgress = useWorldProgress((s) => s.update);

  const [queue, setQueue] = useState<string[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [hint, setHint] = useState(false);

  const openingId = mounted ? new URLSearchParams(window.location.search).get("opening") ?? "italian" : "italian";
  const tree = LINE_TREES[openingId];
  const line = useMemo(() => (tree ? mainLine(tree) : []), [tree]);
  const cards = cardsByOpening[openingId] ?? [];

  // Persist accuracy + post-review due count once, when the session completes.
  const completed = queue !== null && idx >= queue.length;
  const savedRef = useRef(false);
  useEffect(() => {
    if (completed && tree && !savedRef.current) {
      savedRef.current = true;
      const correct = results.filter(Boolean).length;
      const accuracy = results.length > 0 ? correct / results.length : 0;
      updateProgress(openingId, { drillAccuracy: accuracy, srsDueCount: dueCount(useSrs.getState().cards[openingId], Date.now()) });
    }
  }, [completed, tree, openingId, results, updateProgress]);

  if (!mounted) return <Shell title="Drill"><p style={{ color: "var(--chq-text-muted)" }}>Loading…</p></Shell>;

  if (!tree) {
    return (
      <Shell title="Drill">
        <p style={{ color: "var(--chq-text-2)", textAlign: "center" }}>This opening isn&apos;t curated yet.</p>
        <Button onClick={() => router.push("/world")} style={{ margin: "16px auto 0", display: "flex" }}>← Back to the map</Button>
      </Shell>
    );
  }

  const now = Date.now();
  const due = dueCount(cards, now);
  const mastered = cards.filter((c) => c.reps >= 2).length;

  const start = () => {
    // Seed if the player drills before learning (runnable standalone), then read
    // the fresh store state (zustand set is synchronous).
    if (cards.length === 0) seedOpening(openingId, playerPlies(tree).map(String));
    const fresh = useSrs.getState().cards[openingId] ?? [];
    const dueRefs = fresh.filter((c) => c.due <= Date.now()).map((c) => c.ref);
    const refs = (dueRefs.length > 0 ? dueRefs : playerPlies(tree).map(String)).sort((a, b) => Number(a) - Number(b));
    setQueue(refs);
    setIdx(0);
    setResults([]);
    setFeedback("idle");
    setHint(false);
  };

  // Pre-screen
  if (queue === null) {
    return (
      <Shell title={`${tree.name} · Drill`}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 14, alignItems: "center", marginTop: 24 }}>
          <p style={{ ...eyebrow, color: "var(--chq-text-2)" }}>Spaced-repetition drill</p>
          <div style={{ display: "flex", gap: 24 }}>
            <div><div className="chq-display chq-gold-text" style={{ fontSize: 40, fontWeight: 700 }}>{due}</div><div style={{ ...eyebrow, color: "var(--chq-text-muted)" }}>Due</div></div>
            <div><div className="chq-display" style={{ fontSize: 40, fontWeight: 700, color: "var(--chq-text-1)" }}>{mastered}</div><div style={{ ...eyebrow, color: "var(--chq-text-muted)" }}>Mastered</div></div>
          </div>
          <p style={{ color: "var(--chq-text-2)", fontSize: 14, maxWidth: 320 }}>
            Play the line from memory. Each answer reschedules its card (SM-2).
            {due === 0 && cards.length > 0 ? " Nothing due — you'll review ahead." : ""}
          </p>
          <Button variant="primary" onClick={start}>{due > 0 ? `Drill ${due} due` : "Drill the line"}</Button>
          <Button variant="ghost" onClick={() => router.push("/world")}>← Map</Button>
          {/* TODO: free drill cap ~20/day → Pro nudge (M8 entitlement) */}
        </div>
      </Shell>
    );
  }

  const done = idx >= queue.length;

  if (done) {
    const correct = results.filter(Boolean).length;
    const accuracy = results.length > 0 ? correct / results.length : 0;
    // (persistence handled by the completion effect above)
    return (
      <Shell title={`${tree.name} · Drill`}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center", marginTop: 24 }}>
          <p style={{ ...eyebrow, color: "var(--chq-text-2)" }}>Drill complete</p>
          <div className="chq-display chq-gold-text" style={{ fontSize: 56, fontWeight: 700 }}>{correct}/{results.length}</div>
          <p style={{ color: "var(--chq-text-2)", fontSize: 14 }}>{Math.round(accuracy * 100)}% accurate · cards rescheduled.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <Button variant="primary" onClick={() => router.push(`/boss?opening=${openingId}`)}>Face the Guardian →</Button>
            <Button variant="ghost" onClick={() => setQueue(null)}>Drill again</Button>
            <Button variant="ghost" onClick={() => router.push("/world")}>Map</Button>
          </div>
        </div>
      </Shell>
    );
  }

  const ref = queue[idx]!;
  const ply = Number(ref);
  const currentFen = ply > 0 ? line[ply - 1]!.fen : START_FEN;
  const expected = line[ply]!;

  const squareStyles: Record<string, CSSProperties> = (() => {
    if (!hint) return {};
    try {
      const g = new Chess(currentFen);
      const mv = g.move(expected.san);
      return { [mv.from]: { boxShadow: "inset 0 0 0 4px var(--chq-gold-3)" }, [mv.to]: { boxShadow: "inset 0 0 0 4px rgba(217,162,39,.5)" } };
    } catch {
      return {};
    }
  })();

  const answer = (correct: boolean) => {
    if (feedback !== "idle") return;
    review(openingId, ref, correct);
    setResults((r) => [...r, correct]);
    setFeedback(correct ? "correct" : "wrong");
  };

  const onDrop = ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
    if (feedback !== "idle" || targetSquare === null) return false;
    const g = new Chess(currentFen);
    let san: string;
    try {
      san = g.move({ from: sourceSquare, to: targetSquare, promotion: "q" }).san;
    } catch {
      return false;
    }
    const correct = san === expected.san;
    answer(correct);
    return correct; // keep correct move on the board; snap back a wrong one
  };

  const next = () => {
    setFeedback("idle");
    setHint(false);
    setIdx((i) => i + 1);
  };

  return (
    <Shell title={`${tree.name} · Drill`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ ...eyebrow, color: "var(--chq-text-2)" }}>{idx + 1} / {queue.length}</span>
        <span style={{ ...eyebrow, color: "var(--chq-text-muted)" }}>Due {due} · Mastered {mastered}</span>
      </div>

      <div style={{ width: "min(480px, 86vw)", margin: "0 auto" }}>
        <TestBoard fen={currentFen} orientation={tree.side} onPieceDrop={onDrop} allowDragging={feedback === "idle"} squareStyles={squareStyles} />
      </div>

      <p style={{ minHeight: 44, textAlign: "center", marginTop: 12 }} aria-live="polite">
        {feedback === "idle" ? (
          <span style={{ color: "var(--chq-text-muted)", fontSize: 14 }}>{currentFen.split(" ")[1] === "w" ? "White" : "Black"} to move — play the line from memory.</span>
        ) : feedback === "correct" ? (
          <span style={{ color: "var(--chq-state-solid, #3fb371)", fontSize: 15 }}>✓ Correct — {expected.san} was the move.</span>
        ) : (
          <span style={{ color: "var(--chq-state-leak, #d1495b)", fontSize: 15 }}>
            ✗ The line is <b>{expected.san}</b>.{/* TODO: stockfish eval of the played move for a deeper "why" (src/data/stockfish.ts) */}
          </span>
        )}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        {feedback === "idle" ? (
          <>
            <Button variant="ghost" onClick={() => setHint(true)}>Hint</Button>
            <Button variant="ghost" onClick={() => answer(false)}>Skip</Button>
          </>
        ) : (
          <Button variant="primary" onClick={next} style={{ marginLeft: "auto" }}>
            {idx + 1 >= queue.length ? "Finish" : "Next →"}
          </Button>
        )}
      </div>
    </Shell>
  );
}
