import { FlashcardsList } from "./FlashcardsList";
import { type Page, type Locator, expect } from "@playwright/test";

export class GeneratePage {
  readonly page: Page;
  readonly container: Locator;
  readonly sourceTextArea: Locator;
  readonly generateButton: Locator;
  readonly charCount: Locator;
  readonly validationError: Locator;
  readonly errorMessage: Locator;
  readonly flashcardsContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('[data-test-id="generate-view"]');
    this.sourceTextArea = page.locator('[data-test-id="source-text-input"]');
    this.generateButton = page.locator('[data-test-id="generate-button"]');
    this.charCount = page.locator('[data-test-id="char-count"]');
    this.validationError = page.locator('[data-test-id="validation-error"]');
    this.errorMessage = page.locator('[data-test-id="generate-error"]');
    this.flashcardsContainer = page.locator('[data-test-id="flashcards-container"]');
  }

  async goto() {
    await this.page.goto("/generate");
    await expect(this.container).toBeVisible();
  }

  async enterText(text: string) {
    await this.sourceTextArea.clear();
    await this.sourceTextArea.type(text, { delay: 0 });

    await expect(this.sourceTextArea).toHaveValue(text);
    await expect(this.charCount).toContainText(`Liczba znaków: ${text.length}`, {
      timeout: 10000,
    });
  }

  async generate() {
    await this.generateButton.click();
    await this.waitForGeneration();
  }

  async waitForGeneration() {
    const skeleton = this.page.locator('[data-test-id="generation-skeleton"]');
    await expect(skeleton).toBeVisible();

    await Promise.race([
      expect(this.flashcardsContainer).toBeVisible({ timeout: 30000 }),
      expect(this.errorMessage).toBeVisible({ timeout: 30000 }),
    ]);

    await expect(skeleton).not.toBeVisible();
  }

  async expectValidationError() {
    await expect(this.validationError).toBeVisible();
    await expect(this.generateButton).toBeDisabled();
  }

  async expectGenerationError() {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectFlashcardsGenerated() {
    await expect(this.flashcardsContainer).toBeVisible();
    const flashcardsList = new FlashcardsList(this.page);
    await flashcardsList.expectFlashcardsVisible();
    return flashcardsList;
  }
}
