"use client";

import { useEffect, useRef, useState } from "react";
import { Card, DataTable, DemoShell, Desk, Field, Messages, btn, inputClass, money } from "./ui";
import { useDemoStore } from "./useDemoStore";
import { useMessages } from "./useMessages";
import { closingSeed, type ClosingState } from "@/lib/demo/cases-data.ts";
import {
  advanceJob,
  buildLedger,
  closingBlocker,
  penaltyFor,
  postPayment,
  reconcile,
  startJob,
  type Job,
} from "@/lib/demo/closing-logic.ts";
import { LogicError } from "@/lib/demo/logic.ts";

const TRY_THIS = [
  "Press Close term. It cannot start: Dino Cruz's down payment is still unposted. Post it, then close again.",
  "Watch the closing job go Queued, Running, Done while the student ledgers are built in the background.",
  "As cashier, post a down payment or a payment for any student, then reconcile the till against a counted amount.",
  "Overpay a student (Carla Lim already paid 9,500.00 on 9,000.00). The ledger shows the 500.00 as credit.",
  "Set the as-of date to 2026-10-14, then 2026-10-15. Penalties appear on the due date itself, not the day after.",
];

export default function ClosingDemo() {
  const { state, save, reset } = useDemoStore<ClosingState>("demo:account-closing:v1", closingSeed);
  const { error, notice, run, clear } = useMessages();
  const [job, setJob] = useState<Job | null>(null);
  const [asOf, setAsOf] = useState("2026-10-15");
  const [studentId, setStudentId] = useState("s1");
  const [amount, setAmount] = useState("1000");
  const [kind, setKind] = useState<"Down payment" | "Payment">("Down payment");
  const [counted, setCounted] = useState("");
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    if (!job || job.status === "Done") return;
    const t = setTimeout(() => {
      const next = advanceJob(job);
      setJob(next);
      if (next.status === "Done") {
        const s = stateRef.current;
        save({
          ...s,
          term: { ...s.term, closed: true },
          ledgers: s.students.map((x) => buildLedger(x, s.payments)),
        });
      }
    }, 700);
    return () => clearTimeout(t);
  }, [job, save]);

  const nameOf = (id: string) => state.students.find((s) => s.id === id)?.name ?? id;
  const running = job !== null && job.status !== "Done";

  const closeTerm = () =>
    run(() => {
      const why = closingBlocker(state.term, state.payments);
      if (why) throw new LogicError(why);
      setJob(startJob(state.students.length));
      return "Account closing queued. It runs in the background.";
    });

  const post = () =>
    run(() => {
      if (state.term.closed) throw new LogicError("The term is closed. Payments are no longer posted to it.");
      const next = postPayment(state.payments, studentId, Number(amount), kind);
      save({ ...state, payments: next });
      return `${kind} of ${money(Number(amount))} posted for ${nameOf(studentId)}.`;
    });

  const postPending = (id: string) => {
    save({ ...state, payments: state.payments.map((p) => (p.id === id ? { ...p, posted: true } : p)) });
    clear();
  };

  const doReconcile = () =>
    run(() => {
      const r = reconcile(state.payments, Number(counted) || 0);
      return `Expected ${money(r.expected)}, counted ${money(r.counted)}: ${r.status}${r.variance ? ` by ${money(Math.abs(r.variance))}` : ""}.`;
    });

  return (
    <DemoShell
      title="Account closing and cashiering"
      intro="A browser simulation of a real app built in Frappe. The real app closes the term in a background job; here a timer stands in for the job queue. Nothing leaves your browser."
      tryThis={TRY_THIS}
      backHref="/?panel=work&study=account-closing"
      onReset={() => {
        reset();
        setJob(null);
        clear();
      }}
    >
      <Desk>
        <Messages error={error} notice={notice} />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card title={state.term.name}>
            <p className="text-sm text-ink-muted">
              Term status: <strong>{state.term.closed ? "Closed" : "Open"}</strong>
            </p>
            <button type="button" className={`${btn.primary} mt-3`} onClick={closeTerm} disabled={running}>
              Close term
            </button>
            {job ? (
              <div className="mt-3 text-sm" role="status" aria-live="polite">
                <p>
                  Job: <strong>{job.status}</strong> · {job.done} of {job.total} ledgers built
                </p>
                <progress className="mt-1 w-full" value={job.done} max={job.total} aria-label="Closing progress" />
              </div>
            ) : null}
          </Card>

          <Card title="Cashier tellering">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id="c-student" label="Student">
                <select id="c-student" className={inputClass} value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                  {state.students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </Field>
              <Field id="c-kind" label="Type">
                <select id="c-kind" className={inputClass} value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
                  <option>Down payment</option>
                  <option>Payment</option>
                </select>
              </Field>
              <Field id="c-amount" label="Amount">
                <input id="c-amount" className={inputClass} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </Field>
              <div className="flex items-end">
                <button type="button" className={btn.gold} onClick={post}>Post payment</button>
              </div>
              <Field id="c-counted" label="Cash counted (reconciliation)">
                <input id="c-counted" className={inputClass} inputMode="decimal" value={counted} onChange={(e) => setCounted(e.target.value)} />
              </Field>
              <div className="flex items-end">
                <button type="button" className={btn.ghost} onClick={doReconcile}>Reconcile</button>
              </div>
            </div>
          </Card>

          <Card title="Payments">
            <DataTable
              head={["Student", "Type", "Amount", "Status"]}
              rows={state.payments.map((p) => [
                nameOf(p.studentId),
                p.kind,
                money(p.amount),
                p.posted ? "Posted" : (
                  <button key={p.id} type="button" className={btn.ghost} onClick={() => postPending(p.id)}>
                    Post
                  </button>
                ),
              ])}
            />
          </Card>

          <Card
            title="Student ledgers"
            action={
              <label className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
                As of
                <input type="date" className={`${inputClass} !w-auto`} value={asOf} onChange={(e) => setAsOf(e.target.value)} />
              </label>
            }
          >
            <DataTable
              empty="No ledgers yet. They are built when the closing job finishes."
              head={["Student", "Paid", "Balance", "Credit", "Penalty"]}
              rows={state.ledgers.map((l) => {
                const stu = state.students.find((s) => s.id === l.studentId)!;
                return [
                  stu.name,
                  money(l.paid),
                  money(l.balance),
                  money(l.credit),
                  money(penaltyFor(l.balance, stu.dueDate, asOf)),
                ];
              })}
            />
            <p className="mt-2 text-xs text-ink-muted">Penalty is 2% of the balance, due from the due date (Oct 15 or Nov 15).</p>
          </Card>
        </div>
      </Desk>
    </DemoShell>
  );
}
