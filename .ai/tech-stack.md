Frontend - Astro z React dla komponentów interaktywnych:

- Astro 5 pozwala na tworzenie szybkich, wydajnych stron i aplikacji z minimalną ilością JavaScript
- React 19 zapewni interaktywność tam, gdzie jest potrzebna
- TypeScript 5 dla statycznego typowania kodu i lepszego wsparcia IDE
- Tailwind 4 pozwala na wygodne stylowanie aplikacji
- Shadcn/ui zapewnia bibliotekę dostępnych komponentów React, na których oprzemy UI

Backend - Supabase jako kompleksowe rozwiązanie backendowe:

- Zapewnia bazę danych PostgreSQL
- Zapewnia SDK w wielu językach, które posłużą jako Backend-as-a-Service
- Jest rozwiązaniem open source, które można hostować lokalnie lub na własnym serwerze
- Posiada wbudowaną autentykację użytkowników

AI - Komunikacja z modelami przez usługę Openrouter.ai:

- Dostęp do szerokiej gamy modeli (OpenAI, Anthropic, Google i wiele innych), które pozwolą nam znaleźć rozwiązanie zapewniające wysoką efektywność i niskie koszta
- Pozwala na ustawianie limitów finansowych na klucze API

Testing - Narzędzia do automatycznego testowania:

- Testy jednostkowe i integracyjne:
  - Vitest jako framework testowy zintegrowany z Vite (szybki, ze wsparciem dla TypeScript)
  - React Testing Library do testowania komponentów React
  - MSW (Mock Service Worker) do mockowania API na poziomie sieciowym
  - @testing-library/jest-dom dla dodatkowych matcherów DOM
  - Vitest Coverage (@vitest/coverage-v8) do mierzenia pokrycia kodu testami
- Testy E2E:
  - Playwright do kompleksowego testowania aplikacji w różnych przeglądarkach (Chromium, Firefox, WebKit)
  - Wsparcie dla nagrywania testów i automatycznego oczekiwania na elementy UI
  - Możliwość testowania komponentów React w izolowanym środowisku przeglądarkowym

CI/CD i Hosting:

- Github Actions do tworzenia pipeline'ów CI/CD
- Cloudflare Pages jako hosting aplikacji Astro
