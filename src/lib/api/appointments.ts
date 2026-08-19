import { demoBackend } from '@/demo/backend'
import { demoRequest } from '@/lib/api/client'
import type { ApiAppointment, ApiVisitStatus, Paginated } from '@/lib/api/types'

export interface ListAppointmentsParams {
  page?: number
  limit?: number
  date?: string
  from?: string
  to?: string
  barberId?: string
  customerId?: string
  status?: ApiVisitStatus
  search?: string
  sort?: 'startAt:asc' | 'startAt:desc' | 'createdAt:desc'
}

export interface CreateAppointmentPayload {
  barberId: string
  serviceId: string
  startAt: string
  customerId?: string
  customer?: { firstName: string; lastName?: string; phone: string; email?: string }
  customerNote?: string
  internalNote?: string
  status?: 'PENDING' | 'CONFIRMED'
  price?: number
}

export const appointmentsApi = {
  list: (params: ListAppointmentsParams = {}) =>
    demoRequest<Paginated<ApiAppointment>>(() => demoBackend.listAppointments(params)),
  get: (id: string) => demoRequest<ApiAppointment>(() => demoBackend.getAppointment(id)),
  create: (body: CreateAppointmentPayload) =>
    demoRequest<ApiAppointment>(() => demoBackend.createAppointment(body), 320),
  update: (id: string, body: Partial<CreateAppointmentPayload & { startAt: string; price: number }>) =>
    demoRequest<ApiAppointment>(() => demoBackend.updateAppointment(id, body), 200),
  updateStatus: (id: string, status: ApiVisitStatus, cancellationReason?: string) =>
    demoRequest<ApiAppointment>(() => {
      void cancellationReason
      return demoBackend.updateAppointmentStatus(id, status)
    }, 160),
  remove: (id: string) => demoRequest<void>(() => demoBackend.removeAppointment(id), 160),
}
