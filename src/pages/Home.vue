<template>
  <div class="app-wrapper">
    <a href="#main-content" class="skip-link">Przejdź do treści głównej</a>

    <div v-if="isNavOpen" class="nav-overlay" @click="isNavOpen = false" aria-hidden="true"></div>
    <nav class="site-nav fixed-top" :class="{ 'site-nav-scrolled': isScrolled || isNavOpen }" role="navigation" aria-label="Nawigacja główna">
      <div class="container nav-container">
        <a class="site-nav-brand" href="#" @click.prevent="scrollToSection('#hero')" aria-label="zarezerwujTO — strona główna">
          <i class="bi-calendar2-check brand-icon" aria-hidden="true"></i>
          <span class="brand-text">ZAREZERWUJ<span class="brand-accent">TO</span></span>
        </a>

        <button class="nav-toggler" :class="{ open: isNavOpen }" @click="toggleNav" :aria-expanded="isNavOpen" aria-controls="main-nav" aria-label="Menu nawigacji">
          <span></span><span></span><span></span>
        </button>

        <div id="main-nav" class="nav-dropdown" :class="{ open: isNavOpen }" role="menubar">
          <ul class="nav-list">
            <li v-for="item in navItems" :key="item.href" role="none">
              <a class="nav-link" :href="item.href" :class="{ active: activeSection === item.href }" :aria-current="activeSection === item.href ? 'true' : undefined" role="menuitem" @click.prevent="scrollToSection(item.href)">{{ item.label }}</a>
            </li>
          </ul>
          <div class="nav-actions">
            <router-link to="/auth" class="btn btn-outline btn-sm" @click="isNavOpen = false">
              <i class="bi-person-lock me-1" aria-hidden="true"></i>Panel salonu
            </router-link>
            <a class="btn btn-cta btn-sm" href="#booking" @click.prevent="scrollToSection('#booking')">
              <i class="bi-calendar-check me-1" aria-hidden="true"></i>Zarezerwuj
            </a>
          </div>
        </div>
      </div>
    </nav>

    <main id="main-content">
    <section id="hero" class="hero-section">
      <div class="container">
        <div class="row align-items-center hero-row">
          <div class="col-lg-6">
            <div class="hero-content">
              <div class="hero-overline mb-3">
              </div>

              <h1 class="hero-title mb-4">
                Znajdź salon.<br>Zarezerwuj wizytę.
              </h1>

              <p class="hero-desc mb-5">
                Jedna platforma dla barberów, fryzjerów, salonów beauty i kosmetyczek. Rezerwuj online albo zarządzaj swoim salonem.
              </p>
              <div class="hero-actions">
                <a class="btn btn-cta btn-lg" href="#booking" @click.prevent="scrollToSection('#booking')">
                  <i class="bi-calendar-plus me-2"></i>Umów wizytę
                </a>
                <a class="btn btn-ghost btn-lg" href="#how-it-works" @click.prevent="scrollToSection('#how-it-works')">
                  Jak to działa
                </a>
              </div>

              <div class="hero-metrics">
                <div v-for="stat in heroStats" :key="stat.label" class="metric">
                  <div class="metric-val">{{ stat.value }}</div>
                  <div class="metric-lbl">{{ stat.label }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-5 offset-lg-1">
            <div class="hero-visual">
              <div class="visual-grid">
                <div class="vis-card vis-side vis-s1" aria-hidden="true">
                  <div class="vis-notif">
                    <div class="vis-notif-icon"><i class="bi-check-circle-fill"></i></div>
                    <div>
                      <div class="vis-notif-title">Nowa rezerwacja</div>
                      <div class="vis-notif-sub">Piątek, 14:30 — Koloryzacja</div>
                    </div>
                  </div>
                </div>

                <div class="vis-card vis-side vis-s2">
                  <div class="vis-notif">
                    <div class="vis-notif-icon star"><i class="bi-star-fill"></i></div>
                    <div>
                      <div class="vis-notif-title">Nowa opinia</div>
                      <div class="vis-notif-sub">⭐ 5.0 — „Rewelacyjny salon!"</div>
                    </div>
                  </div>
                </div>

                <div class="vis-card vis-side vis-s3">
                  <div class="vis-notif">
                    <div class="vis-notif-icon client"><i class="bi-person-plus-fill"></i></div>
                    <div>
                      <div class="vis-notif-title">Nowy klient</div>
                      <div class="vis-notif-sub">Kinga W. — pierwszy raz</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="sec bg-alt">
      <div class="container">
        <div class="role-tabs mb-5">
          <button class="role-tab" :class="{ active: howItWorksRole === 'client' }" @click="howItWorksRole = 'client'">
            <i class="bi-person me-2"></i>Dla klientów
          </button>
          <button class="role-tab" :class="{ active: howItWorksRole === 'barber' }" @click="howItWorksRole = 'barber'">
            <i class="bi-scissors me-2"></i>Dla salonów
          </button>
        </div>

        <transition name="fade" mode="out-in">
          <div v-if="howItWorksRole === 'client'" key="client-steps">
            <div class="text-center mb-5">
              <div class="sec-overline mb-2">DLA KLIENTÓW</div>
              <h2 class="sec-heading">Rezerwacja w 3 krokach</h2>
              <p class="sec-desc mx-auto">Znajdź specjalistę, wybierz usługę i zarezerwuj — bez dzwonienia.</p>
            </div>
            <div class="row g-4">
              <div v-for="(step, i) in clientSteps" :key="step.title" class="col-lg-4">
                <div class="card-base step-card h-100">
                  <div class="step-num">{{ String(i + 1).padStart(2, '0') }}</div>
                  <div class="step-ico mb-4"><i :class="step.icon" aria-hidden="true"></i></div>
                  <h4 class="mb-3">{{ step.title }}</h4>
                  <p class="dim mb-0">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-else key="barber-steps">
            <div class="text-center mb-5">
              <div class="sec-overline mb-2">DLA SALONÓW</div>
              <h2 class="sec-heading">Twój salon online</h2>
              <p class="sec-desc mx-auto">Zgłoś salon, skonfiguruj profil i zacznij przyjmować rezerwacje.</p>
            </div>
            <div class="row g-4">
              <div v-for="(step, i) in barberSteps" :key="step.title" class="col-lg-4">
                <div class="card-base step-card h-100">
                  <div class="step-num">{{ String(i + 1).padStart(2, '0') }}</div>
                  <div class="step-ico mb-4"><i :class="step.icon" aria-hidden="true"></i></div>
                  <h4 class="mb-3">{{ step.title }}</h4>
                  <p class="dim mb-0">{{ step.description }}</p>
                </div>
              </div>
            </div>
            <div class="text-center mt-5">
              <router-link to="/licencja" class="btn btn-cta btn-lg px-5">
                <i class="bi-rocket-takeoff me-2"></i>Dołącz ze swoim salonem
              </router-link>
            </div>
          </div>
        </transition>
      </div>
    </section>

    <section id="features" class="sec">
      <div class="container">
        <div class="text-center mb-5">
          <div class="sec-overline mb-2">FUNKCJE PLATFORMY</div>
          <h2 class="sec-heading">Wszystko czego potrzebujesz</h2>
        </div>
        <div class="row g-4">
          <div v-for="feat in platformFeatures" :key="feat.title" class="col-lg-4 col-md-6">
            <div class="card-base feature-card h-100">
              <div class="feat-ico mb-3"><i :class="feat.icon" aria-hidden="true"></i></div>
              <h5 class="mb-2">{{ feat.title }}</h5>
              <p class="dim small mb-2">{{ feat.description }}</p>
              <span class="feat-badge" :class="'badge-' + feat.forWhom">
                {{ feat.forWhom === 'both' ? 'Salon + Klient' : feat.forWhom === 'barber' ? 'Dla salonu' : 'Dla klienta' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="barbers" class="sec bg-alt">
      <div class="container">
        <div class="text-center mb-5">
          <div class="sec-overline mb-2">SPECJALIŚCI</div>
          <h2 class="sec-heading">Barberzy, fryzjerzy i kosmetyczki w Twojej okolicy</h2>
        </div>

        <form class="search-bar mb-4" role="search" aria-label="Szukaj specjalisty" @submit.prevent="runSearch">
          <div class="row g-3 align-items-end">
            <div class="col-md-5">
              <label class="form-label fw-semibold small">Miasto, salon lub specjalista</label>
              <div class="input-icon-wrap">
                <i class="bi-geo-alt input-ico"></i>
                <input v-model="searchCity" type="text" class="form-control form-control-lg" placeholder="np. Warszawa, Studio Vibe, Julia" />
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold small">Usługa</label>
              <select v-model="searchService" class="form-select form-select-lg">
                <option value="">Wszystkie</option>
                <option v-for="s in services" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div class="col-md-3">
              <button type="submit" class="btn btn-cta btn-lg w-100"><i class="bi-search me-2"></i>Szukaj</button>
            </div>
          </div>
        </form>

        <div class="search-summary mb-4">
          <span class="dim small">
            {{ filteredBarbers.length }} {{ resultsLabel }}<span v-if="hasSearch"> dla podanych filtrów</span>
          </span>
          <button v-if="hasSearch" type="button" class="btn btn-outline btn-sm" @click="clearSearch">
            <i class="bi-x-lg me-1"></i>Wyczyść filtry
          </button>
        </div>

        <div class="row g-4">
          <div v-for="barber in filteredBarbers" :key="barber.id" class="col-lg-3 col-md-6">
            <div class="card-base barber-card h-100" :class="{ selected: selectedBarber?.id === barber.id }" @click="selectBarber(barber)">
              <div class="barber-top">
                <div class="barber-ava" aria-hidden="true"><i class="bi-person-fill"></i></div>
                <div class="barber-status" :class="barber.available ? 'on' : 'off'">{{ barber.available ? 'Dostępny' : 'Zajęty' }}</div>
              </div>
              <div class="barber-body">
                <h5 class="mb-1">{{ barber.name }}</h5>
                <p class="accent-text small mb-1">{{ barber.salonName }}</p>
                <p class="dim small mb-2"><i class="bi-geo-alt me-1"></i>{{ barber.city }}</p>
                <div class="d-flex align-items-center justify-content-center gap-1 mb-3">
                  <i class="bi-star-fill accent-text small"></i>
                  <span class="small">{{ barber.rating }}</span>
                  <span class="dim small">({{ barber.reviews }})</span>
                </div>
                <button class="btn btn-sm w-100" :class="selectedBarber?.id === barber.id ? 'btn-cta' : 'btn-outline'" @click.stop="selectBarberAndScroll(barber)">
                  {{ selectedBarber?.id === barber.id ? 'Wybrany' : 'Zarezerwuj' }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="!filteredBarbers.length" class="col-12">
            <div class="card-base search-empty">
              <i class="bi-search"></i>
              <h5 class="mb-2">Brak wyników</h5>
              <p class="dim mb-4">Nie znaleźliśmy specjalisty dla wybranych filtrów. Spróbuj innej frazy lub usługi.</p>
              <button type="button" class="btn btn-cta" @click="clearSearch"><i class="bi-arrow-counterclockwise me-2"></i>Pokaż wszystkich</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="services" class="sec">
      <div class="container">
        <div class="text-center mb-5">
          <div class="sec-overline mb-2">OFERTA</div>
          <h2 class="sec-heading">Popularne usługi</h2>
        </div>
        <div class="row g-4">
          <div v-for="service in services" :key="service.id" class="col-lg-4 col-md-6">
            <div class="card-base service-card h-100" :class="{ selected: selectedService?.id === service.id }" @click="selectService(service)">
              <div class="svc-ico mb-4"><i :class="service.icon"></i></div>
              <h5 class="mb-2">{{ service.name }}</h5>
              <p class="dim small mb-3">{{ service.description }}</p>
              <div class="d-flex justify-content-between align-items-center mt-auto">
                <span class="svc-price">od {{ service.price }} zł</span>
                <span class="dim small"><i class="bi-clock me-1"></i>{{ service.duration }} min</span>
              </div>
              <button class="btn btn-sm w-100 mt-3" :class="selectedService?.id === service.id ? 'btn-cta' : 'btn-outline'" @click.stop="selectServiceAndScroll(service)">
                {{ selectedService?.id === service.id ? 'Wybrana' : 'Wybierz' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="booking" class="sec bg-alt">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="booking-wrap">
              <div class="row g-0">
                <div class="col-lg-5">
                  <div class="booking-side h-100">
                    <h3 class="mb-4"><i class="bi-calendar-check me-2 accent-text"></i>Twoja rezerwacja</h3>
                    <div class="booking-summary">
                      <div v-for="s in summaryItems" :key="s.label" class="sum-row" :class="{ done: s.done }">
                        <div class="sum-icon"><i :class="s.done ? 'bi-check-circle-fill' : 'bi-circle'"></i></div>
                        <div>
                          <div class="sum-label">{{ s.label }}</div>
                          <div class="sum-val">{{ s.value }}</div>
                        </div>
                      </div>
                    </div>
                    <div v-if="selectedBarber && barberWorkingHours" class="working-hours-box mt-3">
                      <div class="fw-semibold small mb-2"><i class="bi-clock me-1 accent-text"></i>Grafik specjalisty</div>
                      <div v-for="(entries, day) in barberWorkingHours" :key="day" class="wh-row">
                        <span class="wh-day">{{ day }}</span>
                        <span v-if="entries.length && entries[0].open" class="wh-time">
                          {{ entries[0].from }} – {{ entries[0].to }}
                          <span v-if="entries[0].breaks.length" class="wh-break">przerwa {{ entries[0].breaks[0].from }}–{{ entries[0].breaks[0].to }}</span>
                        </span>
                        <span v-else class="wh-closed">Nieczynne</span>
                      </div>
                    </div>

                    <div v-if="selectedService" class="total-box mt-auto">
                      <div class="d-flex justify-content-between align-items-center">
                        <span>Łącznie:</span>
                        <strong class="fs-3">{{ selectedService.price }} zł</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-7">
                  <div class="booking-main">
                    <div class="bk-steps mb-4">
                      <div v-for="(bs, idx) in bookingSteps" :key="bs" class="bk-step" :class="{ active: currentBookingStep === idx, done: currentBookingStep > idx }">
                        <div class="bk-dot">
                          <i v-if="currentBookingStep > idx" class="bi-check-lg"></i>
                          <span v-else>{{ idx + 1 }}</span>
                        </div>
                        <span class="bk-label d-none d-md-inline">{{ bs }}</span>
                      </div>
                    </div>

                    <form v-if="!bookingConfirmed" @submit.prevent="submitBooking" aria-label="Formularz rezerwacji">
                      <div v-show="currentBookingStep === 0">
                        <h4 class="mb-4">Wybierz termin</h4>
                        <div class="mb-4">
                          <label class="form-label fw-semibold">Data</label>
                          <input type="date" v-model="bookingForm.date" class="form-control form-control-lg" :min="todayDate" required />
                        </div>
                        <div class="mb-4">
                          <label class="form-label fw-semibold">Godzina</label>
                          <div v-if="!selectedService" class="dim small mb-2">Najpierw wybierz usługę w sekcji Oferta.</div>
                          <div v-else-if="slotsLoading" class="dim small mb-2">Ładowanie terminów...</div>
                          <div v-else-if="!availableTimeSlots.length" class="dim small mb-2">Brak wolnych terminów w tym dniu.</div>
                          <div class="time-grid" role="radiogroup" aria-label="Dostępne godziny">
                            <button v-for="slot in availableTimeSlots" :key="slot" type="button" class="time-btn" role="radio" :aria-checked="bookingForm.time === slot" :class="{ active: bookingForm.time === slot }" @click="bookingForm.time = slot">{{ slot }}</button>
                          </div>
                        </div>
                        <button type="button" class="btn btn-cta btn-lg w-100" :disabled="!bookingForm.date || !bookingForm.time" @click="currentBookingStep = 1">Dalej <i class="bi-arrow-right ms-2"></i></button>
                      </div>

                      <div v-show="currentBookingStep === 1">
                        <h4 class="mb-4">Twoje dane</h4>
                        <div class="row g-3">
                          <div class="col-md-6">
                            <label class="form-label fw-semibold">Imię i nazwisko</label>
                            <input type="text" v-model="bookingForm.name" class="form-control form-control-lg" placeholder="Jan Kowalski" required />
                          </div>
                          <div class="col-md-6">
                            <label class="form-label fw-semibold">Telefon</label>
                            <input type="tel" v-model="bookingForm.phone" class="form-control form-control-lg" placeholder="+48 123 456 789" required />
                          </div>
                          <div class="col-12">
                            <label class="form-label fw-semibold">Email</label>
                            <input type="email" v-model="bookingForm.email" class="form-control form-control-lg" placeholder="jan@email.com" required />
                          </div>
                          <div class="col-12">
                            <label class="form-label fw-semibold">Uwagi</label>
                            <textarea v-model="bookingForm.notes" class="form-control" rows="3" placeholder="Opcjonalnie..."></textarea>
                          </div>
                        </div>
                        <div class="d-flex gap-3 mt-4">
                          <button type="button" class="btn btn-outline btn-lg flex-fill" @click="currentBookingStep = 0"><i class="bi-arrow-left me-2"></i>Wstecz</button>
                          <button type="button" class="btn btn-cta btn-lg flex-fill" :disabled="!bookingForm.name || !bookingForm.phone || !bookingForm.email" @click="currentBookingStep = 2">Dalej <i class="bi-arrow-right ms-2"></i></button>
                        </div>
                      </div>

                      <div v-show="currentBookingStep === 2">
                        <h4 class="mb-4">Potwierdzenie</h4>
                        <div class="confirm-box mb-4">
                          <div class="row g-3">
                            <div class="col-6"><div class="cfm-label">Specjalista</div><div class="cfm-val">{{ selectedBarber?.name || '—' }}</div></div>
                            <div class="col-6"><div class="cfm-label">Usługa</div><div class="cfm-val">{{ selectedService?.name || '—' }}</div></div>
                            <div class="col-6"><div class="cfm-label">Data</div><div class="cfm-val">{{ formatDate(bookingForm.date) }}</div></div>
                            <div class="col-6"><div class="cfm-label">Godzina</div><div class="cfm-val">{{ bookingForm.time }}</div></div>
                            <div class="col-6"><div class="cfm-label">Klient</div><div class="cfm-val">{{ bookingForm.name }}</div></div>
                            <div class="col-6"><div class="cfm-label">Telefon</div><div class="cfm-val">{{ bookingForm.phone }}</div></div>
                          </div>
                        </div>
                        <div class="d-flex gap-3">
                          <button type="button" class="btn btn-outline btn-lg flex-fill" @click="currentBookingStep = 1"><i class="bi-arrow-left me-2"></i>Wstecz</button>
                          <button type="submit" class="btn btn-cta btn-lg flex-fill" :disabled="bookingLoading">
                            <i class="bi-check-circle me-2"></i>{{ bookingLoading ? 'Rezerwowanie...' : 'Potwierdź' }}
                          </button>
                        </div>
                        <div v-if="bookingError" class="alert alert-danger mt-3 mb-0" role="alert" aria-live="assertive">{{ bookingError }}</div>
                      </div>
                    </form>

                    <div v-else class="booking-done text-center" role="status" aria-live="polite">
                      <div class="done-icon mb-4"><i class="bi-check-circle-fill"></i></div>
                      <h3 class="mb-3">Rezerwacja potwierdzona!</h3>
                      <p class="dim mb-2">{{ confirmedSummary }}</p>
                      <p class="dim mb-4">Potwierdzenie wysłane na {{ bookingForm.email }}.</p>
                      <button class="btn btn-cta btn-lg" @click="resetBooking"><i class="bi-plus-circle me-2"></i>Nowa rezerwacja</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="reviews" class="sec">
      <div class="container">
        <div class="text-center mb-5">
          <div class="sec-overline mb-2">OPINIE</div>
          <h2 class="sec-heading">Co mówią użytkownicy</h2>
        </div>
        <div class="row g-4">
          <div v-for="review in reviews" :key="review.name" class="col-lg-4 col-md-6">
            <div class="card-base review-card h-100">
              <div class="review-badge" :class="'badge-' + review.type">{{ review.type === 'barber' ? 'Salon' : 'Klient' }}</div>
              <div class="d-flex gap-1 mb-3" :aria-label="review.rating + ' na 5 gwiazdek'">
                <i v-for="n in review.rating" :key="n" class="bi-star-fill accent-text small" aria-hidden="true"></i>
              </div>
              <p class="mb-4">"{{ review.text }}"</p>
              <div class="d-flex align-items-center gap-3 mt-auto">
                <div class="rev-ava">{{ review.name.charAt(0) }}</div>
                <div>
                  <strong>{{ review.name }}</strong>
                  <div class="dim small">{{ review.date }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec bg-alt">
      <div class="container">
        <div class="cta-banner">
          <div class="row align-items-center">
            <div class="col-lg-7">
              <div class="sec-overline mb-2">DLA SALONÓW</div>
              <h2 class="sec-heading mb-3">Rozwijaj swój salon z zarezerwujTO</h2>
              <p class="dim mb-0">Barber, fryzjer, gabinet kosmetyczny lub studio beauty — przyjmuj rezerwacje, zarządzaj kalendarzem i buduj bazę klientów.</p>
            </div>
            <div class="col-lg-5 text-lg-end mt-4 mt-lg-0">
              <router-link to="/licencja" class="btn btn-cta btn-lg px-5">
                <i class="bi-rocket-takeoff me-2"></i>Zapytaj o licencję
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="faq" class="sec">
      <div class="container">
        <div class="text-center mb-5">
          <div class="sec-overline mb-2">FAQ</div>
          <h2 class="sec-heading">Najczęściej zadawane pytania</h2>
          <p class="sec-desc mx-auto">Odpowiedzi na pytania, które pojawiają się najczęściej wśród klientów i salonów.</p>
        </div>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="faq-list" role="list">
              <div v-for="(item, index) in faqItems" :key="index" class="faq-item" :class="{ open: activeFaq === index }" role="listitem">
                <button class="faq-question" @click="toggleFaq(index)" :aria-expanded="activeFaq === index" :aria-controls="'faq-answer-' + index">
                  <span>{{ item.question }}</span>
                  <i class="bi faq-chevron" :class="activeFaq === index ? 'bi-dash-lg' : 'bi-plus-lg'" aria-hidden="true"></i>
                </button>
                <div :id="'faq-answer-' + index" class="faq-answer" role="region" :aria-hidden="activeFaq !== index" :style="{ maxHeight: activeFaq === index ? '600px' : '0' }">
                  <div class="faq-answer-inner">{{ item.answer }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    </main>

    <footer class="app-footer" role="contentinfo">
      <div class="container">
        <div class="row g-4 mb-5">
          <div class="col-lg-4">
            <div class="d-flex align-items-center mb-3">
              <i class="bi-calendar2-check me-2 brand-icon accent-text"></i>
              <span class="brand-text fs-4">ZAREZERWUJ<span class="brand-accent">TO</span></span>
            </div>
            <p class="dim">Platforma łącząca barberów, fryzjerów, salony beauty i kosmetyczki z klientami w całej Polsce.</p>
          </div>
          <div class="col-lg-2 col-md-4">
            <h6 class="ft-heading">Dla klientów</h6>
            <ul class="ft-links">
              <li><a href="#barbers" @click.prevent="scrollToSection('#barbers')">Znajdź salon</a></li>
              <li><a href="#services" @click.prevent="scrollToSection('#services')">Usługi</a></li>
              <li><a href="#booking" @click.prevent="scrollToSection('#booking')">Rezerwacja</a></li>
            </ul>
          </div>
          <div class="col-lg-3 col-md-4">
            <h6 class="ft-heading">Dla salonów</h6>
            <ul class="ft-links">
              <li><router-link to="/auth">Panel salonu</router-link></li>
              <li><router-link to="/licencja">Licencja CMS</router-link></li>
              <li><a href="#features" @click.prevent="scrollToSection('#features')">Funkcje</a></li>
            </ul>
          </div>
          <div class="col-lg-3 col-md-4">
            <h6 class="ft-heading">Dokumenty</h6>
            <ul class="ft-links ft-links-legal">
              <li><router-link to="/regulamin">Regulamin</router-link></li>
              <li><router-link to="/polityka-prywatnosci">Polityka prywatności</router-link></li>
              <li><router-link to="/polityka-serwisu">Polityka serwisu</router-link></li>
              <li><router-link to="/licencja">Kontakt w sprawie licencji</router-link></li>
            </ul>
          </div>
        </div>
        <div class="ft-bottom">
          <div class="row align-items-center">
            <div class="col-md-6"><p class="dim small mb-0">© 2026 zarezerwujTO</p></div>
            <div class="col-md-6 text-md-end">
              <a href="#hero" class="back-top" @click.prevent="scrollToSection('#hero')"><i class="bi-arrow-up-circle-fill me-1"></i>Na górę</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { publicApi, buildStartAt, ApiError, type PublicSalon, type PublicBarberWithSalon, type PublicBarberSchedule } from '@/lib/api'
import { DEMO_SALON_SLUG } from '@/demo/dataset'

interface NavItem { href: string; label: string }
interface HeroStat { value: string; label: string }
interface Step { icon: string; title: string; description: string }
interface LandingBarber { id: string; name: string; specialty: string; salonName: string; rating: number; reviews: number; available: boolean; city: string; serviceIds: string[] }
interface LandingService { id: string; name: string; icon: string; description: string; price: number; duration: number }
interface BookingFormData { date: string; time: string; name: string; phone: string; email: string; notes: string }
interface Review { name: string; rating: number; text: string; date: string; type: 'client' | 'barber' }
interface SummaryItem { label: string; value: string; done: boolean }
interface Feature { icon: string; title: string; description: string; forWhom: 'client' | 'barber' | 'both' }
interface FaqItem { question: string; answer: string }

const SERVICE_ICONS: Record<string, string> = {
  'Strzyżenie męskie': 'bi-scissors',
  'Broda i wąsy': 'bi-brush',
  'Combo: włosy i broda': 'bi-stars',
  'Skin fade': 'bi-layers',
  'Strzyżenie klasyczne': 'bi-scissors',
  'Golenie brzytwą': 'bi-droplet-half',
  'Strzyżenie damskie': 'bi-scissors',
  'Koloryzacja': 'bi-palette',
  'Baleyage i sombre': 'bi-palette2',
  'Keratynowe prostowanie': 'bi-magic',
  'Modelowanie i upięcie': 'bi-wind',
  'Strzyżenie dziecięce': 'bi-emoji-smile',
  'Oczyszczanie wodorowe': 'bi-droplet',
  'Peeling kwasami': 'bi-stars',
  'Mikrodermabrazja': 'bi-gem',
  'Mezoterapia igłowa': 'bi-eyedropper',
  'Depilacja woskiem': 'bi-flower1',
  'Makijaż okolicznościowy': 'bi-brush-fill',
  'Manicure hybrydowy': 'bi-hand-index-thumb',
  'Pedicure kosmetyczny': 'bi-heart-pulse',
  'Przedłużanie paznokci': 'bi-gem',
  'Przedłużanie rzęs': 'bi-eye',
  'Lifting rzęs': 'bi-eye-fill',
  'Laminacja brwi': 'bi-brush',
}

const salonSlug = DEMO_SALON_SLUG

export default defineComponent({
  name: 'HomePage',
  setup() {
    const isScrolled = ref(false)
    const isNavOpen = ref(false)
    const activeSection = ref('#hero')
    const selectedBarber = ref<LandingBarber | null>(null)
    const selectedService = ref<LandingService | null>(null)
    const currentBookingStep = ref(0)
    const bookingConfirmed = ref(false)
    const confirmedSummary = ref('')
    const bookingLoading = ref(false)
    const bookingError = ref('')
    const howItWorksRole = ref<'client' | 'barber'>('client')
    const searchCity = ref('')
    const searchService = ref('')
    const activeFaq = ref<number | null>(null)
    const salon = ref<PublicSalon | null>(null)
    const apiServices = ref<{ id: string; name: string; description: string | null; duration: number; price: number }[]>([])
    const apiBarbers = ref<PublicBarberWithSalon[]>([])
    const barberSchedules = ref<Map<string, PublicBarberSchedule>>(new Map())
    const availableTimeSlots = ref<string[]>([])
    const slotsLoading = ref(false)
    const salonLoadError = ref('')

    const bookingForm = reactive<BookingFormData>({ date: '', time: '', name: '', phone: '', email: '', notes: '' })

    const miniChartData = [35, 55, 45, 70, 90, 60, 80, 50, 75, 40, 65, 85]

    const navItems: NavItem[] = [
      { href: '#how-it-works', label: 'Jak to działa' },
      { href: '#features', label: 'Funkcje' },
      { href: '#barbers', label: 'Specjaliści' },
      { href: '#services', label: 'Usługi' },
      { href: '#reviews', label: 'Opinie' },
      { href: '#faq', label: 'FAQ' }
    ]

    const heroStats: HeroStat[] = [
      { value: '5 200+', label: 'Salonów' },
      { value: '120k+', label: 'Rezerwacji' },
      { value: '48', label: 'Miast' },
      { value: '4.9', label: 'Ocena' }
    ]

    const clientSteps: Step[] = [
      { icon: 'bi-search', title: 'Znajdź specjalistę', description: 'Barber, fryzjer, kosmetyczka lub studio beauty — filtruj po mieście i usłudze.' },
      { icon: 'bi-scissors', title: 'Wybierz usługę', description: 'Strzyżenie, koloryzacja, zabieg na twarz, manicure — porównaj ceny i czas.' },
      { icon: 'bi-calendar-check', title: 'Zarezerwuj', description: 'Wybierz wolny termin. Bez dzwonienia.' }
    ]

    const barberSteps: Step[] = [
      { icon: 'bi-person-plus', title: 'Zgłoś salon', description: 'Barbershop, salon fryzjerski, gabinet kosmetyczny lub studio beauty.' },
      { icon: 'bi-calendar-week', title: 'Ustaw dostępność', description: 'Godziny pracy, przerwy i dni wolne dla całego zespołu.' },
      { icon: 'bi-people', title: 'Przyjmuj klientów', description: 'Klienci rezerwują, Ty zarządzasz wszystkim z panelu.' }
    ]

    const platformFeatures: Feature[] = [
      { icon: 'bi-calendar-week', title: 'Kalendarz zespołu', description: 'Osobny grafik dla barbera, fryzjerki i kosmetolożki w jednym widoku.', forWhom: 'barber' },
      { icon: 'bi-people-fill', title: 'Baza klientów', description: 'Historia wizyt, preferencje i notatki zabiegowe.', forWhom: 'barber' },
      { icon: 'bi-bell', title: 'Powiadomienia', description: 'SMS i email z przypomnieniem o wizycie.', forWhom: 'both' },
      { icon: 'bi-graph-up-arrow', title: 'Statystyki', description: 'Przychody, obłożenie i popularność usług.', forWhom: 'barber' },
      { icon: 'bi-star', title: 'Opinie', description: 'System ocen budujący zaufanie do salonu.', forWhom: 'both' },
      { icon: 'bi-geo-alt', title: 'Wyszukiwarka', description: 'Znajdź salon po lokalizacji i rodzaju usługi.', forWhom: 'client' }
    ]

    const barbers = computed<LandingBarber[]>(() =>
      apiBarbers.value.map(b => ({
        id: b.id,
        name: [b.firstName, b.lastName].filter(Boolean).join(' '),
        specialty: b.bio ?? 'Specjalista',
        salonName: b.salon.name,
        rating: b.rating ?? 4.9,
        reviews: b.reviewsCount ?? 0,
        available: true,
        city: b.salon.city ?? '',
        serviceIds: [...b.serviceIds],
      })),
    )

    const services = computed<LandingService[]>(() =>
      apiServices.value.map(s => ({
        id: s.id,
        name: s.name,
        icon: SERVICE_ICONS[s.name] ?? 'bi-scissors',
        description: s.description ?? '',
        price: s.price,
        duration: s.duration,
      })),
    )

    const bookingSteps = ['Termin', 'Dane', 'Potwierdzenie']

    const reviews = ref<Review[]>([])

    async function loadReviews() {
      try {
        const data = await publicApi.reviews()
        reviews.value = data.map(r => ({
          ...r,
          type: r.type as 'client' | 'barber',
          date: new Date(r.date).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' }),
        }))
      } catch {
        reviews.value = []
      }
    }

    const faqItems: FaqItem[] = [
      { question: 'Czy korzystanie z zarezerwujTO jest darmowe dla klientów?', answer: 'Tak, platforma jest całkowicie bezpłatna dla klientów. Możesz wyszukiwać barberów, fryzjerów, kosmetyczki i salony beauty, przeglądać opinie oraz rezerwować wizyty bez żadnych opłat.' },
      { question: 'Jakie salony korzystają z zarezerwujTO?', answer: 'Barbershopy, salony fryzjerskie, gabinety kosmetyczne, studia paznokci i rzęs oraz salony beauty łączące kilka usług. Każdy salon ustawia własne usługi, czasy trwania i ceny.' },
      { question: 'Jak mogę odwołać lub zmienić rezerwację?', answer: 'Możesz odwołać lub zmienić rezerwację klikając w link z potwierdzenia email lub SMS. Zalecamy odwoływanie wizyt z co najmniej 2-godzinnym wyprzedzeniem, aby salon mógł przyjąć innego klienta.' },
      { question: 'Czy muszę zakładać konto, żeby zarezerwować wizytę?', answer: 'Nie, rezerwacja jest możliwa bez zakładania konta. Wystarczy podać imię, numer telefonu i adres email. Konto jest wymagane tylko dla salonów, które chcą zarządzać kalendarzem.' },
      { question: 'Czy w jednym salonie może pracować kilku specjalistów z różnych branż?', answer: 'Tak. W jednym koncie możesz prowadzić grafik barbera, fryzjerki, kosmetolożki i stylistki paznokci. Każda osoba ma własne godziny pracy, przerwy i przypisane usługi.' },
      { question: 'Czy otrzymam przypomnienie o wizycie?', answer: 'Tak, system automatycznie wysyła przypomnienia SMS i email na 24 godziny oraz 1 godzinę przed zaplanowaną wizytą. Dzięki temu nie zapomnisz o swoim terminie.' },
      { question: 'Jak mogę zostawić opinię po wizycie?', answer: 'Po zakończonej wizycie otrzymasz email z linkiem do wystawienia opinii. Możesz ocenić salon w skali 1-5 gwiazdek i dodać komentarz opisujący swoje doświadczenie.' },
      { question: 'Czy salon może ustawić własne ceny i godziny pracy?', answer: 'Tak, każdy salon ma pełną kontrolę nad swoim profilem — cennik usług, czas trwania zabiegów, godziny pracy, przerwy, dni wolne oraz kalendarz rezerwacji zmieniasz w panelu.' }
    ]

    const activeSalonSlug = computed(() => selectedBarber.value?.id ? (apiBarbers.value.find(b => b.id === selectedBarber.value!.id)?.salon?.slug ?? salonSlug) : salonSlug)

    const selectedBarberSchedule = computed(() => {
      if (!selectedBarber.value) return null
      return barberSchedules.value.get(selectedBarber.value.id) ?? null
    })

    const dayLabels = ['Nd', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob']

    const barberWorkingHours = computed(() => {
      const sched = selectedBarberSchedule.value
      if (!sched) return null
      const days = sched.workingHours.reduce<Record<string, { open: boolean; from: string; to: string; breaks: { from: string; to: string }[] }[]>>((acc, wh) => {
        const label = dayLabels[wh.dayOfWeek] ?? ''
        if (!acc[label]) acc[label] = []
        return acc
      }, {} as Record<string, { open: boolean; from: string; to: string; breaks: { from: string; to: string }[] }[]>)
      for (const wh of sched.workingHours) {
        const label = dayLabels[wh.dayOfWeek] ?? ''
        const brks = sched.breaks
          .filter(br => br.dayOfWeek === wh.dayOfWeek)
          .map(br => ({ from: br.startTime, to: br.endTime }))
        days[label] = days[label] || []
        days[label].push({ open: true, from: wh.startTime, to: wh.endTime, breaks: brks })
      }
      return days
    })

    const todayDate = computed(() => new Date().toISOString().split('T')[0])
    const normalize = (value: string) =>
      value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/Ł/g, 'L').toLowerCase().trim()

    const filteredBarbers = computed(() => {
      let list = barbers.value
      const query = normalize(searchCity.value)
      if (query) {
        const parts = query.split(/\s+/)
        list = list.filter(b => {
          const haystack = normalize(`${b.name} ${b.salonName} ${b.city} ${b.specialty}`)
          const serviceNames = normalize(
            services.value.filter(s => b.serviceIds.includes(s.id)).map(s => s.name).join(' '),
          )
          return parts.every(part => haystack.includes(part) || serviceNames.includes(part))
        })
      }
      if (searchService.value) list = list.filter(b => b.serviceIds.includes(searchService.value))
      return list
    })

    const hasSearch = computed(() => Boolean(searchCity.value.trim() || searchService.value))

    const resultsLabel = computed(() => {
      const count = filteredBarbers.value.length
      if (count === 1) return 'specjalista'
      if (count > 1 && count < 5) return 'specjalistów'
      return 'specjalistów'
    })

    const clearSearch = () => {
      searchCity.value = ''
      searchService.value = ''
    }

    const runSearch = () => {
      scrollToSection('#barbers')
    }

    async function loadSalonData() {
      const results = await Promise.allSettled([
        publicApi.salon(salonSlug),
        publicApi.services(salonSlug),
        publicApi.allBarbers(),
        publicApi.schedule(salonSlug),
      ])
      const [salonRes, servicesRes, barbersRes, scheduleRes] = results

      if (salonRes.status === 'fulfilled') salon.value = salonRes.value
      if (servicesRes.status === 'fulfilled') apiServices.value = servicesRes.value
      if (barbersRes.status === 'fulfilled') apiBarbers.value = barbersRes.value

      if (scheduleRes.status === 'fulfilled') {
        const map = new Map<string, PublicBarberSchedule>()
        for (const bs of scheduleRes.value.barbers) map.set(bs.id, bs)
        barberSchedules.value = map
      }

      if (results.every(r => r.status === 'rejected')) {
        salonLoadError.value = 'Nie udało się załadować danych. Backend API jest niedostępny.'
      }
    }

    async function loadAvailability() {
      if (!selectedService.value?.id || !bookingForm.date) {
        availableTimeSlots.value = []
        return
      }
      slotsLoading.value = true
      bookingForm.time = ''
      try {
        const slug = activeSalonSlug.value
        const res = await publicApi.availability(slug, {
          serviceId: selectedService.value.id,
          date: bookingForm.date,
          barberId: selectedBarber.value?.id,
        })
        const tz = salon.value?.timezone ?? 'Europe/Warsaw'
        let slots: { startAt: string; available?: boolean }[] = []
        if ('slots' in res && Array.isArray(res.slots)) {
          slots = res.slots
        } else if ('barbers' in res) {
          if (selectedBarber.value?.id) {
            slots = res.barbers.find(b => b.barberId === selectedBarber.value!.id)?.slots ?? []
          } else {
            slots = res.barbers.flatMap(b => b.slots)
          }
        }
        availableTimeSlots.value = slots
          .filter(s => s.available !== false)
          .map(s => new Date(s.startAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }))
          .filter((t, i, arr) => arr.indexOf(t) === i)
          .sort()
      } catch {
        availableTimeSlots.value = []
      } finally {
        slotsLoading.value = false
      }
    }

    watch(() => selectedBarber.value?.id, (barberId) => {
      if (!barberId) return
      const bData = apiBarbers.value.find(b => b.id === barberId)
      if (!bData?.salon?.slug) return
      const hasSchedule = barberSchedules.value.has(barberId)
      if (!hasSchedule) {
        publicApi.schedule(bData.salon.slug).then(data => {
          const map = new Map(barberSchedules.value)
          for (const bs of data.barbers) map.set(bs.id, bs)
          barberSchedules.value = map
        }).catch(() => {})
      }
    })

    watch(() => [bookingForm.date, selectedService.value?.id, selectedBarber.value?.id] as const, loadAvailability)
    const summaryItems = computed<SummaryItem[]>(() => [
      { label: 'Specjalista', value: selectedBarber.value?.name || 'Nie wybrano', done: !!selectedBarber.value },
      { label: 'Usługa', value: selectedService.value ? `${selectedService.value.name} — ${selectedService.value.price} zł` : 'Nie wybrano', done: !!selectedService.value },
      { label: 'Termin', value: bookingForm.date && bookingForm.time ? `${formatDate(bookingForm.date)}, ${bookingForm.time}` : 'Nie wybrano', done: !!(bookingForm.date && bookingForm.time) }
    ])

    const handleScroll = () => { isScrolled.value = window.scrollY > 50 }
    const toggleNav = () => { isNavOpen.value = !isNavOpen.value }
    const scrollToSection = (href: string) => { const el = document.querySelector(href); if (el) { el.scrollIntoView({ behavior: 'smooth' }); activeSection.value = href; isNavOpen.value = false } }
    const selectBarber = (b: LandingBarber) => { if (b.available) selectedBarber.value = selectedBarber.value?.id === b.id ? null : b }
    const selectBarberAndScroll = (b: LandingBarber) => { selectBarber(b); if (selectedBarber.value) setTimeout(() => scrollToSection('#services'), 300) }
    const selectService = (s: LandingService) => { selectedService.value = selectedService.value?.id === s.id ? null : s }
    const selectServiceAndScroll = (s: LandingService) => { selectService(s); if (selectedService.value) setTimeout(() => scrollToSection('#booking'), 300) }
    const formatDate = (d: string): string => { if (!d) return '—'; return new Date(d).toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }

    const submitBooking = async () => {
      if (!selectedBarber.value?.id || !selectedService.value?.id || !bookingForm.date || !bookingForm.time) return
      bookingError.value = ''
      bookingLoading.value = true
      try {
        const slug = activeSalonSlug.value
        const parts = bookingForm.name.trim().split(/\s+/)
        const startAt = buildStartAt(bookingForm.date, bookingForm.time, salon.value?.timezone ?? 'Europe/Warsaw')
        await publicApi.book(slug, {
          barberId: selectedBarber.value.id,
          serviceId: selectedService.value.id,
          startAt,
          customer: {
            firstName: parts[0] ?? 'Klient',
            lastName: parts.slice(1).join(' ') || undefined,
            phone: bookingForm.phone.trim(),
            email: bookingForm.email.trim() || undefined,
          },
          customerNote: bookingForm.notes || undefined,
        })
        confirmedSummary.value = `${selectedService.value.name} · ${formatDate(bookingForm.date)}, ${bookingForm.time}`
        currentBookingStep.value = 3
        bookingConfirmed.value = true
      } catch (e) {
        bookingError.value = e instanceof ApiError ? e.message : 'Rezerwacja nie powiodła się'
      } finally {
        bookingLoading.value = false
      }
    }

    const resetBooking = () => { selectedBarber.value = null; selectedService.value = null; currentBookingStep.value = 0; bookingConfirmed.value = false; confirmedSummary.value = ''; bookingError.value = ''; Object.assign(bookingForm, { date: '', time: '', name: '', phone: '', email: '', notes: '' }) }
    const toggleFaq = (index: number) => { activeFaq.value = activeFaq.value === index ? null : index }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      void loadSalonData()
      void loadReviews()

      const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(faqLd)
      document.head.appendChild(script)
    })
    onUnmounted(() => window.removeEventListener('scroll', handleScroll))

    return {
      isScrolled, isNavOpen, activeSection, selectedBarber, selectedService,
      currentBookingStep, bookingConfirmed, confirmedSummary, bookingLoading, bookingError, bookingForm, howItWorksRole,
      searchCity, searchService, filteredBarbers, hasSearch, resultsLabel, clearSearch, runSearch, miniChartData, activeFaq,
      salon, salonLoadError, availableTimeSlots, slotsLoading, barberWorkingHours, activeSalonSlug,
      navItems, heroStats, clientSteps, barberSteps, platformFeatures,
      barbers, services, bookingSteps, reviews,
      faqItems, todayDate, summaryItems,
      toggleNav, scrollToSection, selectBarber, selectBarberAndScroll,
      selectService, selectServiceAndScroll, formatDate, submitBooking, resetBooking, toggleFaq
    }
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

:root {
  --c0: #0b1215;
  --c1: #0f181c;
  --c2: #142024;
  --c3: #1a2a30;
  --c4: #23373e;
  --c5: #2e4750;
  --ct: #d4dfe3;
  --cd: #a6bac2;
  --ca: #7fb3c2;
  --radius: 12px;
  --radius-sm: 8px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--c0); color: var(--ct); font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
h1,h2,h3,h4,h5,h6 { color: var(--ct); font-weight: 700; }
.accent-text { color: var(--ca) !important; }
.dim { color: var(--cd) !important; }
.bg-alt { background: var(--c1) !important; }

.skip-link { position: absolute; top: -100px; left: 16px; background: var(--ca); color: var(--c0); padding: 12px 20px; border-radius: var(--radius-sm); font-weight: 600; font-size: 0.85rem; z-index: 99999; text-decoration: none; transition: top 0.2s; }
.skip-link:focus { top: 16px; }

:focus-visible { outline: 2px solid var(--ca); outline-offset: 2px; }
button:focus-visible, a:focus-visible { outline: 2px solid var(--ca); outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}

@media (prefers-contrast: high) {
  :root { --c3: #3a4a50; --c4: #4a5a60; --c5: #5a6a70; --cd: #d0dde3; }
}

.btn-cta { background: var(--ca); border: none; color: var(--c0); font-weight: 600; border-radius: var(--radius-sm); transition: all 0.2s; }
.btn-cta:hover { background: #93c5d2; color: var(--c0); transform: translateY(-1px); }
.btn-cta:disabled { opacity: 0.35; transform: none; }
.btn-outline { border: 1px solid var(--c4); color: var(--ct); background: transparent; border-radius: var(--radius-sm); transition: all 0.2s; }
.btn-outline:hover { background: var(--c3); border-color: var(--c5); color: var(--ct); }
.btn-ghost { border: 1px solid var(--c4); color: var(--ct); background: transparent; border-radius: var(--radius-sm); transition: all 0.2s; }
.btn-ghost:hover { background: var(--c2); color: var(--ct); }

.nav-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; }
.site-nav { padding: 0; transition: all 0.3s; background: transparent; position: fixed; top: 0; left: 0; right: 0; z-index: 1000; }
.site-nav-scrolled { background: rgba(11,18,21,0.95) !important; backdrop-filter: blur(20px); box-shadow: 0 1px 0 var(--c3); }
.nav-container { display: flex; align-items: center; justify-content: space-between; min-height: 56px; padding: 10px 0; position: relative; }
.site-nav-brand { display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0; }
.brand-icon { font-size: 1.3rem; color: var(--ca); }
.brand-text { font-weight: 700; font-size: 1.1rem; color: var(--ct); letter-spacing: 2px; }
.brand-accent { color: var(--ca); }

.nav-toggler { display: flex; flex-direction: column; justify-content: center; gap: 5px; width: 36px; height: 36px; padding: 6px; background: var(--c2); border: 1px solid var(--c3); border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
.nav-toggler span { display: block; width: 100%; height: 2px; background: var(--ct); border-radius: 2px; transition: all 0.3s; transform-origin: center; }
.nav-toggler.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-toggler.open span:nth-child(2) { opacity: 0; }
.nav-toggler.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.nav-dropdown { display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--c1); border-bottom: 1px solid var(--c3); z-index: 999; padding: 0 20px 16px; border-radius: 0 0 var(--radius) var(--radius); }
.nav-dropdown.open { display: block; }

.nav-list { list-style: none; margin: 0; padding: 0; }
.nav-list li { border-bottom: 1px solid var(--c3); }
.nav-list li:last-child { border-bottom: none; }
.nav-link { display: block; color: var(--cd) !important; font-weight: 500; font-size: 0.88rem; padding: 14px 0; text-decoration: none; transition: color 0.2s; }
.nav-link:hover, .nav-link.active { color: var(--ct) !important; }

.nav-actions { display: flex; flex-direction: column; gap: 10px; padding-top: 16px; margin-top: 8px; border-top: 1px solid var(--c3); }
.nav-actions .btn { width: 100%; text-align: center; padding: 12px; font-size: 0.82rem; }

@media (min-width: 992px) {
  .nav-container { min-height: 60px; padding: 14px 0; }
  .nav-toggler { display: none; }
  .nav-dropdown {
    display: flex !important;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    position: static;
    background: none;
    border: none;
    padding: 0;
    border-radius: 0;
  }
  .nav-list { display: flex; align-items: center; gap: 2px; }
  .nav-list li { border-bottom: none; }
  .nav-link { padding: 8px 12px; font-size: 0.82rem; white-space: nowrap; }
  .nav-actions { flex-direction: row; gap: 8px; padding-top: 0; margin-top: 0; border-top: none; margin-left: 12px; }
  .nav-actions .btn { width: auto; padding: 8px 16px; white-space: nowrap; }
}

.hero-section { padding: 120px 0 80px; background: var(--c0); position: relative; overflow: hidden; }
.hero-section::before { content: ''; position: absolute; top: -200px; right: -200px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(127,179,194,0.06) 0%, transparent 70%); pointer-events: none; }
.hero-row { min-height: calc(100vh - 200px); }

.hero-content { position: relative; z-index: 2; }

.hero-overline { display: inline-flex; align-items: center; gap: 10px; color: var(--cd); font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
.overline-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ca); }

.hero-title { font-size: clamp(2.4rem, 5vw, 3.6rem); font-weight: 700; line-height: 1.1; letter-spacing: -1px; }
.hero-desc { font-size: 0.95rem; color: var(--cd); max-width: 480px; line-height: 1.75; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }

.hero-metrics { display: flex; gap: 40px; margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--c3); }
.metric-val { font-size: 1.6rem; font-weight: 700; color: var(--ca); line-height: 1; }
.metric-lbl { font-size: 0.72rem; color: var(--cd); margin-top: 4px; letter-spacing: 0.5px; }

.hero-visual { position: relative; }
.visual-grid { position: relative; height: 480px; }

.vis-card { background: var(--c1); border: 1px solid var(--c3); border-radius: var(--radius); }

.vis-main { position: absolute; top: 0; left: 0; right: 0; padding: 20px 24px; z-index: 2; }
.vis-card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
.vis-status { width: 8px; height: 8px; border-radius: 50%; background: var(--ca); }
.vis-status.pulse { animation: pulse-dot 2s infinite; }
@keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)} }
.vis-status-text { font-size: 0.68rem; font-weight: 600; color: var(--cd); text-transform: uppercase; letter-spacing: 1px; }

.vis-stat-row { display: flex; gap: 32px; margin-bottom: 20px; }
.vis-stat-num { font-size: 2rem; font-weight: 700; color: var(--ct); line-height: 1; }
.vis-stat-lbl { font-size: 0.7rem; color: var(--cd); margin-top: 4px; }

.vis-bar-chart { display: flex; align-items: flex-end; gap: 6px; height: 60px; }
.vis-bar { flex: 1; background: var(--c3); border-radius: 3px 3px 0 0; transition: height 0.5s ease; min-height: 4px; }
.vis-bar:nth-child(odd) { background: var(--ca); opacity: 0.5; }
.vis-bar:nth-child(3n) { background: var(--ca); opacity: 0.8; }

.vis-side { position: absolute; padding: 14px 18px; z-index: 3; animation: float-card 6s ease-in-out infinite; }
.vis-s1 { bottom: 180px; left: -20px; animation-delay: 0s; }
.vis-s2 { bottom: 100px; right: -10px; animation-delay: -2s; }
.vis-s3 { bottom: 20px; left: 10px; animation-delay: -4s; }
@keyframes float-card { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }

.vis-notif { display: flex; align-items: center; gap: 12px; white-space: nowrap; }
.vis-notif-icon { width: 36px; height: 36px; border-radius: 50%; background: var(--c3); display: flex; align-items: center; justify-content: center; color: var(--ca); font-size: 0.9rem; flex-shrink: 0; }
.vis-notif-icon.star { color: var(--ca); }
.vis-notif-icon.client { color: var(--ca); }
.vis-notif-title { font-size: 0.78rem; font-weight: 600; }
.vis-notif-sub { font-size: 0.68rem; color: var(--cd); }

.role-tabs { display: flex; justify-content: center; gap: 8px; }
.role-tab { background: var(--c2); border: 1px solid var(--c3); color: var(--cd); font-family: inherit; font-size: 0.82rem; font-weight: 600; padding: 10px 24px; border-radius: 50px; cursor: pointer; transition: all 0.2s; }
.role-tab.active { background: var(--ca); border-color: var(--ca); color: var(--c0); }
.role-tab:hover:not(.active) { border-color: var(--c5); color: var(--ct); }

.sec { padding: 90px 0; }
.sec-overline { color: var(--cd); font-weight: 600; font-size: 0.68rem; letter-spacing: 3px; text-transform: uppercase; }
.sec-heading { font-size: clamp(1.6rem, 2.8vw, 2.4rem); letter-spacing: -0.3px; }
.sec-desc { color: var(--cd); font-size: 0.92rem; max-width: 520px; line-height: 1.7; }

.card-base { background: var(--c2); border: 1px solid var(--c3); border-radius: var(--radius); transition: all 0.2s; }
.card-base:hover { border-color: var(--c5); transform: translateY(-2px); }
.card-base.selected { border-color: var(--ca) !important; }

.step-card { padding: 32px 26px; position: relative; overflow: hidden; }
.step-num { position: absolute; top: 10px; right: 16px; font-size: 3rem; font-weight: 700; color: var(--c3); line-height: 1; }
.step-ico { width: 48px; height: 48px; background: var(--c3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: var(--ca); }

.feature-card { padding: 26px; }
.feat-ico { width: 44px; height: 44px; background: var(--c3); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: var(--ca); }
.feat-badge { font-size: 0.6rem; font-weight: 600; padding: 3px 10px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.5px; }
.badge-both { background: rgba(127,179,194,0.1); color: var(--ca); border: 1px solid rgba(127,179,194,0.2); }
.badge-barber { background: rgba(127,179,194,0.06); color: var(--ca); border: 1px solid var(--c4); }
.badge-client { background: var(--c3); color: var(--cd); border: 1px solid var(--c4); }

.search-bar { background: var(--c2); border: 1px solid var(--c3); border-radius: var(--radius); padding: 24px; }
.search-summary { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.search-empty { padding: 48px 24px; text-align: center; }
.search-empty i { font-size: 2rem; color: var(--ca); display: block; margin-bottom: 14px; }
.input-icon-wrap { position: relative; }
.input-ico { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--cd); font-size: 0.95rem; pointer-events: none; z-index: 2; }
.input-icon-wrap .form-control { padding-left: 42px; }

.barber-card { overflow: hidden; cursor: pointer; }
.barber-top { position: relative; padding: 24px; text-align: center; background: var(--c1); }
.barber-ava { width: 68px; height: 68px; background: var(--c3); border: 1px solid var(--c4); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 1.6rem; color: var(--cd); }
.barber-status { position: absolute; top: 12px; right: 12px; font-size: 0.58rem; font-weight: 600; padding: 3px 8px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid var(--c4); }
.barber-status.on { color: var(--ca); background: var(--c3); }
.barber-status.off { color: var(--cd); background: var(--c2); }
.barber-body { padding: 0 18px 18px; text-align: center; }

.service-card { padding: 26px; cursor: pointer; display: flex; flex-direction: column; }
.svc-ico { width: 44px; height: 44px; background: var(--c3); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; color: var(--ca); }
.svc-price { font-size: 1.2rem; font-weight: 700; color: var(--ct); }

.cta-banner { background: var(--c2); border: 1px solid var(--c3); border-radius: var(--radius); padding: 48px 40px; }

.booking-wrap { background: var(--c2); border: 1px solid var(--c3); border-radius: var(--radius); overflow: hidden; }
.booking-side { background: var(--c1); padding: 32px 28px; display: flex; flex-direction: column; border-right: 1px solid var(--c3); }
.sum-row { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--c3); }
.sum-icon { color: var(--cd); font-size: 1rem; margin-top: 2px; }
.sum-row.done .sum-icon { color: var(--ca); }
.sum-label { font-size: 0.64rem; color: var(--cd); text-transform: uppercase; letter-spacing: 1px; }
.sum-val { font-weight: 600; font-size: 0.85rem; }
.total-box { background: var(--c3); border-radius: var(--radius-sm); padding: 16px; margin-top: 24px; }
.booking-main { padding: 32px 28px; }

.bk-steps { display: flex; justify-content: space-between; position: relative; }
.bk-steps::before { content:''; position: absolute; top: 13px; left: 26px; right: 26px; height: 1px; background: var(--c3); }
.bk-step { display: flex; flex-direction: column; align-items: center; gap: 6px; position: relative; }
.bk-dot { width: 28px; height: 28px; border-radius: 50%; background: var(--c1); border: 1px solid var(--c4); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; color: var(--cd); transition: all 0.2s; }
.bk-step.active .bk-dot { background: var(--ca); border-color: var(--ca); color: var(--c0); }
.bk-step.done .bk-dot { background: var(--c4); border-color: var(--c5); color: var(--ca); }
.bk-label { font-size: 0.64rem; color: var(--cd); text-transform: uppercase; letter-spacing: 0.8px; }

.form-control,.form-select { background: var(--c1) !important; border: 1px solid var(--c3) !important; color: var(--ct) !important; border-radius: var(--radius-sm); transition: border-color 0.2s; }
.form-control:focus,.form-select:focus { border-color: var(--c5) !important; box-shadow: 0 0 0 2px rgba(127,179,194,0.1) !important; }
.form-control::placeholder { color: var(--cd) !important; }
.form-label { color: var(--ct); font-size: 0.8rem; }

.time-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(76px, 1fr)); gap: 6px; }
.time-btn { background: var(--c1); border: 1px solid var(--c3); color: var(--cd); padding: 9px; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.15s; font-family: inherit; }
.time-btn:hover { border-color: var(--c5); color: var(--ct); }
.time-btn.active { background: var(--ca); border-color: var(--ca); color: var(--c0); font-weight: 600; }

.confirm-box { background: var(--c1); border: 1px solid var(--c3); border-radius: var(--radius); padding: 20px; }
.booking-done { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 320px; }
.cfm-label { font-size: 0.58rem; color: var(--cd); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; }
.cfm-val { font-weight: 600; }
.done-icon { font-size: 4rem; color: var(--ca); }

.review-card { padding: 26px; display: flex; flex-direction: column; position: relative; }
.review-badge { position: absolute; top: 14px; right: 14px; font-size: 0.56rem; font-weight: 600; padding: 3px 8px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.5px; }
.rev-ava { width: 36px; height: 36px; background: var(--c3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; color: var(--ca); }

.faq-list { display: flex; flex-direction: column; gap: 8px; }
.faq-item { background: var(--c2); border: 1px solid var(--c3); border-radius: var(--radius); overflow: hidden; transition: all 0.2s; }
.faq-item:hover { border-color: var(--c5); }
.faq-item.open { border-color: var(--ca); }
.faq-question { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 24px; background: transparent; border: none; color: var(--ct); font-family: inherit; font-size: 0.92rem; font-weight: 600; text-align: left; cursor: pointer; transition: all 0.2s; }
.faq-question:hover { color: var(--ca); }
.faq-chevron { color: var(--cd); font-size: 1rem; flex-shrink: 0; transition: color 0.2s; }
.faq-item.open .faq-chevron { color: var(--ca); }
.faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
.faq-answer-inner { padding: 0 24px 20px; color: var(--cd); font-size: 0.88rem; line-height: 1.7; }

.app-footer { background: var(--c1); padding: 50px 0 0; border-top: 1px solid var(--c3); }
.ft-heading { color: var(--ca); font-weight: 600; text-transform: uppercase; font-size: 0.66rem; letter-spacing: 2px; margin-bottom: 16px; }
.ft-links { list-style: none; padding: 0; margin: 0; }
.ft-links li { margin-bottom: 8px; }
.ft-links a { color: var(--cd); text-decoration: none; font-size: 0.82rem; transition: color 0.2s; }
.ft-links a:hover { color: var(--ct); }
.ft-links-legal li { margin-bottom: 8px; }
.ft-bottom { border-top: 1px solid var(--c3); padding: 20px 0; margin-top: 32px; }
.back-top { color: var(--cd); text-decoration: none; font-size: 0.78rem; font-weight: 500; transition: color 0.2s; }
.back-top:hover { color: var(--ct); }

.working-hours-box { background: var(--c2); border: 1px solid var(--c3); border-radius: var(--radius-sm); padding: 14px; }
.wh-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; font-size: 0.72rem; }
.wh-day { font-weight: 600; min-width: 36px; color: var(--ct); }
.wh-time { color: var(--cd); text-align: right; }
.wh-break { color: var(--ca); font-size: 0.62rem; display: inline-block; margin-left: 4px; }
.wh-closed { color: var(--c5); font-size: 0.66rem; text-align: right; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 991px) {
  .sec { padding: 60px 0; }
  .hero-section { padding: 100px 0 60px; }
  .hero-row { min-height: auto; }
  .hero-metrics { gap: 24px; }
  .booking-side { border-right: none; border-bottom: 1px solid var(--c3); }
  .cta-banner { padding: 32px 24px; }
  .visual-grid { display: none; }
  .nav-dropdown { max-height: calc(100vh - 76px); overflow-y: auto; }
  .role-tabs { flex-wrap: wrap; }
}

@media (max-width: 767px) {
  .sec { padding: 48px 0; }
  .hero-section { padding: 92px 0 48px; }
  .hero-metrics { gap: 16px; flex-wrap: wrap; margin-top: 32px; padding-top: 24px; }
  .metric-val { font-size: 1.3rem; }
  .hero-desc { margin-bottom: 32px !important; }
  .booking-main, .booking-side { padding: 20px 16px; }
  .time-grid { grid-template-columns: repeat(3, 1fr); }
  .faq-question { padding: 16px 18px; font-size: 0.85rem; }
  .faq-answer-inner { padding: 0 18px 16px; font-size: 0.82rem; }
  .search-bar { padding: 18px; }
  .step-card, .feature-card, .service-card, .review-card { padding: 22px 20px; }
  .step-num { font-size: 2.4rem; }
  .cta-banner { padding: 28px 20px; }
  .booking-side .total-box { margin-top: 20px; }
}

@media (max-width: 575px) {
  .sec { padding: 40px 0; }
  .hero-actions { flex-direction: column; align-items: stretch; }
  .hero-actions .btn { width: 100%; }
  .hero-metrics { gap: 12px; }
  .metric { flex: 1 1 40%; }
  .sec-heading { font-size: 1.45rem; }
  .brand-text { font-size: 0.98rem; letter-spacing: 1.5px; }
  .bk-steps::before { left: 18px; right: 18px; }
  .bk-dot { width: 26px; height: 26px; font-size: 0.68rem; }
  .time-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5px; }
  .time-btn { padding: 8px 4px; font-size: 0.78rem; }
  .confirm-box { padding: 16px; }
  .cfm-val { font-size: 0.86rem; word-break: break-word; }
  .booking-wrap .d-flex.gap-3 { gap: 8px !important; }
  .app-footer { padding-top: 40px; }
  .working-hours-box { padding: 12px; }
}
</style>
