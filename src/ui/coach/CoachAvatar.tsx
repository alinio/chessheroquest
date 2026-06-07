"use client";

/**
 * The AI mentor avatar (visual-assets.md → coach/mentor.png). Reusable across
 * Learn (beside line explanations), onboarding, and empty states. Pass `message`
 * for the speech-bubble variant (avatar + bubble); `side` flips the layout.
 */
import type { ReactNode } from "react";
import { ASSETS } from "@/src/lib/assets";

export function CoachAvatar({
  size = 56,
  message,
  side = "left",
  name = "Your mentor",
}: {
  size?: number;
  message?: ReactNode;
  side?: "left" | "right";
  name?: string;
}) {
  const avatar = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ASSETS.coach.mentor}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size, flexShrink: 0, borderRadius: "50%", objectFit: "cover", objectPosition: "center top", border: "1px solid var(--chq-gold-4)", background: "var(--chq-raised)" }}
    />
  );

  if (!message) return avatar;

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexDirection: side === "right" ? "row-reverse" : "row" }}>
      {avatar}
      <div
        style={{
          position: "relative",
          background: "var(--chq-panel)",
          border: "1px solid var(--chq-line)",
          borderRadius: "var(--chq-r-panel)",
          padding: "12px 14px",
          color: "var(--chq-text-2)",
          fontSize: 13.5,
          lineHeight: 1.55,
          maxWidth: 460,
        }}
      >
        {message}
      </div>
    </div>
  );
}
