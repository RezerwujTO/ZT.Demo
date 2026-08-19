<script setup lang="ts">
import { useUiStore } from '@/cms/stores/cms'

const ui = useUiStore()

const confirm = async () => {
  await ui.confirmDialog.onConfirm()
}
</script>

<template>
  <div v-if="ui.confirmDialog.show" class="cms-modal-overlay" @click.self="ui.hideConfirm">
    <div class="cms-modal" style="max-width: 400px">
      <div class="cms-modal-head">
        <h3>{{ ui.confirmDialog.title }}</h3>
      </div>
      <div class="cms-modal-body">
        <p class="mb-0 cms-dim">{{ ui.confirmDialog.message }}</p>
      </div>
      <div class="cms-modal-foot">
        <button type="button" class="cms-btn cms-btn-outline" @click="ui.hideConfirm">Anuluj</button>
        <button type="button" class="cms-btn cms-btn-cta" @click="confirm">Potwierdź</button>
      </div>
    </div>
  </div>
</template>
