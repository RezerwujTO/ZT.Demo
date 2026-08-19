<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DaySchedule } from '@/cms/data/mock'

const props = defineProps<{
  open: boolean
  title: string
  subtitle: string
  day: DaySchedule | null
  saving: boolean
  error: string
}>()

const emit = defineEmits<{
  close: []
  save: [DaySchedule]
}>()

const draft = ref<DaySchedule | null>(null)

watch(
  () => [props.open, props.day] as const,
  ([open, day]) => {
    if (!open || !day) {
      draft.value = null
      return
    }
    draft.value = { ...day, breaks: day.breaks.map(b => ({ ...b })) }
  },
  { immediate: true },
)

const toggleOpen = () => {
  if (!draft.value) return
  draft.value.open = !draft.value.open
}

const addBreak = () => {
  draft.value?.breaks.push({ from: '13:00', to: '14:00' })
}

const removeBreak = (index: number) => {
  draft.value?.breaks.splice(index, 1)
}

const submit = () => {
  if (!draft.value) return
  emit('save', { ...draft.value, breaks: draft.value.breaks.map(b => ({ ...b })) })
}
</script>

<template>
  <div v-if="open && draft" class="cms-modal-overlay" @click.self="emit('close')">
    <div class="cms-modal">
      <div class="cms-modal-head">
        <h3>{{ title }}</h3>
        <button type="button" class="cms-icon-btn" @click="emit('close')"><i class="bi-x-lg" /></button>
      </div>
      <div class="cms-modal-body">
        <p class="cms-dim small mb-3">{{ subtitle }}</p>
        <div v-if="error" class="mb-3" style="color: #e57373">{{ error }}</div>

        <label class="cms-checkbox-item mb-3">
          <input type="checkbox" :checked="draft.open" @change="toggleOpen" />
          {{ draft.open ? 'Dzień pracujący' : 'Dzień wolny' }}
        </label>

        <template v-if="draft.open">
          <div class="cms-form-row">
            <div class="cms-form-group">
              <label class="cms-form-label">Od</label>
              <input v-model="draft.from" type="time" class="cms-form-control" />
            </div>
            <div class="cms-form-group">
              <label class="cms-form-label">Do</label>
              <input v-model="draft.to" type="time" class="cms-form-control" />
            </div>
          </div>

          <label class="cms-form-label">Przerwy</label>
          <div v-if="!draft.breaks.length" class="cms-dim small mb-2">Brak przerw w tym dniu</div>
          <div v-for="(br, bi) in draft.breaks" :key="bi" class="d-flex gap-2 mb-2 align-items-center">
            <input v-model="br.from" type="time" class="cms-form-control" />
            <span class="cms-dim">—</span>
            <input v-model="br.to" type="time" class="cms-form-control" />
            <button type="button" class="cms-btn cms-btn-ghost cms-btn-sm" @click="removeBreak(bi)"><i class="bi-trash" /></button>
          </div>
          <button type="button" class="cms-btn cms-btn-outline cms-btn-sm mt-2" @click="addBreak">
            <i class="bi-plus" /> Dodaj przerwę
          </button>
        </template>
      </div>
      <div class="cms-modal-foot">
        <button type="button" class="cms-btn cms-btn-outline" @click="emit('close')">Anuluj</button>
        <button type="button" class="cms-btn cms-btn-cta" :disabled="saving" @click="submit">
          {{ saving ? 'Zapisywanie...' : 'Zapisz' }}
        </button>
      </div>
    </div>
  </div>
</template>
