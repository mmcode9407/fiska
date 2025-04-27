import { type Page, type Locator, expect } from "@playwright/test";

export class FlashcardItem {
  readonly page: Page;
  readonly container: Locator;
  readonly acceptCheckbox: Locator;
  readonly frontTextarea: Locator;
  readonly backTextarea: Locator;
  readonly editButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly frontCharCount: Locator;
  readonly backCharCount: Locator;

  constructor(page: Page, id: string) {
    this.page = page;
    this.container = page.locator(`[data-test-id="flashcard-item-${id}"]`);
    this.acceptCheckbox = this.container.locator(`#accept-${id}`);
    this.frontTextarea = this.container.locator(`#front-${id}`);
    this.backTextarea = this.container.locator(`#back-${id}`);
    this.editButton = this.container.getByRole("button", { name: "Edytuj" });
    this.saveButton = this.container.getByRole("button", { name: "Zapisz zmiany" });
    this.cancelButton = this.container.getByRole("button", { name: "Anuluj" });
    this.frontCharCount = this.container.locator("text=/^\\d+\\/200$/");
    this.backCharCount = this.container.locator("text=/^\\d+\\/500$/");
  }

  async accept() {
    await this.acceptCheckbox.check();
    await expect(this.container).toHaveClass(/border-primary/);
  }

  async unaccept() {
    await this.acceptCheckbox.uncheck();
    await expect(this.container).not.toHaveClass(/border-primary/);
  }

  async startEditing() {
    await this.editButton.click();
    await expect(this.frontTextarea).toBeEnabled();
    await expect(this.backTextarea).toBeEnabled();
  }

  async editContent(front?: string, back?: string) {
    if (!(await this.frontTextarea.isEnabled())) {
      await this.startEditing();
    }

    if (front !== undefined) {
      await this.frontTextarea.fill(front);
      await expect(this.frontCharCount).toContainText(`${front.length}/200`);
    }

    if (back !== undefined) {
      await this.backTextarea.fill(back);
      await expect(this.backCharCount).toContainText(`${back.length}/500`);
    }
  }

  async saveChanges() {
    await this.saveButton.click();
    await expect(this.frontTextarea).toBeDisabled();
    await expect(this.backTextarea).toBeDisabled();
  }

  async cancelEditing() {
    await this.cancelButton.click();
    await expect(this.frontTextarea).toBeDisabled();
    await expect(this.backTextarea).toBeDisabled();
  }

  async expectContent(front: string, back: string) {
    await expect(this.frontTextarea).toHaveValue(front);
    await expect(this.backTextarea).toHaveValue(back);
  }

  async expectAccepted(accepted: boolean) {
    await expect(this.acceptCheckbox).toBeChecked({ checked: accepted });
    if (accepted) {
      await expect(this.container).toHaveClass(/border-primary/);
    } else {
      await expect(this.container).not.toHaveClass(/border-primary/);
    }
  }
}
