/** /drill — no line chosen → send to the Openings hub to pick one. */
import { redirect } from "next/navigation";

export default function DrillIndexPage() {
  redirect("/train");
}
