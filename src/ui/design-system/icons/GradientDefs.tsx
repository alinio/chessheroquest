/**
 * Shared SVG gradient definitions (gold / bronze / silver), from svg-icon-kit.
 * Mount ONCE per page (AppShell + /preview do). Every mark below references
 * `url(#chq-gold)` etc. — one defs, no duplicate ids, all marks stay RSC-safe.
 */
export function GradientDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="chq-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FCEBB6" />
          <stop offset=".38" stopColor="#F3CF77" />
          <stop offset=".72" stopColor="#D9A227" />
          <stop offset="1" stopColor="#A9781A" />
        </linearGradient>
        <linearGradient id="chq-bronze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8A972" />
          <stop offset=".6" stopColor="#C77B3A" />
          <stop offset="1" stopColor="#8A4F22" />
        </linearGradient>
        <linearGradient id="chq-silver" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2F4F8" />
          <stop offset=".6" stopColor="#C7CBD4" />
          <stop offset="1" stopColor="#8E94A1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** The gold drop-shadow used by glowing marks (svg-icon-kit `.glow`). */
export const GOLD_GLOW = "drop-shadow(0 0 10px rgba(217,162,39,.45))";
