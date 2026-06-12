"use client";

/**
 * Nudge — a one-phrase anchored popover shown at the FIRST meaningful
 * encounter of a concept (target-experience-spec §B5). One sentence, an
 * optional link, "Got it". Dismissal persists per concept in
 * localStorage `chq.nudge.<concept>.v1`; the host shows at most ONE nudge
 * and applies the seal > IQ > streak > realm > XP priority.
 *
 * The SEAL concept is covered by the full-screen SealCelebration (it both
 * explains and marks `chq.nudge.seal.v1`) — no popover for it, by design.
 */
import Link from "next/link";
import "./nudge.css";

export type NudgeConcept = "iq" | "seal" | "streak" | "realm" | "xp";

const nudgeKey = (concept: NudgeConcept) => `chq.nudge.${concept}.v1`;

/** True once the concept's nudge was dismissed (or storage is unavailable). */
export function nudgeSeen(concept: NudgeConcept): boolean {
  try {
    return window.localStorage.getItem(nudgeKey(concept)) !== null;
  } catch {
    return true; // no storage → never nag repeatedly
  }
}

export function markNudgeSeen(concept: NudgeConcept): void {
  try {
    window.localStorage.setItem(nudgeKey(concept), "1");
  } catch {
    /* storage unavailable */
  }
}

/**
 * Render inside a `.chq-nudge-anchor` (position: relative) wrapping the
 * anchored element — the popover hangs below it, arrow pointing up.
 */
export function Nudge({
  concept,
  text,
  link,
  onDismiss,
}: {
  concept: NudgeConcept;
  /** ONE phrase. */
  text: string;
  link?: { href: string; label: string };
  onDismiss: () => void;
}) {
  const dismiss = () => {
    markNudgeSeen(concept);
    onDismiss();
  };
  return (
    <span className="chq-nudge" role="note">
      <p>{text}</p>
      <span className="nd-row">
        {link && (
          <Link className="nd-link" href={link.href} onClick={dismiss}>
            {link.label}
          </Link>
        )}
        <button className="nd-gotit" type="button" onClick={dismiss}>
          Got it
        </button>
      </span>
    </span>
  );
}
