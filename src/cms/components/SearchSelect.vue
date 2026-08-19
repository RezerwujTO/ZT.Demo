<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'

export interface SearchOption {
  id: string
  label: string
  sub?: string
}

const props = withDefaults(defineProps<{
  modelValue: string
  options: SearchOption[]
  placeholder?: string
  emptyText?: string
}>(), {
  placeholder: 'Szukaj...',
  emptyText: 'Brak wyników',
})

const emit = defineEmits<{
  'update:modelValue': [string]
}>()

const open = ref(false)
const query = ref('')
const root = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)

const selected = computed(() => props.options.find(o => o.id === props.modelValue) ?? null)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter(o =>
    o.label.toLowerCase().includes(q) || (o.sub ?? '').toLowerCase().includes(q),
  )
})

const openList = async () => {
  open.value = true
  query.value = ''
  await Promise.resolve()
  input.value?.focus()
}

const closeList = () => {
  open.value = false
  query.value = ''
}

const pick = (option: SearchOption) => {
  emit('update:modelValue', option.id)
  closeList()
}

const onDocumentClick = (event: MouseEvent) => {
  if (!open.value) return
  if (root.value && !root.value.contains(event.target as Node)) closeList()
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && open.value) {
    event.stopPropagation()
    closeList()
  }
  if (event.key === 'Enter' && open.value) {
    event.preventDefault()
    const first = filtered.value[0]
    if (first) pick(first)
  }
}

watch(() => props.options, () => {
  if (!props.modelValue) return
  if (!props.options.some(o => o.id === props.modelValue)) emit('update:modelValue', '')
})

onMounted(() => document.addEventListener('mousedown', onDocumentClick))
onUnmounted(() => document.removeEventListener('mousedown', onDocumentClick))
</script>

<template>
  <div ref="root" class="cms-search-select">
    <button v-if="!open" type="button" class="cms-form-select cms-search-select-trigger" @click="openList">
      <span :class="{ 'cms-dim': !selected }">{{ selected?.label ?? placeholder }}</span>
      <span v-if="selected?.sub" class="cms-search-select-sub">{{ selected.sub }}</span>
      <i class="bi-chevron-down" />
    </button>

    <div v-else class="cms-search-select-panel">
      <div class="cms-search-select-input">
        <i class="bi-search" />
        <input
          ref="input"
          v-model="query"
          type="text"
          class="cms-form-control"
          :placeholder="placeholder"
          @keydown="onKeydown"
        />
        <button type="button" class="cms-search-select-close" @click="closeList"><i class="bi-x-lg" /></button>
      </div>
      <div class="cms-search-select-list">
        <button
          v-for="option in filtered"
          :key="option.id"
          type="button"
          class="cms-search-select-item"
          :class="{ active: option.id === modelValue }"
          @click="pick(option)"
        >
          <span>{{ option.label }}</span>
          <span v-if="option.sub" class="cms-search-select-sub">{{ option.sub }}</span>
        </button>
        <div v-if="!filtered.length" class="cms-search-select-empty">{{ emptyText }}</div>
      </div>
    </div>
  </div>
</template>
