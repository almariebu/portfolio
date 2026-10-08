"use client";

import { Card, DataTable, DemoShell, Desk, Field, Messages, Pill, btn, inputClass } from "./ui";
import { useDemoStore } from "./useDemoStore";
import { useMessages } from "./useMessages";
import { messagingSeed, type MessagingState, type MsgLog } from "@/lib/demo/cases-data.ts";
import { LogicError } from "@/lib/demo/logic.ts";
import { isStuck, pickProvider, routeStuck } from "@/lib/demo/messaging-logic.ts";

const TRY_THIS = [
  "In SMS settings the old provider is selected but disabled. Send the billing texts: they go out through the new provider.",
  "Disable every provider and send again. You get a clear error instead of a silent failure.",
  "In the email digest queue, two items are stuck on a disabled or missing account. Press Fix stuck by routing them through the default email account.",
  "Open the message log to see which provider or account each message used.",
];

export default function MessagingDemo() {
  const { state, save, reset } = useDemoStore<MessagingState>("demo:sms-and-email:v1", messagingSeed);
  const { error, notice, run, clear } = useMessages();

  const addLog = (log: MsgLog[], entry: Omit<MsgLog, "id">): MsgLog[] => [
    { ...entry, id: log.length + 1 },
    ...log,
  ];
  const accountName = (id: string | null) =>
    state.accounts.find((a) => a.id === id)?.address ?? "none";

  const sendTexts = () =>
    run(() => {
      const provider = pickProvider(state.providers, state.preferred);
      const queued = state.texts.filter((t) => !t.sent);
      if (queued.length === 0) throw new LogicError("No billing texts waiting.");
      let log = state.log;
      for (const t of queued) {
        log = addLog(log, { channel: "SMS", to: t.to, via: provider.name, note: t.text });
      }
      save({ ...state, texts: state.texts.map((t) => ({ ...t, sent: true })), log });
      return `${queued.length} text${queued.length === 1 ? "" : "s"} sent via ${provider.name}.`;
    });

  const fixStuck = () =>
    run(() => {
      const stuck = state.emails.filter((e) => isStuck(e, state.accounts));
      if (stuck.length === 0) throw new LogicError("No stuck digests.");
      const emails = state.emails.map((e) => (isStuck(e, state.accounts) ? routeStuck(e, state.accounts) : e));
      save({ ...state, emails });
      return `${stuck.length} stuck digest${stuck.length === 1 ? "" : "s"} re-routed through the default email account.`;
    });

  const sendEmails = () =>
    run(() => {
      const ready = state.emails.filter((e) => e.status === "Queued" && !isStuck(e, state.accounts));
      if (ready.length === 0) throw new LogicError("No digests ready to send. Fix stuck items first.");
      let log = state.log;
      for (const e of ready) {
        log = addLog(log, { channel: "Email", to: e.to, via: accountName(e.accountId), note: e.subject });
      }
      save({
        ...state,
        log,
        emails: state.emails.map((e) => (ready.includes(e) ? { ...e, status: "Sent" } : e)),
      });
      return `${ready.length} digest${ready.length === 1 ? "" : "s"} sent.`;
    });

  const setEnabled = (id: string, enabled: boolean) =>
    save({ ...state, providers: state.providers.map((p) => (p.id === id ? { ...p, enabled } : p)) });

  return (
    <DemoShell
      title="SMS and email notifications"
      intro="A browser simulation of a real app built in Frappe. Billing texts pick an SMS provider, and email digests send through an email account. No message is really sent."
      tryThis={TRY_THIS}
      backHref="/?panel=work&study=sms-and-email"
      onReset={() => {
        reset();
        clear();
      }}
    >
      <Desk>
        <Messages error={error} notice={notice} />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card title="SMS settings and billing texts">
            <Field id="m-provider" label="Selected provider">
              <select id="m-provider" className={inputClass} value={state.preferred} onChange={(e) => save({ ...state, preferred: e.target.value })}>
                {state.providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}{p.enabled ? "" : " (disabled)"}</option>
                ))}
              </select>
            </Field>
            <ul className="mt-3 space-y-1 text-sm">
              {state.providers.map((p) => (
                <li key={p.id} className="flex items-center gap-2">
                  <input id={`en-${p.id}`} type="checkbox" checked={p.enabled} onChange={(e) => setEnabled(p.id, e.target.checked)} />
                  <label htmlFor={`en-${p.id}`}>{p.name} enabled</label>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <DataTable
                head={["To", "Text", "Status"]}
                rows={state.texts.map((t) => [t.to, t.text, <Pill key={t.id}>{t.sent ? "Active" : "Draft"}</Pill>])}
              />
            </div>
            <button type="button" className={`${btn.gold} mt-3`} onClick={sendTexts}>Send billing texts</button>
          </Card>

          <Card title="Email digest queue">
            <DataTable
              head={["Digest", "Account", "Status"]}
              rows={state.emails.map((e) => [
                e.subject,
                accountName(e.accountId),
                isStuck(e, state.accounts) ? "Stuck" : e.status,
              ])}
            />
            <p className="mt-2 text-xs text-ink-muted">
              Default account: {state.accounts.find((a) => a.isDefault)?.address}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className={btn.primary} onClick={fixStuck}>Fix stuck</button>
              <button type="button" className={btn.gold} onClick={sendEmails}>Send digests</button>
            </div>
          </Card>

          <div className="lg:col-span-2">
            <Card title="Message log">
              <DataTable
                empty="Nothing sent yet."
                head={["#", "Channel", "To", "Sent via", "Content"]}
                rows={state.log.map((l) => [l.id, l.channel, l.to, l.via, l.note])}
              />
            </Card>
          </div>
        </div>
      </Desk>
    </DemoShell>
  );
}
