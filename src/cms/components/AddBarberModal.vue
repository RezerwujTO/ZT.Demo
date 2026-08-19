<script setup lang="ts">
import { ref } from 'vue'
import { useCmsStore, useUiStore } from '@/cms/stores/cms'
import { ApiError } from '@/lib/api'

const cms = useCmsStore()
const ui = useUiStore()

const form = ref({
  firstName: '',
  lastName: '',
  serviceIds: [] as string[],
})

const error = ref('')
const saving = ref(false)

const toggleService = (id: string) => {
  const idx = form.value.serviceIds.indexOf(id)
  if (idx >= 0) form.value.serviceIds.splice(idx, 1)
  else form.value.serviceIds.push(id)
}

const submit = async () => {
  error.value = ''
  if (form.value.firstName.trim().length < 2) { error.value = 'Podaj imię'; return }
  if (form.value.lastName.trim().length < 2) { error.value = 'Podaj nazwisko'; return }
  saving.value = true
  try {
    await cms.createBarber({
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim(),
      serviceIds: [...form.value.serviceIds],
    })
    form.value = { firstName: '', lastName: '', serviceIds: [] }
    ui.closeAddBarber()
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Nie udało się dodać specjalisty'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="ui.addBarberOpen" class="cms-modal-overlay" @click.self="ui.closeAddBarber">
    <div class="cms-modal">
      <div class="cms-modal-head">
        <h3>Nowy specjalista</h3>
        <button type="button" class="cms-icon-btn" @click="ui.closeAddBarber"><i class="bi-x-lg" /></button>
      </div>
      <div class="cms-modal-body">
        <div v-if="error" class="cms-dim mb-3" style="color: #e57373">{{ error }}</div>
        <div class="cms-form-row">
          <div class="cms-form-group">
            <label class="cms-form-label">Imię</label>
            <input v-model="form.firstName" type="text" class="cms-form-control" />
          </div>
          <div class="cms-form-group">
            <label class="cms-form-label">Nazwisko</label>
            <input v-model="form.lastName" type="text" class="cms-form-control" />
          </div>
        </div>
        <div class="cms-form-group">
          <label class="cms-form-label">Usługi</label>
          <div class="cms-checkbox-list">
            <label v-for="s in cms.services.filter(x => x.active)" :key="s.id" class="cms-checkbox-item">
              <input type="checkbox" :checked="form.serviceIds.includes(s.id)" @change="toggleService(s.id)" />
              {{ s.name }}
            </label>
          </div>
        </div>
      </div>
      <div class="cms-modal-foot">
        <button type="button" class="cms-btn cms-btn-outline" @click="ui.closeAddBarber">Anuluj</button>
        <button type="button" class="cms-btn cms-btn-cta" :disabled="saving" @click="submit">
          {{ saving ? 'Zapisywanie...' : 'Dodaj specjalistę' }}
        </button>
      </div>
    </div>
  </div>
</template>
