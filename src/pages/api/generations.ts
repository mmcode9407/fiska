import { z } from "zod";
import type { APIRoute } from "astro";
import type { GenerateFlashcardsCommand } from "../../types";

import { GenerationService } from "../../lib/generation.service";

export const prerender = false;

// Schema walidacji dla danych wejściowych
const generateFlashcardsSchema = z.object({
  source_text: z
    .string()
    .min(1000, "Tekst musi mieć co najmniej 1000 znaków")
    .max(10000, "Tekst nie może przekraczać 10000 znaków"),
});

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Sprawdzenie czy użytkownik jest zalogowany
    if (!locals.user?.id) {
      return new Response(
        JSON.stringify({
          error: "Nieautoryzowany dostęp",
          details: "Musisz być zalogowany, aby generować fiszki",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = (await request.json()) as GenerateFlashcardsCommand;

    // Walidacja source_text
    const validationResult = generateFlashcardsSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Validation Error",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const generationService = new GenerationService(locals.supabase, locals.user.id);
    const response = await generationService.generateFlashcards(body.source_text);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generations endpoint:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
