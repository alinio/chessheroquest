import Link from "next/link";

/**
 * Pre-DNA empty state for hub sections (Quest / Insights / Realms). Navigation
 * must VISIBLY work for brand-new accounts — never a silent redirect back to
 * /train that makes the rail feel dead.
 */
export function EmptyKingdom({ section, line }: { section: string; line: string }) {
  return (
    <main className="today-v2" style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ maxWidth: 460, padding: "48px 20px" }}>
        <p className="eyebrow gold" style={{ marginBottom: 10 }}>{section}</p>
        <h1 className="serif" style={{ fontSize: 30, color: "#fff", lineHeight: 1.15, marginBottom: 12 }}>
          Your kingdom awaits.
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 22 }}>{line}</p>
        <Link className="btn-gold" href="/dna-test" style={{ textDecoration: "none" }}>
          Take the Chess DNA Test →
        </Link>
      </div>
    </main>
  );
}
