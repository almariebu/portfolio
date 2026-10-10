/** Student discount rules: base selection, percent/fixed, batches, summary filters. */
import { LogicError, flt } from "./logic.ts";

export type Basis = "assessment" | "balance";
export type Rule = {
  type: string;
  basis: Basis;
  mode: "percent" | "fixed";
  value: number;
};
export type DiscStudent = {
  id: string;
  name: string;
  assessment: number;
  paid: number;
  year: string;
  semester: string;
};
export type DiscountRecord = {
  studentId: string;
  year: string;
  semester: string;
  type: string;
  basis: Basis;
  amount: number;
};

export function discountBase(rule: Rule, s: DiscStudent): number {
  return rule.basis === "assessment" ? s.assessment : Math.max(flt(s.assessment - s.paid, 2), 0);
}

export function discountAmount(rule: Rule, s: DiscStudent): number {
  if (!(rule.value > 0)) throw new LogicError("Discount value must be greater than zero.");
  if (rule.mode === "percent" && rule.value > 100) {
    throw new LogicError("A percent discount cannot be more than 100.");
  }
  const base = discountBase(rule, s);
  const raw = rule.mode === "percent" ? (base * rule.value) / 100 : rule.value;
  return flt(Math.min(raw, base), 2);
}

/** One rule, many students. A student who already has this type this term is skipped. */
export function applyBatch(
  rule: Rule,
  selected: DiscStudent[],
  existing: DiscountRecord[],
) {
  if (selected.length === 0) throw new LogicError("Select at least one student.");
  const added: DiscountRecord[] = [];
  const skipped: string[] = [];
  for (const s of selected) {
    const dup = existing.some(
      (r) =>
        r.studentId === s.id &&
        r.year === s.year &&
        r.semester === s.semester &&
        r.type === rule.type,
    );
    if (dup) {
      skipped.push(s.name);
      continue;
    }
    added.push({
      studentId: s.id,
      year: s.year,
      semester: s.semester,
      type: rule.type,
      basis: rule.basis,
      amount: discountAmount(rule, s),
    });
  }
  return { added, skipped };
}

export const ALL = "All";

export function filterSummary(
  records: DiscountRecord[],
  f: { year: string; semester: string; type: string },
): DiscountRecord[] {
  return records.filter(
    (r) =>
      (f.year === ALL || r.year === f.year) &&
      (f.semester === ALL || r.semester === f.semester) &&
      (f.type === ALL || r.type === f.type),
  );
}

export function totalDiscount(records: DiscountRecord[]): number {
  return flt(records.reduce((s, r) => s + r.amount, 0), 2);
}
