"use client";

/**
 * Arrival / first-session orientation (P0 from the UX audit) — shown ONCE right after
 * payment. Immersive, no shell. Fixes the post-payment "what do I do?" gap: defines
 * Opening IQ once, teaches the 3-step loop (Drill → Beat the Guardian → Seal), uses the
 * player's DNA (edge/gap), and offers ONE primary action. Data-driven.
 *
 * onStart() → deep-link straight into the first drill on the strength opening.
 * onSkip()  → Today. Caller sets arrival_seen=true on first render (never blocks again).
 */
import type { CSSProperties } from "react";
import "./arrival.css";
import { ASSETS, getArchetypeSigil, type Archetype } from "@/src/lib/assets";
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
  return (
    <div className="chq-arrival" style={{ "--accent": ARCH_ACCENT[arrival.archetype] } as CSSProperties}>
      <div className="stage">
        <div className="bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ASSETS.backgrounds.resultsReveal} alt="" />
        </div>

        <div className="col">
          <p className="eyebrow">Welcome, {arrival.archetypeName}</p>
          <h1 className="serif">Here&apos;s your plan</h1>

          <div className="sigil">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getArchetypeSigil(arrival.archetype)} alt="" />
          </div>

          {/* Opening IQ — defined ONCE */}
          <div className="iq">
            <span className="num">{arrival.iq}<small>OPENING IQ</small></span>
            <span className="def">
              <b>Opening IQ</b> is one score (0–1000) for how well you know your openings. It climbs as you master lines — higher is better. <b>Top {arrival.topPercent}%</b> means you&apos;re ahead of {100 - arrival.topPercent}% of players at your level.
            </span>
          </div>

          {/* edge / gap from the DNA */}
          <div className="eg">
            <div className="box">
              <div className="k">Your edge</div>
              <div className="v edge">{arrival.strength}</div>
              <div className="note">Your strongest opening — we start here to build the habit.</div>
            </div>
            <div className="box">
              <div className="k">Your gap</div>
              <div className="v">{arrival.weakness}</div>
              <div className="note">Your weakest reply — we&apos;ll shore it up next.</div>
            </div>
          </div>

          {/* the loop — 3 steps */}
          <div className="loop">
            <p className="lbl">How it works — three steps, repeated</p>
            <div className="steps">
              <div className="step on">
                <span className="n">1</span>
                <span className="t">Drill<small>the key lines</small></span>
              </div>
              <span className="arrow">→</span>
              <div className="step">
                <span className="n">2</span>
                <span className="t">Beat the Guardian<small>one engine duel</small></span>
              </div>
              <span className="arrow">→</span>
              <div className="step">
                <span className="n">3</span>
                <span className="t">Seal it<small>in your Passport</small></span>
              </div>
            </div>
          </div>

          <button className="cta" type="button" onClick={onStart}>Start my first drill →</button>
          <p className="ctasub">~3 min · 5 drills on {arrival.strength}</p>
          <button className="skip" type="button" onClick={onSkip}>Explore on my own</button>
        </div>
      </div>
    </div>
  );
}
