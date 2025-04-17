# Status implementacji widoku "Generate"

## Zrealizowane kroki

1. Utworzenie podstawowej struktury widoku:

   - Plik widoku `generate.astro` z layoutem
   - Główny komponent React `GenerateView.tsx`

2. Implementacja formularza wprowadzania tekstu:

   - Komponent `GenerateForm.tsx` z walidacją długości tekstu (1000-10000 znaków)
   - Label i licznik znaków
   - Obsługa stanu disabled podczas generowania

3. Implementacja stanu ładowania:

   - Komponent `GenerationSkeleton.tsx` z animowanymi placeholderami
   - Wykorzystanie komponentu Skeleton z shadcn/ui

4. Implementacja listy wygenerowanych fiszek:

   - Komponent `FlashcardList.tsx` do zarządzania listą
   - Komponent `FlashcardItem.tsx` do edycji pojedynczej fiszki
   - Możliwość edycji inline pól front/back
   - Checkbox do zaznaczania/akceptacji fiszki
   - Stylowanie zaznaczonych fiszek

5. Implementacja zapisywania fiszek:

   - Przyciski "Zapisz wybrane" i "Zapisz wszystkie"
   - Integracja z API (`/api/generations` i `/api/flashcards`)
   - Obsługa błędów i powiadomienia toast
   - Przekierowanie po zapisie do `/my-flashcards`

6. Instalacja i konfiguracja komponentów shadcn/ui:

   - textarea
   - skeleton
   - sonner
   - label
   - card
   - checkbox

7. Refaktoryzacja typów:
   - Utworzenie wspólnego pliku `types.ts` dla komponentów generowania
   - Wykorzystanie typu `LocalFlashcardProposal` we wszystkich komponentach

## Kolejne kroki

1. Walidacja długości pól w komponencie `FlashcardItem`:

   - Maksymalna długość front: 200 znaków
   - Maksymalna długość back: 500 znaków
   - Dodanie komunikatów o błędach walidacji

2. Rozszerzenie obsługi błędów:

   - Dodanie komunikatów toast dla różnych akcji w `FlashcardItem`
   - Informowanie o sukcesie po zapisaniu zmian
   - Wyświetlanie błędów walidacji
