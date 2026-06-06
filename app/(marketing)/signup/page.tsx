"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const body: Record<string, unknown> = { email, password };
    const yr = Number(birthYear);
    if (birthYear && Number.isInteger(yr)) body.birthYear = yr;

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setLoading(false);
      setError(data.error ?? "Could not create account.");
      return;
    }

    // Auto sign-in after signup.
    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (signInRes?.error) router.push("/signin");
    else router.push("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-6 px-6">
      <header className="text-center">
        <p className="font-display text-gold text-xs uppercase tracking-[0.3em]">
          ChessHeroQuest
        </p>
        <h1 className="font-display text-text-hi mt-1 text-2xl font-bold">
          Create your free account
        </h1>
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
          minLength={8}
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-surface border-hairline text-text-hi rounded-card min-h-[48px] border px-4"
        />
        <input
          type="number"
          placeholder="Birth year (optional)"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          className="bg-surface border-hairline text-text-hi rounded-card min-h-[48px] border px-4"
        />
        <p className="text-text-low text-xs">
          Birth year keeps young players safe — profiles stay private by default.
        </p>
        {error && <p className="text-state-leak text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-chip bg-gold text-abyss min-h-[48px] font-semibold disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>

      <p className="text-text-mid text-center text-sm">
        Already have an account?{" "}
        <Link href="/signin" className="text-gold underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
