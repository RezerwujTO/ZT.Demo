<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import CmsSidebar from '@/cms/components/CmsSidebar.vue'
import CmsHeader from '@/cms/components/CmsHeader.vue'
import VisitPanel from '@/cms/components/VisitPanel.vue'
import ClientPanel from '@/cms/components/ClientPanel.vue'
import BarberPanel from '@/cms/components/BarberPanel.vue'
import NewVisitModal from '@/cms/components/NewVisitModal.vue'
import AddBarberModal from '@/cms/components/AddBarberModal.vue'
import AddClientModal from '@/cms/components/AddClientModal.vue'
import SearchModal from '@/cms/components/SearchModal.vue'
import ConfirmDialog from '@/cms/components/ConfirmDialog.vue'
import OnboardingModal from '@/cms/components/OnboardingModal.vue'
import { useUiStore, useCmsStore } from '@/cms/stores/cms'
import '@/cms/styles/cms.css'

const ui = useUiStore()
const cms = useCmsStore()

const onKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    ui.openSearch()
  }
  if (e.key === 'Escape') {
    ui.closeSearch()
    ui.closeNewVisit()
    ui.closeVisitPanel()
    ui.closeClientPanel()
    ui.closeBarberPanel()
    ui.hideConfirm()
  }
}

onMounted(async () => {
  document.body.classList.add('cms-active')
  window.addEventListener('keydown', onKeydown)
  try {
    await cms.loadAll()
  } catch {
    /* error surfaced in cms.error */
  }
})

onUnmounted(() => {
  document.body.classList.remove('cms-active')
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="cms-layout">
    <CmsSidebar />
    <div class="cms-main">
      <CmsHeader />
      <main class="cms-content">
        <div v-if="cms.loading && !cms.initialized" class="cms-dim py-5 text-center">Ładowanie danych...</div>
        <div v-else-if="cms.error && !cms.initialized" class="cms-card cms-dim">{{ cms.error }}</div>
        <router-view v-else />
      </main>
    </div>
    <VisitPanel />
    <ClientPanel />
    <BarberPanel />
    <NewVisitModal />
    <AddBarberModal />
    <AddClientModal />
    <SearchModal />
    <ConfirmDialog />
    <OnboardingModal />
  </div>
</template>

<style>
body.cms-active {
  background: #0b1215;
  color: #d4dfe3;
  font-family: 'DM Sans', sans-serif;
}
</style>
