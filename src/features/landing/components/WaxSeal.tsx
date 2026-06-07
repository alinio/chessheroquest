/**
 * Coded passport wax seal (from docs/svg-icon-kit.html `seal-base.svg`).
 * EARNED = gold wax seal with the crown emblem + a realm-accent ring/glow.
 * LOCKED = dim embossed empty slot. Earned seals can stamp in (chq-stamp);
 * reduced-motion → final state (handled by the global media query zeroing it).
 */
export function WaxSeal({
  earned,
  accent,
  animate = false,
  delaySec = 0,
  size = 56,
}: {
  earned: boolean;
  accent: string;
  animate?: boolean;
  delaySec?: number;
  size?: number;
}) {
  if (!earned) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
        <circle
          cx="32"
          cy="32"
          r="26"
          fill="#0D0D10"
          stroke="#3A3A44"
          strokeWidth="2"
          strokeDasharray="4 5"
        />
        <circle
          cx="32"
          cy="32"
          r="20"
          fill="none"
          stroke="#3A3A44"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M24 36 L23 24 L28 29 L32 22 L36 29 L41 24 L40 36 Z M23.5 36 h17 v2.4 h-17 Z"
          fill="#3A3A44"
          opacity="0.55"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      style={{
        filter: `drop-shadow(0 0 10px ${accent}80)`,
        animation: animate
          ? `chq-stamp 0.6s ${delaySec}s cubic-bezier(0.22,1,0.36,1) both`
          : undefined,
      }}
    >
      <defs>
        <linearGradient id="chq-seal-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FCEBB6" />
          <stop offset="0.38" stopColor="#F3CF77" />
          <stop offset="0.72" stopColor="#D9A227" />
          <stop offset="1" stopColor="#A9781A" />
        </linearGradient>
      </defs>
      {/* realm-accent ring */}
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        opacity="0.75"
      />
      <circle cx="32" cy="32" r="26" fill="url(#chq-seal-gold)" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="#8A5E12" strokeWidth="2" />
      <circle
        cx="32"
        cy="32"
        r="20"
        fill="none"
        stroke="#8A5E12"
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d="M24 36 L23 24 L28 29 L32 22 L36 29 L41 24 L40 36 Z M23.5 36 h17 v2.4 h-17 Z"
        fill="#8A5E12"
      />
    </svg>
  );
}
