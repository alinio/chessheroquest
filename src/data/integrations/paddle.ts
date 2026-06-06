/**
 * Paddle billing integration (server-side only — keys never reach the client).
 * SETUP ONLY for now: this exposes a configured client. The full checkout +
 * webhook flow + plans (Free / Pro monthly+annual / Lifetime) lands with auth
 * (build order #8), against SANDBOX keys for development.
 */
import { Paddle, Environment } from "@paddle/paddle-node-sdk";
import { env } from "@/src/lib/env";

let client: Paddle | null = null;

export function getPaddle(): Paddle {
  if (typeof window !== "undefined") {
    throw new Error("Paddle integration is server-only.");
  }
  if (!env.PADDLE_API_KEY) {
    throw new Error("PADDLE_API_KEY is not set.");
  }
  if (!client) {
    client = new Paddle(env.PADDLE_API_KEY, {
      environment:
        env.NEXT_PUBLIC_PADDLE_ENV === "production"
          ? Environment.production
          : Environment.sandbox,
    });
  }
  return client;
}
