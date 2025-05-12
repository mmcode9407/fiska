import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FlashcardList } from "./FlashcardList";
import type { GetFlashcardsResponseDTO } from "@/types";

export function FlashcardView() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<GetFlashcardsResponseDTO>({
    data: [],
    pagination: {
      page: 1,
      limit: 0,
      total: 0,
    },
  });

  // Pobieranie danych
  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/flashcards");

      if (!response.ok) {
        throw new Error("Wystąpił błąd podczas pobierania fiszek");
      }

      const data: GetFlashcardsResponseDTO = await response.json();
      setFlashcards(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Wystąpił nieznany błąd";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8" data-test-id="flashcards-view">
      {error && (
        <div className="p-4 bg-destructive/15 text-destructive rounded-md" data-test-id="flashcards-error">
          {error}
        </div>
      )}

      <h2 className="text-3xl font-bold mb-8">Moje fiszki</h2>

      {isLoading && flashcards.data.length === 0 ? (
        <div className="text-center py-10">Ładowanie fiszek...</div>
      ) : (
        <FlashcardList initialData={flashcards} />
      )}
    </div>
  );
}
