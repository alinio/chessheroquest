import "@/src/ui/design-system/theme.css";
import { inter } from "@/src/ui/design-system/fonts";
import { GameSync } from "@/src/ui/games/GameSync";

export const metadata = { title: "Sync your games — ChessHeroQuest" };

export default function SyncPage() {
  return (
    <div className={`chq-root ${inter.variable}`} style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
      <main style={{ width: "100%" }}>
        <GameSync />
      </main>
    </div>
  );
}
