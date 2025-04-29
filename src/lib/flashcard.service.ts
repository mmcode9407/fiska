import type { SupabaseClient } from "../db/supabase.client";
import type { CreateFlashcardDTO, FlashcardDTO } from "../types";

export class FlashcardService {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly userId: string
  ) {}

  /**
   * Tworzy wiele fiszek w bazie danych
   * @param flashcards Tablica obiektów CreateFlashcardDTO
   * @returns Tablica utworzonych fiszek
   */
  async createFlashcards(flashcards: CreateFlashcardDTO[]): Promise<FlashcardDTO[]> {
    // Przygotowanie danych do wstawienia do bazy
    const flashcardsToInsert = flashcards.map((flashcard) => ({
      ...flashcard,
      user_id: this.userId,
    }));

    // Batch insert - wstawienie wszystkich fiszek jednym zapytaniem
    const { data, error } = await this.supabase
      .from("flashcards")
      .insert(flashcardsToInsert)
      .select("id, front, back, source, generation_id, created_at, updated_at");

    if (error) {
      throw new Error(`Błąd podczas tworzenia fiszek: ${error.message}`);
    }

    return data as FlashcardDTO[];
  }
}
