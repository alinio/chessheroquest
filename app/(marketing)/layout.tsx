/**
 * Marketing layout (kickoff §0.2) — the public funnel zone, no app chrome.
 * The authenticated shell lives under `(app)`; this group stays open and
 * navless. Pass-through by design: the root layout already supplies the
 * dark-abyss body, fonts and reduced-motion guard, so this only scopes the
 * marketing route group without adding any wrapper that could disturb the
 * existing signin / signup / dna / pricing pages.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
