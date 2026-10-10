import { hashPassword } from "./auth.js";
import type { Db } from "./db.js";

/** Demo accounts only. Never use these credentials outside a demo. */
export const DEMO_PASSWORD = "demo-password";

const DEMO_USERS = [
  { email: "encoder@demo.test", name: "Eli Encoder", role: "encoder" },
  { email: "dean@demo.test", name: "Dana Dean", role: "dean" },
  { email: "registrar@demo.test", name: "Rey Registrar", role: "registrar" },
  { email: "finance@demo.test", name: "Fe Finance", role: "finance" },
] as const;

export async function seedDemoUsers(db: Db): Promise<void> {
  const hash = await hashPassword(DEMO_PASSWORD);
  for (const u of DEMO_USERS) {
    await db.query(
      "insert into users (email, name, password_hash, role) values ($1, $2, $3, $4) on conflict (email) do nothing",
      [u.email, u.name, hash, u.role],
    );
  }
}
