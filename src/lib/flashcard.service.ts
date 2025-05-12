import type { SupabaseClient } from "../db/supabase.client";
import type { CreateFlashcardDTO, FlashcardDTO, GetFlashcardsResponseDTO } from "../types";

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

  /**
   * Pobiera wszystkie fiszki użytkownika
   * @returns Obiekt zawierający wszystkie fiszki użytkownika
   */
  async getFlashcards(): Promise<GetFlashcardsResponseDTO> {
    // Pobranie łącznej liczby fiszek dla użytkownika
    const { count, error: countError } = await this.supabase
      .from("flashcards")
      .select("*", { count: "exact", head: true })
      .eq("user_id", this.userId);

    if (countError) {
      throw new Error(`Błąd podczas liczenia fiszek: ${countError.message}`);
    }

    // Pobranie wszystkich fiszek użytkownika (domyślnie posortowane według najnowszych)
    const { data, error } = await this.supabase
      .from("flashcards")
      .select("id, front, back, source, generation_id, created_at, updated_at")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Błąd podczas pobierania fiszek: ${error.message}`);
    }

    return {
      data: data as FlashcardDTO[],
      pagination: {
        page: 1,
        limit: count || 0,
        total: count || 0,
      },
    };
  }
}
