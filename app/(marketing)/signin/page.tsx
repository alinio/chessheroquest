"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setError("Invalid email or password.");
    else router.push("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-6 px-6">
      <header className="text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">
          ChessHeroQuest
        </p>
        <h1 className="font-display text-text-hi mt-1 text-2xl font-bold">Welcome back</h1>
      </header>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-surface border-hairline text-text-hi rounded-card min-h-[48px] border px-4"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-surface border-hairline text-text-hi rounded-card min-h-[48px] border px-4"
        />
        {error && <p className="text-state-leak text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-chip bg-gold text-abyss min-h-[48px] font-semibold disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-text-mid text-center text-sm">
        New here?{" "}
        <Link href="/signup" className="text-gold underline">
          Create a free account
        </Link>
      </p>
    </main>
  );
}
