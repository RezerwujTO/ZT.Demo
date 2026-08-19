export type DemoBranch = 'barber' | 'fryzjer' | 'kosmetyczka' | 'beauty'

export interface DemoSalonSeed {
  id: string
  name: string
  slug: string
  city: string
  address: string
  phone: string
  email: string
  timezone: string
}

export interface DemoServiceSeed {
  id: string
  name: string
  description: string
  duration: number
  price: number
  active: boolean
  branch: DemoBranch
  featured?: boolean
}

export interface DemoStaffSeed {
  id: string
  firstName: string
  lastName: string
  bio: string
  email: string
  role: 'OWNER' | 'MANAGER' | 'STAFF'
  active: boolean
  serviceIds: string[]
  workingDays: number[]
  startTime: string
  endTime: string
  breakFrom: string
  breakTo: string
}

export interface DemoCustomerSeed {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  notes: string
  createdDaysAgo: number
}

export interface DemoReviewSeed {
  name: string
  rating: number
  text: string
  daysAgo: number
  salonName: string
  type: 'client' | 'barber'
}

export const DEMO_SALON_SLUG = 'demo'
export const DEMO_TIMEZONE = 'Europe/Warsaw'

export const salon: DemoSalonSeed = {
  id: 'sal-demo',
  name: 'Studio Vibe — barber, fryzjer & beauty',
  slug: DEMO_SALON_SLUG,
  city: 'Warszawa',
  address: 'ul. Nowogrodzka 42/3',
  phone: '+48 22 118 44 20',
  email: 'kontakt@studiovibe.pl',
  timezone: DEMO_TIMEZONE,
}

export const branchLabels: Record<DemoBranch, string> = {
  barber: 'Barber',
  fryzjer: 'Fryzjer',
  kosmetyczka: 'Gabinet kosmetyczny',
  beauty: 'Studio beauty',
}

export const services: DemoServiceSeed[] = [
  {
    id: 'svc-strzyzenie-meskie',
    name: 'Strzyżenie męskie',
    description: 'Konsultacja, mycie, strzyżenie maszynką i nożyczkami, stylizacja.',
    duration: 45,
    price: 80,
    active: true,
    branch: 'barber',
    featured: true,
  },
  {
    id: 'svc-broda',
    name: 'Broda i wąsy',
    description: 'Modelowanie brody brzytwą, ręcznik parowy, olejek pielęgnacyjny.',
    duration: 30,
    price: 60,
    active: true,
    branch: 'barber',
    featured: true,
  },
  {
    id: 'svc-combo',
    name: 'Combo: włosy i broda',
    description: 'Pełna metamorfoza — strzyżenie z modelowaniem brody w jednej wizycie.',
    duration: 75,
    price: 130,
    active: true,
    branch: 'barber',
    featured: true,
  },
  {
    id: 'svc-fade',
    name: 'Skin fade',
    description: 'Precyzyjne cieniowanie od zera z wykończeniem brzytwą.',
    duration: 45,
    price: 95,
    active: true,
    branch: 'barber',
  },
  {
    id: 'svc-strzyzenie-dzieciece',
    name: 'Strzyżenie dziecięce',
    description: 'Spokojna wizyta dla najmłodszych z bajką i nagrodą.',
    duration: 30,
    price: 60,
    active: true,
    branch: 'barber',
  },
  {
    id: 'svc-strzyzenie-damskie',
    name: 'Strzyżenie damskie',
    description: 'Diagnoza włosów, mycie, strzyżenie i modelowanie wykończone stylizacją.',
    duration: 60,
    price: 130,
    active: true,
    branch: 'fryzjer',
    featured: true,
  },
  {
    id: 'svc-koloryzacja',
    name: 'Koloryzacja',
    description: 'Dobór odcienia, koloryzacja na całej długości, odżywka regenerująca.',
    duration: 150,
    price: 280,
    active: true,
    branch: 'fryzjer',
    featured: true,
  },
  {
    id: 'svc-balejaz',
    name: 'Baleyage i sombre',
    description: 'Rozświetlenie pasm, tonowanie i kuracja odbudowująca.',
    duration: 180,
    price: 420,
    active: true,
    branch: 'fryzjer',
  },
  {
    id: 'svc-modelowanie',
    name: 'Modelowanie i upięcie',
    description: 'Fale, prostowanie lub upięcie okolicznościowe z utrwaleniem.',
    duration: 45,
    price: 110,
    active: true,
    branch: 'fryzjer',
  },
  {
    id: 'svc-keratyna',
    name: 'Keratynowe prostowanie',
    description: 'Wygładzenie i nawilżenie włosów na kilka miesięcy.',
    duration: 120,
    price: 380,
    active: true,
    branch: 'fryzjer',
  },
  {
    id: 'svc-oczyszczanie',
    name: 'Oczyszczanie wodorowe',
    description: 'Głębokie oczyszczanie twarzy, serum dopasowane do cery, maska kojąca.',
    duration: 60,
    price: 190,
    active: true,
    branch: 'kosmetyczka',
    featured: true,
  },
  {
    id: 'svc-peeling',
    name: 'Peeling kwasami',
    description: 'Zabieg złuszczający redukujący przebarwienia i niedoskonałości.',
    duration: 45,
    price: 230,
    active: true,
    branch: 'kosmetyczka',
  },
  {
    id: 'svc-mezoterapia',
    name: 'Mezoterapia igłowa',
    description: 'Koktajl witaminowy dobrany do potrzeb skóry, efekt odmłodzenia.',
    duration: 60,
    price: 350,
    active: true,
    branch: 'kosmetyczka',
  },
  {
    id: 'svc-depilacja',
    name: 'Depilacja woskiem',
    description: 'Depilacja woskiem twardym z pielęgnacją łagodzącą po zabiegu.',
    duration: 30,
    price: 90,
    active: true,
    branch: 'kosmetyczka',
  },
  {
    id: 'svc-makijaz',
    name: 'Makijaż okolicznościowy',
    description: 'Makijaż na wesele lub sesję z próbą kolorystyczną.',
    duration: 60,
    price: 220,
    active: true,
    branch: 'kosmetyczka',
  },
  {
    id: 'svc-manicure',
    name: 'Manicure hybrydowy',
    description: 'Opracowanie płytki, lakier hybrydowy, olejek do skórek.',
    duration: 75,
    price: 140,
    active: true,
    branch: 'beauty',
    featured: true,
  },
  {
    id: 'svc-pedicure',
    name: 'Pedicure kosmetyczny',
    description: 'Opracowanie stóp, skórek i płytki z lakierem hybrydowym.',
    duration: 75,
    price: 170,
    active: true,
    branch: 'beauty',
  },
  {
    id: 'svc-rzesy',
    name: 'Przedłużanie rzęs',
    description: 'Metoda objętościowa 2D–4D, dobór długości i skrętu do oka.',
    duration: 120,
    price: 260,
    active: true,
    branch: 'beauty',
    featured: true,
  },
  {
    id: 'svc-brwi',
    name: 'Laminacja brwi',
    description: 'Laminacja, regulacja i henna pudrowa z odżywką.',
    duration: 60,
    price: 150,
    active: true,
    branch: 'beauty',
    featured: true,
  },
]

export const staff: DemoStaffSeed[] = [
  {
    id: 'stf-kamil',
    firstName: 'Kamil',
    lastName: 'Nowak',
    bio: 'Barber — fade, brzytwa, pielęgnacja brody',
    email: 'kamil@studiovibe.pl',
    role: 'OWNER',
    active: true,
    serviceIds: ['svc-strzyzenie-meskie', 'svc-broda', 'svc-combo', 'svc-fade'],
    workingDays: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '17:00',
    breakFrom: '13:00',
    breakTo: '13:30',
  },
  {
    id: 'stf-michal',
    firstName: 'Michał',
    lastName: 'Sowa',
    bio: 'Barber — strzyżenia klasyczne i dziecięce',
    email: 'michal@studiovibe.pl',
    role: 'STAFF',
    active: true,
    serviceIds: ['svc-strzyzenie-meskie', 'svc-fade', 'svc-strzyzenie-dzieciece'],
    workingDays: [2, 3, 4, 5, 6],
    startTime: '11:00',
    endTime: '19:00',
    breakFrom: '15:00',
    breakTo: '15:30',
  },
  {
    id: 'stf-julia',
    firstName: 'Julia',
    lastName: 'Wiśniewska',
    bio: 'Fryzjerka stylistka — koloryzacja i strzyżenia damskie',
    email: 'julia@studiovibe.pl',
    role: 'STAFF',
    active: true,
    serviceIds: ['svc-strzyzenie-damskie', 'svc-koloryzacja', 'svc-balejaz', 'svc-modelowanie', 'svc-keratyna'],
    workingDays: [1, 2, 3, 4, 5, 6],
    startTime: '10:00',
    endTime: '18:00',
    breakFrom: '14:00',
    breakTo: '14:30',
  },
  {
    id: 'stf-natalia',
    firstName: 'Natalia',
    lastName: 'Dąbrowska',
    bio: 'Kosmetolożka — pielęgnacja twarzy i zabiegi kwasami',
    email: 'natalia@studiovibe.pl',
    role: 'STAFF',
    active: true,
    serviceIds: ['svc-oczyszczanie', 'svc-peeling', 'svc-mezoterapia', 'svc-depilacja'],
    workingDays: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '16:00',
    breakFrom: '12:30',
    breakTo: '13:00',
  },
  {
    id: 'stf-ola',
    firstName: 'Ola',
    lastName: 'Krupa',
    bio: 'Stylistka paznokci — manicure, pedicure, zdobienia',
    email: 'ola@studiovibe.pl',
    role: 'STAFF',
    active: true,
    serviceIds: ['svc-manicure', 'svc-pedicure'],
    workingDays: [2, 3, 4, 5, 6],
    startTime: '10:00',
    endTime: '18:00',
    breakFrom: '14:00',
    breakTo: '14:30',
  },
  {
    id: 'stf-weronika',
    firstName: 'Weronika',
    lastName: 'Bąk',
    bio: 'Stylistka rzęs i brwi, makijaż okolicznościowy',
    email: 'weronika@studiovibe.pl',
    role: 'STAFF',
    active: true,
    serviceIds: ['svc-rzesy', 'svc-brwi', 'svc-makijaz'],
    workingDays: [1, 3, 4, 5, 6],
    startTime: '10:00',
    endTime: '18:00',
    breakFrom: '13:30',
    breakTo: '14:00',
  },
]

export const customers: DemoCustomerSeed[] = [
  { id: 'cus-01', firstName: 'Anna', lastName: 'Kowalska', phone: '+48 501 234 187', email: 'anna.kowalska@email.pl', notes: 'Uczulenie na amoniak — koloryzacja bezamoniakowa.', createdDaysAgo: 320 },
  { id: 'cus-02', firstName: 'Piotr', lastName: 'Zieliński', phone: '+48 602 887 410', email: 'p.zielinski@email.pl', notes: 'Fade 1, broda na 6 mm.', createdDaysAgo: 280 },
  { id: 'cus-03', firstName: 'Magdalena', lastName: 'Wójcik', phone: '+48 512 445 903', email: 'magda.wojcik@email.pl', notes: 'Cera naczynkowa, unikać mocnych kwasów.', createdDaysAgo: 250 },
  { id: 'cus-04', firstName: 'Tomasz', lastName: 'Lewandowski', phone: '+48 693 220 118', email: 'tomek.l@email.pl', notes: '', createdDaysAgo: 210 },
  { id: 'cus-05', firstName: 'Karolina', lastName: 'Szymańska', phone: '+48 505 671 234', email: 'karolina.sz@email.pl', notes: 'Rzęsy 2D, skręt C.', createdDaysAgo: 190 },
  { id: 'cus-06', firstName: 'Michał', lastName: 'Kaczmarek', phone: '+48 660 118 552', email: 'm.kaczmarek@email.pl', notes: '', createdDaysAgo: 175 },
  { id: 'cus-07', firstName: 'Aleksandra', lastName: 'Nowicka', phone: '+48 517 903 461', email: 'ola.nowicka@email.pl', notes: 'Preferuje wizyty popołudniowe.', createdDaysAgo: 160 },
  { id: 'cus-08', firstName: 'Jakub', lastName: 'Mazurek', phone: '+48 604 331 209', email: 'kuba.mazurek@email.pl', notes: '', createdDaysAgo: 140 },
  { id: 'cus-09', firstName: 'Natalia', lastName: 'Adamczyk', phone: '+48 533 470 882', email: 'natalia.a@email.pl', notes: 'Hybryda w odcieniach nude.', createdDaysAgo: 128 },
  { id: 'cus-10', firstName: 'Paweł', lastName: 'Górski', phone: '+48 691 552 034', email: 'pawel.gorski@email.pl', notes: '', createdDaysAgo: 112 },
  { id: 'cus-11', firstName: 'Ewa', lastName: 'Pawlak', phone: '+48 508 224 771', email: 'ewa.pawlak@email.pl', notes: 'Brwi — efekt naturalny.', createdDaysAgo: 96 },
  { id: 'cus-12', firstName: 'Marcin', lastName: 'Duda', phone: '+48 665 108 340', email: 'marcin.duda@email.pl', notes: '', createdDaysAgo: 88 },
  { id: 'cus-13', firstName: 'Zuzanna', lastName: 'Sikora', phone: '+48 514 662 019', email: 'zuzia.sikora@email.pl', notes: 'Włosy wysokoporowate.', createdDaysAgo: 74 },
  { id: 'cus-14', firstName: 'Bartosz', lastName: 'Kubiak', phone: '+48 601 449 725', email: 'bartek.kubiak@email.pl', notes: '', createdDaysAgo: 61 },
  { id: 'cus-15', firstName: 'Weronika', lastName: 'Baran', phone: '+48 530 771 668', email: 'weronika.baran@email.pl', notes: 'Alergia na lateks.', createdDaysAgo: 52 },
  { id: 'cus-16', firstName: 'Grzegorz', lastName: 'Wieczorek', phone: '+48 698 203 917', email: 'g.wieczorek@email.pl', notes: '', createdDaysAgo: 43 },
  { id: 'cus-17', firstName: 'Patrycja', lastName: 'Lis', phone: '+48 519 884 302', email: 'patrycja.lis@email.pl', notes: 'Stała klientka manicure co 3 tygodnie.', createdDaysAgo: 35 },
  { id: 'cus-18', firstName: 'Damian', lastName: 'Rutkowski', phone: '+48 662 015 448', email: 'damian.r@email.pl', notes: '', createdDaysAgo: 28 },
  { id: 'cus-19', firstName: 'Klaudia', lastName: 'Sobczak', phone: '+48 537 226 901', email: 'klaudia.sobczak@email.pl', notes: 'Pierwsza wizyta z polecenia.', createdDaysAgo: 17 },
  { id: 'cus-20', firstName: 'Rafał', lastName: 'Ostrowski', phone: '+48 606 337 154', email: 'rafal.ostrowski@email.pl', notes: '', createdDaysAgo: 9 },
]

export const reviews: DemoReviewSeed[] = [
  { name: 'Agnieszka R.', rating: 5, text: 'Rezerwacja zajęła minutę, a przypomnienie SMS przyszło dzień wcześniej. Koloryzacja wyszła dokładnie tak, jak chciałam.', daysAgo: 3, salonName: 'Studio Vibe', type: 'client' },
  { name: 'Marek Z.', rating: 5, text: 'Kalendarz sam pilnuje przerw i nakładających się wizyt. Odkąd mamy rezerwacje online, telefon dzwoni o połowę rzadziej.', daysAgo: 6, salonName: 'Studio Vibe', type: 'barber' },
  { name: 'Kinga W.', rating: 5, text: 'Zapisałam się na przedłużanie rzęs o 23:00, bez dzwonienia. Wolne terminy widać od razu przy każdej specjalistce.', daysAgo: 8, salonName: 'Studio Vibe', type: 'client' },
  { name: 'Aleksandra M.', rating: 5, text: 'Prowadzę część kosmetyczną — panel zastąpił mi zeszyt i arkusz. Historia zabiegów każdej klientki jest pod ręką.', daysAgo: 12, salonName: 'Studio Vibe', type: 'barber' },
  { name: 'Bartek K.', rating: 5, text: 'Strzyżenie i broda w jednym slocie, płatność na miejscu. Aplikacja przypomniała mi o wizycie dwa razy — komplet.', daysAgo: 15, salonName: 'Studio Vibe', type: 'client' },
  { name: 'Julia W.', rating: 5, text: 'Barber, fryzjerka, kosmetolożka i stylistka paznokci w jednym grafiku. Każda z nas ma własne godziny i usługi.', daysAgo: 21, salonName: 'Studio Vibe', type: 'barber' },
]

export const notificationTemplates = [
  { type: 'APPOINTMENT_CONFIRMATION', subject: 'Potwierdzenie wizyty — Studio Vibe', status: 'SENT' },
  { type: 'APPOINTMENT_REMINDER_24H', subject: 'Przypomnienie: wizyta jutro o 12:30', status: 'SENT' },
  { type: 'APPOINTMENT_REMINDER_2H', subject: 'Przypomnienie: wizyta za 2 godziny', status: 'SENT' },
  { type: 'APPOINTMENT_CANCELLED', subject: 'Wizyta anulowana — Studio Vibe', status: 'SENT' },
  { type: 'REVIEW_REQUEST', subject: 'Jak minęła wizyta? Zostaw opinię', status: 'PENDING' },
]
