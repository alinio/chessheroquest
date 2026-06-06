/**
 * AI coach (server-side, cached) — CLAUDE.md LAW #2. The LLM NEVER decides or
 * evaluates a move: all chess facts (best/most-played move, eval, frequencies)
 * are GIVEN as verified inputs from the engine + database; Claude only turns them
 * into a plain-language explanation. Output is cached by hash(context) in
 * ai_explanation_cache → positions are finite and shared → marginal cost → ~0.
 */
import Anthropic from "@anthropic-ai/sdk";
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/src/data/db";
import { aiExplanationCache } from "@/db/schema";
import { env } from "@/src/lib/env";

const COACH_MODEL = "claude-sonnet-4-6";

export interface CoachContext {
  /** Position being explained (FEN). */
  fen: string;
  /** The move the player made, SAN (optional). */
  move?: string;
  /** The verified best/most-played move, SAN (from Lichess/Stockfish). */
  bestMove?: string;
  /** Stockfish eval in centipawns (verified). */
  evalCp?: number;
  /** ECO code + opening name (verified). */
  eco?: string;
  openingName?: string;
  /** Player level/goal Elo for tone (optional). */
  level?: number;
}

const SYSTEM_PROMPT = [
  "You are an encouraging chess opening coach inside ChessHeroQuest (a learning app).",
  "ABSOLUTE RULES:",
  "- You NEVER decide or evaluate moves yourself. Every chess fact — the best/most-played move, the evaluation, the opening name — is GIVEN to you as a verified input from a chess engine and database. Explain ONLY from those given facts.",
  "- Never invent moves, lines, evaluations, or opening names that are not in the inputs.",
  "- If the player's move differs from the given best move, explain WHY the given best move is stronger using the given facts — not your own analysis.",
  "- Keep it to 2–4 short, plain, motivating sentences. No notation dumps. Speak to the player's level.",
].join("\n");

function cacheKey(ctx: CoachContext): string {
  return createHash("sha1").update(JSON.stringify(ctx)).digest("hex");
}

function buildUserPrompt(ctx: CoachContext): string {
  const lines = [`Position (FEN): ${ctx.fen}`];
  if (ctx.openingName) lines.push(`Opening: ${ctx.openingName}${ctx.eco ? ` (${ctx.eco})` : ""}`);
  if (ctx.move) lines.push(`Player played: ${ctx.move}`);
  if (ctx.bestMove) lines.push(`Verified best / most-played move: ${ctx.bestMove}`);
  if (typeof ctx.evalCp === "number") lines.push(`Verified engine eval (centipawns, side to move): ${ctx.evalCp}`);
  if (typeof ctx.level === "number") lines.push(`Player target level: ~${ctx.level} Elo`);
  lines.push("", "Explain this position/move to the player using only the verified facts above.");
  return lines.join("\n");
}

/** Cache-first coach explanation. Calls Claude only on a cache miss. */
export async function getCoachExplanation(ctx: CoachContext): Promise<string> {
  if (typeof window !== "undefined") {
    throw new Error("ai-coach is server-only.");
  }

  const key = cacheKey(ctx);
  const cached = await db
    .select()
    .from(aiExplanationCache)
    .where(eq(aiExplanationCache.cacheKey, key))
    .limit(1);
  if (cached[0]) return cached[0].explanation;

  if (!env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set.");
  }

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: COACH_MODEL,
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(ctx) }],
  });

  const explanation = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

  await db
    .insert(aiExplanationCache)
    .values({ cacheKey: key, explanation, model: COACH_MODEL })
    .onConflictDoNothing({ target: aiExplanationCache.cacheKey });

  return explanation;
}
