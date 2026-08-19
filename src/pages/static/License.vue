<template>
  <div class="policy-wrapper">
    <nav class="policy-nav">
      <div class="container">
        <router-link to="/" class="policy-brand">
          <i class="bi-calendar2-check me-2"></i>ZAREZERWUJ<span>TO</span>
        </router-link>
      </div>
    </nav>

    <main class="policy-content">
      <div class="container">
        <div class="policy-header">
          <div class="policy-icon"><i class="bi-patch-check"></i></div>
          <h1>Licencja CMS dla salonów</h1>
          <p class="policy-updated">Barbershopy, salony fryzjerskie, gabinety kosmetyczne i studia beauty</p>
        </div>

        <section class="policy-section">
          <h2>Czym jest licencja</h2>
          <p>
            Licencja obejmuje dostęp do panelu zarezerwujTO dla jednego salonu — kalendarz zespołu, bazę klientów,
            cennik usług, grafiki pracy oraz stronę z rezerwacją online. Warunki ustalamy indywidualnie,
            na podstawie liczby stanowisk i zakresu wdrożenia.
          </p>
          <ul>
            <li>Nielimitowana liczba wizyt i klientów w panelu.</li>
            <li>Osobne grafiki, usługi i przerwy dla każdego specjalisty.</li>
            <li>Powiadomienia e-mail i SMS o rezerwacjach oraz przypomnienia dla klientów.</li>
            <li>Wdrożenie, migracja danych z arkusza lub zeszytu i szkolenie zespołu.</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>Pięć wariantów landing page</h2>
          <p>
            Każdy wariant to dokładnie ta sama strona, którą widzisz w wersji demonstracyjnej — ten sam układ sekcji,
            ten sam moduł rezerwacji i te same funkcje. Różnicę robi warstwa wizualna: typografia, kolorystyka
            oraz styl komponentów.
          </p>
          <div class="license-grid">
            <div v-for="variant in variants" :key="variant.name" class="license-card">
              <div class="license-card-ico"><i :class="variant.icon"></i></div>
              <h3>{{ variant.name }}</h3>
              <p>{{ variant.description }}</p>
              <div class="license-card-meta">
                <span><i class="bi-type"></i> {{ variant.font }}</span>
                <span><i class="bi-palette"></i> {{ variant.palette }}</span>
              </div>
            </div>
          </div>

          <div class="license-split">
            <div class="license-split-col">
              <h3><i class="bi-arrow-repeat"></i> Bez zmian w każdym wariancie</h3>
              <ul>
                <li>Układ i kolejność sekcji strony.</li>
                <li>Rezerwacja online w trzech krokach z wolnymi terminami z panelu.</li>
                <li>Lista specjalistów, cennik usług, opinie i FAQ.</li>
                <li>Wersje mobilna i tabletowa oraz ustawienia SEO.</li>
              </ul>
            </div>
            <div class="license-split-col">
              <h3><i class="bi-brush"></i> Co odróżnia warianty</h3>
              <ul>
                <li>Typografia — kroje pisma, wielkości i sposób prowadzenia nagłówków.</li>
                <li>Kolorystyka — tło, kolor akcentu, kontrast i stany przycisków.</li>
                <li>Komponenty — karty, obramowania, zaokrąglenia, cienie i ikony.</li>
                <li>Zdjęcia i teksty dopasowane do Twojego salonu.</li>
              </ul>
            </div>
          </div>

          <p>
            Wariant wybierasz na starcie i możesz go zmienić w trakcie trwania licencji — treści, usługi i zespół
            przenoszą się automatycznie, bo pochodzą z panelu.
          </p>
        </section>

        <section class="policy-section">
          <h2>Masz już własną stronę? Podepniemy do niej rezerwacje</h2>
          <p>
            Zostajesz przy swojej witrynie i adresie — dokładamy do niej moduł rezerwacji połączony z panelem,
            więc wizyty trafiają prosto do kalendarza.
          </p>
          <ul>
            <li>Moduł rezerwacji osadzony w Twojej stronie lub jako osobna podstrona pod Twoją domeną.</li>
            <li>Synchronizacja cennika, zespołu i godzin pracy — zmiana w panelu od razu widoczna w rezerwacji.</li>
            <li>Zachowanie dotychczasowych adresów URL i pozycji w wyszukiwarce.</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>Import bazy</h2>
          <p>
            Przenosimy wyłącznie dane — samej strony nie importujemy. Bazę przygotowujemy razem z Tobą
            i wgrywamy do panelu przed startem.
          </p>
          <ul>
            <li>Baza klientów: imię i nazwisko, telefon, e-mail, notatki.</li>
            <li>Historia wizyt wraz z usługą, ceną i osobą wykonującą.</li>
            <li>Cennik usług z czasem trwania oraz przypisaniem do specjalistów.</li>
            <li>Format: arkusz CSV lub XLSX albo eksport danych z obecnego systemu.</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>Jak to wygląda krok po kroku</h2>
          <ul>
            <li><strong>1. Kontakt</strong> — piszesz do nas, opisujesz salon, zespół i obecną stronę.</li>
            <li><strong>2. Prezentacja</strong> — pokazujemy panel na Twoich danych i szablony landing page.</li>
            <li><strong>3. Wycena</strong> — dostajesz warunki licencji dopasowane do liczby stanowisk i zakresu wdrożenia.</li>
            <li><strong>4. Start</strong> — konfigurujemy konto, wybrany wariant strony, importujemy bazę i uruchamiamy rezerwacje.</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>Kontakt w sprawie licencji</h2>
          <div class="license-contacts">
            <a class="license-contact" href="mailto:licencje@zarezerwujto.pl">
              <i class="bi-envelope"></i>
              <span>
                <strong>licencje@zarezerwujto.pl</strong>
                <small>Odpowiadamy w 1 dzień roboczy</small>
              </span>
            </a>
          </div>
          <p class="license-note">
            Napisz, ile masz stanowisk, który wariant strony Cię interesuje i czy potrzebujesz importu bazy —
            przygotujemy wycenę i termin wdrożenia.
          </p>
        </section>
      </div>
    </main>

    <footer class="policy-footer">
      <div class="container d-flex flex-wrap gap-3 justify-content-between">
        <router-link to="/" class="back-link"><i class="bi-arrow-left me-1"></i>Wróć na stronę główną</router-link>
        <router-link to="/regulamin" class="back-link">Regulamin</router-link>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LicenseContact',
  setup() {
    const variants = [
      {
        name: 'Slate — wariant demo',
        icon: 'bi-circle-half',
        description: 'Bazowy wygląd znany z wersji demonstracyjnej: stonowana ciemna baza i chłodny akcent.',
        font: 'DM Sans',
        palette: 'Grafit i błękit',
      },
      {
        name: 'Barber Classic',
        icon: 'bi-scissors',
        description: 'Mocniejsze, szeryfowe nagłówki i cieplejszy kontrast — czytelny, klasyczny charakter.',
        font: 'Playfair Display + Inter',
        palette: 'Czerń, brąz i miedź',
      },
      {
        name: 'Soft Beauty',
        icon: 'bi-flower1',
        description: 'Jasny motyw z delikatnymi zaokrągleniami kart i subtelnymi cieniami.',
        font: 'Poppins',
        palette: 'Beż, pudrowy róż i biel',
      },
      {
        name: 'Mono Minimal',
        icon: 'bi-square',
        description: 'Ostre krawędzie, dużo powietrza, komponenty bez cieni i mocno ograniczona paleta.',
        font: 'Inter Tight',
        palette: 'Biel, czerń i szarość',
      },
      {
        name: 'Neon Studio',
        icon: 'bi-lightning-charge',
        description: 'Wysoki kontrast, wyraziste przyciski i akcentowe obramowania kart.',
        font: 'Space Grotesk',
        palette: 'Granat, fiolet i limonka',
      },
    ]

    return { variants }
  },
})
</script>

<style scoped>
.policy-wrapper {
  --c0: #0b1215; --c1: #0f181c; --c2: #142024; --c3: #1a2a30;
  --c4: #23373e; --c5: #2e4750; --ct: #d4dfe3; --cd: #a6bac2; --ca: #7fb3c2;
  --radius: 12px; --radius-sm: 8px;
  min-height: 100vh; background: var(--c0); color: var(--ct);
  font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased;
}
.policy-nav { padding: 14px 0; border-bottom: 1px solid var(--c3); background: var(--c1); }
.policy-brand { font-weight: 700; font-size: 1.15rem; color: var(--ct); text-decoration: none; letter-spacing: 2px; }
.policy-brand i { color: var(--ca); }
.policy-brand span { color: var(--ca); }
.policy-content { max-width: 780px; margin: 0 auto; padding: 48px 24px 80px; }
.policy-header { text-align: center; margin-bottom: 48px; }
.policy-icon { width: 64px; height: 64px; border-radius: 50%; background: var(--c2); border: 1px solid var(--c4); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 1.6rem; color: var(--ca); }
.policy-header h1 { font-size: clamp(1.4rem, 3vw, 2rem); margin-bottom: 8px; }
.policy-updated { font-size: 0.78rem; color: var(--cd); }
.policy-section { margin-bottom: 32px; }
.policy-section h2 { font-size: 1rem; font-weight: 700; color: var(--ca); margin-bottom: 12px; letter-spacing: 0.3px; }
.policy-section p { font-size: 0.88rem; color: var(--cd); line-height: 1.8; margin-bottom: 12px; }
.policy-section ul { padding-left: 20px; margin-bottom: 12px; }
.policy-section li { font-size: 0.88rem; color: var(--cd); line-height: 1.8; margin-bottom: 6px; }
.policy-section a { color: var(--ca); text-decoration: none; font-weight: 500; }
.policy-section a:hover { text-decoration: underline; }
.policy-footer { border-top: 1px solid var(--c3); padding: 20px 0; background: var(--c1); }
.back-link { color: var(--cd); text-decoration: none; font-size: 0.82rem; font-weight: 500; transition: color 0.2s; }
.back-link:hover { color: var(--ct); }

.license-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin: 16px 0 20px; }
.license-card { background: var(--c1); border: 1px solid var(--c3); border-radius: var(--radius); padding: 18px; transition: border-color 0.2s; }
.license-card:hover { border-color: var(--c5); }
.license-card-ico { width: 38px; height: 38px; border-radius: var(--radius-sm); background: var(--c2); border: 1px solid var(--c3); display: flex; align-items: center; justify-content: center; color: var(--ca); font-size: 1rem; margin-bottom: 12px; }
.license-card h3 { font-size: 0.92rem; font-weight: 700; color: var(--ct); margin-bottom: 6px; }
.license-card p { font-size: 0.82rem; color: var(--cd); line-height: 1.7; margin: 0; }
.license-card-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.license-card-meta span { display: inline-flex; align-items: center; gap: 5px; font-size: 0.7rem; color: var(--cd); background: var(--c2); border: 1px solid var(--c3); border-radius: 50px; padding: 4px 10px; }
.license-card-meta i { color: var(--ca); font-size: 0.72rem; }

.license-split { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; margin: 16px 0 20px; }
.license-split-col { background: var(--c1); border: 1px solid var(--c3); border-radius: var(--radius); padding: 18px 20px; }
.license-split-col h3 { display: flex; align-items: center; gap: 8px; font-size: 0.86rem; font-weight: 700; color: var(--ct); margin-bottom: 10px; }
.license-split-col h3 i { color: var(--ca); }
.license-split-col ul { padding-left: 18px; margin: 0; }
.license-split-col li { font-size: 0.82rem; }

.license-contacts { display: flex; }
.license-contact {
  display: inline-flex; align-items: center; gap: 14px;
  padding: 16px 18px; background: var(--c1); border: 1px solid var(--c3);
  border-radius: var(--radius); text-decoration: none; transition: border-color 0.2s;
}
.license-contact:hover { border-color: var(--c5); text-decoration: none; }
.license-contact i { font-size: 1.2rem; color: var(--ca); }
.license-contact strong { display: block; font-size: 0.92rem; color: var(--ct); }
.license-contact small { display: block; font-size: 0.74rem; color: var(--cd); margin-top: 2px; }
.license-note { margin-top: 14px; }

@media (max-width: 575px) {
  .policy-content { padding: 32px 16px 60px; }
  .license-grid { grid-template-columns: 1fr; }
}
</style>
