<template>
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component" />
        <template #fallback>
          <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0b1215;color:#a6bac2;font-family:'DM Sans',sans-serif">
            <div style="text-align:center">
              <div style="width:24px;height:24px;border:2px solid transparent;border-top-color:#7fb3c2;border-radius:50%;animation:spin .7s linear infinite;margin:0 auto 12px"></div>
              Ładowanie...
            </div>
          </div>
        </template>
      </Suspense>
    </template>
  </router-view>
  <CookieConsent />
</template>

<script setup lang="ts">
import CookieConsent from '@/components/CookieConsent.vue'
</script>

<style>
@keyframes spin { to { transform: rotate(360deg) } }
</style>
