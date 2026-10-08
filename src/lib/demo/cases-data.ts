/** Seed data for the smaller demos. Names are made up. */
import type { ClosingStudent, Ledger, Payment } from "./closing-logic.ts";
import type { DiscStudent, DiscountRecord } from "./discount-logic.ts";
import type { Fee, Settings } from "./payments-logic.ts";
import type { GStudent, GradeEntry } from "./grading-logic.ts";
import type { EmailAccount, EmailItem, Provider } from "./messaging-logic.ts";
import type { MUser } from "./migration-logic.ts";

// ---- account closing
export type ClosingState = {
  term: { name: string; closed: boolean };
  students: ClosingStudent[];
  payments: Payment[];
  ledgers: Ledger[];
};
export const closingSeed = (): ClosingState => ({
  term: { name: "1st Semester 2026-2027", closed: false },
  students: [
    { id: "s1", name: "Ana Reyes", assessment: 12000, dueDate: "2026-10-15" },
    { id: "s2", name: "Ben Santos", assessment: 15000, dueDate: "2026-10-15" },
    { id: "s3", name: "Carla Lim", assessment: 9000, dueDate: "2026-11-15" },
    { id: "s4", name: "Dino Cruz", assessment: 11000, dueDate: "2026-11-15" },
  ],
  payments: [
    { id: "pay-1", studentId: "s1", amount: 12000, kind: "Payment", posted: true },
    { id: "pay-2", studentId: "s2", amount: 5000, kind: "Down payment", posted: true },
    { id: "pay-3", studentId: "s3", amount: 9500, kind: "Payment", posted: true },
    { id: "pay-4", studentId: "s4", amount: 3000, kind: "Down payment", posted: false },
  ],
  ledgers: [],
});

// ---- discounts
export const DISC_TYPES = ["Sibling", "Academic", "Staff child"];
export const DISC_YEARS = ["2025-2026", "2026-2027"];
export const DISC_SEMS = ["1st Semester", "2nd Semester"];
export type DiscountState = { students: DiscStudent[]; records: DiscountRecord[] };
export const discountSeed = (): DiscountState => ({
  students: [
    { id: "d1", name: "Ana Reyes", assessment: 20000, paid: 8000, year: "2026-2027", semester: "1st Semester" },
    { id: "d2", name: "Ben Santos", assessment: 18000, paid: 0, year: "2026-2027", semester: "1st Semester" },
    { id: "d3", name: "Carla Lim", assessment: 22000, paid: 22000, year: "2026-2027", semester: "1st Semester" },
    { id: "d4", name: "Dino Cruz", assessment: 19000, paid: 5000, year: "2026-2027", semester: "1st Semester" },
    { id: "d5", name: "Ella Tan", assessment: 17000, paid: 0, year: "2025-2026", semester: "2nd Semester" },
  ],
  records: [
    { studentId: "d5", year: "2025-2026", semester: "2nd Semester", type: "Academic", basis: "assessment", amount: 1700 },
    { studentId: "d3", year: "2026-2027", semester: "1st Semester", type: "Staff child", basis: "assessment", amount: 5500 },
  ],
});

// ---- online payments
export type GatewayPayment = { id: string; studentId: string; ref: string; amount: number; pulled: boolean };
export type OnlineState = {
  settings: Settings;
  incoming: GatewayPayment[];
  fees: Record<string, Fee[]>;
  credit: Record<string, number>;
};
export const ONLINE_STUDENTS: Record<string, string> = { o1: "Ana Reyes", o2: "Ben Santos" };
export const onlineSeed = (): OnlineState => ({
  settings: { baseUrl: "https://pay.example-school.test", merchantId: "SCHOOL-0042" },
  incoming: [
    { id: "g1", studentId: "o1", ref: "GW-1001", amount: 7500, pulled: false },
    { id: "g2", studentId: "o2", ref: "GW-1002", amount: 12000, pulled: false },
  ],
  fees: {
    o1: [
      { id: "f3", label: "Laboratory fee", due: "2026-12-01", amount: 2000, paid: 0 },
      { id: "f1", label: "Tuition, 1st installment", due: "2026-08-15", amount: 5000, paid: 1000 },
      { id: "f2", label: "Tuition, 2nd installment", due: "2026-10-15", amount: 5000, paid: 0 },
    ],
    o2: [
      { id: "f4", label: "Tuition, 1st installment", due: "2026-08-15", amount: 6000, paid: 0 },
      { id: "f5", label: "Tuition, 2nd installment", due: "2026-10-15", amount: 6000, paid: 0 },
    ],
  },
  credit: {},
});

// ---- grading
export const SUBJECTS = ["Math", "Science", "English"];
export type GradingState = { students: GStudent[]; entries: GradeEntry[] };
export const gradingSeed = (): GradingState => ({
  students: [
    { id: "g1", name: "Ana Reyes" },
    { id: "g2", name: "Ben Santos" },
    { id: "g3", name: "Carla Lim" },
  ],
  entries: [
    { studentId: "g1", subject: "Math", grade: 88 },
    { studentId: "g1", subject: "Science", grade: 91 },
    { studentId: "g1", subject: "English", grade: 84 },
    { studentId: "g2", subject: "Math", grade: 72 },
  ],
});

// ---- sms and email
export type MsgLog = { id: number; channel: "SMS" | "Email"; to: string; via: string; note: string };
export type MessagingState = {
  providers: Provider[];
  preferred: string;
  texts: { id: string; to: string; text: string; sent: boolean }[];
  accounts: EmailAccount[];
  emails: EmailItem[];
  log: MsgLog[];
};
export const messagingSeed = (): MessagingState => ({
  providers: [
    { id: "old", name: "Old SMS provider", enabled: false },
    { id: "new", name: "New SMS provider", enabled: true },
  ],
  preferred: "old",
  texts: [
    { id: "t1", to: "0917 000 0001", text: "Ana Reyes: balance of 4,000.00 is due on Oct 15.", sent: false },
    { id: "t2", to: "0917 000 0002", text: "Ben Santos: balance of 10,000.00 is due on Oct 15.", sent: false },
  ],
  accounts: [
    { id: "a1", address: "billing-old@school.test", enabled: false, isDefault: false },
    { id: "a2", address: "billing@school.test", enabled: true, isDefault: true },
  ],
  emails: [
    { id: "e1", to: "parents@school.test", subject: "Weekly billing digest", accountId: "a1", status: "Stuck" },
    { id: "e2", to: "finance@school.test", subject: "Daily collections digest", accountId: "a2", status: "Queued" },
    { id: "e3", to: "dean@school.test", subject: "Enrollment digest", accountId: null, status: "Stuck" },
  ],
  log: [],
});

// ---- roles and migration
export const DEFAULT_ROLES: Record<string, string[]> = {
  Cashier: ["Cashier", "Accounts User"],
  Registrar: ["Registrar", "Student"],
  Teacher: ["Teacher"],
};
export const OLD_FEES = ["TUI-A", "LAB-1", "MISC", "LIB-OLD"];
export const NEW_FEES = ["Tuition", "Laboratory", "Miscellaneous", "Library"];
export const MIGRATION_FILES = ["enrollment-form-ana.pdf", "receipt-0042.jpg", "grades-g7.xlsx"];
export type MigrationState = {
  users: MUser[];
  mapping: Record<string, string>;
  files: { name: string; onDisk: boolean }[];
  backup: string[];
  result: Record<string, string>;
};
export const migrationSeed = (): MigrationState => ({
  users: [
    { id: "u1", name: "Maria Lopez", designation: "Cashier", roles: [] },
    { id: "u2", name: "Jon Dela Cruz", designation: "Registrar", roles: ["Custom Report Viewer"] },
    { id: "u3", name: "Liza Ocampo", designation: "Teacher", roles: [] },
  ],
  mapping: { "TUI-A": "Tuition" },
  files: [
    { name: "enrollment-form-ana.pdf", onDisk: false },
    { name: "receipt-0042.jpg", onDisk: true },
    { name: "grades-g7.xlsx", onDisk: false },
  ],
  backup: ["enrollment-form-ana.pdf", "receipt-0042.jpg"],
  result: {},
});
