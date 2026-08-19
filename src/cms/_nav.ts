export interface NavItem {
  name: string
  to: string
  icon: string
}

export interface NavGroup {
  items: NavItem[]
  divider?: boolean
}

export const navGroups: NavGroup[] = [
  {
    items: [
      { name: 'Dashboard', to: '/cms', icon: 'bi-grid-1x2-fill' },
      { name: 'Kalendarz', to: '/cms/kalendarz', icon: 'bi-calendar3' },
      { name: 'Wizyty', to: '/cms/wizyty', icon: 'bi-calendar-check-fill' },
      { name: 'Klienci', to: '/cms/klienci', icon: 'bi-people-fill' },
    ],
  },
  {
    divider: true,
    items: [
      { name: 'Usługi', to: '/cms/uslugi', icon: 'bi-scissors' },
      { name: 'Zespół', to: '/cms/barberzy', icon: 'bi-person-badge-fill' },
      { name: 'Godziny pracy', to: '/cms/godziny', icon: 'bi-clock-fill' },
    ],
  },
  {
    divider: true,
    items: [
      { name: 'Ustawienia', to: '/cms/ustawienia', icon: 'bi-gear-fill' },
    ],
  },
]

export default navGroups
