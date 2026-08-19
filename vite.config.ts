import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type PluginOption, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const isProd = mode === 'production'
  const plugins: PluginOption[] = [vue()]

  if (!isProd) {
    try {
      const { default: vueDevTools } = await import('vite-plugin-vue-devtools')
      plugins.push(vueDevTools())
    } catch {
      void 0
    }
  }

  return {
    plugins,
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
    },
    preview: {
      host: '0.0.0.0',
      allowedHosts: true,
    },
    build: {
      target: 'es2020',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/vue') || id.includes('node_modules/vue-router') || id.includes('node_modules/pinia')) return 'vendor'
            if (id.includes('node_modules/bootstrap') || id.includes('node_modules/bootstrap-icons')) return 'bootstrap'
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
