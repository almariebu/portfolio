// Run with: node --experimental-strip-types --test src/lib/demo/logic.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  LogicError,
  activeKey,
  approve,
  buildStudentPayload,
  checkDownpayment,
  checkLrn,
  checkUnitLimit,
  computeFeeTotals,
  nextGradeLevel,
  normalizeMobile,
  normalizeName,
  paymentStatus,
  pipelineCounts,
  reject,
  resolveGradeLevel,
  teacherCanAccess,
  totalUnits,
  withdrawalPlan,
} from "./logic.ts";

test("units and fees", () => {
  assert.equal(totalUnits([3, 3, 2]), 8);
  assert.equal(checkUnitLimit(24, 24), 24);
  assert.throws(() => checkUnitLimit(25, 24), LogicError);
  assert.equal(checkUnitLimit(99, 0), 99); // 0 = unlimited
  assert.deepEqual(computeFeeTotals(21, 550, [500, 300, 1200, 250, 150, 200]), {
    tuition_total: 11550,
    misc_total: 2600,
    total_fees: 14150,
  });
});

test("down payment gate and status", () => {
  assert.throws(() => checkDownpayment(1500, 5000), /below the required 5,000.00/);
  assert.equal(checkDownpayment(5000, 5000), true);
  assert.equal(paymentStatus(0, 5000, 14150), "Unpaid");
  assert.equal(paymentStatus(1500, 5000, 14150), "Partial");
  assert.equal(paymentStatus(5000, 5000, 14150), "Down Payment Met");
  assert.equal(paymentStatus(14150, 5000, 14150), "Fully Paid");
});

test("workflow: role checks and finance gate", () => {
  assert.equal(approve("Registrar", "Draft", 0, 5000), "Pending Dean");
  assert.equal(approve("Dean", "Pending Dean", 0, 5000), "Pending Registrar");
  assert.throws(() => approve("Cashier", "Pending Dean", 0, 5000), LogicError);
  assert.throws(() => approve("Finance Officer", "Pending Finance", 1500, 5000), /Down payment/);
  assert.equal(approve("Finance Officer", "Pending Finance", 5000, 5000), "Enrolled");
  assert.throws(() => approve("Finance Officer", "Enrolled", 5000, 5000), LogicError);
  assert.equal(reject("Dean", "Pending Dean"), "Rejected");
  assert.throws(() => reject("Dean", "Draft"), LogicError);
  const c = pipelineCounts([{ state: "Draft" }, { state: "Draft" }, { state: "Enrolled" }]);
  assert.equal(c.Draft, 2);
  assert.equal(c.Enrolled, 1);
  assert.equal(c["Pending Dean"], 0);
});

test("normalization and idempotent student payload", () => {
  assert.equal(normalizeName("  MA. cristina  dela cRUZ "), "Ma. Cristina Dela Cruz");
  assert.equal(normalizeName("juan jr"), "Juan Jr.");
  assert.equal(normalizeMobile("0917 123 4567"), "+639171234567");
  assert.equal(normalizeMobile("n/a"), "");
  const first = buildStudentPayload({ first_name: "JUAN", last_name: "dela cruz", email: "A@B.ph", mobile: "09171234567" });
  assert.equal(first.student_name, "Juan Dela Cruz");
  // Re-running with bad data must not blank existing values.
  const again = buildStudentPayload({ first_name: "JUAN", last_name: "dela cruz", email: "bad", mobile: "n/a" }, first);
  assert.deepEqual(again, first);
});

test("grade level resolution", () => {
  assert.equal(resolveGradeLevel("New", "Grade 5", null), "Grade 5");
  assert.equal(resolveGradeLevel("Continuing", null, "Grade 2"), "Grade 3");
  assert.equal(nextGradeLevel("Kinder"), "Grade 1");
  assert.throws(() => resolveGradeLevel("New", null, null), LogicError);
  assert.throws(() => resolveGradeLevel("Continuing", null, null), /No previous/);
  assert.throws(() => nextGradeLevel("Grade 12"), LogicError);
});

test("active key, withdrawal plan, lrn", () => {
  assert.equal(activeKey("S1", "2026-2027", "Active", 1), "S1|2026-2027");
  assert.equal(activeKey("S1", "2026-2027", "Withdrawn", 1), null);
  assert.equal(activeKey("S1", "2026-2027", "Active", 2), null);
  assert.deepEqual(withdrawalPlan("Grade 11"), { clear_class_list: true, clear_student_grades: true });
  assert.deepEqual(withdrawalPlan("Grade 7"), { clear_class_list: true, clear_student_grades: false });
  assert.equal(checkLrn("1044 5566 0001"), "104455660001");
  assert.throws(() => checkLrn("123"), LogicError);
});

test("teacher access", () => {
  assert.equal(teacherCanAccess(["Teacher"], "a", "a"), true);
  assert.equal(teacherCanAccess(["Teacher"], "a", "b"), false);
  assert.equal(teacherCanAccess(["Teacher"], "a", null), false);
  assert.equal(teacherCanAccess(["Teacher", "Registrar"], "a", "b"), true);
});
