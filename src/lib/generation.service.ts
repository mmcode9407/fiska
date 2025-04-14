import type { SupabaseClient } from "../db/supabase.client";
import type { FlashcardProposalDTO, GenerationCreateResponseDTO } from "../types";
import crypto from "crypto";
import { DEFAULT_USER_ID } from "../db/supabase.client";

export class GenerationService {
  constructor(private readonly supabase: SupabaseClient) {}

  async generateFlashcards(sourceText: string): Promise<GenerationCreateResponseDTO> {
    const startTime = Date.now();

    try {
      // Symulacja generowania fiszek przez AI
      const flashcardsProposals = await this.callAIService(sourceText);

      // Generuj hash tekstu
      const hashedText = this.generateHash(sourceText);

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
        hashedText: this.generateHash(sourceText),
        sourceTextLength: sourceText.length,
      });

      throw error;
    }
  }

  private generateHash(text: string): string {
    return crypto.createHash("md5").update(text).digest("hex");
  }

  private async callAIService(text: string): Promise<FlashcardProposalDTO[]> {
    // Symulacja opóźnienia odpowiedzi z serwisu AI
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock wygenerowanych fiszek
    return Array.from({ length: 3 }, (_, index) => ({
      front: `Front ${index + 1} (text length: ${text.length})`,
      back: `Back ${index + 1}`,
      source: "ai-full",
    }));
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
        user_id: DEFAULT_USER_ID,
        model: "mock-model-v1",
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
      user_id: DEFAULT_USER_ID,
      model: "mock-model-v1",
      error_code: error instanceof Error ? error.name : "Unknown error",
      error_message: error instanceof Error ? error.message : String(error),
      source_text_hash: data.hashedText,
      source_text_length: data.sourceTextLength,
    });
  }
}
