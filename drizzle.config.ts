import { defineConfig } from "drizzle-kit";

// drizzle-kit runs OUTSIDE Next, so it doesn't auto-load .env.local.
// Node >= 20.12 can load it directly; fall back to process.env otherwise.
try {
  process.loadEnvFile(".env.local");
} catch {
  /* .env.local absent — rely on the ambient environment */
}

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local before running drizzle-kit.");
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
