/**
 * Account snapshot — a generic capture of every persisted client store (all
 * localStorage keys under the chq- prefix: DNA result, archetype, hero,
 * entitlement, world progress, SRS, player). One blob → save/sync across devices,
 * so new modules' state is covered with zero per-store wiring.
 */
const PREFIX = "chq-";

export type Snapshot = Record<string, string>;

export function snapshotLocal(): Snapshot {
  const out: Snapshot = {};
  if (typeof localStorage === "undefined") return out;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) {
      const v = localStorage.getItem(k);
      if (v != null) out[k] = v;
    }
  }
  return out;
}

export function restoreLocal(snap: Snapshot): void {
  if (typeof localStorage === "undefined" || !snap) return;
  for (const [k, v] of Object.entries(snap)) {
    if (k.startsWith(PREFIX) && typeof v === "string") localStorage.setItem(k, v);
  }
}

export function snapshotIsEmpty(snap: Snapshot | null | undefined): boolean {
  return !snap || Object.keys(snap).length === 0;
}
