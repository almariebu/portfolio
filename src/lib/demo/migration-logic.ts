/** Migration rules: default roles, fee code mapping, non-destructive file recovery. */

export type MUser = { id: string; name: string; designation: string; roles: string[] };
export type FeeMapping = Record<string, string>;
export type FileRecord = { name: string; onDisk: boolean };

/** Adds the designation's default roles. Existing roles are kept; safe to re-run. */
export function applyDefaultRoles(
  users: MUser[],
  defaults: Record<string, string[]>,
): MUser[] {
  return users.map((u) => {
    const add = defaults[u.designation] ?? [];
    return { ...u, roles: [...new Set([...u.roles, ...add])] };
  });
}

export function mapFees(oldCodes: string[], mapping: FeeMapping) {
  const mapped = oldCodes.filter((c) => mapping[c]);
  const unmapped = oldCodes.filter((c) => !mapping[c]);
  return { mapped, unmapped };
}

export type Recovery = "recovered" | "kept" | "not in backup";

/** A file already on disk is never overwritten. */
export function recoverFile(rec: FileRecord, backup: string[]): Recovery {
  if (rec.onDisk) return "kept";
  return backup.includes(rec.name) ? "recovered" : "not in backup";
}
