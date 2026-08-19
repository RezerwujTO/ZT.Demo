# zarezerwujTO — landing page + demo CMS

Frontend demo platformy rezerwacji online dla **barberów, fryzjerów, salonów beauty i kosmetyczek**.
Projekt nie ma backendu — wszystkie dane pochodzą z warstwy demo działającej w przeglądarce.

## Co zawiera demo

| Widok | Ścieżka | Opis |
| --- | --- | --- |
| Landing page | `/` | Hero, jak to działa, funkcje, zespół specjalistów, cennik usług, rezerwacja online, opinie, FAQ |
| Logowanie / rejestracja | `/auth` | Formularz z animacją wpisywania danych demo — wystarczy kliknąć „Zaloguj się” |
| CMS | `/cms` | Dashboard, kalendarz tygodniowy, wizyty, klienci, usługi, zespół, godziny pracy, ustawienia, pomoc |
| Strony statyczne | `/regulamin`, `/polityka-prywatnosci`, `/polityka-serwisu` | |

### Jeden salon, wszystkie branże

Demo obsługuje **jedno konto** — Studio Vibe (Warszawa) — które łączy wszystkie branże w jednym grafiku,
bo w wersji produkcyjnej te same funkcje dziedziczy każdy typ salonu:

| Branża | Zespół | Przykładowe usługi |
| --- | --- | --- |
| Barber | Kamil Nowak, Michał Sowa | strzyżenie męskie, broda, combo, skin fade, strzyżenie dziecięce |
| Fryzjer | Julia Wiśniewska | strzyżenie damskie, koloryzacja, baleyage, upięcie, keratyna |
| Gabinet kosmetyczny | Natalia Dąbrowska | oczyszczanie wodorowe, peeling kwasami, mezoterapia, depilacja |
| Studio beauty | Ola Krupa, Weronika Bąk | manicure, pedicure, przedłużanie rzęs, laminacja brwi, makijaż |

Każda osoba ma własne godziny pracy, przerwy i przypisane usługi — landing page i CMS korzystają z tego samego zestawu danych.

## Jak działa warstwa demo

- `src/demo/dataset.ts` — dane źródłowe: salon, usługi, zespół, klienci, opinie, grafiki
- `src/demo/backend.ts` — implementacja logiki w pamięci: rezerwacje, wolne terminy, konflikty godzin, statystyki, powiadomienia
- `src/demo/typing.ts` — animacja wpisywania danych logowania
- `src/lib/api/*` — to samo API co wcześniej, ale odpowiedzi zwraca warstwa demo (z symulowanym opóźnieniem sieci)

Dane trzymane są **wyłącznie w pamięci** — odświeżenie strony przywraca komplet danych startowych.
Logowanie akceptuje dowolne dane; rezerwacja złożona na landingu pojawia się od razu w kalendarzu CMS.

## Uruchomienie

```sh
npm install
npm run dev
```

Budowanie wersji produkcyjnej (statyczne pliki w `dist/`):

```sh
npm run build
npm run preview
```

## Deploy (Vercel)

Repozytorium jest gotowe pod statyczny hosting — konfiguracja siedzi w `vercel.json`:

- `installCommand`: `npm ci` (deterministyczna instalacja z `package-lock.json`)
- `buildCommand`: `npm run build-only` (sam `vite build`, bez kroku `vue-tsc`)
- `outputDirectory`: `dist`
- rewrite `/(.*) → /index.html`, żeby działały bezpośrednie linki do `/cms`, `/licencja` i pozostałych tras SPA
- wersja Node z pliku `.node-version` (22)

Nie są potrzebne żadne zmienne środowiskowe — aplikacja nie łączy się z backendem.

## Skrypty

- `npm run dev` — serwer deweloperski Vite
- `npm run build` — sprawdzenie typów + build produkcyjny
- `npm run type-check` — `vue-tsc`
- `npm run format` — Prettier

## Stack

Vue 3 + TypeScript + Vite, Vue Router, Pinia, Bootstrap 5 i Bootstrap Icons.
