<template>
  <div class="error-wrapper">
    <div class="error-bg"></div>

    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="#" @click.prevent="goHome">
          <i class="bi-calendar2-check me-2 brand-icon"></i>
          <span class="brand-text">ZAREZERWUJ<span class="brand-accent">TO</span></span>
        </a>
      </div>
    </nav>

    <div class="error-content">
      <div class="error-code-wrap">
        <span class="error-code">4</span>
        <div class="error-icon-ring">
          <i class="bi-scissors error-icon"></i>
        </div>
        <span class="error-code">4</span>
      </div>

      <h1 class="error-title">Strona nie znaleziona</h1>
      <p class="error-desc">
        Strona, której szukasz, nie istnieje lub została przeniesiona.
      </p>

      <div class="error-actions">
        <button class="btn btn-cta btn-lg" @click="goHome">
          <i class="bi-house me-2"></i>Strona główna
        </button>
        <button class="btn btn-ghost btn-lg" @click="goBack">
          <i class="bi-arrow-left me-2"></i>Wstecz
        </button>
      </div>

      <div class="error-suggestions">
        <p class="suggestions-label">Może Cię zainteresuje:</p>
        <div class="suggestions-links">
          <a href="#barbers" @click.prevent="goHomeHash('#barbers')"><i class="bi-people me-1"></i>Znajdź salon</a>
          <a href="#services" @click.prevent="goHomeHash('#services')"><i class="bi-scissors me-1"></i>Usługi</a>
          <a href="#booking" @click.prevent="goHomeHash('#booking')"><i class="bi-calendar-check me-1"></i>Rezerwacja</a>
          <router-link to="/auth"><i class="bi-person-lock me-1"></i>Panel salonu</router-link>
        </div>
      </div>
    </div>

    <footer class="error-footer">
      <div class="container text-center">
        <p class="dim small mb-0">© 2026 zarezerwujTO</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Error404',
  setup() {
    const router = useRouter()

    const goHome = () => router.push('/')
    const goBack = () => {
      if (window.history.length > 1) window.history.back()
      else router.push('/')
    }
    const goHomeHash = (hash: string) => router.push(`/${hash}`)

    return { goHome, goBack, goHomeHash }
  },
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

.error-wrapper {
  --c0: #0b1215;
  --c1: #0f181c;
  --c2: #142024;
  --c3: #1a2a30;
  --c4: #23373e;
  --c5: #2e4750;
  --ct: #d4dfe3;
  --cd: #a6bac2;
  --ca: #7fb3c2;
  --radius: 12px;
  --radius-sm: 8px;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--c0);
  color: var(--ct);
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  position: relative;
  overflow: hidden;
}

.error-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(127,179,194,0.05) 0%, transparent 70%);
  pointer-events: none;
}

.navbar {
  padding: 14px 0;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.brand-icon { font-size: 1.3rem; color: var(--ca); }
.brand-text { font-weight: 700; font-size: 1.15rem; color: var(--ct); letter-spacing: 2px; }
.brand-accent { color: var(--ca); }

.error-content {
  text-align: center;
  position: relative;
  z-index: 2;
  padding: 80px 24px 40px;
}

.error-code-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.error-code {
  font-size: clamp(5rem, 12vw, 9rem);
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(135deg, var(--ca) 0%, var(--c5) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-icon-ring {
  width: clamp(72px, 10vw, 110px);
  height: clamp(72px, 10vw, 110px);
  border-radius: 50%;
  background: var(--c2);
  border: 2px solid var(--c4);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 4s ease-in-out infinite;
}

.error-icon {
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  color: var(--ca);
  animation: spin-slow 6s linear infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-title {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: -0.3px;
}

.error-desc {
  font-size: 0.95rem;
  color: var(--cd);
  max-width: 420px;
  margin: 0 auto 36px;
  line-height: 1.7;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.btn {
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.btn-cta {
  background: var(--ca);
  color: var(--c0);
}

.btn-cta:hover {
  background: #93c5d2;
  color: var(--c0);
  transform: translateY(-1px);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--c4);
  color: var(--ct);
}

.btn-ghost:hover {
  background: var(--c2);
  color: var(--ct);
}

.error-suggestions {
  padding-top: 32px;
  border-top: 1px solid var(--c3);
  max-width: 460px;
  margin: 0 auto;
}

.suggestions-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--cd);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 16px;
}

.suggestions-links {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.suggestions-links a {
  color: var(--cd);
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 500;
  padding: 8px 16px;
  border: 1px solid var(--c3);
  border-radius: 50px;
  transition: all 0.2s;
}

.suggestions-links a:hover {
  color: var(--ct);
  border-color: var(--c5);
  background: var(--c2);
}

.dim { color: var(--cd) !important; }

.error-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 0;
  border-top: 1px solid var(--c3);
}

@media (max-width: 575px) {
  .error-code-wrap { gap: 8px; }
  .suggestions-links { gap: 8px; }
  .suggestions-links a { font-size: 0.72rem; padding: 6px 12px; }
}
</style>
