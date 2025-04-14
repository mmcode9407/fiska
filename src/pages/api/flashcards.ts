import { z } from "zod";
import type { APIRoute } from "astro";
import type { CreateFlashcardCommand } from "../../types";
import { FlashcardService } from "../../lib/flashcard.service";

export const prerender = false;

// Schemat walidacji dla pojedynczej fiszki
const createFlashcardSchema = z
  .object({
    front: z.string().max(200, "Pytanie nie może przekraczać 200 znaków"),
    back: z.string().max(500, "Odpowiedź nie może przekraczać 500 znaków"),
    source: z.enum(["manual", "ai-full", "ai-edited"], {
      errorMap: () => ({ message: "Źródło musi być jednym z: manual, ai-full, ai-edited" }),
    }),
    generation_id: z.union([z.number().positive(), z.null()]),
  })
  .refine(
    (flashcard) => {
      // Dla manual generation_id musi być null
      if (flashcard.source === "manual") {
        return flashcard.generation_id === null;
      }
      // Dla ai-full lub ai-edited generation_id musi być liczbą
      return flashcard.generation_id !== null;
    },
    {
      message: "Dla fiszek AI wymagane jest podanie generation_id, dla fiszek manualnych generation_id musi być null",
      path: ["generation_id"], // ścieżka do pola, którego dotyczy błąd
    }
  );

// Schemat walidacji dla całego żądania
const createFlashcardsCommandSchema = z.object({
  flashcards: z.array(createFlashcardSchema).min(1, "Należy podać co najmniej jedną fiszkę"),
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Parsowanie body
    const body = (await request.json()) as CreateFlashcardCommand;

    // Walidacja struktury danych
    const validationResult = createFlashcardsCommandSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Błąd walidacji",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Zapis fiszek do bazy danych
    const flashcardService = new FlashcardService(locals.supabase);
    const createdFlashcards = await flashcardService.createFlashcards(validationResult.data.flashcards);

    return new Response(JSON.stringify({ flashcards: createdFlashcards }), {
      status: 201, // Created
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd w endpoincie /api/flashcards:", error);

    return new Response(JSON.stringify({ error: "Błąd wewnętrzny serwera" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
