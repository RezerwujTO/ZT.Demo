import { demoBackend } from '@/demo/backend'
import { demoRequest } from '@/lib/api/client'
import type { ApiAppointment, ApiCustomer, Paginated } from '@/lib/api/types'

export interface CreateCustomerPayload {
  firstName: string
  lastName?: string
  phone: string
  email?: string
  notes?: string
}

export const customersApi = {
  list: (params: { page?: number; limit?: number; search?: string } = {}) =>
    demoRequest<Paginated<ApiCustomer>>(() => demoBackend.listCustomers(params)),
  get: (id: string) => demoRequest<ApiCustomer>(() => demoBackend.getCustomer(id), 90),
  create: (body: CreateCustomerPayload) => demoRequest<ApiCustomer>(() => demoBackend.createCustomer(body), 280),
  update: (id: string, body: Partial<CreateCustomerPayload & { notes: string | null; email: string | null }>) =>
    demoRequest<ApiCustomer>(() => demoBackend.updateCustomer(id, body), 220),
  appointments: (id: string, params: { page?: number; limit?: number } = {}) =>
    demoRequest<Paginated<ApiAppointment>>(() => demoBackend.customerAppointments(id, params), 90),
}
