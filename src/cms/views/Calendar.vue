<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCmsStore, useUiStore } from '@/cms/stores/cms'
import { timeToMinutes } from '@/cms/data/mock'
import type { Visit } from '@/cms/data/mock'
import BreakEditModal from '@/cms/components/BreakEditModal.vue'

const cms = useCmsStore()
const ui = useUiStore()

const viewMode = ref<'day' | 'week' | 'month'>('week')
const barberFilter = ref('all')

const ALL_HOURS: string[] = []
for (let h = 8; h <= 20; h++) {
  ALL_HOURS.push(`${String(h).padStart(2, '0')}:00`)
  if (h < 20) ALL_HOURS.push(`${String(h).padStart(2, '0')}:30`)
}

function startOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const weekStart = ref(startOfWeek(new Date()))

const weekDays = computed(() => {
  const days: { date: string; label: string; short: string; isToday: boolean }[] = []
  const labels = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd']
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + i)
    const dateStr = d.toLocaleDateString('en-CA')
    days.push({
      date: dateStr,
      label: labels[i] ?? '',
      short: labels[i] ?? '',
      isToday: dateStr === cms.todayDate,
    })
  }
  return days
})

const weekLabel = computed(() => {
  const start = weekDays.value[0]?.date
  const end = weekDays.value[6]?.date
  if (!start || !end) return ''
  const fmt = (s: string) => new Date(`${s}T12:00:00`).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })
  return `${fmt(start)} – ${fmt(end)}`
})

const filteredVisits = computed(() => {
  let list = cms.visits.filter(v => v.status !== 'cancelled')
  if (barberFilter.value !== 'all') list = list.filter(v => v.barberId === barberFilter.value)
  return list
})

const getEventsForCell = (date: string, hour: string) => {
  const hourMin = timeToMinutes(hour)
  return filteredVisits.value.filter(v => {
    if (v.date !== date) return false
    const start = timeToMinutes(v.time)
    const end = start + v.duration
    return start < hourMin + 30 && end > hourMin
  })
}

const isBreakSlot = (date: string, hour: string) =>
  cms.isBreakAt(date, hour, barberFilter.value === 'all' ? undefined : barberFilter.value)

const breakLabel = (date: string, hour: string) => {
  if (!isBreakSlot(date, hour)) return ''
  const entries = cms.getBreaksForDate(date, barberFilter.value === 'all' ? undefined : barberFilter.value)
  for (const e of entries) {
    const h = timeToMinutes(hour)
    for (const b of e.breaks) {
      const from = timeToMinutes(b.from)
      if (h === from) return 'PRZERWA'
    }
  }
  return 'PRZERWA'
}

const breakEditOpen = ref(false)
const breakEditDate = ref('')
const breakEditBarberId = ref('')

const openBreakEdit = (date: string) => {
  if (barberFilter.value === 'all') {
    const entries = cms.getBreaksForDate(date)
    const barberId = entries[0]?.barberId ?? cms.barbers.find(b => b.active)?.id
    if (!barberId) return
    breakEditBarberId.value = barberId
  } else {
    breakEditBarberId.value = barberFilter.value
  }
  breakEditDate.value = date
  breakEditOpen.value = true
}

const draggingId = ref<string | null>(null)

const onDragStart = (e: DragEvent, visit: Visit) => {
  draggingId.value = visit.id
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

const onDragOver = (e: DragEvent, date: string, hour: string) => {
  e.preventDefault()
  if (isBreakSlot(date, hour)) return
}

const onDrop = (date: string, hour: string) => {
  if (!draggingId.value || isBreakSlot(date, hour)) return
  const visit = cms.getVisit(draggingId.value)
  if (!visit) return

  ui.showConfirm(
    'Przenieś wizytę',
    `Czy chcesz przenieść wizytę ${visit.client} na ${hour}?`,
    async () => {
      const ok = await cms.moveVisit(draggingId.value!, hour, date)
      ui.hideConfirm()
      if (!ok) {
        ui.showConfirm('Konflikt', 'Termin jest zajęty. Wybierz inną godzinę.', () => ui.hideConfirm())
      }
    },
  )
  draggingId.value = null
}

const onCellClick = (date: string, hour: string) => {
  if (isBreakSlot(date, hour)) {
    openBreakEdit(date)
    return
  }
  ui.openNewVisit({ date, time: hour, barberId: barberFilter.value !== 'all' ? barberFilter.value : undefined })
}

const prevWeek = () => {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() - 7)
  weekStart.value = d
}

const nextWeek = () => {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() + 7)
  weekStart.value = d
}

const goToday = () => {
  weekStart.value = startOfWeek(new Date())
}

const eventHeight = (visit: Visit) => Math.max(1, Math.ceil(visit.duration / 30))
</script>

<template>
  <div>
    <div class="cms-toolbar">
      <div class="cms-toolbar-left">
        <div class="cms-nav-arrows">
          <button type="button" class="cms-icon-btn" @click="prevWeek"><i class="bi-chevron-left" /></button>
          <button type="button" class="cms-btn cms-btn-outline cms-btn-sm" @click="goToday">Dzisiaj</button>
          <button type="button" class="cms-icon-btn" @click="nextWeek"><i class="bi-chevron-right" /></button>
        </div>
        <span class="fw-semibold">{{ weekLabel }}</span>
        <div class="cms-view-tabs">
          <button type="button" class="cms-view-tab" :class="{ active: viewMode === 'day' }" @click="viewMode = 'day'">Dzień</button>
          <button type="button" class="cms-view-tab" :class="{ active: viewMode === 'week' }" @click="viewMode = 'week'">Tydzień</button>
          <button type="button" class="cms-view-tab" :class="{ active: viewMode === 'month' }" @click="viewMode = 'month'">Miesiąc</button>
        </div>
        <select v-model="barberFilter" class="cms-select">
          <option value="all">Specjalista: Wszyscy</option>
          <option v-for="b in cms.barbers.filter(x => x.active)" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </div>
      <button type="button" class="cms-btn cms-btn-cta cms-btn-sm" @click="ui.openNewVisit()">
        <i class="bi-plus-lg" /> Nowa wizyta
      </button>
    </div>

    <div v-if="viewMode === 'week'" class="cms-cal-week">
      <div class="cms-cal-time-col">
        <div class="cms-cal-day-head" style="border-right: none" />
        <div v-for="h in ALL_HOURS" :key="h" class="cms-cal-time-label" :class="{ 'half-hour': h.endsWith(':30') }">{{ h }}</div>
      </div>
      <div v-for="day in weekDays" :key="day.date" class="cms-cal-day-col">
        <div class="cms-cal-day-head" :class="{ today: day.isToday }">{{ day.short }}</div>
        <div
          v-for="h in ALL_HOURS"
          :key="h"
          class="cms-cal-cell"
          :class="{ 'break-slot': isBreakSlot(day.date, h), 'half-hour': h.endsWith(':30') }"
          @dragover="onDragOver($event, day.date, h)"
          @drop="onDrop(day.date, h)"
          @click="onCellClick(day.date, h)"
        >
          <template v-for="ev in getEventsForCell(day.date, h)" :key="ev.id">
            <div
              v-if="ev.time === h"
              class="cms-cal-event"
              :style="{ height: eventHeight(ev) * 23 + 'px' }"
              draggable="true"
              @dragstart="onDragStart($event, ev)"
              @click.stop="ui.openVisitPanel(ev.id)"
            >
              <div class="cms-cal-event-name">{{ ev.client.split(' ')[0] }}</div>
              <div class="cms-cal-event-svc">{{ ev.service }}</div>
            </div>
          </template>
          <span v-if="breakLabel(day.date, h)" class="cms-dim" style="font-size: 0.6rem; padding: 2px">{{ breakLabel(day.date, h) }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="viewMode === 'day'" class="cms-card">
      <div v-for="v in filteredVisits.filter(x => x.date === cms.todayDate)" :key="v.id" class="cms-visit-item" @click="ui.openVisitPanel(v.id)">
        <div class="cms-visit-time">{{ v.time }}</div>
        <div class="cms-visit-info">
          <div class="cms-visit-client">{{ v.client }}</div>
          <div class="cms-visit-meta">{{ v.service }} · {{ v.barber }}</div>
        </div>
      </div>
      <div v-if="!filteredVisits.filter(x => x.date === cms.todayDate).length" class="cms-empty">Brak wizyt na dziś</div>
    </div>

    <div v-else class="cms-card cms-dim text-center py-5">
      Widok miesięczny — wkrótce
    </div>

    <BreakEditModal
      :open="breakEditOpen"
      :date="breakEditDate"
      :barber-id="breakEditBarberId"
      @close="breakEditOpen = false"
    />
  </div>
</template>
