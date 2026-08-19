<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCmsStore, useUiStore } from '@/cms/stores/cms'

const cms = useCmsStore()
const ui = useUiStore()
const router = useRouter()

const menuId = ref<string | null>(null)

const openMenu = (id: string) => {
  menuId.value = menuId.value === id ? null : id
}

const closeMenu = () => { menuId.value = null }

const activeBarber = computed(() => (menuId.value ? cms.getBarber(menuId.value) : null))

const showProfile = (id: string) => {
  closeMenu()
  ui.openBarberPanel(id)
}

const newVisit = (id: string) => {
  closeMenu()
  ui.openNewVisit({ barberId: id })
}

const goToSchedule = (id: string) => {
  closeMenu()
  router.push({ path: '/cms/godziny', query: { specjalista: id } })
}

const toggleActive = async (id: string) => {
  closeMenu()
  await cms.toggleBarberActive(id)
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeMenu()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div>
    <div class="cms-page-head">
      <h2 class="mb-0">Zespół</h2>
      <button type="button" class="cms-btn cms-btn-cta cms-btn-sm" @click="ui.openAddBarber()"><i class="bi-person-plus" /> Dodaj specjalistę</button>
    </div>

    <div class="cms-card" style="padding: 0">
      <div
        v-for="b in cms.barbers"
        :key="b.id"
        class="cms-barber-row"
        @click="ui.openBarberPanel(b.id)"
      >
        <div class="cms-barber-row-left">
          <div class="cms-barber-row-ava"><i class="bi-person-fill" /></div>
          <div>
            <h5 class="mb-1">{{ b.name }}</h5>
            <p class="cms-dim small mb-0">{{ b.todayVisits }} wizyt dzisiaj · {{ b.occupancy }}% obłożenia</p>
          </div>
        </div>
        <div class="d-flex align-items-center gap-3">
          <span class="cms-badge" :class="b.active ? 'cms-badge-active' : 'cms-badge-inactive'">{{ b.active ? 'Aktywny' : 'Nieaktywny' }}</span>
          <div class="cms-row-menu-wrap">
            <button type="button" class="cms-btn cms-btn-ghost cms-btn-sm" @click.stop="openMenu(b.id)"><i class="bi-three-dots" /></button>
            <div v-if="menuId === b.id" class="cms-row-menu" @click.stop>
              <button type="button" class="cms-row-menu-item" @click="showProfile(b.id)">
                <i class="bi-person-badge" /> Zobacz profil
              </button>
              <button type="button" class="cms-row-menu-item" @click="newVisit(b.id)">
                <i class="bi-calendar-plus" /> Nowa wizyta
              </button>
              <button type="button" class="cms-row-menu-item" @click="goToSchedule(b.id)">
                <i class="bi-clock" /> Grafik pracy
              </button>
              <div class="cms-row-menu-divider" />
              <button type="button" class="cms-row-menu-item" :class="{ danger: b.active }" @click="toggleActive(b.id)">
                <i :class="b.active ? 'bi-pause-circle' : 'bi-play-circle'" />
                {{ b.active ? 'Dezaktywuj' : 'Aktywuj' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeBarber" class="cms-row-menu-backdrop" @click="closeMenu" />
  </div>
</template>
