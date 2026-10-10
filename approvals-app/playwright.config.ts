import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  workers: 1,
  use: { baseURL: "http://localhost:4100" },
  webServer: {
    command: "SEED_DEMO=1 PORT=4100 npx tsx src/server.ts",
    url: "http://localhost:4100/health",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
