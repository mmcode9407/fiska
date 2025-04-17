import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface GenerateFormProps {
  sourceText: string;
  onSourceTextChange: (value: string) => void;
  onGenerate: () => void;
  disabled?: boolean;
}

export function GenerateForm({ sourceText, onSourceTextChange, onGenerate, disabled }: GenerateFormProps) {
  const charCount = sourceText.length;
  const isValid = charCount >= 1000 && charCount <= 10000;
  const showError = charCount > 0 && !isValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onGenerate();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="source-text">Tekst źródłowy</Label>
        <Textarea
          id="source-text"
          value={sourceText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onSourceTextChange(e.target.value)}
          placeholder="Wklej tutaj tekst do wygenerowania fiszek (1000-10000 znaków)..."
          className="min-h-[200px] max-h-[400px]"
          disabled={disabled}
        />

        {showError && <p className="text-sm text-destructive">Tekst musi mieć od 1000 do 10000 znaków</p>}

        <p className="text-sm text-muted-foreground">Liczba znaków: {charCount}</p>
      </div>

      <Button type="submit" disabled={disabled || !isValid}>
        {disabled ? "Generowanie..." : "Generuj fiszki"}
      </Button>
    </form>
  );
}
