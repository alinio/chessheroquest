"use client";

/**
 * Kingdom Boss gauntlet — the realm-completion ceremony. The player proves all
 * FIVE openings of the realm back-to-back from memory (2 slips total across the
 * run). The realm "claimed" state itself is derived from gold mastery (LAW #1);
 * the gauntlet is the crowning duel + its XP. Board clean, epic around (LAW #3).
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Chess } from "chess.js";
import type { PieceDropHandlerArgs } from "react-chessboard";
import "./boss-fight.css";
import { Board } from "@/src/ui/board/Board";
import { type RealmId } from "@/src/lib/assets";
import { IconCrown } from "@/src/ui/shell/icons";
import { PATH_SIDE, pathChallenges } from "@/src/domain/world/guardians";
import type { CuratedPath } from "@/src/domain/repertoire/types";
import { fenAfter } from "@/src/domain/repertoire/line";
import { XP_REWARDS } from "@/src/domain/gamification/xp";

const REALM_ACCENT: Record<RealmId, { accent: string; bright: string }> = {
  "ember-marches": { accent: "#e0413b", bright: "#ff6a52" },
  "obsidian-court": { accent: "#8a7bd8", bright: "#a99cea" },
  "aegis-bastion": { accent: "#4fb477", bright: "#6fd89a" },
  "mirage-bazaar": { accent: "#46c7d8", bright: "#6fe0ef" },
};

const ENDBOSS_ART: Record<RealmId, string> = {
  "ember-marches": "/art/bosses/endboss-warrior.webp",
  "obsidian-court": "/art/bosses/endboss-strategist.webp",
  "aegis-bastion": "/art/bosses/endboss-defender.webp",
  "mirage-bazaar": "/art/bosses/endboss-trickster.webp",
};

const MISTAKES_ALLOWED = 2;

type Phase = "intro" | "duel" | "interlude" | "won" | "lost";
interface Attempt {
  correct: boolean;
  latencyMs: number;
  fen: string;
}

export function RealmGauntlet({
  realm,
  realmName,
  bossName,
  bossTitle,
  paths,
  userId,
}: {
  realm: RealmId;
  realmName: string;
  bossName: string;
  bossTitle: string;
  paths: CuratedPath[];
  userId?: string;
}) {
  const a = REALM_ACCENT[realm];

  const [phase, setPhase] = useState<Phase>("intro");
  const [pathIndex, setPathIndex] = useState(0);
  const [ply, setPly] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  // Pedagogical slip toast — the slip is already counted, hiding the theory
  // move has no exam value left (same contract as the Guardian duel).
  const [slipNote, setSlipNote] = useState<string | null>(null);
  const attemptsRef = useRef<Attempt[]>([]);
  const turnStartRef = useRef(0);
  const postedRef = useRef(false);

  const path = paths[pathIndex]!;
  const side = PATH_SIDE[path.id] ?? "white";
  const boardFen = fenAfter(path, ply);
  const isPlayersPly = useCallback(
    (p: number) => (p % 2 === 0 ? "white" : "black") === side,
    [side],
  );
  const totalThisPath = pathChallenges(path, side).length;
  const answeredThisPath = pathChallenges(path, side).filter((c) => c.ply < ply).length;

  // The Kingdom Boss answers its plies; finishing a line advances the gauntlet.
  useEffect(() => {
    if (phase !== "duel") return;
    if (ply >= path.moves.length) {
      const last = pathIndex >= paths.length - 1;
      const t = window.setTimeout(() => setPhase(last ? "won" : "interlude"), 400);
      return () => window.clearTimeout(t);
    }
    if (isPlayersPly(ply)) {
      turnStartRef.current = performance.now();
      return;
    }
    const t = window.setTimeout(() => setPly((p) => p + 1), 600);
    return () => window.clearTimeout(t);
  }, [phase, ply, path, pathIndex, paths.length, isPlayersPly]);

  // Interlude → next opening.
  useEffect(() => {
    if (phase !== "interlude") return;
    const t = window.setTimeout(() => {
      setPathIndex((i) => i + 1);
      setPly(0);
      setFlash("idle");
      setPhase("duel");
    }, 1100);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Victory: persist the gauntlet run (signed-in players).
  useEffect(() => {
    if (phase !== "won" || postedRef.current || !userId) return;
    postedRef.current = true;
    void fetch("/api/gauntlet", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ realm, attempts: attemptsRef.current }),
    });
  }, [phase, userId, realm]);

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
      if (phase !== "duel" || targetSquare === null || !isPlayersPly(ply) || ply >= path.moves.length) return false;

      const game = new Chess(fenAfter(path, ply));
      let san: string;
      try {
        san = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" }).san;
      } catch {
        return false; // illegal — chess.js is the truth
      }

      const latencyMs = Math.round(performance.now() - turnStartRef.current);
      const correct = san === path.moves[ply];
      attemptsRef.current.push({ correct, latencyMs, fen: fenAfter(path, ply) });

      if (!correct) {
        setFlash("wrong");
        window.setTimeout(() => setFlash("idle"), 600);
        setMistakes((m) => {
          const next = m + 1;
          if (next > MISTAKES_ALLOWED) setPhase("lost");
          else {
            const idea = path.comments?.[ply];
            setSlipNote(
              `Slip ${next} of ${MISTAKES_ALLOWED} — the line plays ${path.moves[ply]}${idea ? `: ${idea}` : "."} Play it to continue.`,
            );
          }
          return next;
        });
        return false;
      }

      setFlash("correct");
      setSlipNote(null);
      window.setTimeout(() => setFlash("idle"), 400);
      setPly((p) => p + 1);
      return true;
    },
    [phase, ply, path, isPlayersPly],
  );

  function restart() {
    attemptsRef.current = [];
    postedRef.current = false;
    setMistakes(0);
    setPathIndex(0);
    setPly(0);
    setFlash("idle");
    setPhase("duel");
  }

  return (
    <div className="chq-boss" style={{ "--accent": a.accent, "--accent-bright": a.bright } as CSSProperties}>
      <div className="stage">
        <div className="bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ENDBOSS_ART[realm]} alt="" />
        </div>
        <div className="glow" />
        <div className="topleft"><IconCrown /> Kingdom Boss · {realmName}</div>

        {phase === "intro" && (
          <div className="center">
            <p className="eyebrow">The Gauntlet</p>
            <h1 className="name serif">{bossName}</h1>
            <p className="subtitle">{bossTitle}</p>
            <p className="desc">
              All five openings of the {realmName}, back to back, from memory.
              {" "}{MISTAKES_ALLOWED} slips for the whole run — then the realm is yours.
            </p>
            <p className="howto">
              {paths.map((p) => p.name.split(" — ")[0]).join(" · ")}
            </p>
            <p className="howto" style={{ opacity: 0.8 }}>
              All five are gold in your Passport. Now prove them in one breath.
            </p>
            <button className="btn-gold" type="button" onClick={() => setPhase("duel")}>
              Face the Gauntlet
            </button>
            <Link className="retreat" href="/quest">← Retreat</Link>
          </div>
        )}

        {(phase === "duel" || phase === "lost") && (
          <div className="duel">
            <div className="duel-head">
              <span className="serif dh-name">{bossName}</span>
              <span className="dh-meta">
                Opening {pathIndex + 1}/{paths.length} · <b>{path.name}</b> · you command <b>{side === "white" ? "White" : "Black"}</b>
                {" "}· {answeredThisPath}/{totalThisPath} moves · {Math.max(0, MISTAKES_ALLOWED - mistakes)} slips left
              </span>
            </div>
            <div className={`duel-board ${flash}`}>
              <Board
                position={boardFen}
                onPieceDrop={onPieceDrop}
                orientation={side}
                allowDragging={phase === "duel" && isPlayersPly(ply)}
              />
            </div>
            {slipNote && phase === "duel" && (
              <p className="dv-text" aria-live="polite" style={{ maxWidth: 460, textAlign: "center" }}>{slipNote}</p>
            )}
            <div className="duel-dots" aria-label={`opening ${pathIndex + 1} of ${paths.length}`}>
              {paths.map((p, i) => (
                <span key={p.id} className={`ddot${i < pathIndex || (i === pathIndex && ply >= path.moves.length) ? " hit" : ""}`} />
              ))}
            </div>
            {/* fine dots — YOUR moves inside the current line (how much is left) */}
            <div className="duel-dots" aria-label={`move ${answeredThisPath} of ${totalThisPath} in this line`} style={{ gap: 5, opacity: 0.85 }}>
              {pathChallenges(path, side).map((c) => (
                <span key={c.ply} className={`ddot${c.ply < ply ? " hit" : ""}`} style={{ width: 7, height: 7 }} />
              ))}
            </div>

            {phase === "lost" && (
              <div className="duel-verdict">
                <p className="dv-text">
                  The Gauntlet holds. {MISTAKES_ALLOWED + 1} slips — the <b>{path.name.split(" — ")[0]}</b> is where it broke. Drill it, then return.
                </p>
                <div className="dv-actions">
                  <button className="btn-gold" type="button" onClick={restart}>Run it again</button>
                  <Link className="retreat" href="/quest">← Back to the realm</Link>
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "interlude" && (
          <div className="center">
            <p className="eyebrow">Opening {pathIndex + 1} cleared</p>
            <h1 className="name serif">Next: {paths[pathIndex + 1]?.name.split(" — ")[0]}</h1>
            {/* The side switch between lines is THE gauntlet trap — announce it. */}
            <p className="desc">
              You command{" "}
              <b>{(PATH_SIDE[paths[pathIndex + 1]?.id ?? ""] ?? "white") === "white" ? "White" : "Black"}</b>.
            </p>
          </div>
        )}

        {phase === "won" && (
          <div className="center">
            <p className="eyebrow">The Gauntlet falls</p>
            <h1 className="name serif">Realm claimed</h1>
            <p className="desc">
              {bossName} bends the knee. The <b style={{ color: "var(--gold-bright, #f1d680)" }}>{realmName}</b> is yours
              {userId ? ` — +${XP_REWARDS.kingdomConquered} XP.` : ". Sign in to record your conquests."}
            </p>
            <div className="dv-actions">
              <Link className="btn-gold" href="/realms">The four realms →</Link>
              <Link className="retreat" href="/train">Today&apos;s training</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
