export const MAX_UNITS = 24;

export type Role = "encoder" | "dean" | "registrar" | "finance";
export type Status = "draft" | "dean" | "registrar" | "finance" | "enrolled";

export type EnrollmentInput = {
  studentName: unknown;
  units: unknown;
  feeCents: unknown;
};

export function validateEnrollmentInput(input: EnrollmentInput): string[] {
  const errors: string[] = [];
  const { studentName, units, feeCents } = input;
  if (typeof studentName !== "string" || studentName.trim() === "") {
    errors.push("studentName is required");
  }
  if (!Number.isInteger(units) || (units as number) < 1 || (units as number) > MAX_UNITS) {
    errors.push(`units must be between 1 and ${MAX_UNITS}`);
  }
  if (!Number.isInteger(feeCents) || (feeCents as number) < 0) {
    errors.push("feeCents must be a non-negative integer");
  }
  return errors;
}

const NEXT: Partial<Record<Status, Status>> = {
  dean: "registrar",
  registrar: "finance",
  finance: "enrolled",
};

export function nextStatus(status: Status): Status | null {
  return NEXT[status] ?? null;
}

/** The role that owns each stage of the workflow. */
const STAGE_OWNER: Record<Status, Role | null> = {
  draft: "encoder",
  dean: "dean",
  registrar: "registrar",
  finance: "finance",
  enrolled: null,
};

export function canActAt(role: Role, status: Status): boolean {
  return STAGE_OWNER[status] === role;
}

export function paymentCovers(e: { feeCents: number; paidCents: number }): boolean {
  return e.paidCents >= e.feeCents;
}
