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
          <div class="policy-icon"><i class="bi-shield-lock"></i></div>
          <h1>Polityka Prywatności</h1>
          <p class="policy-updated">Ostatnia aktualizacja: 16 sierpnia 2026 r.</p>
        </div>

        <section class="policy-section">
          <h2>1. Administrator danych</h2>
          <p>Administratorem danych osobowych jest zarezerwujTO, dalej zwany „Serwisem". Kontakt: <a href="mailto:kontakt@zarezerwujto.pl">kontakt@zarezerwujto.pl</a></p>
        </section>

        <section class="policy-section">
          <h2>2. Jakie dane zbieramy</h2>
          <p>W ramach Serwisu zbieramy następujące dane osobowe:</p>
          <ul>
            <li><strong>Dane konta salonu:</strong> imię, nazwisko, adres e-mail, numer telefonu, nazwa salonu, miasto.</li>
            <li><strong>Dane klienta przy rezerwacji:</strong> imię, nazwisko, numer telefonu, adres e-mail.</li>
            <li><strong>Dane techniczne:</strong> adres IP, typ przeglądarki, system operacyjny, dane o aktywności w Serwisie.</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>3. Cel i podstawa prawna przetwarzania</h2>
          <p>Dane osobowe przetwarzamy w następujących celach:</p>
          <ul>
            <li>Świadczenie usług rezerwacji wizyt — art. 6 ust. 1 lit. b RODO.</li>
            <li>Realizacja umowy z właścicielem salonu — art. 6 ust. 1 lit. b RODO.</li>
            <li>Wysyłanie powiadomień e-mail i SMS o wizytach — art. 6 ust. 1 lit. f RODO.</li>
            <li>Marketing usług Serwisu — art. 6 ust. 1 lit. a RODO (za zgodą).</li>
            <li>Wypełnienie obowiązków prawnych (faktury, podatki) — art. 6 ust. 1 lit. c RODO.</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>4. Okres przechowywania danych</h2>
          <p>Dane przechowujemy przez okres świadczenia usług oraz przez 5 lat od ostatniej aktywności, chyba że przepisy prawa nakazują dłuższe przechowywanie. Dane klientów bez konta są usuwane po 24 miesiącach od ostatniej rezerwacji.</p>
        </section>

        <section class="policy-section">
          <h2>5. Udostępnianie danych</h2>
          <p>Dane mogą być udostępniane:</p>
          <ul>
            <li>Salonom, w których dokonano rezerwacji (imię, telefon, usługa).</li>
            <li>Dostawcy usług e-mail i SMS (Resend) w celu wysyłki powiadomień.</li>
            <li>Organom państwowym na podstawie obowiązujących przepisów prawa.</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>6. Prawa użytkownika</h2>
          <p>Przysługują Ci następujące prawa:</p>
          <ul>
            <li>Prawo dostępu do danych i otrzymania ich kopii.</li>
            <li>Prawo do sprostowania danych.</li>
            <li>Prawo do usunięcia danych („prawo do bycia zapomnianym").</li>
            <li>Prawo do ograniczenia przetwarzania.</li>
            <li>Prawo do przenoszenia danych.</li>
            <li>Prawo do wniesienia sprzeciwu wobec przetwarzania.</li>
            <li>Prawo do cofnięcia zgody w dowolnym momencie.</li>
            <li>Prawo do wniesienia skargi do Prezesa UODO.</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>7. Pliki cookies</h2>
          <p>Serwis wykorzystuje pliki cookies niezbędne do funkcjonowania (sesja, autoryzacja) oraz analityczne. Możesz zarządzać cookies w ustawieniach przeglądarki. Wyłączenie cookies może ograniczyć funkcjonalność Serwisu.</p>
        </section>

        <section class="policy-section">
          <h2>8. Bezpieczeństwo</h2>
          <p>Stosujemy środki techniczne i organizacyjne chroniące dane przed nieautoryzowanym dostępem, w tym szyfrowanie połączeń (TLS), hashowanie haseł (Argon2) oraz kontrolę dostępu na poziomie ról.</p>
        </section>

        <section class="policy-section">
          <h2>9. Zmiany polityki</h2>
          <p>Zastrzegamy sobie prawo do zmiany niniejszej polityki. O istotnych zmianach poinformujemy e-mailem lub komunikatem w Serwisie. Dalsze korzystanie z Serwisu po zmianach oznacza akceptację nowej polityki.</p>
        </section>

        <section class="policy-section">
          <h2>10. Kontakt</h2>
          <p>W sprawach dotyczących ochrony danych osobowych prosimy o kontakt: <a href="mailto:kontakt@zarezerwujto.pl">kontakt@zarezerwujto.pl</a></p>
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
export default defineComponent({ name: 'PrivacyPolicy' })
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
