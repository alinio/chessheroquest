import { Inter } from "next/font/google";

/**
 * Body / UI font for the game (art-direction-bible §1.2). Loaded here, scoped to
 * design-system surfaces via `inter.variable` on the wrapper — so the shared root
 * layout (Cinzel + Manrope) stays untouched. Cinzel is already global as
 * --font-cinzel; we reuse it for display.
 */
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
