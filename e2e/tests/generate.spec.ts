import { test, expect } from "@playwright/test";
import { GeneratePage } from "../models/GeneratePage";

test.describe("Generowanie fiszek", () => {
  let generatePage: GeneratePage;

  test.beforeEach(async ({ page }) => {
    generatePage = new GeneratePage(page);
    await generatePage.goto();
  });

  test("GEN-001: Pomyślne wygenerowanie fiszek dla tekstu o poprawnej długości", async ({ page }) => {
    // Arrange
    const sampleText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
      .repeat(25) // każde powtórzenie ma 56 znaków, więc 25 * 56 = 1400 znaków
      .trim(); // usuwamy ewentualne białe znaki z końca

    // Act
    await generatePage.enterText(sampleText);
    await generatePage.generate();

    // Assert
    const flashcardsList = await generatePage.expectFlashcardsGenerated();

    // Weryfikacja liczby wygenerowanych fiszek
    await flashcardsList.expectAtLeastOneFlashcard();

    // Weryfikacja stanu początkowego fiszek
    const flashcards = await flashcardsList.getAllFlashcards();
    for (const flashcard of flashcards) {
      // Sprawdzenie czy fiszka jest widoczna i ma poprawną strukturę
      await expect(flashcard.container).toBeVisible();

      // Sprawdzenie czy fiszka nie jest zaakceptowana
      await flashcard.expectAccepted(false);

      // Sprawdzenie czy pola tekstowe są wypełnione i zablokowane
      await expect(flashcard.frontTextarea).toBeDisabled();
      await expect(flashcard.backTextarea).toBeDisabled();
      await expect(flashcard.frontTextarea).not.toBeEmpty();
      await expect(flashcard.backTextarea).not.toBeEmpty();
    }

    // Weryfikacja możliwości edycji pierwszej fiszki
    const firstFlashcard = await flashcardsList.getFirstFlashcard();

    // Test edycji
    await firstFlashcard.editContent("Nowy przód fiszki", "Nowy tył fiszki");
    await firstFlashcard.saveChanges();

    // Weryfikacja zapisanych zmian
    await firstFlashcard.expectContent("Nowy przód fiszki", "Nowy tył fiszki");

    // Test akceptacji
    await firstFlashcard.accept();
    await firstFlashcard.expectAccepted(true);

    // Zrzut ekranu dla dokumentacji
    await page.screenshot({
      path: "test-results/gen-001-success.png",
      fullPage: true,
    });
  });

  test("GEN-001: Weryfikacja stanu ładowania podczas generowania", async () => {
    const sampleText = "a".repeat(1500);
    await generatePage.enterText(sampleText);

    // Rozpoczęcie generowania i natychmiastowa weryfikacja stanu ładowania
    const generatePromise = generatePage.generate();

    // Weryfikacja czy przycisk i pole tekstowe są zablokowane
    await expect(generatePage.generateButton).toBeDisabled();
    await expect(generatePage.sourceTextArea).toBeDisabled();

    // Weryfikacja czy skeleton jest wyświetlany
    const skeleton = generatePage.page.locator('[data-test-id="generation-skeleton"]');
    await expect(skeleton).toBeVisible();

    // Czekamy na zakończenie generowania
    await generatePromise;
  });
});
