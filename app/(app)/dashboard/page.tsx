/**
 * /dashboard — legacy hub route. The daily cockpit at /train superseded it
 * (signin/signup/review flows still land here, then follow the redirect).
 */
import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/train");
}
