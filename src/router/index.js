import { createRouter, createWebHistory } from 'vue-router'
// Import views secara langsung agar lebih aman
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import DetailView from '../views/DetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      // BAGIAN PENTING: Titik dua (:) mendefinisikan parameter dinamis
      path: '/detail/:nim', 
      name: 'detail',
      component: DetailView
    }
  ]
})

export default router