/**
 * Inline GOLD celebration (tier 2 of 3, target-experience-spec §B6) — shown in
 * the drill recap the moment a line's REAL mastery turns gold during the
 * session (server-computed via /api/train). Carries the real number that
 * triggered it ({n} positions) and the one next step: the Guardian.
 */
import Link from "next/link";
import "./celebrations.css";

export function GoldLineCard({
  openingName,
  positions,
  challengeHref,
}: {
  openingName: string;
  /** Real position count of the line (mastery.total). */
  positions: number;
  challengeHref: string;
}) {
  return (
    <section className="chq-goldcard" aria-label={`${openingName} reached gold`}>
      <p className="gc-eyebrow">Line mastered</p>
      <p className="gc-title">The {openingName} turns gold</p>
      <p className="gc-sub">
        All <b>{positions}</b> positions held. Its Guardian now accepts your challenge.
      </p>
      <Link className="gc-cta" href={challengeHref}>Challenge now →</Link>
    </section>
  );
}
