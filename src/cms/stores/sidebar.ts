import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('cmsSidebar', () => {
  const visible = ref(true)
  const mobileOpen = ref(false)

  const toggle = () => {
    visible.value = !visible.value
  }

  const toggleMobile = () => {
    mobileOpen.value = !mobileOpen.value
  }

  const openMobile = () => {
    mobileOpen.value = true
  }

  const closeMobile = () => {
    mobileOpen.value = false
  }

  const show = () => {
    visible.value = true
  }

  return { visible, mobileOpen, toggle, toggleMobile, openMobile, closeMobile, show }
})
