# API Endpoint Implementation Plan: POST /api/flashcards

## 1. Przegląd punktu końcowego

Endpoint umożliwia tworzenie jednego lub wielu flashcardów, zarówno manualnie, jak i generowanych przez AI. Dla flashcardów generowanych przez AI wymagane jest podanie `generation_id`, podczas gdy dla flashcardów manualnych musi ono być null.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **URL:** /api/flashcards
- **Parametry:**
  - **Wymagane:** Obiekt JSON zawierający pole `flashcards`, będące tablicą obiektów.
  - **Opcjonalne:** Brak dodatkowych parametrów.
- **Struktura Request Body:**
  ```json
  {
    "flashcards": [
      {
        "front": "Question 1",
        "back": "Answer 1",
        "source": "manual",
        "generation_id": null
      },
      {
        "front": "Question 2",
        "back": "Answer 2",
        "source": "ai-full",
        "generation_id": 123
      }
    ]
  }
  ```
- **Walidacje:**
  - `front` - maksymalnie 200 znaków.
  - `back` - maksymalnie 500 znaków.
  - `source` musi mieć wartość: `manual`, `ai-full`, lub `ai-edited`.
  - Dla `ai-full` i `ai-edited` – `generation_id` musi być wartością liczbową.
  - Dla `manual` – `generation_id` musi być równe null.

## 3. Wykorzystywane typy

- **CreateFlashcardDTO:** Reprezentuje pojedynczy flashcard do utworzenia, zawiera pola `front`, `back`, `source`, `generation_id`.
- **CreateFlashcardCommand:** Obiekt zawierający tablicę flashcardów do utworzenia.
- **FlashcardDTO:** Typ danych zwracany w odpowiedzi, zawiera m.in. `id`, `front`, `back`, `source`.

## 4. Szczegóły odpowiedzi

- **Sukces:**
  - **Kod statusu:** 201 Created.
  - **Treść odpowiedzi:** JSON zawierający tablicę utworzonych flashcardów, np.:
    ```json
    {
      "flashcards": [
        { "id": 1, "front": "Question 1", "back": "Answer 1", "source": "manual" },
        { "id": 2, "front": "Question 2", "back": "Answer 2", "source": "ai-full" }
      ]
    }
    ```
- **Błędy:**
  - **400 Bad Request:** Niezgodność danych wejściowych (np. nieprawidłowa długość pól, niepoprawna wartość `source`, błędna wartość `generation_id`).
  - **401 Unauthorized:** Użytkownik nie jest zalogowany lub nie ma odpowiednich uprawnień.
  - **500 Internal Server Error:** Błąd po stronie serwera lub problem z bazą danych.

## 5. Przepływ danych

1. Klient wysyła żądanie POST do /api/flashcards z danymi flashcardów.
2. Na serwerze następuje:
   - Weryfikacja autentyczności użytkownika przy użyciu Supabase Auth.
   - Walidacja danych wejściowych (użycie Zod).
   - Przekazanie danych do logiki biznesowej (FlashcardService):
     - Sprawdzenie poprawności zależności między polami (`generation_id` a `source`).
     - Obsługa operacji masowego wstawiania (batch insert) w bazie danych.
3. Po udanej operacji:
   - Wygenerowane flashcardy są pobierane z bazy, a ich dane (np. `id`) są zwracane klientowi.
4. W przypadku błędu wykonywana jest odpowiednia obsługa (logowanie błędu, odpowiedź z kodem 400 lub 500).

## 6. Względy bezpieczeństwa

- **Uwierzytelnienie:** Endpoint musi być dostępny tylko dla uwierzytelnionych użytkowników. Należy wykorzystać Supabase Auth.
- **Autoryzacja:** Upewnić się, że użytkownik ma prawo tworzenia flashcardów.
- **Walidacja danych:** Dokładna walidacja wejścia aby uniknąć wstrzyknięć kodu lub SQL.

## 7. Obsługa błędów

- **Błędy walidacji:** W przypadku niepoprawnych danych wejściowych zwrócić kod 400 z opisem błędów.
- **Błąd autentykacji:** Gdy użytkownik nie jest zalogowany, zwrócić 401 Unauthorized.
- **Błędy bazy danych:** W razie problemów z zapisem lub innymi błędami serwera, zwrócić 500 Internal Server Error.

## 8. Rozważania dotyczące wydajności

- **Batch Insert:** Możliwość przetwarzania wielu flashcardów jednocześnie zamiast pojedynczych operacji.

## 9. Etapy wdrożenia

1. **Utworzenie endpointa:**
   - Założenie nowego pliku `/src/pages/api/flashcards.ts`.
2. **Implementacja uwierzytelnienia:**
   - Weryfikacja tokenu użytkownika przy użyciu Supabase Auth.
3. **Walidacja danych wejściowych:**
   - Stworzenie schematu walidacji za pomocą Zod (lub odpowiedniego narzędzia) dla struktury `CreateFlashcardCommand` i `CreateFlashcardDTO`.
4. **Wyodrębnienie logiki biznesowej:**
   - Utworzenie serwisu (np. `FlashcardService` w `/src/lib/services/`) odpowiedzialnego za operacje na flashcardach.
5. **Integracja z bazą danych:**
   - Implementacja funkcjonalności zapisu flashcardów w bazie danych, uwzględniając relację z tabelą `users` oraz warunki dotyczące `generation_id`.
6. **Budowa odpowiedzi API:**
   - Przy udanym zapisie zwrócenie danych flashcardów z wygenerowanymi identyfikatorami i statusem 201.
7. **Obsługa błędów:**
   - Implementacja mechanizmu przechwytywania błędów walidacji, autentyczności oraz błędów bazy (z odpowiednimi kodami 400, 401 lub 500).
