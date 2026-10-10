import { beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { createPglite } from "./db.js";
import { migrate } from "./migrate.js";
import { buildApp } from "./app.js";
import { seedDemoUsers, DEMO_PASSWORD } from "./seed.js";

let app: FastifyInstance;
let db: Awaited<ReturnType<typeof createPglite>>;

beforeEach(async () => {
  db = await createPglite();
  await migrate(db);
  await seedDemoUsers(db);
  app = await buildApp(db, { jwtSecret: "test-secret" });
});

async function login(email: string) {
  const res = await app.inject({
    method: "POST",
    url: "/auth/login",
    payload: { email, password: DEMO_PASSWORD },
  });
  return res.json().token as string;
}

const auth = (token: string) => ({ authorization: `Bearer ${token}` });
const input = { studentName: "Ana Cruz", units: 21, feeCents: 100_000 };

async function createDraft(token: string, body: object = input) {
  return app.inject({ method: "POST", url: "/enrollments", headers: auth(token), payload: body });
}

async function eventCount(id: number) {
  const r = await db.query<{ n: string }>(
    "select count(*)::text as n from enrollment_events where enrollment_id = $1",
    [id],
  );
  return Number(r.rows[0].n);
}

describe("authentication", () => {
  it("logs in with the right password", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "dean@demo.test", password: DEMO_PASSWORD },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().user).toMatchObject({ role: "dean" });
    expect(res.json().user.passwordHash).toBeUndefined();
  });

  it("rejects a wrong password and an unknown email the same way", async () => {
    const bad = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "dean@demo.test", password: "nope" },
    });
    const unknown = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "who@demo.test", password: "nope" },
    });
    expect(bad.statusCode).toBe(401);
    expect(unknown.statusCode).toBe(401);
    expect(bad.json()).toEqual(unknown.json());
  });

  it("requires a token for enrollment routes", async () => {
    const res = await app.inject({ method: "GET", url: "/enrollments/1" });
    expect(res.statusCode).toBe(401);
  });
});

describe("creating enrollments", () => {
  it("lets an encoder create a draft", async () => {
    const res = await createDraft(await login("encoder@demo.test"));
    expect(res.statusCode).toBe(201);
    expect(res.json()).toMatchObject({ studentName: "Ana Cruz", units: 21, status: "draft", paidCents: 0 });
  });

  it("blocks other roles from creating", async () => {
    const res = await createDraft(await login("dean@demo.test"));
    expect(res.statusCode).toBe(403);
  });

  it("enforces the unit limit", async () => {
    const token = await login("encoder@demo.test");
    const res = await createDraft(token, { ...input, units: 25 });
    expect(res.statusCode).toBe(400);
    expect(res.json().errors).toContain("units must be between 1 and 24");
  });

  it("returns 404 for a missing or non-numeric id", async () => {
    const token = await login("encoder@demo.test");
    expect((await app.inject({ method: "GET", url: "/enrollments/999", headers: auth(token) })).statusCode).toBe(404);
    expect((await app.inject({ method: "GET", url: "/enrollments/abc", headers: auth(token) })).statusCode).toBe(404);
  });
});

describe("approval workflow", () => {
  async function toFinance() {
    const encoder = await login("encoder@demo.test");
    const dean = await login("dean@demo.test");
    const registrar = await login("registrar@demo.test");
    const finance = await login("finance@demo.test");
    const { id } = (await createDraft(encoder)).json();
    await app.inject({ method: "POST", url: `/enrollments/${id}/submit`, headers: auth(encoder) });
    await app.inject({ method: "POST", url: `/enrollments/${id}/approve`, headers: auth(dean) });
    await app.inject({ method: "POST", url: `/enrollments/${id}/approve`, headers: auth(registrar) });
    return { id, encoder, dean, registrar, finance };
  }

  it("runs the full path to a locked enrollment", async () => {
    const { id, finance } = await toFinance();
    const pay = await app.inject({
      method: "POST",
      url: `/enrollments/${id}/payments`,
      headers: auth(finance),
      payload: { amountCents: 100_000 },
    });
    expect(pay.json().paidCents).toBe(100_000);
    const done = await app.inject({ method: "POST", url: `/enrollments/${id}/approve`, headers: auth(finance) });
    expect(done.statusCode).toBe(200);
    expect(done.json().enrollment.status).toBe("enrolled");
    const events = await app.inject({ method: "GET", url: `/enrollments/${id}/events`, headers: auth(finance) });
    expect(events.json().map((e: { toStatus: string }) => e.toStatus)).toEqual([
      "draft",
      "dean",
      "registrar",
      "finance",
      "enrolled",
    ]);
  });

  it("will not lock until the fee is paid", async () => {
    const { id, finance } = await toFinance();
    const blocked = await app.inject({ method: "POST", url: `/enrollments/${id}/approve`, headers: auth(finance) });
    expect(blocked.statusCode).toBe(409);
    expect(blocked.json().error).toMatch(/payment/i);
    await app.inject({ method: "POST", url: `/enrollments/${id}/payments`, headers: auth(finance), payload: { amountCents: 99_999 } });
    const stillBlocked = await app.inject({ method: "POST", url: `/enrollments/${id}/approve`, headers: auth(finance) });
    expect(stillBlocked.statusCode).toBe(409);
    const status = await app.inject({ method: "GET", url: `/enrollments/${id}`, headers: auth(finance) });
    expect(status.json().status).toBe("finance");
  });

  it("rejects an approval from the wrong role", async () => {
    const encoder = await login("encoder@demo.test");
    const registrar = await login("registrar@demo.test");
    const { id } = (await createDraft(encoder)).json();
    await app.inject({ method: "POST", url: `/enrollments/${id}/submit`, headers: auth(encoder) });
    const res = await app.inject({ method: "POST", url: `/enrollments/${id}/approve`, headers: auth(registrar) });
    expect(res.statusCode).toBe(403);
  });

  it("is safe to re-run: a repeated approval changes nothing and adds no history", async () => {
    const { id, dean } = await toFinance();
    const before = await eventCount(id);
    const again = await app.inject({ method: "POST", url: `/enrollments/${id}/approve`, headers: auth(dean) });
    expect(again.statusCode).toBe(200);
    expect(again.json().replayed).toBe(true);
    expect(again.json().enrollment.status).toBe("finance");
    expect(await eventCount(id)).toBe(before);
  });

  it("never wipes a locked enrollment when finance re-runs", async () => {
    const { id, finance } = await toFinance();
    await app.inject({ method: "POST", url: `/enrollments/${id}/payments`, headers: auth(finance), payload: { amountCents: 100_000 } });
    await app.inject({ method: "POST", url: `/enrollments/${id}/approve`, headers: auth(finance) });
    const before = await eventCount(id);
    const again = await app.inject({ method: "POST", url: `/enrollments/${id}/approve`, headers: auth(finance) });
    expect(again.statusCode).toBe(200);
    expect(again.json()).toMatchObject({ replayed: true, enrollment: { status: "enrolled", paidCents: 100_000 } });
    expect(await eventCount(id)).toBe(before);
  });

  it("blocks edits and payments once enrolled", async () => {
    const { id, encoder, finance } = await toFinance();
    await app.inject({ method: "POST", url: `/enrollments/${id}/payments`, headers: auth(finance), payload: { amountCents: 100_000 } });
    await app.inject({ method: "POST", url: `/enrollments/${id}/approve`, headers: auth(finance) });
    const edit = await app.inject({ method: "PATCH", url: `/enrollments/${id}`, headers: auth(encoder), payload: { units: 3 } });
    expect(edit.statusCode).toBe(409);
    const pay = await app.inject({ method: "POST", url: `/enrollments/${id}/payments`, headers: auth(finance), payload: { amountCents: 5 } });
    expect(pay.statusCode).toBe(409);
  });

  it("returns a rejected enrollment to draft with a reason, and allows editing", async () => {
    const encoder = await login("encoder@demo.test");
    const dean = await login("dean@demo.test");
    const { id } = (await createDraft(encoder)).json();
    await app.inject({ method: "POST", url: `/enrollments/${id}/submit`, headers: auth(encoder) });
    const noReason = await app.inject({ method: "POST", url: `/enrollments/${id}/reject`, headers: auth(dean), payload: {} });
    expect(noReason.statusCode).toBe(400);
    const rej = await app.inject({ method: "POST", url: `/enrollments/${id}/reject`, headers: auth(dean), payload: { reason: "Too many units" } });
    expect(rej.json().status).toBe("draft");
    const edit = await app.inject({ method: "PATCH", url: `/enrollments/${id}`, headers: auth(encoder), payload: { units: 18 } });
    expect(edit.statusCode).toBe(200);
    expect(edit.json().units).toBe(18);
  });

  it("validates payments", async () => {
    const { id, finance } = await toFinance();
    for (const amountCents of [0, -5, 1.5, "10"]) {
      const res = await app.inject({ method: "POST", url: `/enrollments/${id}/payments`, headers: auth(finance), payload: { amountCents } });
      expect(res.statusCode).toBe(400);
    }
  });
});
