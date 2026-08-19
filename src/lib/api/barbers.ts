import { demoBackend } from '@/demo/backend'
import { demoRequest } from '@/lib/api/client'
import type { ApiBarber, ApiBreak, ApiWorkingHour, Paginated } from '@/lib/api/types'

export interface CreateBarberPayload {
  firstName: string
  lastName: string
  avatar?: string
  bio?: string
  active?: boolean
  serviceIds?: string[]
  account?: { email: string; password: string }
}

export const barbersApi = {
  list: (params: { page?: number; limit?: number; active?: boolean; search?: string } = {}) =>
    demoRequest<Paginated<ApiBarber>>(() => demoBackend.listStaff(params)),
  get: (id: string) => demoRequest<ApiBarber>(() => demoBackend.getStaff(id)),
  create: (body: CreateBarberPayload) => demoRequest<ApiBarber>(() => demoBackend.createStaff(body), 320),
  update: (id: string, body: Partial<{ active: boolean; serviceIds: string[]; firstName: string; lastName: string }>) =>
    demoRequest<ApiBarber>(() => demoBackend.updateStaff(id, body), 180),
  getSchedule: (barberId: string) =>
    demoRequest<{ workingHours: ApiWorkingHour[]; breaks: ApiBreak[] }>(() => demoBackend.staffSchedule(barberId), 90),
  setWorkingHours: (barberId: string, workingHours: { dayOfWeek: number; startTime: string; endTime: string; active?: boolean }[]) =>
    demoRequest<{ workingHours: ApiWorkingHour[] }>(() => demoBackend.setWorkingHours(barberId, workingHours), 220),
  setBreaks: (barberId: string, breaks: { dayOfWeek: number; startTime: string; endTime: string }[]) =>
    demoRequest<{ breaks: ApiBreak[] }>(() => demoBackend.setBreaks(barberId, breaks), 220),
}
