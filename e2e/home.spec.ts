import { test, expect } from "@playwright/test";
import { HomePage } from "./models/HomePage";

test.describe("Strona główna", () => {
  test("powinna się poprawnie załadować", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.expectLoaded();
  });

  test("powinna umożliwiać nawigację", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Ten test zostanie uzupełniony po implementacji innych stron
    // np. await homePage.clickNavLink('Moje fiszki');
    // await expect(page).toHaveURL(/.*flashcards/);
  });

  test("powinna wykonać zrzut ekranu", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await expect(page).toHaveScreenshot("home-page.png");
  });
});
