<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCmsStore } from '@/cms/stores/cms'
import type { DaySchedule } from '@/cms/data/mock'
import { ApiError } from '@/lib/api'
import ScheduleDayModal from '@/cms/components/ScheduleDayModal.vue'

const cms = useCmsStore()
const route = useRoute()

const tab = ref<'salon' | 'barber'>('barber')
const selectedBarberId = ref('')
const barberSchedule = ref<DaySchedule[]>([])
const editingDay = ref<number | null>(null)
const saving = ref(false)
const saveError = ref('')

watch(() => cms.barbers, (list) => {
  const requested = typeof route.query.specjalista === 'string' ? route.query.specjalista : ''
  if (requested && list.some(b => b.id === requested)) {
    selectedBarberId.value = requested
    return
  }
  if (!selectedBarberId.value && list[0]) selectedBarberId.value = list[0].id
}, { immediate: true })

const loadBarberSchedule = (id: string) => {
  const days = cms.getBarberSchedule(id)
  barberSchedule.value = days
    ? days.map(d => ({ ...d, breaks: d.breaks.map(b => ({ ...b })) }))
    : []
}

watch(selectedBarberId, (id) => { if (id) loadBarberSchedule(id) }, { immediate: true })

const selectBarber = (id: string) => {
  selectedBarberId.value = id
  loadBarberSchedule(id)
}

const activeDays = computed(() => (tab.value === 'salon' ? cms.salonSchedule : barberSchedule.value))

const editedDay = computed(() => (editingDay.value === null ? null : activeDays.value[editingDay.value] ?? null))

const modalTitle = computed(() => {
  if (!editedDay.value) return ''
  return editedDay.value.day
})

const modalSubtitle = computed(() => {
  if (tab.value === 'salon') return 'Zmiana obejmie grafik wszystkich aktywnych specjalistów.'
  return cms.getBarber(selectedBarberId.value)?.name ?? 'Grafik specjalisty'
})

const openDay = (index: number) => {
  saveError.value = ''
  editingDay.value = index
}

const closeDay = () => {
  editingDay.value = null
  saveError.value = ''
}

const toggleDay = async (days: DaySchedule[], index: number) => {
  const day = days[index]
  if (!day) return
  const patched: DaySchedule = { ...day, open: !day.open, breaks: day.breaks.map(b => ({ ...b })) }
  editingDay.value = index
  await persist(patched)
}

async function persist(day: DaySchedule) {
  const index = editingDay.value
  if (index === null) return
  saveError.value = ''
  saving.value = true
  try {
    if (tab.value === 'salon') {
      cms.salonSchedule[index] = { ...day, breaks: day.breaks.map(b => ({ ...b })) }
      await Promise.all(
        cms.barbers.filter(b => b.active).map(async b => {
          const days = cms.getBarberSchedule(b.id)?.map(d => ({ ...d, breaks: d.breaks.map(br => ({ ...br })) }))
          if (!days) return
          days[index] = {
            ...days[index]!,
            open: day.open,
            from: day.from,
            to: day.to,
            breaks: day.breaks.map(br => ({ ...br })),
          }
          await cms.saveBarberSchedule(b.id, days)
        }),
      )
      await cms.loadSchedules()
      loadBarberSchedule(selectedBarberId.value)
    } else {
      barberSchedule.value[index] = { ...day, breaks: day.breaks.map(b => ({ ...b })) }
      await cms.saveBarberSchedule(selectedBarberId.value, barberSchedule.value)
    }
    editingDay.value = null
  } catch (e) {
    saveError.value = e instanceof ApiError ? e.message : 'Nie udało się zapisać'
  } finally {
    saving.value = false
  }
}

const switchTab = (value: 'salon' | 'barber') => {
  tab.value = value
  editingDay.value = null
  saveError.value = ''
}
</script>

<template>
  <div>
    <div class="cms-page-head">
      <h2 class="mb-0">Godziny pracy</h2>
    </div>

    <div v-if="saveError && editingDay === null" class="cms-card mb-3 cms-dim" style="color: #e57373">{{ saveError }}</div>

    <div class="cms-tabs">
      <button type="button" class="cms-tab" :class="{ active: tab === 'salon' }" @click="switchTab('salon')">Godziny salonu</button>
      <button type="button" class="cms-tab" :class="{ active: tab === 'barber' }" @click="switchTab('barber')">Godziny zespołu</button>
    </div>

    <div v-if="tab === 'salon'" class="cms-card">
      <p class="cms-dim small mb-3">Zmiany zapisują grafik wszystkich aktywnych specjalistów na wybrany dzień.</p>
      <h3 class="cms-card-title">Godziny pracy</h3>
      <div
        v-for="(day, i) in cms.salonSchedule"
        :key="day.day"
        class="cms-schedule-day"
        style="cursor: pointer"
        @click="openDay(i)"
      >
        <span class="cms-schedule-day-name">{{ day.day }}</span>
        <span v-if="day.open" class="cms-schedule-day-hours">
          {{ day.from }} — {{ day.to }}
          <span v-if="day.breaks.length" class="cms-dim"> · przerwa {{ day.breaks[0].from }}–{{ day.breaks[0].to }}</span>
        </span>
        <span v-else class="cms-schedule-day-hours closed">Zamknięte</span>
        <button type="button" class="cms-btn cms-btn-ghost cms-btn-sm" @click.stop="openDay(i)"><i class="bi-pencil" /></button>
        <label class="cms-switch" @click.stop>
          <input type="checkbox" :checked="day.open" @change="toggleDay(cms.salonSchedule, i)" />
          <span class="cms-switch-slider" />
        </label>
      </div>
    </div>

    <div v-else>
      <select v-model="selectedBarberId" class="cms-form-select mb-3" style="max-width: 280px" @change="selectBarber(selectedBarberId)">
        <option v-for="b in cms.barbers.filter(x => x.active)" :key="b.id" :value="b.id">{{ b.name }}</option>
      </select>

      <div class="cms-card">
        <div
          v-for="(day, i) in barberSchedule"
          :key="day.day"
          class="cms-schedule-day"
          style="cursor: pointer"
          @click="openDay(i)"
        >
          <span class="cms-schedule-day-name">{{ day.day }}</span>
          <span v-if="day.open" class="cms-schedule-day-hours">
            {{ day.from }} — {{ day.to }}
            <span v-if="day.breaks.length" class="cms-dim"> · przerwa {{ day.breaks[0].from }}–{{ day.breaks[0].to }}</span>
          </span>
          <span v-else class="cms-schedule-day-hours closed">Wolne</span>
          <button type="button" class="cms-btn cms-btn-ghost cms-btn-sm" @click.stop="openDay(i)"><i class="bi-pencil" /></button>
          <label class="cms-switch" @click.stop>
            <input type="checkbox" :checked="day.open" @change="toggleDay(barberSchedule, i)" />
            <span class="cms-switch-slider" />
          </label>
        </div>
      </div>
    </div>

    <ScheduleDayModal
      :open="editingDay !== null"
      :title="modalTitle"
      :subtitle="modalSubtitle"
      :day="editedDay"
      :saving="saving"
      :error="saveError"
      @close="closeDay"
      @save="persist"
    />
  </div>
</template>
