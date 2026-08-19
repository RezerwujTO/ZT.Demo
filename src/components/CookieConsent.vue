<template>
  <Transition name="cookie-slide">
    <div v-if="visible" class="cookie-bar" role="dialog" aria-label="Polityka cookies" aria-describedby="cookie-desc">
      <div class="cookie-inner">
        <div class="cookie-text">
          <i class="bi-shield-check cookie-icon" aria-hidden="true"></i>
          <p id="cookie-desc" class="cookie-desc">
            Używamy plików cookies niezbędnych do funkcjonowania serwisu oraz analitycznych.
            Więcej informacji w <router-link to="/polityka-prywatnosci" class="cookie-link">Polityce Prywatności</router-link>.
          </p>
        </div>
        <div class="cookie-actions">
          <button type="button" class="cookie-btn cookie-btn-settings" @click="showDetails = !showDetails" :aria-expanded="showDetails">
            Ustawienia
          </button>
          <button type="button" class="cookie-btn cookie-btn-reject" @click="reject">
            Odrzuć
          </button>
          <button type="button" class="cookie-btn cookie-btn-accept" @click="accept">
            Akceptuję
          </button>
        </div>
      </div>
      <Transition name="cookie-expand">
        <div v-if="showDetails" class="cookie-details">
          <label class="cookie-option">
            <input type="checkbox" checked disabled>
            <span>Niezbędne (wymagane)</span>
          </label>
          <label class="cookie-option">
            <input v-model="analytics" type="checkbox">
            <span>Analityczne</span>
          </label>
          <label class="cookie-option">
            <input v-model="marketing" type="checkbox">
            <span>Marketingowe</span>
          </label>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

const STORAGE_KEY = 'zarezerwujto_cookie_consent'

export default defineComponent({
  name: 'CookieConsent',
  setup() {
    const visible = ref(false)
    const showDetails = ref(false)
    const analytics = ref(false)
    const marketing = ref(false)

    function save(consent: { necessary: boolean; analytics: boolean; marketing: boolean }) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...consent, timestamp: Date.now() }))
      visible.value = false
    }

    function accept() {
      save({ necessary: true, analytics: true, marketing: true })
    }

    function reject() {
      save({ necessary: true, analytics: false, marketing: false })
    }

    onMounted(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
          visible.value = true
          return
        }
        const parsed = JSON.parse(stored) as { timestamp?: number }
        const oneYear = 365 * 24 * 60 * 60 * 1000
        if (!parsed.timestamp || Date.now() - parsed.timestamp > oneYear) {
          visible.value = true
        }
      } catch {
        visible.value = true
      }
    })

    return { visible, showDetails, analytics, marketing, accept, reject }
  },
})
</script>

<style scoped>
.cookie-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  background: #0f181c;
  border-top: 1px solid #1a2a30;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.4);
}
.cookie-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}
.cookie-text {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  min-width: 280px;
}
.cookie-icon { font-size: 1.4rem; color: #7fb3c2; flex-shrink: 0; margin-top: 2px; }
.cookie-desc { font-size: 0.82rem; color: #a6bac2; line-height: 1.6; margin: 0; }
.cookie-link { color: #7fb3c2; text-decoration: none; font-weight: 600; }
.cookie-link:hover { text-decoration: underline; }
.cookie-actions { display: flex; gap: 8px; flex-shrink: 0; }
.cookie-btn {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.cookie-btn:focus-visible {
  outline: 2px solid #7fb3c2;
  outline-offset: 2px;
}
.cookie-btn-accept { background: #7fb3c2; color: #0b1215; }
.cookie-btn-accept:hover { background: #93c5d2; }
.cookie-btn-reject { background: #1a2a30; color: #a6bac2; border: 1px solid #23373e; }
.cookie-btn-reject:hover { background: #23373e; color: #d4dfe3; }
.cookie-btn-settings { background: transparent; color: #a6bac2; border: 1px solid #23373e; }
.cookie-btn-settings:hover { color: #d4dfe3; border-color: #2e4750; }
.cookie-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 16px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.cookie-option {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: #a6bac2;
  cursor: pointer;
}
.cookie-option input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #7fb3c2;
  cursor: pointer;
}
.cookie-option input:disabled { opacity: 0.5; cursor: not-allowed; }

.cookie-slide-enter-active, .cookie-slide-leave-active { transition: transform 0.3s ease, opacity 0.3s ease; }
.cookie-slide-enter-from, .cookie-slide-leave-to { transform: translateY(100%); opacity: 0; }
.cookie-expand-enter-active, .cookie-expand-leave-active { transition: max-height 0.2s ease, opacity 0.2s ease; overflow: hidden; }
.cookie-expand-enter-from, .cookie-expand-leave-to { max-height: 0; opacity: 0; }
.cookie-expand-enter-to, .cookie-expand-leave-from { max-height: 60px; opacity: 1; }

@media (max-width: 640px) {
  .cookie-inner { flex-direction: column; align-items: stretch; }
  .cookie-actions { justify-content: stretch; }
  .cookie-btn { flex: 1; }
}
</style>
