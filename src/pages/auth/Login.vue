<template>
  <div class="auth-overlay" v-if="showAuthModal">
    <div class="auth-modal">
      <div class="auth-header">
        <div class="auth-logo mb-3">
          <i class="bi-calendar2-check me-2"></i>
          <span>ZAREZERWUJ<span class="accent-text">TO</span></span>
        </div>
        <div class="auth-badge"><i class="bi-shield-lock me-1"></i>Panel salonu</div>
      </div>

      <div class="auth-body">
        <form @submit.prevent="handleLogin">
          <div class="auth-field">
            <label>Email</label>
            <div class="field-wrap">
              <i class="bi-envelope field-ico"></i>
              <input v-model="loginForm.email" type="email" class="form-control" placeholder="salon@email.pl" autocomplete="off" />
            </div>
          </div>

          <div class="auth-field">
            <label>Hasło</label>
            <div class="field-wrap">
              <i class="bi-lock field-ico"></i>
              <input v-model="loginForm.password" type="password" class="form-control" placeholder="••••••••" autocomplete="off" />
            </div>
          </div>

          <button type="submit" class="auth-submit" :disabled="authLoading">
            <span v-if="authLoading" class="spinner"></span>
            <template v-else><i class="bi-box-arrow-in-right me-2"></i>Zaloguj się</template>
          </button>

          <div v-if="authSuccess" class="auth-msg ok"><i class="bi-check-circle-fill me-2"></i>Zalogowano! Przekierowanie do panelu...</div>
          <div v-if="authError" class="auth-msg err"><i class="bi-exclamation-circle-fill me-2"></i>{{ authError }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ApiError } from '@/lib/api'
import { createTypewriter, demoCredentials } from '@/demo/typing'

export default defineComponent({
  name: 'AuthModal',
  props: {
    modelValue: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()

    const showAuthModal = computed({
      get: () => props.modelValue,
      set: (v: boolean) => emit('update:modelValue', v),
    })

    const loginForm = reactive({ email: '', password: '' })
    const authLoading = ref(false)
    const authSuccess = ref(false)
    const authError = ref('')

    const typewriter = createTypewriter()
    let autoSubmitTimer: ReturnType<typeof setTimeout> | null = null

    const handleLogin = async () => {
      if (authLoading.value || authSuccess.value) return
      authError.value = ''
      authLoading.value = true
      try {
        await authStore.login(loginForm.email || demoCredentials.email, loginForm.password || demoCredentials.password)
        authSuccess.value = true
        const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/cms'
        await router.push(redirect)
      } catch (e) {
        authError.value = e instanceof ApiError ? e.message : 'Logowanie nie powiodło się'
      } finally {
        authLoading.value = false
      }
    }

    const runDemoLogin = async () => {
      loginForm.email = ''
      loginForm.password = ''
      const typedEmail = await typewriter.type(demoCredentials.email, v => { loginForm.email = v }, { startDelay: 650 })
      if (!typedEmail) return
      const typedPassword = await typewriter.type(demoCredentials.password, v => { loginForm.password = v }, { startDelay: 450, speed: 75 })
      if (!typedPassword) return
      autoSubmitTimer = setTimeout(() => {
        autoSubmitTimer = null
        void handleLogin()
      }, 850)
    }

    onMounted(() => {
      if (showAuthModal.value) void runDemoLogin()
    })

    onUnmounted(() => {
      typewriter.stop()
      if (autoSubmitTimer) clearTimeout(autoSubmitTimer)
    })

    return { showAuthModal, loginForm, authLoading, authSuccess, authError, handleLogin }
  },
})
</script>

<style scoped>
.auth-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; }
.auth-modal { background: var(--c1); border: 1px solid var(--c3); border-radius: var(--radius); width: 100%; max-width: 400px; position: relative; }
.auth-header { text-align: center; padding: 34px 28px 0; }
.auth-logo { font-weight: 700; font-size: 1.2rem; letter-spacing: 2px; color: var(--ct); }
.auth-logo i { color: var(--ca); }
.auth-badge { display: inline-flex; align-items: center; background: var(--c2); border: 1px solid var(--c3); color: var(--ca); font-size: 0.68rem; font-weight: 600; padding: 5px 14px; border-radius: 50px; text-transform: uppercase; letter-spacing: 1.5px; }
.auth-body { padding: 26px 28px 30px; }
.auth-field { margin-bottom: 16px; }
.auth-field label { display: block; font-size: 0.75rem; font-weight: 600; color: var(--cd); margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.6px; }
.field-wrap { position: relative; }
.field-ico { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--cd); font-size: 0.95rem; pointer-events: none; z-index: 2; }
.auth-field .form-control { padding-left: 40px; padding-right: 14px; }
.auth-submit { width: 100%; margin-top: 8px; padding: 13px; background: var(--ca); border: none; border-radius: var(--radius-sm); color: var(--c0); font-family: inherit; font-weight: 700; font-size: 0.78rem; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.auth-submit:hover { background: #93c5d2; }
.auth-submit:disabled { opacity: 0.6; cursor: default; }
.spinner { width: 16px; height: 16px; border: 2px solid transparent; border-top-color: var(--c0); border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg) } }
.auth-msg { padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.78rem; font-weight: 500; margin-top: 14px; display: flex; align-items: center; }
.auth-msg.ok { background: rgba(127,179,194,0.1); border: 1px solid rgba(127,179,194,0.2); color: var(--ca); }
.auth-msg.err { background: rgba(194,121,127,0.1); border: 1px solid rgba(194,121,127,0.2); color: #c2797f; }
.accent-text { color: var(--ca) !important; }

@media (max-width: 575px) {
  .auth-overlay { padding: 16px; }
  .auth-modal { max-width: 100%; border-radius: 14px; }
  .auth-header { padding: 28px 20px 0; }
  .auth-body { padding: 22px 20px 24px; }
}
</style>
