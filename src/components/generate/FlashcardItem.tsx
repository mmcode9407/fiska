import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { LocalFlashcardProposal } from "./types";

interface FlashcardItemProps {
  flashcard: LocalFlashcardProposal;
  onToggleAccept: (id: string, accepted: boolean) => void;
  onEdit: (id: string, updates: { front?: string; back?: string }) => void;
}

const MAX_FRONT_LENGTH = 200;
const MAX_BACK_LENGTH = 500;

export function FlashcardItem({ flashcard, onToggleAccept, onEdit }: FlashcardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [front, setFront] = useState(flashcard.front);
  const [back, setBack] = useState(flashcard.back);

  const handleSave = () => {
    onEdit(flashcard.id, { front, back });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFront(flashcard.front);
    setBack(flashcard.back);
    setIsEditing(false);
  };

  const isValidLength = front.length <= MAX_FRONT_LENGTH && back.length <= MAX_BACK_LENGTH;
  const hasChanges = front !== flashcard.front || back !== flashcard.back;

  return (
    <Card className={`transition-all ${flashcard.accepted ? "border-primary" : ""}`}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`accept-${flashcard.id}`}
                  checked={flashcard.accepted}
                  onCheckedChange={(checked) => onToggleAccept(flashcard.id, checked as boolean)}
                />
                <Label htmlFor={`accept-${flashcard.id}`} className="text-sm cursor-pointer">
                  Zaakceptuj
                </Label>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor={`front-${flashcard.id}`} className="text-sm font-medium">
                Przód
              </Label>
              <Textarea
                id={`front-${flashcard.id}`}
                value={front}
                onChange={(e) => setFront(e.target.value)}
                disabled={!isEditing}
                maxLength={MAX_FRONT_LENGTH}
                className="resize-none"
                rows={2}
              />
              {isEditing && (
                <div className="text-xs text-muted-foreground text-right">
                  {front.length}/{MAX_FRONT_LENGTH}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor={`back-${flashcard.id}`} className="text-sm font-medium">
              Tył
            </Label>
            <Textarea
              id={`back-${flashcard.id}`}
              value={back}
              onChange={(e) => setBack(e.target.value)}
              disabled={!isEditing}
              maxLength={MAX_BACK_LENGTH}
              className="resize-none"
              rows={3}
            />
            {isEditing && (
              <div className="text-xs text-muted-foreground text-right">
                {back.length}/{MAX_BACK_LENGTH}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-end space-x-2">
        {isEditing ? (
          <>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Anuluj
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!isValidLength || !hasChanges}>
              Zapisz zmiany
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edytuj
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
