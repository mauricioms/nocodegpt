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
  ,
  {
    path: '/perguntas',
    name: 'perguntas',
    component: () => import('@/views/PerguntasView.vue')
  },
  {
    path: '/perguntas/:id',
    name: 'perguntas_manager',
    component: () => import('@/views/PerguntasView.vue')
  }
  ,
  {
    path: '/respostas',
    name: 'respostas',
    component: () => import('@/views/RespostasView.vue')
  },
  {
    path: '/respostas/:id',
    name: 'respostas_manager',
    component: () => import('@/views/RespostasView.vue')
  }
  //##route-vue##
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeData
})

export default router
