<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useCmsStore, useUiStore } from '@/cms/stores/cms'
import SearchSelect, { type SearchOption } from '@/cms/components/SearchSelect.vue'

const cms = useCmsStore()
const ui = useUiStore()

const form = ref({
  clientId: '',
  serviceId: '',
  barberId: '',
  date: '',
  time: '14:30',
})

watch(() => ui.newVisitOpen, (open) => {
  if (open) {
    form.value = {
      clientId: cms.clients[0]?.id ?? '',
      serviceId: cms.services[0]?.id ?? '',
      barberId: ui.newVisitPrefill.barberId ?? cms.barbers[0]?.id ?? '',
      date: ui.newVisitPrefill.date ?? cms.todayDate,
      time: ui.newVisitPrefill.time ?? '14:30',
    }
  }
})

const clientOptions = computed<SearchOption[]>(() =>
  cms.clients.map(c => ({ id: c.id, label: c.name, sub: c.phone })),
)

const serviceOptions = computed<SearchOption[]>(() =>
  cms.services.filter(s => s.active).map(s => ({ id: s.id, label: s.name, sub: `${s.price} zł · ${s.duration} min` })),
)

const availableBarbers = computed(() => {
  if (!form.value.serviceId) return cms.barbers.filter(b => b.active)
  const svc = cms.getService(form.value.serviceId)
  if (!svc) return cms.barbers.filter(b => b.active)
  return cms.barbers.filter(b => b.active && svc.barberIds.includes(b.id))
})

const barberOptions = computed<SearchOption[]>(() =>
  availableBarbers.value.map(b => ({ id: b.id, label: b.name, sub: `${b.todayVisits} wizyt dzisiaj` })),
)

const submitting = ref(false)

const submit = async () => {
  const client = cms.getClient(form.value.clientId)
  const service = cms.getService(form.value.serviceId)
  const barber = cms.getBarber(form.value.barberId)
  if (!client || !service || !barber) return

  submitting.value = true
  try {
    await cms.addVisit({
      clientId: client.id,
      client: client.name,
      clientPhone: client.phone,
      barberId: barber.id,
      barber: barber.name,
      serviceId: service.id,
      service: service.name,
      date: form.value.date,
      time: form.value.time,
      duration: service.duration,
      price: service.price,
      status: 'confirmed',
    })
    ui.closeNewVisit()
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div v-if="ui.newVisitOpen" class="cms-modal-overlay" @click.self="ui.closeNewVisit">
    <div class="cms-modal">
      <div class="cms-modal-head">
        <h3>Nowa wizyta</h3>
        <button type="button" class="cms-icon-btn" @click="ui.closeNewVisit"><i class="bi-x-lg" /></button>
      </div>
      <div class="cms-modal-body">
        <div class="cms-form-group">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <label class="cms-form-label mb-0">Klient</label>
            <button type="button" class="cms-btn cms-btn-ghost cms-btn-sm" @click="ui.openAddClient()">+ Nowy klient</button>
          </div>
          <SearchSelect
            v-model="form.clientId"
            :options="clientOptions"
            placeholder="Szukaj klienta po nazwisku lub telefonie"
            empty-text="Brak klientów"
          />
        </div>
        <div class="cms-form-group">
          <label class="cms-form-label">Usługa</label>
          <SearchSelect
            v-model="form.serviceId"
            :options="serviceOptions"
            placeholder="Szukaj usługi"
            empty-text="Brak usług"
          />
        </div>
        <div class="cms-form-group">
          <label class="cms-form-label">Specjalista</label>
          <SearchSelect
            v-model="form.barberId"
            :options="barberOptions"
            placeholder="Szukaj specjalisty"
            empty-text="Brak specjalistów dla tej usługi"
          />
        </div>
        <div class="cms-form-row">
          <div class="cms-form-group">
            <label class="cms-form-label">Data</label>
            <input v-model="form.date" type="date" class="cms-form-control" />
          </div>
          <div class="cms-form-group">
            <label class="cms-form-label">Godzina</label>
            <input v-model="form.time" type="time" class="cms-form-control" />
          </div>
        </div>
      </div>
      <div class="cms-modal-foot">
        <button type="button" class="cms-btn cms-btn-outline" @click="ui.closeNewVisit">Anuluj</button>
        <button type="button" class="cms-btn cms-btn-cta" :disabled="submitting || !form.clientId || !form.serviceId || !form.barberId" @click="submit">
          {{ submitting ? 'Zapisywanie...' : 'Zarezerwuj' }}
        </button>
      </div>
    </div>
  </div>
</template>
