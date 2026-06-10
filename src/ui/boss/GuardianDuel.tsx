"use client";

/**
 * Guardian duel — the Prove step. The player replays THEIR side of the curated
 * line from memory against the Guardian (which answers with the line's replies).
 * Medium rules: 1 mistake allowed, no hints. Victory records a real sparring
 * session (FSRS cards + streak + XP) and the +150 Guardian bonus — mastery gold
 * (the Passport seal) still requires the retention bar (LAW #1, no shortcuts).
 * The board stays clean; the epic lives around it (LAW #3).
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Chess } from "chess.js";
import type { PieceDropHandlerArgs } from "react-chessboard";
import "./boss-fight.css";
import { Board } from "@/src/ui/board/Board";
import { ASSETS, getRealmBoss, type RealmId } from "@/src/lib/assets";
import { IconCrown } from "@/src/ui/shell/icons";
import { DIFFICULTY, PATH_SIDE, pathChallenges, type Guardian } from "@/src/domain/world/guardians";
import type { CuratedPath } from "@/src/domain/repertoire/types";
import { fenAfter } from "@/src/domain/repertoire/line";
import { XP_REWARDS } from "@/src/domain/gamification/xp";

const REALM_ACCENT: Record<RealmId, { accent: string; bright: string }> = {
  "ember-marches": { accent: "#e0413b", bright: "#ff6a52" },
  "obsidian-court": { accent: "#8a7bd8", bright: "#a99cea" },
  "aegis-bastion": { accent: "#4fb477", bright: "#6fd89a" },
  "mirage-bazaar": { accent: "#46c7d8", bright: "#6fe0ef" },
};

type Phase = "intro" | "duel" | "won" | "lost";
interface Attempt {
  correct: boolean;
  latencyMs: number;
  fen: string;
}

export function GuardianDuel({
  path,
  guardian,
  realm,
  openingName,
  userId,
}: {
  path: CuratedPath;
  guardian: Guardian;
  realm: RealmId;
  openingName: string;
  userId?: string;
}) {
  const side = PATH_SIDE[path.id] ?? "white";
  const allowed = DIFFICULTY.medium.mistakesAllowed;
  const totalChallenges = pathChallenges(path, side).length;
  const a = REALM_ACCENT[realm];

  const [phase, setPhase] = useState<Phase>("intro");
  const [ply, setPly] = useState(0);
  const [boardFen, setBoardFen] = useState(fenAfter(path, 0));
  const [mistakes, setMistakes] = useState(0);
  const [flash, setFlash] = useState<"idle" | "correct" | "wrong">("idle");
  const attemptsRef = useRef<Attempt[]>([]);
  const turnStartRef = useRef(0);
  const postedRef = useRef(false);

  const isPlayersPly = useCallback(
    (p: number) => (p % 2 === 0 ? "white" : "black") === side,
    [side],
  );
  const answered = pathChallenges(path, side).filter((c) => c.ply < ply).length;

  // Guardian answers its plies; victory closes the line.
  useEffect(() => {
    if (phase !== "duel") return;
    if (ply >= path.moves.length) {
      // Small beat before the victory screen — the last move lands first.
      const t = window.setTimeout(() => setPhase("won"), 350);
      return () => window.clearTimeout(t);
    }
    if (isPlayersPly(ply)) {
      turnStartRef.current = performance.now();
      return;
    }
    const t = window.setTimeout(() => {
      setBoardFen(fenAfter(path, ply + 1));
      setPly((p) => p + 1);
    }, 650);
    return () => window.clearTimeout(t);
  }, [phase, ply, path, isPlayersPly]);

  // Victory: persist the sparring session + Guardian bonus (signed-in players).
  useEffect(() => {
    if (phase !== "won" || postedRef.current || !userId) return;
    postedRef.current = true;
    void fetch("/api/guardian", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ pathId: path.id, attempts: attemptsRef.current }),
    });
  }, [phase, userId, path.id]);

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
      if (phase !== "duel" || targetSquare === null || !isPlayersPly(ply)) return false;

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
          if (next > allowed) setPhase("lost");
          return next;
        });
        return false; // snap back — the exam takes the line's move only
      }

      setFlash("correct");
      window.setTimeout(() => setFlash("idle"), 400);
      setBoardFen(game.fen());
      setPly((p) => p + 1);
      return true;
    },
    [phase, ply, path, allowed, isPlayersPly],
  );

  function restart() {
    attemptsRef.current = [];
    postedRef.current = false;
    setMistakes(0);
    setPly(0);
    setBoardFen(fenAfter(path, 0));
    setFlash("idle");
    setPhase("duel");
  }

  return (
    <div className="chq-boss" style={{ "--accent": a.accent, "--accent-bright": a.bright } as CSSProperties}>
      <div className="stage">
        <div className="bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getRealmBoss(realm)} alt="" />
        </div>
        <div className="glow" />
        <div className="topleft"><IconCrown /> Opening Guardian</div>

        {phase === "intro" && (
          <div className="center">
            <p className="eyebrow">Opening Guardian</p>
            <h1 className="name serif">{guardian.name}</h1>
            <p className="subtitle">{guardian.title}</p>
            <p className="desc">{guardian.lore}</p>
            <p className="taunt">&ldquo;{guardian.taunt}&rdquo;</p>
            <p className="howto">
              Play your side of the <b>{openingName}</b> from memory — {totalChallenges} moves,
              one slip forgiven. Win to push the line toward its <b>Passport seal</b>.
            </p>
            <button className="btn-gold" type="button" onClick={() => setPhase("duel")}>
              Begin the duel
            </button>
            <Link className="retreat" href="/quest">← Retreat</Link>
          </div>
        )}

        {(phase === "duel" || phase === "lost") && (
          <div className="duel">
            <div className="duel-head">
              <span className="serif dh-name">{guardian.name}</span>
              <span className="dh-meta">
                You command <b>{side === "white" ? "White" : "Black"}</b> · {answered}/{totalChallenges} moves ·{" "}
                {mistakes > allowed ? "no mistakes left" : `${allowed - mistakes} slip allowed`}
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
            <div className="duel-dots" aria-label={`${answered} of ${totalChallenges} moves played`}>
              {Array.from({ length: totalChallenges }, (_, i) => (
                <span key={i} className={`ddot${i < answered ? " hit" : ""}`} />
              ))}
            </div>

            {phase === "lost" && (
              <div className="duel-verdict">
                <p className="taunt">&ldquo;{guardian.taunt}&rdquo;</p>
                <p className="dv-text">The line slipped. Review it, then return.</p>
                <div className="dv-actions">
                  <button className="btn-gold" type="button" onClick={restart}>Fight again</button>
                  <Link className="retreat" href={`/train/${path.id}/learn`}>Review the line →</Link>
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "won" && (
          <div className="center">
            <p className="eyebrow">Victory</p>
            <h1 className="name serif">Guardian defeated</h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="win-seal" src={ASSETS.passport.stampMastered} alt="" />
            <p className="desc">
              The <b style={{ color: "var(--gold-bright, #f1d680)" }}>{openingName}</b> bends the knee.
              {userId ? ` +${XP_REWARDS.bossDefeated} XP — drill it to gold to stamp the seal in your Passport.` : " Sign in to record your victories."}
            </p>
            <div className="dv-actions">
              <Link className="btn-gold" href="/quest">Back to the realm →</Link>
              <Link className="retreat" href="/train">Today&apos;s training</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
