import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export const routeData = [
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/',
    name: 'Init',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('@/views/LogoutView.vue')
  }
  //##route-vue##
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeData
})

export default router
