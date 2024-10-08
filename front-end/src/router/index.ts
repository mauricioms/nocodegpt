import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocation,
  type RouteLocationNormalized
} from 'vue-router'

import { http } from '@/fetch-api'
import AppView from '@/views/AppView.vue'
import LoginView from '@/views/LoginView.vue'
import LogoutView from '@/views/LogoutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/view',
      name: 'view',
      meta: { requiresAuth: true },
      component: AppView
    },
    {
      path: '/logout',
      name: 'logout',
      meta: { requiresAuth: true },
      component: LogoutView
    },
    {
      path: '/login',
      name: 'login',
      meta: { requiresAuth: false },
      component: LoginView
    },
    {
      path: '/',
      name: 'init',
      meta: { requiresAuth: true },
      component: AppView
    },
    {
      path: '/main/:id',
      name: 'main_id',
      meta: { requiresAuth: true },
      component: AppView
    },
    {
      path: '/main',
      name: 'main',
      meta: { requiresAuth: true },
      component: AppView
    },
    {
      path: '/add',
      name: 'add',
      meta: { requiresAuth: true },
      component: AppView
    }
  ]
})

export async function isAuthenticated(): Promise<boolean> {
  const data: any = await http.GET('/auth/valid')
  return data.status?.code === 202
}

router.beforeEach(
  async (to: RouteLocation, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void> => {
    if (
      to.matched.some((record) => {
        return record.meta.requiresAuth
      })
    ) {
      try {
        const ok: boolean = await isAuthenticated()

        if (ok) {
          next()
        } else {
          next('/login')
        }
      } catch (err: unknown) {
        next('/login')
      }
    } else {
      next()
    }
  }
)

export default router
