<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCmsStore, useUiStore } from '@/cms/stores/cms'

const cms = useCmsStore()
const ui = useUiStore()
const router = useRouter()
const query = ref('')

watch(() => ui.searchOpen, (open) => { if (open) query.value = '' })

interface Result {
  type: string
  label: string
  sub?: string
  icon: string
  action: () => void
}

const results = computed<Result[]>(() => {
  if (!query.value.trim()) return []
  const q = query.value.toLowerCase()
  const items: Result[] = []

  cms.clients.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q)).slice(0, 3).forEach(c => {
    items.push({
      type: 'Klient',
      label: c.name,
      sub: c.phone,
      icon: 'bi-person',
      action: () => { ui.closeSearch(); ui.openClientPanel(c.id) },
    })
  })

  cms.services.filter(s => s.name.toLowerCase().includes(q)).slice(0, 2).forEach(s => {
    items.push({
      type: 'Usługa',
      label: s.name,
      sub: `${s.price} zł · ${s.duration} min`,
      icon: 'bi-scissors',
      action: () => { ui.closeSearch(); router.push('/cms/uslugi') },
    })
  })

  cms.visits.filter(v =>
    v.client.toLowerCase().includes(q) ||
    v.service.toLowerCase().includes(q)
  ).slice(0, 3).forEach(v => {
    items.push({
      type: 'Wizyta',
      label: `${v.client} — ${v.time}`,
      sub: v.service,
      icon: 'bi-calendar-check',
      action: () => { ui.closeSearch(); ui.openVisitPanel(v.id) },
    })
  })

  cms.barbers.filter(b => b.name.toLowerCase().includes(q)).slice(0, 2).forEach(b => {
    items.push({
      type: 'Specjalista',
      label: b.name,
      icon: 'bi-person-badge',
      action: () => { ui.closeSearch(); ui.openBarberPanel(b.id) },
    })
  })

  return items
})

const run = (r: Result) => r.action()
</script>

<template>
  <div v-if="ui.searchOpen" class="cms-modal-overlay" @click.self="ui.closeSearch">
    <div class="cms-modal cms-search-modal">
      <div class="cms-modal-body" style="padding-top: 20px">
        <div class="cms-search-inline mb-3" style="max-width: none">
          <i class="bi-search" />
          <input v-model="query" type="text" class="cms-form-control" placeholder="Szukaj klientów, wizyt, usług..." autofocus />
        </div>
        <div v-if="results.length">
          <div v-for="(r, i) in results" :key="i" class="cms-search-result" @click="run(r)">
            <i :class="r.icon" />
            <div>
              <div>{{ r.label }}</div>
              <div class="cms-search-result-type">{{ r.type }}<span v-if="r.sub"> · {{ r.sub }}</span></div>
            </div>
          </div>
        </div>
        <div v-else-if="query" class="cms-empty py-3">Brak wyników</div>
        <div v-else class="cms-dim small py-2">Wpisz frazę, aby wyszukać...</div>
      </div>
    </div>
  </div>
</template>
