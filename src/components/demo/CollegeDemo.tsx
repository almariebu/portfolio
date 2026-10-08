"use client";

import { useState } from "react";
import {
  Card,
  Desk,
  DemoShell,
  Field,
  Messages,
  Pill,
  RoleSwitcher,
  btn,
  inputClass,
  money,
} from "./ui";
import { useDemoStore } from "./useDemoStore";
import {
  MISC_FEES,
  PROGRAMS,
  SUBJECTS,
  TERM,
  collegeSeed,
  type Applicant,
  type Assessment,
  type CollegeState,
} from "@/lib/demo/college-data";
import {
  LogicError,
  STATE_OWNER,
  WORKFLOW_STATES,
  approve,
  buildStudentPayload,
  canAct,
  checkUnitLimit,
  computeFeeTotals,
  flt,
  paymentStatus,
  pipelineCounts,
  reject,
  totalUnits,
} from "@/lib/demo/logic.ts";

const ROLES = [
  { id: "Applicant", label: "Applicant" },
  { id: "Dean", label: "Dean" },
  { id: "Registrar", label: "Registrar" },
  { id: "Finance Officer", label: "Finance Officer" },
  { id: "Cashier", label: "Cashier" },
];

const TRY_THIS = [
  "As Registrar, open an applicant with no assessment, pick subjects, and add more than 24 units to see the term limit error.",
  "Save the assessment, then submit it. Switch to Dean, Registrar, and Finance Officer to approve each step. Only the right role sees the buttons.",
  "As Finance Officer, try to Enroll Mark Joseph (only 1,500.00 paid). It is blocked until the down payment of 5,000.00 is met.",
  "As Cashier, post a payment for Mark Joseph, then go back to Finance and Enroll.",
  "As Finance Officer, use Re-run enrollment on an enrolled student. The record is updated, never duplicated.",
];

function fullName(a: Applicant) {
  return [a.first_name, a.middle_name, a.last_name].filter(Boolean).join(" ");
}

function figures(asm: Assessment) {
  const subjects = SUBJECTS.filter((s) => asm.subjects.includes(s.code));
  const units = totalUnits(subjects.map((s) => s.units));
  const fees = computeFeeTotals(
    units,
    TERM.tuitionPerUnit,
    MISC_FEES.map((f) => f.amount),
  );
  const paid = flt(asm.payments.reduce((n, p) => n + p.amount, 0), 2);
  return {
    units,
    ...fees,
    paid,
    status: paymentStatus(paid, TERM.requiredDownpayment, fees.total_fees),
  };
}

export default function CollegeDemo() {
  const { state, save, reset } = useDemoStore<CollegeState>(
    "demo:college-enrollment:v1",
    collegeSeed,
  );
  const [role, setRole] = useState("Registrar");
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const say = (n: string | null, e: string | null = null) => {
    setNotice(n);
    setError(e);
  };
  const run = (fn: () => string) => {
    try {
      say(fn());
    } catch (e) {
      if (e instanceof LogicError) say(null, e.message);
      else throw e;
    }
  };

  const counts = pipelineCounts(state.assessments);
  const applicant = state.applicants.find((a) => a.id === selected) ?? null;
  const assessment =
    state.assessments.find((a) => a.applicantId === selected) ?? null;

  const addApplicant = (a: Omit<Applicant, "id">) => {
    const id = `APP-${String(state.seq).padStart(4, "0")}`;
    save({
      ...state,
      seq: state.seq + 1,
      applicants: [...state.applicants, { ...a, id }],
    });
    setSelected(id);
    say(`Applicant ${id} created.`);
  };

  const patchAssessment = (next: Assessment) =>
    save({
      ...state,
      assessments: state.assessments.map((a) => (a.id === next.id ? next : a)),
    });

  return (
    <DemoShell
      title="College admission and enrollment"
      intro="A browser simulation of a Frappe v15 app. The real app is built in Frappe; this page re-creates its approval workflow and business rules with no server. Pick a role, then work an applicant from Draft to Enrolled."
      tryThis={TRY_THIS}
      backHref="/?panel=work&study=college-enrollment"
      onReset={() => {
        reset();
        setSelected(null);
        say(null);
      }}
    >
      <Desk>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <RoleSwitcher
            roles={ROLES}
            value={role}
            onChange={(r) => {
              setRole(r);
              say(null);
            }}
          />
          <p className="text-xs text-ink-muted">
            Term: {TERM.name} · max {TERM.maxUnits} units · down payment{" "}
            {money(TERM.requiredDownpayment)}
          </p>
        </div>

        <div className="mt-4">
          <Card title="Enrollment pipeline">
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {[...WORKFLOW_STATES, "Rejected"].map((s) => (
                <li
                  key={s}
                  className="rounded-lg border border-paper-line bg-paper px-3 py-2"
                >
                  <p className="text-2xl font-semibold tabular-nums">
                    {counts[s]}
                  </p>
                  <p className="text-xs text-ink-muted">{s}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-4">
          <Messages error={error} notice={notice} />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="space-y-4">
            <Card title="Applicants">
              <ul className="divide-y divide-paper-line">
                {state.applicants.map((a) => {
                  const asm = state.assessments.find(
                    (x) => x.applicantId === a.id,
                  );
                  const isSel = a.id === selected;
                  return (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(a.id);
                          say(null);
                        }}
                        aria-pressed={isSel}
                        className={`flex w-full flex-wrap items-center justify-between gap-2 px-2 py-2.5 text-left hover:bg-paper-soft focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold-deep ${
                          isSel ? "bg-gold-soft" : ""
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-semibold">
                            {fullName(a)}
                          </span>
                          <span className="block text-xs text-ink-muted">
                            {a.id} · {a.program}
                          </span>
                        </span>
                        {asm ? (
                          <Pill>{asm.state}</Pill>
                        ) : (
                          <span className="text-xs text-ink-muted">
                            No assessment
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
            {role === "Applicant" ? (
              <NewApplicant onAdd={addApplicant} />
            ) : null}
          </div>

          <div>
            {!applicant ? (
              <Card title="Details">
                <p className="text-sm text-ink-muted">
                  Select an applicant to see their assessment.
                </p>
              </Card>
            ) : (
              <ApplicantDetail
                key={applicant.id}
                role={role}
                applicant={applicant}
                assessment={assessment}
                state={state}
                onCreate={(subjects) =>
                  run(() => {
                    const units = totalUnits(
                      SUBJECTS.filter((s) => subjects.includes(s.code)).map(
                        (s) => s.units,
                      ),
                    );
                    if (subjects.length === 0)
                      throw new LogicError("Select at least one subject.");
                    checkUnitLimit(units, TERM.maxUnits);
                    const n = state.seq;
                    save({
                      ...state,
                      seq: n + 1,
                      assessments: [
                        ...state.assessments,
                        {
                          id: `ASM-${String(n).padStart(4, "0")}`,
                          applicantId: applicant.id,
                          subjects,
                          state: "Draft",
                          payments: [],
                        },
                      ],
                    });
                    return "Assessment saved as Draft.";
                  })
                }
                onSaveSubjects={(subjects) =>
                  run(() => {
                    if (!assessment) return "";
                    const units = totalUnits(
                      SUBJECTS.filter((s) => subjects.includes(s.code)).map(
                        (s) => s.units,
                      ),
                    );
                    checkUnitLimit(units, TERM.maxUnits);
                    patchAssessment({ ...assessment, subjects });
                    return "Subjects updated.";
                  })
                }
                onApprove={() =>
                  run(() => {
                    if (!assessment) return "";
                    const f = figures(assessment);
                    const target = approve(
                      role,
                      assessment.state,
                      f.paid,
                      TERM.requiredDownpayment,
                    );
                    if (target === "Enrolled") return enroll(assessment, true);
                    patchAssessment({ ...assessment, state: target });
                    return `Moved to ${target}.`;
                  })
                }
                onReject={() =>
                  run(() => {
                    if (!assessment) return "";
                    patchAssessment({
                      ...assessment,
                      state: reject(role, assessment.state),
                    });
                    return "Assessment rejected.";
                  })
                }
                onRerun={() => run(() => (assessment ? enroll(assessment, false) : ""))}
                onPay={(amount, mode) =>
                  run(() => {
                    if (!assessment) return "";
                    if (!(amount > 0))
                      throw new LogicError("Enter a payment amount above zero.");
                    if (assessment.state === "Rejected")
                      throw new LogicError(
                        "Cannot post a payment to a rejected assessment.",
                      );
                    patchAssessment({
                      ...assessment,
                      payments: [
                        ...assessment.payments,
                        {
                          id: `PAY-${assessment.id.slice(4)}-${assessment.payments.length + 1}`,
                          amount: flt(amount, 2),
                          mode,
                        },
                      ],
                    });
                    return `Student Payment of ${money(flt(amount, 2))} submitted.`;
                  })
                }
              />
            )}
          </div>
        </div>
      </Desk>
    </DemoShell>
  );

  /** Idempotent: one Enrolled Student per applicant, merged never blanked. */
  function enroll(asm: Assessment, fromWorkflow: boolean): string {
    const a = state.applicants.find((x) => x.id === asm.applicantId);
    if (!a) throw new LogicError("Applicant not found.");
    if (asm.state !== "Enrolled" && !fromWorkflow)
      throw new LogicError("Only enrolled assessments can be re-run.");
    const existing = state.students.find((s) => s.applicantId === a.id);
    const payload = buildStudentPayload(
      { ...a, academic_term: TERM.name },
      existing ?? null,
    );
    const record = { ...payload, applicantId: a.id };
    save({
      ...state,
      assessments: state.assessments.map((x) =>
        x.id === asm.id ? { ...x, state: "Enrolled" } : x,
      ),
      students: existing
        ? state.students.map((s) => (s.applicantId === a.id ? record : s))
        : [...state.students, record],
    });
    return existing
      ? `Enrolled Student for ${payload.student_name} already existed; the record was updated, not duplicated.`
      : `Enrolled. Created Enrolled Student ${payload.student_name}.`;
  }
}

function NewApplicant({ onAdd }: { onAdd: (a: Omit<Applicant, "id">) => void }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    program: "BSIT",
    email: "",
    mobile: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Card title="New applicant">
      <form
        className="grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.first_name.trim() || !form.last_name.trim()) {
            setErr("First name and last name are required.");
            return;
          }
          setErr(null);
          onAdd({
            first_name: form.first_name.trim(),
            middle_name: "",
            last_name: form.last_name.trim(),
            gender: "",
            program: form.program,
            email: form.email,
            mobile: form.mobile,
          });
          setForm({ ...form, first_name: "", last_name: "", email: "", mobile: "" });
        }}
      >
        <Field id="na-first" label="First name">
          <input id="na-first" className={inputClass} value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
        </Field>
        <Field id="na-last" label="Last name">
          <input id="na-last" className={inputClass} value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
        </Field>
        <Field id="na-program" label="Program">
          <select id="na-program" className={inputClass} value={form.program} onChange={(e) => set("program", e.target.value)}>
            {Object.entries(PROGRAMS).map(([k, v]) => (
              <option key={k} value={k}>{k} · {v}</option>
            ))}
          </select>
        </Field>
        <Field id="na-email" label="Email">
          <input id="na-email" type="email" className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field id="na-mobile" label="Mobile">
          <input id="na-mobile" className={inputClass} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
        </Field>
        <div className="flex items-end">
          <button type="submit" className={btn.primary}>Create applicant</button>
        </div>
        <p role="alert" className="text-sm text-red-800 sm:col-span-2">{err}</p>
      </form>
    </Card>
  );
}

function ApplicantDetail({
  role,
  applicant,
  assessment,
  state,
  onCreate,
  onSaveSubjects,
  onApprove,
  onReject,
  onRerun,
  onPay,
}: {
  role: string;
  applicant: Applicant;
  assessment: Assessment | null;
  state: CollegeState;
  onCreate: (subjects: string[]) => void;
  onSaveSubjects: (subjects: string[]) => void;
  onApprove: () => void;
  onReject: () => void;
  onRerun: () => void;
  onPay: (amount: number, mode: string) => void;
}) {
  const [picked, setPicked] = useState<string[]>(assessment?.subjects ?? []);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("GCash");

  const editable =
    role === "Registrar" && (!assessment || assessment.state === "Draft");
  const available = SUBJECTS.filter(
    (s) => s.program === null || s.program === applicant.program,
  );
  const shown = assessment && !editable ? assessment.subjects : picked;
  const chosen = SUBJECTS.filter((s) => shown.includes(s.code));
  const units = totalUnits(chosen.map((s) => s.units));
  const fees = computeFeeTotals(
    units,
    TERM.tuitionPerUnit,
    MISC_FEES.map((f) => f.amount),
  );
  const over = units > TERM.maxUnits;
  const fig = assessment ? figures(assessment) : null;
  const student = state.students.find((s) => s.applicantId === applicant.id);
  const owner = assessment ? STATE_OWNER[assessment.state] : null;

  const toggle = (code: string) =>
    setPicked((p) => (p.includes(code) ? p.filter((c) => c !== code) : [...p, code]));

  const canApprove =
    assessment && canAct(role, assessment.state);
  const approveLabel =
    assessment?.state === "Draft"
      ? "Submit for approval"
      : assessment?.state === "Pending Finance"
        ? "Enroll"
        : "Approve";

  return (
    <Card title={`${fullName(applicant)} · ${applicant.id}`}>
      <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
        <div><dt className="inline text-ink-muted">Program: </dt><dd className="inline">{PROGRAMS[applicant.program]}</dd></div>
        <div><dt className="inline text-ink-muted">Email: </dt><dd className="inline">{applicant.email || "—"}</dd></div>
        <div><dt className="inline text-ink-muted">Mobile: </dt><dd className="inline">{applicant.mobile || "—"}</dd></div>
        <div><dt className="inline text-ink-muted">Status: </dt><dd className="inline">{assessment ? <Pill>{assessment.state}</Pill> : "No assessment yet"}</dd></div>
      </dl>

      <h3 className="mt-5 text-sm font-semibold">Subjects</h3>
      {editable ? (
        <fieldset className="mt-2">
          <legend className="sr-only">Pick subjects</legend>
          <ul className="grid gap-1 sm:grid-cols-2">
            {available.map((s) => (
              <li key={s.code}>
                <label className="flex cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-paper-soft">
                  <input
                    type="checkbox"
                    checked={picked.includes(s.code)}
                    onChange={() => toggle(s.code)}
                    className="mt-1 size-4 accent-[#8a6a2f]"
                  />
                  <span>
                    {s.code} · {s.title}{" "}
                    <span className="text-ink-muted">({s.units}u)</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : chosen.length ? (
        <ul className="mt-2 space-y-1 text-sm">
          {chosen.map((s) => (
            <li key={s.code}>{s.code} · {s.title} <span className="text-ink-muted">({s.units}u)</span></li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-ink-muted">
          {role === "Registrar" ? "Pick subjects to create the assessment." : "The Registrar creates the assessment."}
        </p>
      )}

      {chosen.length ? (
        <div className="mt-4 rounded-lg border border-paper-line bg-paper p-3 text-sm">
          <p className={over ? "font-semibold text-red-800" : "font-semibold"}>
            Total units: {units} / {TERM.maxUnits}
          </p>
          <dl className="mt-1 grid grid-cols-[1fr_auto] gap-x-4 tabular-nums">
            <dt>Tuition ({units} × {money(TERM.tuitionPerUnit)})</dt><dd>{money(fees.tuition_total)}</dd>
            <dt>Miscellaneous fees</dt><dd>{money(fees.misc_total)}</dd>
            <dt className="font-semibold">Total fees</dt><dd className="font-semibold">{money(fees.total_fees)}</dd>
          </dl>
        </div>
      ) : null}

      {editable ? (
        <div className="mt-3">
          <button
            type="button"
            className={btn.primary}
            onClick={() => (assessment ? onSaveSubjects(picked) : onCreate(picked))}
          >
            {assessment ? "Save subjects" : "Create assessment"}
          </button>
        </div>
      ) : null}

      {assessment && fig ? (
        <>
          <h3 className="mt-5 text-sm font-semibold">Payments</h3>
          <p className="mt-1 text-sm tabular-nums">
            Paid {money(fig.paid)} of required down payment {money(TERM.requiredDownpayment)} ·{" "}
            <strong>{fig.status}</strong>
          </p>
          {assessment.payments.length ? (
            <ul className="mt-1 text-sm text-ink-muted">
              {assessment.payments.map((p) => (
                <li key={p.id}>{p.id} · {p.mode} · {money(p.amount)}</li>
              ))}
            </ul>
          ) : null}

          {role === "Cashier" ? (
            <form
              className="mt-3 flex flex-wrap items-end gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                onPay(Number(amount), mode);
                setAmount("");
              }}
            >
              <Field id="pay-amount" label="Amount (PHP)">
                <input id="pay-amount" inputMode="decimal" className={`${inputClass} !w-36`} value={amount} onChange={(e) => setAmount(e.target.value)} />
              </Field>
              <Field id="pay-mode" label="Mode of payment">
                <select id="pay-mode" className={`${inputClass} !w-36`} value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option>GCash</option>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                </select>
              </Field>
              <button type="submit" className={btn.gold}>Post Student Payment</button>
            </form>
          ) : null}

          <h3 className="mt-5 text-sm font-semibold">Workflow</h3>
          {canApprove ? (
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className={btn.gold} onClick={onApprove}>{approveLabel}</button>
              {assessment.state !== "Draft" ? (
                <button type="button" className={btn.danger} onClick={onReject}>Reject</button>
              ) : null}
            </div>
          ) : (
            <p className="mt-1 text-sm text-ink-muted">
              {owner
                ? `Waiting on the ${owner}. You are signed in as ${role}.`
                : assessment.state === "Enrolled"
                  ? "Enrollment complete."
                  : "This assessment was rejected."}
            </p>
          )}
          {assessment.state === "Enrolled" && role === "Finance Officer" ? (
            <div className="mt-2">
              <button type="button" className={btn.ghost} onClick={onRerun}>Re-run enrollment</button>
            </div>
          ) : null}
        </>
      ) : null}

      {student ? (
        <div className="mt-5 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm">
          <h3 className="font-semibold">Enrolled Student</h3>
          <dl className="mt-1 grid gap-x-4 sm:grid-cols-2">
            <div><dt className="inline text-ink-muted">Name: </dt><dd className="inline">{student.student_name}</dd></div>
            <div><dt className="inline text-ink-muted">Email: </dt><dd className="inline">{student.email || "—"}</dd></div>
            <div><dt className="inline text-ink-muted">Mobile: </dt><dd className="inline">{student.mobile || "—"}</dd></div>
            <div><dt className="inline text-ink-muted">Program: </dt><dd className="inline">{student.program}</dd></div>
          </dl>
          <p className="mt-1 text-xs text-ink-muted">
            Names are tidied and phone numbers normalized when the record is created.
          </p>
        </div>
      ) : null}
    </Card>
  );
}
