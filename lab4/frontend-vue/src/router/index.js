import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue' // <--- 1. Импорт файла

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/register',           // <--- 2. Адрес в браузере
      name: 'register',
      component: RegisterPage      // <--- 3. Какой файл показать
    },
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomePage.vue') // Ленивая загрузка (можно и так)
    }
  ]
})

export default router