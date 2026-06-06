"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Bottom-tab navigation for the authenticated app (DESIGN.md §8, mobile-first). */
const TABS = [
  { href: "/dashboard", label: "Home", icon: "♛" },
  { href: "/train", label: "Train", icon: "♟" },
  { href: "/profile", label: "Profile", icon: "✦" },
] as const;

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface border-hairline fixed inset-x-0 bottom-0 z-40 border-t">
      <div className="mx-auto flex w-full max-w-xl">
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-xs ${
                active ? "text-gold" : "text-text-low"
              }`}
            >
              <span className="text-lg leading-none" aria-hidden>
                {tab.icon}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
