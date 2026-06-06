/**
 * POST /api/track — landing analytics sink (kickoff §10). STUB: validates the
 * event + source context and logs in dev. Public (landing visitors are
 * anonymous). Swap the `// TODO: persist` block for the real sink (same pipeline
 * as `training_events`) later — the client `track()` interface stays stable.
 */
import { NextResponse } from "next/server";
import { z } from "zod";

const EVENTS = [
  "landing_view",
  "hero_cta_click",
  "sticky_cta_click",
  "pain_section_cta_click",
  "kingdoms_cta_click",
  "final_cta_click",
  "dna_test_started",
  "dna_test_completed",
  "dna_card_generated",
  "signup_started",
  "signup_completed",
] as const;

// Source context is attached to every event (§10); kept lenient (.passthrough)
// so we never drop a beacon over a schema nit — analytics must not be fragile.
const BodySchema = z
  .object({
    event: z.enum(EVENTS),
    headline_variant: z
      .enum(["default", "pain", "retargeting"])
      .nullish(),
    utm_source: z.string().max(200).nullish(),
    utm_campaign: z.string().max(200).nullish(),
    device_type: z.enum(["mobile", "desktop"]).nullish(),
    section: z.string().max(40).nullish(),
  })
  .passthrough();

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid event", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO: persist to the analytics store (same pipeline as training_events).
  if (process.env.NODE_ENV !== "production") {
    const { event, ...ctx } = parsed.data;
    console.log(`[track] ${event}`, ctx);
  }

  return NextResponse.json({ ok: true });
}
