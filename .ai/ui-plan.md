# Architektura UI dla Fiska

## 1. Przegląd struktury UI

Aplikacja Fiska umożliwia tworzenie i zarządzanie fiszkami edukacyjnymi poprzez interfejs webowy z dwoma głównymi panelami: generowania fiszek AI oraz przeglądania i edycji zapisanych fiszek. Interfejs zapewnia responsywną nawigację, walidację danych w czasie rzeczywistym oraz obsługę błędów poprzez Toasty i Dialogi, z zastosowaniem komponentów Tailwind CSS i Shadcn/ui.

## 2. Lista widoków

### 2.1. Widok "Uwierzytelnianie"

- Ścieżka widoku: `/login` i `/register`
- Główny cel: Umożliwić użytkownikowi logowanie i rejestrację, aby uzyskać dostęp do pozostałych funkcji aplikacji.
- Kluczowe informacje:
  - Formularze logowania i rejestracji.
  - Walidacja danych z komunikatami błędów (komponent `Toast`).
- Kluczowe komponenty widoku:
  - Formularz logowania z polami na email i hasło.
  - Formularz rejestracji z wymaganymi polami.
  - Przyciski typu "Zaloguj" i "Zarejestruj".
  - Komponenty walidacji onBlur i `Toast` do wyświetlania komunikatów.
- Uwagi UX, dostępność i bezpieczeństwo:
  - Interfejs zgodny ze standardami WCAG AA.
  - Bezpieczne przesyłanie danych (HTTPS, mechanizmy JWT).

### 2.2. Widok "Materiały dla AI / Fiszki AI"

- Ścieżka widoku: `/generate` (lub główna strona po zalogowaniu)
- Główny cel: Umożliwić użytkownikowi wprowadzenie materiału wejściowego do generowania fiszek przez AI oraz recenzję wygenerowanych propozycji.
- Kluczowe informacje:
  - Formularz tekstowy z polem `textarea` do wprowadzania materiału (1000-10000 znaków).
  - Informacje o walidacji błędów (komunikaty pod polem).
  - Lista wygenerowanych fiszek prezentowana po przetwarzaniu.
- Kluczowe komponenty widoku:
  - `Textarea Input` z walidacją onBlur.
  - `Button "Generuj"` z funkcją dezaktywacji w przypadku błędów.
  - Komponent `Skeleton` wyświetlany podczas ładowania danych.
  - Komponenty do edycji inline fiszek.
  - Przyciski akcji (zapisz wszystkie, zapisz wybrane).
  - Każda fiszka ma `Button "Usuń"`.
  - Komponent `Toast` do wyświetlania komunikatów błędów z API.
- Uwagi UX, dostępność i bezpieczeństwo:
  - Natychmiastowa walidacja onBlur i czytelne komunikaty błędów.
  - Użycie standardów WCAG AA.
  - Zabezpieczenie przed nieautoryzowanym dostępem (JWT, autoryzacja).

### 2.3. Widok "Moje fiszki"

- Ścieżka widoku: `/my-flashcards`
- Główny cel: Umożliwić użytkownikowi przeglądanie, edycję inline oraz usuwanie swoich zapisanych fiszek.
- Kluczowe informacje:
  - Lista zapisanych fiszek z informacjami o przodzie i tyle.
  - Status zapisania fiszek oraz możliwość potwierdzenia zmian.
- Kluczowe komponenty widoku:
  - Lista fiszek z opcją edycji inline.
  - Przycisk/usunięcia z potwierdzeniem za pomocą `Dialog` (operacja nieodwracalna).
  - Komponent `Toast` do komunikacji błędów API.
- Uwagi UX, dostępność i bezpieczeństwo:
  - Edycja inline z natychmiastową walidacją onBlur.
  - Potwierdzenie usunięcia poprzez dialog.
  - Pełna zgodność z wymaganiami bezpieczeństwa (autoryzacja).

### 2.4. Widok "Session"

- Ścieżka widoku: `/session`
- Główny cel: Prezentacja bieżących sesji użytkownika, podsumowanie operacji, historii generacji i ewentualnych powtórek.
- Kluczowe informacje:
  - Informacje o ostatnich operacjach generowania.
  - Podsumowanie aktywności i statystyk.
- Kluczowe komponenty widoku:
  - Komponenty prezentujące statystyki i historię.
  - Prosty interfejs przeglądania historii operacji.
- Uwagi UX, dostępność i bezpieczeństwo:
  - Przejrzysty układ informacji.
  - Zachowanie standardów WCAG.

### 2.5. Widok "Settings"

- Ścieżka widoku: `/settings`
- Główny cel: Umożliwić użytkownikowi zarządzanie ustawieniami konta i preferencjami.
- Kluczowe informacje:
  - Formularze do edycji danych użytkownika.
  - Opcje konfiguracji powiadomień i integracji (np. JWT w przyszłości).
- Kluczowe komponenty widoku:
  - Formularz aktualizacji ustawień.
  - Komponenty do zmiany danych konta.
  - Komponent `Toast` do wyświetlania komunikatów o błędach.
- Uwagi UX, dostępność i bezpieczeństwo:
  - Bezpieczne operacje aktualizacji danych.
  - Jasne informacje o błędach i potwierdzenia.

## 3. Mapa podróży użytkownika

1. Logowanie/Rejestracja:
   - Użytkownik loguje się lub rejestruje, aby uzyskać dostęp do aplikacji.
2. Strona główna ("Materiały dla AI / Fiszki AI"):
   - Użytkownik trafia na stronę z formularzem do wprowadzania materiału wejściowego.
   - Wprowadzenie tekstu w `textarea` z walidacją onBlur.
   - Po poprawnym wypełnieniu, przycisk "Generuj" jest aktywowany.
   - Użytkownik klika "Generuj", widzi komponent `Skeleton` podczas przetwarzania.
   - Po zakończeniu generacji, wyświetlana jest lista wygenerowanych fiszek, którą użytkownik może edytować inline.
   - Po zatwierdzeniu zmian, aplikacja zapisuje fiszki przez API, a użytkownik zostaje automatycznie przekierowany na widok "Moje fiszki".
3. Strona "Moje fiszki":
   - Użytkownik przegląda zapisane fiszki.
   - Może dokonać edycji inline lub usunąć fiszkę (operacja usuwania wymaga potwierdzenia w `Dialog`).
4. Widoki "Session" i "Settings":
   - Użytkownik ma możliwość sprawdzenia historii operacji i statystyk sesji.
   - Może również zarządzać ustawieniami konta.
5. Nawigacja:
   - Pasek nawigacyjny umożliwia łatwe przechodzenie między wszystkimi widokami.

## 4. Układ i struktura nawigacji

- Pasek nawigacyjny (Navbar) jest stały i widoczny na wszystkich widokach.
- Zawiera linki do:
  - "Materiały dla AI/Fiszki AI"
  - "Moje fiszki"
  - "Session"
  - "Settings"
- W wersji mobilnej, pasek nawigacyjny przekształca się w hamburger menu, zapewniając wygodny dostęp do wszystkich opcji.
- Nawigacja jest zgodna ze standardami WCAG AA, z odpowiednimi aria-labels oraz wsparciem dla klawiatury.

## 5. Kluczowe komponenty

- `Textarea Input` z walidacją onBlur – do wprowadzania materiału AI.
- `Button "Generuj"` – aktywowany po poprawnej walidacji, inicjuje proces generacji fiszek.
- `Skeleton` – komponent wskazujący stan ładowania podczas generacji i pobierania danych.
- `Toast` – do wyświetlania komunikatów błędów z API.
- `Dialog` – do potwierdzania operacji usuwania fiszek.
- `Inline Editing Component` – umożliwiający edycję fiszek bez konieczności przeładowania widoku.
- `Navbar` – stały pasek nawigacyjny zapewniający przejrzystość nawigacji między widokami.
