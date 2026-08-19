<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useSidebarStore } from '@/cms/stores/sidebar'

const STORAGE_KEY = 'zarezerwujto_onboarding_done'
const MOBILE_BREAKPOINT = 992

const sidebar = useSidebarStore()

const visible = ref(false)
const currentStep = ref(0)

interface Step {
  target: string
  title: string
  text: string
  icon: string
}

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

const steps: Step[] = [
  { target: '.cms-nav-link[href="/cms"]', title: 'Dashboard', text: 'Tutaj widzisz podsumowanie dnia — wizyty, przychód, klientów i alerty. Kliknij „Nowa wizyta" aby dodać rezerwację.', icon: 'bi-grid-1x2' },
  { target: '.cms-nav-link[href="/cms/kalendarz"]', title: 'Kalendarz', text: 'Widok tygodniowy z godzinami co 30 min. Kliknij slot aby dodać wizytę, przeciągnij aby przenieść. Filtruj po specjalistach.', icon: 'bi-calendar3' },
  { target: '.cms-nav-link[href="/cms/wizyty"]', title: 'Wizyty', text: 'Lista wszystkich rezerwacji z filtrami po statusie, dacie i specjaliście. Kliknij wizytę aby zobaczyć szczegóły.', icon: 'bi-list-check' },
  { target: '.cms-nav-link[href="/cms/klienci"]', title: 'Klienci', text: 'Baza klientów z historią wizyt, wydatkami i preferencjami. Dodawaj nowych klientów i przeglądaj historię.', icon: 'bi-people' },
  { target: '.cms-nav-link[href="/cms/uslugi"]', title: 'Usługi', text: 'Zarządzaj cennikiem — dodawaj usługi, ustalaj ceny, czas trwania i przypisuj je do specjalistów.', icon: 'bi-scissors' },
  { target: '.cms-nav-link[href="/cms/barberzy"]', title: 'Zespół', text: 'Dodawaj barberów, fryzjerki i kosmetyczki, przypisuj im usługi i zarządzaj grafikami pracy.', icon: 'bi-person-badge' },
  { target: '.cms-nav-link[href="/cms/godziny"]', title: 'Godziny pracy', text: 'Ustawiaj godziny pracy salonu i każdego specjalisty. Dodawaj przerwy i dni wolne.', icon: 'bi-clock' },
  { target: '.cms-nav-link[href="/cms/ustawienia"]', title: 'Ustawienia', text: 'Konfiguruj dane salonu, zasady rezerwacji, powiadomienia, konto i bezpieczeństwo.', icon: 'bi-gear' },
]

const step = computed(() => steps[currentStep.value])
const isFirst = computed(() => currentStep.value === 0)
const isLast = computed(() => currentStep.value === steps.length - 1)

const targetRect = ref<Rect | null>(null)
const viewport = ref({ width: 0, height: 0 })
let measureTimers: ReturnType<typeof setTimeout>[] = []

const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT

const spotlightStyle = computed(() => {
  const rect = targetRect.value
  if (!rect) return { display: 'none' }
  const pad = 6
  return {
    top: `${rect.top - pad}px`,
    left: `${rect.left - pad}px`,
    width: `${rect.width + pad * 2}px`,
    height: `${rect.height + pad * 2}px`,
  }
})

const arrowPlacement = computed<{ style: Record<string, string>; icon: string } | null>(() => {
  const rect = targetRect.value
  if (!rect) return null
  const size = 34
  const gap = 10

  if (rect.left + rect.width + gap + size < viewport.value.width) {
    return {
      icon: 'bi-chevron-left',
      style: {
        top: `${Math.max(8, rect.top + rect.height / 2 - size / 2)}px`,
        left: `${rect.left + rect.width + gap}px`,
      },
    }
  }

  if (rect.top - gap - size > 0) {
    return {
      icon: 'bi-chevron-down',
      style: {
        top: `${rect.top - gap - size}px`,
        left: `${Math.min(viewport.value.width - size - 8, Math.max(8, rect.left + rect.width / 2 - size / 2))}px`,
      },
    }
  }

  return {
    icon: 'bi-chevron-up',
    style: {
      top: `${rect.top + rect.height + gap}px`,
      left: `${Math.min(viewport.value.width - size - 8, Math.max(8, rect.left + rect.width / 2 - size / 2))}px`,
    },
  }
})

const modalAtTop = computed(() => {
  const rect = targetRect.value
  if (!rect) return false
  return rect.top + rect.height / 2 > viewport.value.height * 0.5
})

function measure() {
  viewport.value = { width: window.innerWidth, height: window.innerHeight }
  const el = document.querySelector(step.value?.target ?? '')
  if (!el) {
    targetRect.value = null
    return
  }
  const rect = el.getBoundingClientRect()
  if (!rect.width || !rect.height) {
    targetRect.value = null
    return
  }
  targetRect.value = { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
}

function scheduleMeasure() {
  measureTimers.forEach(clearTimeout)
  measureTimers = [0, 120, 280, 500].map(delay => setTimeout(measure, delay))
}

async function revealTarget() {
  if (isMobile()) {
    sidebar.openMobile()
  }
  sidebar.show()
  await nextTick()
  const el = document.querySelector(step.value?.target ?? '')
  if (el) {
    const rect = el.getBoundingClientRect()
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }
  scheduleMeasure()
}

function next() {
  if (isLast.value) {
    finish()
    return
  }
  currentStep.value += 1
  void revealTarget()
}

function prev() {
  if (currentStep.value === 0) return
  currentStep.value -= 1
  void revealTarget()
}

function finish() {
  visible.value = false
  document.body.classList.remove('cms-onboarding')
  if (isMobile()) sidebar.closeMobile()
  measureTimers.forEach(clearTimeout)
  measureTimers = []
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    void 0
  }
}

function onViewportChange() {
  if (!visible.value) return
  if (!isMobile()) sidebar.closeMobile()
  else sidebar.openMobile()
  scheduleMeasure()
}

function onKeydown(event: KeyboardEvent) {
  if (!visible.value) return
  if (event.key === 'Escape') finish()
  if (event.key === 'ArrowRight') next()
  if (event.key === 'ArrowLeft') prev()
}

onMounted(() => {
  let done = false
  try {
    done = Boolean(localStorage.getItem(STORAGE_KEY))
  } catch {
    done = false
  }
  if (done) return

  visible.value = true
  document.body.classList.add('cms-onboarding')
  void revealTarget()

  window.addEventListener('resize', onViewportChange)
  window.addEventListener('orientationchange', onViewportChange)
  window.addEventListener('scroll', scheduleMeasure, true)
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.body.classList.remove('cms-onboarding')
  measureTimers.forEach(clearTimeout)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('orientationchange', onViewportChange)
  window.removeEventListener('scroll', scheduleMeasure, true)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <template v-if="visible">
      <div v-if="!targetRect" class="onb-overlay" />
      <div v-else class="onb-spotlight" :style="spotlightStyle" />

      <div v-if="arrowPlacement" class="onb-arrow" :style="arrowPlacement.style">
        <i :class="arrowPlacement.icon" />
      </div>

      <div class="onb-modal" :class="{ 'onb-modal-top': modalAtTop }">
        <div class="onb-header">
          <div class="onb-icon"><i :class="step?.icon" /></div>
          <div class="onb-step-label">Krok {{ currentStep + 1 }} z {{ steps.length }}</div>
        </div>
        <h3 class="onb-title">{{ step?.title }}</h3>
        <p class="onb-text">{{ step?.text }}</p>

        <div class="onb-dots">
          <span
            v-for="(_, i) in steps"
            :key="i"
            class="onb-dot"
            :class="{ active: i === currentStep, done: i < currentStep }"
          />
        </div>

        <div class="onb-actions">
          <button type="button" class="onb-btn onb-btn-skip" @click="finish">Pomiń wszystko</button>
          <div class="onb-actions-right">
            <button v-if="!isFirst" type="button" class="onb-btn onb-btn-outline" @click="prev">
              <i class="bi-arrow-left" />
            </button>
            <button type="button" class="onb-btn onb-btn-cta" @click="next">
              {{ isLast ? 'Zaczynamy!' : 'Dalej' }} <i v-if="!isLast" class="bi-arrow-right ms-1" />
            </button>
          </div>
        </div>
      </div>
    </template>
  </Teleport>
</template>

<style scoped>
.onb-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.62);
  z-index: 99998;
}
.onb-spotlight {
  position: fixed;
  z-index: 99998;
  border-radius: 10px;
  border: 2px solid #7fb3c2;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.62), 0 0 18px rgba(127, 179, 194, 0.55);
  pointer-events: none;
  transition: top 0.2s, left 0.2s, width 0.2s, height 0.2s;
}
.onb-arrow {
  position: fixed;
  z-index: 100002;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #7fb3c2;
  color: #0b1215;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 0 0 4px rgba(127, 179, 194, 0.25), 0 6px 18px rgba(0, 0, 0, 0.45);
  animation: onb-pulse 1.6s ease-in-out infinite;
  pointer-events: none;
}
@keyframes onb-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.88); opacity: 0.75; }
}
.onb-modal {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #0f181c;
  border: 1px solid #1a2a30;
  border-radius: 16px;
  padding: 24px 26px;
  max-width: 440px;
  width: min(440px, calc(100% - 24px));
  max-height: min(68vh, 520px);
  overflow-y: auto;
  z-index: 100001;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
}
.onb-modal-top {
  bottom: auto;
  top: 16px;
}
.onb-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.onb-icon { width: 40px; height: 40px; border-radius: 50%; background: #142024; border: 1px solid #1a2a30; display: flex; align-items: center; justify-content: center; color: #7fb3c2; font-size: 1.1rem; flex-shrink: 0; }
.onb-step-label { font-size: 0.68rem; font-weight: 600; color: #a6bac2; text-transform: uppercase; letter-spacing: 1px; }
.onb-title { font-size: 1.05rem; font-weight: 700; color: #d4dfe3; margin: 0 0 8px; }
.onb-text { font-size: 0.84rem; color: #a6bac2; line-height: 1.7; margin: 0 0 18px; }
.onb-dots { display: flex; gap: 6px; margin-bottom: 18px; flex-wrap: wrap; }
.onb-dot { width: 8px; height: 8px; border-radius: 50%; background: #1a2a30; transition: all 0.3s; }
.onb-dot.active { background: #7fb3c2; width: 20px; border-radius: 4px; }
.onb-dot.done { background: #2e4750; }
.onb-actions { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.onb-actions-right { display: flex; gap: 8px; }
.onb-btn {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  white-space: nowrap;
}
.onb-btn-cta { background: #7fb3c2; color: #0b1215; }
.onb-btn-cta:hover { background: #93c5d2; }
.onb-btn-outline { background: #142024; color: #a6bac2; border: 1px solid #1a2a30; }
.onb-btn-outline:hover { background: #1a2a30; color: #d4dfe3; }
.onb-btn-skip { background: none; border: none; color: #a6bac2; padding: 10px 0; font-size: 0.78rem; }
.onb-btn-skip:hover { color: #d4dfe3; }

@media (max-width: 575px) {
  .onb-modal {
    left: 12px;
    right: 12px;
    transform: none;
    width: auto;
    max-width: none;
    padding: 18px 18px 20px;
    border-radius: 14px;
  }
  .onb-text { font-size: 0.82rem; line-height: 1.6; margin-bottom: 14px; }
  .onb-actions { flex-direction: column-reverse; align-items: stretch; }
  .onb-actions-right { display: grid; grid-template-columns: auto 1fr; gap: 8px; }
  .onb-actions-right .onb-btn-cta { width: 100%; }
  .onb-btn-skip { padding: 4px 0 0; }
}
</style>
