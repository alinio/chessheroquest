/**
 * POST /api/app-track — app funnel analytics sink (M9c). Anonymous, lenient
 * (never fails a beacon). Logs in dev. TODO: persist to a training_events-style
 * sink for the real funnel; the client track() interface stays stable.
 */
import { NextResponse } from "next/server";
import { z } from "zod";

const BodySchema = z
  .object({
    event: z.string().max(64),
    props: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  })
  .passthrough();

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: true }); // never drop a beacon over a schema nit
  console.log(`[app-track] ${parsed.data.event}`, parsed.data.props ?? {});
  return NextResponse.json({ ok: true });
}
