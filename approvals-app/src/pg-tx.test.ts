import { describe, expect, it, vi } from "vitest";
import type pg from "pg";
import { createPg } from "./db.js";

function fakePool(client: { query: ReturnType<typeof vi.fn>; release: ReturnType<typeof vi.fn> }) {
  return {
    connect: async () => client,
    on: vi.fn(),
    query: vi.fn(),
    end: vi.fn(),
  } as unknown as pg.Pool;
}

describe("pg transactions", () => {
  it("commits and releases the client normally", async () => {
    const client = { query: vi.fn(async (_sql: string) => ({ rows: [] as unknown[] })), release: vi.fn() };
    const db = createPg("postgres://x", fakePool(client));
    await db.tx(async () => "ok");
    expect(client.query.mock.calls.map((c) => c[0])).toEqual(["begin", "commit"]);
    expect(client.release).toHaveBeenCalledWith(undefined);
  });

  it("surfaces the original error even if rollback fails, and discards the client", async () => {
    const client = {
      query: vi.fn(async (sql: string) => {
        if (sql === "rollback") throw new Error("connection dead");
        return { rows: [] };
      }),
      release: vi.fn(),
    };
    const db = createPg("postgres://x", fakePool(client));
    await expect(db.tx(async () => { throw new Error("boom"); })).rejects.toThrow("boom");
    expect(client.release).toHaveBeenCalledTimes(1);
    expect(client.release.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it("registers an idle-client error handler so a DB restart cannot crash the process", () => {
    const client = { query: vi.fn(), release: vi.fn() };
    const pool = fakePool(client);
    createPg("postgres://x", pool);
    expect(pool.on).toHaveBeenCalledWith("error", expect.any(Function));
  });
});
