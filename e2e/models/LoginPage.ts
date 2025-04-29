import { type Page, type Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Hasło");
    this.submitButton = page.getByRole("button", { name: "Zaloguj się" });
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await expect(this.emailInput).toHaveValue(email);

    await this.passwordInput.fill(password);
    await expect(this.passwordInput).toHaveValue(password);

    await this.submitButton.click();

    await this.page.waitForURL("/generate", { waitUntil: "load" });
  }
}
