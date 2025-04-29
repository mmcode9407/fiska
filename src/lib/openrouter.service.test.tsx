import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { OpenRouterService } from "./openrouter.service";
import type { ResponseData } from "./openrouter.types";

// Mockowanie import.meta.env przed importem serwisu
vi.stubEnv("OPENROUTER_API_KEY", "test-api-key");

// Mockujemy globalny fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("OpenRouterService - logika retry", () => {
  let openRouterService: OpenRouterService;

  // Przykładowa poprawna odpowiedź
  const mockSuccessResponse: ResponseData = {
    choices: [
      {
        message: {
          content: "Przykładowa odpowiedź",
          role: "assistant",
        },
        finish_reason: "stop",
      },
    ],
    model: "test-model",
    created: 1627984000,
  };

  beforeEach(() => {
    // Inicjalizacja serwisu przed każdym testem
    openRouterService = new OpenRouterService();

    // Resetujemy mocks
    vi.clearAllMocks();

    // Konfigurujemy fałszywe timery
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Przywracamy rzeczywiste timery po każdym teście
    vi.useRealTimers();
  });

  it("powinien ponowić próbę wysłania żądania po otrzymaniu błędu 429", async () => {
    // Arrange
    // Najpierw zwróć błąd 429 (limit przekroczony), potem poprawną odpowiedź
    mockFetch.mockRejectedValueOnce(new Error("HTTP error! status: 429")).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    });

    // Act
    const responsePromise = openRouterService.sendMessage(
      "system message",
      "user message",
      { type: "json_object" },
      "test-model"
    );

    // Advance timers to trigger the retry logic (1000ms * 2^0 = 1000ms)
    await vi.advanceTimersByTimeAsync(1000);

    const response = await responsePromise;

    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(response).toEqual(mockSuccessResponse);
  });

  it("powinien używać wykładniczego opóźnienia między próbami", async () => {
    // Arrange
    // Symulujemy dwa błędy 429, a potem sukces przy trzeciej próbie
    mockFetch
      .mockRejectedValueOnce(new Error("HTTP error! status: 429"))
      .mockRejectedValueOnce(new Error("HTTP error! status: 429"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

    // Act
    const responsePromise = openRouterService.sendMessage(
      "system message",
      "user message",
      { type: "json_object" },
      "test-model"
    );

    // Advance timers for first retry (1000ms * 2^0 = 1000ms)
    await vi.advanceTimersByTimeAsync(1000);

    // Advance timers for second retry (1000ms * 2^1 = 2000ms)
    await vi.advanceTimersByTimeAsync(2000);

    const response = await responsePromise;

    // Assert
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(response).toEqual(mockSuccessResponse);
  });

  it("powinien rzucić odpowiedni błąd po wyczerpaniu liczby prób", async () => {
    // Arrange
    mockFetch
      .mockRejectedValueOnce(new Error("HTTP error! status: 429"))
      .mockRejectedValueOnce(new Error("HTTP error! status: 429"))
      .mockRejectedValueOnce(new Error("HTTP error! status: 429"));

    // Act
    const promise = openRouterService.sendMessage(
      "system message",
      "user message",
      { type: "json_object" },
      "test-model"
    );

    // 1) od razu ustawiamy .rejects żeby podłączyć catch
    const rejectionAssertion = expect(promise).rejects.toThrowError(
      "Przekroczono limit zapytań - spróbuj ponownie później"
    );

    // 2) dopiero teraz przesuwamy timery
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(2000);

    // 3) czekamy na asercję
    await rejectionAssertion;

    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
});
