import { useState } from "react";
import { GenerateForm } from "./GenerateForm";
import { GenerationSkeleton } from "./GenerationSkeleton";
import { FlashcardList } from "./FlashcardList";
import { SaveButtons } from "./SaveButtons";
import { toast } from "sonner";
import type { GenerationCreateResponseDTO } from "@/types";
import type { LocalFlashcardProposal } from "./types";

export function GenerateView() {
  const [sourceText, setSourceText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<LocalFlashcardProposal[]>([]);
  const [generationId, setGenerationId] = useState<number | null>(null);

  const clearState = () => {
    setSourceText("");
    setFlashcards([]);
    setGenerationId(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!sourceText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source_text: sourceText }),
      });

      if (!response.ok) {
        throw new Error("Wystąpił błąd podczas generowania fiszek");
      }

      const data: GenerationCreateResponseDTO = await response.json();

      setGenerationId(data.generation_id);
      setFlashcards(
        data.flashcards_proposals.map((proposal, index) => ({
          ...proposal,
          id: `${data.generation_id}-${index}`,
          accepted: false,
          edited: false,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
      toast.error(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAccept = (id: string, accepted: boolean) => {
    setFlashcards((cards) =>
      cards.map((card) =>
        card.id === id
          ? {
              ...card,
              accepted,
            }
          : card
      )
    );
  };

  const handleEdit = (id: string, updates: { front?: string; back?: string }) => {
    setFlashcards((cards) =>
      cards.map((card) =>
        card.id === id
          ? {
              ...card,
              ...updates,
              edited: true,
              source: "ai-edited",
            }
          : card
      )
    );
  };

  return (
    <div className="space-y-8">
      {error && <div className="p-4 bg-destructive/15 text-destructive rounded-md">{error}</div>}

      <GenerateForm
        sourceText={sourceText}
        onSourceTextChange={setSourceText}
        onGenerate={handleGenerate}
        disabled={isLoading}
      />

      {isLoading && <GenerationSkeleton />}

      {flashcards.length > 0 && (
        <div className="space-y-4">
          <>
            {generationId && (
              <SaveButtons
                flashcards={flashcards}
                generationId={generationId}
                onSuccess={clearState}
                disabled={isLoading}
              />
            )}

            <FlashcardList flashcards={flashcards} onToggleAccept={handleToggleAccept} onEdit={handleEdit} />
          </>
        </div>
      )}
    </div>
  );
}
