"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Chess } from "chess.js";
import type { PieceDropHandlerArgs } from "react-chessboard";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, LogoMark } from "@/src/ui/design-system/icons";
import { Button } from "@/src/ui/design-system/Button";
import { TestBoard } from "@/src/ui/design-system/TestBoard";
import { EXPLORER_TREES, lineForTrack, candidatesAt, type Candidate, type ExplorerOpening } from "@/src/domain/world/explorer";
import { MoveExplorerList, type ExplorerRow } from "./MoveExplorerList";
import { useWorldProgress } from "./useWorldProgress";
import { useSrs } from "./useSrs";

const START_FEN = new Chess().fen();
const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;

function useHydrated() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

/** Player-move ply indices (0-based) on the main line — the drillable moves. */
function playerPlyKeys(o: ExplorerOpening): string[] {
  const whiteToMove = o.side === "white";
  return o.mainLine.map((_, i) => i).filter((i) => (i % 2 === 0) === whiteToMove).map(String);
}

function Shell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <GradientDefs />
      <header style={{ height: 56, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 20px", borderBottom: "1px solid var(--chq-line)" }}>
        <LogoMark size={26} />
        <span className="chq-display chq-gold-text" style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>{title}</span>
      </header>
      <main style={{ flex: 1, width: "100%", maxWidth: 620, margin: "0 auto", padding: "16px 20px 48px" }}>{children}</main>
    </div>
  );
}

export function LearnScreen() {
  const router = useRouter();
  const mounted = useHydrated();
  const updateProgress = useWorldProgress((s) => s.update);
  const seedOpening = useSrs((s) => s.seedOpening);
  const [track, setTrack] = useState<string | null>(null); // null = main line
  const [ply, setPly] = useState(0);
  const [nudge, setNudge] = useState(false);
  const seededRef = useRef(false);

  const openingId = mounted ? new URLSearchParams(window.location.search).get("opening") ?? "italian" : "italian";
  const opening = EXPLORER_TREES[openingId];

  const line = useMemo(() => (opening ? lineForTrack(opening, track) : []), [opening, track]);
  const candidates = useMemo(() => (opening ? candidatesAt(opening, track, ply) : []), [opening, track, ply]);

  const onMainLine = track === null;
  const done = Boolean(opening) && onMainLine && ply >= (opening?.mainLine.length ?? 0);
  const currentFen = ply > 0 ? line[ply - 1]!.fen : START_FEN;
  const mainCandidate = candidates.find((c) => c.isMain) ?? null;

  // highlight the recommended (main) move's from/to
  const squareStyles = useMemo<Record<string, CSSProperties>>(() => {
    if (!mainCandidate) return {};
    try {
      const g = new Chess(currentFen);
      const mv = g.move(mainCandidate.node.san);
      return {
        [mv.from]: { boxShadow: "inset 0 0 0 4px var(--chq-gold-3)" },
        [mv.to]: { boxShadow: "inset 0 0 0 4px rgba(217,162,39,.5)" },
      };
    } catch {
      return {};
    }
  }, [currentFen, mainCandidate]);

  useEffect(() => {
    if (done && opening && !seededRef.current) {
      seededRef.current = true;
      updateProgress(openingId, { linesLearned: 1 });
      seedOpening(openingId, playerPlyKeys(opening));
    }
  }, [done, opening, openingId, updateProgress, seedOpening]);

  if (!mounted) return <Shell title="Learn"><p style={{ color: "var(--chq-text-muted)" }}>Loading…</p></Shell>;

  if (!opening) {
    return (
      <Shell title="Learn">
        <p style={{ color: "var(--chq-text-2)", textAlign: "center" }}>This opening isn&apos;t curated yet.</p>
        <Button onClick={() => router.push("/world")} style={{ margin: "16px auto 0", display: "flex" }}>← Back to the map</Button>
      </Shell>
    );
  }

  const choose = (c: Candidate) => {
    setNudge(false);
    if (c.branchTo !== track) setTrack(c.branchTo);
    setPly((p) => p + 1);
  };

  const back = () => {
    setNudge(false);
    setPly((p) => {
      const np = Math.max(0, p - 1);
      if (track) {
        const v = opening.variations.find((x) => x.name === track);
        if (v && np <= v.fromPly) setTrack(null);
      }
      return np;
    });
  };

  const backToMain = () => {
    const v = opening.variations.find((x) => x.name === track);
    setNudge(false);
    setTrack(null);
    setPly(v ? v.fromPly : 0);
  };

  const onDrop = ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
    if (done || targetSquare === null) return false;
    const g = new Chess(currentFen);
    let san: string;
    try {
      san = g.move({ from: sourceSquare, to: targetSquare, promotion: "q" }).san;
    } catch {
      return false;
    }
    const cand = candidates.find((c) => c.node.san === san);
    if (cand) { choose(cand); return true; }
    setNudge(true);
    return false;
  };

  const sideToMove = currentFen.split(" ")[1] === "w" ? "White" : "Black";
  const variationLabel = track ?? "Giuoco Piano — main line";
  const rows: ExplorerRow[] = candidates.map((c) => ({
    san: c.node.san,
    name: c.isMain ? (track ?? "Main line") : c.name,
    explain: c.explain,
    explorer: c.node.explorer,
    highlight: c.isMain,
    tag: c.isMain ? { label: "Main", tone: "gold" } : undefined,
    onClick: () => choose(c),
  }));

  return (
    <Shell title={`${opening.openingName} · Learn`}>
      {/* breadcrumb + counter */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, gap: 12 }}>
        <span style={{ ...eyebrow, color: "var(--chq-gold-3)", fontSize: 10 }}>{variationLabel}</span>
        <span style={{ ...eyebrow, color: "var(--chq-text-2)", fontSize: 10, whiteSpace: "nowrap" }}>{opening.eco} · {sideToMove} to move</span>
      </div>
      <div style={{ overflowX: "auto", whiteSpace: "nowrap", padding: "6px 0", marginBottom: 10, fontFamily: "var(--font-cinzel), serif", fontSize: 14, letterSpacing: ".02em" }}>
        {line.map((n, i) => {
          const showNo = i % 2 === 0;
          const isNext = i === ply;
          const played = i < ply;
          return (
            <span key={i} style={{ color: isNext ? "var(--chq-gold-2)" : played ? "var(--chq-text-1)" : "var(--chq-text-muted)", fontWeight: isNext ? 700 : 400 }}>
              {showNo ? `${i / 2 + 1}.` : ""}{n.san}{" "}
            </span>
          );
        })}
      </div>

      <div style={{ width: "min(440px, 84vw)", margin: "0 auto" }}>
        <TestBoard fen={currentFen} orientation={opening.side} onPieceDrop={onDrop} allowDragging={!done} squareStyles={squareStyles} />
      </div>

      {done ? (
        <div style={{ textAlign: "center", marginTop: 18, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          <p className="chq-display" style={{ color: "var(--chq-state-solid, #3fb371)", fontSize: 22, margin: 0 }}>✓ Line learned!</p>
          <p style={{ color: "var(--chq-text-2)", fontSize: 14 }}>Your spaced-repetition cards are ready — drill them to lock the line into memory.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
            <Button variant="primary" onClick={() => router.push(`/world/drill?opening=${openingId}`)}>Drill it →</Button>
            <Button variant="ghost" onClick={() => router.push("/world")}>Back to map</Button>
          </div>
        </div>
      ) : (
        <>
          {/* authored caption (RPG-framed) for the recommended move */}
          {mainCandidate ? (
            <div style={{ background: "var(--chq-panel)", border: "1px solid var(--chq-gold-4)", borderRadius: "var(--chq-r-panel)", padding: 14, marginTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="chq-display" style={{ fontSize: 18, color: "var(--chq-gold-3)" }}>{mainCandidate.node.san}</span>
                {mainCandidate.node.isCritical && <span style={{ ...eyebrow, fontSize: 9, color: "#08080A", background: "var(--chq-gold-gradient)", padding: "3px 7px", borderRadius: "var(--chq-r-pill)", fontWeight: 700 }}>Critical</span>}
              </div>
              <p style={{ color: "var(--chq-text-2)", fontSize: 14, lineHeight: 1.5, marginTop: 6 }}>{mainCandidate.node.explain}</p>
              {nudge && <p style={{ color: "var(--chq-state-leak, #d1495b)", fontSize: 13, marginTop: 8 }}>That move isn&apos;t in this line — try a move below, or drag {mainCandidate.node.san}.</p>}
            </div>
          ) : (
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <p style={{ color: "var(--chq-text-2)", fontSize: 14 }}>End of the {variationLabel}. Step back to explore other moves.</p>
            </div>
          )}

          {/* explorer-style candidate list */}
          {rows.length > 0 && (
            <>
              <p style={{ ...eyebrow, color: "var(--chq-text-muted)", fontSize: 9, margin: "16px 0 8px" }}>Moves here {candidates.some((c) => c.node.explorer) ? "· popularity from explorer" : ""}</p>
              <MoveExplorerList rows={rows} ariaLabel="Candidate moves for this position" />
            </>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, gap: 10, flexWrap: "wrap" }}>
            <Button variant="ghost" onClick={back} disabled={ply === 0}>← Back</Button>
            {track && <Button variant="ghost" onClick={backToMain}>↩ Main line</Button>}
            {mainCandidate && <Button variant="primary" onClick={() => choose(mainCandidate)}>Play {mainCandidate.node.san} →</Button>}
          </div>
        </>
      )}
    </Shell>
  );
}
