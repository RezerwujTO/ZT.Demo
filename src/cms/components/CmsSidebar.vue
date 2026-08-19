<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { navGroups } from '@/cms/_nav'
import { useSidebarStore } from '@/cms/stores/sidebar'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const sidebar = useSidebarStore()
const auth = useAuthStore()

const currentUser = computed(() => {
  const first = auth.user?.firstName ?? ''
  const last = auth.user?.lastName ?? ''
  const initials = (first.charAt(0) + last.charAt(0)).toUpperCase() || (auth.user?.email?.charAt(0)?.toUpperCase() ?? 'U')
  const name = ([first, last].filter(Boolean).join(' ') || auth.user?.email) ?? 'Użytkownik'
  const role = auth.user?.role === 'OWNER' ? 'Właściciel' : auth.user?.role === 'MANAGER' ? 'Menedżer' : auth.user?.role === 'STAFF' ? 'Specjalista' : 'Użytkownik'
  return { name, role, initials }
})

const sidebarClass = computed(() => ({
  collapsed: !sidebar.visible,
  'mobile-open': sidebar.mobileOpen,
}))

const isActive = (to: string) => {
  if (to === '/cms') return route.path === '/cms'
  return route.path.startsWith(to)
}
</script>

<template>
  <div class="cms-overlay" :class="{ show: sidebar.mobileOpen }" @click="sidebar.closeMobile" />
  <aside class="cms-sidebar" :class="sidebarClass">
    <RouterLink to="/cms" class="cms-sidebar-brand" @click="sidebar.closeMobile">
      <i class="bi-calendar2-check" />
      <span v-show="sidebar.visible" class="cms-brand-text">ZAREZERWUJ<span class="cms-brand-accent">TO</span></span>
    </RouterLink>

    <nav class="cms-nav">
      <template v-for="(group, gi) in navGroups" :key="gi">
        <div v-if="group.divider" class="cms-nav-divider" />
        <RouterLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="cms-nav-link"
          :class="{ active: isActive(item.to) }"
          :title="!sidebar.visible ? item.name : undefined"
          @click="sidebar.closeMobile"
        >
          <i :class="item.icon" />
          <span v-show="sidebar.visible">{{ item.name }}</span>
        </RouterLink>
      </template>
    </nav>

    <div class="cms-sidebar-bottom">
      <RouterLink
        to="/cms/pomoc"
        class="cms-nav-help"
        :class="{ active: route.path === '/cms/pomoc' }"
        :title="!sidebar.visible ? 'Pomoc' : undefined"
        @click="sidebar.closeMobile"
      >
        <i class="bi-chat-dots" />
        <span v-show="sidebar.visible">Pomoc</span>
      </RouterLink>
      <div class="cms-user-card" :title="!sidebar.visible ? currentUser.name : undefined">
        <div class="cms-user-card-ava">{{ currentUser.initials }}</div>
        <div v-show="sidebar.visible" class="cms-user-card-info">
          <div class="cms-user-card-name">{{ currentUser.name }}</div>
          <div class="cms-user-card-role">{{ currentUser.role }}</div>
        </div>
      </div>
    </div>
  </aside>
</template>
