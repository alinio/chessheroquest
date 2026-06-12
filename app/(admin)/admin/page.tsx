/**
 * Admin dashboard — every tile is a REAL aggregate from src/data/repos/admin.ts.
 * A tile shows "No data yet" when its source table is empty (never a dressed-up
 * zero, never an invented number). Estimates are labeled as estimates.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/admin";
import {
  getAccountsKpis,
  getActivityKpis,
  getEngagementKpis,
  getFunnelKpis,
  getRevenueKpis,
  PLAN_PRICES_USD,
} from "@/src/data/repos/admin";
import { Sparkline } from "@/src/ui/admin/Sparkline";
import { fmtInt, fmtPct, fmtUsd } from "@/src/ui/admin/format";

export const metadata: Metadata = { title: "Dashboard" };

function KpiValue({
  value,
  format = fmtInt,
}: {
  value: number | null;
  format?: (n: number) => string;
}) {
  if (value == null) return <div className="a-nodata">No data yet</div>;
  return <div className="a-kpi">{format(value)}</div>;
}

export default async function AdminDashboardPage() {
  await requireAdmin(); // defense in depth — the layout alone is not enough

  const [accounts, activity, funnel, revenue, engagement] = await Promise.all([
    getAccountsKpis(),
    getActivityKpis(),
    getFunnelKpis(),
    getRevenueKpis(),
    getEngagementKpis(),
  ]);

  const sparkPoints = accounts.signupsByDay.map((d) => d.count);
  const hasSignupSignal = accounts.totalUsers > 0;

  return (
    <>
      <h1 className="a-h1">Dashboard</h1>
      <p className="a-sub">
        Live aggregates from Postgres. Tiles say &ldquo;No data yet&rdquo; when the
        source table is empty; estimates are labeled.
      </p>

      <section className="a-section">
        <h2 className="a-section-title">Accounts</h2>
        <div className="a-grid">
          <Link href="/admin/users" className="a-tile">
            <div className="a-tile-label">Total accounts (users)</div>
            <KpiValue value={accounts.totalUsers} />
            <div className="a-kpi-sub">Credentials accounts — view all →</div>
          </Link>
          <Link href="/admin/users" className="a-tile">
            <div className="a-tile-label">New accounts — last 7 days</div>
            <KpiValue value={hasSignupSignal ? accounts.newLast7d : null} />
            {hasSignupSignal && (
              <Sparkline points={sparkPoints} label="Signups per day, last 7 days" />
            )}
            <div className="a-kpi-sub">Signups per day (UTC)</div>
          </Link>
        </div>
      </section>

      <section className="a-section">
        <h2 className="a-section-title">Activity</h2>
        <p className="a-section-note">From training_events (the raw signal moat).</p>
        <div className="a-grid">
          <div className="a-tile">
            <div className="a-tile-label">Active users — 24h</div>
            <KpiValue value={activity.active24h} />
            <div className="a-kpi-sub">Distinct trainers</div>
          </div>
          <div className="a-tile">
            <div className="a-tile-label">Active users — 7 days</div>
            <KpiValue value={activity.active7d} />
            <div className="a-kpi-sub">Distinct trainers</div>
          </div>
          <div className="a-tile">
            <div className="a-tile-label">Drills recorded — 7 days</div>
            <KpiValue value={activity.drills7d} />
            <div className="a-kpi-sub">training_events, mode = drill</div>
          </div>
          <div className="a-tile">
            <div className="a-tile-label">Guardian duels won — 7 days</div>
            <KpiValue value={activity.duelsWon7d} />
            <div className="a-kpi-sub">achievements, type = guardian_defeated</div>
          </div>
        </div>
      </section>

      <section className="a-section">
        <h2 className="a-section-title">Funnel</h2>
        <p className="a-section-note">
          Server-side proxies — client funnel analytics live in PostHog/track events.
        </p>
        <div className="a-funnel">
          <div className="a-tile">
            <div className="a-tile-label">DNA tests saved</div>
            <KpiValue value={funnel.dnaTests} />
            <div className="a-kpi-sub">dna_results rows</div>
          </div>
          <div className="a-funnel-rate">
            <strong>
              {funnel.dnaToAccountRate == null ? "—" : fmtPct(funnel.dnaToAccountRate)}
            </strong>
            → account
          </div>
          <div className="a-tile">
            <div className="a-tile-label">Accounts</div>
            <KpiValue value={funnel.accounts} />
            <div className="a-kpi-sub">users rows</div>
          </div>
          <div className="a-funnel-rate">
            <strong>
              {funnel.accountToPremiumRate == null
                ? "—"
                : fmtPct(funnel.accountToPremiumRate)}
            </strong>
            → premium
          </div>
          <div className="a-tile">
            <div className="a-tile-label">Premium accounts</div>
            <KpiValue value={funnel.premium} />
            <div className="a-kpi-sub">account_states, plan ≠ free (Paddle-verified)</div>
          </div>
        </div>
      </section>

      <section className="a-section">
        <h2 className="a-section-title">Revenue</h2>
        <p className="a-section-note">
          Estimated from plans — Paddle is the source of truth (Phase C).
        </p>
        <div className="a-grid">
          <div className="a-tile">
            <div className="a-tile-label">Estimated MRR</div>
            <KpiValue value={revenue.estimatedMrrUsd} format={fmtUsd} />
            <div className="a-kpi-sub">Monthly + annual ÷ 12 · lifetime excluded</div>
          </div>
          <div className="a-tile">
            <div className="a-tile-label">Pro Monthly ({fmtUsd(PLAN_PRICES_USD.pro_monthly)}/mo)</div>
            <KpiValue value={revenue.hasData ? revenue.monthlyCount : null} />
            <div className="a-kpi-sub">Active plan rows</div>
          </div>
          <div className="a-tile">
            <div className="a-tile-label">Pro Annual ({fmtUsd(PLAN_PRICES_USD.pro_annual)}/yr)</div>
            <KpiValue value={revenue.hasData ? revenue.annualCount : null} />
            <div className="a-kpi-sub">Active plan rows</div>
          </div>
          <div className="a-tile">
            <div className="a-tile-label">Lifetime ({fmtUsd(PLAN_PRICES_USD.lifetime)} once)</div>
            <KpiValue value={revenue.hasData ? revenue.lifetimeCount : null} />
            <div className="a-kpi-sub">
              One-off{" "}
              {revenue.lifetimeOneOffUsd == null ? "—" : fmtUsd(revenue.lifetimeOneOffUsd)}{" "}
              · not in MRR
            </div>
          </div>
        </div>
        {revenue.unknownPlanCount > 0 && (
          <p className="a-section-note">
            ⚠ {fmtInt(revenue.unknownPlanCount)} premium row(s) with an unrecognized plan
            string (excluded from the MRR estimate).
          </p>
        )}
      </section>

      <section className="a-section">
        <h2 className="a-section-title">Engagement</h2>
        <div className="a-grid">
          <div className="a-tile">
            <div className="a-tile-label">Active streaks</div>
            <KpiValue value={engagement.activeStreaks} />
            <div className="a-kpi-sub">users.streak_count &gt; 0</div>
          </div>
          <div className="a-tile">
            <div className="a-tile-label">Average Opening IQ</div>
            <KpiValue
              value={engagement.avgIq}
              format={(n) => fmtInt(Math.round(n))}
            />
            <div className="a-kpi-sub">Latest snapshot per user</div>
          </div>
          <div className="a-tile">
            <div className="a-tile-label">Seals earned (total)</div>
            <KpiValue value={engagement.sealsTotal} />
            <div className="a-kpi-sub">
              guardian_defeated count — gold-mastery cross-check in Phase B
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
