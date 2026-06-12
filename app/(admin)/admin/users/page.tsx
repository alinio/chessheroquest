/**
 * Admin · Users — dense paginated table (50/page) over the `users` table with
 * per-row aggregates (latest IQ, seals, last training event) computed in SQL.
 * Search = email ILIKE; sort = newest signup first.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/admin";
import { listUsers, USERS_PAGE_SIZE } from "@/src/data/repos/admin";
import { fmtDate, fmtDateTime, fmtInt } from "@/src/ui/admin/format";

export const metadata: Metadata = { title: "Users" };

function pageHref(page: number, q?: string): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/admin/users?${qs}` : "/admin/users";
}

function planPill(plan: string) {
  return (
    <span className={`a-pill${plan !== "free" ? " is-pro" : ""}`}>{plan}</span>
  );
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  await requireAdmin(); // defense in depth

  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const requestedPage = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const list = await listUsers(requestedPage, q);

  const from = list.total === 0 ? 0 : (list.page - 1) * USERS_PAGE_SIZE + 1;
  const to = Math.min(list.page * USERS_PAGE_SIZE, list.total);

  return (
    <>
      <h1 className="a-h1">Users</h1>
      <p className="a-sub">
        {fmtInt(list.total)} account{list.total === 1 ? "" : "s"}
        {q ? ` matching “${q}”` : ""} · newest first
      </p>

      <form method="get" action="/admin/users" className="a-toolbar">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by email…"
          className="a-input"
          aria-label="Search by email"
        />
        <button type="submit" className="a-btn">
          Search
        </button>
        {q && <Link href="/admin/users">Clear</Link>}
      </form>

      <div className="a-table-wrap">
        <table className="a-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Created</th>
              <th>Plan</th>
              <th className="num">Streak</th>
              <th className="num">IQ</th>
              <th className="num">Seals</th>
              <th>Last training</th>
            </tr>
          </thead>
          <tbody>
            {list.rows.length === 0 && (
              <tr>
                <td colSpan={7} className="dim">
                  {q ? "No accounts match this search." : "No accounts yet."}
                </td>
              </tr>
            )}
            {list.rows.map((u) => (
              <tr key={u.id}>
                <td>
                  <Link href={`/admin/users/${u.id}`}>{u.email}</Link>
                </td>
                <td className="dim">{fmtDate(u.createdAt)}</td>
                <td>{planPill(u.plan)}</td>
                <td className="num">{fmtInt(u.streakCount)}</td>
                <td className="num">{u.iq == null ? <span className="dim">—</span> : fmtInt(u.iq)}</td>
                <td className="num">{fmtInt(u.seals)}</td>
                <td className="dim">{fmtDateTime(u.lastTrainingAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav className="a-pagination" aria-label="Pagination">
        {list.page > 1 ? (
          <Link href={pageHref(list.page - 1, q)}>← Previous</Link>
        ) : (
          <span className="a-page-disabled">← Previous</span>
        )}
        <span>
          Page {fmtInt(list.page)} / {fmtInt(list.pageCount)}
          {list.total > 0 && ` · ${fmtInt(from)}–${fmtInt(to)} of ${fmtInt(list.total)}`}
        </span>
        {list.page < list.pageCount ? (
          <Link href={pageHref(list.page + 1, q)}>Next →</Link>
        ) : (
          <span className="a-page-disabled">Next →</span>
        )}
      </nav>
    </>
  );
}
