import { buildApp } from "./app.js";
import { resolveConfig } from "./config.js";
import { createPg, createPglite } from "./db.js";
import { migrate } from "./migrate.js";
import { seedDemoUsers } from "./seed.js";

const config = resolveConfig(process.env);

const db = config.databaseUrl ? createPg(config.databaseUrl) : await createPglite();
await migrate(db);
if (config.seedDemo) await seedDemoUsers(db);

const app = await buildApp(db, { jwtSecret: config.jwtSecret });
await app.listen({ port: config.port, host: "0.0.0.0" });
console.log(
  `approvals-app listening on :${config.port} (${config.databaseUrl ? "PostgreSQL" : "in-memory PGlite"})`,
);
