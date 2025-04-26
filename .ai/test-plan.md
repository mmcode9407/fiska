# Plan Testów dla Projektu Fiska

**Wersja:** 1.0
**Data:** 2024-08-07
**Autor:** [Twoje Imię/Nazwisko], Doświadczony Inżynier QA

## 1. Wprowadzenie i Cele Testowania

### 1.1. Wprowadzenie

Niniejszy dokument opisuje strategię, zakres, zasoby i harmonogram testów dla aplikacji **Fiska**. Aplikacja Fiska umożliwia użytkownikom generowanie fiszek edukacyjnych z podanego tekstu źródłowego przy użyciu sztucznej inteligencji (za pośrednictwem OpenRouter API), a następnie zarządzanie nimi i zapisywanie ich w bazie danych (Supabase). Projekt jest zbudowany w oparciu o nowoczesny stos technologiczny: Astro, React, TypeScript, Tailwind CSS, Shadcn/ui, Supabase i OpenRouter.

### 1.2. Cele Testowania

Głównymi celami procesu testowania są:

- Zapewnienie wysokiej jakości i stabilności aplikacji Fiska.
- Weryfikacja, czy wszystkie funkcjonalności działają zgodnie z wymaganiami i specyfikacją (wynikającą z kodu).
- Identyfikacja i raportowanie defektów na wczesnym etapie rozwoju.
- Zapewnienie poprawnego działania integracji z usługami zewnętrznymi (Supabase, OpenRouter).
- Weryfikacja bezpieczeństwa aplikacji, w szczególności mechanizmów uwierzytelniania i autoryzacji.
- Ocena użyteczności i wydajności kluczowych funkcji.
- Zbudowanie zaufania do produktu przed jego wdrożeniem (lub dalszym rozwojem).

## 2. Zakres Testów

### 2.1. Funkcjonalności objęte testami:

- **Uwierzytelnianie Użytkownika:**
  - Logowanie (UI, API, walidacja, obsługa błędów).
  - Rejestracja (UI - _brak API w dostarczonym kodzie, testowanie UI ograniczone_).
  - Odzyskiwanie hasła (UI - _brak API w dostarczonym kodzie, testowanie UI ograniczone_).
  - Middleware autoryzacyjny (ochrona ścieżek, zarządzanie sesją, inicjalizacja klienta Supabase).
- **Generowanie Fiszek:**
  - Wprowadzanie tekstu źródłowego (UI, walidacja długości 1000-10000 znaków).
  - Proces generowania (API `/api/generations`, interakcja z `GenerationService` i `OpenRouterService`, obsługa retry).
  - Wyświetlanie propozycji fiszek (UI, `FlashcardList`, `FlashcardItem`).
  - Obsługa stanu ładowania (`GenerationSkeleton`) i błędów generowania (UI - `toast`, API).
  - Zapis metadanych generacji i logów błędów do Supabase (`GenerationService`).
- **Zarządzanie Wygenerowanymi Fiszkami:**
  - Akceptacja/odrzucenie propozycji fiszek (UI, `FlashcardItem`, zmiana stanu `accepted`).
  - Edycja treści fiszek (UI, `FlashcardItem`, walidacja długości front <= 200, back <= 500, zmiana statusu `source` na `ai-edited`, zapis zmian).
- **Zapisywanie Fiszek:**
  - Zapisywanie wybranych/wszystkich fiszek (UI, `SaveButtons`).
  - API `/api/flashcards` (walidacja Zod, w tym logika `source` vs `generation_id`, interakcja z `FlashcardService`).
  - Poprawność danych zapisywanych w bazie Supabase (tabela `flashcards`).
- **Interfejs Użytkownika (UI):**
  - Poprawność renderowania kluczowych komponentów (Astro, React z `client:` directives).
  - Responsywność podstawowych widoków (Logowanie, Generowanie).
  - Działanie komponentów UI biblioteki Shadcn/ui (przyciski, formularze, karty, powiadomienia `sonner`, itp.).
  - Użyteczność podstawowych przepływów użytkownika.
- **API:**
  - Poprawność działania endpointów (`/api/auth/login`, `/api/generations`, `/api/flashcards`).
  - Walidacja danych wejściowych zgodnie ze schematami Zod.
  - Obsługa błędów (w tym błędów z Supabase i OpenRouter) i odpowiednie statusy HTTP.
  - Format i struktura odpowiedzi JSON.
- **Konfiguracja i Środowisko:**
  - Poprawność odczytu zmiennych środowiskowych (`SUPABASE_URL`, `SUPABASE_KEY`, `OPENROUTER_API_KEY`).
  - Działanie middleware Supabase SSR (`createServerClient`).

### 2.2. Funkcjonalności wyłączone z testów (lub o niższym priorytecie):

- Testowanie logiki backendowej API dla rejestracji i odzyskiwania hasła (brak implementacji w dostarczonym kodzie).
- Dokładne testowanie wizualne "pixel-perfect" (chyba że zostaną dodane testy regresji wizualnej jako oddzielna inicjatywa).
- Testowanie funkcjonalności panelu administracyjnego Supabase.
- Zaawansowane testy penetracyjne (poza podstawową weryfikacją autoryzacji).
- Testy wydajnościowe pod dużym obciążeniem (poza podstawową weryfikacją czasu odpowiedzi dla kluczowych operacji jak generowanie).
- Testowanie nieużywanych wariantów/propów komponentów `ui/`.
- Testowanie strony powitalnej (`Welcome.astro`) poza podstawowym renderowaniem.

## 3. Typy Testów do Przeprowadzenia

- **Testy Jednostkowe (Unit Tests):**
  - **Cel:** Weryfikacja małych, izolowanych fragmentów kodu (funkcje, metody serwisów, proste komponenty React).
  - **Zakres:** Logika w serwisach (`FlashcardService`, `GenerationService`, `OpenRouterService` - z mockami Supabase/OpenRouter), funkcje pomocnicze (`utils.ts`), schematy walidacji Zod, logika pojedynczych komponentów React (np. walidacja w `FlashcardItem`).
  - **Narzędzia:** Vitest, React Testing Library, `vi.mock`.
- **Testy Integracyjne (Integration Tests):**
  - **Cel:** Weryfikacja współpracy między różnymi modułami/komponentami i zewnętrznymi zależnościami (w kontrolowany sposób).
  - **Zakres:**
    - **API:** Testowanie endpointów API (`/api/...`) z mockowanymi serwisami lub z serwisami łączącymi się z testową bazą danych/mockiem OpenRouter. Weryfikacja walidacji Zod na poziomie API.
    - **Serwisy + Baza Danych:** Testowanie serwisów (`FlashcardService`, `GenerationService`) w połączeniu z testową instancją Supabase (weryfikacja poprawności zapytań i zapisanych danych).
    - **Komponenty:** Testowanie złożonych komponentów React (`GenerateView`) z mockowanymi wywołaniami API (`fetch`) lub mockowanymi serwisami.
    - **Middleware:** Testowanie logiki middleware (`src/middleware/index.ts`) z symulowanymi żądaniami HTTP i stanami sesji Supabase (mock `supabase.auth.getUser`).
  - **Narzędzia:** Vitest, Supertest (lub `fetch`), React Testing Library, testowa baza danych Supabase (np. Supabase CLI local dev), mocki (`vi.mock`, MSW).
- **Testy End-to-End (E2E Tests):**
  - **Cel:** Symulacja rzeczywistych przepływów użytkownika w przeglądarce, weryfikacja całej aplikacji od UI po backend i integracje zewnętrzne.
  - **Zakres:** Kluczowe scenariusze użytkownika:
    - Pełny cykl życia użytkownika: Logowanie -> Generowanie fiszek -> Edycja/Akceptacja -> Zapisanie -> (W przyszłości: Przeglądanie).
    - Obsługa błędów widoczna dla użytkownika (np. błąd logowania, błąd generowania).
    - Walidacja formularzy w UI.
  - **Narzędzia:** Playwright.
- **Testy Komponentów (Component Tests - z użyciem narzędzi E2E):**
  - **Cel:** Testowanie komponentów React w izolowanym środowisku przeglądarkowym, umożliwiające interakcję i weryfikację renderowania oraz logiki UI.
  - **Zakres:** Złożone komponenty interaktywne: `GenerateView`, `FlashcardItem`, `LoginForm`, `GenerateForm`, `SaveButtons`, `ForgotPasswordForm`, `RegisterForm`.
  - **Narzędzia:** Playwright Component Testing.
- **Testy Walidacji:**
  - **Cel:** Zapewnienie, że walidacja danych (Zod po stronie serwera, walidacja w UI - np. długość tekstu) działa poprawnie dla różnych przypadków (poprawne, niepoprawne, graniczne).
  - **Realizowane w ramach:** Testów jednostkowych (schematy Zod), testów integracyjnych (API), testów E2E/komponentów (formularze).
- **Testy Bezpieczeństwa (Podstawowe):**
  - **Cel:** Weryfikacja podstawowych mechanizmów bezpieczeństwa, głównie autoryzacji.
  - **Zakres:** Sprawdzenie ochrony ścieżek przez middleware, próby dostępu do API/stron chronionych bez autoryzacji, weryfikacja użycia `httpOnly` i `secure` dla ciasteczek sesji. Weryfikacja, czy operacje (generowanie, zapis) są powiązane z zalogowanym użytkownikiem (wymaga odejścia od `DEFAULT_USER_ID`).
  - **Realizowane w ramach:** Testów integracyjnych (middleware, API) i E2E.
- **Testy Użyteczności (Manualne):**
  - **Cel:** Ocena łatwości obsługi, intuicyjności i ogólnego doświadczenia użytkownika.
  - **Zakres:** Główne przepływy aplikacji, obsługa błędów, komunikaty.
  - **Realizowane przez:** Testy eksploracyjne.
- **Testy Dymne (Smoke Tests):**
  - **Cel:** Szybka weryfikacja najbardziej krytycznych funkcjonalności po deploymencie nowej wersji.
  - **Zakres:** Logowanie, otwarcie strony `/generate`, uruchomienie generowania (bez weryfikacji wyniku), próba zapisu.
  - **Realizowane przez:** Zautomatyzowany podzbiór krytycznych testów E2E.

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

_(Przykładowe scenariusze, lista nie jest wyczerpująca)_

**4.1. Uwierzytelnianie (Logowanie - `LoginForm.tsx`, `/api/auth/login.ts`, `middleware/index.ts`)**

| ID Scenariusza | Opis                                                                           | Oczekiwany Rezultat                                                                                                                                                                             | Typ Testu                   | Priorytet |
| -------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | --------- |
| AUTH-001       | Pomyślne logowanie z poprawnymi danymi uwierzytelniającymi.                    | Użytkownik zostaje przekierowany na `/generate`. Ciasteczko sesji (`sb-auth`) jest ustawione z flagami `HttpOnly`, `Secure`, `SameSite=Lax`. `locals.user` jest dostępne w kolejnych żądaniach. | E2E, Integracyjny (API)     | Krytyczny |
| AUTH-002       | Próba logowania z nieprawidłowym hasłem.                                       | Wyświetlany jest komunikat błędu "Nieprawidłowy email lub hasło" w komponencie `LoginForm`. Użytkownik pozostaje na `/login`.                                                                   | E2E, Integracyjny (API)     | Krytyczny |
| AUTH-003       | Próba logowania z nieistniejącym emailem.                                      | Wyświetlany jest komunikat błędu "Nieprawidłowy email lub hasło".                                                                                                                               | E2E, Integracyjny (API)     | Krytyczny |
| AUTH-004       | Próba logowania z nieprawidłowym formatem emaila (walidacja Zod/frontend).     | Wyświetlany jest błąd walidacji przy polu email w `LoginForm`. Żądanie do API nie jest wysyłane (lub API zwraca 400).                                                                           | E2E, Komponentowy, Int(API) | Wysoki    |
| AUTH-005       | Próba logowania z hasłem krótszym niż 6 znaków (walidacja Zod/frontend).       | Wyświetlany jest błąd walidacji przy polu hasło. Żądanie do API nie jest wysyłane (lub API zwraca 400).                                                                                         | E2E, Komponentowy, Int(API) | Wysoki    |
| AUTH-006       | Próba dostępu do chronionej strony (`/generate`) bez zalogowania.              | Użytkownik zostaje przekierowany (status 3xx) na `/login`.                                                                                                                                      | E2E, Integracyjny (Mid)     | Krytyczny |
| AUTH-007       | Dostęp do publicznej strony (`/login`, `/register`) będąc zalogowanym.         | Użytkownik może uzyskać dostęp do strony (aktualne zachowanie).                                                                                                                                 | E2E                         | Średni    |
| AUTH-008       | Przycisk "Zaloguj się" jest nieaktywny (`disabled`) podczas wysyłania żądania. | Atrybut `disabled` jest ustawiony na przycisku po kliknięciu, aż do otrzymania odpowiedzi.                                                                                                      | E2E, Komponentowy           | Wysoki    |
| AUTH-009       | Middleware poprawnie inicjalizuje klienta Supabase i przekazuje go w `locals`. | `locals.supabase` jest dostępny w endpointach API i stronach Astro.                                                                                                                             | Integracyjny (Mid)          | Krytyczny |

**4.2. Generowanie Fiszek (`GenerateView.tsx`, `/api/generations.ts`, `GenerationService`, `OpenRouterService`)**

| ID Scenariusza | Opis                                                                              | Oczekiwany Rezultat                                                                                                                                                                          | Typ Testu                      | Priorytet |
| -------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | --------- |
| GEN-001        | Pomyślne wygenerowanie fiszek dla tekstu o poprawnej długości (np. 1500 znaków).  | Wyświetlany jest `GenerationSkeleton`. Po zakończeniu: szkielet znika, wyświetlana jest `FlashcardList` z propozycjami (`source: 'ai-full'`). API zwraca 200, dane zapisane w `generations`. | E2E, Integracyjny (API+Svc)    | Krytyczny |
| GEN-002        | Próba generowania z tekstem za krótkim (np. 500 znaków).                          | Przycisk "Generuj fiszki" jest nieaktywny. Wyświetlany jest komunikat błędu walidacji pod `Textarea`. Żądanie API nie jest wysyłane.                                                         | E2E, Komponentowy              | Krytyczny |
| GEN-003        | Próba generowania z tekstem za długim (np. 11000 znaków).                         | Przycisk "Generuj fiszki" jest nieaktywny. Wyświetlany jest komunikat błędu walidacji pod `Textarea`. Żądanie API nie jest wysyłane.                                                         | E2E, Komponentowy              | Krytyczny |
| GEN-004        | Błąd podczas generowania (np. symulowany błąd 500 z OpenRouter).                  | Wyświetlany jest `toast` z komunikatem błędu. Stan ładowania znika. Błąd jest logowany w tabeli `generation_error_logs` w Supabase. API `/api/generations` zwraca 500.                       | E2E, Integracyjny (mock API)   | Krytyczny |
| GEN-005        | Błąd parsowania odpowiedzi z OpenRouter.                                          | Wyświetlany jest `toast` z komunikatem błędu ("Nie udało się przetworzyć..."). Błąd logowany w `generation_error_logs`. API `/api/generations` zwraca 500.                                   | Integracyjny (mock Svc)        | Krytyczny |
| GEN-006        | Przycisk "Generuj fiszki" i `Textarea` są nieaktywne podczas generowania.         | Atrybut `disabled` jest ustawiony na przycisku i polu tekstowym po kliknięciu "Generuj", aż do zakończenia operacji (sukces lub błąd).                                                       | E2E, Komponentowy              | Wysoki    |
| GEN-007        | Walidacja po stronie API (`/api/generations`) dla długości tekstu.                | API zwraca błąd 400, jeśli `source_text` w ciele żądania ma < 1000 lub > 10000 znaków.                                                                                                       | Integracyjny (API)             | Krytyczny |
| GEN-008        | Poprawność danych zapisanych w tabeli `generations` (hash, długość, czas, model). | Weryfikacja wartości w bazie danych po pomyślnym wygenerowaniu.                                                                                                                              | Integracyjny (Svc+DB)          | Wysoki    |
| GEN-009        | Poprawność danych zapisanych w tabeli `generation_error_logs` przy błędzie.       | Weryfikacja wartości w bazie danych po symulowanym błędzie generowania.                                                                                                                      | Integracyjny (Svc+DB)          | Wysoki    |
| GEN-010        | Logika retry w `OpenRouterService` działa poprawnie (np. przy błędzie 429).       | Serwis ponawia próbę wysłania żądania z opóźnieniem (wymaga zaawansowanego mockowania lub testów jednostkowych z `vi.useFakeTimers`).                                                        | Jednostkowy, Integracyjny(Svc) | Wysoki    |

**4.3. Zarządzanie i Zapisywanie Fiszek (`FlashcardItem.tsx`, `SaveButtons.tsx`, `/api/flashcards.ts`, `FlashcardService`)**

| ID Scenariusza | Opis                                                                                                     | Oczekiwany Rezultat                                                                                                                                                                                                                    | Typ Testu                      | Priorytet |
| -------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | --------- |
| SAVE-001       | Akceptacja/odrzucenie pojedynczej fiszki za pomocą checkboxa.                                            | Checkbox zmienia stan, styl karty się aktualizuje. Stan `accepted` w `GenerateView` jest poprawny. Przycisk "Zapisz wybrane" staje się aktywny/nieaktywny.                                                                             | E2E, Komponentowy              | Wysoki    |
| SAVE-002       | Edycja treści fiszki (front/back) i zapisanie zmian.                                                     | Pola `Textarea` stają się edytowalne. Po wprowadzeniu zmian i kliknięciu "Zapisz zmiany", treść jest zaktualizowana w UI. Stan `edited: true`, `source: 'ai-edited'` w `GenerateView`. Przycisk "Zapisz zmiany" nieaktywny po zapisie. | E2E, Komponentowy              | Wysoki    |
| SAVE-003       | Walidacja długości podczas edycji fiszki (front > 200 lub back > 500).                                   | Licznik znaków pokazuje przekroczenie limitu. Przycisk "Zapisz zmiany" jest nieaktywny (`disabled`).                                                                                                                                   | Komponentowy                   | Wysoki    |
| SAVE-004       | Anulowanie edycji fiszki.                                                                                | Treść fiszki wraca do stanu sprzed edycji. Pola `Textarea` stają się nieedytowalne.                                                                                                                                                    | E2E, Komponentowy              | Średni    |
| SAVE-005       | Zapisanie tylko zaakceptowanych fiszek (przycisk "Zapisz wybrane").                                      | API `/api/flashcards` jest wywoływane tylko z fiszkami o `accepted: true`. Po sukcesie (API 201): `toast` sukcesu, stan `GenerateView` resetowany. Dane zapisane w tabeli `flashcards` w Supabase.                                     | E2E, Integracyjny (API+Svc+DB) | Krytyczny |
| SAVE-006       | Zapisanie wszystkich wygenerowanych fiszek (przycisk "Zapisz wszystkie").                                | API `/api/flashcards` jest wywoływane ze wszystkimi fiszkami z listy. Po sukcesie (API 201): `toast` sukcesu, stan `GenerateView` resetowany. Dane zapisane w tabeli `flashcards`.                                                     | E2E, Integracyjny (API+Svc+DB) | Wysoki    |
| SAVE-007       | Próba zapisania wybranych fiszek, gdy żadna nie jest zaakceptowana.                                      | Przycisk "Zapisz wybrane" jest nieaktywny. Jeśli akcja zostanie wywołana inaczej, pojawia się `toast` błędu "Nie wybrano...". API nie jest wywoływane.                                                                                 | E2E, Komponentowy              | Wysoki    |
| SAVE-008       | Walidacja po stronie API `/api/flashcards`: błędny `source`.                                             | API zwraca błąd 400, jeśli `source` nie jest 'manual', 'ai-full' ani 'ai-edited'.                                                                                                                                                      | Integracyjny (API)             | Krytyczny |
| SAVE-009       | Walidacja po stronie API `/api/flashcards`: niespójność `source` i `generation_id`.                      | API zwraca błąd 400, jeśli `source` to 'manual' a `generation_id` nie jest `null`, LUB jeśli `source` to 'ai-...' a `generation_id` jest `null`.                                                                                       | Integracyjny (API)             | Krytyczny |
| SAVE-010       | Walidacja po stronie API `/api/flashcards`: przekroczone limity znaków.                                  | API zwraca błąd 400, jeśli `front` > 200 lub `back` > 500.                                                                                                                                                                             | Integracyjny (API)             | Krytyczny |
| SAVE-011       | Walidacja po stronie API `/api/flashcards`: pusta tablica `flashcards`.                                  | API zwraca błąd 400, jeśli tablica `flashcards` w ciele żądania jest pusta.                                                                                                                                                            | Integracyjny (API)             | Krytyczny |
| SAVE-012       | Poprawność danych zapisanych fiszek w tabeli `flashcards` (treść, source, gen_id, user_id).              | Weryfikacja wartości w bazie danych po pomyślnym zapisie. `user_id` powinien odpowiadać zalogowanemu użytkownikowi (po odejściu od `DEFAULT_USER_ID`).                                                                                 | Integracyjny (Svc+DB)          | Krytyczny |
| SAVE-013       | Przyciski "Zapisz wybrane" i "Zapisz wszystkie" są nieaktywne podczas operacji zapisywania (`isSaving`). | Atrybut `disabled` jest ustawiony na obu przyciskach po kliknięciu, aż do zakończenia operacji.                                                                                                                                        | E2E, Komponentowy              | Wysoki    |

## 5. Środowisko Testowe

- **Środowisko Uruchomieniowe:**
  - Lokalne maszyny deweloperskie (Node.js LTS, pnpm/npm).
  - Serwer CI/CD (np. GitHub Actions) z odpowiednią konfiguracją Node.js.
- **Przeglądarki (dla E2E i testów komponentów):**
  - Chromium (główna, dostarczana z Playwright).
  - Firefox (dodatkowa weryfikacja na CI).
  - WebKit (opcjonalnie na CI).
- **Baza Danych (Supabase):**
  - **Testy Jednostkowe/Komponentowe:** Mock klienta Supabase (`vi.mock('@supabase/supabase-js')`).
  - **Testy Integracyjne/E2E:**
    - **Preferowane:** Lokalna instancja Supabase zarządzana przez Supabase CLI (`supabase start`). Skrypty do resetowania bazy danych (migracje `supabase db reset`) przed uruchomieniem zestawu testów integracyjnych/E2E.
    - **Alternatywa:** Dedykowany projekt Supabase w chmurze (np. darmowy tier) dla środowiska testowego/stagingowego, z mechanizmem czyszczenia danych między przebiegami testów.
- **Zewnętrzne API (OpenRouter):**
  - **Testy Jednostkowe/Integracyjne/Komponentowe:** Mock serwisu `OpenRouterService` (`vi.mock`) lub mockowanie `fetch` za pomocą MSW (Mock Service Worker) do symulowania odpowiedzi API OpenRouter (sukces, różne błędy, opóźnienia).
  - **Testy E2E:** Rzeczywiste API OpenRouter z dedykowanym, testowym kluczem API (`OPENROUTER_API_KEY` w `.env.test`). Testy te powinny być oznaczone jako `@external` lub `@flaky` i być może uruchamiane rzadziej lub tylko w określonych gałęziach/środowiskach ze względu na koszty i potencjalną niestabilność.
- **Dane Testowe:**
  - Konta użytkowników w testowej bazie Supabase (dla logowania).
  - Zestawy tekstów źródłowych: krótki (<1000), długi (>10000), poprawny (1000-10000), zawierający znaki specjalne.
  - Mockowe odpowiedzi API OpenRouter (JSON z poprawną strukturą fiszek, pustą tablicą, niepoprawnym JSON-em, komunikaty błędów API).
  - Dane wejściowe dla API `/api/flashcards` testujące wszystkie ścieżki walidacji Zod.

## 6. Narzędzia do Testowania

- **Framework Testowy:** Vitest (zintegrowany z Vite, szybki, wsparcie dla TS).
- **Biblioteka do Testowania Komponentów React:** React Testing Library (`@testing-library/react`).
- **Narzędzie do Testów E2E i Komponentów:** Playwright (wsparcie dla wielu przeglądarek, auto-wait, nagrywanie testów, testy komponentów).
- **Mockowanie:**
  - Vitest: `vi.mock`, `vi.spyOn`, `vi.fn`, `vi.useFakeTimers`.
  - Mock Service Worker (MSW) - do mockowania API `fetch` na poziomie sieciowym w testach integracyjnych/komponentowych.
- **Asercje:** Vitest built-in (`expect`), `@testing-library/jest-dom` (dla dodatkowych matcherów DOM).
- **Testy API (Integracyjne):** Supertest lub natywne `fetch` w testach Vitest.
- **Zarządzanie Środowiskiem Supabase:** Supabase CLI.
- **CI/CD:** GitHub Actions (lub inne, np. GitLab CI).
- **Zarządzanie Błędami:** GitHub Issues (zintegrowane z repozytorium).
- **Pokrycie Kodu:** Vitest Coverage (`@vitest/coverage-v8`).

## 7. Harmonogram Testów

- Testowanie jest procesem ciągłym, zintegrowanym z cyklem rozwoju.
- **Testy Jednostkowe i Integracyjne (komponenty/serwisy):** Pisane przez deweloperów równolegle z implementacją kodu. Uruchamiane automatycznie na CI przy każdym pushu do gałęzi i przed scaleniem do gałęzi głównej (`main`/`master`).
- **Testy API (Integracyjne):** Pisane/aktualizowane po implementacji/zmianie endpointów API. Uruchamiane na CI.
- **Testy Komponentów (Playwright):** Rozwijane dla kluczowych interaktywnych komponentów. Uruchamiane na CI.
- **Testy E2E (Playwright):** Rozwijane iteracyjnie dla głównych przepływów użytkownika. Krytyczne scenariusze uruchamiane na CI przy każdym merge request do `main`. Pełny zestaw (w tym testy `@external`) może być uruchamiany rzadziej (np. nightly build, przed releasem).
- **Testy Eksploracyjne/Manualne:** Przeprowadzane przed planowanymi wydaniami lub w miarę potrzeb podczas sprintu.
- **Testy Regresji:** Cały zestaw zautomatyzowanych testów uruchamiany regularnie na CI w celu wykrywania regresji.
- **Przegląd Pokrycia Kodu:** Regularna analiza raportów pokrycia kodu w celu identyfikacji obszarów wymagających dodatkowych testów.

## 8. Kryteria Akceptacji Testów

### 8.1. Kryteria Wejścia (Rozpoczęcia Testów dla danej funkcjonalności):

- Kod źródłowy funkcjonalności jest dostępny w gałęzi deweloperskiej/feature branch.
- Funkcjonalność jest możliwa do zbudowania i uruchomienia lokalnie.
- Podstawowe wymagania funkcjonalne są zdefiniowane (np. w opisie zadania/issue).
- Niezbędne mocki lub konfiguracja środowiska testowego są gotowe.

### 8.2. Kryteria Wyjścia (Zakończenia Testów dla Wydania):

- Wszystkie zaplanowane scenariusze testowe (automatyczne i manualne) dla danego wydania zostały wykonane.
- Osiągnięto docelowy poziom pokrycia kodu przez testy jednostkowe i integracyjne (np. > 85% dla kluczowych serwisów i logiki API, > 70% ogółem).
- Wszystkie zautomatyzowane testy (jednostkowe, integracyjne, komponentowe, E2E - poza oznaczonymi jako `@flaky`/`@external`) przechodzą pomyślnie na CI w finalnej gałęzi wydania.
- Wszystkie zidentyfikowane defekty o priorytecie Krytycznym (`blocker`) i Wysokim (`critical`) zostały naprawione i zweryfikowane.
- Liczba i status pozostałych defektów o niższym priorytecie jest znana i zaakceptowana przez Product Ownera/zespół.
- Wyniki testów zostały udokumentowane (np. w raporcie CI, systemie śledzenia błędów).
- Testy dymne przechodzą pomyślnie na środowisku stagingowym (jeśli istnieje) lub w finalnej wersji kandydującej.

## 9. Role i Odpowiedzialności w Procesie Testowania

- **Deweloperzy:**
  - Pisanie testów jednostkowych i integracyjnych dla tworzonego kodu.
  - Zapewnienie testowalności kodu (DI, unikanie hardkodowanych zależności).
  - Naprawianie błędów zgłoszonych przez QA lub wykrytych przez testy automatyczne.
  - Utrzymanie i aktualizacja testów jednostkowych/integracyjnych.
  - Uruchamianie testów lokalnie przed wypchnięciem kodu.
- **Inżynier QA:**
  - Tworzenie, utrzymanie i aktualizacja Planu Testów.
  - Projektowanie, implementacja i utrzymanie testów automatycznych (API, E2E, Komponentowe).
  - Wykonywanie testów manualnych, eksploracyjnych i regresyjnych.
  - Konfiguracja i zarządzanie zadaniami testowymi w CI/CD.
  - Raportowanie, priorytetyzacja i śledzenie błędów w GitHub Issues.
  - Analiza wyników testów, raportowanie metryk jakości (np. pokrycie kodu, liczba błędów).
  - Współpraca z deweloperami w celu zapewnienia jakości i testowalności.
- **Product Owner / Manager Projektu:**
  - Definiowanie priorytetów biznesowych dla funkcjonalności i scenariuszy testowych.
  - Akceptacja kryteriów wyjścia dla testów i podejmowanie decyzji o wydaniu.
  - Przeglądanie i priorytetyzacja zgłoszonych błędów (szczególnie tych o niższym priorytecie).

## 10. Procedury Raportowania Błędów

- **Narzędzie:** GitHub Issues (zintegrowane z repozytorium projektu).
- **Szablon Zgłoszenia Błędu (Issue Template):** Użycie predefiniowanego szablonu w GitHub Issues, zawierającego sekcje:
  - **Tytuł:** Zwięzły opis problemu (np. "[Bug] Przycisk 'Zapisz wybrane' nieaktywny po akceptacji fiszki").
  - **Opis:** Szczegółowy opis błędu.
  - **Kroki do Reprodukcji:** Numerowana lista kroków prowadzących do wystąpienia błędu.
  - **Oczekiwany Rezultat:** Co powinno się wydarzyć.
  - **Rzeczywisty Rezultat:** Co się dzieje.
  - **Środowisko:** Wersja aplikacji/commit hash, przeglądarka + wersja, system operacyjny, środowisko (np. lokalne, CI, staging).
  - **Dowody:** Zrzuty ekranu, nagrania wideo (np. za pomocą wbudowanych narzędzi Playwright lub zewnętrznych), logi konsoli/sieciowe (jako załączniki lub wklejone fragmenty).
  - **Etykiety (Labels):** `bug`, priorytet (np. `priority:blocker`, `priority:critical`, `priority:major`, `priority:minor`), obszar (np. `area:auth`, `area:generation`, `area:ui`).
  - **Przypisanie (Assignees):** (Opcjonalnie) Osoba odpowiedzialna za analizę/naprawę.
- **Cykl Życia Błędu (w GitHub Issues):**
  1.  **Open:** Nowo zgłoszony błąd.
  2.  _(Opcjonalnie)_ Etykieta `needs-triage` lub `needs-confirmation`.
  3.  _(Przypisanie)_ Deweloper podejmuje pracę nad błędem.
  4.  _(Pull Request)_ Poprawka jest implementowana w osobnym PR, który jest linkowany do Issue.
  5.  _(Merge)_ PR z poprawką jest scalany do odpowiedniej gałęzi.
  6.  _(Weryfikacja)_ QA weryfikuje poprawkę w środowisku testowym/stagingowym lub na gałęzi `main`.
  7.  **Closed:** Jeśli poprawka działa, QA zamyka Issue. Jeśli nie, QA dodaje komentarz i ponownie otwiera Issue (lub usuwa etykietę `fixed`/`resolved`).
- **Priorytetyzacja:** Błędy są priorytetyzowane przez QA we współpracy z Product Ownerem/zespołem na podstawie wpływu na użytkownika i ryzyka biznesowego.
- **Komunikacja:** Dyskusje na temat błędów odbywają się w komentarzach pod Issue. Status błędów jest omawiany na regularnych spotkaniach zespołu (np. stand-up, planowanie).
