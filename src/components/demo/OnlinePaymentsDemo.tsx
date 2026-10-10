"use client";

import { useState } from "react";
import { Card, DataTable, DemoShell, Desk, Field, Messages, btn, inputClass, money } from "./ui";
import { useDemoStore } from "./useDemoStore";
import { useMessages } from "./useMessages";
import { ONLINE_STUDENTS, onlineSeed, type OnlineState } from "@/lib/demo/cases-data.ts";
import { allocatePayment, buildPaymentLink, feeBalance } from "@/lib/demo/payments-logic.ts";

const TRY_THIS = [
  "Look at the incoming gateway payments. They arrive from the online payment page and are not in billing yet.",
  "Press Pull into billing on GW-1001. The paid amount is allocated across Ana Reyes's fees, oldest due date first, with no retyping.",
  "Pull GW-1002 for Ben Santos. Anything beyond his open fees stays as credit.",
  "Change the payment page address or merchant ID in School settings, save, and build a link. It uses your settings, not a fixed address. Clear the address to see the error.",
];

export default function OnlinePaymentsDemo() {
  const { state, save, reset } = useDemoStore<OnlineState>("demo:online-payments:v1", onlineSeed);
  const { error, notice, run, clear } = useMessages();
  const [draft, setDraft] = useState<{ baseUrl: string; merchantId: string } | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const form = draft ?? state.settings;

  const pull = (id: string) =>
    run(() => {
      const gp = state.incoming.find((g) => g.id === id)!;
      const fees = state.fees[gp.studentId];
      const { applied, credit } = allocatePayment(gp.amount, fees);
      save({
        ...state,
        incoming: state.incoming.map((g) => (g.id === id ? { ...g, pulled: true } : g)),
        fees: {
          ...state.fees,
          [gp.studentId]: fees.map((f) => ({ ...f, paid: f.paid + (applied[f.id] ?? 0) })),
        },
        credit: { ...state.credit, [gp.studentId]: (state.credit[gp.studentId] ?? 0) + credit },
      });
      const parts = fees.filter((f) => applied[f.id]).map((f) => `${f.label} ${money(applied[f.id])}`);
      return `${gp.ref} pulled into billing: ${parts.join(", ")}${credit ? `; ${money(credit)} kept as credit` : ""}.`;
    });

  const saveSettings = () => {
    save({ ...state, settings: { baseUrl: form.baseUrl, merchantId: form.merchantId } });
    setDraft(null);
    setLink(null);
    run(() => "School settings saved.");
  };

  const makeLink = (ref: string) =>
    run(() => {
      const url = buildPaymentLink(state.settings, ref);
      setLink(url);
      return "Payment link built from School settings.";
    });

  return (
    <DemoShell
      title="Online payments"
      intro="A browser simulation of a real app built in Frappe. Payments made on the school's online page arrive in a feed; billing pulls them in and allocates them. Nothing leaves your browser."
      tryThis={TRY_THIS}
      backHref="/?panel=work&study=online-payments"
      onReset={() => {
        reset();
        setDraft(null);
        setLink(null);
        clear();
      }}
    >
      <Desk>
        <Messages error={error} notice={notice} />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card title="Incoming gateway payments">
            <DataTable
              head={["Reference", "Student", "Amount", ""]}
              rows={state.incoming.map((g) => [
                g.ref,
                ONLINE_STUDENTS[g.studentId],
                money(g.amount),
                g.pulled ? (
                  "In billing"
                ) : (
                  <button key={g.id} type="button" className={btn.gold} onClick={() => pull(g.id)}>
                    Pull into billing
                  </button>
                ),
              ])}
            />
          </Card>

          <Card title="School settings">
            <div className="space-y-3">
              <Field id="s-url" label="Payment page address">
                <input id="s-url" className={inputClass} value={form.baseUrl} onChange={(e) => setDraft({ ...form, baseUrl: e.target.value })} />
              </Field>
              <Field id="s-merchant" label="Merchant ID">
                <input id="s-merchant" className={inputClass} value={form.merchantId} onChange={(e) => setDraft({ ...form, merchantId: e.target.value })} />
              </Field>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={btn.primary} onClick={saveSettings}>Save settings</button>
                <button type="button" className={btn.ghost} onClick={() => makeLink("INV-2026-0007")}>
                  Build payment link
                </button>
              </div>
              {link ? <p className="break-all rounded-md bg-paper-soft p-2 text-xs">{link}</p> : null}
            </div>
          </Card>

          {Object.entries(state.fees).map(([sid, fees]) => (
            <Card key={sid} title={`Fees · ${ONLINE_STUDENTS[sid]}`}>
              <DataTable
                head={["Fee", "Due", "Amount", "Paid", "Balance"]}
                rows={fees.map((f) => [f.label, f.due, money(f.amount), money(f.paid), money(feeBalance(f))])}
              />
              <p className="mt-2 text-xs text-ink-muted">Credit on account: {money(state.credit[sid] ?? 0)}</p>
            </Card>
          ))}
        </div>
      </Desk>
    </DemoShell>
  );
}
