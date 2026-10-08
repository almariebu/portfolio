/** Messaging rules: SMS provider selection and email routing via the default account. */
import { LogicError } from "./logic.ts";

export type Provider = { id: string; name: string; enabled: boolean };
export type EmailAccount = { id: string; address: string; enabled: boolean; isDefault: boolean };
export type EmailItem = {
  id: string;
  to: string;
  subject: string;
  accountId: string | null;
  status: "Queued" | "Stuck" | "Sent";
};

/** The chosen provider is used if enabled; otherwise the first enabled one. */
export function pickProvider(providers: Provider[], preferredId: string): Provider {
  const preferred = providers.find((p) => p.id === preferredId);
  if (preferred?.enabled) return preferred;
  const fallback = providers.find((p) => p.enabled);
  if (!fallback) throw new LogicError("No SMS provider is enabled. Enable one in SMS settings.");
  return fallback;
}

export function accountUsable(accounts: EmailAccount[], id: string | null): boolean {
  return !!accounts.find((a) => a.id === id && a.enabled);
}

export function defaultAccount(accounts: EmailAccount[]): EmailAccount {
  const acc = accounts.find((a) => a.isDefault && a.enabled);
  if (!acc) throw new LogicError("No enabled default email account. Mark one account as default.");
  return acc;
}

/** Stuck means the item points at a missing or disabled account. */
export function isStuck(item: EmailItem, accounts: EmailAccount[]): boolean {
  return item.status !== "Sent" && !accountUsable(accounts, item.accountId);
}

export function routeStuck(item: EmailItem, accounts: EmailAccount[]): EmailItem {
  const acc = defaultAccount(accounts);
  return { ...item, accountId: acc.id, status: "Queued" };
}
