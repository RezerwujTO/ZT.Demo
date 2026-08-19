import { demoBackend } from '@/demo/backend'
import { demoRequest } from '@/lib/api/client'

export interface PublicSalon {
  id: string
  name: string
  slug: string
  city: string | null
  timezone: string
}

export interface PublicService {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
}

export interface PublicBarber {
  id: string
  firstName: string
  lastName: string | null
  bio: string | null
  serviceIds: string[]
}

export interface PublicBarberWithSalon {
  id: string
  firstName: string
  lastName: string | null
  avatar: string | null
  bio: string | null
  serviceIds: string[]
  rating?: number
  reviewsCount?: number
  salon: {
    id: string
    name: string
    slug: string
    city: string | null
    timezone: string
  }
}

export interface PublicScheduleEntry {
  dayOfWeek: number
  startTime: string
  endTime: string
}

export interface PublicBarberSchedule {
  id: string
  firstName: string
  lastName: string | null
  workingHours: PublicScheduleEntry[]
  breaks: PublicScheduleEntry[]
}

export interface PublicAvailabilitySlot {
  startAt: string
  endAt: string
  barberId: string
  available?: boolean
}

export const publicApi = {
  salon: (slug: string) => demoRequest<PublicSalon>(() => demoBackend.publicSalon(slug), 120),
  services: (slug: string, barberId?: string) =>
    demoRequest<PublicService[]>(() => demoBackend.publicServices(slug, barberId), 120),
  barbers: (slug: string, serviceId?: string) =>
    demoRequest<PublicBarber[]>(() => demoBackend.publicBarbers(slug, serviceId), 120),
  allBarbers: () => demoRequest<PublicBarberWithSalon[]>(() => demoBackend.publicAllBarbers(), 160),
  schedule: (slug: string) =>
    demoRequest<{ barbers: PublicBarberSchedule[] }>(() => {
      void slug
      return demoBackend.publicSchedule()
    }, 120),
  availability: (slug: string, params: { serviceId: string; date: string; barberId?: string }) =>
    demoRequest<
      | { slots: PublicAvailabilitySlot[]; barberId: string; date: string; timezone: string; duration: number }
      | { date: string; timezone: string; barbers: { barberId: string; barber: { id: string; firstName: string; lastName: string | null }; slots: PublicAvailabilitySlot[] }[] }
    >(() => demoBackend.publicAvailability(slug, params), 260),
  book: (slug: string, body: {
    barberId: string
    serviceId: string
    startAt: string
    customer: { firstName: string; lastName?: string; phone: string; email?: string }
    customerNote?: string
  }) => demoRequest<{ id: string; publicToken: string }>(() => demoBackend.publicBook(slug, body), 620),
  submitReview: (body: { publicToken: string; rating: number; comment?: string; customerName: string }) =>
    demoRequest<{ id: string }>(() => {
      void body
      return { id: 'demo-review' }
    }, 420),
  reviews: () =>
    demoRequest<{ name: string; rating: number; text: string; date: string; salonName: string; type: string }[]>(
      () => demoBackend.publicReviews(),
      160,
    ),
}
