"use client";

/**
 * Arrival — the coach's diagnosis (board + plan). Chess-first and pedagogical: a real
 * board shows where the player loses, beside a concrete plan (strength / gap + first
 * session). Opening IQ is demoted to a small chip. Immersive, no shell, shown once
 * post-payment. onStart → drill the GAP opening; onSkip → Today.
 */
import "./arrival.css";
import type { CSSProperties } from "react";
import { TestBoard } from "@/src/ui/design-system/TestBoard";
import { ASSETS, type Archetype } from "@/src/lib/assets";
import { PictureBg } from "@/src/ui/PictureBg";
import type { ArrivalFixture } from "@/src/dev/fixtures";

const ARCH_ACCENT: Record<Archetype, string> = {
  warrior: "#e0413b",
  strategist: "#8a7bd8",
  defender: "#4fb477",
  trickster: "#46c7d8",
};

export function ArrivalScreen({
  arrival,
  onStart,
  onSkip,
}: {
  arrival: ArrivalFixture;
  onStart?: () => void;
  onSkip?: () => void;
}) {
  const shortWeak = arrival.weakness.split(" ")[0];

  return (
    <div className="chq-arrival" style={{ "--accent": ARCH_ACCENT[arrival.archetype] } as CSSProperties}>
      <div className="stage">
        <div className="bg">
          <PictureBg landscape={ASSETS.backgrounds.resultsReveal} portrait={ASSETS.backgrounds.resultsRevealPortrait} />
        </div>

        <div className="wrap">
          <div className="a-head">
            <p className="eyebrow">Your training plan</p>
            <h1 className="serif">We found where you&apos;re losing.</h1>
            <p className="sub">From your 8-position test: you&apos;re sharp in the {arrival.strength}, but the {arrival.weakness} is costing you games. Here&apos;s the fix.</p>
          </div>

          <div className="diag">
            {/* board = the hero */}
            <div>
              <div className="board-wrap">
                <TestBoard fen={arrival.weakFen} orientation={arrival.weakOrientation} />
              </div>
              <p className="board-cap">
                <span className="turn">White to play</span><br />
                The <b>{arrival.weakness}</b> · {arrival.weaknessLine}. You score just <b>{arrival.weaknessWin}%</b> as White from here — the fork most players fumble.
              </p>
            </div>

            {/* the plan */}
            <div className="plan">
              <div className="pr">
                <span className="lab">Strength</span>
                <span className="op edge">{arrival.strength}</span>
                <span className="wn up">{arrival.strengthWin}% ↑</span>
              </div>
              <div className="pr">
                <span className="lab">Gap</span>
                <span className="op gap">{arrival.weakness}</span>
                <span className="wn down">{arrival.weaknessWin}% ↓</span>
              </div>

              <div className="sep" />

              <div className="sess">
                <div className="k">Your first session — start with the gap</div>
                <div className="v"><b>{arrival.firstSessionLines} key lines</b> of the {arrival.weaknessLine} · ~{arrival.firstSessionMin} min</div>
              </div>

              <button className="cta" type="button" onClick={onStart}>Fix my {shortWeak} →</button>

              <div className="foot">
                <span className="iqchip">
                  <b>{arrival.iq}</b> Opening IQ · Top {arrival.topPercent}%
                  <span className="i" title="One score (0–1000) for how well you know your openings — it climbs as you master lines.">i</span>
                </span>
                <button className="skip" type="button" onClick={onSkip}>Explore on my own</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
