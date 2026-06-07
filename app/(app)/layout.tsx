/**
 * Authenticated app shell. Every /(app) route (dashboard, train, drill, …)
 * requires a session — unauthenticated visitors are sent to /signin. The DNA
 * Test funnel stays public under /(marketing) (master-vision §7).
 */
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { AppShell } from "@/src/ui/shell/AppShell";
import "@/src/ui/animations.css";
import "@/src/ui/shell/hub.css";

/**
 * Authenticated hub shell (AppShell = rail + top bar, from the mockups). The active
 * tab is derived from the pathname inside AppShell. Immersive screens (Boss, DNA,
 * Learn, Drill) live OUTSIDE this group and render shell-less.
 * TODO(real-data): pass realm/crest/avatar/streak/iq from the player store.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  return <AppShell>{children}</AppShell>;
}
