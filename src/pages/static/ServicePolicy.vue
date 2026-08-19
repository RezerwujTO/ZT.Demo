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
          <div class="policy-icon"><i class="bi-gear"></i></div>
          <h1>Polityka Serwisu</h1>
          <p class="policy-updated">Ostatnia aktualizacja: 16 sierpnia 2026 r.</p>
        </div>

        <section class="policy-section">
          <h2>1. Postanowienia ogólne</h2>
          <p>Niniejsza Polityka Serwisu określa zasady korzystania z platformy zarezerwujTO, dostępnej pod adresem zarezerwujto.pl, zwanej dalej „Serwisem". Korzystanie z Serwisu oznacza akceptację poniższych warunków.</p>
        </section>

        <section class="policy-section">
          <h2>2. Zakres usług</h2>
          <p>zarezerwujTO jest platformą pośredniczącą między klientami a salonami. Serwis umożliwia:</p>
          <ul>
            <li>Wyszukiwanie barberów, fryzjerów, kosmetyczek i salonów beauty w całej Polsce.</li>
            <li>Rezerwację wizyt online bez konieczności zakładania konta przez klienta.</li>
            <li>Zarządzanie kalendarzem, klientami i rezerwacjami przez salony.</li>
            <li>Automatyczne powiadomienia e-mail i SMS o wizytach.</li>
            <li>System opinii i ocen salonów.</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>3. Dostępność serwisu</h2>
          <p>Staramy się zapewnić ciągłość działania Serwisu 24/7. Zastrzegamy sobie prawo do przerw technicznych niezbędnych do konserwacji i aktualizacji systemu. O planowanych przerwach informujemy z wyprzedzeniem.</p>
        </section>

        <section class="policy-section">
          <h2>4. Rezerwacje</h2>
          <p>Rezerwacja wizyty przez Serwis jest bezpłatna dla klienta. zarezerwujTO nie pobiera prowizji od rezerwacji. Warunki anulowania i zmiany rezerwacji określa indywidualnie każdy salon. Domyślnie klient może anulować rezerwację nie później niż 2 godziny przed planowanym terminem.</p>
        </section>

        <section class="policy-section">
          <h2>5. Odpowiedzialność</h2>
          <p>zarezerwujTO jest platformą pośredniczącą i nie ponosi odpowiedzialności za:</p>
          <ul>
            <li>Jakość usług świadczonych przez salony.</li>
            <li>Odwołanie lub zmianę terminu wizyty przez salon.</li>
            <li>Szkody wynikłe z nieprawdziwych informacji podanych przez salony.</li>
            <li>Transakcje finansowe między klientem a salonem.</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>6. Zasady korzystania</h2>
          <p>Użytkownik zobowiązuje się do:</p>
          <ul>
            <li>Podawania prawdziwych danych przy rejestracji i rezerwacji.</li>
            <li>Nienadużywania systemu rezerwacji (wielokrotne rezerwacje bez zamiaru wizyty).</li>
            <li>Niepodejmowania prób destabilizacji lub naruszenia bezpieczeństwa Serwisu.</li>
            <li>Przestrzegania niniejszej Polityki i Regulaminu.</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>7. Własność intelektualna</h2>
          <p>Wszelkie treści, znaki towarowe, grafiki i kod źródłowy Serwisu stanowią własność zarezerwujTO i są chronione prawem autorskim. Kopiowanie lub rozpowszechnianie bez zgody jest zabronione.</p>
        </section>

        <section class="policy-section">
          <h2>8. Zmiany polityki</h2>
          <p>Zastrzegamy sobie prawo do zmiany niniejszej Polityki Serwisu. Zmiany wchodzą w życie z dniem publikacji w Serwisie. O istotnych zmianach poinformujemy e-mailem.</p>
        </section>

        <section class="policy-section">
          <h2>9. Kontakt</h2>
          <p>W sprawach dotyczących Serwisu prosimy o kontakt: <a href="mailto:kontakt@zarezerwujto.pl">kontakt@zarezerwujto.pl</a></p>
        </section>
      </div>
    </main>

    <footer class="policy-footer">
      <div class="container">
        <router-link to="/" class="back-link"><i class="bi-arrow-left me-1"></i>Powrót do strony głównej</router-link>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({ name: 'ServicePolicy' })
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
</style>
