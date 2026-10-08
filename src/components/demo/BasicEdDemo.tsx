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
} from "./ui";
import { useDemoStore } from "./useDemoStore";
import {
  USERS,
  YEAR_NOW,
  YEAR_PREV,
  basicEdSeed,
  type BasicEdState,
} from "@/lib/demo/basic-ed-data";
import {
  GRADE_LEVELS,
  LogicError,
  activeKey,
  checkLrn,
  isSeniorHigh,
  normalizeName,
  resolveGradeLevel,
  teacherCanAccess,
  withdrawalPlan,
} from "@/lib/demo/logic.ts";

const TRY_THIS = [
  "As Registrar, enroll Dominic Paul Aguilar as Continuing for 2026-2027. He was in Grade 2, so he lands in Grade 3.",
  "Create a New student with incoming Grade 5. The grade is kept as entered.",
  "Try to enroll Mateo Santiago Cruz for 2026-2027 again. The duplicate active enrollment is blocked.",
  "Withdraw Elijah Matthew Cabrera (Grade 11). He leaves the class list and his grades are cleared. Withdraw a Grade 7 student and only the class list row goes.",
  "Rename a student, then check the class list: it shows the new name.",
  "Switch to Teacher A, then Teacher B. Each sees only their own class lists.",
];

const roleOptions = Object.entries(USERS).map(([id, u]) => ({ id, label: u.label }));

export default function BasicEdDemo() {
  const { state, save, reset } = useDemoStore<BasicEdState>(
    "demo:basic-ed-enrollment:v1",
    basicEdSeed,
  );
  const [roleId, setRoleId] = useState("registrar");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const me = USERS[roleId];

  const run = (fn: () => string) => {
    try {
      setNotice(fn());
      setError(null);
    } catch (e) {
      if (e instanceof LogicError) {
        setError(e.message);
        setNotice(null);
      } else throw e;
    }
  };

  const nameOf = (id: string) => state.students.find((s) => s.id === id)?.name ?? id;
  const visibleClasses = state.classLists.filter((c) =>
    teacherCanAccess(me.roles, roleId, c.adviser),
  );
  const isRegistrar = me.roles.includes("Registrar");

  return (
    <DemoShell
      title="Basic education enrollment"
      intro="A browser simulation of a Frappe v15 app. The real app is built in Frappe; this page re-creates its enrollment rules and class-list permissions with no server. Switch roles to see what each one can do."
      tryThis={TRY_THIS}
      backHref="/?panel=work&study=basic-ed-enrollment"
      onReset={() => {
        reset();
        setError(null);
        setNotice(null);
      }}
    >
      <Desk>
        <RoleSwitcher
          roles={roleOptions}
          value={roleId}
          onChange={(r) => {
            setRoleId(r);
            setError(null);
            setNotice(null);
          }}
        />
        <div className="mt-4">
          <Messages error={error} notice={notice} />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {isRegistrar ? (
            <div className="space-y-4">
              <EnrollForm state={state} run={run} save={save} />
              <Card title={`Enrollments · ${YEAR_NOW}`}>
                <ul className="divide-y divide-paper-line">
                  {state.enrollments
                    .filter((x) => x.year === YEAR_NOW)
                    .map((x) => (
                      <EnrollmentRow
                        key={x.id}
                        enrollment={x}
                        state={state}
                        name={nameOf(x.studentId)}
                        run={run}
                        save={save}
                      />
                    ))}
                </ul>
              </Card>
            </div>
          ) : null}
          <div className={`space-y-4 ${isRegistrar ? "" : "lg:col-span-2"}`}>
            {visibleClasses.length === 0 ? (
              <Card title="Class lists">
                <p className="text-sm text-ink-muted">No class lists assigned to you.</p>
              </Card>
            ) : (
              visibleClasses.map((c) => (
                <Card key={c.id} title={`${c.name} · ${c.year}`}>
                  <p className="text-xs text-ink-muted">
                    Adviser: {USERS[c.adviser].label} · {c.grade}
                  </p>
                  {c.studentIds.length === 0 ? (
                    <p className="mt-2 text-sm text-ink-muted">No students in this class.</p>
                  ) : (
                    <ul className="mt-2 divide-y divide-paper-line text-sm">
                      {c.studentIds.map((sid) => {
                        const g = state.grades.filter(
                          (r) => r.studentId === sid && r.classId === c.id,
                        );
                        return (
                          <li key={sid} className="py-2">
                            <p className="font-semibold">{nameOf(sid)}</p>
                            {isSeniorHigh(c.grade) ? (
                              <p className="text-xs text-ink-muted">
                                {g.length
                                  ? g.map((r) => `${r.area} ${r.quarter}: ${r.grade}`).join(" · ")
                                  : "No grades recorded."}
                              </p>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </Desk>
    </DemoShell>
  );
}

type Ctx = {
  state: BasicEdState;
  run: (fn: () => string) => void;
  save: (s: BasicEdState) => void;
};

function EnrollForm({ state, run, save }: Ctx) {
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [lrn, setLrn] = useState("");
  const [year, setYear] = useState(YEAR_NOW);
  const [type, setType] = useState<"New" | "Continuing">("Continuing");
  const [incoming, setIncoming] = useState("Grade 1");
  const isNewStudent = studentId === "__new";

  return (
    <Card title="Enroll a student">
      <form
        className="grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => {
            let students = state.students;
            let sid = studentId;
            if (!sid) throw new LogicError("Select a student, or choose New student.");
            if (isNewStudent) {
              const clean = normalizeName(name);
              if (!clean) throw new LogicError("Enter the student's name.");
              const digits = checkLrn(lrn);
              if (!digits) throw new LogicError("Enter the student's 12-digit LRN.");
              if (students.some((s) => s.lrn === digits))
                throw new LogicError("A student with this LRN already exists.");
              sid = `STU-${digits.slice(-4)}-${state.seq}`;
              students = [...students, { id: sid, name: clean, lrn: digits }];
            }
            const taken = new Set(
              state.enrollments.map((x) =>
                activeKey(x.studentId, x.year, x.status, 1),
              ),
            );
            if (taken.has(activeKey(sid, year, "Active", 1)))
              throw new LogicError(
                `${students.find((s) => s.id === sid)?.name} already has an active enrollment for ${year}.`,
              );
            const prior = state.enrollments
              .filter((x) => x.studentId === sid && x.status === "Active" && x.year < year)
              .sort((a, b) => (a.year < b.year ? 1 : -1))[0];
            const grade = resolveGradeLevel(type, incoming, prior?.grade);
            save({
              ...state,
              students,
              seq: state.seq + 1,
              enrollments: [
                ...state.enrollments,
                {
                  id: `ENR-${String(state.seq).padStart(3, "0")}`,
                  studentId: sid,
                  year,
                  type,
                  grade,
                  status: "Active",
                },
              ],
            });
            return `Enrolled in ${grade} for ${year} (${type}).`;
          });
        }}
      >
        <Field id="en-student" label="Student">
          <select id="en-student" className={inputClass} value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            <option value="">Select…</option>
            <option value="__new">+ New student</option>
            {state.students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </Field>
        <Field id="en-year" label="Academic year">
          <select id="en-year" className={inputClass} value={year} onChange={(e) => setYear(e.target.value)}>
            <option>{YEAR_NOW}</option>
            <option>{YEAR_PREV}</option>
          </select>
        </Field>
        {isNewStudent ? (
          <>
            <Field id="en-name" label="Student name">
              <input id="en-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field id="en-lrn" label="LRN (12 digits)">
              <input id="en-lrn" inputMode="numeric" className={inputClass} value={lrn} onChange={(e) => setLrn(e.target.value)} />
            </Field>
          </>
        ) : null}
        <Field id="en-type" label="Enrollment type">
          <select id="en-type" className={inputClass} value={type} onChange={(e) => setType(e.target.value as "New" | "Continuing")}>
            <option>Continuing</option>
            <option>New</option>
          </select>
        </Field>
        {type === "New" ? (
          <Field id="en-grade" label="Incoming grade level">
            <select id="en-grade" className={inputClass} value={incoming} onChange={(e) => setIncoming(e.target.value)}>
              {GRADE_LEVELS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </Field>
        ) : null}
        <div className="flex items-end sm:col-span-2">
          <button type="submit" className={btn.gold}>Enroll</button>
        </div>
      </form>
    </Card>
  );
}

function EnrollmentRow({
  enrollment: x,
  name,
  state,
  run,
  save,
}: Ctx & { enrollment: BasicEdState["enrollments"][number]; name: string }) {
  const [draft, setDraft] = useState(name);
  const [editing, setEditing] = useState(false);
  const [classId, setClassId] = useState("");
  const inClass = state.classLists.find(
    (c) => c.year === x.year && c.studentIds.includes(x.studentId),
  );
  const options = state.classLists.filter(
    (c) => c.year === x.year && c.grade === x.grade,
  );

  return (
    <li className="space-y-2 py-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          {editing ? (
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                run(() => {
                  const clean = normalizeName(draft);
                  if (!clean) throw new LogicError("Name cannot be empty.");
                  save({
                    ...state,
                    students: state.students.map((s) =>
                      s.id === x.studentId ? { ...s, name: clean } : s,
                    ),
                  });
                  setEditing(false);
                  return `Renamed to ${clean}. Class lists now show the new name.`;
                });
              }}
            >
              <Field id={`rn-${x.id}`} label="Student name">
                <input id={`rn-${x.id}`} className={inputClass} value={draft} onChange={(e) => setDraft(e.target.value)} />
              </Field>
              <button type="submit" className={btn.primary}>Save</button>
            </form>
          ) : (
            <p className="font-semibold">{name}</p>
          )}
          <p className="text-xs text-ink-muted">
            {x.id} · {x.grade} · {x.type}
            {inClass ? ` · ${inClass.name}` : " · not in a class list"}
          </p>
        </div>
        <Pill>{x.status}</Pill>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        {!editing ? (
          <button type="button" className={btn.ghost} onClick={() => { setDraft(name); setEditing(true); }}>
            Rename
          </button>
        ) : null}
        {x.status === "Active" ? (
          <button
            type="button"
            className={btn.danger}
            onClick={() =>
              run(() => {
                const plan = withdrawalPlan(x.grade);
                const lists = plan.clear_class_list
                  ? state.classLists.map((c) =>
                      c.year === x.year
                        ? { ...c, studentIds: c.studentIds.filter((s) => s !== x.studentId) }
                        : c,
                    )
                  : state.classLists;
                const yearClasses = new Set(
                  state.classLists.filter((c) => c.year === x.year).map((c) => c.id),
                );
                const grades = plan.clear_student_grades
                  ? state.grades.filter(
                      (r) => !(r.studentId === x.studentId && yearClasses.has(r.classId)),
                    )
                  : state.grades;
                save({
                  ...state,
                  classLists: lists,
                  grades,
                  enrollments: state.enrollments.map((e) =>
                    e.id === x.id ? { ...e, status: "Withdrawn" } : e,
                  ),
                });
                return plan.clear_student_grades
                  ? `${name} withdrawn. Class list rows and grades were cleared.`
                  : `${name} withdrawn. Class list rows were cleared.`;
              })
            }
          >
            Withdraw
          </button>
        ) : null}
        {x.status === "Active" && !inClass && options.length ? (
          <>
            <div>
              <label htmlFor={`cl-${x.id}`} className="sr-only">
                Class list for {name}
              </label>
              <select id={`cl-${x.id}`} className={`${inputClass} !w-auto`} value={classId} onChange={(e) => setClassId(e.target.value)}>
                <option value="">Add to class list…</option>
                {options.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className={btn.ghost}
              onClick={() =>
                run(() => {
                  if (!classId) throw new LogicError("Choose a class list first.");
                  save({
                    ...state,
                    classLists: state.classLists.map((c) =>
                      c.id === classId ? { ...c, studentIds: [...c.studentIds, x.studentId] } : c,
                    ),
                  });
                  setClassId("");
                  return `${name} added to the class list.`;
                })
              }
            >
              Add
            </button>
          </>
        ) : null}
      </div>
    </li>
  );
}
