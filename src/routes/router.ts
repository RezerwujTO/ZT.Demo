import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/pages/auth/AuthPage.vue'),
  },
  {
    path: '/cms',
    component: () => import('@/cms/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'CmsDashboard',
        component: () => import('@/cms/views/Dashboard.vue'),
      },
      {
        path: 'kalendarz',
        name: 'CmsCalendar',
        component: () => import('@/cms/views/Calendar.vue'),
      },
      {
        path: 'wizyty',
        name: 'CmsVisits',
        component: () => import('@/cms/views/Visits.vue'),
      },
      {
        path: 'klienci',
        name: 'CmsClients',
        component: () => import('@/cms/views/Clients.vue'),
      },
      {
        path: 'uslugi',
        name: 'CmsServices',
        component: () => import('@/cms/views/Services.vue'),
      },
      {
        path: 'barberzy',
        name: 'CmsBarbers',
        component: () => import('@/cms/views/Barbers.vue'),
      },
      {
        path: 'godziny',
        name: 'CmsWorkingHours',
        component: () => import('@/cms/views/WorkingHours.vue'),
      },
      {
        path: 'ustawienia',
        name: 'CmsSettings',
        component: () => import('@/cms/views/Settings.vue'),
      },
      {
        path: 'pomoc',
        name: 'CmsHelp',
        component: () => import('@/cms/views/Help.vue'),
      },
    ],
  },
  {
    path: '/dashboard',
    redirect: '/cms',
  },
  {
    path: '/dashboard/:pathMatch(.*)*',
    redirect: '/cms',
  },
  {
    path: '/licencja',
    name: 'License',
    component: () => import('@/pages/static/License.vue'),
  },
  {
    path: '/polityka-prywatnosci',
    name: 'PrivacyPolicy',
    component: () => import('@/pages/static/PrivacyPolicy.vue'),
  },
  {
    path: '/polityka-serwisu',
    name: 'ServicePolicy',
    component: () => import('@/pages/static/ServicePolicy.vue'),
  },
  {
    path: '/regulamin',
    name: 'Regulamin',
    component: () => import('@/pages/static/Regulamin.vue'),
  },
  {
    path: '/500',
    name: 'Error500',
    component: () => import('@/pages/Error500.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/Error404.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.ready) {
    try {
      await auth.init()
    } catch {
      /* auth init failed — proceed as unauthenticated */
    }
  }

  if (to.path.startsWith('/cms')) {
    if (!auth.isAuthenticated) {
      return { path: '/auth', query: { redirect: to.fullPath } }
    }
  }

  if (to.path === '/auth' && auth.isAuthenticated) {
    const redirect = typeof to.query.redirect === 'string' ? to.query.redirect : '/cms'
    return redirect
  }

  return true
})
