import { PGlite } from "@electric-sql/pglite";
import pg from "pg";

export type QueryResult<T> = { rows: T[] };

/** The only database surface the app uses, so tests and production share SQL. */
export interface Db {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;
  /** Run one or more statements without parameters (used for migrations). */
  exec(sql: string): Promise<void>;
  /** Run fn in a transaction. Rolls back if fn throws. */
  tx<T>(fn: (db: Db) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

/** In-process PostgreSQL (WASM). Used for tests and local demos. */
export async function createPglite(): Promise<Db> {
  const lite = new PGlite();
  await lite.waitReady;
  const wrap = (q: Pick<PGlite, "query">): Db => ({
    async query<T>(sql: string, params: unknown[] = []) {
      const r = await q.query<T>(sql, params);
      return { rows: r.rows };
    },
    async exec(sql: string) {
      await (q as PGlite).exec(sql);
    },
    tx: () => {
      throw new Error("nested transactions are not supported");
    },
    close: async () => {},
  });
  return {
    ...wrap(lite),
    tx: (fn) => lite.transaction((t) => fn(wrap(t as unknown as PGlite))),
    close: () => lite.close(),
  };
}

/** A real PostgreSQL server, used when DATABASE_URL is set. */
export function createPg(
  connectionString: string,
  pool: pg.Pool = new pg.Pool({ connectionString }),
): Db {
  // An idle client can error (for example when the database restarts). Without a
  // listener Node treats that as an uncaught exception and exits.
  pool.on("error", (err) => console.error("idle pg client error:", err.message));
  const wrap = (q: pg.Pool | pg.PoolClient): Db => ({
    async query<T>(sql: string, params: unknown[] = []) {
      const r = await q.query(sql, params);
      return { rows: r.rows as T[] };
    },
    async exec(sql: string) {
      await q.query(sql);
    },
    tx: () => {
      throw new Error("nested transactions are not supported");
    },
    close: async () => {},
  });
  return {
    ...wrap(pool),
    async tx(fn) {
      const client = await pool.connect();
      let failure: Error | undefined;
      try {
        await client.query("begin");
        const out = await fn(wrap(client));
        await client.query("commit");
        return out;
      } catch (err) {
        failure = err instanceof Error ? err : new Error(String(err));
        try {
          await client.query("rollback");
        } catch {
          // Keep the original error; the client is discarded below.
        }
        throw err;
      } finally {
        // Passing an error tells the pool to destroy this client, not reuse it.
        client.release(failure);
      }
    },
    close: () => pool.end(),
  };
}
