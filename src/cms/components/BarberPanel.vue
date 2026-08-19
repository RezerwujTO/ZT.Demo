<script setup lang="ts">
import { computed } from 'vue'
import { useCmsStore, useUiStore } from '@/cms/stores/cms'
import SidePanel from '@/cms/components/SidePanel.vue'

const cms = useCmsStore()
const ui = useUiStore()

const barber = computed(() => ui.barberPanelId ? cms.getBarber(ui.barberPanelId) : null)

const barberServices = computed(() => {
  if (!barber.value) return []
  return cms.services.filter(s => barber.value!.serviceIds.includes(s.id))
})

const schedule = computed(() => {
  if (!barber.value) return []
  return cms.barberSchedules.find(bs => bs.barberId === barber.value!.id)?.days ?? []
})
</script>

<template>
  <SidePanel :open="!!ui.barberPanelId" :title="barber?.name ?? 'Specjalista'" @close="ui.closeBarberPanel">
    <template v-if="barber">
      <button type="button" class="cms-btn cms-btn-outline cms-btn-sm mb-4"><i class="bi-pencil" /> Edytuj profil</button>

      <div class="cms-mini-stats">
        <div>
          <div class="cms-mini-stat-val">{{ barber.totalVisits }}</div>
          <div class="cms-mini-stat-lbl">Wizyty</div>
        </div>
        <div>
          <div class="cms-mini-stat-val">{{ barber.revenue.toLocaleString('pl-PL') }} zł</div>
          <div class="cms-mini-stat-lbl">Przychód</div>
        </div>
        <div>
          <div class="cms-mini-stat-val">{{ barber.occupancy }}%</div>
          <div class="cms-mini-stat-lbl">Obłożenie</div>
        </div>
      </div>

      <div class="cms-divider" />

      <h6 class="cms-card-title">Usługi</h6>
      <div class="cms-checkbox-list mb-4">
        <label v-for="s in barberServices" :key="s.id" class="cms-checkbox-item">
          <input type="checkbox" checked disabled />
          {{ s.name }}
        </label>
      </div>

      <div class="cms-divider" />

      <h6 class="cms-card-title">Grafik</h6>
      <div v-for="d in schedule" :key="d.day" class="d-flex justify-content-between py-2" style="font-size: 0.84rem; border-bottom: 1px solid var(--c3)">
        <span class="cms-dim">{{ d.short }}</span>
        <span v-if="d.open">{{ d.from }}–{{ d.to }}</span>
        <span v-else class="cms-dim">Wolne</span>
      </div>
    </template>
  </SidePanel>
</template>
