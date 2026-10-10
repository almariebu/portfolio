import { buildApp } from "./app.js";
import { createPg, createPglite } from "./db.js";
import { migrate } from "./migrate.js";
import { seedDemoUsers } from "./seed.js";

const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;
const port = Number(process.env.PORT ?? 4000);

if (!jwtSecret && databaseUrl) {
  // A real database means real data: never fall back to a guessable secret.
  throw new Error("JWT_SECRET is required when DATABASE_URL is set");
}

const db = databaseUrl ? createPg(databaseUrl) : await createPglite();
await migrate(db);
if (process.env.SEED_DEMO === "1") await seedDemoUsers(db);

const app = await buildApp(db, { jwtSecret: jwtSecret ?? "dev-only-secret" });
await app.listen({ port, host: "0.0.0.0" });
console.log(
  `approvals-app listening on :${port} (${databaseUrl ? "PostgreSQL" : "in-memory PGlite"})`,
);
