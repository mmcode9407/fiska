# Plan implementacji widoku "Generate"

## 1. Przegląd

Widok „Materiały dla AI / Fiszki AI” (ścieżka: /generate) ma na celu umożliwienie użytkownikowi wprowadzenia materiału tekstowego (zakres 1000-10000 znaków) i wywołania usługi AI, aby uzyskać propozycje fiszek. Następnie użytkownik może zrecenzować wygenerowane fiszki, edytować je i wybrać do zapisania. Widok wspiera także walidację danych (np. minimalna i maksymalna długość tekstu).

## 2. Routing widoku

Widok będzie dostępny pod ścieżką:  
• GET/POST „/generate” – główny punkt dostępu do widoku dla zalogowanych użytkowników. Po wejściu na stronę użytkownik zobaczy formularz wprowadzania treści do generacji fiszek.

## 3. Struktura komponentów

1. Layout widoku (komponent rodzic) – struktura przekazująca stan i funkcje do komponentów podrzędnych.
2. Komponent formularza do wprowadzania tekstu (Textarea z walidacją) + przycisk „Generuj”.
3. Komponent loadera (Skeleton) – wyświetlany podczas oczekiwania na wynik żądania.
4. Komponent listy wygenerowanych fiszek (lista komponentów kart z fiszkami).
5. Komponent pojedynczej fiszki (pozwala na edycję inline, przycisk „Usuń”, przycisk weryfikacji/akceptacji).
6. Komponent przycisków akcji (np. „Zapisz wszystkie”, „Zapisz wybrane”).
7. Komponent powiadomień (Toast) – do wyświetlania komunikatów o błędach lub powodzeniu operacji.

## 4. Szczegóły komponentów

### 4.1. Layout widoku

- Opis: Główny kontener widoku „/generate” zarządzający stanem i logiką.
- Główne elementy:  
  • Kontener layoutu z obszarem na formularz oraz listę fiszek.  
  • Sekcja stanu (np. manager stanu, hook) obsługująca dane z API.
- Obsługiwane interakcje:  
  • Wywołanie pobrania danych z API (generacje) i zapisu fiszek.  
  • Ustalanie widoczności loadera i obsługa błędów.
- Obsługiwana walidacja:  
  • Sprawdzanie, czy użytkownik jest zalogowany.  
  • Kontrola błędów możliwych z API.
- Typy:  
  • Dane widoku (tekst do generowania, lista wygenerowanych fiszek, itp.).  
  • Stan błędów i stan ładowania.
- Propsy:  
  • Brak dodatkowych, najczęściej jest to samodzielny widok (ew. propsy do layoutu głównego aplikacji).

### 4.2. Komponent formularza (Textarea + „Generuj”)

- Opis: Umożliwia wprowadzenie materiału do generacji.
- Główne elementy:  
  • `textarea` z walidacją długości onBlur.  
  • Przycisk „Generuj”, który wywołuje zapytanie POST `/api/generations`.  
  • Komunikat błędu wyświetlany pod polem, jeśli warunki nie są spełnione (np. zbyt krótki lub zbyt długi tekst).
- Obsługiwane interakcje:  
  • onBlur (walidacja tekstu), onClick przycisku „Generuj”.
- Obsługiwana walidacja:  
  • Tekst musi mieć co najmniej 1000 znaków i nie więcej niż 10000.
- Typy:  
  • { source_text: string } do wysłania w zapytaniu POST `/api/generations`.  
  • Błędy walidacji: { field: string; message: string }.
- Propsy:  
  • ewentualne callbacki do zewnętrznego stanu (np. setSourceText, handleGenerateClick).

### 4.3. Komponent loadera (Skeleton)

- Opis: Wyświetlany w miejsce listy fiszek, gdy trwa przetwarzanie.
- Główne elementy:  
  • Animowana grafika lub placeholder.
- Obsługiwane interakcje:  
  • Brak bezpośrednich interakcji użytkownika.
- Obsługiwana walidacja:  
  • Brak (nie dotyczy).
- Typy:  
  • Prosty komponent, bez propsów, poza ewentualnym „isLoading: boolean”.
- Propsy:  
  • isLoading (decyduje o renderowaniu skeletonu).

### 4.4. Komponent listy wygenerowanych fiszek

- Opis: Prezentacja kolekcji fiszek proponowanych przez AI.
- Główne elementy:  
  • Mapowanie po tablicy propozycji, renderowanie Komponentu Pojedynczej Fiszki.
- Obsługiwane interakcje:  
  • Możliwość zaznaczenia fiszek do zapisu, usunięcia wybranych itp.
- Obsługiwana walidacja:  
  • Brak bezpośredniej, walidacja dotyczy raczej poszczególnych fiszek.
- Typy:  
  • { flashcards_proposals: FlashcardProposalDTO[] } z backendu.
- Propsy:  
  • Tablica fiszek proponowanych do wyświetlenia.  
  • Callback do operacji na pojedynczej fiszce (update, delete).

### 4.5. Komponent pojedynczej fiszki (edycja inline)

- Opis: Rysuje pojedynczą fiszkę z polami front/back i akcjami edycyjnymi.
- Główne elementy:  
  • Pola do edycji front/back.  
  • Akcje „Usuń”, „Zaakceptuj” (lub definicja stanu typu zedytowanej fiszki).
- Obsługiwane interakcje:  
  • onChange – obsługa zmian w polach front/back.  
  • onClick – usuń lub zaakceptuj daną fiszkę.
- Obsługiwana walidacja:  
  • Maksymalna długość front (200) oraz back (500).
- Typy:  
  • { front: string; back: string; source: "ai-full" | "ai-edited" }, ewentualnie z additional generation_id.
- Propsy:  
  • Podstawowe dane fiszki (front, back, source, generation_id).  
  • Callback do rodzica („onUpdate”, „onDelete”).

### 4.6. Komponent przycisków akcji („Zapisz wszystkie” / „Zapisz wybrane”)

- Opis: Umożliwia jednoczesne zapisanie wszystkich lub wybranych fiszek do bazy.
- Główne elementy:  
  • Dwa przyciski, do zapisu masowego – np. saveAll i saveSelected.
- Obsługiwane interakcje:  
  • onClick – wysłanie żądania POST `/api/flashcards` z wybranymi lub wszystkimi fiszkami (source=„ai-full” lub „ai-edited”).
- Obsługiwana walidacja:  
  • Sprawdzenie, czy tablica fiszek nie jest pusta.  
  • Atrybut generation_id w przypadku „ai-full”/„ai-edited”.
- Typy:  
  • CreateFlashcardCommand – { flashcards: CreateFlashcardDTO[] }.
- Propsy:  
  • Informacja o tym, które fiszki zostały zaznaczone.  
  • Callback do API (np. handleSave).

### 4.7. Komponent powiadomień (Toast)

- Opis: Wyświetla komunikaty o stanie operacji (błędy, powodzenie).
- Główne elementy:  
  • Warstwa UI do pojawiających się alertów/komunikatów.
- Obsługiwane interakcje:  
  • Możliwość zamknięcia komunikatu.
- Obsługiwana walidacja:  
  • Brak (nie dotyczy).
- Typy:  
  • Komunikat: { message: string; type: "error" | "success" }.
- Propsy:  
  • Przekazywany obiekt z wiadomością do wyświetlenia.

## 5. Typy

1. FlashcardProposalDTO (zawarty w pliku types.ts)
   - front: string
   - back: string
   - source: "ai-full"
2. CreateFlashcardDTO
   - front: string (max 200)
   - back: string (max 500)
   - source: "manual" | "ai-full" | "ai-edited"
   - generation_id: number | null
3. CreateFlashcardCommand
   - flashcards: CreateFlashcardDTO[]
4. GenerateFlashcardsCommand
   - source_text: string (1000-10000)
5. GenerationCreateResponseDTO
   - generation_id: number
   - flashcards_proposals: FlashcardProposalDTO[]
   - generated_count: number

Dodatkowo w widoku możemy wprowadzić typy wspomagające, np. do stanu komponentu:  
• type LocalFlashcardProposal = { id: string; front: string; back: string; source: "ai-full" | "ai-edited"; selected: boolean; }

## 6. Zarządzanie stanem

- Logika kluczowa (tekst wejściowy, lista wygenerowanych fiszek, stan ładowania, błędy) może być obsługiwana przez useState lub useReducer.
- Można użyć customowego hooka (np. useFlashcardGeneration) do zarządzania zapytaniami POST `/api/generations` i tworzeniem fiszek `/api/flashcards`.
- Każda fiszka w stanie może mieć pola: front, back, source, generation_id, selected.

## 7. Integracja API

1. Wywołanie POST `/api/generations`
   - Payload: { source_text: string }
   - Oczekiwana odpowiedź: { generation_id, flashcard_proposals, generated_count }.
2. Wywołanie POST `/api/flashcards`
   - Payload: { flashcards: [ { front, back, source, generation_id }, ... ] }
   - Odpowiedź: { flashcards: [ ... ] }.

- Obsługa błędów (400, 401, 500) i wyświetlanie Toast.

## 8. Interakcje użytkownika

1. Użytkownik wpisuje tekst w textarea i klika „Generuj”.
2. Włącza się loader, a po zakończeniu AI zwraca listę propozycji.
3. Użytkownik może edytować poszczególne fiszki (inline).
4. Użytkownik może usunąć lub zaakceptować wybrane fiszki.
5. Po wybraniu fiszek klika „Zapisz wybrane” lub decyduje się na „Zapisz wszystkie”, co wywołuje POST `/api/flashcards`.
6. Aplikacja pokazuje Toast z komunikatem sukcesu lub błędu.
7. Po zapisaniu fiszek w bazie danych, user jest przenoszony na stronę `/my-flashcards`.

## 9. Warunki i walidacja

- Warunki minimalnej/maksymalnej długości tekstu do generowania.
- Brak możliwości kliknięcia „Generuj”, jeśli warunek długości nie jest spełniony.
- Walidacja front/back w fiszkach (max 200/500 znaków).
- Dla „ai-full”/„ai-edited” – generation_id musi być liczbą, dla „manual” – null.

## 10. Obsługa błędów

- Przy niemożności wywołania AI (500) – komunikat Toast o błędzie.
- Przy błędzie walidacji (400) – wyróżnienie pola i wyświetlenie odpowiedniego komunikatu.
- Przy błędzie autoryzacji (401) – przekierowanie do logowania lub wyświetlenie alertu.

## 11. Kroki implementacji

1. Utworzenie pliku widoku „/generate” z layoutem (Astro/React).
2. Zaimportowanie i zaimplementowanie komponentu formularza (obsługa walidacji i wywołania POST `/api/generations`).
3. Dodanie stanu i obsługi loadera (Skeleton) w trakcie generowania fiszek.
4. Stworzenie komponentu listy fiszek i komponentu pojedynczej fiszki (edycja inline).
5. Dodanie logiki do zaznaczania fiszek oraz przycisków akcji „Zapisz...”.
6. Implementacja wywołania POST `/api/flashcards” w reakcji na zatwierdzenie fiszek.
7. Dodanie komponentu Toast do informowania o sukcesie lub błędzie.
