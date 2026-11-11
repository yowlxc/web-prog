import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue' 
import Profile from '../views/Profile.vue'
import HomePage from '../views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/register',      
      name: 'register',
      component: RegisterPage     
    },
    {
        path: '/', 
        name: 'home',
        component: () => import('../views/HomePage.vue') // Ленивая загрузка (можно и так)
    },
    {
      path: '/profile',          
      name: 'profile',
      component: Profile    
    },
  ]
})

export default router