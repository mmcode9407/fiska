import { FlashcardItem } from "./FlashcardItem";
import type { LocalFlashcardProposal } from "./types";

interface FlashcardListProps {
  flashcards: LocalFlashcardProposal[];
  onToggleAccept: (id: string, accepted: boolean) => void;
  onEdit: (id: string, updates: { front?: string; back?: string }) => void;
}

export function FlashcardList({ flashcards, onToggleAccept, onEdit }: FlashcardListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Wygenerowane fiszki ({flashcards.length})</h2>
      <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcards.map((flashcard) => (
          <FlashcardItem key={flashcard.id} flashcard={flashcard} onToggleAccept={onToggleAccept} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
}
