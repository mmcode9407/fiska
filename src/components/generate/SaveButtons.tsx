import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { CreateFlashcardDTO } from "@/types";
import type { LocalFlashcardProposal } from "./types";
import { useState } from "react";

interface SaveButtonsProps {
  flashcards: LocalFlashcardProposal[];
  generationId: number;
  onSuccess: () => void;
  disabled: boolean;
}

export function SaveButtons({ flashcards, generationId, onSuccess, disabled }: SaveButtonsProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveFlashcards = async (onlyAccepted = false) => {
    const cardsToSave = flashcards.filter((card) => !onlyAccepted || card.accepted);
    if (cardsToSave.length === 0) {
      toast.error("Nie wybrano żadnych fiszek do zapisania");
      return;
    }

    setIsSaving(true);
    try {
      const flashcardsToCreate: CreateFlashcardDTO[] = cardsToSave.map((card) => ({
        front: card.front,
        back: card.back,
        source: card.source,
        generation_id: generationId,
      }));

      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flashcards: flashcardsToCreate }),
      });

      if (!response.ok) {
        throw new Error("Wystąpił błąd podczas zapisywania fiszek");
      }

      toast.success("Fiszki zostały zapisane");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Wystąpił błąd podczas zapisywania fiszek");
    } finally {
      setIsSaving(false);
    }
  };

  const hasAcceptedFlashcards = flashcards.some((f) => f.accepted);

  return (
    <div className="flex gap-4">
      <Button onClick={() => handleSaveFlashcards(true)} disabled={isSaving || disabled || !hasAcceptedFlashcards}>
        {isSaving ? "Zapisywanie..." : "Zapisz wybrane"}
      </Button>
      <Button variant="outline" onClick={() => handleSaveFlashcards(false)} disabled={disabled || isSaving}>
        {isSaving ? "Zapisywanie..." : "Zapisz wszystkie"}
      </Button>
    </div>
  );
}
