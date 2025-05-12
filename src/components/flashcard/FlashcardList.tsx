import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { GetFlashcardsResponseDTO } from "@/types";

interface FlashcardListProps {
  initialData: GetFlashcardsResponseDTO;
}

export function FlashcardList({ initialData }: FlashcardListProps) {
  const [data, setData] = useState<GetFlashcardsResponseDTO>(initialData);

  // Aktualizuj dane, gdy zmienią się dane początkowe
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Funkcja do formatowania daty
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pl-PL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Twoje fiszki ({data.pagination.total})</h2>
      </div>

      <Card>
        <CardContent className="p-4">
          {data.data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nie masz jeszcze żadnych fiszek. Stwórz pierwsze fiszki w sekcji &quot;Generuj fiszki&quot;.
            </div>
          ) : (
            <div className="grid gap-4">
              {data.data.map((flashcard) => (
                <div key={flashcard.id} className="border rounded-md p-4 hover:bg-gray-50">
                  <div className="mb-2">
                    <span className="font-medium">Przód: </span>
                    {flashcard.front}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Tył: </span>
                    {flashcard.back}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      Źródło:{" "}
                      {flashcard.source === "manual"
                        ? "Ręczne"
                        : flashcard.source === "ai-full"
                          ? "AI"
                          : "AI (edytowane)"}
                    </span>
                    <span>{formatDate(flashcard.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
