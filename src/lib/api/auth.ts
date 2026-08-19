import { demoBackend } from '@/demo/backend'
import { demoRequest } from '@/lib/api/client'
import type { ApiAuthSession } from '@/lib/api/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  salonName: string
  firstName?: string
  lastName?: string
  phone?: string
  city?: string
  timezone?: string
}

export const authApi = {
  login: (body: LoginPayload) => demoRequest<ApiAuthSession>(() => {
    void body
    return demoBackend.session()
  }, 420),
  register: (body: RegisterPayload) => demoRequest<ApiAuthSession>(() => demoBackend.registerSession(body), 480),
  refresh: (refreshToken: string) => demoRequest<ApiAuthSession>(() => {
    void refreshToken
    return demoBackend.session()
  }),
  logout: (refreshToken?: string) => demoRequest<void>(() => {
    void refreshToken
  }, 80),
  me: () => demoRequest(() => {
    const session = demoBackend.session()
    return { user: session.user, salon: session.salon }
  }, 80),
  changePassword: (body: { currentPassword: string; newPassword: string }) => demoRequest<void>(() => {
    void body
  }, 420),
}
