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
          <div class="policy-icon"><i class="bi-file-earmark-text"></i></div>
          <h1>Regulamin</h1>
          <p class="policy-updated">Ostatnia aktualizacja: 16 sierpnia 2026 r.</p>
        </div>

        <section class="policy-section">
          <h2>§1 Definicje</h2>
          <ul>
            <li><strong>Serwis</strong> — platforma zarezerwujTO dostępna pod adresem zarezerwujto.pl.</li>
            <li><strong>Użytkownik</strong> — każda osoba korzystająca z Serwisu.</li>
            <li><strong>Klient</strong> — osoba rezerwująca wizytę w salonie za pośrednictwem Serwisu.</li>
            <li><strong>Salon</strong> — barbershop, salon fryzjerski, gabinet kosmetyczny lub studio beauty zarejestrowane w Serwisie.</li>
            <li><strong>Rezerwacja</strong> — umówiona wizyta w salonie dokonana przez Serwis.</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>§2 Postanowienia ogólne</h2>
          <p>Regulamin określa zasady korzystania z Serwisu zarezerwujTO. Korzystanie z Serwisu oznacza akceptację niniejszego Regulaminu. Serwis świadczy usługi drogą elektroniczną w rozumieniu ustawy z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną.</p>
        </section>

        <section class="policy-section">
          <h2>§3 Rejestracja i konto</h2>
          <p>Rejestracja w Serwisie jest przeznaczona dla właścicieli i pracowników salonów. Klienci mogą rezerwować wizyty bez zakładania konta. Przy rejestracji użytkownik zobowiązuje się do podania prawdziwych danych. zarezerwujTO zastrzega sobie prawo do weryfikacji danych i zawieszenia konta w przypadku wykrycia nieprawidłowości.</p>
        </section>

        <section class="policy-section">
          <h2>§4 Rezerwacje</h2>
          <p>Rezerwacja wizyty odbywa się poprzez formularz w Serwisie. Po dokonaniu rezerwacji klient otrzymuje potwierdzenie na podany adres e-mail. Salon otrzymuje powiadomienie o nowej rezerwacji w panelu salonu. Ceny usług są ustalane przez salony i mogą się różnić.</p>
        </section>

        <section class="policy-section">
          <h2>§5 Anulowanie i zmiana rezerwacji</h2>
          <p>Klient może anulować lub zmienić rezerwację nie później niż 2 godziny przed planowanym terminem, chyba że salon określił inne warunki. Anulowanie odbywa się poprzez link w e-mailu z potwierdzeniem. W przypadku nieodwołania wizyty salon może naliczyć opłatę zgodnie z własnym regulaminem.</p>
        </section>

        <section class="policy-section">
          <h2>§6 Obowiązki salonów</h2>
          <p>Salony korzystające z Serwisu zobowiązują się do:</p>
          <ul>
            <li>Utrzymywania aktualnego grafiku godzin pracy.</li>
            <li>Realizacji potwierdzonych rezerwacji.</li>
            <li>Poinformowania klienta o konieczności odwołania wizyty z wyprzedzeniem.</li>
            <li>Podawania rzetelnych informacji o usługach i cenach.</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>§7 Odpowiedzialność</h2>
          <p>zarezerwujTO nie ponosi odpowiedzialności za jakość usług świadczonych przez salony. zarezerwujTO nie jest stroną umowy między klientem a salonem. Serwis udostępnia jedynie narzędzia do rezerwacji i zarządzania. Odpowiedzialność zarezerwujTO ogranicza się do wartości usługi pośrednictwa.</p>
        </section>

        <section class="policy-section">
          <h2>§8 Reklamacje</h2>
          <p>Reklamacje dotyczące działania Serwisu należy kierować na adres <a href="mailto:kontakt@zarezerwujto.pl">kontakt@zarezerwujto.pl</a>. zarezerwujTO rozpatruje reklamacje w ciągu 14 dni roboczych. Reklamacje dotyczące usług salonów należy kierować bezpośrednio do danego salonu.</p>
        </section>

        <section class="policy-section">
          <h2>§9 Własność intelektualna</h2>
          <p>Wszelkie treści dostępne w Serwisie, w tym logotypy, grafiki, kod źródłowy i teksty, stanowią własność zarezerwujTO i są chronione prawem autorskim. Kopiowanie, modyfikowanie lub rozpowszechnianie tych treści bez pisemnej zgody jest zabronione.</p>
        </section>

        <section class="policy-section">
          <h2>§10 Ochrona danych osobowych</h2>
          <p>Zasady przetwarzania danych osobowych określa <router-link to="/polityka-prywatnosci">Polityka Prywatności</router-link>, stanowiąca integralną część niniejszego Regulaminu.</p>
        </section>

        <section class="policy-section">
          <h2>§11 Postanowienia końcowe</h2>
          <p>Regulamin wchodzi w życie z dniem publikacji w Serwisie. zarezerwujTO zastrzega sobie prawo do zmiany Regulaminu. O zmianach poinformujemy e-mailem lub komunikatem w Serwisie z 14-dniowym wyprzedzeniem. W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego. Ewentualne spory rozstrzyga sąd właściwy dla siedziby zarezerwujTO.</p>
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
export default defineComponent({ name: 'Regulamin' })
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
.policy-section router-link { color: var(--ca); text-decoration: none; font-weight: 500; }
.policy-footer { border-top: 1px solid var(--c3); padding: 20px 0; background: var(--c1); }
.back-link { color: var(--cd); text-decoration: none; font-size: 0.82rem; font-weight: 500; transition: color 0.2s; }
.back-link:hover { color: var(--ct); }
</style>
