import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Katalog testowy
  testDir: "./e2e",

  // Maksymalny czas działania testu w milisekundach
  timeout: 30000,

  // Domyślna nazwa wzorca testowego
  testMatch: "**/*.spec.ts",

  // Liczba retryów dla niepowodzenia testu
  retries: process.env.CI ? 2 : 0,

  // Output reporter
  reporter: [["html", { open: "never" }], ["list"]],

  // Opcje dla wszystkich projektów
  use: {
    // Generowanie screenhotów tylko przy niepowodzeniu
    screenshot: "only-on-failure",

    // Nagrywanie trace tylko przy niepowodzeniu
    trace: "on-first-retry",

    // Nagrywanie wideo tylko przy niepowodzeniu
    video: "on-first-retry",

    // Baseurl do testów
    baseURL: "http://localhost:4321",
  },

  // Konfiguracja projektów - używamy tylko Chrome zgodnie z wytycznymi
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Lokalny serwer deweloperski (opcja dev)
  webServer: {
    command: "npm run dev",
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
});
