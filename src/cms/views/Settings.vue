<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { settingsSections, type SettingsSection } from '../data/mock'
import { useAuthStore } from '@/stores/auth'
import { salonApi, authApi, ApiError } from '@/lib/api'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const section = ref<SettingsSection>((route.query.s as SettingsSection) || 'ogolne')
const saved = ref(false)
const saveError = ref('')
const loading = ref(false)

const general = reactive({
  name: auth.salon?.name ?? '',
  phone: auth.salon?.phone ?? '',
  email: auth.salon?.email ?? '',
  timezone: auth.salon?.timezone ?? 'Europe/Warsaw',
  currency: 'PLN',
})

const salon = reactive({
  address: auth.salon?.address ?? '',
  city: auth.salon?.city ?? '',
  zip: '',
  mapsUrl: '',
  description: '',
})

const bookings = reactive({
  minBefore: 2,
  maxDays: 60,
  clientCanCancel: true,
  minCancelHours: 4,
  clientCanReschedule: true,
  autoConfirm: true,
})

const notifications = reactive({
  emailNew: true,
  emailChange: true,
  emailCancel: true,
  emailReminder24: true,
})

const account = reactive({
  firstName: auth.user?.firstName ?? '',
  lastName: auth.user?.lastName ?? '',
  email: auth.user?.email ?? '',
})

const passForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const passLoading = ref(false)
const passError = ref('')
const passSuccess = ref(false)
const showCurrent = ref(false)
const showNew = ref(false)

const deleteModalOpen = ref(false)
const deleteAction = ref<'suspend' | 'delete'>('suspend')
const deleteStep = ref(0)
const deleteCode = ref('')
const deleteLoading = ref(false)
const deleteError = ref('')

const passStrength = computed(() => {
  let s = 0
  if (passForm.newPassword.length >= 8) s++
  if (passForm.newPassword.length >= 12) s++
  if (/[a-z]/.test(passForm.newPassword) && /[A-Z]/.test(passForm.newPassword)) s++
  if (/\d/.test(passForm.newPassword)) s++
  if (/[^a-zA-Z0-9]/.test(passForm.newPassword)) s++
  return s
})
const passStrengthPct = computed(() => (passStrength.value / 5) * 100)
const passStrengthText = computed(() => ['', 'Bardzo słabe', 'Słabe', 'Średnie', 'Silne', 'Bardzo silne'][passStrength.value] ?? '')
const passStrengthColor = computed(() => ['', '#e57373', '#ffb74d', '#ffd54f', '#81c784', '#4caf50'][passStrength.value] ?? '')

const canChangePass = computed(() =>
  passForm.currentPassword.length > 0 &&
  passForm.newPassword.length >= 8 &&
  /[a-zA-Z]/.test(passForm.newPassword) &&
  /[0-9]/.test(passForm.newPassword) &&
  passForm.newPassword === passForm.confirmPassword &&
  passForm.newPassword !== passForm.currentPassword
)

async function loadSalonData() {
  try {
    const data = await salonApi.get()
    general.name = data.name ?? general.name
    general.phone = data.phone ?? general.phone
    general.email = data.email ?? general.email
    general.timezone = data.timezone ?? general.timezone
    salon.address = data.address ?? salon.address
    salon.city = data.city ?? salon.city
    salon.zip = data.postalCode ?? salon.zip
    salon.description = data.description ?? salon.description
  } catch { /* use auth store defaults */ }
}

onMounted(() => {
  loadSalonData()
})

const setSection = (id: SettingsSection) => {
  section.value = id
  router.replace({ query: { s: id } })
}

const save = async () => {
  loading.value = true
  saveError.value = ''
  try {
    await salonApi.update({
      name: general.name,
      phone: general.phone || null,
      email: general.email || null,
      timezone: general.timezone,
      address: salon.address || null,
      city: salon.city || null,
      postalCode: salon.zip || null,
      description: salon.description || null,
    })
    saved.value = true
    setTimeout(() => { saved.value = false }, 2000)
  } catch (e) {
    saveError.value = e instanceof ApiError ? e.message : 'Nie udało się zapisać'
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  passError.value = ''
  passSuccess.value = false
  if (passForm.newPassword !== passForm.confirmPassword) {
    passError.value = 'Hasła się nie zgadzają'
    return
  }
  if (passForm.newPassword === passForm.currentPassword) {
    passError.value = 'Nowe hasło nie może być takie samo jak obecne'
    return
  }
  passLoading.value = true
  try {
    await authApi.changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword })
    passSuccess.value = true
    passForm.currentPassword = ''
    passForm.newPassword = ''
    passForm.confirmPassword = ''
    setTimeout(() => { passSuccess.value = false }, 3000)
  } catch (e) {
    passError.value = e instanceof ApiError ? e.message : 'Nie udało się zmienić hasła'
  } finally {
    passLoading.value = false
  }
}

const openDeleteModal = (action: 'suspend' | 'delete') => {
  deleteAction.value = action
  deleteStep.value = 0
  deleteCode.value = ''
  deleteError.value = ''
  deleteModalOpen.value = true
}

const requestCode = async () => {
  deleteLoading.value = true
  deleteError.value = ''
  try {
    await salonApi.requestDeletion()
    deleteStep.value = 1
  } catch (e) {
    deleteError.value = e instanceof ApiError ? e.message : 'Nie udało się wysłać kodu'
  } finally {
    deleteLoading.value = false
  }
}

const confirmDelete = async () => {
  deleteLoading.value = true
  deleteError.value = ''
  try {
    await salonApi.confirmDeletion({ code: deleteCode.value, action: deleteAction.value })
    deleteStep.value = 2
    setTimeout(() => { deleteModalOpen.value = false; auth.logout() }, 2000)
  } catch (e) {
    deleteError.value = e instanceof ApiError ? e.message : 'Nieprawidłowy kod'
  } finally {
    deleteLoading.value = false
  }
}

</script>

<template>
  <div>
    <h2 class="mb-4">Ustawienia</h2>

    <Transition name="fade">
      <div v-if="saved" class="cms-card mb-3" style="border-color: var(--ca); background: rgba(127,179,194,0.08)">
        <span class="cms-accent"><i class="bi-check-circle" /> Zapisano</span>
      </div>
    </Transition>

    <div class="cms-settings-layout">
      <nav class="cms-settings-nav">
        <button
          v-for="s in settingsSections"
          :key="s.id"
          type="button"
          class="cms-settings-nav-link"
          :class="{ active: section === s.id }"
          @click="setSection(s.id)"
        >
          <i :class="s.icon" />
          {{ s.label }}
        </button>
      </nav>

      <div class="cms-card">
        <template v-if="section === 'ogolne'">
          <h3 class="cms-card-title">Ogólne</h3>
          <div class="cms-form-group">
            <label class="cms-form-label">Nazwa salonu</label>
            <input v-model="general.name" type="text" class="cms-form-control" />
          </div>
          <div class="cms-form-group">
            <label class="cms-form-label">Logo</label>
            <button type="button" class="cms-btn cms-btn-outline cms-btn-sm"><i class="bi-upload" /> Upload</button>
          </div>
          <div class="cms-form-row">
            <div class="cms-form-group">
              <label class="cms-form-label">Telefon</label>
              <input v-model="general.phone" type="tel" class="cms-form-control" />
            </div>
            <div class="cms-form-group">
              <label class="cms-form-label">Email</label>
              <input v-model="general.email" type="email" class="cms-form-control" />
            </div>
          </div>
          <div class="cms-form-row">
            <div class="cms-form-group">
              <label class="cms-form-label">Strefa czasowa</label>
              <select v-model="general.timezone" class="cms-form-select">
                <option value="Europe/Warsaw">Europe/Warsaw</option>
                <option value="Europe/Berlin">Europe/Berlin</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Europe/Prague">Europe/Prague</option>
              </select>
            </div>
            <div class="cms-form-group">
              <label class="cms-form-label">Waluta</label>
              <select v-model="general.currency" class="cms-form-select">
                <option value="PLN">PLN</option>
                <option value="EUR">EUR</option>
                <option value="CZK">CZK</option>
              </select>
            </div>
          </div>
        </template>

        <template v-else-if="section === 'salon'">
          <h3 class="cms-card-title">Salon</h3>
          <div class="cms-form-group">
            <label class="cms-form-label">Adres</label>
            <input v-model="salon.address" type="text" class="cms-form-control" />
          </div>
          <div class="cms-form-row">
            <div class="cms-form-group">
              <label class="cms-form-label">Miasto</label>
              <input v-model="salon.city" type="text" class="cms-form-control" />
            </div>
            <div class="cms-form-group">
              <label class="cms-form-label">Kod pocztowy</label>
              <input v-model="salon.zip" type="text" class="cms-form-control" />
            </div>
          </div>
          <div class="cms-form-group">
            <label class="cms-form-label">Google Maps</label>
            <input v-model="salon.mapsUrl" type="url" class="cms-form-control" placeholder="https://maps.google.com/..." />
          </div>
          <div class="cms-form-group">
            <label class="cms-form-label">Opis salonu</label>
            <textarea v-model="salon.description" class="cms-form-textarea" rows="4" />
          </div>
        </template>

        <template v-else-if="section === 'rezerwacje'">
          <h3 class="cms-card-title">Rezerwacje</h3>
          <div class="cms-form-row">
            <div class="cms-form-group">
              <label class="cms-form-label">Minimalny czas przed wizytą</label>
              <select v-model.number="bookings.minBefore" class="cms-form-select">
                <option :value="1">1 godzina</option>
                <option :value="2">2 godziny</option>
                <option :value="4">4 godziny</option>
              </select>
            </div>
            <div class="cms-form-group">
              <label class="cms-form-label">Maksymalnie można rezerwować</label>
              <select v-model.number="bookings.maxDays" class="cms-form-select">
                <option :value="30">30 dni</option>
                <option :value="60">60 dni</option>
                <option :value="90">90 dni</option>
              </select>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center py-3" style="border-bottom: 1px solid var(--c3)">
            <span>Klient może anulować</span>
            <label class="cms-switch"><input v-model="bookings.clientCanCancel" type="checkbox" /><span class="cms-switch-slider" /></label>
          </div>
          <div class="d-flex justify-content-between align-items-center py-3" style="border-bottom: 1px solid var(--c3)">
            <span>Klient może zmienić termin</span>
            <label class="cms-switch"><input v-model="bookings.clientCanReschedule" type="checkbox" /><span class="cms-switch-slider" /></label>
          </div>
          <div class="d-flex justify-content-between align-items-center py-3" style="border-bottom: 1px solid var(--c3)">
            <span>Automatycznie potwierdzaj rezerwacje</span>
            <label class="cms-switch"><input v-model="bookings.autoConfirm" type="checkbox" /><span class="cms-switch-slider" /></label>
          </div>
          <div class="cms-form-group mt-3">
            <label class="cms-form-label">Minimalny czas anulowania</label>
            <select v-model.number="bookings.minCancelHours" class="cms-form-select" style="max-width: 200px">
              <option :value="2">2 godziny</option>
              <option :value="4">4 godziny</option>
              <option :value="24">24 godziny</option>
            </select>
          </div>
        </template>

        <template v-else-if="section === 'powiadomienia'">
          <h3 class="cms-card-title">Powiadomienia</h3>
          <p class="cms-dim small mb-3">EMAIL</p>
          <div class="d-flex justify-content-between align-items-center py-3" style="border-bottom: 1px solid var(--c3)">
            <span>Nowa rezerwacja</span>
            <label class="cms-switch"><input v-model="notifications.emailNew" type="checkbox" /><span class="cms-switch-slider" /></label>
          </div>
          <div class="d-flex justify-content-between align-items-center py-3" style="border-bottom: 1px solid var(--c3)">
            <span>Zmiana terminu</span>
            <label class="cms-switch"><input v-model="notifications.emailChange" type="checkbox" /><span class="cms-switch-slider" /></label>
          </div>
          <div class="d-flex justify-content-between align-items-center py-3" style="border-bottom: 1px solid var(--c3)">
            <span>Anulowanie</span>
            <label class="cms-switch"><input v-model="notifications.emailCancel" type="checkbox" /><span class="cms-switch-slider" /></label>
          </div>
          <div class="d-flex justify-content-between align-items-center py-3" style="border-bottom: 1px solid var(--c3)">
            <span>Przypomnienie 24h przed wizytą</span>
            <label class="cms-switch"><input v-model="notifications.emailReminder24" type="checkbox" /><span class="cms-switch-slider" /></label>
          </div>
        </template>

        <template v-else-if="section === 'konto'">
          <h3 class="cms-card-title">Konto</h3>
          <div class="cms-form-row">
            <div class="cms-form-group">
              <label class="cms-form-label">Imię</label>
              <input v-model="account.firstName" type="text" class="cms-form-control" />
            </div>
            <div class="cms-form-group">
              <label class="cms-form-label">Nazwisko</label>
              <input v-model="account.lastName" type="text" class="cms-form-control" />
            </div>
          </div>
          <div class="cms-form-group">
            <label class="cms-form-label">Email</label>
            <input v-model="account.email" type="email" class="cms-form-control" readonly style="opacity: 0.6" />
            <small class="cms-dim">Email można zmienić kontaktując się z supportem.</small>
          </div>
        </template>

        <template v-else-if="section === 'bezpieczenstwo'">
          <h3 class="cms-card-title">Zmiana hasła</h3>

          <div v-if="passSuccess" class="cms-card mb-3" style="border-color: #4caf50; background: rgba(76,175,80,0.08)">
            <span style="color: #4caf50"><i class="bi-check-circle" /> Hasło zmienione pomyślnie. Użyj nowego hasła przy następnym logowaniu.</span>
          </div>
          <div v-if="passError" class="cms-card mb-3" style="border-color: #e57373; background: rgba(229,115,115,0.08)">
            <span style="color: #e57373"><i class="bi-exclamation-circle" /> {{ passError }}</span>
          </div>

          <div class="cms-form-group">
            <label class="cms-form-label">Obecne hasło</label>
            <div style="position: relative">
              <input v-model="passForm.currentPassword" :type="showCurrent ? 'text' : 'password'" class="cms-form-control" style="padding-right: 40px" />
              <button type="button" @click="showCurrent = !showCurrent" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--cd); cursor: pointer"><i :class="showCurrent ? 'bi-eye-slash' : 'bi-eye'" /></button>
            </div>
          </div>
          <div class="cms-form-row">
            <div class="cms-form-group">
              <label class="cms-form-label">Nowe hasło</label>
              <div style="position: relative">
                <input v-model="passForm.newPassword" :type="showNew ? 'text' : 'password'" class="cms-form-control" style="padding-right: 40px" />
                <button type="button" @click="showNew = !showNew" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--cd); cursor: pointer"><i :class="showNew ? 'bi-eye-slash' : 'bi-eye'" /></button>
              </div>
              <div v-if="passForm.newPassword.length > 0" style="margin-top: 6px">
                <div style="height: 3px; background: var(--c3); border-radius: 2px; overflow: hidden"><div :style="{ width: passStrengthPct + '%', height: '100%', background: passStrengthColor, borderRadius: '2px', transition: 'all 0.3s' }" /></div>
                <small :style="{ color: passStrengthColor }">{{ passStrengthText }}</small>
              </div>
            </div>
            <div class="cms-form-group">
              <label class="cms-form-label">Powtórz hasło</label>
              <input v-model="passForm.confirmPassword" type="password" class="cms-form-control" />
              <small v-if="passForm.confirmPassword && passForm.newPassword !== passForm.confirmPassword" style="color: #e57373">Hasła się nie zgadzają</small>
            </div>
          </div>
          <p v-if="passForm.newPassword && passForm.newPassword === passForm.currentPassword" style="color: #ffb74d; font-size: 0.78rem; margin-top: 4px">
            <i class="bi-exclamation-triangle" /> Nowe hasło nie może być takie samo jak obecne
          </p>
          <button type="button" class="cms-btn cms-btn-cta mt-3" :disabled="!canChangePass || passLoading" @click="changePassword">
            {{ passLoading ? 'Zmienianie...' : 'Zmień hasło' }}
          </button>

          <div class="cms-divider" />
          <h3 class="cms-card-title" style="color: #e57373">Strefa niebezpieczna</h3>
          <p class="cms-dim small mb-3">Te działania wymagają weryfikacji kodem wysłanym na email salonu.</p>
          <div class="d-flex gap-2 flex-wrap">
            <button type="button" class="cms-btn cms-btn-outline cms-btn-sm" @click="openDeleteModal('suspend')">
              <i class="bi-pause-circle" /> Zawieś salon
            </button>
            <button type="button" class="cms-btn cms-btn-danger cms-btn-sm" @click="openDeleteModal('delete')">
              <i class="bi-trash" /> Usuń salon
            </button>
          </div>
        </template>

        <div v-if="saveError" class="mt-3" style="color: #e57373; font-size: 0.82rem"><i class="bi-exclamation-circle" /> {{ saveError }}</div>
        <button v-if="section !== 'bezpieczenstwo'" type="button" class="cms-btn cms-btn-cta mt-4" :disabled="loading" @click="save">
          {{ loading ? 'Zapisywanie...' : 'Zapisz' }}
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="deleteModalOpen" class="logout-overlay" @click.self="deleteModalOpen = false">
        <div class="logout-modal">
          <template v-if="deleteStep === 0">
            <div class="logout-icon" style="color: #e57373"><i :class="deleteAction === 'delete' ? 'bi-trash' : 'bi-pause-circle'" /></div>
            <h3>{{ deleteAction === 'delete' ? 'Usunąć salon?' : 'Zawiesić salon?' }}</h3>
            <p class="logout-desc">
              {{ deleteAction === 'delete'
                ? 'Ta operacja jest nieodwracalna. Na Twój email zostanie wysłany kod weryfikacyjny.'
                : 'Salon zostanie tymczasowo wyłączony. Na Twój email zostanie wysłany kod weryfikacyjny.' }}
            </p>
            <div v-if="deleteError" class="logout-desc" style="color: #e57373">{{ deleteError }}</div>
            <div class="logout-actions">
              <button type="button" class="logout-btn logout-btn-cancel" @click="deleteModalOpen = false">Anuluj</button>
              <button type="button" class="logout-btn logout-btn-confirm" :disabled="deleteLoading" @click="requestCode">
                {{ deleteLoading ? 'Wysyłanie...' : 'Wyślij kod' }}
              </button>
            </div>
          </template>
          <template v-else-if="deleteStep === 1">
            <div class="logout-icon" style="color: #d4a853"><i class="bi-envelope-check" /></div>
            <h3>Wpisz kod weryfikacyjny</h3>
            <p class="logout-desc">Kod wysłaliśmy na email salonu. Wygasa za 10 minut.</p>
            <input v-model="deleteCode" type="text" maxlength="6" class="cms-form-control text-center" style="font-size: 1.4rem; letter-spacing: 8px; max-width: 200px; margin: 0 auto 16px" placeholder="000000" />
            <div v-if="deleteError" class="logout-desc" style="color: #e57373">{{ deleteError }}</div>
            <div class="logout-actions">
              <button type="button" class="logout-btn logout-btn-cancel" @click="deleteModalOpen = false">Anuluj</button>
              <button type="button" class="logout-btn logout-btn-confirm" :disabled="deleteCode.length < 6 || deleteLoading" @click="confirmDelete">
                {{ deleteLoading ? 'Weryfikacja...' : 'Potwierdź' }}
              </button>
            </div>
          </template>
          <template v-else>
            <div class="logout-icon" style="color: #5cb85c"><i class="bi-check-circle" /></div>
            <h3>{{ deleteAction === 'delete' ? 'Salon usunięty' : 'Salon zawieszony' }}</h3>
            <p class="logout-desc">Zostaniesz wylogowany za chwilę.</p>
          </template>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.logout-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 20px; }
.logout-modal { background: #0f181c; border: 1px solid #1a2a30; border-radius: 12px; padding: 32px; max-width: 400px; width: 100%; text-align: center; }
.logout-icon { width: 56px; height: 56px; border-radius: 50%; background: #142024; border: 1px solid #1a2a30; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 1.4rem; }
.logout-modal h3 { font-size: 1.1rem; margin-bottom: 8px; color: #d4dfe3; }
.logout-desc { font-size: 0.82rem; color: #a6bac2; line-height: 1.6; margin-bottom: 24px; }
.logout-actions { display: flex; gap: 10px; }
.logout-btn { flex: 1; padding: 12px; border-radius: 8px; border: none; font-family: inherit; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.logout-btn-cancel { background: #142024; color: #a6bac2; border: 1px solid #1a2a30; }
.logout-btn-cancel:hover { background: #1a2a30; color: #d4dfe3; }
.logout-btn-confirm { background: #e57373; color: #0b1215; }
.logout-btn-confirm:hover { background: #ef9a9a; }
.logout-btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
