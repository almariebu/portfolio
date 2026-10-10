/**
 * Pure business rules for the browser demos. Ported from the Python module
 * used by the real Frappe app, with the same behavior. No React, no DOM.
 */

export class LogicError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LogicError";
  }
}

export const GRADE_LEVELS: readonly string[] = [
  "Kinder",
  ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
];
export const SENIOR_HIGH_GRADES: readonly string[] = ["Grade 11", "Grade 12"];
export const TEACHER_ROLE = "Teacher";
export const TEACHER_PRIVILEGED_ROLES: readonly string[] = [
  "System Manager",
  "Registrar",
  "Dean",
];

export function flt(value: unknown, precision?: number): number {
  const number = value === null || value === "" ? NaN : Number(value);
  const safe = Number.isFinite(number) ? number : 0;
  if (precision === undefined) return safe;
  const f = 10 ** precision;
  return Math.round((safe + Number.EPSILON) * f) / f;
}

const r2 = (n: number) => flt(n, 2);

export function fmtMoney(n: number): string {
  return n.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ---------------------------------------------------- units and fees
export function totalUnits(units: Iterable<unknown>): number {
  let sum = 0;
  for (const u of units) sum += flt(u);
  return r2(sum);
}

/** A limit of 0 means unlimited. */
export function checkUnitLimit(total: number, maxUnits: number): number {
  const t = flt(total);
  const limit = flt(maxUnits);
  if (limit > 0 && t > limit + 1e-9) {
    throw new LogicError(
      `Total of ${t} units exceeds the ${limit}-unit limit for this term.`,
    );
  }
  return t;
}

export function computeFeeTotals(
  units: number,
  tuitionPerUnit: number,
  miscAmounts: Iterable<unknown>,
) {
  const tuition = r2(flt(units) * flt(tuitionPerUnit));
  let m = 0;
  for (const a of miscAmounts) m += flt(a);
  const misc = r2(m);
  return {
    tuition_total: tuition,
    misc_total: misc,
    total_fees: r2(tuition + misc),
  };
}

export function checkDownpayment(paid: number, required: number): true {
  const p = r2(flt(paid));
  const q = r2(flt(required));
  if (p < q) {
    throw new LogicError(
      `Down payment of ${fmtMoney(p)} is below the required ${fmtMoney(q)}. Record and submit a Student Payment first.`,
    );
  }
  return true;
}

export type PaymentStatus =
  | "Unpaid"
  | "Partial"
  | "Down Payment Met"
  | "Fully Paid";

export function paymentStatus(
  paid: number,
  required: number,
  totalFees: number,
): PaymentStatus {
  const p = flt(paid);
  const q = flt(required);
  const t = flt(totalFees);
  if (p <= 0) return "Unpaid";
  if (t > 0 && p >= t) return "Fully Paid";
  if (p >= q) return "Down Payment Met";
  return "Partial";
}

// ------------------------------------------------ name normalization
const LOWER_PARTICLES = new Set(["de", "la", "ng", "y", "van", "von"]);
const SUFFIXES: Record<string, string> = {
  jr: "Jr.",
  sr: "Sr.",
  ii: "II",
  iii: "III",
  iv: "IV",
};

function capToken(token: string): string {
  return token
    .split(/([-'])/)
    .map((p) =>
      p === "-" || p === "'" ? p : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase(),
    )
    .join("");
}

export function normalizeName(value: unknown): string {
  if (!value) return "";
  const tokens = String(value).replace(/\s+/g, " ").trim().split(" ");
  return tokens
    .map((token, i) => {
      const key = token.toLowerCase().replace(/\.+$/, "");
      if (i > 0 && key in SUFFIXES) return SUFFIXES[key];
      if (i > 0 && LOWER_PARTICLES.has(key)) return key;
      return capToken(token);
    })
    .join(" ");
}

export function normalizeMobile(value: unknown): string {
  const digits = String(value ?? "").replace(/\D/g, "");
  let national: string;
  if (digits.length === 12 && digits.startsWith("63")) national = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) national = digits.slice(1);
  else if (digits.length === 10) national = digits;
  else return "";
  return national.startsWith("9") ? `+63${national}` : "";
}

export function normalizeEmail(value: unknown): string {
  const email = String(value ?? "").trim().toLowerCase();
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : "";
}

export type StudentPayload = Record<string, string>;

/** Never blanks a value, so re-running the enrollment is safe. */
export function buildStudentPayload(
  applicant: Record<string, string | null | undefined> | null,
  existing: Record<string, string | null | undefined> | null = null,
): StudentPayload {
  const a = applicant ?? {};
  const e = existing ?? {};
  const parts = ["first_name", "middle_name", "last_name"].map((k) =>
    normalizeName(a[k]),
  );
  const fresh: Record<string, string | null | undefined> = {
    student_name:
      parts.filter(Boolean).join(" ") || normalizeName(a.full_name),
    email: normalizeEmail(a.email),
    mobile: normalizeMobile(a.mobile),
    gender: a.gender,
    program: a.program,
    academic_term: a.academic_term,
  };
  const merged: StudentPayload = {};
  for (const [key, value] of Object.entries(fresh)) {
    if (value !== null && value !== undefined && value !== "") merged[key] = value;
    else if (e[key] !== null && e[key] !== undefined && e[key] !== "")
      merged[key] = e[key] as string;
  }
  return merged;
}

// -------------------------------------------- basic education rules
export function isSeniorHigh(grade: string): boolean {
  return SENIOR_HIGH_GRADES.includes(grade);
}

export function nextGradeLevel(current: string): string {
  const i = GRADE_LEVELS.indexOf(current);
  if (i < 0) throw new LogicError(`Unknown grade level: '${current}'`);
  if (i === GRADE_LEVELS.length - 1)
    throw new LogicError("Grade 12 completers cannot be promoted further.");
  return GRADE_LEVELS[i + 1];
}

export function resolveGradeLevel(
  enrollmentType: string,
  incoming: string | null | undefined,
  lastGrade: string | null | undefined,
): string {
  if (enrollmentType === "New") {
    if (!incoming || !GRADE_LEVELS.includes(incoming))
      throw new LogicError("Select the incoming grade level for a new student.");
    return incoming;
  }
  if (enrollmentType === "Continuing") {
    if (!lastGrade)
      throw new LogicError(
        "No previous active enrollment found. Use enrollment type New instead.",
      );
    return nextGradeLevel(lastGrade);
  }
  throw new LogicError(`Unknown enrollment type: '${enrollmentType}'`);
}

/** Value for the unique active key. null releases the slot. */
export function activeKey(
  student: string,
  academicYear: string,
  status: string,
  docstatus: number,
): string | null {
  if (status === "Active" && (docstatus === 0 || docstatus === 1) && student && academicYear)
    return `${student}|${academicYear}`;
  return null;
}

export function withdrawalPlan(gradeLevel: string) {
  return { clear_class_list: true, clear_student_grades: isSeniorHigh(gradeLevel) };
}

// ------------------------------------------------------ permissions
export function isTeacherRestricted(roles: Iterable<string>): boolean {
  const set = new Set(roles ?? []);
  return (
    set.has(TEACHER_ROLE) && !TEACHER_PRIVILEGED_ROLES.some((r) => set.has(r))
  );
}

export function teacherCanAccess(
  roles: Iterable<string>,
  user: string,
  assignedTo: string | null | undefined,
): boolean {
  if (!isTeacherRestricted(roles)) return true;
  return Boolean(assignedTo) && assignedTo === user;
}

// ---------------------------------------------------- approval flow
export const WORKFLOW_STATES = [
  "Draft",
  "Pending Dean",
  "Pending Registrar",
  "Pending Finance",
  "Enrolled",
] as const;
export type WorkflowState = (typeof WORKFLOW_STATES)[number] | "Rejected";

/** Which role acts on each state. Draft is submitted by the registrar. */
export const STATE_OWNER: Record<string, string> = {
  Draft: "Registrar",
  "Pending Dean": "Dean",
  "Pending Registrar": "Registrar",
  "Pending Finance": "Finance Officer",
};

const NEXT_STATE: Record<string, WorkflowState> = {
  Draft: "Pending Dean",
  "Pending Dean": "Pending Registrar",
  "Pending Registrar": "Pending Finance",
  "Pending Finance": "Enrolled",
};

export function nextState(state: string): WorkflowState {
  const next = NEXT_STATE[state];
  if (!next) throw new LogicError(`No further approval is possible from ${state}.`);
  return next;
}

export function canAct(role: string, state: string): boolean {
  return STATE_OWNER[state] === role;
}

/** Enforces role and the Finance payment gate; returns the target state. */
export function approve(
  role: string,
  state: string,
  paid: number,
  required: number,
): WorkflowState {
  if (!canAct(role, state))
    throw new LogicError(`${role} cannot approve an assessment in ${state}.`);
  const target = nextState(state);
  if (target === "Enrolled") checkDownpayment(paid, required);
  return target;
}

export function reject(role: string, state: string): WorkflowState {
  if (state === "Draft" || !canAct(role, state))
    throw new LogicError(`${role} cannot reject an assessment in ${state}.`);
  return "Rejected";
}

// -------------------------------------------------------- reporting
export function pipelineCounts<T extends { state: string }>(
  rows: T[],
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const s of [...WORKFLOW_STATES, "Rejected"]) out[s] = 0;
  for (const r of rows) out[r.state] = (out[r.state] ?? 0) + 1;
  return out;
}

// ------------------------------------------------------- validation
export function checkLrn(lrn: unknown): string {
  const value = String(lrn ?? "").replace(/\s/g, "");
  if (value && !/^\d{12}$/.test(value))
    throw new LogicError("LRN must be exactly 12 digits.");
  return value;
}

export function checkGrade(grade: unknown): number {
  const value = flt(grade);
  if (value < 0 || value > 100)
    throw new LogicError("Grade must be between 0 and 100.");
  return value;
}
