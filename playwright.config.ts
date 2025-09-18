import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env['CI']; // bracket access + coerce to boolean

export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: process.env['BASE_URL'] ?? 'http://localhost:3000' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !isCI, // ok: boolean
  },
});
