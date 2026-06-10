/**
 * /boss — index redirects to Today (duels are per-opening at /boss/[slug];
 * the fixture preview lives in /dev/screens).
 */
import { redirect } from "next/navigation";

export default function BossIndexPage() {
  redirect("/train");
}
