import { expect, test, type APIRequestContext } from "@playwright/test";

const PASSWORD = "demo-password";

async function tokenFor(request: APIRequestContext, email: string) {
  const res = await request.post("/auth/login", { data: { email, password: PASSWORD } });
  expect(res.ok()).toBeTruthy();
  return { Authorization: `Bearer ${(await res.json()).token}` };
}

test("an enrollment goes from draft to locked through every role", async ({ request }) => {
  const encoder = await tokenFor(request, "encoder@demo.test");
  const dean = await tokenFor(request, "dean@demo.test");
  const registrar = await tokenFor(request, "registrar@demo.test");
  const finance = await tokenFor(request, "finance@demo.test");

  const created = await request.post("/enrollments", {
    headers: encoder,
    data: { studentName: "Mia Santos", units: 18, feeCents: 250_000 },
  });
  expect(created.status()).toBe(201);
  const { id } = await created.json();

  await request.post(`/enrollments/${id}/submit`, { headers: encoder });
  await request.post(`/enrollments/${id}/approve`, { headers: dean });
  await request.post(`/enrollments/${id}/approve`, { headers: registrar });

  const early = await request.post(`/enrollments/${id}/approve`, { headers: finance });
  expect(early.status()).toBe(409);

  await request.post(`/enrollments/${id}/payments`, { headers: finance, data: { amountCents: 250_000 } });
  const locked = await request.post(`/enrollments/${id}/approve`, { headers: finance });
  expect(locked.status()).toBe(200);
  expect((await locked.json()).enrollment.status).toBe("enrolled");

  const again = await request.post(`/enrollments/${id}/approve`, { headers: finance });
  expect((await again.json()).replayed).toBe(true);

  const events = await (await request.get(`/enrollments/${id}/events`, { headers: finance })).json();
  expect(events).toHaveLength(5);
});

test("protected routes reject a missing or bad token", async ({ request }) => {
  expect((await request.get("/enrollments/1")).status()).toBe(401);
  const bad = await request.get("/enrollments/1", { headers: { Authorization: "Bearer nope" } });
  expect(bad.status()).toBe(401);
});

test("a dean cannot create enrollments", async ({ request }) => {
  const dean = await tokenFor(request, "dean@demo.test");
  const res = await request.post("/enrollments", {
    headers: dean,
    data: { studentName: "X", units: 3, feeCents: 1 },
  });
  expect(res.status()).toBe(403);
});
