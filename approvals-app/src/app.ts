import Fastify, { type FastifyInstance, type FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import type { Db } from "./db.js";
import { hashPassword, verifyPassword } from "./auth.js";
import {
  canActAt,
  nextStatus,
  paymentCovers,
  validateEnrollmentInput,
  type EnrollmentInput,
  type Role,
  type Status,
} from "./rules.js";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: number; role: Role; name: string };
    user: { sub: number; role: Role; name: string };
  }
}

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: string[],
  ) {
    super(message);
  }
}

type EnrollmentRow = {
  id: number;
  student_name: string;
  units: number;
  fee_cents: number;
  paid_cents: number;
  status: Status;
  created_by: number;
};

const toEnrollment = (r: EnrollmentRow) => ({
  id: r.id,
  studentName: r.student_name,
  units: r.units,
  feeCents: r.fee_cents,
  paidCents: r.paid_cents,
  status: r.status,
  createdBy: r.created_by,
});

const ORDER: Status[] = ["draft", "dean", "registrar", "finance", "enrolled"];
const ROLE_STAGE: Partial<Record<Role, Status>> = {
  dean: "dean",
  registrar: "registrar",
  finance: "finance",
};

function parseId(raw: unknown): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(404, "Enrollment not found");
  return id;
}

function requireRole(req: FastifyRequest, ...roles: Role[]) {
  if (!roles.includes(req.user.role)) throw new HttpError(403, "Your role cannot do this");
}

async function lockRow(db: Db, id: number): Promise<EnrollmentRow> {
  const { rows } = await db.query<EnrollmentRow>("select * from enrollments where id = $1 for update", [id]);
  if (!rows[0]) throw new HttpError(404, "Enrollment not found");
  return rows[0];
}

async function record(
  db: Db,
  e: EnrollmentRow,
  actorId: number,
  action: string,
  to: Status,
  note?: string,
) {
  await db.query(
    "insert into enrollment_events (enrollment_id, actor_id, action, from_status, to_status, note) values ($1,$2,$3,$4,$5,$6)",
    [e.id, actorId, action, e.status, to, note ?? null],
  );
}

async function setStatus(db: Db, id: number, status: Status): Promise<EnrollmentRow> {
  const { rows } = await db.query<EnrollmentRow>(
    "update enrollments set status = $2, updated_at = now() where id = $1 returning *",
    [id, status],
  );
  return rows[0];
}

export async function buildApp(db: Db, opts: { jwtSecret: string }): Promise<FastifyInstance> {
  const app = Fastify();
  await app.register(fastifyJwt, { secret: opts.jwtSecret });
  // Verified against when the email is unknown, so timing does not reveal which emails exist.
  const dummyHash = await hashPassword("not-a-real-password");

  app.setErrorHandler((err: Error & { statusCode?: number }, _req, reply) => {
    if (err instanceof HttpError) {
      return reply.status(err.status).send({ error: err.message, ...(err.errors ? { errors: err.errors } : {}) });
    }
    const status = err.statusCode ?? 500;
    if (status >= 500) app.log.error(err);
    return reply.status(status).send({ error: status >= 500 ? "Internal error" : err.message });
  });

  app.addHook("preHandler", async (req) => {
    if (req.url === "/auth/login" || req.url === "/health") return;
    try {
      await req.jwtVerify();
    } catch {
      throw new HttpError(401, "Authentication required");
    }
  });

  app.get("/health", async () => ({ ok: true }));

  app.post("/auth/login", async (req) => {
    const body = (req.body ?? {}) as { email?: unknown; password?: unknown };
    const fail = new HttpError(401, "Invalid email or password");
    if (typeof body.email !== "string" || typeof body.password !== "string") throw fail;
    const { rows } = await db.query<{ id: number; name: string; role: Role; password_hash: string }>(
      "select id, name, role, password_hash from users where email = $1",
      [body.email],
    );
    const user = rows[0];
    if (!(await verifyPassword(body.password, user?.password_hash ?? dummyHash)) || !user) throw fail;
    const token = app.jwt.sign({ sub: user.id, role: user.role, name: user.name }, { expiresIn: "8h" });
    return { token, user: { id: user.id, name: user.name, role: user.role } };
  });

  app.post("/enrollments", async (req, reply) => {
    requireRole(req, "encoder");
    const errors = validateEnrollmentInput((req.body ?? {}) as EnrollmentInput);
    if (errors.length) throw new HttpError(400, "Invalid enrollment", errors);
    const b = req.body as { studentName: string; units: number; feeCents: number };
    const row = await db.tx(async (t) => {
      const { rows } = await t.query<EnrollmentRow>(
        "insert into enrollments (student_name, units, fee_cents, created_by) values ($1,$2,$3,$4) returning *",
        [b.studentName.trim(), b.units, b.feeCents, req.user.sub],
      );
      await record(t, { ...rows[0], status: "draft" }, req.user.sub, "create", "draft");
      return rows[0];
    });
    return reply.status(201).send(toEnrollment(row));
  });

  app.get("/enrollments/:id", async (req) => {
    const id = parseId((req.params as { id: string }).id);
    const { rows } = await db.query<EnrollmentRow>("select * from enrollments where id = $1", [id]);
    if (!rows[0]) throw new HttpError(404, "Enrollment not found");
    return toEnrollment(rows[0]);
  });

  app.get("/enrollments/:id/events", async (req) => {
    const id = parseId((req.params as { id: string }).id);
    const { rows } = await db.query<{
      action: string;
      from_status: Status;
      to_status: Status;
      actor_id: number;
      note: string | null;
    }>("select * from enrollment_events where enrollment_id = $1 order by id", [id]);
    return rows.map((r) => ({
      action: r.action,
      fromStatus: r.from_status,
      toStatus: r.to_status,
      actorId: r.actor_id,
      note: r.note,
    }));
  });

  app.patch("/enrollments/:id", async (req) => {
    requireRole(req, "encoder");
    const id = parseId((req.params as { id: string }).id);
    const patch = (req.body ?? {}) as Record<string, unknown>;
    return db.tx(async (t) => {
      const e = await lockRow(t, id);
      if (e.status !== "draft") throw new HttpError(409, "Only a draft can be edited");
      const merged = {
        studentName: patch.studentName ?? e.student_name,
        units: patch.units ?? e.units,
        feeCents: patch.feeCents ?? e.fee_cents,
      };
      const errors = validateEnrollmentInput(merged);
      if (errors.length) throw new HttpError(400, "Invalid enrollment", errors);
      const { rows } = await t.query<EnrollmentRow>(
        "update enrollments set student_name=$2, units=$3, fee_cents=$4, updated_at=now() where id=$1 returning *",
        [id, (merged.studentName as string).trim(), merged.units, merged.feeCents],
      );
      return toEnrollment(rows[0]);
    });
  });

  app.post("/enrollments/:id/submit", async (req) => {
    requireRole(req, "encoder");
    const id = parseId((req.params as { id: string }).id);
    return db.tx(async (t) => {
      const e = await lockRow(t, id);
      if (e.status !== "draft") return { enrollment: toEnrollment(e), replayed: true };
      await record(t, e, req.user.sub, "submit", "dean");
      return { enrollment: toEnrollment(await setStatus(t, id, "dean")), replayed: false };
    });
  });

  app.post("/enrollments/:id/approve", async (req) => {
    const stage = ROLE_STAGE[req.user.role];
    if (!stage) throw new HttpError(403, "Your role cannot approve");
    const id = parseId((req.params as { id: string }).id);
    return db.tx(async (t) => {
      const e = await lockRow(t, id);
      // Safe re-run: this stage is already done, so change nothing.
      if (ORDER.indexOf(e.status) > ORDER.indexOf(stage)) {
        return { enrollment: toEnrollment(e), replayed: true };
      }
      if (!canActAt(req.user.role, e.status)) {
        throw new HttpError(403, "This enrollment is not at your stage");
      }
      if (e.status === "finance" && !paymentCovers({ feeCents: e.fee_cents, paidCents: e.paid_cents })) {
        throw new HttpError(409, "Payment incomplete: the fee must be fully paid before enrollment is locked");
      }
      const next = nextStatus(e.status)!;
      await record(t, e, req.user.sub, "approve", next);
      return { enrollment: toEnrollment(await setStatus(t, id, next)), replayed: false };
    });
  });

  app.post("/enrollments/:id/reject", async (req) => {
    if (!ROLE_STAGE[req.user.role]) throw new HttpError(403, "Your role cannot reject");
    const id = parseId((req.params as { id: string }).id);
    const reason = ((req.body ?? {}) as { reason?: unknown }).reason;
    if (typeof reason !== "string" || reason.trim() === "") {
      throw new HttpError(400, "A reason is required", ["reason is required"]);
    }
    return db.tx(async (t) => {
      const e = await lockRow(t, id);
      if (!canActAt(req.user.role, e.status)) {
        throw new HttpError(403, "This enrollment is not at your stage");
      }
      await record(t, e, req.user.sub, "reject", "draft", reason.trim());
      return toEnrollment(await setStatus(t, id, "draft"));
    });
  });

  app.post("/enrollments/:id/payments", async (req) => {
    requireRole(req, "finance");
    const id = parseId((req.params as { id: string }).id);
    const { amountCents: amount, reference } = (req.body ?? {}) as {
      amountCents?: unknown;
      reference?: unknown;
    };
    const errors: string[] = [];
    if (!Number.isInteger(amount) || (amount as number) < 1) {
      errors.push("amountCents must be a positive integer");
    }
    if (typeof reference !== "string" || reference.trim() === "" || reference.length > 100) {
      errors.push("reference is required (receipt number, up to 100 characters)");
    }
    if (errors.length) throw new HttpError(400, "Invalid payment", errors);
    const ref = (reference as string).trim();
    return db.tx(async (t) => {
      const e = await lockRow(t, id);
      if (e.status === "enrolled") throw new HttpError(409, "Enrollment is locked");
      // The same receipt reference is applied once, so a client retry is harmless.
      const inserted = await t.query(
        "insert into payments (enrollment_id, reference, amount_cents, created_by) values ($1,$2,$3,$4) on conflict (enrollment_id, reference) do nothing returning id",
        [id, ref, amount, req.user.sub],
      );
      if (inserted.rows.length === 0) return { ...toEnrollment(e), replayed: true };
      const { rows } = await t.query<EnrollmentRow>(
        "update enrollments set paid_cents = paid_cents + $2, updated_at = now() where id = $1 returning *",
        [id, amount],
      );
      return { ...toEnrollment(rows[0]), replayed: false };
    });
  });

  return app;
}
