# Plan Testów

## 1. Wprowadzenie i Cele Testowania

- Zapewnienie wysokiej jakości, niezawodności oraz bezpieczeństwa aplikacji.
- Weryfikacja poprawności działania kluczowych funkcjonalności zarówno w interfejsie użytkownika, jak i na poziomie logiki backendu.
- Wczesne wykrywanie defektów i minimalizacja ryzyka wdrożenia błędów na produkcję.
- Usprawnienie procesu ciągłej integracji i wdrażania (CI/CD) dzięki automatyzacji testów.

## 2. Zakres Testów

- **Frontend**: Testowanie renderowania i interaktywności komponentów (Astro, React, shadcn/ui) oraz poprawności stylizacji za pomocą Tailwind.
- **Backend**: Weryfikacja poprawności API i logiki biznesowej opartej na Supabase (autoryzacja, operacje na bazie danych, obsługa błędów).
- **Integracja Frontend – Backend**: Sprawdzenie komunikacji między warstwą interfejsu użytkownika a serwerem.
- **Moduł AI**: Testowanie poprawności komunikacji z usługą Openrouter oraz walidacja limitów API i odpowiedzi modeli AI.
- **CI/CD i Hosting**: Weryfikacja działania pipeline'ów Github Actions, w tym środowiska budowania i wdrażania przy użyciu Docker i DigitalOcean.
- **Testy Wydajnościowe i Bezpieczeństwa**: Ocena wydajności systemu oraz testy odporności na ataki i nieautoryzowany dostęp.
- **Testy Dostępności**: Weryfikacja zgodności z wytycznymi WCAG i zapewnienie dostępności dla użytkowników z niepełnosprawnościami.
- **Testy Regresji Wizualnej**: Wykrywanie niezamierzonych zmian w wyglądzie interfejsu użytkownika.

## 3. Typy Testów do Przeprowadzenia

- **Testy jednostkowe**: Sprawdzanie poszczególnych funkcji i komponentów w izolacji (React, logika backendu).
- **Testy integracyjne**: Weryfikacja poprawnego działania współdziałania między modułami (np. integracja Astro z React, komunikacja frontend-backend).
- **Testy E2E (end-to-end)**: Symulacja pełnych scenariuszy użytkownika, w tym procesów rejestracji, logowania i interakcji z AI.
- **Testy wydajnościowe**: Testowanie obciążenia, czasu odpowiedzi oraz skalowalności.
- **Testy bezpieczeństwa**: Audyt podatności, weryfikacja autoryzacji, uwierzytelniania oraz zabezpieczeń przed typowymi atakami (np. XSS, CSRF).
- **Testy dostępności**: Sprawdzanie zgodności z wytycznymi WCAG 2.1 AA.
- **Testy komponentów UI**: Izolowane testowanie komponentów interfejsu użytkownika w różnych stanach i konfiguracjach.

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

- **Interfejs Użytkownika**:
  - Walidacja poprawnego renderowania komponentów i responsywności interfejsu.
  - Sprawdzenie funkcjonalności interaktywnych elementów (przyciski, formularze, nawigacja).
  - Weryfikacja dostępności dla użytkowników korzystających z technologii wspomagających.
- **Autoryzacja i Logowanie**:
  - Testy poprawności procesu rejestracji, logowania i resetowania hasła.
  - Weryfikacja roli użytkowników oraz ograniczeń dostępu.
- **Komunikacja z API (Supabase)**:
  - Testowanie operacji CRUD na bazie danych.
  - Weryfikacja obsługi błędów i komunikatów zwrotnych.
  - Testowanie z wykorzystaniem mocków dla izolacji testów.
- **Interakcja z Modelem AI**:
  - Walidacja parametrów zapytań, limitów finansowych oraz poprawności odbieranych odpowiedzi.
  - Testy z wykorzystaniem symulowanych odpowiedzi AI.
- **CI/CD i Wdrażanie**:
  - Testy automatycznego budowania aplikacji.
  - Symulacja wdrożeń w środowisku staging oraz produkcyjnym.

## 5. Środowisko Testowe

- **Lokalne środowisko deweloperskie**: Maszyny deweloperskie z odpowiednią konfiguracją Node.js, Docker oraz dostępem do instancji Supabase.
- **Środowisko testowe (staging)**: Odtworzenie produkcyjnego środowiska na DigitalOcean, z repliką bazy danych oraz uruchomionymi pipeline'ami CI/CD.
- **Symulatory API i mocki**: Wykorzystanie MSW (Mock Service Worker) do symulowania odpowiedzi usług zewnętrznych (np. Openrouter, Supabase).

## 6. Narzędzia do Testowania

- **Testy jednostkowe i integracyjne**:
  - Vitest
  - React Testing Library
  - ts-jest dla lepszej integracji z TypeScript
  - astro-testing-library dla komponentów Astro
- **Testy E2E**:
  - Playwright (preferowany nad Cypress)
- **Testy wydajnościowe**:
  - k6
  - Lighthouse
  - Web Vitals
  - Artillery (do testów obciążeniowych API)
  - Automate-Lighthouse (do automatycznego monitorowania wskaźników)
- **Testy bezpieczeństwa**:
  - OWASP ZAP
  - Snyk
  - SonarQube (analiza statyczna)
  - Dependabot (monitorowanie zależności)
  - CodeQL (SAST)
- **Testy dostępności**:
  - Axe lub pa11y
- **Testy regresji wizualnej**:
  - Percy lub Chromatic
- **Testowanie izolowanych komponentów**:
  - Storybook
- **Mockowanie API**:
  - MSW (Mock Service Worker)
- **CI/CD**:
  - Github Actions z Husky + lint-staged (testy przed commitem)
- **Monitorowanie pokrycia testami**:
  - Codecov lub Coveralls
- **System zarządzania defektami**:
  - Github Issues (dla mniejszych projektów)
  - Linear (nowoczesna alternatywa dla Jira)

## 7. Harmonogram Testów

- **Faza 1 – Przygotowanie**:
  - Przygotowanie środowiska testowego.
  - Instalacja i konfiguracja narzędzi testowych.
  - Konfiguracja Husky i lint-staged dla testów przed commitem.
- **Faza 2 – Testowanie jednostkowe i integracyjne**:
  - Rozpoczęcie pisania i uruchamiania testów jednostkowych na bieżąco podczas rozwoju funkcjonalności.
  - Skonfigurowanie Storybooka do testowania izolowanych komponentów.
- **Faza 3 – Testy E2E oraz wydajnościowe**:
  - Uruchomienie testów end-to-end w środowisku staging z wykorzystaniem Playwright.
  - Przeprowadzenie testów wydajnościowych (k6, Web Vitals) i bezpieczeństwa.
  - Wdrożenie testów dostępności i regresji wizualnej.
- **Faza 4 – Raportowanie oraz walidacja**:
  - Podsumowanie wyników testów.
  - Analiza wyników pokrycia testami z Codecov/Coveralls.
  - Weryfikacja krytycznych scenariuszy oraz zatwierdzenie aplikacji do wdrożenia.

## 8. Kryteria Akceptacji Testów

- Pokrycie testami kluczowych funkcjonalności na poziomie minimum 80% (unit/integracja).
- Brak błędów krytycznych i wysokiego priorytetu.
- Wszystkie scenariusze E2E muszą zostać pomyślnie zakończone.
- Wyniki testów wydajnościowych mieszczą się w założonych limitach czasowych odpowiedzi.
- Zgodność z wytycznymi WCAG 2.1 AA w testach dostępności.
- Brak regresji wizualnej w interfejsie użytkownika.
- Udokumentowane raporty testów zatwierdzone przez zespół QA i deweloperów.

## 9. Role i Odpowiedzialności

- **Inżynier QA**: Opracowanie i nadzór realizacji planu testów, przygotowywanie raportów oraz analiza wyników.
- **Developerzy**: Tworzenie testów jednostkowych i integracyjnych, współpraca przy testach E2E.
- **Testerzy Manualni**: Wykonywanie testów eksploracyjnych oraz weryfikacja interfejsu użytkownika.
- **Project Manager**: Koordynacja prac zespołu, monitorowanie postępów oraz komunikacja z interesariuszami.
- **Inżynier DevOps**: Konfiguracja i utrzymanie pipeline'ów CI/CD oraz integracja narzędzi monitorowania.

## 10. Procedury Raportowania Błędów

- **Identyfikacja błędów**: Każdy błąd zostanie dokładnie udokumentowany (opis, kroki do reprodukcji, oczekiwany wynik, rzeczywisty wynik).
- **Narzędzie do zgłaszania**: Wykorzystanie GitHub Issues lub Linear do rejestrowania i śledzenia postępów naprawy.
- **Priorytetyzacja i eskalacja**: Błędy będą klasyfikowane według ich wpływu na użytkownika (niski, średni, wysoki, krytyczny) oraz eskalowane do odpowiednich zespołów.
- **Weryfikacja naprawy**: Po zgłoszeniu, naprawione błędy będą weryfikowane przez niezależny zespół QA przed zamknięciem zgłoszenia.
- **Automatyzacja wykrywania**: Wdrożenie automatycznego wykrywania regresji poprzez testy w pipeline CI/CD.
