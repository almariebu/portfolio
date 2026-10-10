"use client";

import { Card, DataTable, DemoShell, Desk, Messages, btn, inputClass } from "./ui";
import { useDemoStore } from "./useDemoStore";
import { useMessages } from "./useMessages";
import { DEFAULT_ROLES, NEW_FEES, OLD_FEES, migrationSeed, type MigrationState } from "@/lib/demo/cases-data.ts";
import { applyDefaultRoles, mapFees, recoverFile } from "@/lib/demo/migration-logic.ts";

const TRY_THIS = [
  "Press Apply default roles. Each user gets the roles for their designation; roles they already had are kept. Run it twice: nothing is duplicated.",
  "In the fee mapping table, map each old fee code to a new fee. Unmapped codes are flagged until you map them.",
  "Press Recover missing files. Files with no file on disk are restored from the backup. receipt-0042.jpg is already on disk and is not overwritten. grades-g7.xlsx is not in the backup and stays missing.",
];

export default function MigrationDemo() {
  const { state, save, reset } = useDemoStore<MigrationState>("demo:roles-and-migration:v1", migrationSeed);
  const { error, notice, run, clear } = useMessages();
  const fees = mapFees(OLD_FEES, state.mapping);

  const applyRoles = () =>
    run(() => {
      const users = applyDefaultRoles(state.users, DEFAULT_ROLES);
      const changed = users.filter((u, i) => u.roles.length !== state.users[i].roles.length).length;
      save({ ...state, users });
      return changed ? `Default roles added for ${changed} user${changed === 1 ? "" : "s"}.` : "Every user already has their default roles.";
    });

  const setMap = (code: string, value: string) => {
    const mapping = { ...state.mapping };
    if (value) mapping[code] = value;
    else delete mapping[code];
    save({ ...state, mapping });
  };

  const recover = () =>
    run(() => {
      const result: Record<string, string> = {};
      const files = state.files.map((f) => {
        const r = recoverFile(f, state.backup);
        result[f.name] = r;
        return r === "recovered" ? { ...f, onDisk: true } : f;
      });
      save({ ...state, files, result });
      const n = Object.values(result).filter((r) => r === "recovered").length;
      return `${n} file${n === 1 ? "" : "s"} recovered. Files already on disk were left alone.`;
    });

  return (
    <DemoShell
      title="Roles and data migration"
      intro="A browser simulation of a real app built in Frappe. It shows a freshly migrated site and the three fixes that make it usable: default roles, mapped fees, and recovered files. Nothing leaves your browser."
      tryThis={TRY_THIS}
      backHref="/?panel=work&study=roles-and-migration"
      onReset={() => {
        reset();
        clear();
      }}
    >
      <Desk>
        <Messages error={error} notice={notice} />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card title="1. Default roles" action={<button type="button" className={btn.gold} onClick={applyRoles}>Apply default roles</button>}>
            <DataTable
              head={["User", "Designation", "Roles"]}
              rows={state.users.map((u) => [u.name, u.designation, u.roles.join(", ") || "None"])}
            />
          </Card>

          <Card title="2. Fee mapping">
            <DataTable
              head={["Old fee code", "New fee"]}
              rows={OLD_FEES.map((code) => [
                code,
                <select
                  key={code}
                  aria-label={`New fee for ${code}`}
                  className={inputClass}
                  value={state.mapping[code] ?? ""}
                  onChange={(e) => setMap(code, e.target.value)}
                >
                  <option value="">Not mapped</option>
                  {NEW_FEES.map((f) => <option key={f}>{f}</option>)}
                </select>,
              ])}
            />
            <p
              role="status"
              className={`mt-2 text-sm ${fees.unmapped.length ? "text-red-800" : "text-emerald-800"}`}
            >
              {fees.unmapped.length
                ? `Unmapped: ${fees.unmapped.join(", ")}. Old bills using these codes will not match a fee.`
                : "All old fee codes are mapped."}
            </p>
          </Card>

          <div className="lg:col-span-2">
            <Card title="3. File attachments" action={<button type="button" className={btn.gold} onClick={recover}>Recover missing files</button>}>
              <DataTable
                head={["File record", "On disk", "In backup", "Last recovery"]}
                rows={state.files.map((f) => [
                  f.name,
                  f.onDisk ? "Yes" : "Missing",
                  state.backup.includes(f.name) ? "Yes" : "No",
                  state.result[f.name] ?? "-",
                ])}
              />
            </Card>
          </div>
        </div>
      </Desk>
    </DemoShell>
  );
}
