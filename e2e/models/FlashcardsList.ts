import { type Page, type Locator, expect } from "@playwright/test";
import { FlashcardItem } from "./FlashcardItem";

export class FlashcardsList {
  readonly page: Page;
  readonly container: Locator;
  readonly title: Locator;
  readonly grid: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('[data-test-id="flashcard-list"]');
    this.title = page.locator('[data-test-id="flashcard-list-title"]');
    this.grid = page.locator('[data-test-id="flashcard-grid"]');
  }

  async expectFlashcardsVisible() {
    await expect(this.container).toBeVisible();
    await expect(this.title).toBeVisible();
    await expect(this.grid).toBeVisible();
  }

  async getFlashcard(id: string): Promise<FlashcardItem> {
    const flashcard = new FlashcardItem(this.page, id);
    await expect(flashcard.container).toBeVisible();
    return flashcard;
  }

  async getAllFlashcards(): Promise<FlashcardItem[]> {
    const items = await this.grid.locator('[data-test-id^="flashcard-item-"]').all();
    return Promise.all(
      items.map(async (item) => {
        const fullId = await item.getAttribute("data-test-id");
        const id = fullId?.replace("flashcard-item-", "") || "";
        return new FlashcardItem(this.page, id);
      })
    );
  }

  async getFirstFlashcard(): Promise<FlashcardItem> {
    const flashcards = await this.getAllFlashcards();
    if (flashcards.length === 0) {
      throw new Error("Nie znaleziono żadnych fiszek");
    }
    return flashcards[0];
  }

  async expectAtLeastOneFlashcard() {
    const items = await this.getAllFlashcards();
    expect(items.length).toBeGreaterThan(0);
  }
}
