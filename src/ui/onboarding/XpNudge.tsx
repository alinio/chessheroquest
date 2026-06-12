"use client";

/**
 * First-XP nudge anchor (spec §B5): the first time the player has earned XP
 * (xp > 0), one popover explains what XP is. Lowest priority — it yields to
 * the IQ nudge (only fires once that one is dismissed) and persists via the
 * standard chq.nudge.xp.v1 key. Wrap the Level/XP HUD chip with it.
 */
import { useEffect, useState, type ReactNode } from "react";
import { Nudge, nudgeSeen } from "./Nudge";

export function XpNudgeAnchor({ xp, children }: { xp: number; children: ReactNode }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (xp <= 0) return; // no gain yet — nothing to explain
    const t = window.setTimeout(() => {
      if (!nudgeSeen("xp") && nudgeSeen("iq")) setShow(true);
    }, 600);
    return () => window.clearTimeout(t);
  }, [xp]);

  return (
    <span className="chq-nudge-anchor">
      {children}
      {show && (
        <Nudge
          concept="xp"
          text="XP marks training actually done — drills, reviews and duels all count toward your level."
          onDismiss={() => setShow(false)}
        />
      )}
    </span>
  );
}
