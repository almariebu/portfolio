import { describe, expect, it } from "vitest";
import { resolveConfig } from "./config.js";

describe("resolveConfig", () => {
  it("uses in-memory defaults and a random secret for a local demo", () => {
    const a = resolveConfig({});
    const b = resolveConfig({});
    expect(a.databaseUrl).toBeUndefined();
    expect(a.port).toBe(4000);
    expect(a.jwtSecret.length).toBeGreaterThanOrEqual(32);
    expect(a.jwtSecret).not.toBe(b.jwtSecret);
  });

  it("requires JWT_SECRET when a real database is configured", () => {
    expect(() => resolveConfig({ DATABASE_URL: "postgres://x" })).toThrow(/JWT_SECRET/);
    expect(resolveConfig({ DATABASE_URL: "postgres://x", JWT_SECRET: "s".repeat(32) }).jwtSecret).toBe("s".repeat(32));
  });

  it("refuses to seed demo users into a real database", () => {
    expect(() =>
      resolveConfig({ DATABASE_URL: "postgres://x", JWT_SECRET: "s".repeat(32), SEED_DEMO: "1" }),
    ).toThrow(/SEED_DEMO/);
  });

  it("seeds demo users only when asked, and only in memory", () => {
    expect(resolveConfig({}).seedDemo).toBe(false);
    expect(resolveConfig({ SEED_DEMO: "1" }).seedDemo).toBe(true);
  });
});
