# API Endpoint Implementation Plan: POST /api/generations

## 1. Przegląd punktu końcowego

Endpoint służy do generowania propozycji fiszek (flashcards) na podstawie wprowadzonego tekstu przy użyciu zewnętrznej usługi AI. Jego głównym celem jest przyjęcie długiego tekstu (od 1000 do 10000 znaków), walidacja tej długości, przesłanie tekstu do zewnętrznego serwisu AI oraz zwrócenie wygenerowanych propozycji fiszek. Propozycje nie są zapisywane w bazie danych, dopóki użytkownik ich nie zatwierdzi.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** /api/generations
- **Parametry:**
  - **Wymagane:**
    - `source_text`: Tekst wejściowy o długości między 1000 a 10000 znaków.
  - **Opcjonalne:** Brak
- **Body Request:**
  - JSON o następującej strukturze:
    ```json
    {
      "source_text": "Your input text between 1000 and 10000 characters"
    }
    ```

## 3. Wykorzystywane typy DTO i Command Modele

- **GenerateFlashcardsCommand:**
  - Zawiera pole `source_text`, które przekazuje tekst do analizy przez usługę AI.
- **GenerationCreateResponseDTO:**
  - `generation_id`: Identyfikator generacji (number).
  - `flashcards_proposals`: Lista obiektów `FlashcardProposalDTO`, gdzie każdy obiekt ma:
    - `front`: Treść przednia fiszki,
    - `back`: Treść tylna fiszki,
    - `source`: Stała wartość "ai-full".
  - `generated_count`: Liczba wygenerowanych propozycji.

## 4. Szczegóły odpowiedzi

- **Sukces (200 OK lub 202 Accepted):**
  - Odpowiedź JSON zawiera tablicę obiektów, gdzie każdy obiekt ma:
    ```json
    {
      "flashcard_proposals": [
        {
          "generation_id": 123,
          "flashcards_proposals": [{ "front": "Generated Question", "back": "Generated Answer", "source": "ai-full" }],
          "generated_count": 5
        }
      ]
    }
    ```
- **Kody statusu:**
  - **200 OK / 202 Accepted:** Sukces operacji (w zależności od sposobu obsługi asynchronicznej).
  - **400 Bad Request:** Nieprawidłowe dane wejściowe (np. nieodpowiednia długość tekstu).
  - **401 Unauthorized:** Użytkownik nie jest uwierzytelniony.
  - **422 Unprocessable Entity:** Dane wejściowe strukturalnie poprawne, lecz nie spełniające zasad biznesowych.
  - **500 Internal Server Error:** Błąd po stronie serwera, w tym błędy komunikacji z usługą AI (dodatkowo logowane w tabeli `generation_error_logs`).

## 5. Przepływ danych

1. **Przyjęcie żądania:** Użytkownik wysyła POST z `source_text` do `/api/generations`.
2. **Walidacja:**
   - Wstępna walidacja danych przy użyciu `zod` – sprawdzenie, czy `source_text` mieści się w wymaganej długości.
3. **Przetwarzanie:**
   - Po pozytywnej walidacji dane są przekazywane do funkcji serwisowej odpowiedzialnej za komunikację z zewnętrznym serwisem AI.
   - Usługa AI przetwarza `source_text` i zapisuje metadane generacji w tabeli `generations` (m.in. `model`, `generated_count`, `source_text_hash`, `source_text_length`, `generation_duration`).
   - Zwraca propozycję fiszek do użytkownika.
4. **Generowanie odpowiedzi:**
   - Wyniki (propozycje fiszek) są opakowywane w strukturę `GenerationCreateResponseDTO` wraz z przypisanym `generation_id` oraz liczbą wygenerowanych propozycji (`generated_count`).
5. **Odesłanie wyniku:** Endpoint zwraca przygotowaną odpowiedź JSON.
6. **Logowanie błędów:** W przypadku wystąpienia błędów związanych z usługą AI lub innymi problemami, szczegóły błędów są zapisywane w tabeli `generation_error_logs`.

## 6. Względy bezpieczeństwa

- **Uwierzytelnianie i autoryzacja:**
  - Użycie Supabase Auth. Tylko autoryzowani użytkownicy mogą inicjować generowanie fiszek.
- **Walidacja danych wejściowych:**
  - Implementacja walidacji `source_text` przy użyciu `zod`, ograniczenie długości tekstu.
- **Zapobieganie nadużyciom:**
  - Rate limiting oraz zabezpieczenia przed atakami typu brute-force.
- **Bezpieczne logowanie:**
  - Rejestrowanie błędów w tabeli `generation_error_logs` przy zachowaniu poufności danych.

## 7. Obsługa błędów

- **Błędne dane wejściowe (400 Bad Request):**
  - Zgłoszenie błędu, gdy `source_text` jest krótszy niż 1000 znaków lub dłuższy niż 10000 znaków.
- **Nieautoryzowany dostęp (401 Unauthorized):**
  - Odrzucenie żądania, gdy użytkownik nie jest poprawnie uwierzytelniony.
- **Błąd przetwarzania danych (422 Unprocessable Entity):**
  - Gdy struktura danych jest poprawna, ale logika biznesowa nie pozwala na dalsze przetwarzanie.
- **Błędy zewnętrznej usługi AI (500 Internal Server Error):**
  - Problemy z komunikacją lub nieoczekiwane wyjątki podczas wywoływania zewnętrznego API, przy czym każdy taki błąd powinien być logowany w `generation_error_logs`.

## 8. Rozważania dotyczące wydajności

- **Przetwarzanie asynchroniczne:**
  - Rozważenie wprowadzenia trybu asynchronicznego (202 Accepted), gdy usługa AI przetwarza dane dłużej.
- **Timeout dla wywołania AI**
  - 60 sekund na czas oczekiwania, w przeciwnym razie błąd timeout.
- **Caching:**
  - Możliwość cachowania wyników, szczególnie przy identycznych lub podobnych zapytaniach, aby zmniejszyć obciążenie usługi AI.
- **Rate Limiting:**
  - Ograniczenie częstotliwości wywołań endpointu, aby zapobiegać przeciążeniu systemu.
- **Monitoring i skalowanie:**
  - Wdrożenie mechanizmów monitorujących wydajność endpointu oraz analizy obciążenia, co umożliwi odpowiednie skalowanie aplikacji.

## 9. Etapy wdrożenia

1. **Konfiguracja środowiska:**

   - Utworzenie pliku endpointu w katalogu `src/pages/api` jako plik dla POST `/generations.ts`.

2. **Implementacja walidacji:**

   - Stworzenie schematu walidacji przy użyciu `zod` dla `source_text`.
   - Dokładne sprawdzenie długości tekstu (1000 - 10000 znaków).

3. **Integracja z usługą AI:**

   - Opracowanie lub zaktualizowanie istniejącej funkcji serwisowej w `src/lib/generation.service` do wywoływania zewnętrznego API AI.
   - Obsługa timeoutów oraz poprawne przekazywanie błędów z serwisu AI.

4. **Implementacja logiki biznesowej:**

   - Przekazanie zwalidowanego `source_text` do serwisu AI i zebranie rezultatów.
   - Utworzenie odpowiedniej odpowiedzi zgodnej ze strukturą `GenerationCreateResponseDTO`.

5. **Rejestracja błędów:**
   - Implementacja mechanizmu logowania błędów (np. przy niepowodzeniu komunikacji z usługą AI) w tabeli `generation_error_logs`.
   - Zapewnienie, że logowanie nie ujawnia poufnych danych.
