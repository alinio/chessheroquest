/** Legacy /world → the Quest Map now lives at /quest (inside the hub shell). */
import { redirect } from "next/navigation";

export default function WorldRedirect() {
  redirect("/quest");
}
