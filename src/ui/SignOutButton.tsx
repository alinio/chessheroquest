"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-chip border-hairline text-text-mid mx-auto min-h-[44px] border px-6 text-sm"
    >
      Sign out
    </button>
  );
}
