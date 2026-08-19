import { demoBackend } from '@/demo/backend'
import { demoRequest } from '@/lib/api/client'
import type { ApiSalon, ApiStatisticsOverview } from '@/lib/api/types'

export const salonApi = {
  get: () => demoRequest<ApiSalon>(() => demoBackend.salon(), 90),
  update: (body: Partial<ApiSalon>) => demoRequest<ApiSalon>(() => demoBackend.updateSalon(body), 320),
  requestDeletion: () => demoRequest<{ sent: true }>(() => ({ sent: true }), 420),
  confirmDeletion: (body: { code: string; action: 'suspend' | 'delete' }) => demoRequest<void>(() => {
    void body
  }, 420),
  reactivate: () => demoRequest<{ reactivated: true }>(() => ({ reactivated: true }), 320),
}

export const statisticsApi = {
  overview: () => demoRequest<ApiStatisticsOverview>(() => demoBackend.statistics()),
  retention: () =>
    demoRequest<{ totalCustomers: number; returningCustomers: number; retentionRate: number }>(() => demoBackend.retention()),
}

export const supportApi = {
  send: (body: { topic: string; subject: string; message: string; email: string }) =>
    demoRequest<{ queued: true }>(() => {
      void body
      return { queued: true as const }
    }, 620),
}

export const notificationsApi = {
  stats: () => demoRequest<{ PENDING: number; SENT: number; FAILED: number; DEAD: number }>(() => demoBackend.notificationStats(), 90),
  list: (params?: { status?: string; limit?: number }) =>
    demoRequest<{ data: { id: string; type: string; status: string; to: string; subject: string; attempts: number; sentAt: string | null; error: string | null; createdAt: string }[]; meta: { total: number } }>(
      () => demoBackend.notificationList(params?.limit ?? 5),
      120,
    ),
}
