/**
 * Authenticated app shell. Every /(app) route (dashboard, train, drill, …)
 * requires a session — unauthenticated visitors are sent to /signin. The DNA
 * Test funnel stays public under /(marketing) (master-vision §7).
 */
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  return <>{children}</>;
}
