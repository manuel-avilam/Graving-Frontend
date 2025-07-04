import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import UserProfileView from '@/views/users/UserProfileView.vue'
import EditUserProfileView from '@/views/users/EditUserProfileView.vue'
import VisitsLogView from '@/views/visits/VisitsLogView.vue'
import MapView from '@/views/map/MapView.vue'
import DeceasedDetailView from '@/views/deceased/DeceasedDetailView.vue'
import RegisterVisitView from '@/views/visits/RegisterVisitView.vue'
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import DeceasedSearchView from '@/views/deceased/DeceasedSearchView.vue'
import RegisterAndEditDeceasedView from '@/views/deceased/RegisterAndEditDeceasedView.vue'
import OwnersAdministrationView from '@/views/admin/OwnersAdministrationView.vue'
import GravesAdministrationView from '@/views/admin/GravesAdministrationView.vue'
import SystemLogView from '@/views/admin/SystemLogView.vue'
import RegisterRepairView from '@/views/admin/RegisterRepairView.vue'
import RepairsAdministrationView from '@/views/admin/RepairsAdministrationView.vue'

import { useAuthStore } from '@/stores/authStore'
import VisitsAdministrationView from '@/views/admin/VisitsAdministrationView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/editProfile',
    name: 'editProfile',
    component: EditUserProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/visits',
    name: 'visits',
    component: VisitsLogView,
    meta: { requiresAuth: true }
  },
  {
    path: '/map',
    name: 'map',
    component: MapView
  },
  {
    path: '/deceased/:id',
    name: 'deceased',
    component: DeceasedDetailView
  },
  {
    path: '/visit/:id',
    name: 'visit',
    component: RegisterVisitView,
    meta: { requiresAuth: true }
  },
  {
    path:  '/admin/visits',
    name: 'visitsAdmin',
    component: VisitsAdministrationView,
    meta: { requireAuth: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/deceased/search',
    name: 'searchDeceased',
    component: DeceasedSearchView
  },
  {
    path: '/deceased/register/:graveId?',
    name: 'registerDeceased',
    component: RegisterAndEditDeceasedView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/deceased/edit/:id',
    name: 'editDeceased',
    component: RegisterAndEditDeceasedView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/owners',
    name: 'owners',
    component: OwnersAdministrationView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/graves',
    name: 'graves',
    component: GravesAdministrationView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/systemLog',
    name: 'systemLog',
    component: SystemLogView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/repair/register/:graveId?',
    name: 'registerRepair',
    component: RegisterRepairView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/repairs',
    name: 'repairs',
    component: RepairsAdministrationView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if ((to.name === 'login' || to.name === 'register') && authStore.isLoggedIn) {
    return next({ name: 'home' })
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next({ name: 'login' })
  }

  if (to.meta.requiresAdmin) {
    const isAdmin = await authStore.hasAdminRole()
    if (!isAdmin) return next({name: 'home'})
  }

  next()
})

export default router
