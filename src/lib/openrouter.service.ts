import type { ModelParameters, ResponseData } from "./openrouter.types";
import { responseSchema } from "./openrouter.types";

// Klasa serwisu OpenRouter
export class OpenRouterService {
  private readonly apiEndpoint: string;
  private readonly apiKey: string;
  private defaultModelParams: ModelParameters;
  private retryAttempts = 3;
  private retryDelay = 1000;

  constructor() {
    // Pobieranie konfiguracji ze zmiennych środowiskowych
    this.apiEndpoint = "https://openrouter.ai/api/v1/chat/completions";
    this.apiKey = import.meta.env.OPENROUTER_API_KEY;

    if (!this.apiEndpoint || !this.apiKey) {
      throw new Error("Brak wymaganych zmiennych środowiskowych dla OpenRouter API");
    }

    // Inicjalizacja domyślnych parametrów modelu
    this.defaultModelParams = {
      parameter: 1.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };
  }

  // Metoda do wysyłania wiadomości do API
  public async sendMessage(
    systemMsg: string,
    userMsg: string,
    responseFormat: object,
    model: string,
    modelParams?: ModelParameters
  ): Promise<ResponseData> {
    const payload = this._prepareRequestPayload(systemMsg, userMsg, responseFormat, model, modelParams);
    return this._sendRequest(payload);
  }

  // Metoda do aktualizacji parametrów modelu
  public setModelParameters(params: ModelParameters): void {
    this.defaultModelParams = {
      ...this.defaultModelParams,
      ...params,
    };
  }

  // Prywatna metoda do wysyłania żądania z obsługą ponownych prób
  private async _sendRequest(payload: object): Promise<ResponseData> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const response = await fetch(this.apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}, body: ${response.statusText}`);
        }

        const data = await response.json();

        return this._validateResponse(data);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < this.retryAttempts - 1) {
          const delay = this.retryDelay * Math.pow(2, attempt);

          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }
    }

    throw this._handleError(lastError || new Error("Nieznany błąd podczas wysyłania żądania"));
  }

  // Prywatna metoda do przygotowania payloadu żądania
  private _prepareRequestPayload(
    systemMsg: string,
    userMsg: string,
    responseFormat: object,
    model: string,
    modelParams?: ModelParameters
  ): object {
    return {
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: userMsg },
      ],
      model,
      response_format: responseFormat,
      ...(modelParams || this.defaultModelParams),
    };
  }

  // Prywatna metoda do walidacji odpowiedzi
  private _validateResponse(response: unknown): ResponseData {
    const validatedResponse = responseSchema.safeParse(response);
    if (!validatedResponse.success) {
      throw new Error(`Nieprawidłowy format odpowiedzi z API: ${JSON.stringify(validatedResponse.error.errors)}`);
    }
    return validatedResponse.data;
  }

  // Prywatna metoda do obsługi błędów
  private _handleError(error: Error): Error {
    // Mapowanie błędów na bardziej przyjazne komunikaty
    if (error.message.includes("401")) {
      return new Error("Błąd autoryzacji - sprawdź klucz API");
    }
    if (error.message.includes("429")) {
      return new Error("Przekroczono limit zapytań - spróbuj ponownie później");
    }
    if (error.message.includes("5")) {
      return new Error("Błąd serwera - spróbuj ponownie później");
    }

    return error;
  }
}
