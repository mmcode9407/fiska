import type { Page, Locator } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Klasa reprezentująca model strony głównej według wzorca Page Object Model (POM)
 */
export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly navigationLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1");
    this.navigationLinks = page.locator("nav a");
  }

  /**
   * Nawiguje do strony głównej
   */
  async goto() {
    await this.page.goto("/");
  }

  /**
   * Weryfikuje, czy strona główna została poprawnie załadowana
   */
  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.page).toHaveTitle(/Fiska/);
  }

  /**
   * Klika w link nawigacyjny o podanej nazwie
   * @param name Nazwa linku nawigacyjnego
   */
  async clickNavLink(name: string) {
    await this.navigationLinks.filter({ hasText: name }).click();
  }
}
