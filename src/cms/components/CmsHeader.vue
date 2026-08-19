<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useSidebarStore } from '@/cms/stores/sidebar'
import { useUiStore, useCmsStore } from '@/cms/stores/cms'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { notificationsApi } from '@/lib/api'

const sidebar = useSidebarStore()
const ui = useUiStore()
const cms = useCmsStore()
const auth = useAuthStore()
const router = useRouter()

const logoutOpen = ref(false)
const notifOpen = ref(false)
const notifStats = ref({ PENDING: 0, SENT: 0, FAILED: 0, DEAD: 0 })
const notifList = ref<{ id: string; type: string; status: string; subject: string; sentAt: string | null; createdAt: string }[]>([])

const pendingCount = computed(() => cms.overview?.pendingAppointments ?? 0)
const failedCount = computed(() => notifStats.value.FAILED + notifStats.value.DEAD)

const openSearch = () => ui.openSearch()

const isMobileLayout = ref(false)

const syncLayout = () => { isMobileLayout.value = window.innerWidth < 992 }

const sidebarIcon = computed(() => {
  if (isMobileLayout.value) return 'bi-list'
  return sidebar.visible ? 'bi-layout-sidebar' : 'bi-layout-sidebar-inset'
})

const toggleSidebar = () => {
  if (isMobileLayout.value) sidebar.toggleMobile()
  else sidebar.toggle()
}

const confirmLogout = () => { logoutOpen.value = true }

const doLogout = async () => {
  logoutOpen.value = false
  await auth.logout()
}

const toggleNotif = async () => {
  notifOpen.value = !notifOpen.value
  if (notifOpen.value) {
    try {
      const [stats, list] = await Promise.all([
        notificationsApi.stats(),
        notificationsApi.list({ limit: 5 }),
      ])
      notifStats.value = stats
      notifList.value = list.data
    } catch { /* silent */ }
  }
}

onMounted(async () => {
  syncLayout()
  window.addEventListener('resize', syncLayout)
  try { notifStats.value = await notificationsApi.stats() } catch { /* silent */ }
})

onUnmounted(() => {
  window.removeEventListener('resize', syncLayout)
})
</script>

<template>
  <header class="cms-header">
    <div class="cms-header-left">
      <button type="button" class="cms-header-icon-btn" title="Menu" @click="toggleSidebar">
        <i :class="sidebarIcon" />
      </button>
    </div>
    <div class="cms-header-center">
      <div class="cms-header-search" @click="openSearch">
        <i class="bi-search" />
        <input type="text" readonly placeholder="Szukaj..." />
        <kbd>Ctrl+K</kbd>
      </div>
    </div>
    <div class="cms-header-right">
      <button type="button" class="cms-header-icon-btn" title="Nowa wizyta" @click="ui.openNewVisit()">
        <i class="bi-plus-lg" />
      </button>
      <div class="notif-wrap">
        <button type="button" class="cms-header-icon-btn" title="Powiadomienia" @click="toggleNotif">
          <i class="bi-bell" />
          <span v-if="pendingCount > 0 || failedCount > 0" class="notif-badge">{{ pendingCount || failedCount }}</span>
        </button>
        <div v-if="notifOpen" class="notif-dropdown" @click.stop>
          <div class="notif-dd-head">Powiadomienia</div>
          <div v-if="notifList.length" class="notif-dd-list">
            <div v-for="n in notifList" :key="n.id" class="notif-dd-item">
              <div class="notif-dd-dot" :class="n.status.toLowerCase()" />
              <div class="notif-dd-info">
                <div class="notif-dd-subject">{{ n.subject }}</div>
                <div class="notif-dd-meta">{{ n.type.replace('APPOINTMENT_', '').replace('_', ' ') }} · {{ n.status }}</div>
              </div>
            </div>
          </div>
          <div v-else class="notif-dd-empty">Brak powiadomień</div>
          <button type="button" class="notif-dd-all" @click="router.push('/cms/wizyty'); notifOpen = false">Zobacz wszystkie</button>
        </div>
      </div>
      <button type="button" class="cms-header-icon-btn" title="Ustawienia" @click="router.push('/cms/ustawienia')">
        <i class="bi-gear" />
      </button>
      <button type="button" class="cms-header-icon-btn" title="Wyloguj" @click="confirmLogout">
        <i class="bi-box-arrow-right" />
      </button>
    </div>
  </header>
  <div v-if="notifOpen" class="notif-backdrop" @click="notifOpen = false" />

  <Teleport to="body">
    <div v-if="logoutOpen" class="logout-overlay" @click.self="logoutOpen = false">
      <div class="logout-modal">
        <div class="logout-icon"><i class="bi-box-arrow-right" /></div>
        <h3>Wylogować się?</h3>
        <p class="logout-desc">Zostaniesz wylogowany z panelu i wrócisz na stronę główną.</p>
        <div class="logout-actions">
          <button type="button" class="logout-btn logout-btn-cancel" @click="logoutOpen = false">Anuluj</button>
          <button type="button" class="logout-btn logout-btn-confirm" @click="doLogout">Wyloguj się</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.cms-header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  height: 56px;
  background: #0f181c;
  border-bottom: 1px solid #1a2a30;
  position: sticky;
  top: 0;
  z-index: 100;
}
.cms-header-left,
.cms-header-right {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.cms-header-center {
  display: flex;
  justify-content: center;
  min-width: 0;
}
.cms-header-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  color: #a6bac2;
  font-size: 1.1rem;
  cursor: pointer;
  transition: color 0.2s;
}
.cms-header-icon-btn:hover { color: #d4dfe3; }

.cms-header-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #142024;
  border: 1px solid #1a2a30;
  border-radius: 6px;
  padding: 6px 14px;
  cursor: pointer;
  width: 100%;
  max-width: 400px;
  transition: border-color 0.2s;
}
.cms-header-search:hover { border-color: #23373e; }
.cms-header-search i { color: #a6bac2; font-size: 0.85rem; flex-shrink: 0; }
.cms-header-search input {
  background: none;
  border: none;
  color: #a6bac2;
  font-size: 0.82rem;
  width: 100%;
  outline: none;
  cursor: pointer;
}
.cms-header-search input::placeholder { color: #a6bac2; }
.cms-header-search kbd {
  background: #1a2a30;
  border: 1px solid #23373e;
  border-radius: 4px;
  color: #a6bac2;
  font-size: 0.65rem;
  padding: 2px 6px;
  font-family: inherit;
  white-space: nowrap;
}

.logout-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.logout-modal {
  background: #0f181c;
  border: 1px solid #1a2a30;
  border-radius: 12px;
  padding: 32px;
  max-width: 380px;
  width: 100%;
  text-align: center;
}
.logout-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #142024;
  border: 1px solid #1a2a30;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 1.4rem;
  color: #e57373;
}
.logout-modal h3 { font-size: 1.1rem; margin-bottom: 8px; color: #d4dfe3; }
.logout-desc { font-size: 0.82rem; color: #a6bac2; line-height: 1.6; margin-bottom: 24px; }
.logout-actions { display: flex; gap: 10px; }
.logout-btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.logout-btn-cancel { background: #142024; color: #a6bac2; border: 1px solid #1a2a30; }
.logout-btn-cancel:hover { background: #1a2a30; color: #d4dfe3; }
.logout-btn-confirm { background: #e57373; color: #0b1215; }
.logout-btn-confirm:hover { background: #ef9a9a; }

.notif-wrap { position: relative; }
.notif-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  background: #e57373;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
}
.notif-backdrop { position: fixed; inset: 0; z-index: 99; }
.notif-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background: #0f181c;
  border: 1px solid #1a2a30;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  z-index: 100;
  overflow: hidden;
  margin-top: 8px;
}
.notif-dd-head {
  padding: 14px 16px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #a6bac2;
  border-bottom: 1px solid #1a2a30;
}
.notif-dd-list { max-height: 260px; overflow-y: auto; }
.notif-dd-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid #142024;
  transition: background 0.15s;
}
.notif-dd-item:hover { background: #142024; }
.notif-dd-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}
.notif-dd-dot.sent { background: #5cb85c; }
.notif-dd-dot.pending { background: #d4a853; }
.notif-dd-dot.failed, .notif-dd-dot.dead { background: #e57373; }
.notif-dd-info { flex: 1; min-width: 0; }
.notif-dd-subject { font-size: 0.82rem; font-weight: 600; color: #d4dfe3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.notif-dd-meta { font-size: 0.68rem; color: #a6bac2; margin-top: 2px; }
.notif-dd-empty { padding: 24px; text-align: center; font-size: 0.82rem; color: #a6bac2; }
.notif-dd-all {
  display: block;
  width: 100%;
  padding: 12px;
  background: none;
  border: none;
  border-top: 1px solid #1a2a30;
  color: #7fb3c2;
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.notif-dd-all:hover { background: #142024; }

@media (max-width: 767px) {
  .cms-header { padding: 0 10px; gap: 4px; }
  .cms-header-search { padding: 5px 10px; gap: 6px; }
  .cms-header-search kbd { font-size: 0.58rem; padding: 1px 4px; }
  .cms-header-left,
  .cms-header-right { gap: 0; }
  .cms-header-icon-btn { width: 32px; height: 32px; font-size: 1rem; }
}

@media (max-width: 575px) {
  .cms-header-icon-btn { width: 28px; height: 28px; font-size: 0.92rem; }
  .cms-header-search { padding: 5px 8px; }
  .cms-header-search input { font-size: 0.78rem; }
  .notif-dropdown { position: fixed; top: calc(var(--header-h, 60px) + 4px); left: 12px; right: 12px; width: auto; }
  .logout-modal { padding: 22px 18px; }
  .logout-actions { flex-direction: column-reverse; }
  .logout-actions .logout-btn { width: 100%; }
}
</style>
