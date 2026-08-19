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
        <span class="error-code">5</span>
        <div class="error-icon-ring">
          <i class="bi-exclamation-triangle error-icon"></i>
        </div>
        <span class="error-code">0</span>
      </div>

      <h1 class="error-title">Coś poszło nie tak</h1>
      <p class="error-desc">
        Nasz serwer napotkał problem. Pracujemy nad naprawą. Spróbuj ponownie za chwilę.
      </p>

      <div class="error-actions">
        <button class="btn btn-cta btn-lg" @click="reload">
          <i class="bi-arrow-clockwise me-2"></i>Spróbuj ponownie
        </button>
        <button class="btn btn-ghost btn-lg" @click="goHome">
          <i class="bi-house me-2"></i>Strona główna
        </button>
      </div>

      <div class="error-status">
        <div class="status-indicator">
          <span class="status-dot"></span>
          <span class="status-label">Sprawdzamy problem...</span>
        </div>
        <p class="status-info">
          Jeśli problem się powtarza, skontaktuj się z nami pod adresem
          <a href="mailto:pomoc@zarezerwujto.pl" class="status-link">pomoc@zarezerwujto.pl</a>
        </p>
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
  name: 'Error500',
  setup() {
    const router = useRouter()

    const goHome = () => router.push('/')
    const reload = () => window.location.reload()

    return { goHome, reload }
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
  background: radial-gradient(circle, rgba(127,179,194,0.04) 0%, transparent 70%);
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
  animation: pulse-ring 3s ease-in-out infinite;
}

.error-icon {
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  color: var(--ca);
  animation: pulse-icon 3s ease-in-out infinite;
}

@keyframes pulse-ring {
  0%, 100% { transform: scale(1); border-color: var(--c4); }
  50% { transform: scale(1.05); border-color: var(--c5); }
}

@keyframes pulse-icon {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
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
  max-width: 440px;
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

.error-status {
  padding-top: 32px;
  border-top: 1px solid var(--c3);
  max-width: 400px;
  margin: 0 auto;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ca);
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.status-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--cd);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status-info {
  font-size: 0.82rem;
  color: var(--cd);
  line-height: 1.6;
}

.status-link {
  color: var(--ca);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.status-link:hover {
  color: #93c5d2;
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
}
</style>
