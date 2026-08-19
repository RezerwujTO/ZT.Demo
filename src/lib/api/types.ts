export interface ApiErrorBody {
  code: string
  message: string
  details?: unknown
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiErrorBody
}

export interface PaginatedMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface Paginated<T> {
  data: T[]
  meta: PaginatedMeta
}

export type ApiVisitStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'

export interface ApiPerson {
  id: string
  firstName: string
  lastName: string | null
}

export interface ApiCustomer extends ApiPerson {
  phone: string
  email: string | null
  notes?: string | null
  appointmentsCount?: number
  completedCount?: number
  totalSpent?: number
  lastVisitAt?: string | null
  daysSinceLastVisit?: number
  preferredService?: string
  preferredBarber?: string
}

export interface ApiBarberStats {
  todayVisits: number
  occupancy: number
  totalVisits: number
  revenue: number
}

export interface ApiBarber extends ApiPerson {
  active: boolean
  bio?: string | null
  avatar?: string | null
  serviceIds: string[]
  user?: { id: string; email: string; role: string; active: boolean } | null
  stats?: ApiBarberStats
}

export interface ApiService {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  active: boolean
  barberIds: string[]
}

export interface ApiAppointment {
  id: string
  startAt: string
  endAt: string
  status: ApiVisitStatus
  price: number
  customerNote?: string | null
  internalNote?: string | null
  barber: ApiPerson & { avatar?: string | null }
  service: { id: string; name: string; duration: number }
  customer: ApiCustomer
}

export interface ApiAuthUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  salonId: string
  active: boolean
}

export interface ApiSalon {
  id: string
  name: string
  slug: string
  timezone: string
  phone: string | null
  email: string | null
  city: string | null
  address: string | null
  postalCode?: string | null
  description?: string | null
}

export interface ApiAuthSession {
  user: ApiAuthUser
  salon: ApiSalon
  accessToken: string
  refreshToken: string
}

export interface ApiStatisticsOverview {
  todayAppointments: number
  todayRevenue: number
  monthAppointments: number
  monthRevenue: number
  newCustomers: number
  cancelledAppointments: number
  noShows: number
  upcomingAppointments: number
  pendingAppointments: number
  occupancy?: number
  todayAppointmentsTrend?: number
  revenueTrend?: number
  newCustomersTrend?: number
  occupancyTrend?: number
}

export interface ApiWorkingHour {
  id: string
  barberId: string
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface ApiBreak {
  id: string
  barberId: string
  dayOfWeek: number
  startTime: string
  endTime: string
}
