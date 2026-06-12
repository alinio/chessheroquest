/**
 * /passport — Opening Passport. Real data only: FSRS mastery per curated path
 * (getOpeningMastery, keyed by path slug → mapped to OpeningId via
 * OPENING_TO_PATH) + Guardian victories (achievements). Four medallion states
 * (domain: medallionState) and the computed "Next seal" banner
 * (nextSealIndex) — gold > solid > best coverage.
 */
import { auth } from "@/src/lib/auth";
import { getOpeningMastery } from "@/src/data/repos/openings";
import { getGuardianVictories } from "@/src/data/repos/achievements";
import { PassportScreen, type NextSealView, type PassportOpeningView } from "@/src/ui/passport/PassportScreen";
import { ASSETS, OPENING_NAMES, type OpeningId } from "@/src/lib/assets";
import { OPENING_TO_PATH } from "@/src/lib/opening-paths";
import { STARTER_PATHS } from "@/src/domain/repertoire/starter-paths";
import { fenAfter, moveSquaresAt } from "@/src/domain/repertoire/line";
import { GUARDIANS, PATH_SIDE } from "@/src/domain/world/guardians";
import {
  medallionState, nextSealIndex, trainingChip, type PassportProgress,
} from "@/src/domain/passport";

const sealDate = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default async function PassportPage() {
  const session = await auth();
  const [mastery, wins] = session?.user?.id
    ? await Promise.all([
        getOpeningMastery(session.user.id),
        getGuardianVictories(session.user.id),
      ])
    : [{}, {} as Record<string, Date>];

  const ids = Object.keys(ASSETS.openings) as OpeningId[];

  // One PassportProgress per opening, from its MAINLINE curated path (the
  // line the Guardian duels on — the seal path).
  const entries: (PassportProgress | null)[] = ids.map((id) => {
    const pathId = OPENING_TO_PATH[id];
    const m = pathId ? mastery[pathId] : undefined;
    if (!pathId || !m) return null;
    return {
      studied: m.studied,
      total: m.total,
      state: m.state,
      guardianDefeated: Boolean(wins[pathId]),
    };
  });

  const openings: PassportOpeningView[] = ids.map((id, i) => {
    const e = entries[i] ?? null;
    const pathId = OPENING_TO_PATH[id] ?? null;
    const medallion = medallionState(e);
    const winDate = pathId ? wins[pathId] : undefined;
    const href =
      pathId === null
        ? null
        : medallion === "ready"
          ? `/boss/${pathId}`
          : medallion === "unexplored"
            ? `/train/${pathId}/learn`
            : `/train/${pathId}`;
    return {
      id,
      name: OPENING_NAMES[id],
      medallion,
      studied: e?.studied ?? 0,
      total: e?.total ?? 0,
      chip: e && medallion === "training" ? trainingChip(e.state) : null,
      sealedDate: medallion === "sealed" && winDate ? sealDate(winDate) : null,
      href,
    };
  });

  // The "Next seal" banner — the not-yet-sealed opening closest to its seal.
  let nextSeal: NextSealView | null = null;
  const ni = nextSealIndex(entries);
  if (ni >= 0) {
    const id = ids[ni]!;
    const e = entries[ni]!;
    const pathId = OPENING_TO_PATH[id]!;
    const path = STARTER_PATHS.find((p) => p.id === pathId);
    const guardian = GUARDIANS[id];
    if (path && guardian && path.moves.length > 0) {
      const ready = e.state === "gold";
      nextSeal = {
        openingId: id,
        openingName: OPENING_NAMES[id],
        ready,
        studied: e.studied,
        total: e.total,
        guardianName: guardian.name,
        guardianArt: guardian.art,
        board: {
          fen: fenAfter(path, path.moves.length),
          orientation: PATH_SIDE[path.id] ?? "white",
          lastMove: moveSquaresAt(path, path.moves.length - 1),
        },
        href: ready
          ? `/boss/${pathId}`
          : e.studied < e.total
            ? `/train/${pathId}/learn`
            : `/drill/${pathId}`,
      };
    }
  }

  return <PassportScreen openings={openings} nextSeal={nextSeal} />;
}
