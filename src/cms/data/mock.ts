export type VisitStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled'

export interface Visit {
  id: string
  clientId: string
  client: string
  clientPhone: string
  barberId: string
  barber: string
  serviceId: string
  service: string
  date: string
  time: string
  duration: number
  price: number
  status: VisitStatus
}

export interface Client {
  id: string
  name: string
  phone: string
  email: string
  visits: number
  lastVisit: string
  totalSpent: number
  preferredBarber: string
  preferredService: string
  notes: string
  daysSinceLastVisit: number
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  active: boolean
  barberIds: string[]
}

export interface Barber {
  id: string
  name: string
  phone: string
  email: string
  active: boolean
  todayVisits: number
  occupancy: number
  totalVisits: number
  revenue: number
  serviceIds: string[]
}

export interface DaySchedule {
  day: string
  short: string
  open: boolean
  from: string
  to: string
  breaks: { from: string; to: string }[]
}

export interface BarberSchedule {
  barberId: string
  days: DaySchedule[]
}

export interface HelpFaqItem {
  question: string
  answer: string
}

export const statusLabels: Record<VisitStatus, string> = {
  confirmed: 'Potwierdzona',
  pending: 'Oczekuje',
  completed: 'Zakończona',
  cancelled: 'Anulowana',
}

export const settingsSections = [
  { id: 'ogolne', label: 'Ogólne', icon: 'bi-sliders' },
  { id: 'salon', label: 'Salon', icon: 'bi-shop' },
  { id: 'rezerwacje', label: 'Rezerwacje', icon: 'bi-calendar-plus' },
  { id: 'powiadomienia', label: 'Powiadomienia', icon: 'bi-bell' },
  { id: 'konto', label: 'Konto', icon: 'bi-person' },
  { id: 'bezpieczenstwo', label: 'Bezpieczeństwo', icon: 'bi-shield-lock' },
] as const

export type SettingsSection = (typeof settingsSections)[number]['id']

export const helpFaq: HelpFaqItem[] = [
  { question: 'Jak dodać nową wizytę z kalendarza?', answer: 'Kliknij pusty slot w kalendarzu lub użyj przycisku „Nowa wizyta" w prawym górnym rogu. Wybierz klienta, usługę, specjalistę, datę i godzinę, a następnie potwierdź rezerwację.' },
  { question: 'Jak przenieść wizytę na inny termin?', answer: 'W widoku kalendarza przeciągnij wizytę na nowy slot lub otwórz szczegóły wizyty i wybierz „Przenieś". System sprawdzi dostępność specjalisty przed zatwierdzeniem zmiany.' },
  { question: 'Jak przypisać usługę tylko do wybranych osób z zespołu?', answer: 'Przejdź do sekcji Usługi, kliknij „Edytuj" przy danej usłudze i zaznacz specjalistów, którzy ją wykonują. Każda usługa może być przypisana do wielu osób jednocześnie.' },
  { question: 'Czym różnią się godziny salonu od godzin specjalisty?', answer: 'Godziny salonu określają, kiedy przyjmujecie klientów. Godziny specjalisty definiują indywidualną dostępność każdego pracownika. Klient widzi terminy wynikające z obu ustawień, przerw i istniejących rezerwacji.' },
  { question: 'Jak wysłać przypomnienie klientowi?', answer: 'Przypomnienia SMS i email wysyłane są automatycznie zgodnie z ustawieniami w sekcji Ustawienia → Powiadomienia. Możesz skonfigurować przypomnienia na 24h i 2h przed wizytą.' },
  { question: 'Jak anulować wizytę?', answer: 'Otwórz wizytę z listy Wizyty lub kalendarza, a następnie kliknij „Anuluj" w panelu bocznym. Anulowana wizyta zostanie oznaczona i zwolni termin w kalendarzu.' },
  { question: 'Czy mogę prowadzić barbera, fryzjerkę i kosmetyczkę w jednym koncie?', answer: 'Tak. W sekcji Zespół dodajesz barberów, fryzjerów, kosmetyczki i stylistki, przypisujesz im usługi oraz indywidualny grafik. Każda osoba ma własny kalendarz w widoku tygodniowym.' },
]

export const helpTopics = [
  { value: 'kalendarz', label: 'Kalendarz i wizyty' },
  { value: 'klienci', label: 'Klienci' },
  { value: 'uslugi', label: 'Usługi i cennik' },
  { value: 'zespol', label: 'Zespół i grafik' },
  { value: 'techniczne', label: 'Problem techniczny' },
  { value: 'inne', label: 'Inne' },
]

export function formatDatePL(date: Date): string {
  return date.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

export function minutesToTime(m: number): string {
  const h = Math.floor(m / 60)
  const min = m % 60
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}
