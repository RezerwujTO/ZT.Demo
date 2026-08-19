<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { helpFaq, helpTopics } from '@/cms/data/mock'
import { supportApi, ApiError } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const userName = computed(() => auth.user?.firstName ?? auth.user?.email?.split('@')[0] ?? 'Użytkownik')

const activeFaq = ref<number | null>(0)
const submitted = ref(false)
const sending = ref(false)
const sentToEmail = ref('')
const sendError = ref('')

const form = reactive({
  topic: 'kalendarz',
  subject: '',
  message: '',
  email: auth.user?.email ?? '',
})

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const submit = async () => {
  if (!form.subject.trim() || !form.message.trim()) return
  sending.value = true
  sendError.value = ''
  try {
    await supportApi.send({
      topic: form.topic,
      subject: form.subject,
      message: form.message,
      email: form.email,
    })
    sentToEmail.value = form.email
    submitted.value = true
    form.subject = ''
    form.message = ''
    form.topic = 'kalendarz'
  } catch (e) {
    sendError.value = e instanceof ApiError ? e.message : 'Nie udało się wysłać wiadomości. Spróbuj ponownie.'
  } finally {
    sending.value = false
  }
}

const resetForm = () => {
  submitted.value = false
  sendError.value = ''
}
</script>

<template>
  <div>
    <div class="cms-page-head">
      <div>
        <h2 class="mb-1">Pomoc</h2>
        <p class="cms-dim mb-0">Znajdź odpowiedź w FAQ lub zadaj pytanie zespołowi wsparcia</p>
      </div>
    </div>

    <div class="cms-help-layout">
      <div class="cms-card">
        <h3 class="cms-card-title">Najczęściej zadawane pytania</h3>
        <div class="cms-faq-list">
          <div
            v-for="(item, index) in helpFaq"
            :key="index"
            class="cms-faq-item"
            :class="{ open: activeFaq === index }"
          >
            <button type="button" class="cms-faq-question" @click="toggleFaq(index)">
              <span>{{ item.question }}</span>
              <i class="bi" :class="activeFaq === index ? 'bi-dash-lg' : 'bi-plus-lg'" />
            </button>
            <div class="cms-faq-answer" :style="{ maxHeight: activeFaq === index ? '400px' : '0' }">
              <div class="cms-faq-answer-inner">{{ item.answer }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="cms-card">
        <h3 class="cms-card-title">Zadaj pytanie</h3>
        <p class="cms-dim small mb-4">Nie znalazłeś odpowiedzi? Napisz do nas — odpowiadamy zwykle w ciągu 24 godzin.</p>

        <div v-if="submitted" class="cms-help-success">
          <i class="bi-check-circle-fill" />
          <div>
            <strong>Wiadomość wysłana</strong>
            <p class="cms-dim small mb-0 mt-1">Dziękujemy, {{ userName }}. Odpowiemy na {{ sentToEmail }}.</p>
          </div>
          <button type="button" class="cms-btn cms-btn-outline cms-btn-sm mt-3" @click="resetForm">Wyślij kolejne pytanie</button>
        </div>

        <form v-else @submit.prevent="submit">
          <div class="cms-form-group">
            <label class="cms-form-label">Kategoria</label>
            <select v-model="form.topic" class="cms-form-select">
              <option v-for="t in helpTopics" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </div>
          <div class="cms-form-group">
            <label class="cms-form-label">Temat</label>
            <input v-model="form.subject" type="text" class="cms-form-control" placeholder="Krótki opis problemu" required />
          </div>
          <div class="cms-form-group">
            <label class="cms-form-label">Wiadomość</label>
            <textarea v-model="form.message" class="cms-form-textarea" rows="5" placeholder="Opisz szczegółowo swój problem lub pytanie..." required />
          </div>
          <div class="cms-form-group">
            <label class="cms-form-label">Email do odpowiedzi</label>
            <input v-model="form.email" type="email" class="cms-form-control" required />
          </div>
          <button type="submit" class="cms-btn cms-btn-cta" :disabled="sending">
            <template v-if="sending">Wysyłanie...</template>
            <template v-else><i class="bi-send" /> Wyślij pytanie</template>
          </button>
          <p v-if="sendError" class="cms-dim small mt-2" style="color: #c2797f">{{ sendError }}</p>
        </form>
      </div>
    </div>
  </div>
</template>
