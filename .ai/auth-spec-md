# Specyfikacja modułu autoryzacji i autentykacji

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1 Podział interfejsu

- **Strony publiczne (non-auth):**
  - Landing page, strona logowania, rejestracji oraz odzyskiwania hasła.
  - Ukierunkowane na użytkowników niezalogowanych.
- **Strefa autoryzowanych użytkowników (auth):**
  - Dashboard, widok "Moje fiszki", edycja fiszek, itp.
  - Dedykowany layout z paskiem nawigacyjnym, przyciskiem wylogowywania oraz dodatkowymi opcjami.
- **Layouty:**
  - Osobne layouty dla stron autoryzowanych i publicznych.
  - Strony Astro zarządzają routingiem i inicjalizacją sesji, przekazując stan autoryzacji do komponentów React.

### 1.2 Komponenty i formularze

- **Formularze:**
  - **Rejestracja:** pola e-mail, hasło, potwierdzenie hasła.
  - **Logowanie:** pola e-mail i hasło.
  - **Odzyskiwanie hasła:** pole e-mail oraz komponent wysyłający link/reset token.
- **Komponenty React:**
  - Wykorzystanie biblioteki Shadcn/ui dla spójności wizualnej.
  - Formularze i elementy interaktywne odpowiadające za walidację po stronie klienta (np. sprawdzanie formatu e-mail, minimalnej długości hasła).
- **Strony Astro:**
  - "Wrappery" dla komponentów React, odpowiedzialne za inicjalizację sesji oraz przekazywanie stanu (auth vs non-auth).
  - Integracja z backendem poprzez wywołania API.

### 1.3 Walidacja i komunikaty błędów

- **Walidacja po stronie klienta:**
  - Sprawdzanie poprawności wprowadzonych danych (np. format e-mail, zgodność hasła i jego potwierdzenia).
  - Informowanie użytkownika o błędach w formie komunikatów inline lub alertów.
- **Obsługa scenariuszy błędów:**
  - Rozbieżności w danych rejestracyjnych (np. niezgodne hasła).
  - Brak połączenia z serwerem lub nieprawidłowe dane logowania.
  - Potwierdzenie poprawnego resetu hasła z komunikatami sukcesu.

## 2. LOGIKA BACKENDOWA

### 2.1 Struktura endpointów API

- **Rejestracja:** `POST /api/auth/register`
  - Odbiera dane: e-mail, hasło.
  - Walidacja unikalności e-maila i formatu danych.
- **Logowanie:** `POST /api/auth/login`
  - Sprawdzenie danych logowania, generowanie tokenów sesji.
- **Wylogowanie:** `POST /api/auth/logout`
  - Usuwanie sesji z poziomu serwera i klienta.
- **Odzyskiwanie hasła:**
  - `POST /api/auth/forgot-password` – inicjowanie procesu (wysłanie maila z linkiem reset).
  - `POST /api/auth/reset-password` – finalizacja procesu resetowania, weryfikacja tokenu.

### 2.2 Modele danych i walidacja

- **Modele danych:**
  - Użytkownik: identyfikator, e-mail, hasło (zaszyfrowane), data rejestracji, status konta - obsługiwane przez Supabase Auth.
  - Tokeny: tokeny sesyjne, tokeny odświeżania, tokeny do resetu hasła wraz z datą ważności.
- **Walidacja wejścia:**
  - Wykorzystanie bibliotek (np. zod) lub własnej logiki walidacyjnej na poziomie endpointów.
  - Weryfikacja poprawności formatów oraz unikalności danych (szczególnie e-maila).

### 2.3 Obsługa wyjątków i renderowanie stron

- **Obsługa błędów:**
  - Centralny mechanizm do przechwytywania błędów, logowanie oraz zwracanie przyjaznych komunikatów.
- **Renderowanie stron server-side:**
  - Aktualizacja konfiguracji w `astro.config.mjs` w celu sprawdzania stanu sesji przed renderowaniem stron chronionych.
  - Dynamiczne ładowanie layoutów zgodnie z autoryzacją użytkownika.

## 3. SYSTEM AUTENTYKACJI

### 3.1 Integracja z Supabase Auth

- **Wykorzystanie Supabase:**
  - Rejestracja użytkowników poprzez Supabase Auth, w tym automatyczne potwierdzanie adresu e-mail.
  - Logowanie z weryfikacją danych, generowanie i zarządzanie tokenami (JWT lub cookies).
  - Obsługa wylogowania – usuwanie sesji po stronie klienta i backendu.
  - Resetowanie hasła poprzez generowanie tokenów resetu oraz wysyłanie maili z linkiem do zmiany hasła.
- **Kontrakty i typy danych:**
  - Definicje w `src/types.ts` dla zgodności typów pomiędzy front-endem i backendem.
  - Spójne rozumienie struktury tokenów, użytkownika oraz komunikatów statusowych.

### 3.2 Mechanizmy bezpieczeństwa i zarządzanie sesjami

- **Mechanizmy sesji:**
  - Użycie cookies lub tokenów JWT do utrzymywania autentykacji.
  - Ograniczenie dostępu do endpointów API na podstawie weryfikacji sesji.
- **Bezpieczeństwo:**
  - Szyfrowanie haseł w bazie danych.
  - Zapobieganie atakom CSRF i XSS poprzez odpowiednią konfigurację middleware i nagłówków.
  - Monitorowanie nieautoryzowanych prób dostępu i implementacja lock-outów.

## Podsumowanie

Projektowany moduł autoryzacji i autentykacji ściśle integruje się z już istniejącą architekturą aplikacji Fiska. Kluczowe elementy to:

- Rozdzielenie widoków oraz layoutów zależnie od stanu autoryzacji.
- Jasny podział obowiązków między logikę UI (Astro + React) a backend (API oparte na Supabase Auth).
- Spójna walidacja i obsługa błędów zarówno po stronie klienta, jak i serwera.
- Wdrożenie nowoczesnych mechanizmów bezpieczeństwa i zarządzania sesjami.

Przy powyższym podejściu osiągamy płynne, bezpieczne i skalowalne rozwiązanie, które wpisuje się w istniejącą architekturę aplikacji Fiska.
