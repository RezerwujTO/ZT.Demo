import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi, ApiError, setRefreshHandler, type ApiAuthSession, type ApiSalon, type ApiAuthUser } from '@/lib/api'
import { router } from '@/routes/router'

const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'

function loadJson<T>(key: string): T | null {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem(ACCESS_KEY) ?? '')
  const refreshToken = ref(localStorage.getItem(REFRESH_KEY) ?? '')
  const user = ref<ApiAuthUser | null>(loadJson('authUser'))
  const salon = ref<ApiSalon | null>(loadJson('authSalon'))
  const ready = ref(false)

  const isAuthenticated = computed(() => Boolean(accessToken.value))
  const timezone = computed(() => salon.value?.timezone ?? 'Europe/Warsaw')

  function applySession(session: ApiAuthSession) {
    accessToken.value = session.accessToken
    refreshToken.value = session.refreshToken
    user.value = session.user
    salon.value = session.salon
    localStorage.setItem(ACCESS_KEY, session.accessToken)
    localStorage.setItem(REFRESH_KEY, session.refreshToken)
    localStorage.setItem('authUser', JSON.stringify(session.user))
    localStorage.setItem('authSalon', JSON.stringify(session.salon))
  }

  function clearSession() {
    accessToken.value = ''
    refreshToken.value = ''
    user.value = null
    salon.value = null
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem('authUser')
    localStorage.removeItem('authSalon')
  }

  async function login(email: string, password: string) {
    const session = await authApi.login({ email, password })
    applySession(session)
    return session
  }

  async function register(payload: Parameters<typeof authApi.register>[0]) {
    const session = await authApi.register(payload)
    applySession(session)
    return session
  }

  async function refresh() {
    if (!refreshToken.value) return null
    try {
      const session = await authApi.refresh(refreshToken.value)
      applySession(session)
      return session.accessToken
    } catch {
      clearSession()
      return null
    }
  }

  async function logout() {
    try {
      await authApi.logout(refreshToken.value || undefined)
    } catch {
      /* ignore */
    }
    clearSession()
    await router.push('/')
  }

  async function bootstrap() {
    if (!accessToken.value) return false
    try {
      const me = await authApi.me()
      user.value = me.user
      salon.value = me.salon
      localStorage.setItem('authUser', JSON.stringify(me.user))
      localStorage.setItem('authSalon', JSON.stringify(me.salon))
      return true
    } catch {
      const token = await refresh()
      return Boolean(token)
    }
  }

  async function init() {
    if (accessToken.value) {
      try {
        const ok = await bootstrap()
        if (!ok) clearSession()
      } catch {
        clearSession()
      }
    }
    ready.value = true
  }

  setRefreshHandler(refresh)

  return {
    accessToken,
    refreshToken,
    user,
    salon,
    ready,
    isAuthenticated,
    timezone,
    login,
    register,
    refresh,
    logout,
    bootstrap,
    init,
    clearSession,
    applySession,
  }
})

export function isNetworkError(error: unknown): boolean {
  return error instanceof ApiError && error.code === 'NETWORK_ERROR'
}
