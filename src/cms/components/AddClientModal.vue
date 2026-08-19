<script setup lang="ts">
import { ref } from 'vue'
import { useCmsStore, useUiStore } from '@/cms/stores/cms'
import { ApiError } from '@/lib/api'

const cms = useCmsStore()
const ui = useUiStore()

const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  notes: '',
})

const error = ref('')
const saving = ref(false)

const submit = async () => {
  error.value = ''
  if (form.value.firstName.trim().length < 2) { error.value = 'Podaj imię'; return }
  if (form.value.phone.trim().length < 9) { error.value = 'Podaj numer telefonu'; return }
  saving.value = true
  try {
    const id = await cms.createClient({
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim() || undefined,
      phone: form.value.phone.trim(),
      email: form.value.email.trim() || undefined,
      notes: form.value.notes.trim() || undefined,
    })
    form.value = { firstName: '', lastName: '', phone: '', email: '', notes: '' }
    ui.closeAddClient()
    ui.openClientPanel(id)
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Nie udało się dodać klienta'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="ui.addClientOpen" class="cms-modal-overlay" @click.self="ui.closeAddClient">
    <div class="cms-modal">
      <div class="cms-modal-head">
        <h3>Nowy klient</h3>
        <button type="button" class="cms-icon-btn" @click="ui.closeAddClient"><i class="bi-x-lg" /></button>
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
        <div class="cms-form-row">
          <div class="cms-form-group">
            <label class="cms-form-label">Telefon</label>
            <input v-model="form.phone" type="tel" class="cms-form-control" placeholder="+48123456789" />
          </div>
          <div class="cms-form-group">
            <label class="cms-form-label">Email</label>
            <input v-model="form.email" type="email" class="cms-form-control" />
          </div>
        </div>
        <div class="cms-form-group">
          <label class="cms-form-label">Notatki</label>
          <textarea v-model="form.notes" class="cms-form-textarea" rows="2" />
        </div>
      </div>
      <div class="cms-modal-foot">
        <button type="button" class="cms-btn cms-btn-outline" @click="ui.closeAddClient">Anuluj</button>
        <button type="button" class="cms-btn cms-btn-cta" :disabled="saving" @click="submit">
          {{ saving ? 'Zapisywanie...' : 'Dodaj klienta' }}
        </button>
      </div>
    </div>
  </div>
</template>
