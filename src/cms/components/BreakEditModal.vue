<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useCmsStore } from '@/cms/stores/cms'
import { dateToUiDayIndex, UI_DAYS } from '@/lib/api/mappers'
import { ApiError } from '@/lib/api'

const props = defineProps<{
  open: boolean
  date: string
  barberId: string
}>()

const emit = defineEmits<{
  close: []
}>()

const cms = useCmsStore()
const breaks = ref<{ from: string; to: string }[]>([])
const error = ref('')
const saving = ref(false)

const dayLabel = computed(() => {
  const idx = dateToUiDayIndex(props.date)
  return UI_DAYS[idx]?.day ?? props.date
})

const barberName = computed(() => cms.getBarber(props.barberId)?.name ?? 'Barber')

watch(() => [props.open, props.date, props.barberId] as const, ([open]) => {
  if (!open) return
  error.value = ''
  const idx = dateToUiDayIndex(props.date)
  const days = cms.getBarberSchedule(props.barberId)
  breaks.value = days?.[idx]?.breaks.map(b => ({ ...b })) ?? []
}, { immediate: true })

const addBreak = () => breaks.value.push({ from: '13:00', to: '14:00' })
const removeBreak = (i: number) => breaks.value.splice(i, 1)

const save = async () => {
  error.value = ''
  saving.value = true
  try {
    await cms.updateBreaksForDay(props.barberId, props.date, breaks.value)
    emit('close')
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Nie udało się zapisać przerw'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="open" class="cms-modal-overlay" @click.self="emit('close')">
    <div class="cms-modal">
      <div class="cms-modal-head">
        <h3>Przerwy — {{ dayLabel }}</h3>
        <button type="button" class="cms-icon-btn" @click="emit('close')"><i class="bi-x-lg" /></button>
      </div>
      <div class="cms-modal-body">
        <p class="cms-dim small mb-3">{{ barberName }} · {{ date.split('-').reverse().join('.') }}</p>
        <div v-if="error" class="mb-3" style="color: #e57373">{{ error }}</div>
        <div v-if="!breaks.length" class="cms-dim mb-3">Brak przerw w tym dniu</div>
        <div v-for="(br, i) in breaks" :key="i" class="d-flex gap-2 mb-2 align-items-center">
          <input v-model="br.from" type="time" class="cms-form-control" />
          <span class="cms-dim">—</span>
          <input v-model="br.to" type="time" class="cms-form-control" />
          <button type="button" class="cms-btn cms-btn-ghost cms-btn-sm" @click="removeBreak(i)"><i class="bi-trash" /></button>
        </div>
        <button type="button" class="cms-btn cms-btn-outline cms-btn-sm" @click="addBreak">
          <i class="bi-plus" /> Dodaj przerwę
        </button>
      </div>
      <div class="cms-modal-foot">
        <button type="button" class="cms-btn cms-btn-outline" @click="emit('close')">Anuluj</button>
        <button type="button" class="cms-btn cms-btn-cta" :disabled="saving" @click="save">
          {{ saving ? 'Zapisywanie...' : 'Zapisz' }}
        </button>
      </div>
    </div>
  </div>
</template>
