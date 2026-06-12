/**
 * Typed, validated environment — the ONLY place env vars are read.
 * SERVER-SIDE ONLY: secrets must never reach the client (CLAUDE.md LAW, ARCHITECTURE.md).
 * Guard below turns accidental client import into a clear runtime error until we
 * adopt the `server-only` package.
 *
 * NOTE: MVP keys not yet wired (Anthropic, Paddle) are optional for now and should
 * be promoted to required as those features land.
 */
import { z } from "zod";

if (typeof window !== "undefined") {
  throw new Error("src/lib/env.ts is server-only and must not be imported on the client.");
}

const EnvSchema = z.object({
  // --- Core ---
  DATABASE_URL: z.string().url(),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(1).optional(),

  // --- Billing ---
  PADDLE_API_KEY: z.string().min(1).optional(),
  PADDLE_WEBHOOK_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: z.string().min(1).optional(),
  NEXT_PUBLIC_PADDLE_ENV: z.enum(["sandbox", "production"]).default("sandbox"),

  // --- App ---
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // --- Monitoring ---
  SENTRY_DSN: z.string().min(1).optional(),

  // --- Admin (Phase A fortress — LAW #7) ---
  // Comma-separated allowlist of admin emails. DB role-based RBAC lands in Phase B.
  ADMIN_EMAILS: z.string().min(1).optional(),
});

// Treat empty .env values ("KEY=") as absent so .optional() works as intended.
const rawEnv = Object.fromEntries(
  Object.entries(process.env).map(([k, v]) => [k, v === "" ? undefined : v]),
);

const parsed = EnvSchema.safeParse(rawEnv);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = parsed.data;
export type Env = typeof env;
