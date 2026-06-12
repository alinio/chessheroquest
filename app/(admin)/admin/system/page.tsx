/**
 * Admin · System — the audit trail (LAW #7), READ-ONLY. Last 100 audit_logs
 * rows: when, who (actor email resolved from users), what, on which target,
 * with the before/after JSON detail folded behind a <details>. Filterable by
 * exact action via ?action= (GET form — no client JS needed).
 */
import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/admin";
import {
  AUDIT_PAGE_SIZE,
  listAuditActions,
  listAuditLogs,
} from "@/src/data/repos/admin";
import { fmtDateTime, fmtInt } from "@/src/ui/admin/format";

export const metadata: Metadata = { title: "System" };

function fmtMetadata(metadata: unknown): string | null {
  if (metadata == null) return null;
  try {
    return JSON.stringify(metadata, null, 2);
  } catch {
    return String(metadata);
  }
}

export default async function AdminSystemPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string }>;
}) {
  await requireAdmin(); // defense in depth

  const { action } = await searchParams;
  const filter = typeof action === "string" ? action.trim().slice(0, 64) : "";
  const [rows, actions] = await Promise.all([
    listAuditLogs(filter || undefined),
    listAuditActions(),
  ]);

  return (
    <>
      <h1 className="a-h1">System · Audit log</h1>
      <p className="a-sub">
        Last {fmtInt(AUDIT_PAGE_SIZE)} sensitive actions (LAW #7) — read-only.
        {filter ? ` Filtered: ${filter}.` : ""}
      </p>

      <form method="get" className="a-toolbar">
        <select className="a-input" name="action" defaultValue={filter}>
          <option value="">All actions</option>
          {actions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <button type="submit" className="a-btn">
          Filter
        </button>
      </form>

      {rows.length === 0 ? (
        <p className="a-section-note">
          {filter ? "No audit rows for this action." : "No audit rows yet."}
        </p>
      ) : (
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const json = fmtMetadata(r.metadata);
                return (
                  <tr key={r.id}>
                    <td className="dim">{fmtDateTime(r.createdAt)}</td>
                    <td>
                      {r.actorEmail ??
                        (r.actorUserId ? (
                          <span className="dim">{r.actorUserId}</span>
                        ) : (
                          <span className="dim">— (detached)</span>
                        ))}
                    </td>
                    <td>
                      <span className="a-pill">{r.action}</span>
                    </td>
                    <td className="dim">
                      {r.targetType ?? "—"}
                      {r.targetId ? ` · ${r.targetId}` : ""}
                    </td>
                    <td>
                      {json == null ? (
                        <span className="dim">—</span>
                      ) : (
                        <details className="a-json">
                          <summary>view</summary>
                          <pre>{json}</pre>
                        </details>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
