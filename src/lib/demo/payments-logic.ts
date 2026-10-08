/** Online payment rules: allocation across fees and payment links from settings. */
import { LogicError, flt } from "./logic.ts";

export type Fee = { id: string; label: string; due: string; amount: number; paid: number };
export type Settings = { baseUrl: string; merchantId: string };

export function feeBalance(f: Fee): number {
  return flt(f.amount - f.paid, 2);
}

/** Oldest due date first. Any amount beyond the open fees is returned as credit. */
export function allocatePayment(amount: number, fees: Fee[]) {
  if (!(amount > 0)) throw new LogicError("Payment amount must be greater than zero.");
  let left = flt(amount, 2);
  const applied: Record<string, number> = {};
  const ordered = [...fees].sort((a, b) => a.due.localeCompare(b.due) || a.id.localeCompare(b.id));
  for (const fee of ordered) {
    const bal = feeBalance(fee);
    if (bal <= 0 || left <= 0) continue;
    const take = Math.min(bal, left);
    applied[fee.id] = flt(take, 2);
    left = flt(left - take, 2);
  }
  return { applied, credit: left };
}

export function buildPaymentLink(settings: Settings, reference: string): string {
  const base = settings.baseUrl.trim().replace(/\/+$/, "");
  if (!/^https:\/\/[^\s/]+/.test(base)) {
    throw new LogicError("Set a payment page address starting with https:// in School settings.");
  }
  if (!settings.merchantId.trim()) {
    throw new LogicError("Set a merchant ID in School settings.");
  }
  return `${base}/pay?merchant=${encodeURIComponent(settings.merchantId.trim())}&ref=${encodeURIComponent(reference)}`;
}
