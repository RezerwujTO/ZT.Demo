import { TZDate } from '@date-fns/tz'
import type {
  ApiAppointment,
  ApiAuthSession,
  ApiBarber,
  ApiCustomer,
  ApiPerson,
  ApiService,
  ApiStatisticsOverview,
  ApiVisitStatus,
  Paginated,
} from '@/lib/api/types'
import type { ApiBreak, ApiWorkingHour } from '@/lib/api/types'
import type { Visit, VisitStatus, Client, Service, Barber, DaySchedule } from '@/cms/data/mock'

export const UI_DAYS: Pick<DaySchedule, 'day' | 'short'>[] = [
  { day: 'Poniedziałek', short: 'Pon' },
  { day: 'Wtorek', short: 'Wt' },
  { day: 'Środa', short: 'Śr' },
  { day: 'Czwartek', short: 'Czw' },
  { day: 'Piątek', short: 'Pt' },
  { day: 'Sobota', short: 'Sob' },
  { day: 'Niedziela', short: 'Nd' },
]

export function uiDayIndexToApi(uiIdx: number): number {
  return (uiIdx + 1) % 7
}

export function apiDayToUiIndex(apiDay: number): number {
  return apiDay === 0 ? 6 : apiDay - 1
}

export function dateToUiDayIndex(dateStr: string): number {
  const d = new Date(`${dateStr}T12:00:00`)
  return apiDayToUiIndex(d.getDay())
}

export function emptyWeekSchedule(): DaySchedule[] {
  return UI_DAYS.map(d => ({
    ...d,
    open: false,
    from: '09:00',
    to: '17:00',
    breaks: [],
  }))
}

export function defaultWeekSchedule(): DaySchedule[] {
  return emptyWeekSchedule().map(d => ({
    ...d,
    open: d.short !== 'Nd',
    from: '09:00',
    to: d.short === 'Sob' ? '15:00' : '17:00',
    breaks: d.short !== 'Sob' && d.short !== 'Nd' ? [{ from: '13:00', to: '14:00' }] : [],
  }))
}

export function mapScheduleToUi(workingHours: ApiWorkingHour[], breaks: ApiBreak[]): DaySchedule[] {
  const days = emptyWeekSchedule()
  for (const wh of workingHours) {
    const idx = apiDayToUiIndex(wh.dayOfWeek)
    const day = days[idx]
    if (!day) continue
    day.open = true
    day.from = wh.startTime
    day.to = wh.endTime
  }
  for (const br of breaks) {
    const idx = apiDayToUiIndex(br.dayOfWeek)
    const day = days[idx]
    if (!day) continue
    day.breaks.push({ from: br.startTime, to: br.endTime })
  }
  return days
}

export function mapScheduleToApi(days: DaySchedule[]) {
  const workingHours = days
    .map((d, uiIdx) => ({ uiIdx, d }))
    .filter(({ d }) => d.open)
    .map(({ uiIdx, d }) => ({
      dayOfWeek: uiDayIndexToApi(uiIdx),
      startTime: d.from,
      endTime: d.to,
      active: true,
    }))
  const breaks = days.flatMap((d, uiIdx) =>
    d.open
      ? d.breaks.map(b => ({
          dayOfWeek: uiDayIndexToApi(uiIdx),
          startTime: b.from,
          endTime: b.to,
        }))
      : [],
  )
  return { workingHours, breaks }
}

const STATUS_TO_UI: Record<ApiVisitStatus, VisitStatus> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'cancelled',
}

const STATUS_TO_API: Record<VisitStatus, ApiVisitStatus> = {
  pending: 'PENDING',
  confirmed: 'CONFIRMED',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
}

export function toUiStatus(status: ApiVisitStatus): VisitStatus {
  return STATUS_TO_UI[status]
}

export function toApiStatus(status: VisitStatus): ApiVisitStatus {
  return STATUS_TO_API[status]
}

export function personName(p: ApiPerson): string {
  return [p.firstName, p.lastName].filter(Boolean).join(' ')
}

export function formatTimeInZone(iso: string, timezone: string): string {
  return new Date(iso).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: timezone,
  })
}

export function formatDateInZone(iso: string, timezone: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: timezone })
}

export function mapAppointment(a: ApiAppointment, timezone: string): Visit {
  return {
    id: a.id,
    clientId: a.customer.id,
    client: personName(a.customer),
    clientPhone: a.customer.phone,
    barberId: a.barber.id,
    barber: personName(a.barber),
    serviceId: a.service.id,
    service: a.service.name,
    date: formatDateInZone(a.startAt, timezone),
    time: formatTimeInZone(a.startAt, timezone),
    duration: a.service.duration,
    price: a.price,
    status: toUiStatus(a.status),
  }
}

export function mapCustomer(c: ApiCustomer, timezone: string): Client {
  return {
    id: c.id,
    name: personName(c),
    phone: c.phone,
    email: c.email ?? '',
    visits: c.completedCount ?? c.appointmentsCount ?? 0,
    lastVisit: c.lastVisitAt ? formatDateInZone(c.lastVisitAt, timezone) : '',
    totalSpent: c.totalSpent ?? 0,
    preferredBarber: c.preferredBarber ?? '',
    preferredService: c.preferredService ?? '',
    notes: c.notes ?? '',
    daysSinceLastVisit: c.daysSinceLastVisit ?? 0,
  }
}

export function mapCustomerDetail(c: ApiCustomer): Client {
  return {
    id: c.id,
    name: personName(c),
    phone: c.phone,
    email: c.email ?? '',
    visits: c.completedCount ?? c.appointmentsCount ?? 0,
    lastVisit: c.lastVisitAt ?? '',
    totalSpent: c.totalSpent ?? 0,
    preferredBarber: c.preferredBarber ?? '',
    preferredService: c.preferredService ?? '',
    notes: c.notes ?? '',
    daysSinceLastVisit: c.daysSinceLastVisit ?? 0,
  }
}

export function mapService(s: ApiService): Service {
  return {
    id: s.id,
    name: s.name,
    description: s.description ?? '',
    price: s.price,
    duration: s.duration,
    active: s.active,
    barberIds: [...s.barberIds],
  }
}

export function mapBarber(b: ApiBarber, stats?: { todayVisits?: number; occupancy?: number; totalVisits?: number; revenue?: number }): Barber {
  const source = stats ?? b.stats
  return {
    id: b.id,
    name: personName(b),
    phone: '',
    email: b.user?.email ?? '',
    active: b.active,
    todayVisits: source?.todayVisits ?? 0,
    occupancy: source?.occupancy ?? 0,
    totalVisits: source?.totalVisits ?? 0,
    revenue: source?.revenue ?? 0,
    serviceIds: [...b.serviceIds],
  }
}

export function buildStartAt(date: string, time: string, timeZone: string): string {
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  return new TZDate(year!, month! - 1, day!, hour!, minute!, 0, timeZone).toISOString()
}

export function mapOverview(stats: ApiStatisticsOverview) {
  return {
    todayVisits: stats.todayAppointments,
    todayVisitsTrend: stats.todayAppointmentsTrend ?? 0,
    revenue: stats.todayRevenue,
    revenueTrend: stats.revenueTrend ?? 0,
    newClients: stats.newCustomers,
    newClientsTrend: stats.newCustomersTrend ?? 0,
    occupancy: stats.occupancy ?? 0,
    occupancyTrend: stats.occupancyTrend ?? 0,
    pendingAppointments: stats.pendingAppointments,
  }
}

export type AuthSession = ApiAuthSession
