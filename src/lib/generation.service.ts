import type { SupabaseClient } from "../db/supabase.client";
import type { FlashcardProposalDTO, GenerationCreateResponseDTO } from "../types";
import { OpenRouterService } from "./openrouter.service";

export class GenerationService {
  private readonly openRouter: OpenRouterService;
  private readonly model: string = "meta-llama/llama-4-maverick:free";

  constructor(
    private readonly supabase: SupabaseClient,
    private readonly userId: string,
    openRouterApiKey: string
  ) {
    this.openRouter = new OpenRouterService(openRouterApiKey);
  }

  async generateFlashcards(sourceText: string): Promise<GenerationCreateResponseDTO> {
    const startTime = Date.now();

    try {
      // Generowanie fiszek przez OpenRouter API
      const flashcardsProposals = await this.generateFlashcardsWithAI(sourceText);

      // Generuj hash tekstu
      const hashedText = await this.generateHash(sourceText);

      // Zapisz metadane generacji do bazy danych
      const generationId = await this.saveGenerationMetadata({
        hashedText,
        sourceTextLength: sourceText.length,
        generationDuration: Date.now() - startTime,
        generatedCount: flashcardsProposals.length,
      });

      return {
        generation_id: generationId,
        flashcards_proposals: flashcardsProposals,
        generated_count: flashcardsProposals.length,
      };
    } catch (error) {
      // W przypadku błędu, zapisz go do tabeli generation_error_logs
      await this.logGenerationError(error, {
        hashedText: await this.generateHash(sourceText),
        sourceTextLength: sourceText.length,
      });

      throw error;
    }
  }

  private async generateHash(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }

  private async generateFlashcardsWithAI(text: string): Promise<FlashcardProposalDTO[]> {
    const systemMessage = `Jesteś ekspertem w tworzeniu fiszek edukacyjnych. 
    Przeanalizuj podany tekst i stwórz z niego fiszki edukacyjne. 
    Każda fiszka powinna zawierać pytanie (front) i odpowiedź (back).
    Pytania powinny być zwięzłe i konkretne, a odpowiedzi jasne i precyzyjne.
    Nie twórz fiszek z definicjami, które są oczywiste lub zbyt proste.
    Skoncentruj się na najważniejszych koncepcjach i związkach między nimi.
    Zwróć tylko tablicę fiszek, bez dodatkowych komentarzy.`;

    const userMessage = `Wygeneruj fiszki z poddanego tekstu: ${text}`;

    const responseFormat = {
      type: "json_schema",
      json_schema: {
        name: "flashcards",
        strict: true,
        schema: {
          type: "object",
          properties: {
            flashcards: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  front: { type: "string" },
                  back: { type: "string" },
                },
                required: ["front", "back"],
              },
            },
          },
          required: ["flashcards"],
        },
      },
    };

    const response = await this.openRouter.sendMessage(systemMessage, userMessage, responseFormat, this.model, {
      parameter: 0.7,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    });

    try {
      const content = JSON.parse(response.choices[0].message.content);

      if (!content.flashcards || !Array.isArray(content.flashcards)) {
        throw new Error("Nieprawidłowy format odpowiedzi: brak tablicy flashcards");
      }

      return content.flashcards.map((card: { front: string; back: string }) => ({
        front: card.front,
        back: card.back,
        source: "ai-full" as const,
      }));
    } catch (error) {
      console.error("Error parsing AI response:", error);
      throw new Error("Nie udało się przetworzyć odpowiedzi z modelu AI");
    }
  }

  private async saveGenerationMetadata(data: {
    hashedText: string;
    sourceTextLength: number;
    generationDuration: number;
    generatedCount: number;
  }) {
    const { data: generation, error } = await this.supabase
      .from("generations")
      .insert({
        user_id: this.userId,
        model: this.model,
        source_text_hash: data.hashedText,
        source_text_length: data.sourceTextLength,
        generation_duration: data.generationDuration,
        generated_count: data.generatedCount,
      })
      .select("id")
      .single();

    if (error) {
      throw new Error(`Failed to create generation: ${error.message}`);
    }

    return generation.id;
  }

  private async logGenerationError(
    error: unknown,
    data: {
      hashedText: string;
      sourceTextLength: number;
    }
  ) {
    await this.supabase.from("generation_error_logs").insert({
      user_id: this.userId,
      model: this.model,
      error_code: error instanceof Error ? error.name : "Unknown error",
      error_message: error instanceof Error ? error.message : String(error),
      source_text_hash: data.hashedText,
      source_text_length: data.sourceTextLength,
    });
  }
}
