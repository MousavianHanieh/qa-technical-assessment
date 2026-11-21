import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 90000,
  expect: { timeout: 10000 },
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: process.env.BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        headless: false,
        locale: "en-US",
        timezoneId: "Europe/London",
        viewport: { width: 1366, height: 800 },
        launchOptions: {
          args: ["--disable-blink-features=AutomationControlled"],
          ignoreDefaultArgs: ["--enable-automation"],
        },
      },
    },
  ],
  outputDir: "test-results/",
});
