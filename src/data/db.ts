/**
 * The Drizzle client — the single entry point to Postgres (Neon).
 * Lives in the DATA layer (the truth layer); repositories in ./repos consume it.
 * Uses the neon-http driver: ideal for Vercel serverless. (No cross-statement
 * transactions — switch to neon-serverless WebSocket Pool if those are needed.)
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/src/lib/env";
import * as schema from "@/db/schema";

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });
export type DB = typeof db;
