<script setup lang="ts">
import { computed } from 'vue'
import { useCmsStore, useUiStore } from '@/cms/stores/cms'
import { useAuthStore } from '@/stores/auth'

const cms = useCmsStore()
const ui = useUiStore()
const auth = useAuthStore()

const today = new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const userName = computed(() => auth.user?.firstName ?? auth.user?.email?.split('@')[0] ?? 'Salon')

const stats = computed(() => {
  const o = cms.overview
  if (!o) {
    return [
      { label: 'Dzisiaj', value: '—', trend: '' },
      { label: 'Przychód', value: '—', trend: '' },
      { label: 'Klienci', value: '—', trend: '' },
      { label: 'Obłożenie', value: '—', trend: '' },
    ]
  }
  return [
    { label: 'Dzisiaj', value: `${o.todayVisits} wizyt`, trend: o.todayVisitsTrend ? `↑ ${o.todayVisitsTrend}%` : '' },
    { label: 'Przychód', value: `${o.revenue.toLocaleString('pl-PL')} zł`, trend: o.revenueTrend ? `↑ ${o.revenueTrend}%` : '' },
    { label: 'Klienci', value: `${o.newClients} nowych`, trend: o.newClientsTrend ? `↑ ${o.newClientsTrend}` : '' },
    { label: 'Obłożenie', value: `${o.occupancy}%`, trend: o.occupancyTrend ? `↑ ${o.occupancyTrend}%` : '' },
  ]
})

const upcomingToday = computed(() =>
  cms.todayVisits.filter(v => v.status !== 'completed' && v.status !== 'cancelled').slice(1, 4).map(v => ({
    id: v.id,
    time: v.time,
    client: v.client,
  }))
)

const alerts = computed(() => {
  const items: { id: string; icon: string; text: string }[] = []
  const pending = cms.overview?.pendingAppointments ?? 0
  if (pending > 0) items.push({ id: 'pending', icon: 'bi-clock-history', text: `${pending} niepotwierdzonych wizyt` })
  const todayCancelled = cms.visits.filter(v => v.date === cms.todayDate && v.status === 'cancelled').length
  if (todayCancelled > 0) items.push({ id: 'cancelled', icon: 'bi-calendar-x', text: `${todayCancelled} anulowanych wizyt dziś` })
  if (!items.length) items.push({ id: 'ok', icon: 'bi-check-circle', text: 'Wszystko w porządku' })
  return items
})

const statusIcon = (status: string) => {
  if (status === 'completed') return 'bi-check-lg'
  if (status === 'confirmed') return 'bi-check-lg'
  return 'bi-three-dots'
}

const statusBtnClass = (status: string) => {
  if (status === 'completed') return 'completed'
  if (status === 'confirmed') return 'confirmed'
  return 'pending'
}
</script>

<template>
  <div>
    <div class="cms-page-head">
      <div class="cms-greeting">
        <h2>Dzień dobry, {{ userName }} 👋</h2>
        <p class="cms-greeting-date">{{ today }}</p>
      </div>
      <button type="button" class="cms-btn cms-btn-cta" @click="ui.openNewVisit()">
        <i class="bi-plus-lg" /> Nowa wizyta
      </button>
    </div>

    <div class="cms-stat-grid">
      <div v-for="s in stats" :key="s.label" class="cms-stat">
        <div class="cms-stat-label">{{ s.label }}</div>
        <div class="cms-stat-val">{{ s.value }}</div>
        <div v-if="s.trend" class="cms-stat-trend">{{ s.trend }}</div>
      </div>
    </div>

    <div class="cms-grid-main">
      <div class="cms-card">
        <h3 class="cms-card-title">Dzisiaj</h3>
        <div v-if="!cms.todayVisits.length" class="cms-dim py-3">Brak wizyt na dziś</div>
        <div
          v-for="v in cms.todayVisits"
          :key="v.id"
          class="cms-visit-item"
          @click="ui.openVisitPanel(v.id)"
        >
          <div class="cms-visit-time">{{ v.time }}</div>
          <div class="cms-visit-info">
            <div class="cms-visit-client">{{ v.client }}</div>
            <div class="cms-visit-meta">{{ v.service }} · {{ v.barber.split(' ')[0] }}</div>
          </div>
          <span class="cms-visit-price">{{ v.price }} zł</span>
          <button
            type="button"
            class="cms-status-btn"
            :class="statusBtnClass(v.status)"
            @click.stop="cms.cycleVisitStatus(v.id)"
          >
            <i :class="statusIcon(v.status)" />
          </button>
        </div>
      </div>

      <div>
        <div class="cms-card mb-3">
          <h3 class="cms-card-title">Nadchodzące</h3>
          <div v-for="u in upcomingToday" :key="u.id" class="cms-upcoming-item">
            <span class="cms-upcoming-time">{{ u.time }}</span>
            <span>{{ u.client }}</span>
          </div>
          <div v-if="!upcomingToday.length" class="cms-dim small py-2">Brak kolejnych wizyt</div>
        </div>

        <div class="cms-card">
          <h3 class="cms-card-title">⚠ Wymaga uwagi</h3>
          <div v-for="a in alerts" :key="a.id" class="cms-alert-item">
            <i :class="a.icon" />
            <span>{{ a.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
