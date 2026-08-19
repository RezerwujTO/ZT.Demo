import { demoBackend } from '@/demo/backend'
import { demoRequest } from '@/lib/api/client'
import type { ApiService, Paginated } from '@/lib/api/types'

export const servicesApi = {
  list: (params: { page?: number; limit?: number; active?: boolean; search?: string } = {}) =>
    demoRequest<Paginated<ApiService>>(() => demoBackend.listServices(params)),
  get: (id: string) => demoRequest<ApiService>(() => demoBackend.getService(id)),
  create: (body: { name: string; description?: string; duration: number; price: number; active?: boolean; barberIds?: string[] }) =>
    demoRequest<ApiService>(() => demoBackend.createService(body), 280),
  update: (id: string, body: Partial<{ name: string; description: string; duration: number; price: number; active: boolean; barberIds: string[] }>) =>
    demoRequest<ApiService>(() => demoBackend.updateService(id, body), 220),
  remove: (id: string) => demoRequest<void>(() => demoBackend.removeService(id), 180),
}
