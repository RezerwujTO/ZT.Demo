import { TZDate } from '@date-fns/tz'
import {
  DEMO_TIMEZONE,
  customers as customerSeed,
  notificationTemplates,
  reviews as reviewSeed,
  salon as salonSeed,
  services as serviceSeed,
  staff as staffSeed,
} from '@/demo/dataset'
import type {
  ApiAppointment,
  ApiAuthSession,
  ApiBarber,
  ApiBreak,
  ApiCustomer,
  ApiSalon,
  ApiService,
  ApiStatisticsOverview,
  ApiVisitStatus,
  ApiWorkingHour,
  Paginated,
} from '@/lib/api/types'

export class DemoError extends Error {
  code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = 'DemoError'
    this.code = code
  }
}

interface SalonRecord {
  id: string
  name: string
  slug: string
  city: string
  address: string
  phone: string
  email: string
  timezone: string
}

interface ServiceRecord {
  id: string
  name: string
  description: string
  duration: number
  price: number
  active: boolean
  featured: boolean
}

interface StaffRecord {
  id: string
  firstName: string
  lastName: string
  bio: string
  email: string
  role: 'OWNER' | 'MANAGER' | 'STAFF'
  active: boolean
  serviceIds: string[]
}

interface ScheduleRecord {
  id: string
  barberId: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

interface CustomerRecord {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  notes: string
  createdAt: string
}

interface AppointmentRecord {
  id: string
  barberId: string
  serviceId: string
  customerId: string
  startAt: string
  endAt: string
  status: ApiVisitStatus
  price: number
  customerNote: string | null
  internalNote: string | null
  createdAt: string
}

interface SalonSettingsRecord {
  bookingWindowDays: number
  slotStep: number
  autoConfirm: boolean
  reminders24h: boolean
  reminders2h: boolean
}

const SLOT_STEP = 15
const DAY_MS = 86_400_000

let sequence = 1000

function nextId(prefix: string) {
  sequence += 1
  return `${prefix}-${sequence.toString(36)}`
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function timeToMinutes(value: string) {
  const [h, m] = value.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

function minutesToTime(value: number) {
  const h = Math.floor(value / 60)
  const m = value % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function dateKey(date: Date) {
  return date.toLocaleDateString('en-CA', { timeZone: DEMO_TIMEZONE })
}

function isoAt(day: string, time: string) {
  const [year, month, date] = day.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  return new TZDate(year ?? 2026, (month ?? 1) - 1, date ?? 1, hour ?? 0, minute ?? 0, 0, DEMO_TIMEZONE).toISOString()
}

function dayKeyOffset(offset: number) {
  return dateKey(new Date(Date.now() + offset * DAY_MS))
}

function weekdayOf(day: string) {
  return new Date(`${day}T12:00:00Z`).getUTCDay()
}

function addMinutesIso(iso: string, minutes: number) {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString()
}

const state = {
  salon: {} as SalonRecord,
  services: [] as ServiceRecord[],
  staff: [] as StaffRecord[],
  workingHours: [] as ScheduleRecord[],
  breaks: [] as ScheduleRecord[],
  customers: [] as CustomerRecord[],
  appointments: [] as AppointmentRecord[],
  settings: {
    bookingWindowDays: 30,
    slotStep: 30,
    autoConfirm: true,
    reminders24h: true,
    reminders2h: true,
  } as SalonSettingsRecord,
}

function seedState() {
  state.salon = {
    id: salonSeed.id,
    name: salonSeed.name,
    slug: salonSeed.slug,
    city: salonSeed.city,
    address: salonSeed.address,
    phone: salonSeed.phone,
    email: salonSeed.email,
    timezone: salonSeed.timezone,
  }

  state.services = serviceSeed.map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    duration: s.duration,
    price: s.price,
    active: s.active,
    featured: Boolean(s.featured),
  }))

  state.staff = staffSeed.map(s => ({
    id: s.id,
    firstName: s.firstName,
    lastName: s.lastName,
    bio: s.bio,
    email: s.email,
    role: s.role,
    active: s.active,
    serviceIds: [...s.serviceIds],
  }))

  state.workingHours = []
  state.breaks = []
  for (const member of staffSeed) {
    for (const day of member.workingDays) {
      state.workingHours.push({
        id: nextId('wh'),
        barberId: member.id,
        dayOfWeek: day,
        startTime: member.startTime,
        endTime: member.endTime,
      })
      state.breaks.push({
        id: nextId('br'),
        barberId: member.id,
        dayOfWeek: day,
        startTime: member.breakFrom,
        endTime: member.breakTo,
      })
    }
  }

  state.customers = customerSeed.map(c => ({
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    phone: c.phone,
    email: c.email,
    notes: c.notes,
    createdAt: new Date(Date.now() - c.createdDaysAgo * DAY_MS).toISOString(),
  }))

  state.appointments = []
  const random = mulberry32(20260819)

  for (let offset = -21; offset <= 21; offset++) {
    const day = dayKeyOffset(offset)
    const weekday = weekdayOf(day)

    for (const member of state.staff) {
      const hours = state.workingHours.find(w => w.barberId === member.id && w.dayOfWeek === weekday)
      if (!hours) continue

      const memberServices = state.services.filter(s => member.serviceIds.includes(s.id) && s.active)
      if (!memberServices.length) continue

      const dayStart = timeToMinutes(hours.startTime)
      const dayEnd = timeToMinutes(hours.endTime)
      const breakEntry = state.breaks.find(b => b.barberId === member.id && b.dayOfWeek === weekday)
      const taken: { from: number; to: number }[] = []
      if (breakEntry) taken.push({ from: timeToMinutes(breakEntry.startTime), to: timeToMinutes(breakEntry.endTime) })

      const target = 2 + Math.floor(random() * 3)

      for (let i = 0; i < target; i++) {
        const service = memberServices[Math.floor(random() * memberServices.length)]!
        const latest = dayEnd - service.duration
        if (latest <= dayStart) continue

        let start = dayStart + Math.floor((random() * (latest - dayStart)) / SLOT_STEP) * SLOT_STEP
        start = Math.max(dayStart, Math.min(latest, start))
        const end = start + service.duration
        if (taken.some(t => start < t.to && end > t.from)) continue

        taken.push({ from: start, to: end })

        const customer = state.customers[Math.floor(random() * state.customers.length)]!
        const startIso = isoAt(day, minutesToTime(start))
        const startTime = new Date(startIso).getTime()

        let status: ApiVisitStatus
        if (startTime < Date.now()) {
          const roll = random()
          status = roll > 0.12 ? 'COMPLETED' : roll > 0.05 ? 'CANCELLED' : 'NO_SHOW'
        } else {
          status = random() > 0.22 ? 'CONFIRMED' : 'PENDING'
        }

        state.appointments.push({
          id: nextId('apt'),
          barberId: member.id,
          serviceId: service.id,
          customerId: customer.id,
          startAt: startIso,
          endAt: addMinutesIso(startIso, service.duration),
          status,
          price: service.price,
          customerNote: null,
          internalNote: null,
          createdAt: new Date(startTime - (2 + Math.floor(random() * 9)) * DAY_MS).toISOString(),
        })
      }
    }
  }

  state.appointments.sort((a, b) => a.startAt.localeCompare(b.startAt))
}

seedState()

const demoSalon = () => state.salon

const demoUser = {
  id: 'usr-demo',
  email: 'demo@zarezerwujto.pl',
  firstName: 'Kamil',
  lastName: 'Nowak',
  role: 'OWNER',
  salonId: demoSalon().id,
  active: true,
}

function toApiSalon(salon: SalonRecord): ApiSalon {
  return {
    id: salon.id,
    name: salon.name,
    slug: salon.slug,
    timezone: salon.timezone,
    phone: salon.phone,
    email: salon.email,
    city: salon.city,
    address: salon.address,
  }
}

function hashOf(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  return hash
}

function publicRating(id: string) {
  const hash = hashOf(id)
  return {
    rating: Number((4.6 + (hash % 5) / 10).toFixed(1)),
    reviewsCount: 24 + (hash % 137),
  }
}

function staffStats(member: StaffRecord) {
  const today = dateKey(new Date())
  const appointments = state.appointments.filter(a => a.barberId === member.id && a.status !== 'CANCELLED')
  const todayVisits = appointments.filter(a => dateKey(new Date(a.startAt)) === today).length
  const completed = appointments.filter(a => a.status === 'COMPLETED')
  const revenue = completed.reduce((sum, a) => sum + a.price, 0)
  const hours = state.workingHours.filter(w => w.barberId === member.id)
  const weeklyMinutes = hours.reduce((sum, w) => sum + (timeToMinutes(w.endTime) - timeToMinutes(w.startTime)), 0)
  const weekStart = Date.now() - 7 * DAY_MS
  const bookedMinutes = appointments
    .filter(a => new Date(a.startAt).getTime() >= weekStart && new Date(a.startAt).getTime() <= Date.now())
    .reduce((sum, a) => sum + (new Date(a.endAt).getTime() - new Date(a.startAt).getTime()) / 60_000, 0)

  return {
    todayVisits,
    occupancy: weeklyMinutes ? Math.min(100, Math.round((bookedMinutes / weeklyMinutes) * 100)) : 0,
    totalVisits: completed.length,
    revenue,
  }
}

function toApiBarber(member: StaffRecord): ApiBarber {
  return {
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    active: member.active,
    bio: member.bio,
    avatar: null,
    serviceIds: [...member.serviceIds],
    user: { id: `usr-${member.id}`, email: member.email, role: member.role, active: member.active },
    stats: staffStats(member),
  }
}

function toApiService(service: ServiceRecord): ApiService {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    duration: service.duration,
    price: service.price,
    active: service.active,
    barberIds: state.staff.filter(m => m.serviceIds.includes(service.id)).map(m => m.id),
  }
}

function customerAppointmentsOf(customerId: string) {
  return state.appointments
    .filter(a => a.customerId === customerId)
    .sort((a, b) => b.startAt.localeCompare(a.startAt))
}

function toApiCustomer(customer: CustomerRecord): ApiCustomer {
  const appointments = customerAppointmentsOf(customer.id)
  const completed = appointments.filter(a => a.status === 'COMPLETED')
  const last = completed[0]
  const serviceCount = new Map<string, number>()
  const barberCount = new Map<string, number>()
  for (const item of completed) {
    serviceCount.set(item.serviceId, (serviceCount.get(item.serviceId) ?? 0) + 1)
    barberCount.set(item.barberId, (barberCount.get(item.barberId) ?? 0) + 1)
  }
  const topService = [...serviceCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
  const topBarber = [...barberCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]

  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone,
    email: customer.email,
    notes: customer.notes,
    appointmentsCount: appointments.length,
    completedCount: completed.length,
    totalSpent: completed.reduce((sum, a) => sum + a.price, 0),
    lastVisitAt: last?.startAt ?? null,
    daysSinceLastVisit: last ? Math.max(0, Math.floor((Date.now() - new Date(last.startAt).getTime()) / DAY_MS)) : 0,
    preferredService: state.services.find(s => s.id === topService)?.name ?? '',
    preferredBarber: (() => {
      const member = state.staff.find(m => m.id === topBarber)
      return member ? `${member.firstName} ${member.lastName}` : ''
    })(),
  }
}

function toApiAppointment(appointment: AppointmentRecord): ApiAppointment {
  const barber = state.staff.find(m => m.id === appointment.barberId)!
  const service = state.services.find(s => s.id === appointment.serviceId)!
  const customer = state.customers.find(c => c.id === appointment.customerId)!

  return {
    id: appointment.id,
    startAt: appointment.startAt,
    endAt: appointment.endAt,
    status: appointment.status,
    price: appointment.price,
    customerNote: appointment.customerNote,
    internalNote: appointment.internalNote,
    barber: { id: barber.id, firstName: barber.firstName, lastName: barber.lastName, avatar: null },
    service: { id: service.id, name: service.name, duration: service.duration },
    customer: toApiCustomer(customer),
  }
}

function paginate<T>(items: T[], page = 1, limit = 20): Paginated<T> {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const current = Math.min(Math.max(1, page), totalPages)
  const start = (current - 1) * limit

  return {
    data: items.slice(start, start + limit),
    meta: {
      page: current,
      limit,
      total,
      totalPages,
      hasNext: current < totalPages,
      hasPrev: current > 1,
    },
  }
}

function scheduleOf(barberId: string) {
  const workingHours: ApiWorkingHour[] = state.workingHours
    .filter(w => w.barberId === barberId)
    .map(w => ({ id: w.id, barberId, dayOfWeek: w.dayOfWeek, startTime: w.startTime, endTime: w.endTime }))
  const breaks: ApiBreak[] = state.breaks
    .filter(b => b.barberId === barberId)
    .map(b => ({ id: b.id, barberId, dayOfWeek: b.dayOfWeek, startTime: b.startTime, endTime: b.endTime }))
  return { workingHours, breaks }
}

function slotsFor(barberId: string, day: string, duration: number) {
  const weekday = weekdayOf(day)
  const hours = state.workingHours.find(w => w.barberId === barberId && w.dayOfWeek === weekday)
  if (!hours) return []

  const busy = state.appointments
    .filter(a => a.barberId === barberId && a.status !== 'CANCELLED' && dateKey(new Date(a.startAt)) === day)
    .map(a => ({ from: new Date(a.startAt).getTime(), to: new Date(a.endAt).getTime() }))

  const breakEntries = state.breaks
    .filter(b => b.barberId === barberId && b.dayOfWeek === weekday)
    .map(b => ({
      from: new Date(isoAt(day, b.startTime)).getTime(),
      to: new Date(isoAt(day, b.endTime)).getTime(),
    }))

  const blocked = [...busy, ...breakEntries]
  const start = timeToMinutes(hours.startTime)
  const end = timeToMinutes(hours.endTime)
  const slots: { startAt: string; endAt: string; barberId: string; available: boolean }[] = []

  for (let minute = start; minute + duration <= end; minute += state.settings.slotStep) {
    const startIso = isoAt(day, minutesToTime(minute))
    const startMs = new Date(startIso).getTime()
    const endMs = startMs + duration * 60_000
    if (startMs < Date.now()) continue
    if (blocked.some(b => startMs < b.to && endMs > b.from)) continue
    slots.push({ startAt: startIso, endAt: new Date(endMs).toISOString(), barberId, available: true })
  }

  return slots
}

function requireCustomerBySalon(id: string) {
  const customer = state.customers.find(c => c.id === id)
  if (!customer) throw new DemoError('NOT_FOUND', 'Nie znaleziono klienta')
  return customer
}

function requireAppointment(id: string) {
  const appointment = state.appointments.find(a => a.id === id)
  if (!appointment) throw new DemoError('NOT_FOUND', 'Nie znaleziono wizyty')
  return appointment
}

function requireService(id: string) {
  const service = state.services.find(s => s.id === id)
  if (!service) throw new DemoError('NOT_FOUND', 'Nie znaleziono usługi')
  return service
}

function requireStaff(id: string) {
  const member = state.staff.find(m => m.id === id)
  if (!member) throw new DemoError('NOT_FOUND', 'Nie znaleziono specjalisty')
  return member
}

function requireSalonBySlug(slug: string) {
  void slug
  return demoSalon()
}

export const demoBackend = {
  session(): ApiAuthSession {
    return {
      user: { ...demoUser },
      salon: toApiSalon(demoSalon()),
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
    }
  },

  registerSession(payload: { email: string; salonName: string; firstName?: string; lastName?: string; city?: string; phone?: string }): ApiAuthSession {
    const salon = demoSalon()
    if (payload.salonName) salon.name = payload.salonName
    if (payload.city) salon.city = payload.city
    if (payload.phone) salon.phone = payload.phone
    return {
      user: {
        ...demoUser,
        email: payload.email || demoUser.email,
        firstName: payload.firstName ?? demoUser.firstName,
        lastName: payload.lastName ?? demoUser.lastName,
      },
      salon: toApiSalon(salon),
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
    }
  },

  salon: () => toApiSalon(demoSalon()),

  updateSalon(patch: Partial<ApiSalon>): ApiSalon {
    const salon = demoSalon()
    Object.assign(salon, {
      name: patch.name ?? salon.name,
      city: patch.city ?? salon.city,
      address: patch.address ?? salon.address,
      phone: patch.phone ?? salon.phone,
      email: patch.email ?? salon.email,
      timezone: patch.timezone ?? salon.timezone,
    })
    return toApiSalon(salon)
  },

  listAppointments(params: {
    page?: number
    limit?: number
    date?: string
    from?: string
    to?: string
    barberId?: string
    customerId?: string
    status?: ApiVisitStatus
    search?: string
    sort?: string
  } = {}): Paginated<ApiAppointment> {
    let items = [...state.appointments]

    if (params.date) items = items.filter(a => dateKey(new Date(a.startAt)) === params.date)
    if (params.from) items = items.filter(a => a.startAt >= params.from!)
    if (params.to) items = items.filter(a => a.startAt <= params.to!)
    if (params.barberId) items = items.filter(a => a.barberId === params.barberId)
    if (params.customerId) items = items.filter(a => a.customerId === params.customerId)
    if (params.status) items = items.filter(a => a.status === params.status)

    if (params.search) {
      const query = params.search.toLowerCase()
      items = items.filter(a => {
        const customer = state.customers.find(c => c.id === a.customerId)
        const service = state.services.find(s => s.id === a.serviceId)
        return (
          `${customer?.firstName} ${customer?.lastName}`.toLowerCase().includes(query) ||
          (service?.name ?? '').toLowerCase().includes(query)
        )
      })
    }

    const sorted = [...items].sort((a, b) =>
      params.sort === 'startAt:desc' || params.sort === 'createdAt:desc'
        ? b.startAt.localeCompare(a.startAt)
        : a.startAt.localeCompare(b.startAt),
    )

    return paginate(sorted.map(toApiAppointment), params.page, params.limit ?? 50)
  },

  getAppointment: (id: string) => toApiAppointment(requireAppointment(id)),

  createAppointment(payload: {
    barberId: string
    serviceId: string
    startAt: string
    customerId?: string
    customer?: { firstName: string; lastName?: string; phone: string; email?: string }
    customerNote?: string
    internalNote?: string
    status?: ApiVisitStatus
    price?: number
  }): ApiAppointment {
    const member = requireStaff(payload.barberId)
    const service = requireService(payload.serviceId)

    let customerId = payload.customerId
    if (!customerId && payload.customer) {
      const existing = state.customers.find(c => c.phone === payload.customer!.phone)
      if (existing) {
        customerId = existing.id
      } else {
        const created: CustomerRecord = {
          id: nextId('cus'),
          firstName: payload.customer.firstName,
          lastName: payload.customer.lastName ?? '',
          phone: payload.customer.phone,
          email: payload.customer.email ?? '',
          notes: '',
          createdAt: new Date().toISOString(),
        }
        state.customers.push(created)
        customerId = created.id
      }
    }

    if (!customerId) throw new DemoError('VALIDATION_ERROR', 'Brak danych klienta')

    const conflict = state.appointments.some(a => {
      if (a.barberId !== member.id || a.status === 'CANCELLED') return false
      const startMs = new Date(payload.startAt).getTime()
      const endMs = startMs + service.duration * 60_000
      return startMs < new Date(a.endAt).getTime() && endMs > new Date(a.startAt).getTime()
    })
    if (conflict) throw new DemoError('SLOT_TAKEN', 'Ten termin jest już zajęty')

    const record: AppointmentRecord = {
      id: nextId('apt'),
      barberId: member.id,
      serviceId: service.id,
      customerId,
      startAt: payload.startAt,
      endAt: addMinutesIso(payload.startAt, service.duration),
      status: payload.status ?? (state.settings.autoConfirm ? 'CONFIRMED' : 'PENDING'),
      price: payload.price ?? service.price,
      customerNote: payload.customerNote ?? null,
      internalNote: payload.internalNote ?? null,
      createdAt: new Date().toISOString(),
    }

    state.appointments.push(record)
    state.appointments.sort((a, b) => a.startAt.localeCompare(b.startAt))
    return toApiAppointment(record)
  },

  updateAppointment(id: string, patch: { startAt?: string; barberId?: string; serviceId?: string; price?: number; internalNote?: string }): ApiAppointment {
    const appointment = requireAppointment(id)
    if (patch.barberId) appointment.barberId = requireStaff(patch.barberId).id
    if (patch.serviceId) appointment.serviceId = requireService(patch.serviceId).id
    const service = requireService(appointment.serviceId)
    if (patch.startAt) {
      appointment.startAt = patch.startAt
      appointment.endAt = addMinutesIso(patch.startAt, service.duration)
    }
    if (patch.price !== undefined) appointment.price = patch.price
    if (patch.internalNote !== undefined) appointment.internalNote = patch.internalNote

    const conflict = state.appointments.some(a =>
      a.id !== appointment.id &&
      a.barberId === appointment.barberId &&
      a.status !== 'CANCELLED' &&
      new Date(appointment.startAt).getTime() < new Date(a.endAt).getTime() &&
      new Date(appointment.endAt).getTime() > new Date(a.startAt).getTime(),
    )
    if (conflict) throw new DemoError('SLOT_TAKEN', 'Ten termin jest już zajęty')

    state.appointments.sort((a, b) => a.startAt.localeCompare(b.startAt))
    return toApiAppointment(appointment)
  },

  updateAppointmentStatus(id: string, status: ApiVisitStatus): ApiAppointment {
    const appointment = requireAppointment(id)
    appointment.status = status
    return toApiAppointment(appointment)
  },

  removeAppointment(id: string) {
    const index = state.appointments.findIndex(a => a.id === id)
    if (index >= 0) state.appointments.splice(index, 1)
  },

  listCustomers(params: { page?: number; limit?: number; search?: string } = {}): Paginated<ApiCustomer> {
    let items = [...state.customers]
    if (params.search) {
      const query = params.search.toLowerCase()
      items = items.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(query) ||
        c.phone.includes(query) ||
        c.email.toLowerCase().includes(query),
      )
    }
    const mapped = items.map(toApiCustomer).sort((a, b) => (b.totalSpent ?? 0) - (a.totalSpent ?? 0))
    return paginate(mapped, params.page, params.limit ?? 50)
  },

  getCustomer: (id: string) => toApiCustomer(requireCustomerBySalon(id)),

  createCustomer(payload: { firstName: string; lastName?: string; phone: string; email?: string; notes?: string }): ApiCustomer {
    const record: CustomerRecord = {
      id: nextId('cus'),
      firstName: payload.firstName,
      lastName: payload.lastName ?? '',
      phone: payload.phone,
      email: payload.email ?? '',
      notes: payload.notes ?? '',
      createdAt: new Date().toISOString(),
    }
    state.customers.unshift(record)
    return toApiCustomer(record)
  },

  updateCustomer(id: string, patch: { firstName?: string; lastName?: string; phone?: string; email?: string | null; notes?: string | null }): ApiCustomer {
    const customer = requireCustomerBySalon(id)
    if (patch.firstName !== undefined) customer.firstName = patch.firstName
    if (patch.lastName !== undefined) customer.lastName = patch.lastName ?? ''
    if (patch.phone !== undefined) customer.phone = patch.phone
    if (patch.email !== undefined) customer.email = patch.email ?? ''
    if (patch.notes !== undefined) customer.notes = patch.notes ?? ''
    return toApiCustomer(customer)
  },

  customerAppointments(id: string, params: { page?: number; limit?: number } = {}): Paginated<ApiAppointment> {
    const items = customerAppointmentsOf(id).map(toApiAppointment)
    return paginate(items, params.page, params.limit ?? 20)
  },

  listServices(params: { page?: number; limit?: number; active?: boolean; search?: string } = {}): Paginated<ApiService> {
    let items = [...state.services]
    if (params.active !== undefined) items = items.filter(s => s.active === params.active)
    if (params.search) {
      const query = params.search.toLowerCase()
      items = items.filter(s => s.name.toLowerCase().includes(query))
    }
    return paginate(items.map(toApiService), params.page, params.limit ?? 50)
  },

  getService: (id: string) => toApiService(requireService(id)),

  createService(payload: { name: string; description?: string; duration: number; price: number; active?: boolean; barberIds?: string[] }): ApiService {
    const record: ServiceRecord = {
      id: nextId('svc'),
      name: payload.name,
      description: payload.description ?? '',
      duration: payload.duration,
      price: payload.price,
      active: payload.active ?? true,
      featured: false,
    }
    state.services.push(record)
    for (const member of state.staff) {
      if (payload.barberIds?.includes(member.id)) member.serviceIds.push(record.id)
    }
    return toApiService(record)
  },

  updateService(id: string, patch: { name?: string; description?: string; duration?: number; price?: number; active?: boolean; barberIds?: string[] }): ApiService {
    const service = requireService(id)
    if (patch.name !== undefined) service.name = patch.name
    if (patch.description !== undefined) service.description = patch.description
    if (patch.duration !== undefined) service.duration = patch.duration
    if (patch.price !== undefined) service.price = patch.price
    if (patch.active !== undefined) service.active = patch.active
    if (patch.barberIds) {
      for (const member of state.staff) {
        const assigned = patch.barberIds.includes(member.id)
        const index = member.serviceIds.indexOf(service.id)
        if (assigned && index < 0) member.serviceIds.push(service.id)
        if (!assigned && index >= 0) member.serviceIds.splice(index, 1)
      }
    }
    return toApiService(service)
  },

  removeService(id: string) {
    const index = state.services.findIndex(s => s.id === id)
    if (index >= 0) state.services.splice(index, 1)
  },

  listStaff(params: { page?: number; limit?: number; active?: boolean; search?: string } = {}): Paginated<ApiBarber> {
    let items = [...state.staff]
    if (params.active !== undefined) items = items.filter(m => m.active === params.active)
    if (params.search) {
      const query = params.search.toLowerCase()
      items = items.filter(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(query))
    }
    return paginate(items.map(toApiBarber), params.page, params.limit ?? 50)
  },

  getStaff: (id: string) => toApiBarber(requireStaff(id)),

  createStaff(payload: { firstName: string; lastName: string; bio?: string; active?: boolean; serviceIds?: string[] }): ApiBarber {
    const record: StaffRecord = {
      id: nextId('stf'),
      firstName: payload.firstName,
      lastName: payload.lastName,
      bio: payload.bio ?? 'Specjalista',
      email: `${payload.firstName.toLowerCase()}@studiovibe.pl`,
      role: 'STAFF',
      active: payload.active ?? true,
      serviceIds: [...(payload.serviceIds ?? [])],
    }
    state.staff.push(record)
    return toApiBarber(record)
  },

  updateStaff(id: string, patch: { active?: boolean; serviceIds?: string[]; firstName?: string; lastName?: string }): ApiBarber {
    const member = requireStaff(id)
    if (patch.active !== undefined) member.active = patch.active
    if (patch.firstName !== undefined) member.firstName = patch.firstName
    if (patch.lastName !== undefined) member.lastName = patch.lastName
    if (patch.serviceIds) member.serviceIds = [...patch.serviceIds]
    return toApiBarber(member)
  },

  staffSchedule: (id: string) => scheduleOf(requireStaff(id).id),

  setWorkingHours(barberId: string, hours: { dayOfWeek: number; startTime: string; endTime: string }[]) {
    state.workingHours = state.workingHours.filter(w => w.barberId !== barberId)
    for (const entry of hours) {
      state.workingHours.push({
        id: nextId('wh'),
        barberId,
        dayOfWeek: entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
      })
    }
    return { workingHours: scheduleOf(barberId).workingHours }
  },

  setBreaks(barberId: string, breaks: { dayOfWeek: number; startTime: string; endTime: string }[]) {
    state.breaks = state.breaks.filter(b => b.barberId !== barberId)
    for (const entry of breaks) {
      state.breaks.push({
        id: nextId('br'),
        barberId,
        dayOfWeek: entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
      })
    }
    return { breaks: scheduleOf(barberId).breaks }
  },

  statistics(): ApiStatisticsOverview {
    const today = dateKey(new Date())
    const yesterday = dayKeyOffset(-1)
    const monthPrefix = today.slice(0, 7)
    const items = [...state.appointments]
    const todayItems = items.filter(a => dateKey(new Date(a.startAt)) === today && a.status !== 'CANCELLED')
    const yesterdayItems = items.filter(a => dateKey(new Date(a.startAt)) === yesterday && a.status !== 'CANCELLED')
    const monthItems = items.filter(a => dateKey(new Date(a.startAt)).startsWith(monthPrefix))
    const monthStart = new Date(`${monthPrefix}-01T00:00:00.000Z`).getTime()

    const todayRevenue = todayItems.reduce((sum, a) => sum + a.price, 0)
    const yesterdayRevenue = yesterdayItems.reduce((sum, a) => sum + a.price, 0)
    const occupancyOf = (day: string, list: AppointmentRecord[]) => {
      const weekday = weekdayOf(day)
      const capacity = state.staff
        .filter(m => m.active)
        .reduce((sum, m) => {
          const hours = state.workingHours.find(w => w.barberId === m.id && w.dayOfWeek === weekday)
          return sum + (hours ? timeToMinutes(hours.endTime) - timeToMinutes(hours.startTime) : 0)
        }, 0)
      if (!capacity) return 0
      const booked = list.reduce((sum, a) => sum + (new Date(a.endAt).getTime() - new Date(a.startAt).getTime()) / 60_000, 0)
      return Math.min(100, Math.round((booked / capacity) * 100))
    }

    const occupancy = occupancyOf(today, todayItems)
    const previousOccupancy = occupancyOf(yesterday, yesterdayItems)
    const newCustomers = state.customers.filter(c => new Date(c.createdAt).getTime() >= monthStart).length

    return {
      todayAppointments: todayItems.length,
      todayRevenue,
      monthAppointments: monthItems.length,
      monthRevenue: monthItems.filter(a => a.status === 'COMPLETED').reduce((sum, a) => sum + a.price, 0),
      newCustomers,
      cancelledAppointments: monthItems.filter(a => a.status === 'CANCELLED').length,
      noShows: monthItems.filter(a => a.status === 'NO_SHOW').length,
      upcomingAppointments: items.filter(a => new Date(a.startAt).getTime() > Date.now() && a.status !== 'CANCELLED').length,
      pendingAppointments: items.filter(a => {
        const start = new Date(a.startAt).getTime()
        return a.status === 'PENDING' && start > Date.now() && start < Date.now() + 7 * DAY_MS
      }).length,
      occupancy,
      todayAppointmentsTrend: yesterdayItems.length
        ? Math.round(((todayItems.length - yesterdayItems.length) / yesterdayItems.length) * 100)
        : 0,
      revenueTrend: yesterdayRevenue ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100) : 0,
      newCustomersTrend: newCustomers,
      occupancyTrend: occupancy - previousOccupancy,
    }
  },

  retention() {
    const salonCustomers = [...state.customers]
    const returning = salonCustomers.filter(c => customerAppointmentsOf(c.id).filter(a => a.status === 'COMPLETED').length > 1)
    return {
      totalCustomers: salonCustomers.length,
      returningCustomers: returning.length,
      retentionRate: salonCustomers.length ? Math.round((returning.length / salonCustomers.length) * 100) : 0,
    }
  },

  notificationStats() {
    const sent = state.appointments.filter(a => a.status === 'COMPLETED').length * 2
    return { PENDING: 3, SENT: sent, FAILED: 1, DEAD: 0 }
  },

  notificationList(limit = 5) {
    const upcoming = [...state.appointments]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)

    const data = upcoming.map((appointment, index) => {
      const template = notificationTemplates[index % notificationTemplates.length]!
      const customer = state.customers.find(c => c.id === appointment.customerId)!
      return {
        id: `ntf-${appointment.id}`,
        type: template.type,
        status: template.status,
        to: customer.email || customer.phone,
        subject: template.subject,
        attempts: 1,
        sentAt: template.status === 'SENT' ? appointment.createdAt : null,
        error: null,
        createdAt: appointment.createdAt,
      }
    })

    return { data, meta: { total: data.length } }
  },

  publicSalon(slug: string) {
    const salon = requireSalonBySlug(slug)
    return { id: salon.id, name: salon.name, slug: salon.slug, city: salon.city, timezone: salon.timezone }
  },

  publicServices(slug: string, barberId?: string) {
    void slug
    let items = state.services.filter(s => s.active && s.featured)

    if (barberId) {
      items = state.services.filter(s => s.active)
      const member = state.staff.find(m => m.id === barberId)
      if (member) items = items.filter(s => member.serviceIds.includes(s.id))
    }

    return items.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      duration: s.duration,
      price: s.price,
    }))
  },

  publicBarbers(slug: string, serviceId?: string) {
    void slug
    return state.staff
      .filter(m => m.active)
      .filter(m => !serviceId || m.serviceIds.includes(serviceId))
      .map(m => ({
        id: m.id,
        firstName: m.firstName,
        lastName: m.lastName,
        bio: m.bio,
        serviceIds: [...m.serviceIds],
      }))
  },

  publicAllBarbers() {
    const salon = demoSalon()
    return state.staff
      .filter(m => m.active)
      .map(m => {
        return {
          id: m.id,
          firstName: m.firstName,
          lastName: m.lastName,
          avatar: null,
          bio: m.bio,
          serviceIds: [...m.serviceIds],
          ...publicRating(m.id),
          salon: { id: salon.id, name: salon.name, slug: salon.slug, city: salon.city, timezone: salon.timezone },
        }
      })
  },

  publicSchedule() {
    return {
      barbers: state.staff.map(m => {
        const schedule = scheduleOf(m.id)
        return {
          id: m.id,
          firstName: m.firstName,
          lastName: m.lastName,
          workingHours: schedule.workingHours.map(w => ({ dayOfWeek: w.dayOfWeek, startTime: w.startTime, endTime: w.endTime })),
          breaks: schedule.breaks.map(b => ({ dayOfWeek: b.dayOfWeek, startTime: b.startTime, endTime: b.endTime })),
        }
      }),
    }
  },

  publicAvailability(slug: string, params: { serviceId: string; date: string; barberId?: string }) {
    const salon = requireSalonBySlug(slug)
    const service = requireService(params.serviceId)

    if (params.barberId) {
      return {
        slots: slotsFor(params.barberId, params.date, service.duration),
        barberId: params.barberId,
        date: params.date,
        timezone: salon.timezone,
        duration: service.duration,
      }
    }

    const members = state.staff.filter(m => m.active && m.serviceIds.includes(service.id))
    return {
      date: params.date,
      timezone: salon.timezone,
      barbers: members.map(m => ({
        barberId: m.id,
        barber: { id: m.id, firstName: m.firstName, lastName: m.lastName },
        slots: slotsFor(m.id, params.date, service.duration),
      })),
    }
  },

  publicBook(slug: string, payload: {
    barberId: string
    serviceId: string
    startAt: string
    customer: { firstName: string; lastName?: string; phone: string; email?: string }
    customerNote?: string
  }) {
    const salon = requireSalonBySlug(slug)
    void salon
    const created = this.createAppointment({
      barberId: payload.barberId,
      serviceId: payload.serviceId,
      startAt: payload.startAt,
      customer: payload.customer,
      customerNote: payload.customerNote,
      status: 'PENDING',
    })
    return { id: created.id, publicToken: `demo-${created.id}` }
  },

  publicReviews() {
    return reviewSeed.map(review => ({
      name: review.name,
      rating: review.rating,
      text: review.text,
      date: new Date(Date.now() - review.daysAgo * DAY_MS).toISOString(),
      salonName: review.salonName,
      type: review.type,
    }))
  },

  settings: () => ({ ...state.settings }),

  updateSettings(patch: Partial<SalonSettingsRecord>) {
    Object.assign(state.settings, patch)
    return { ...state.settings }
  },
}

export type DemoBackend = typeof demoBackend
