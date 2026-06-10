"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Chess } from "chess.js";
import type { PieceDropHandlerArgs } from "react-chessboard";
import type { CSSProperties } from "react";
import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GradientDefs, LogoMark, ProgressBar, ShieldIcon, PassportSeal } from "@/src/ui/design-system/icons";
import { ASSETS } from "@/src/lib/assets";
import { Button } from "@/src/ui/design-system/Button";
import { TestBoard } from "@/src/ui/design-system/TestBoard";
import { GUARDIANS, GUARDIAN_TREES, guardianChallenges, DIFFICULTY, type Difficulty } from "@/src/domain/world/guardians";
import type { MasteryTier } from "@/src/domain/world/types";
import { HERO_ACCENTS } from "@/src/ui/design-system/tokens";
import { useWorldProgress, progressFor } from "./useWorldProgress";
import { usePlayer } from "@/src/ui/player/usePlayer";
import { useEntitlement } from "@/src/ui/entitlement/useEntitlement";
import { SaveProgress } from "@/src/ui/account/SaveProgress";
import { AccountBoot } from "@/src/ui/account/AccountBoot";
import { track } from "@/src/lib/track";

const ACCENT = HERO_ACCENTS.warrior.base; // seed Guardian is in the Warrior world
const eyebrow = { fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase" } as const;
const TIER_RANK: Record<MasteryTier, number> = { none: 0, bronze: 1, silver: 2, gold: 3 };

function useHydrated() {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}

export function BossScreen() {
  const router = useRouter();
  const mounted = useHydrated();
  const updateProgress = useWorldProgress((s) => s.update);
  const progress = useWorldProgress((s) => s.progress);
  const addXp = usePlayer((s) => s.addXp);
  const isPro = useEntitlement((s) => s.isPro);

  const [phase, setPhase] = useState<"intro" | "fight" | "win" | "lose">("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [idx, setIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [hint, setHint] = useState(false);

  const openingId = mounted ? new URLSearchParams(window.location.search).get("opening") ?? "italian" : "italian";
  const guardian = GUARDIANS[openingId];
  const tree = GUARDIAN_TREES[openingId];
  const challenges = useMemo(() => (tree ? guardianChallenges(tree) : []), [tree]);

  // Award conquest exactly once when a validating difficulty is beaten.
  const awardedRef = useRef(false);
  useEffect(() => {
    if (phase !== "win" || !guardian) return;
    if (awardedRef.current) return;
    awardedRef.current = true;
    const cfg = DIFFICULTY[difficulty];
    const current = progressFor(progress, openingId).masteryTier;
    if (cfg.validates) {
      const earned: MasteryTier = difficulty === "hard" ? "gold" : "silver";
      const tier = TIER_RANK[earned] > TIER_RANK[current] ? earned : current;
      updateProgress(openingId, { conquered: true, masteryTier: tier });
      addXp(difficulty === "hard" ? 150 : 100);
      track("opening_conquered", { opening: openingId, difficulty });
      // TODO: nudge SRS intervals on conquest (success extends spacing).
    } else {
      const tier = TIER_RANK.bronze > TIER_RANK[current] ? "bronze" : current;
      updateProgress(openingId, { masteryTier: tier });
      addXp(25);
    }
  }, [phase, difficulty, guardian, openingId, progress, updateProgress, addXp]);

  if (!mounted) {
    return <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "grid", placeItems: "center", color: "var(--chq-text-muted)" }}>Loading…</div>;
  }

  if (!guardian || !tree) {
    return (
      <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "grid", placeItems: "center", textAlign: "center", padding: 24 }}>
        <div>
          <p style={{ color: "var(--chq-text-2)" }}>No Guardian for this opening yet.</p>
          <Button onClick={() => router.push("/world")} style={{ marginTop: 16 }}>← Back to the map</Button>
        </div>
      </div>
    );
  }

  const total = challenges.length;
  const cfg = DIFFICULTY[difficulty];

  const begin = (d: Difficulty) => {
    if (DIFFICULTY[d].pro && !isPro) {
      router.push(`/paywall?hard=${openingId}`);
      return;
    }
    setDifficulty(d);
    setPhase("fight");
    setIdx(0);
    setMistakes(0);
    setFeedback("idle");
    setHint(false);
    awardedRef.current = false;
  };

  // ── INTRO ────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <BossFrame>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 10, alignItems: "center", maxWidth: 460 }}>
          <p style={{ ...eyebrow, color: "var(--chq-text-2)" }}>Opening Guardian</p>
          <h1 className="chq-display" style={{ fontSize: 30, color: ACCENT, textTransform: "uppercase", margin: 0 }}>{guardian.name}</h1>
          <p style={{ ...eyebrow, color: "var(--chq-text-muted)" }}>{guardian.title}</p>
          <p style={{ color: "var(--chq-text-2)", fontSize: 14, lineHeight: 1.6 }}>{guardian.lore}</p>
          <p style={{ color: ACCENT, fontStyle: "italic", fontSize: 15, margin: "6px 0" }}>“{guardian.taunt}”</p>

          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            {(Object.keys(DIFFICULTY) as Difficulty[]).map((d) => {
              const locked = DIFFICULTY[d].pro && !isPro;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => begin(d)}
                  style={{
                    minHeight: 44,
                    padding: "0 16px",
                    borderRadius: "var(--chq-r-pill)",
                    background: d === "medium" ? "var(--chq-raised)" : "transparent",
                    border: `1px solid ${d === "medium" ? ACCENT : "var(--chq-line)"}`,
                    color: locked ? "var(--chq-text-muted)" : "var(--chq-text-1)",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  {DIFFICULTY[d].label}
                  {d === "medium" ? " ★" : ""}
                  {locked ? " 🔒" : ""}
                </button>
              );
            })}
          </div>
          <p style={{ ...eyebrow, color: "var(--chq-text-muted)", fontSize: 10 }}>Medium validates &amp; seals · Hard is Pro mastery</p>
          <Button variant="primary" onClick={() => begin(difficulty)} style={{ marginTop: 6 }}>Begin the duel</Button>
          <button type="button" onClick={() => router.push("/world")} style={{ background: "transparent", border: 0, color: "var(--chq-text-muted)", fontSize: 13, cursor: "pointer", marginTop: 4 }}>← Retreat</button>
        </div>
      </BossFrame>
    );
  }

  // ── WIN ──────────────────────────────────────────────────────────────────
  if (phase === "win") {
    return (
      <BossFrame>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          {cfg.validates ? (
            <>
              <PassportSeal size={96} className="chq-seal-stamp" />
              <h1 className="chq-display" style={{ fontSize: 26, color: ACCENT, textTransform: "uppercase", margin: 0 }}>Guardian Defeated</h1>
              <p style={{ color: "var(--chq-text-2)", fontSize: 14 }}>
                {guardian.name} falls. <b style={{ color: "var(--chq-text-1)" }}>{tree.name}</b> conquered — seal earned ({difficulty === "hard" ? "Gold" : "Silver"}). +{difficulty === "hard" ? 150 : 100} XP.
              </p>
              <Button variant="primary" onClick={() => router.push("/world")}>Return to the map →</Button>
              <div style={{ width: "100%", maxWidth: 340, marginTop: 8 }}>
                <SaveProgress />
              </div>
            </>
          ) : (
            <>
              <h1 className="chq-display" style={{ fontSize: 24, color: "var(--chq-text-1)", margin: 0 }}>Tutorial cleared</h1>
              <p style={{ color: "var(--chq-text-2)", fontSize: 14, maxWidth: 320 }}>
                Well played on Easy. Beat the Guardian at <b style={{ color: ACCENT }}>Medium</b> to truly conquer the opening and earn its seal.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <Button variant="primary" onClick={() => begin("medium")}>Try Medium →</Button>
                <Button variant="ghost" onClick={() => router.push("/world")}>Map</Button>
              </div>
            </>
          )}
        </div>
      </BossFrame>
    );
  }

  // ── LOSE ─────────────────────────────────────────────────────────────────
  if (phase === "lose") {
    return (
      <BossFrame>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <h1 className="chq-display" style={{ fontSize: 26, color: "var(--chq-state-leak, #d1495b)", margin: 0 }}>The Guardian holds</h1>
          <p style={{ color: "var(--chq-text-2)", fontSize: 14, maxWidth: 320 }}>{guardian.name} turns back your attack. Sharpen the line and return — no penalty.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <Button variant="primary" onClick={() => begin(difficulty)}>Retry {cfg.label}</Button>
            {difficulty !== "easy" && <Button variant="ghost" onClick={() => begin("easy")}>Drop to Easy</Button>}
            <Button variant="ghost" onClick={() => router.push("/world")}>Map</Button>
          </div>
        </div>
      </BossFrame>
    );
  }

  // ── FIGHT ────────────────────────────────────────────────────────────────
  const challenge = challenges[idx]!;
  const expected = challenge.expectedSan;
  const livesLeft = cfg.mistakesAllowed === Number.POSITIVE_INFINITY ? Infinity : cfg.mistakesAllowed - mistakes + 1;

  const squareStyles: Record<string, CSSProperties> = (() => {
    if (!hint || !cfg.hints) return {};
    try {
      const g = new Chess(challenge.fenBefore);
      const mv = g.move(expected);
      return { [mv.from]: { boxShadow: "inset 0 0 0 4px var(--chq-gold-3)" }, [mv.to]: { boxShadow: "inset 0 0 0 4px rgba(217,162,39,.5)" } };
    } catch {
      return {};
    }
  })();

  const advance = () => {
    setHint(false);
    if (idx + 1 >= total) setPhase("win");
    else {
      setIdx((i) => i + 1);
      setFeedback("idle");
    }
  };

  const onDrop = ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
    if (feedback !== "idle" || targetSquare === null) return false;
    const g = new Chess(challenge.fenBefore);
    let san: string;
    try {
      san = g.move({ from: sourceSquare, to: targetSquare, promotion: "q" }).san;
    } catch {
      return false;
    }
    if (san === expected) {
      setFeedback("correct");
      window.setTimeout(advance, 550);
      return true;
    }
    // wrong (engine/curated-confirmed off-line move)
    if (cfg.validates) {
      const m = mistakes + 1;
      setMistakes(m);
      if (m > cfg.mistakesAllowed) {
        setFeedback("wrong");
        window.setTimeout(() => setPhase("lose"), 600);
        return false;
      }
    }
    setFeedback("wrong");
    window.setTimeout(() => setFeedback("idle"), 900); // takeback / retry the position
    return false;
  };

  return (
    <BossFrame dim>
      <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="chq-display" style={{ fontSize: 13, color: ACCENT, textTransform: "uppercase" }}>{guardian.name} · {cfg.label}</span>
          <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {cfg.mistakesAllowed === Number.POSITIVE_INFINITY
              ? <span style={{ ...eyebrow, color: "var(--chq-text-muted)" }}>Tutorial</span>
              : Array.from({ length: Math.max(0, livesLeft) }, (_, i) => <ShieldIcon key={i} size={18} />)}
          </span>
        </div>

        <div>
          <p style={{ ...eyebrow, color: "var(--chq-text-2)", marginBottom: 4 }}>Survive the opening — {idx} / {total}</p>
          <ProgressBar value={idx / total} height={6} ariaLabel={`Survive: ${idx} of ${total}`} />
        </div>

        <div style={{ width: "min(480px, 86vw)", margin: "2px auto 0" }}>
          <TestBoard fen={challenge.fenBefore} orientation={tree.side} onPieceDrop={onDrop} allowDragging={feedback === "idle"} squareStyles={squareStyles} />
        </div>

        <p style={{ minHeight: 24, textAlign: "center", fontSize: 14 }} aria-live="polite">
          {feedback === "correct" ? (
            <span style={{ color: "var(--chq-state-solid, #3fb371)" }}>✓ {expected}</span>
          ) : feedback === "wrong" ? (
            <span style={{ color: "var(--chq-state-leak, #d1495b)" }}>✗ {cfg.validates ? "Off the line — careful." : `Not here — the move is ${expected}.`}</span>
          ) : (
            <span style={{ color: "var(--chq-text-muted)" }}>{challenge.fenBefore.split(" ")[1] === "w" ? "White" : "Black"} to move — hold the line.</span>
          )}
        </p>

        {cfg.hints && feedback === "idle" && (
          <Button variant="ghost" onClick={() => setHint(true)} style={{ margin: "0 auto" }}>Hint</Button>
        )}
      </div>
    </BossFrame>
  );
}

function BossFrame({ children, dim }: { children: React.ReactNode; dim?: boolean }) {
  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", position: "relative", display: "flex", flexDirection: "column" }}>
      <GradientDefs />
      <AccountBoot />
      {/* arena backdrop + Guardian character over it */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ASSETS.backgrounds.bossArena} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: dim ? 0.5 : 0.85 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/bosses/boss-warrior-italian.webp" alt="" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", maxHeight: "66%", maxWidth: "78%", objectFit: "contain", opacity: dim ? 0.22 : 0.55 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,10,.55), rgba(8,8,10,.9))" }} />
      </div>
      <header style={{ position: "relative", zIndex: 1, height: 56, display: "flex", alignItems: "center", gap: 8, padding: "0 20px" }}>
        <LogoMark size={24} />
        <span style={{ ...eyebrow, color: "var(--chq-text-2)" }}>Opening Guardian</span>
      </header>
      <main style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 20px 40px", width: "100%" }}>
        {children}
      </main>
    </div>
  );
}
