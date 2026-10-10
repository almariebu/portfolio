/** Account-closing rules: background job states, ledgers, penalties, reconciliation. */
import { LogicError, flt } from "./logic.ts";

export type Payment = {
  id: string;
  studentId: string;
  amount: number;
  kind: "Down payment" | "Payment";
  posted: boolean;
};
export type ClosingStudent = {
  id: string;
  name: string;
  assessment: number;
  dueDate: string;
};
export type Ledger = {
  studentId: string;
  assessment: number;
  paid: number;
  downPayment: number;
  balance: number;
  credit: number;
};
export type Job = { status: "Queued" | "Running" | "Done"; done: number; total: number };

export const PENALTY_RATE = 0.02;

/** Returns the reason closing cannot start, or null when it can. */
export function closingBlocker(
  term: { name: string; closed: boolean },
  payments: Payment[],
): string | null {
  if (term.closed) return `${term.name} is already closed.`;
  const open = payments.filter((p) => !p.posted).length;
  if (open > 0) {
    return `${open} unposted payment${open === 1 ? "" : "s"} must be posted before ${term.name} can close.`;
  }
  return null;
}

export function startJob(total: number): Job {
  return { status: "Queued", done: 0, total };
}

/** One background tick: queued becomes running, then one ledger per tick. */
export function advanceJob(job: Job): Job {
  if (job.status === "Done") return job;
  if (job.status === "Queued") return { ...job, status: "Running" };
  const done = job.done + 1;
  return { ...job, done, status: done >= job.total ? "Done" : "Running" };
}

export function buildLedger(student: ClosingStudent, payments: Payment[]): Ledger {
  const posted = payments.filter((p) => p.studentId === student.id && p.posted);
  const paid = flt(posted.reduce((s, p) => s + p.amount, 0), 2);
  const downPayment = flt(
    posted.filter((p) => p.kind === "Down payment").reduce((s, p) => s + p.amount, 0),
    2,
  );
  const net = flt(student.assessment - paid, 2);
  // Overpayment is kept as credit on the ledger, never dropped.
  return {
    studentId: student.id,
    assessment: student.assessment,
    paid,
    downPayment,
    balance: Math.max(net, 0),
    credit: Math.max(-net, 0),
  };
}

/** A penalty is due ON the due date (inclusive). ISO dates compare as strings. */
export function isPenaltyDue(dueDate: string, asOf: string): boolean {
  return asOf >= dueDate;
}

export function penaltyFor(balance: number, dueDate: string, asOf: string): number {
  return balance > 0 && isPenaltyDue(dueDate, asOf) ? flt(balance * PENALTY_RATE, 2) : 0;
}

export function postPayment(
  payments: Payment[],
  studentId: string,
  amount: number,
  kind: Payment["kind"],
): Payment[] {
  if (!(amount > 0)) throw new LogicError("Enter an amount greater than zero.");
  const id = `pay-${payments.length + 1}`;
  return [...payments, { id, studentId, amount: flt(amount, 2), kind, posted: true }];
}

export function reconcile(payments: Payment[], counted: number) {
  const expected = flt(
    payments.filter((p) => p.posted).reduce((s, p) => s + p.amount, 0),
    2,
  );
  const variance = flt(counted - expected, 2);
  const status = variance === 0 ? "Balanced" : variance > 0 ? "Over" : "Short";
  return { expected, counted: flt(counted, 2), variance, status } as const;
}
