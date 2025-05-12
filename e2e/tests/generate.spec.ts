import { test, expect } from "@playwright/test";
import { GeneratePage } from "../models/GeneratePage";

const sampleText =
  "Kryzys demokracji w latach 30. XX wieku przyczynił się do wybuchu II wojny światowej. Ideologia faszystowska opanowała nie tylko Niemcy, ale także Włochy. Natomiast w wielu innych państwach Europy, w tym m.in. Hiszpanii i Portugalii, zapanowały rządy autorytarne. Jednak do rozpoczęcia najkrwawszego w dziejach ludzkości konfliktu zbrojnego doprowadziły przede wszystkim imperialne ambicje Hitlera. Kanclerz Rzeszy po przejęciu władzy wielokrotnie łamał postanowienia traktatu wersalskiego z 1919 roku. Przywódca nazistowskich Niemiec przywrócił powszechny obowiązek służby wojskowej i znacznie zwiększył wydatki na wojsko, co doprowadziło m.in. do ponownej remilitaryzacji Nadrenii. Adolf Hitler nieustannie dążył też do aneksji Austrii, z której pochodził. Dopiął swego w marcu 1938 r. wbrew traktatowi pokojowemu kończącego I wojnę światową. Wydarzenie to znane jest jako Anschluss, czyli w wolnym tłumaczeniu „przyłączenie”.Kilka miesięcy później ekspansywna polityka III Rzeszy doprowadziła - zgodnie z porozumieniem zawartym w Monachium - do przyłączenia części terytoriów Czechosłowacji do Niemiec. W „pokojowy” sposób chciano również wymusić na Polsce włączenie Wolnego Miasta Gdańska do Rzeszy oraz przeprowadzenia eksterytorialnej autostrady i linii kolejowej przez Prusy Wschodnie. Żądania strony niemieckiej, mimo gwarancji dostępu do gdańskiego portu oraz uszanowania praw mniejszości polskiej, nie spotkały się z aprobatą rządu w Warszawie i były kilkukrotnie odrzucane. Efekt? Ultimatum niemieckie w marcu 1939 r., które Polska także odrzuciła.".trim();

test.describe("Generowanie fiszek", () => {
  let generatePage: GeneratePage;

  test.beforeEach(async ({ page }) => {
    generatePage = new GeneratePage(page);
    await generatePage.goto();
  });

  test("GEN-001: Pomyślne wygenerowanie fiszek dla tekstu o poprawnej długości", async () => {
    await generatePage.enterText(sampleText);
    await generatePage.generate();

    const flashcardsList = await generatePage.expectFlashcardsGenerated();

    await flashcardsList.expectAtLeastOneFlashcard();

    const flashcards = await flashcardsList.getAllFlashcards();
    for (const flashcard of flashcards) {
      await expect(flashcard.container).toBeVisible();

      await flashcard.expectAccepted(false);

      await expect(flashcard.frontTextarea).toBeDisabled();
      await expect(flashcard.backTextarea).toBeDisabled();

      await expect(flashcard.frontTextarea).not.toBeEmpty();
      await expect(flashcard.backTextarea).not.toBeEmpty();
    }

    const firstFlashcard = await flashcardsList.getFirstFlashcard();

    await firstFlashcard.editContent("Nowy przód fiszki", "Nowy tył fiszki");
    await firstFlashcard.saveChanges();

    await firstFlashcard.expectContent("Nowy przód fiszki", "Nowy tył fiszki");

    await firstFlashcard.accept();
    await firstFlashcard.expectAccepted(true);
  });

  test("GEN-001: Weryfikacja stanu ładowania podczas generowania", async () => {
    await generatePage.enterText(sampleText);

    const generatePromise = generatePage.generate();

    await expect(generatePage.generateButton).toBeDisabled();
    await expect(generatePage.sourceTextArea).toBeDisabled();

    const skeleton = generatePage.page.locator('[data-test-id="generation-skeleton"]');
    await expect(skeleton).toBeVisible();

    await generatePromise;
  });
});
