<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCmsStore, useUiStore } from '@/cms/stores/cms'
import SidePanel from '@/cms/components/SidePanel.vue'

const cms = useCmsStore()
const ui = useUiStore()

const form = ref({
  name: '',
  description: '',
  price: 0,
  duration: 45,
  barberIds: [] as string[],
})

watch(() => ui.servicePanelMode, (mode) => {
  if (mode === 'new') {
    form.value = { name: '', description: '', price: 0, duration: 45, barberIds: cms.barbers.filter(b => b.active).map(b => b.id) }
  } else if (mode === 'edit' && ui.serviceEditId) {
    const s = cms.getService(ui.serviceEditId)
    if (s) form.value = { name: s.name, description: s.description, price: s.price, duration: s.duration, barberIds: [...s.barberIds] }
  }
})

const panelTitle = computed(() => ui.servicePanelMode === 'new' ? 'Nowa usługa' : 'Edytuj usługę')

const toggleBarber = (id: string) => {
  const idx = form.value.barberIds.indexOf(id)
  if (idx >= 0) form.value.barberIds.splice(idx, 1)
  else form.value.barberIds.push(id)
}

const saving = ref(false)

const save = async () => {
  saving.value = true
  try {
    await cms.saveService(
      ui.servicePanelMode === 'edit' ? ui.serviceEditId : null,
      { ...form.value },
    )
    ui.closeServicePanel()
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="cms-page-head">
      <h2 class="mb-0">Usługi</h2>
      <button type="button" class="cms-btn cms-btn-cta cms-btn-sm" @click="ui.openServiceNew()">
        <i class="bi-plus-lg" /> Dodaj usługę
      </button>
    </div>

    <div class="cms-card" style="padding: 0">
      <div v-for="s in cms.services" :key="s.id" class="cms-service-row">
        <div class="cms-service-row-info">
          <div class="d-flex align-items-center gap-2 mb-1">
            <h5>{{ s.name }}</h5>
            <span class="cms-badge" :class="s.active ? 'cms-badge-active' : 'cms-badge-inactive'">{{ s.active ? 'Aktywna' : 'Nieaktywna' }}</span>
          </div>
          <div class="cms-service-row-meta">{{ s.duration }} min · {{ s.price }} zł</div>
        </div>
        <div class="d-flex gap-2">
          <button type="button" class="cms-btn cms-btn-outline cms-btn-sm" @click="ui.openServiceEdit(s.id)">Edytuj</button>
          <button type="button" class="cms-btn cms-btn-ghost cms-btn-sm" @click="cms.toggleServiceActive(s.id)"><i class="bi-three-dots" /></button>
        </div>
      </div>
    </div>

    <SidePanel :open="ui.servicePanelMode !== 'closed'" :title="panelTitle" @close="ui.closeServicePanel">
      <div class="cms-form-group">
        <label class="cms-form-label">Nazwa</label>
        <input v-model="form.name" type="text" class="cms-form-control" placeholder="Skin Fade" />
      </div>
      <div class="cms-form-group">
        <label class="cms-form-label">Opis</label>
        <textarea v-model="form.description" class="cms-form-textarea" rows="3" />
      </div>
      <div class="cms-form-row">
        <div class="cms-form-group">
          <label class="cms-form-label">Cena</label>
          <input v-model.number="form.price" type="number" class="cms-form-control" />
        </div>
        <div class="cms-form-group">
          <label class="cms-form-label">Czas trwania</label>
          <select v-model.number="form.duration" class="cms-form-select">
            <option :value="30">30 min</option>
            <option :value="45">45 min</option>
            <option :value="60">60 min</option>
            <option :value="90">90 min</option>
          </select>
        </div>
      </div>
      <div class="cms-form-group">
        <label class="cms-form-label">Specjaliści</label>
        <div class="cms-checkbox-list">
          <label v-for="b in cms.barbers.filter(x => x.active)" :key="b.id" class="cms-checkbox-item">
            <input type="checkbox" :checked="form.barberIds.includes(b.id)" @change="toggleBarber(b.id)" />
            {{ b.name }}
          </label>
        </div>
      </div>
      <template #footer>
        <button type="button" class="cms-btn cms-btn-outline cms-btn-block" @click="ui.closeServicePanel">Anuluj</button>
        <button type="button" class="cms-btn cms-btn-cta cms-btn-block" :disabled="saving" @click="save">
          {{ saving ? 'Zapisywanie...' : 'Zapisz usługę' }}
        </button>
      </template>
    </SidePanel>
  </div>
</template>
