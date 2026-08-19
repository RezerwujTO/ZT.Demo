<script setup lang="ts">
defineProps<{ open: boolean; title: string }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <div class="cms-panel-overlay" :class="{ open }" @click="$emit('close')" />
  <aside class="cms-panel" :class="{ open }">
    <div class="cms-panel-head">
      <h3>{{ title }}</h3>
      <button type="button" class="cms-icon-btn" @click="$emit('close')"><i class="bi-x-lg" /></button>
    </div>
    <div class="cms-panel-body"><slot /></div>
    <div v-if="$slots.footer" class="cms-panel-foot"><slot name="footer" /></div>
  </aside>
</template>
