import { defineConfig, devices } from "@playwright/test";

// Smoke tests run against the static export served the way GitHub Pages serves it (base path + 404.html).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const port = 4173;

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 3,
  expect: { timeout: 12_000 },
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: `http://127.0.0.1:${port}${basePath}/`, trace: "retain-on-failure" },
  webServer: {
    command: `node scripts/serve-out.mjs ${port}`,
    url: `http://127.0.0.1:${port}${basePath}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "chromium-reduced", use: { ...devices["Desktop Chrome"], reducedMotion: "reduce" } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "no-webgl", use: { ...devices["Desktop Chrome"], launchOptions: { args: ["--disable-3d-apis"] } } },
  ],
});
