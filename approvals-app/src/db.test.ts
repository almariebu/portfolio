import { describe, expect, it } from "vitest";
import { createPglite } from "./db.js";
import { migrate } from "./migrate.js";
import { hashPassword, verifyPassword } from "./auth.js";

describe("migrate", () => {
  it("creates the tables and records the migration", async () => {
    const db = await createPglite();
    const applied = await migrate(db);
    expect(applied).toEqual(["001_init.sql", "002_payments.sql"]);
    const { rows } = await db.query<{ table_name: string }>(
      "select table_name from information_schema.tables where table_schema = 'public' order by 1",
    );
    const names = rows.map((r) => r.table_name);
    expect(names).toEqual(
      expect.arrayContaining(["users", "enrollments", "enrollment_events", "payments", "schema_migrations"]),
    );
  });

  it("is safe to run twice", async () => {
    const db = await createPglite();
    await migrate(db);
    expect(await migrate(db)).toEqual([]);
  });

  it("rejects an invalid role at the database level", async () => {
    const db = await createPglite();
    await migrate(db);
    await expect(
      db.query("insert into users (email, name, password_hash, role) values ('a@b.c','A','x','admin')"),
    ).rejects.toThrow();
  });

  it("rejects units over the limit at the database level", async () => {
    const db = await createPglite();
    await migrate(db);
    await db.query("insert into users (email, name, password_hash, role) values ('a@b.c','A','x','encoder')");
    await expect(
      db.query(
        "insert into enrollments (student_name, units, fee_cents, created_by) values ('S', 25, 100, 1)",
      ),
    ).rejects.toThrow();
  });
});

describe("password hashing", () => {
  it("verifies the right password and rejects a wrong one", async () => {
    const hash = await hashPassword("s3cret");
    expect(hash).not.toContain("s3cret");
    expect(await verifyPassword("s3cret", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("salts: the same password hashes differently", async () => {
    expect(await hashPassword("same")).not.toBe(await hashPassword("same"));
  });

  it("returns false for a malformed stored hash", async () => {
    expect(await verifyPassword("x", "not-a-hash")).toBe(false);
  });
});
