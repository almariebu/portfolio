// Run with: node --experimental-strip-types --test src/lib/demo/cases.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import { LogicError } from "./logic.ts";
import * as C from "./closing-logic.ts";
import * as D from "./discount-logic.ts";
import * as P from "./payments-logic.ts";
import * as G from "./grading-logic.ts";
import * as M from "./messaging-logic.ts";
import * as R from "./migration-logic.ts";

const pay = (posted: boolean): C.Payment => ({ id: "p", studentId: "s", amount: 1, kind: "Payment", posted });

test("closing is blocked by unposted payments or an already closed term", () => {
  assert.match(C.closingBlocker({ name: "T1", closed: false }, [pay(false)])!, /unposted/);
  assert.match(C.closingBlocker({ name: "T1", closed: true }, [])!, /already closed/);
  assert.equal(C.closingBlocker({ name: "T1", closed: false }, [pay(true)]), null);
});

test("job goes queued, running, done", () => {
  let j = C.startJob(2);
  const seen = [j.status];
  while (j.status !== "Done") {
    j = C.advanceJob(j);
    seen.push(j.status);
  }
  assert.deepEqual(seen, ["Queued", "Running", "Running", "Done"]);
  assert.equal(j.done, 2);
});

test("overpayment stays as credit on the ledger", () => {
  const s = { id: "s", name: "A", assessment: 1000, dueDate: "2026-10-15" };
  const l = C.buildLedger(s, [{ ...pay(true), amount: 1200 }, { ...pay(false), amount: 50 }]);
  assert.equal(l.balance, 0);
  assert.equal(l.credit, 200);
});

test("penalty is due on the due date itself (inclusive)", () => {
  assert.equal(C.isPenaltyDue("2026-10-15", "2026-10-14"), false);
  assert.equal(C.isPenaltyDue("2026-10-15", "2026-10-15"), true);
  assert.equal(C.isPenaltyDue("2026-10-15", "2026-10-16"), true);
  assert.equal(C.penaltyFor(1000, "2026-10-15", "2026-10-15"), 20);
  assert.equal(C.penaltyFor(0, "2026-10-15", "2026-10-15"), 0);
});

test("reconciliation reports variance", () => {
  const ps = C.postPayment([], "s", 500, "Down payment");
  assert.equal(C.reconcile(ps, 500).status, "Balanced");
  assert.equal(C.reconcile(ps, 450).status, "Short");
  assert.equal(C.reconcile(ps, 520).variance, 20);
  assert.throws(() => C.postPayment([], "s", 0, "Payment"), LogicError);
});

const stu: D.DiscStudent = { id: "s1", name: "A", assessment: 10000, paid: 4000, year: "Y1", semester: "1st" };
test("discount base: assessment vs balance, percent vs fixed", () => {
  const r: D.Rule = { type: "Sibling", basis: "assessment", mode: "percent", value: 10 };
  assert.equal(D.discountAmount(r, stu), 1000);
  assert.equal(D.discountAmount({ ...r, basis: "balance" }, stu), 600);
  assert.equal(D.discountAmount({ ...r, mode: "fixed", value: 500 }, stu), 500);
  assert.equal(D.discountAmount({ ...r, basis: "balance", mode: "fixed", value: 9000 }, stu), 6000);
  assert.throws(() => D.discountAmount({ ...r, value: 120 }, stu), LogicError);
});

test("batch applies one rule and skips duplicates; summary filters", () => {
  const r: D.Rule = { type: "Sibling", basis: "assessment", mode: "percent", value: 10 };
  const s2 = { ...stu, id: "s2", name: "B" };
  const first = D.applyBatch(r, [stu], []);
  const second = D.applyBatch(r, [stu, s2], first.added);
  assert.deepEqual(second.skipped, ["A"]);
  assert.equal(second.added.length, 1);
  const all = [...first.added, ...second.added, { ...first.added[0], year: "Y0", type: "Academic" }];
  assert.equal(D.filterSummary(all, { year: "Y1", semester: D.ALL, type: D.ALL }).length, 2);
  assert.equal(D.filterSummary(all, { year: D.ALL, semester: D.ALL, type: "Academic" }).length, 1);
  assert.throws(() => D.applyBatch(r, [], []), LogicError);
});

test("payments allocate to oldest due fee first, remainder becomes credit", () => {
  const fees: P.Fee[] = [
    { id: "c", label: "Misc", due: "2026-12-01", amount: 500, paid: 0 },
    { id: "a", label: "Tuition 1", due: "2026-08-01", amount: 1000, paid: 400 },
    { id: "b", label: "Tuition 2", due: "2026-10-01", amount: 1000, paid: 0 },
  ];
  assert.deepEqual(P.allocatePayment(1200, fees), { applied: { a: 600, b: 600 }, credit: 0 });
  assert.deepEqual(P.allocatePayment(3000, fees).credit, 900);
  assert.throws(() => P.allocatePayment(0, fees), LogicError);
});

test("payment link is built from settings", () => {
  const url = P.buildPaymentLink({ baseUrl: "https://pay.school.test/", merchantId: "M 1" }, "REF-1");
  assert.equal(url, "https://pay.school.test/pay?merchant=M%201&ref=REF-1");
  assert.throws(() => P.buildPaymentLink({ baseUrl: "", merchantId: "x" }, "r"), LogicError);
  assert.throws(() => P.buildPaymentLink({ baseUrl: "http://a.test", merchantId: "x" }, "r"), LogicError);
  assert.throws(() => P.buildPaymentLink({ baseUrl: "https://a.test", merchantId: " " }, "r"), LogicError);
});

test("grading: renamed student shows current name; report remarks", () => {
  let studs: G.GStudent[] = [{ id: "1", name: "Ana Old" }];
  studs = G.renameStudent(studs, "1", "  Ana   New ");
  assert.equal(G.nameFor(studs, "1"), "Ana New");
  assert.throws(() => G.renameStudent(studs, "1", " "), LogicError);
  assert.equal(G.validateGrade("88"), 88);
  assert.throws(() => G.validateGrade(101), LogicError);
  assert.throws(() => G.validateGrade(""), LogicError);
  let e = G.setGrade([], "1", "Math", 80);
  e = G.setGrade(e, "1", "Math", 90);
  assert.equal(e.length, 1);
  assert.equal(G.reportFor(e, "1", ["Math"]).remarks, "Passed");
  assert.equal(G.reportFor(e, "1", ["Math", "Sci"]).remarks, "Incomplete");
  assert.equal(G.reportFor(G.setGrade([], "1", "Math", 60), "1", ["Math"]).remarks, "Failed");
});

test("sms falls back from a disabled provider; stuck emails route via default", () => {
  const ps: M.Provider[] = [
    { id: "old", name: "Old", enabled: false },
    { id: "new", name: "New", enabled: true },
  ];
  assert.equal(M.pickProvider(ps, "old").id, "new");
  assert.equal(M.pickProvider(ps, "new").id, "new");
  assert.throws(() => M.pickProvider([{ ...ps[1], enabled: false }], "new"), LogicError);
  const accts: M.EmailAccount[] = [
    { id: "x", address: "x@t", enabled: false, isDefault: false },
    { id: "d", address: "d@t", enabled: true, isDefault: true },
  ];
  const item: M.EmailItem = { id: "1", to: "a", subject: "s", accountId: "x", status: "Stuck" };
  assert.equal(M.isStuck(item, accts), true);
  assert.equal(M.routeStuck(item, accts).accountId, "d");
  assert.equal(M.isStuck(M.routeStuck(item, accts), accts), false);
  assert.throws(() => M.routeStuck(item, [accts[0]]), LogicError);
});

test("migration: roles are additive, fees map, files never overwritten", () => {
  const users: R.MUser[] = [{ id: "1", name: "A", designation: "Cashier", roles: ["Custom"] }];
  const once = R.applyDefaultRoles(users, { Cashier: ["Cashier", "Accounts User"] });
  assert.deepEqual(once[0].roles, ["Custom", "Cashier", "Accounts User"]);
  assert.deepEqual(R.applyDefaultRoles(once, { Cashier: ["Cashier", "Accounts User"] }), once);
  assert.deepEqual(R.mapFees(["A", "B"], { A: "TUI" }), { mapped: ["A"], unmapped: ["B"] });
  assert.equal(R.recoverFile({ name: "f", onDisk: true }, ["f"]), "kept");
  assert.equal(R.recoverFile({ name: "f", onDisk: false }, ["f"]), "recovered");
  assert.equal(R.recoverFile({ name: "g", onDisk: false }, ["f"]), "not in backup");
});
