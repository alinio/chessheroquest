/**
 * Admin · User detail — the fiche. Identity, entitlement, progression (IQ
 * trend, mastery, seals), recent activity, plus the Phase B "Actions" card
 * (grant/revoke premium, magic link, role, RGPD anonymize/delete) — every
 * mutation lives in ./actions.ts behind requireAdmin + zod + audit.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/admin";
import { getUserDetail } from "@/src/data/repos/admin";
import { Sparkline } from "@/src/ui/admin/Sparkline";
import { UserActions } from "@/src/ui/admin/UserActions";
import { fmtDate, fmtDateTime, fmtInt } from "@/src/ui/admin/format";

export const metadata: Metadata = { title: "User" };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function statusPill(status: string) {
  const tone =
    status === "active"
      ? " is-pro"
      : status === "past_due"
        ? " is-warn"
        : status === "canceled"
          ? " is-bad"
          : "";
  return <span className={`a-pill${tone}`}>{status}</span>;
}

function masteryPill(state: string) {
  const tone =
    state === "leak"
      ? " is-bad"
      : state === "review"
        ? " is-warn"
        : state === "solid"
          ? " is-pro"
          : state === "gold"
            ? " is-warn"
            : "";
  return <span className={`a-pill${tone}`}>{state}</span>;
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin(); // defense in depth

  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const detail = await getUserDetail(id);
  if (!detail) notFound();

  const { user, accountState, dna, iqTrend, mastery, achievements, recentEvents } =
    detail;
  const currentIq = iqTrend.at(-1)?.value ?? null;
  const seals = achievements.filter((a) => a.type === "guardian_defeated");

  return (
    <>
      <p className="a-sub">
        <Link href="/admin/users">← Users</Link>
      </p>
      <h1 className="a-h1">{user.email}</h1>
      <p className="a-sub">
        Joined {fmtDate(user.createdAt)} · id {user.id}
      </p>

      <div className="a-cards">
        <section className="a-card">
          <h3>Identity</h3>
          <dl className="a-kv">
            <dt>Email</dt>
            <dd>{user.email}</dd>
            <dt>Display name</dt>
            <dd>{user.displayName ?? "—"}</dd>
            <dt>Archetype</dt>
            <dd>{user.archetype ?? "—"}</dd>
            <dt>Age band</dt>
            <dd>{user.ageBand ?? "—"}</dd>
            <dt>Marketing consent</dt>
            <dd>
              {user.consentMarketing ? "yes" : "no"}
              {user.consentAt ? ` (${fmtDate(user.consentAt)})` : ""}
            </dd>
            <dt>Profile public</dt>
            <dd>{user.profilePublic ? "yes" : "no"}</dd>
            <dt>Role</dt>
            <dd>
              <span className={`a-pill${user.role === "admin" ? " is-warn" : ""}`}>
                {user.role}
              </span>
            </dd>
            <dt>Lichess</dt>
            <dd>{user.lichessUsername ?? "—"}</dd>
            <dt>Chess.com</dt>
            <dd>{user.chesscomUsername ?? "—"}</dd>
            <dt>Created</dt>
            <dd>{fmtDateTime(user.createdAt)}</dd>
          </dl>
        </section>

        <section className="a-card">
          <h3>Entitlement</h3>
          <dl className="a-kv">
            <dt>Plan (users)</dt>
            <dd>
              <span className={`a-pill${user.plan !== "free" ? " is-pro" : ""}`}>
                {user.plan}
              </span>
            </dd>
            <dt>Status</dt>
            <dd>{statusPill(user.subscriptionStatus)}</dd>
            <dt>Since</dt>
            <dd>{fmtDate(user.updatedAt)} (last change)</dd>
            <dt>Phase-0 account</dt>
            <dd>
              {accountState
                ? `${accountState.plan}${accountState.isPro ? " · Pro" : ""} — since ${fmtDate(accountState.updatedAt)}`
                : "none (no account_states row for this email)"}
            </dd>
          </dl>
        </section>

        <section className="a-card">
          <h3>Progression</h3>
          <dl className="a-kv">
            <dt>Opening IQ</dt>
            <dd>{currentIq == null ? "No data yet" : fmtInt(currentIq)}</dd>
            <dt>IQ trend</dt>
            <dd>
              {iqTrend.length >= 2 ? (
                <Sparkline
                  points={iqTrend.map((p) => p.value)}
                  label={`Opening IQ, last ${iqTrend.length} snapshots`}
                />
              ) : (
                "Not enough snapshots"
              )}
            </dd>
            <dt>Streak</dt>
            <dd>{fmtInt(user.streakCount)} day(s)</dd>
            <dt>XP</dt>
            <dd>{fmtInt(user.xp)}</dd>
            <dt>Elo goal</dt>
            <dd>{fmtInt(user.eloGoal)}</dd>
            <dt>DNA test</dt>
            <dd>
              {dna
                ? `${dna.archetype} · initial IQ ${fmtInt(dna.initialIq)} (${fmtDate(dna.createdAt)})`
                : "No data yet"}
            </dd>
          </dl>
        </section>

        <UserActions
          userId={user.id}
          email={user.email}
          accountPlan={accountState?.plan ?? null}
          isPro={accountState?.isPro ?? false}
          role={user.role}
          isSelf={user.id === admin.userId}
          actorViaAllowlist={admin.viaAllowlist}
        />
      </div>

      <section className="a-section">
        <h2 className="a-section-title">Mastery by opening</h2>
        {mastery.length === 0 ? (
          <p className="a-section-note">No mastery rows yet.</p>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Opening</th>
                  <th>State</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {mastery.map((m) => (
                  <tr key={m.slug}>
                    <td>{m.opening}</td>
                    <td>{masteryPill(m.state)}</td>
                    <td className="dim">{fmtDateTime(m.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="a-section">
        <h2 className="a-section-title">
          Seals &amp; achievements ({fmtInt(seals.length)} seal
          {seals.length === 1 ? "" : "s"})
        </h2>
        {achievements.length === 0 ? (
          <p className="a-section-note">No achievements yet.</p>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Key</th>
                  <th>Earned</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((a) => (
                  <tr key={a.key}>
                    <td>
                      <span className="a-pill">{a.type}</span>
                    </td>
                    <td>{a.title}</td>
                    <td className="dim">{a.key}</td>
                    <td className="dim">{fmtDateTime(a.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="a-section">
        <h2 className="a-section-title">Recent activity (last 20 events)</h2>
        {recentEvents.length === 0 ? (
          <p className="a-section-note">No training events yet.</p>
        ) : (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Mode</th>
                  <th>Result</th>
                  <th className="num">Latency</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((e, i) => (
                  <tr key={`${e.createdAt.toISOString()}-${i}`}>
                    <td className="dim">{fmtDateTime(e.createdAt)}</td>
                    <td>{e.mode}</td>
                    <td>
                      {e.correct == null ? (
                        <span className="dim">—</span>
                      ) : e.correct ? (
                        <span className="a-pill is-pro">correct</span>
                      ) : (
                        <span className="a-pill is-bad">miss</span>
                      )}
                    </td>
                    <td className="num dim">
                      {e.latencyMs == null ? "—" : `${fmtInt(e.latencyMs)} ms`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
