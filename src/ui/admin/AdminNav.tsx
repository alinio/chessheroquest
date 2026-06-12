"use client";

/**
 * Admin sidebar navigation. Client-only for the active-route highlight;
 * access control NEVER lives here (requireAdmin runs in the server layout
 * and again in every page/action).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";

const LIVE_SECTIONS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
] as const;

// Greyed-out roadmap (ADMIN.md build order). Not links — nothing to reach yet.
const FUTURE_SECTIONS = [
  { label: "System", phase: "Phase B" },
  { label: "Finance", phase: "Phase C" },
  { label: "Analytics", phase: "Phase C" },
  { label: "Blog", phase: "Phase D" },
  { label: "Emails", phase: "Phase D" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav aria-label="Admin">
      {LIVE_SECTIONS.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          className={`a-nav-item${isActive(s.href) ? " is-active" : ""}`}
          aria-current={isActive(s.href) ? "page" : undefined}
        >
          {s.label}
        </Link>
      ))}
      <div className="a-side-divider" aria-hidden="true" />
      {FUTURE_SECTIONS.map((s) => (
        <span key={s.label} className="a-nav-item is-disabled" aria-disabled="true">
          {s.label}
          <span className="a-nav-phase">{s.phase}</span>
        </span>
      ))}
    </nav>
  );
}
