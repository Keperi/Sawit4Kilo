import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Directory where test files are located
  testDir: './tests',

  // Maximum time one test can run for
  timeout: 30 * 1000,

  // Expect timeout for assertions
  expect: {
    timeout: 8000,
  },

  // Run tests in parallel by default
  fullyParallel: false,

  // Fail the build on CI if test.only is accidentally left in source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 1 : 0,

  // Number of workers
  workers: 1,

  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    // Base URL for all tests
    baseURL: 'http://localhost:5173',

    // Collect trace when retrying a failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Browser viewport
    viewport: { width: 1440, height: 900 },

    // Headless by default, change to false to watch the browser
    headless: true,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
