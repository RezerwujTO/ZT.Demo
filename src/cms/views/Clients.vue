<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCmsStore, useUiStore } from '@/cms/stores/cms'

const cms = useCmsStore()
const ui = useUiStore()
const search = ref('')

const clientCount = computed(() => cms.clients.length)
const newThisMonth = computed(() => cms.overview?.newClients ?? 0)

const filtered = computed(() => {
  if (!search.value) return cms.clients
  const q = search.value.toLowerCase()
  return cms.clients.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.phone.includes(q) ||
    c.email.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div>
    <div class="cms-page-head">
      <h2 class="mb-0">Klienci</h2>
      <button type="button" class="cms-btn cms-btn-cta cms-btn-sm" @click="ui.openAddClient()"><i class="bi-person-plus" /> Dodaj klienta</button>
    </div>

    <div class="cms-filters">
      <div class="cms-search-inline" style="max-width: 400px">
        <i class="bi-search" />
        <input v-model="search" type="text" class="cms-form-control" placeholder="Szukaj po imieniu, telefonie..." />
      </div>
    </div>

    <div class="cms-inline-stats">
      <span><strong>{{ clientCount.toLocaleString('pl-PL') }}</strong> klientów</span>
      <span v-if="newThisMonth" class="cms-accent">↑ {{ newThisMonth }} w tym miesiącu</span>
    </div>

    <div class="cms-card" style="padding: 0">
      <div class="cms-table-wrap">
        <table class="cms-table">
          <thead>
            <tr>
              <th>Klient</th>
              <th>Wizyty</th>
              <th>Ostatnia</th>
              <th>Wydano</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filtered" :key="c.id" @click="ui.openClientPanel(c.id)">
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="cms-user-card-ava" style="width: 30px; height: 30px; font-size: 0.72rem">{{ c.name.charAt(0) }}</div>
                  <strong>{{ c.name }}</strong>
                </div>
              </td>
              <td>{{ c.visits }}</td>
              <td>{{ c.lastVisit.split('-').reverse().join('.') }}</td>
              <td>{{ c.totalSpent.toLocaleString('pl-PL') }} zł</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
