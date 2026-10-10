import { randomBytes } from "node:crypto";

export type Config = {
  databaseUrl: string | undefined;
  jwtSecret: string;
  seedDemo: boolean;
  port: number;
};

export function resolveConfig(env: Record<string, string | undefined>): Config {
  const databaseUrl = env.DATABASE_URL || undefined;
  if (databaseUrl && !env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required when DATABASE_URL is set");
  }
  const seedDemo = env.SEED_DEMO === "1";
  if (databaseUrl && seedDemo) {
    throw new Error("SEED_DEMO cannot be used with DATABASE_URL: demo accounts have a known password");
  }
  return {
    databaseUrl,
    // Demo mode gets a fresh random secret each start, so tokens cannot be forged
    // from a value in the source code. Tokens stop working after a restart.
    jwtSecret: env.JWT_SECRET || randomBytes(32).toString("hex"),
    seedDemo,
    port: Number(env.PORT ?? 4000),
  };
}
