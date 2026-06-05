/**
 * /dashboard — the hero's hub (build order #6, screen S4). The daily landing
 * surface: Opening IQ + Road progress + streak + the 3 daily missions.
 */
import { Dashboard } from "@/src/ui/screens/Dashboard";

export default function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-7 px-4 py-6">
      <header className="text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">
          ChessHeroQuest
        </p>
        <h1 className="font-display text-text-hi text-2xl font-bold">Your hub</h1>
      </header>
      <Dashboard />
    </main>
  );
}
