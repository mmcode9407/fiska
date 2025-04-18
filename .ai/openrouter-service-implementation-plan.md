# Przewodnik implementacji usługi OpenRouter

## 1. Opis usługi

Usługa OpenRouter umożliwia integrację z interfejsem API OpenRouter, co pozwala na wzbogacenie funkcjonalności czatu o generowane treści przy pomocy modeli LLM. Kluczowe cele usługi to:

1. Komunikacja z API OpenRouter w celu przesyłania zapytań i odbioru odpowiedzi.
2. Obsługa struktury wiadomości, w tym:
   - Komunikat systemowy: `{ role: 'system', content: [system-message] }`
   - Komunikat użytkownika: `{ role: 'user', content: [user-message] }`
3. Konfiguracja odpowiedzi przy użyciu `response_format`, który zawiera schemat JSON (JSON Schema) dla ustrukturyzowanych danych.
4. Dynamiczne ustawienie nazwy modelu oraz parametrów modelu, takich jak:
   - `parameter` (0.0 do 2.0, domyślnie 1.0)
   - `top_p` (0.0 do 1.0, domyślnie 1.0)
   - `frequency_penalty` (-2.0 do 2.0, domyślnie 0.0)
   - `presence_penalty` (-2.0 do 2.0, domyślnie 0.0)

## 2. Opis konstruktora

Konstruktor usługi odpowiada za:

1. Inicjalizację konfiguracji, w tym pobranie endpointu API i klucza API z bezpiecznych zmiennych środowiskowych.
2. Ustawienie domyślnych parametrów modelu oraz przygotowanie mechanizmów walidacji odpowiedzi za pomocą JSON Schema.
3. Inicjalizację modułu logowania błędów oraz konfigurację mechanizmów retry dla połączeń z API.

## 3. Publiczne metody i pola

Publiczne interfejsy usługi obejmują:

1. `setModelParameters(params: ModelParameters)`: Metoda pozwalająca na dynamiczną aktualizację parametrów modelu.
2. `sendMessage(payload: ChatPayload): Promise<ResponseData>`: Metoda wysyłająca komunikaty do API OpenRouter. Payload obejmuje:
   - Komunikat systemowy
   - Komunikat użytkownika
   - Konfigurację `response_format` z odpowiednim schematem JSON
   - Nazwę modelu
   - Parametry modelu (parameter, top_p, frequency_penalty, presence_penalty)
3. `getResponse()`: Metoda przetwarzająca odpowiedź z API, walidująca ją względem ustalonego JSON Schema i zwracająca ustrukturyzowane dane.

## 4. Prywatne metody i pola

Prywatna część usługi zawiera:

1. Prywatne pola:
   - `apiEndpoint`: URL endpointu API OpenRouter (pobrany ze zmiennych środowiskowych).
   - `apiKey`: Klucz API przechowywany bezpiecznie.
   - `defaultModelParams`: Domyślne ustawienia parametrów modelu.
2. Prywatne metody:
   - `_prepareRequestPayload(systemMsg, userMsg, responseFormat, model, modelParams)`: Łączy komunikaty systemowe i użytkownika z konfiguracją odpowiedzi oraz parametrami modelu w jeden obiekt zapytania.
   - `_validateResponse(response)`: Waliduje odpowiedź API przy użyciu zdefiniowanego JSON Schema.
   - `_handleError(error)`: Centralna metoda obsługi błędów, która zarządza różnymi scenariuszami (np. błędy sieciowe, walidacji, autoryzacji) oraz implementuje mechanizmy retry.

## 5. Obsługa błędów

Kluczowe scenariusze błędów i proponowane rozwiązania:

1. Błąd połączenia (timeout, niedostępność API).
   - Rozwiązanie: Implementacja mechanizmu retry oraz przekazywanie przyjaznych komunikatów błędów do użytkownika.
2. Niepoprawny format odpowiedzi (błąd walidacji JSON Schema).
   - Rozwiązanie: Logowanie szczegółowych informacji o błędzie, powiadamianie użytkownika o problemie z odpowiedzią, wdrożenie fallbacku.
3. Błędne parametry wejściowe lub konfiguracja requestu.
   - Rozwiązanie: Wstępna walidacja danych wejściowych i stosowanie guard clauses w metodach przygotowujących zapytania.
4. Błąd autoryzacji (np. niewłaściwy lub wygasły klucz API).
   - Rozwiązanie: Weryfikacja poprawności klucza API podczas inicjalizacji usługi oraz stosowanie bezpiecznego przechowywania kluczy.
5. Ograniczenia API (rate limit, throttling).
   - Rozwiązanie: Implementacja kolejkowania zapytań, opóźnień między kolejnymi wywołaniami oraz monitorowanie liczby zapytań.

## 6. Kwestie bezpieczeństwa

Podczas wdrażania usługi należy zwrócić uwagę na następujące aspekty:

1. Bezpieczeństwo kluczy API:
   - Przechowywanie kluczy w zmiennych środowiskowych, niedostępnych dla klienta.
   - Unikanie logowania wrażliwych danych.

## 7. Plan wdrożenia krok po kroku

1. Utworzenie pliku serwisu:
   - Stworzenie pliku `/src/lib/openrouter.service.ts` zawierającego implementację całej logiki usługi.
2. Inicjalizacja konfiguracji:
   - Pobranie endpointu API i klucza API ze zmiennych środowiskowych.
   - Ustawienie domyślnych parametrów modelu.
3. Implementacja prywatnych metod:
   - `_prepareRequestPayload`: Łączenie komunikatów oraz konfiguracji zapytania.
   - `_validateResponse`: Walidacja odpowiedzi API przy użyciu JSON Schema.
   - `_handleError`: Centralna metoda obsługi błędów oraz mechanizm retry.
4. Implementacja publicznych metod:
   - `setModelParameters`: Aktualizacja parametrów modelu.
   - `sendMessage`: Wysyłanie zapytania do API z obsługą struktury wiadomości (system, user) oraz konfiguracji odpowiedzi.
   - `getResponse`: Przetwarzanie odpowiedzi i walidacja zgodności ze schematem.
5. Integracja z interfejsem użytkownika:
   - Modyfikacja komponentów front-endowych (np. czatu) w celu wykorzystania metody `sendMessage`.
