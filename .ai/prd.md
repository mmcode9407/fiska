# Dokument wymagań produktu (PRD) - fiska

## 1. Przegląd produktu

Projekt "fiska" to aplikacja web umożliwiająca łatwe tworzenie fiszek edukacyjnych, zarówno automatycznie generowanych przez AI, jak i tworzonych ręcznie. Aplikacja wspiera proces spaced repetition poprzez integrację z gotowym algorytmem powtórek. Użytkownikom zapewniony zostaje intuicyjny interfejs do wklejania tekstu, recenzji oraz edycji fiszek, a także prosty system rejestracji i logowania.

## 2. Problem użytkownika

Użytkownicy chcą szybko tworzyć wysokiej jakości fiszki edukacyjne, jednak ręczne tworzenie kartek jest czasochłonne, nieintuicyjne i wymaga dzielenia dużej ilości informacji na małe, zwięzłe fragmenty. Problem ten zniechęca do korzystania z efektywnych metod nauki, mimo ich udowodnionej skuteczności.

## 3. Wymagania funkcjonalne

- Generowanie fiszek przez AI:
  - Umożliwienie wklejania tekstu o długości od 1000 do 10000 znaków.
  - Wyświetlenie loadera podczas przetwarzania tekstu.
  - Automatyczne generowanie propozycji fiszek, które nie są zapisywane bez recenzji, a jedynie wyświetlane użytkownikowi.
- Recenzja fiszek:
  - Możliwość przeglądania wygenerowanych fiszek.
  - Edycja treści fiszek inline.
  - Opcje akceptacji lub odrzucenia każdej fiszki.
  - Zapisanie do bazy wyłącznie zaakceptowanych fiszek.
- Manualne tworzenie fiszek:
  - Przycisk "Stwórz nową fiszkę" umożliwiający utworzenie nowej fiszki.
  - Formularz z polami "przód" (do 200 znaków) i "tył" (do 500 znaków).
- Zarządzanie fiszkami:
  - Przeglądanie, edycja i usuwanie zapisanych fiszek w ramach widoku "Moje fiszki".
- System kont użytkowników:
  - Rejestracja i logowanie przy użyciu email oraz hasła.
  - Wysyłanie potwierdzenia rejestracji na email.
  - Stosowanie standardowych praktyk bezpieczeństwa.
  - Możliwość usunięcia konta wraz z fiszkami.
- Integracja z algorytmem powtórek:
  - Automatyczne przekazywanie zaakceptowanych fiszek do modułu spaced repetition (korzystanie z gotowego algorytmu).
- Walidacja danych na froncie, m.in. ograniczenie długości wprowadzanych tekstów.

## 4. Granice produktu

- Brak implementacji własnego, zaawansowanego algorytmu powtórek; integracja z gotowym rozwiązaniem (biblioteką open-source).
- Brak wsparcia dla importowania fiszek z plików PDF, DOCX itp.
- Brak funkcjonalności współdzielenia fiszek między użytkownikami.
- Produkt dostępny wyłącznie jako aplikacja web, bez wersji mobilnej.

## 5. Historyjki użytkowników

ID: US-001
Tytuł: Rejestracja i logowanie użytkownika
Opis: Jako nowy użytkownik chcę móc zarejestrować się za pomocą email i hasła, aby uzyskać dostęp do aplikacji i przechowywać swoje fiszki.
Kryteria akceptacji:

- Formularz rejestracyjny z wymaganymi polami.
- Wysłanie emaila z potwierdzeniem rejestracji.
- Możliwość logowania po potwierdzeniu konta.

ID: US-002
Tytuł: Generowanie fiszek przez AI
Opis: Jako użytkownik chcę wkleić tekst (min. 1000, max. 10000 znaków) w trybie AI, aby otrzymać propozycje fiszek wygenerowanych przez system.
Kryteria akceptacji:

- Pola umożliwiające wklejanie tekstu z odpowiednią walidacją długości.
- Wyświetlenie loadera podczas przetwarzania danych.
- Prezentacja wygenerowanych fiszek po zakończeniu przetwarzania.
- Fiszki nie są zapisywane do bazy bez recenzji przez użytkownika.

ID: US-003
Tytuł: Recenzja i edycja fiszek generowanych przez AI
Opis: Jako użytkownik chcę mieć możliwość recenzji, edycji inline oraz akceptacji lub odrzucenia fiszek wygenerowanych przez AI, aby zapisać tylko wartościowe fiszki.
Kryteria akceptacji:

- Interfejs umożliwiający edycję tekstu fiszki.
- Opcje akceptacji oraz odrzucenia każdej proponowanej fiszki.
- Zapisanie tylko zaakceptowanych fiszek po zatwierdzeniu recenzji.

ID: US-004
Tytuł: Manualne tworzenie fiszek
Opis: Jako użytkownik chcę mieć możliwość ręcznego tworzenia fiszek, aby móc dodawać treści, które nie zostały wygenerowane przez AI.
Kryteria akceptacji:

- Widoczny przycisk "Stwórz nową fiszkę".
- Formularz z polami "przód" (do 200 znaków) i "tył" (do 500 znaków).
- Prawidłowe zapisanie nowo utworzonych fiszek w systemie.

ID: US-005
Tytuł: Zarządzanie fiszkami
Opis: Jako użytkownik chcę przeglądać, edytować i usuwać fiszki zapisane w systemie, aby móc je na bieżąco aktualizować i usuwać.
Kryteria akceptacji:

- Wyświetlanie listy wszystkich zapisanych fiszek.
- Możliwość edycji istniejących fiszek poprzez interfejs.
- Opcja usunięcia fiszki z systemu z potwierdzeniem operacji.

ID: US-006
Tytuł: Integracja z algorytmem powtórek
Opis: Jako użytkownik chcę, aby dodane fiszki były dostepne w widoku "Nauka" opartym na zewnętrznym algorytmie powtórek, aby wspierać efektywną naukę zgodnie z metodą spaced repetition.
Kryteria akceptacji:

- Po zatwierdzeniu fiszek, system przekazuje dane do zewnętrznego modułu powtórek.
- Widoczne potwierdzenie integracji w interfejsie użytkownika.

ID: US-007
Tytuł: Bezpieczny dostęp i autoryzacja
Opis: Jako zalogowany użytkownik chcę mieć pewność, że moje fiszki nie są dostępne dla innych użytkowników, aby zachować prywatność i bezpieczeństwo danych.
Kryteria akceptacji:

- Tylko zalogowany użytkownik może wyświetlać, edytować i usuwać swoje fiszki.
- Nie ma dostępu do fiszek innych użytkowników ani możliwości współdzielenia.

## 6. Metryki sukcesu

- Minimum 75% fiszek generowanych przez AI musi być zaakceptowanych przez użytkownika.
- Co najmniej 75% nowych fiszek dodawanych do systemu powinno pochodzić z trybu AI.
- Monitorowanie efektywności poprzez analizę logów generacji fiszek.
