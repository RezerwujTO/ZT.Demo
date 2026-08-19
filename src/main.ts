import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './routes/router'
import { useAuthStore } from '@/stores/auth'

async function bootstrap() {
  const app = createApp(App)

  app.config.errorHandler = (err, instance, info) => {
    console.error('[Vue error]', { err, info, component: instance?.$options?.name })
  }

  const pinia = createPinia()
  app.use(pinia)

  try {
    await useAuthStore().init()
  } catch (err) {
    console.error('[Auth init failed]', err)
  }

  app.use(router)

  await router.isReady()
  app.mount('#app')
}

bootstrap().catch((err) => {
  console.error('[Bootstrap failed]', err)
  const el = document.getElementById('app')
  if (el) {
    el.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#a6bac2;font-family:system-ui">Przepraszamy — wystąpił błąd. Odśwież stronę.</div>'
  }
})
