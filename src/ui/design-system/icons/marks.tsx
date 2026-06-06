/**
 * Static bespoke marks — geometry transcribed verbatim from docs/svg-icon-kit.html.
 * All reference the shared gradients in <GradientDefs/> (mount once per page).
 * Server-component safe (no hooks). Generic UI icons come from <Icon/> (lucide).
 */
import { GOLD_GLOW } from "./GradientDefs";

interface MarkProps {
  size?: number;
  className?: string;
}

/* ── Logo & frame ──────────────────────────────────────────────────────── */

/** Crown wordmark mark — header (32px) + favicon. */
export function LogoMark({ size = 32, className }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ filter: GOLD_GLOW }}
      aria-hidden="true"
    >
      <path fill="url(#chq-gold)" d="M3 17 L2.4 6 L7 11 L12 4 L17 11 L21.6 6 L21 17 Z" />
      <path
        fill="url(#chq-gold)"
        d="M2.8 17 h18.4 v2.1 a1 1 0 0 1-1 1 H3.8 a1 1 0 0 1-1-1 Z"
      />
      <circle cx="2.4" cy="6" r="1.5" fill="#FCEBB6" />
      <circle cx="21.6" cy="6" r="1.5" fill="#FCEBB6" />
      <circle cx="12" cy="3.7" r="1.7" fill="#FCEBB6" />
    </svg>
  );
}

/** One ornate gold corner (top-left). OrnateFrame mirrors it ×4. */
export function FrameCorner({ size = 28, className }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="none"
        stroke="url(#chq-gold)"
        strokeWidth="2"
        strokeLinecap="round"
        d="M6 46 V16 a10 10 0 0 1 10-10 H46"
      />
      <path
        fill="none"
        stroke="url(#chq-gold)"
        strokeWidth="1.3"
        strokeLinecap="round"
        d="M14 22 q0-8 8-8"
      />
      <path fill="url(#chq-gold)" d="M12.5 9 l2.2 3.5 -2.2 3.5 -2.2-3.5 Z" />
    </svg>
  );
}

/* ── Map node states (static) — see MapNode for the parametric version ───── */

export function NodeLocked({ size = 76, className }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" opacity=".55" className={className} aria-hidden="true">
      <circle cx="40" cy="40" r="30" fill="#0D0D10" stroke="#3A3A44" strokeWidth="2.5" strokeDasharray="5 6" />
      <rect x="32" y="40" width="16" height="12" rx="2" fill="#6E6E78" />
      <path d="M34 40 v-3 a6 6 0 0 1 12 0 v3" fill="none" stroke="#6E6E78" strokeWidth="2.4" />
    </svg>
  );
}

export function NodeAvailable({ size = 76, className }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      style={{ filter: GOLD_GLOW }}
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="34" fill="none" stroke="url(#chq-gold)" strokeWidth="1" opacity=".35" />
      <circle cx="40" cy="40" r="30" fill="#14141A" stroke="url(#chq-gold)" strokeWidth="3" />
      <path fill="url(#chq-gold)" d="M40 28 a4 4 0 1 0 .01 0 Z M34 52 c0-5 3-8 6-8 s6 3 6 8 Z" />
    </svg>
  );
}

export function NodeConquered({ size = 76, className }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      style={{ filter: GOLD_GLOW }}
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="30" fill="#14141A" stroke="url(#chq-gold)" strokeWidth="3.5" />
      <path
        fill="url(#chq-gold)"
        d="M40 24 l4.2 8.6 9.5 1.4 -6.9 6.7 1.6 9.4 -8.5-4.5 -8.5 4.5 1.6-9.4 -6.9-6.7 9.5-1.4 Z"
      />
    </svg>
  );
}

/* ── Mastery medals & passport seal ──────────────────────────────────────── */

const MEDAL_TIERS = {
  bronze: { fill: "url(#chq-bronze)", ribbon: "#8A4F22", edge: "#5E3417", glow: false },
  silver: { fill: "url(#chq-silver)", ribbon: "#8E94A1", edge: "#6B7180", glow: false },
  gold: { fill: "url(#chq-gold)", ribbon: "#A9781A", edge: "#8A5E12", glow: true },
} as const;

export type MedalTier = keyof typeof MEDAL_TIERS;

/** Mastery medal — Bronze (Easy) / Silver (Medium) / Gold (Hard). */
export function Medal({ tier, size = 44, className }: MarkProps & { tier: MedalTier }) {
  const t = MEDAL_TIERS[tier];
  return (
    <svg
      width={size}
      height={(size * 56) / 48}
      viewBox="0 0 48 56"
      className={className}
      style={t.glow ? { filter: GOLD_GLOW } : undefined}
      aria-hidden="true"
    >
      <path fill={t.ribbon} d="M18 4 L24 24 L30 4 L26 4 L24 12 L22 4 Z" />
      <circle cx="24" cy="38" r="15" fill={t.fill} stroke={t.edge} strokeWidth="1.5" />
      <path
        fill={t.edge}
        d="M24 30 l2.1 4.3 4.7.7 -3.4 3.3.8 4.7 -4.2-2.2 -4.2 2.2.8-4.7 -3.4-3.3 4.7-.7 Z"
      />
    </svg>
  );
}

/** Gold wax passport seal. Per-opening emblem can swap the center later. */
export function PassportSeal({ size = 68, className }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      style={{ filter: GOLD_GLOW }}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="26" fill="url(#chq-gold)" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="#8A5E12" strokeWidth="2" />
      <circle cx="32" cy="32" r="20" fill="none" stroke="#8A5E12" strokeWidth="1" opacity=".6" />
      <path
        fill="#8A5E12"
        d="M24 36 L23 24 L28 29 L32 22 L36 29 L41 24 L40 36 Z M23.5 36 h17 v2.4 h-17 Z"
      />
    </svg>
  );
}

/* ── Status: lock & shield ───────────────────────────────────────────────── */

/** Pro-locked content mark. */
export function LockIcon({ size = 24, className }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={{ filter: GOLD_GLOW }} aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" fill="url(#chq-gold)" />
      <path d="M8 10 V7 a4 4 0 0 1 8 0 v3" fill="none" stroke="url(#chq-gold)" strokeWidth="2" />
      <rect x="11.1" y="13" width="1.8" height="4.5" rx=".9" fill="#0D0D10" />
    </svg>
  );
}

/** Gauntlet life / shield. */
export function ShieldIcon({ size = 24, className }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="url(#chq-gold)" d="M12 2 L20 5 V11 C20 16.2 16.4 20.2 12 22 C7.6 20.2 4 16.2 4 11 V5 Z" />
      <path fill="#0D0D10" opacity=".25" d="M12 6 L16.5 7.6 V11 c0 3.3-2.2 6-4.5 7.2 Z" />
    </svg>
  );
}
