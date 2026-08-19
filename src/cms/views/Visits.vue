<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCmsStore, useUiStore } from '@/cms/stores/cms'
import { statusLabels } from '@/cms/data/mock'

const cms = useCmsStore()
const ui = useUiStore()

const search = ref('')
const dateFilter = ref('all')
const barberFilter = ref('all')
const statusFilter = ref('all')

const filtered = computed(() => {
  let list = [...cms.visits]
  if (statusFilter.value !== 'all') list = list.filter(v => v.status === statusFilter.value)
  if (barberFilter.value !== 'all') list = list.filter(v => v.barberId === barberFilter.value)
  if (dateFilter.value === 'today') list = list.filter(v => v.date === cms.todayDate)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(v => v.client.toLowerCase().includes(q))
  }
  return list.sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
})
</script>

<template>
  <div>
    <div class="cms-page-head">
      <h2 class="mb-0">Wizyty</h2>
      <button type="button" class="cms-btn cms-btn-cta" @click="ui.openNewVisit()">
        <i class="bi-plus-lg" /> Nowa wizyta
      </button>
    </div>

    <div class="cms-filters">
      <div class="cms-search-inline">
        <i class="bi-search" />
        <input v-model="search" type="text" class="cms-form-control" placeholder="Szukaj klienta..." />
      </div>
      <select v-model="dateFilter" class="cms-form-select" style="width: auto">
        <option value="all">Data: Wszystkie</option>
        <option value="today">Dzisiaj</option>
      </select>
      <select v-model="barberFilter" class="cms-form-select" style="width: auto">
        <option value="all">Specjalista: Wszyscy</option>
        <option v-for="b in cms.barbers" :key="b.id" :value="b.id">{{ b.name }}</option>
      </select>
      <select v-model="statusFilter" class="cms-form-select" style="width: auto">
        <option value="all">Status: Wszystkie</option>
        <option value="confirmed">Potwierdzone</option>
        <option value="pending">Oczekujące</option>
        <option value="completed">Zakończone</option>
        <option value="cancelled">Anulowane</option>
      </select>
    </div>

    <div class="cms-card" style="padding: 0">
      <div class="cms-table-wrap">
        <table class="cms-table">
          <thead>
            <tr>
              <th>Klient</th>
              <th>Usługa</th>
              <th>Specjalista</th>
              <th>Termin</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in filtered" :key="v.id" @click="ui.openVisitPanel(v.id)">
              <td><strong>{{ v.client }}</strong></td>
              <td>{{ v.service }}</td>
              <td>{{ v.barber.split(' ')[0] }}</td>
              <td>{{ v.date.split('-').reverse().join('.') }} · {{ v.time }}</td>
              <td><span class="cms-badge" :class="'cms-badge-' + v.status">{{ statusLabels[v.status] }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!filtered.length" class="cms-empty">Brak wizyt</div>
    </div>
  </div>
</template>
