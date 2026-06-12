/**
 * Admin fortress shell (LAW #7, ADMIN.md). requireAdmin() runs BEFORE any
 * render: no session or email not on ADMIN_EMAILS → 404 (the zone stays
 * invisible — never a talking 403). Every page/server action re-checks on its
 * own (defense in depth: a layout does not protect server actions).
 *
 * Deliberately NOT the player AppShell — this is a pure internal tool
 * (dense, sober, Manrope, no lore).
 */
import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/admin";
import { logAdminView } from "@/src/data/repos/admin";
import { AdminNav } from "@/src/ui/admin/AdminNav";
import "@/src/ui/admin/admin.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  // LAW #7 trace — best-effort + throttled inside (≈1 row/actor/hour, not per page).
  await logAdminView(admin.userId);

  return (
    <div className="chq-admin">
      <aside className="a-side">
        <div className="a-brand">
          ChessHeroQuest
          <span className="a-badge">ADMIN</span>
        </div>
        <AdminNav />
        <div className="a-side-spacer" />
        <div className="a-side-foot">
          {admin.email}
          <br />
          Phase A — env allowlist. DB roles + 2FA in Phase B.
        </div>
      </aside>
      <main className="a-main">{children}</main>
    </div>
  );
}
