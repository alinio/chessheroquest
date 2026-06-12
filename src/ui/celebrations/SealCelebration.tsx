"use client";

/**
 * Full-screen SEAL celebration (tier 3, one-time — target-experience-spec §B6).
 * Fires on a Guardian victory when the line's mastery is already gold: the
 * seal stamps down (1.6 → 1, 600ms; plain fade under reduced-motion) over the
 * three earned steps and the real count. Shown ONCE per opening
 * (localStorage chq.seal.<pathId>.v1) — a replayed duel never replays it.
 *
 * Nudge note (spec §B5): this screen IS the seal explainer, so it consumes the
 * "seal" nudge slot — chq.nudge.seal.v1 is marked seen here and no separate
 * seal popover ever shows.
 */
import { useEffect } from "react";
import "./celebrations.css";
import { ASSETS } from "@/src/lib/assets";

export const sealSeenKey = (pathId: string) => `chq.seal.${pathId}.v1`;

export function SealCelebration({
  pathId,
  openingName,
  sealCount,
  totalSeals,
  onContinue,
}: {
  pathId: string;
  openingName: string;
  /** Seal count INCLUDING this one (real: sealed-before + 1). */
  sealCount: number;
  totalSeals: number;
  onContinue: () => void;
}) {
  // One-shot: mark as seen the moment it renders (a refresh never replays it),
  // and consume the seal nudge — this screen already explains the concept.
  useEffect(() => {
    try {
      window.localStorage.setItem(sealSeenKey(pathId), "1");
      window.localStorage.setItem("chq.nudge.seal.v1", "1");
      // Arm the one-time Passport stamp arrival (scroll + scale-in over there).
      window.sessionStorage.setItem("chq.stamp.pending.v1", pathId);
    } catch {
      /* storage unavailable — the celebration still shows this once */
    }
  }, [pathId]);

  return (
    <div className="chq-sealfx" role="dialog" aria-label={`${openingName} sealed`}>
      <div className="sfx-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sfx-stamp" src={ASSETS.passport.stampMastered} alt="" />
        <p className="sfx-eyebrow">Passport seal</p>
        <h2 className="sfx-title">Sealed — the {openingName}</h2>
        <p className="sfx-steps">
          Studied to the end. Drilled to Gold. Guardian defeated.
        </p>
        <p className="sfx-count">{sealCount} of {totalSeals} seals</p>
        <button className="sfx-continue" type="button" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
