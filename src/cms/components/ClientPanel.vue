<script setup lang="ts">
import { computed, watch } from 'vue'
import { useCmsStore, useUiStore } from '@/cms/stores/cms'
import SidePanel from '@/cms/components/SidePanel.vue'

const cms = useCmsStore()
const ui = useUiStore()

const client = computed(() => ui.clientPanelId ? cms.getClient(ui.clientPanelId) : null)
const history = computed(() => (ui.clientPanelId ? cms.clientHistory[ui.clientPanelId] ?? [] : []))

watch(() => ui.clientPanelId, (id) => {
  if (id) cms.fetchClientDetail(id).catch(() => {})
})

const newVisit = () => {
  if (!client.value) return
  ui.closeClientPanel()
  ui.openNewVisit()
}
</script>

<template>
  <SidePanel :open="!!ui.clientPanelId" :title="client?.name ?? 'Klient'" @close="ui.closeClientPanel">
    <template v-if="client">
      <p class="cms-dim mb-1">{{ client.phone }}</p>
      <p class="cms-dim mb-3">{{ client.email }}</p>

      <div class="d-flex gap-2 mb-4">
        <button type="button" class="cms-btn cms-btn-cta cms-btn-sm" @click="newVisit"><i class="bi-plus-lg" /> Wizyta</button>
        <button type="button" class="cms-btn cms-btn-outline cms-btn-sm"><i class="bi-pencil" /> Edytuj</button>
      </div>

      <div class="cms-mini-stats">
        <div>
          <div class="cms-mini-stat-val">{{ client.visits }}</div>
          <div class="cms-mini-stat-lbl">Wizyt</div>
        </div>
        <div>
          <div class="cms-mini-stat-val">{{ client.totalSpent }} zł</div>
          <div class="cms-mini-stat-lbl">Wydano</div>
        </div>
        <div>
          <div class="cms-mini-stat-val">{{ client.daysSinceLastVisit }} dni</div>
          <div class="cms-mini-stat-lbl">Od ostatniej</div>
        </div>
      </div>

      <div class="cms-divider" />

      <h6 class="cms-card-title">Historia</h6>
      <div v-for="(h, i) in history" :key="i" class="d-flex justify-content-between py-2" style="border-bottom: 1px solid var(--c3); font-size: 0.84rem">
        <span><span class="cms-dim">{{ h.date }}</span> {{ h.service }}</span>
        <span>{{ h.price }} zł</span>
      </div>

      <div v-if="client.notes" class="cms-info-row mt-3">
        <div class="cms-info-label">Notatki</div>
        <div class="cms-info-val cms-dim">"{{ client.notes }}"</div>
      </div>

      <div v-if="client.daysSinceLastVisit > 30" class="cms-retention-alert">
        <i class="bi-bell" />
        Klient nie był {{ client.daysSinceLastVisit }} dni
      </div>
    </template>
  </SidePanel>
</template>
