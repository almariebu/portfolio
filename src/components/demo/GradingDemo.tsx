"use client";

import { useState } from "react";
import { Card, DataTable, DemoShell, Desk, Field, Messages, btn, inputClass } from "./ui";
import { useDemoStore } from "./useDemoStore";
import { useMessages } from "./useMessages";
import { SUBJECTS, gradingSeed, type GradingState } from "@/lib/demo/cases-data.ts";
import { nameFor, renameStudent, reportFor, setGrade, validateGrade } from "@/lib/demo/grading-logic.ts";

const TRY_THIS = [
  "In the class list, type a grade for a student and subject. Grades must be 0 to 100.",
  "Rename a student. The class list and the grade report show the new name, because records point to the student, not a copy of the name.",
  "Open the grade report for a student and press Print report. Only the report prints, on a clean page.",
];

export default function GradingDemo() {
  const { state, save, reset } = useDemoStore<GradingState>("demo:grading:v1", gradingSeed);
  const { error, notice, run, clear } = useMessages();
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [entry, setEntry] = useState<Record<string, string>>({});
  const [renameId, setRenameId] = useState("g1");
  const [newName, setNewName] = useState("");
  const [reportId, setReportId] = useState("g1");

  const gradeOf = (sid: string) =>
    state.entries.find((e) => e.studentId === sid && e.subject === subject)?.grade;

  const saveGrade = (sid: string) =>
    run(() => {
      const g = validateGrade(entry[sid] ?? "");
      save({ ...state, entries: setGrade(state.entries, sid, subject, g) });
      setEntry((p) => ({ ...p, [sid]: "" }));
      return `${nameFor(state.students, sid)}: ${subject} ${g} saved.`;
    });

  const rename = () =>
    run(() => {
      const students = renameStudent(state.students, renameId, newName);
      save({ ...state, students });
      setNewName("");
      return `Student renamed to ${nameFor(students, renameId)}.`;
    });

  const report = reportFor(state.entries, reportId, SUBJECTS);

  return (
    <DemoShell
      title="Grading"
      intro="A browser simulation of a real app built in Frappe. Enter grades for a class list, rename a student, and print a grade report. Nothing leaves your browser."
      tryThis={TRY_THIS}
      backHref="/?panel=work&study=grading"
      onReset={() => {
        reset();
        setEntry({});
        clear();
      }}
    >
      <Desk>
        <div className="print:hidden">
          <Messages error={error} notice={notice} />
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Card title="Class list · Grade 7 Section A">
              <Field id="g-subject" label="Subject">
                <select id="g-subject" className={`${inputClass} mb-3`} value={subject} onChange={(e) => setSubject(e.target.value)}>
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <DataTable
                head={["Student", "Current grade", "New grade", ""]}
                rows={state.students.map((s) => [
                  nameFor(state.students, s.id),
                  gradeOf(s.id) ?? "-",
                  <input
                    key={s.id}
                    aria-label={`New ${subject} grade for ${s.name}`}
                    className={`${inputClass} !w-20`}
                    inputMode="numeric"
                    value={entry[s.id] ?? ""}
                    onChange={(e) => setEntry((p) => ({ ...p, [s.id]: e.target.value }))}
                  />,
                  <button key={`b${s.id}`} type="button" className={btn.ghost} onClick={() => saveGrade(s.id)}>
                    Save
                  </button>,
                ])}
              />
            </Card>
            <Card title="Student record">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field id="r-student" label="Student">
                  <select id="r-student" className={inputClass} value={renameId} onChange={(e) => setRenameId(e.target.value)}>
                    {state.students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </Field>
                <Field id="r-name" label="New name">
                  <input id="r-name" className={inputClass} value={newName} onChange={(e) => setNewName(e.target.value)} />
                </Field>
              </div>
              <button type="button" className={`${btn.primary} mt-3`} onClick={rename}>Rename student</button>
            </Card>
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <Field id="rep-student" label="Grade report for">
              <select id="rep-student" className={inputClass} value={reportId} onChange={(e) => setReportId(e.target.value)}>
                {state.students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
            <button type="button" className={btn.gold} onClick={() => window.print()}>Print report</button>
          </div>
        </div>

        <section className="grade-report mt-4 rounded-xl border border-paper-line bg-white p-5 print:mt-0 print:border-0">
          <h2 className="font-display text-lg font-semibold">Grade report</h2>
          <p className="text-sm">Student: {nameFor(state.students, reportId)}</p>
          <div className="mt-3">
            <DataTable
              head={["Subject", "Grade"]}
              rows={report.rows.map((r) => [r.subject, r.grade ?? "-"])}
            />
          </div>
          <p className="mt-3 text-sm font-semibold">
            Average: {report.average ?? "-"} · {report.remarks}
          </p>
        </section>
      </Desk>
    </DemoShell>
  );
}
