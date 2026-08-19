import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  appointmentsApi,
  barbersApi,
  servicesApi,
  customersApi,
  statisticsApi,
  mapAppointment,
  mapCustomer,
  mapCustomerDetail,
  mapService,
  mapBarber,
  mapOverview,
  buildStartAt,
  toApiStatus,
  mapScheduleToUi,
  mapScheduleToApi,
  defaultWeekSchedule,
  dateToUiDayIndex,
} from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import {
  type Visit,
  type VisitStatus,
  type Client,
  type Service,
  type Barber,
  type DaySchedule,
} from '@/cms/data/mock'

export interface NewVisitPrefill {
  barberId?: string
  date?: string
  time?: string
}

export interface DashboardOverview {
  todayVisits: number
  todayVisitsTrend: number
  revenue: number
  revenueTrend: number
  newClients: number
  newClientsTrend: number
  occupancy: number
  occupancyTrend: number
  pendingAppointments: number
}

const EMPTY_SCHEDULE: DaySchedule[] = [
  { day: 'Poniedziałek', short: 'Pon', open: true, from: '09:00', to: '17:00', breaks: [] },
  { day: 'Wtorek', short: 'Wt', open: true, from: '09:00', to: '17:00', breaks: [] },
  { day: 'Środa', short: 'Śr', open: true, from: '09:00', to: '17:00', breaks: [] },
  { day: 'Czwartek', short: 'Czw', open: true, from: '09:00', to: '17:00', breaks: [] },
  { day: 'Piątek', short: 'Pt', open: true, from: '09:00', to: '17:00', breaks: [] },
  { day: 'Sobota', short: 'Sob', open: false, from: '', to: '', breaks: [] },
  { day: 'Niedziela', short: 'Nd', open: false, from: '', to: '', breaks: [] },
]

export const useCmsStore = defineStore('cms', () => {
  const auth = useAuthStore()

  const visits = ref<Visit[]>([])
  const clients = ref<Client[]>([])
  const services = ref<Service[]>([])
  const barbers = ref<Barber[]>([])

  const salonSchedule = ref<DaySchedule[]>(EMPTY_SCHEDULE.map(d => ({ ...d, breaks: [] })))
  const barberSchedules = ref<{ barberId: string; days: DaySchedule[] }[]>([])
  const overview = ref<DashboardOverview | null>(null)
  const clientDetails = ref<Record<string, Client>>({})
  const clientHistory = ref<Record<string, { date: string; service: string; price: number }[]>>({})

  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  const todayDate = computed(() =>
    new Date().toLocaleDateString('en-CA', { timeZone: auth.timezone })
  )

  const todayVisits = computed(() =>
    visits.value
      .filter(v => v.date === todayDate.value && v.status !== 'cancelled')
      .sort((a, b) => a.time.localeCompare(b.time))
  )

  const getVisit = (id: string) => visits.value.find(v => v.id === id)
  const getClient = (id: string) => clientDetails.value[id] ?? clients.value.find(c => c.id === id)
  const getBarber = (id: string) => barbers.value.find(b => b.id === id)
  const getService = (id: string) => services.value.find(s => s.id === id)

  async function loadAll() {
    if (!auth.isAuthenticated) return
    loading.value = true
    error.value = null
    const tz = auth.timezone

    try {
      const from = new Date()
      from.setDate(from.getDate() - 7)
      const to = new Date()
      to.setDate(to.getDate() + 30)

      const results = await Promise.allSettled([
        appointmentsApi.list({ limit: 100, sort: 'startAt:asc', from: from.toISOString(), to: to.toISOString() }),
        customersApi.list({ limit: 100 }),
        servicesApi.list({ limit: 100 }),
        barbersApi.list({ limit: 100 }),
        statisticsApi.overview(),
      ])

      const [apptsRes, clientsRes, servicesRes, barbersRes, statsRes] = results

      if (apptsRes.status === 'fulfilled') visits.value = apptsRes.value.data.map(a => mapAppointment(a, tz))
      if (clientsRes.status === 'fulfilled') clients.value = clientsRes.value.data.map(c => mapCustomer(c, tz))
      if (servicesRes.status === 'fulfilled') services.value = servicesRes.value.data.map(mapService)
      if (barbersRes.status === 'fulfilled') barbers.value = barbersRes.value.data.map(b => mapBarber(b))
      if (statsRes.status === 'fulfilled') overview.value = mapOverview(statsRes.value)

      await loadSchedules()

      initialized.value = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Nie udało się załadować danych'
    } finally {
      loading.value = false
    }
  }

  async function loadSchedules() {
    if (!barbers.value.length) return
    const results = await Promise.allSettled(
      barbers.value.map(async b => {
        const schedule = await barbersApi.getSchedule(b.id)
        return { barberId: b.id, days: mapScheduleToUi(schedule.workingHours, schedule.breaks) }
      }),
    )
    const schedules = results
      .filter((r): r is PromiseFulfilledResult<{ barberId: string; days: DaySchedule[] }> => r.status === 'fulfilled')
      .map(r => r.value)
    if (schedules.length) {
      barberSchedules.value = schedules
      salonSchedule.value = schedules[0]!.days.map(d => ({
        ...d,
        breaks: d.breaks.map(br => ({ ...br })),
      }))
    }
  }

  function getBarberSchedule(barberId: string) {
    return barberSchedules.value.find(bs => bs.barberId === barberId)?.days
  }

  function getBreaksForDate(date: string, barberId?: string) {
    const barberIds = barberId && barberId !== 'all'
      ? [barberId]
      : barbers.value.filter(b => b.active).map(b => b.id)
    const uiIdx = dateToUiDayIndex(date)
    const result: { barberId: string; breaks: { from: string; to: string }[] }[] = []
    for (const id of barberIds) {
      const days = getBarberSchedule(id)
      if (!days?.[uiIdx]?.open) continue
      result.push({ barberId: id, breaks: days[uiIdx].breaks })
    }
    return result
  }

  function isBreakAt(date: string, hour: string, barberId?: string): boolean {
    const hourMin = parseInt(hour.split(':')[0] ?? '0', 10) * 60 + parseInt(hour.split(':')[1] ?? '0', 10)
    const entries = getBreaksForDate(date, barberId)
    return entries.some(e =>
      e.breaks.some(b => {
        const from = parseInt(b.from.split(':')[0] ?? '0', 10) * 60 + parseInt(b.from.split(':')[1] ?? '0', 10)
        const to = parseInt(b.to.split(':')[0] ?? '0', 10) * 60 + parseInt(b.to.split(':')[1] ?? '0', 10)
        return hourMin >= from && hourMin < to
      }),
    )
  }

  async function saveBarberSchedule(barberId: string, days: DaySchedule[]) {
    const { workingHours, breaks } = mapScheduleToApi(days)
    await Promise.all([
      barbersApi.setWorkingHours(barberId, workingHours),
      barbersApi.setBreaks(barberId, breaks),
    ])
    const copy = days.map(d => ({ ...d, breaks: d.breaks.map(b => ({ ...b })) }))
    const idx = barberSchedules.value.findIndex(bs => bs.barberId === barberId)
    if (idx >= 0) barberSchedules.value[idx] = { barberId, days: copy }
    else barberSchedules.value.push({ barberId, days: copy })
  }

  async function updateBreaksForDay(barberId: string, date: string, breaks: { from: string; to: string }[]) {
    const days = getBarberSchedule(barberId)?.map(d => ({ ...d, breaks: d.breaks.map(b => ({ ...b })) }))
    if (!days) return
    const uiIdx = dateToUiDayIndex(date)
    days[uiIdx]!.breaks = breaks.map(b => ({ ...b }))
    await saveBarberSchedule(barberId, days)
  }

  async function createBarber(payload: { firstName: string; lastName: string; serviceIds: string[] }) {
    const created = await barbersApi.create({ ...payload, active: true })
    barbers.value.push(mapBarber(created))
    const defaultDays = defaultWeekSchedule()
    await saveBarberSchedule(created.id, defaultDays)
    return created.id
  }

  async function createClient(payload: { firstName: string; lastName?: string; phone: string; email?: string; notes?: string }) {
    const created = await customersApi.create(payload)
    const mapped = mapCustomer(created, auth.timezone)
    clients.value.unshift(mapped)
    return mapped.id
  }

  async function fetchClientDetail(id: string) {
    const tz = auth.timezone
    const [customerRes, apptsRes] = await Promise.allSettled([
      customersApi.get(id),
      customersApi.appointments(id, { limit: 20 }),
    ])

    if (customerRes.status !== 'fulfilled') throw customerRes.reason
    const mapped = mapCustomerDetail(customerRes.value)

    if (apptsRes.status === 'fulfilled') {
      const appts = apptsRes.value
      if (appts.data.length) {
        const last = appts.data[0]!
        mapped.lastVisit = mapAppointment(last, tz).date
        const lastDate = new Date(last.startAt)
        mapped.daysSinceLastVisit = Math.floor((Date.now() - lastDate.getTime()) / 86_400_000)
      }
      clientHistory.value[id] = appts.data.map(a => ({
        date: new Date(a.startAt).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', timeZone: tz }),
        service: a.service.name,
        price: a.price,
      }))
    }

    clientDetails.value[id] = mapped
    return mapped
  }

  function patchVisitLocal(id: string, patch: Partial<Visit>) {
    const v = visits.value.find(x => x.id === id)
    if (v) Object.assign(v, patch)
  }

  async function updateVisitStatus(id: string, status: VisitStatus) {
    const updated = await appointmentsApi.updateStatus(id, toApiStatus(status))
    patchVisitLocal(id, mapAppointment(updated, auth.timezone))
  }

  async function cycleVisitStatus(id: string) {
    const v = visits.value.find(x => x.id === id)
    if (!v) return
    const order: VisitStatus[] = ['pending', 'confirmed', 'completed']
    const idx = order.indexOf(v.status)
    const next = order[(idx + 1) % order.length] ?? 'confirmed'
    await updateVisitStatus(id, next)
  }

  async function moveVisit(id: string, time: string, date?: string) {
    const v = visits.value.find(x => x.id === id)
    if (!v) return false
    const targetDate = date ?? v.date
    const startAt = buildStartAt(targetDate, time, auth.timezone)
    try {
      const updated = await appointmentsApi.update(id, {
        startAt,
        barberId: v.barberId,
        serviceId: v.serviceId,
        price: v.price,
      })
      patchVisitLocal(id, mapAppointment(updated, auth.timezone))
      return true
    } catch {
      return false
    }
  }

  async function cancelVisit(id: string) {
    await updateVisitStatus(id, 'cancelled')
  }

  async function completeVisit(id: string) {
    await updateVisitStatus(id, 'completed')
  }

  async function addVisit(data: Omit<Visit, 'id'>) {
    const startAt = buildStartAt(data.date, data.time, auth.timezone)
    const created = await appointmentsApi.create({
      barberId: data.barberId,
      serviceId: data.serviceId,
      startAt,
      customerId: data.clientId,
      status: 'CONFIRMED',
      price: data.price,
    })
    const mapped = mapAppointment(created, auth.timezone)
    visits.value.push(mapped)
    return mapped.id
  }

  async function toggleServiceActive(id: string) {
    const s = services.value.find(x => x.id === id)
    if (!s) return
    const updated = await servicesApi.update(id, { active: !s.active })
    Object.assign(s, mapService(updated))
  }

  async function toggleBarberActive(id: string) {
    const b = barbers.value.find(x => x.id === id)
    if (!b) return
    const updated = await barbersApi.update(id, { active: !b.active })
    Object.assign(b, mapBarber(updated))
  }

  async function saveService(id: string | null, payload: { name: string; description: string; price: number; duration: number; barberIds: string[] }) {
    if (id) {
      const updated = await servicesApi.update(id, payload)
      const idx = services.value.findIndex(s => s.id === id)
      if (idx >= 0) services.value[idx] = mapService(updated)
    } else {
      const created = await servicesApi.create({ ...payload, active: true })
      services.value.push(mapService(created))
    }
  }

  return {
    visits,
    clients,
    services,
    barbers,
    salonSchedule,
    barberSchedules,
    overview,
    clientDetails,
    clientHistory,
    loading,
    error,
    initialized,
    todayDate,
    todayVisits,
    loadAll,
    loadSchedules,
    fetchClientDetail,
    getBarberSchedule,
    getBreaksForDate,
    isBreakAt,
    saveBarberSchedule,
    updateBreaksForDay,
    createBarber,
    createClient,
    getVisit,
    getClient,
    getBarber,
    getService,
    updateVisitStatus,
    cycleVisitStatus,
    moveVisit,
    cancelVisit,
    completeVisit,
    addVisit,
    toggleServiceActive,
    toggleBarberActive,
    saveService,
  }
})

export const useUiStore = defineStore('cmsUi', () => {
  const visitPanelId = ref<string | null>(null)
  const clientPanelId = ref<string | null>(null)
  const barberPanelId = ref<string | null>(null)
  const newVisitOpen = ref(false)
  const searchOpen = ref(false)
  const newVisitPrefill = ref<NewVisitPrefill>({})
  const servicePanelMode = ref<'closed' | 'new' | 'edit'>('closed')
  const serviceEditId = ref<string | null>(null)
  const addBarberOpen = ref(false)
  const addClientOpen = ref(false)
  const confirmDialog = ref<{ show: boolean; title: string; message: string; onConfirm: () => void | Promise<void> }>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  const openVisitPanel = (id: string) => {
    clientPanelId.value = null
    barberPanelId.value = null
    visitPanelId.value = id
  }

  const closeVisitPanel = () => { visitPanelId.value = null }

  const openClientPanel = (id: string) => {
    visitPanelId.value = null
    barberPanelId.value = null
    clientPanelId.value = id
  }

  const closeClientPanel = () => { clientPanelId.value = null }

  const openBarberPanel = (id: string) => {
    visitPanelId.value = null
    clientPanelId.value = null
    barberPanelId.value = id
  }

  const closeBarberPanel = () => { barberPanelId.value = null }

  const openNewVisit = (prefill?: NewVisitPrefill) => {
    newVisitPrefill.value = prefill ?? {}
    newVisitOpen.value = true
  }

  const closeNewVisit = () => {
    newVisitOpen.value = false
    newVisitPrefill.value = {}
  }

  const openSearch = () => { searchOpen.value = true }
  const closeSearch = () => { searchOpen.value = false }

  const showConfirm = (title: string, message: string, onConfirm: () => void | Promise<void>) => {
    confirmDialog.value = { show: true, title, message, onConfirm }
  }

  const hideConfirm = () => {
    confirmDialog.value.show = false
  }

  const openServiceNew = () => {
    servicePanelMode.value = 'new'
    serviceEditId.value = null
  }

  const openServiceEdit = (id: string) => {
    servicePanelMode.value = 'edit'
    serviceEditId.value = id
  }

  const closeServicePanel = () => {
    servicePanelMode.value = 'closed'
    serviceEditId.value = null
  }

  const openAddBarber = () => { addBarberOpen.value = true }
  const closeAddBarber = () => { addBarberOpen.value = false }

  const openAddClient = () => { addClientOpen.value = true }
  const closeAddClient = () => { addClientOpen.value = false }

  return {
    visitPanelId,
    clientPanelId,
    barberPanelId,
    newVisitOpen,
    searchOpen,
    newVisitPrefill,
    servicePanelMode,
    serviceEditId,
    addBarberOpen,
    addClientOpen,
    confirmDialog,
    openVisitPanel,
    closeVisitPanel,
    openClientPanel,
    closeClientPanel,
    openBarberPanel,
    closeBarberPanel,
    openNewVisit,
    closeNewVisit,
    openSearch,
    closeSearch,
    showConfirm,
    hideConfirm,
    openServiceNew,
    openServiceEdit,
    closeServicePanel,
    openAddBarber,
    closeAddBarber,
    openAddClient,
    closeAddClient,
  }
})
