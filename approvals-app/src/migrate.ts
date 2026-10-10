import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import type { Db } from "./db.js";

const dir = fileURLToPath(new URL("../migrations", import.meta.url));

/** Applies each unapplied *.sql file in order. Returns the names it applied. */
export async function migrate(db: Db): Promise<string[]> {
  await db.query(
    "create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())",
  );
  const done = new Set(
    (await db.query<{ name: string }>("select name from schema_migrations")).rows.map((r) => r.name),
  );
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  const applied: string[] = [];
  for (const file of files) {
    if (done.has(file)) continue;
    const sql = await readFile(join(dir, file), "utf8");
    await db.tx(async (t) => {
      await t.exec(sql);
      await t.query("insert into schema_migrations (name) values ($1)", [file]);
    });
    applied.push(file);
  }
  return applied;
}
