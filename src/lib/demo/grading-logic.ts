/** Grading rules: current names on records, validation, report remarks. */
import { LogicError, flt } from "./logic.ts";

export type GStudent = { id: string; name: string };
export type GradeEntry = { studentId: string; subject: string; grade: number };

export const PASSING = 75;

export function validateGrade(value: unknown): number {
  const n = value === "" || value === null ? NaN : Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 100) {
    throw new LogicError("A grade must be a number from 0 to 100.");
  }
  return flt(n, 0);
}

export function renameStudent(students: GStudent[], id: string, name: string): GStudent[] {
  const clean = name.trim().replace(/\s+/g, " ");
  if (!clean) throw new LogicError("Student name cannot be empty.");
  return students.map((s) => (s.id === id ? { ...s, name: clean } : s));
}

/** Records keep only the student id; the name is always read from the student. */
export function nameFor(students: GStudent[], id: string): string {
  return students.find((s) => s.id === id)?.name ?? id;
}

export function setGrade(entries: GradeEntry[], studentId: string, subject: string, grade: number) {
  const rest = entries.filter((e) => !(e.studentId === studentId && e.subject === subject));
  return [...rest, { studentId, subject, grade }];
}

export function reportFor(entries: GradeEntry[], studentId: string, subjects: string[]) {
  const rows = subjects.map((subject) => {
    const e = entries.find((x) => x.studentId === studentId && x.subject === subject);
    return { subject, grade: e ? e.grade : null };
  });
  const graded = rows.filter((r) => r.grade !== null) as { subject: string; grade: number }[];
  const average = graded.length
    ? flt(graded.reduce((s, r) => s + r.grade, 0) / graded.length, 2)
    : null;
  const remarks =
    average === null ? "Incomplete" : graded.length < subjects.length ? "Incomplete" : average >= PASSING ? "Passed" : "Failed";
  return { rows, average, remarks };
}
