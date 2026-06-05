import type { Metadata } from "next";
import { Cinzel, Manrope } from "next/font/google";
import "./globals.css";

// Display — heraldic serif for ranks, kingdoms, the Opening IQ (DESIGN.md §4).
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

// Body / UI — highly legible on mobile (DESIGN.md §4).
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChessHeroQuest — Master the World of Chess Openings",
  description:
    "Discover your Chess DNA, train your weaknesses, and gain Elo faster. The RPG of chess openings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="bg-abyss text-text-hi font-body min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
