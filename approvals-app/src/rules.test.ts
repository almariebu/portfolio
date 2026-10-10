import { describe, expect, it } from "vitest";
import {
  MAX_UNITS,
  canActAt,
  nextStatus,
  paymentCovers,
  validateEnrollmentInput,
} from "./rules.js";

describe("validateEnrollmentInput", () => {
  const ok = { studentName: "Ana Cruz", units: 21, feeCents: 1_500_000 };

  it("accepts a valid enrollment", () => {
    expect(validateEnrollmentInput(ok)).toEqual([]);
  });

  it("allows exactly the maximum units and rejects one more", () => {
    expect(validateEnrollmentInput({ ...ok, units: MAX_UNITS })).toEqual([]);
    expect(validateEnrollmentInput({ ...ok, units: MAX_UNITS + 1 })).toContain(
      `units must be between 1 and ${MAX_UNITS}`,
    );
  });

  it("rejects zero, negative, and fractional units", () => {
    for (const units of [0, -3, 1.5]) {
      expect(validateEnrollmentInput({ ...ok, units })).not.toEqual([]);
    }
  });

  it("rejects a blank name and a negative fee", () => {
    const errors = validateEnrollmentInput({ studentName: "  ", units: 3, feeCents: -1 });
    expect(errors).toContain("studentName is required");
    expect(errors).toContain("feeCents must be a non-negative integer");
  });
});

describe("workflow", () => {
  it("moves draft → dean → registrar → finance → enrolled", () => {
    expect(nextStatus("dean")).toBe("registrar");
    expect(nextStatus("registrar")).toBe("finance");
    expect(nextStatus("finance")).toBe("enrolled");
  });

  it("has no next status for draft or enrolled", () => {
    expect(nextStatus("draft")).toBeNull();
    expect(nextStatus("enrolled")).toBeNull();
  });

  it("lets only the matching role act at each stage", () => {
    expect(canActAt("dean", "dean")).toBe(true);
    expect(canActAt("registrar", "dean")).toBe(false);
    expect(canActAt("finance", "finance")).toBe(true);
    expect(canActAt("encoder", "draft")).toBe(true);
    expect(canActAt("dean", "draft")).toBe(false);
  });
});

describe("paymentCovers", () => {
  it("requires the full fee to be paid", () => {
    expect(paymentCovers({ feeCents: 1000, paidCents: 999 })).toBe(false);
    expect(paymentCovers({ feeCents: 1000, paidCents: 1000 })).toBe(true);
    expect(paymentCovers({ feeCents: 1000, paidCents: 1500 })).toBe(true);
  });
});
