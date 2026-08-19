<script setup lang="ts">
import { computed } from 'vue'
import { useCmsStore, useUiStore } from '@/cms/stores/cms'
import { statusLabels } from '@/cms/data/mock'
import SidePanel from '@/cms/components/SidePanel.vue'

const cms = useCmsStore()
const ui = useUiStore()

const visit = computed(() => ui.visitPanelId ? cms.getVisit(ui.visitPanelId) : null)

const statusClass = computed(() => visit.value ? `cms-badge-${visit.value.status}` : '')

const complete = async () => {
  if (!visit.value) return
  await cms.completeVisit(visit.value.id)
  ui.closeVisitPanel()
}

const cancel = () => {
  if (!visit.value) return
  ui.showConfirm('Anuluj wizytę', `Czy na pewno anulować wizytę ${visit.value.client}?`, async () => {
    await cms.cancelVisit(visit.value!.id)
    ui.hideConfirm()
    ui.closeVisitPanel()
  })
}

const reschedule = () => {
  if (!visit.value) return
  ui.closeVisitPanel()
  ui.openNewVisit({ barberId: visit.value.barberId, date: visit.value.date, time: visit.value.time })
}
</script>

<template>
  <SidePanel :open="!!ui.visitPanelId" title="Wizyta" @close="ui.closeVisitPanel">
    <template v-if="visit">
      <h4 class="mb-1">{{ visit.client }}</h4>
      <p class="cms-dim mb-3">{{ visit.clientPhone }}</p>

      <div class="cms-divider" />

      <p class="mb-1"><strong>{{ visit.service }}</strong></p>
      <p class="cms-dim mb-1">{{ visit.barber }}</p>
      <p class="cms-dim mb-3">{{ visit.date.split('-').reverse().join('.') }} · {{ visit.time }}</p>

      <p class="fs-4 fw-bold mb-3">{{ visit.price }} zł</p>

      <span class="cms-badge mb-4" :class="statusClass">{{ statusLabels[visit.status].toUpperCase() }}</span>
    </template>

    <template #footer>
      <button v-if="visit && visit.status !== 'completed'" type="button" class="cms-btn cms-btn-cta cms-btn-block" @click="complete">
        <i class="bi-check-lg" /> Zakończ wizytę
      </button>
      <button type="button" class="cms-btn cms-btn-outline cms-btn-block" @click="reschedule">
        <i class="bi-arrow-repeat" /> Przenieś
      </button>
      <button v-if="visit && visit.status !== 'cancelled'" type="button" class="cms-btn cms-btn-danger cms-btn-block" @click="cancel">
        Anuluj
      </button>
    </template>
  </SidePanel>
</template>
