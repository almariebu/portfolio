"use client";

import { useState } from "react";
import { Card, DataTable, DemoShell, Desk, Field, Messages, btn, inputClass, money } from "./ui";
import { useDemoStore } from "./useDemoStore";
import { useMessages } from "./useMessages";
import { DISC_SEMS, DISC_TYPES, DISC_YEARS, discountSeed, type DiscountState } from "@/lib/demo/cases-data.ts";
import {
  ALL,
  applyBatch,
  discountAmount,
  discountBase,
  filterSummary,
  totalDiscount,
  type Rule,
} from "@/lib/demo/discount-logic.ts";

const TRY_THIS = [
  "Compare the Discount column with Calculated from set to Full assessment, then to Balance due. Apply a 10% discount to Ana Reyes and the amounts differ.",
  "Switch between percent and fixed amount and watch the preview change.",
  "Tick several students and apply one rule to all of them as a batch. Students who already have that type this term are skipped.",
  "In the Student Discount Summary, filter by school year, semester, and discount type.",
];

export default function DiscountDemo() {
  const { state, save, reset } = useDemoStore<DiscountState>("demo:student-discounts:v1", discountSeed);
  const { error, notice, run, clear } = useMessages();
  const [type, setType] = useState(DISC_TYPES[0]);
  const [basis, setBasis] = useState<Rule["basis"]>("assessment");
  const [mode, setMode] = useState<Rule["mode"]>("percent");
  const [value, setValue] = useState("10");
  const [picked, setPicked] = useState<string[]>([]);
  const [fYear, setFYear] = useState(ALL);
  const [fSem, setFSem] = useState(ALL);
  const [fType, setFType] = useState(ALL);

  const rule: Rule = { type, basis, mode, value: Number(value) };
  const nameOf = (id: string) => state.students.find((s) => s.id === id)?.name ?? id;
  const preview = (id: string) => {
    const s = state.students.find((x) => x.id === id)!;
    try {
      return money(discountAmount(rule, s));
    } catch {
      return "-";
    }
  };
  const shown = filterSummary(state.records, { year: fYear, semester: fSem, type: fType });
  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const apply = () =>
    run(() => {
      const chosen = state.students.filter((s) => picked.includes(s.id));
      const { added, skipped } = applyBatch(rule, chosen, state.records);
      save({ ...state, records: [...state.records, ...added] });
      setPicked([]);
      return `${added.length} discount${added.length === 1 ? "" : "s"} applied.${skipped.length ? ` Skipped (already has ${type}): ${skipped.join(", ")}.` : ""}`;
    });

  return (
    <DemoShell
      title="Student discounts"
      intro="A browser simulation of a real app built in Frappe. Pick a discount rule, apply it to one student or a batch, and read the summary report. Nothing leaves your browser."
      tryThis={TRY_THIS}
      backHref="/?panel=work&study=student-discounts"
      onReset={() => {
        reset();
        setPicked([]);
        clear();
      }}
    >
      <Desk>
        <Messages error={error} notice={notice} />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card title="Discount rule">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id="d-type" label="Discount type">
                <select id="d-type" className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
                  {DISC_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field id="d-basis" label="Calculated from">
                <select id="d-basis" className={inputClass} value={basis} onChange={(e) => setBasis(e.target.value as Rule["basis"])}>
                  <option value="assessment">Full assessment</option>
                  <option value="balance">Balance due</option>
                </select>
              </Field>
              <Field id="d-mode" label="Mode">
                <select id="d-mode" className={inputClass} value={mode} onChange={(e) => setMode(e.target.value as Rule["mode"])}>
                  <option value="percent">Percent</option>
                  <option value="fixed">Fixed amount</option>
                </select>
              </Field>
              <Field id="d-value" label={mode === "percent" ? "Percent" : "Amount"}>
                <input id="d-value" className={inputClass} inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
              </Field>
            </div>
            <button type="button" className={`${btn.gold} mt-3`} onClick={apply}>
              Apply to {picked.length} selected
            </button>
          </Card>

          <Card title="Students (tick for a batch)">
            <DataTable
              head={["", "Student", "Term", "Assessment", "Balance", "Discount"]}
              rows={state.students.map((s) => [
                <input
                  key={s.id}
                  type="checkbox"
                  aria-label={`Select ${s.name}`}
                  checked={picked.includes(s.id)}
                  onChange={() => toggle(s.id)}
                />,
                s.name,
                `${s.year}, ${s.semester}`,
                money(s.assessment),
                money(discountBase({ ...rule, basis: "balance" }, s)),
                preview(s.id),
              ])}
            />
          </Card>

          <div className="lg:col-span-2">
            <Card title="Student Discount Summary">
              <div className="mb-3 grid gap-3 sm:grid-cols-3">
                <Field id="f-year" label="School year">
                  <select id="f-year" className={inputClass} value={fYear} onChange={(e) => setFYear(e.target.value)}>
                    {[ALL, ...DISC_YEARS].map((x) => <option key={x}>{x}</option>)}
                  </select>
                </Field>
                <Field id="f-sem" label="Semester">
                  <select id="f-sem" className={inputClass} value={fSem} onChange={(e) => setFSem(e.target.value)}>
                    {[ALL, ...DISC_SEMS].map((x) => <option key={x}>{x}</option>)}
                  </select>
                </Field>
                <Field id="f-type" label="Discount type">
                  <select id="f-type" className={inputClass} value={fType} onChange={(e) => setFType(e.target.value)}>
                    {[ALL, ...DISC_TYPES].map((x) => <option key={x}>{x}</option>)}
                  </select>
                </Field>
              </div>
              <DataTable
                empty="No discounts match these filters."
                head={["Student", "School year", "Semester", "Type", "Based on", "Amount"]}
                rows={shown.map((r) => [
                  nameOf(r.studentId),
                  r.year,
                  r.semester,
                  r.type,
                  r.basis === "assessment" ? "Assessment" : "Balance due",
                  money(r.amount),
                ])}
              />
              <p className="mt-2 text-sm font-semibold">Total: {money(totalDiscount(shown))}</p>
            </Card>
          </div>
        </div>
      </Desk>
    </DemoShell>
  );
}
