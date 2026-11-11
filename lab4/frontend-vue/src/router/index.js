import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue' 
import Profile from '../views/Profile.vue'
import HomePage from '../views/HomePage.vue'
import StudentsPage from '../views/StudentsPage.vue'
import StudentForm from '../views/StudentForm.vue'

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
    {
      path: '/students/new',
      component: StudentForm
    },
    {
      path: '/students/:isu/edit',
      component: StudentForm
    },
    {
      path: '/students/:isu',
      component: StudentsPage
    },
  ]
})

router.beforeEach((to) => {
  const isLoggedIn = localStorage.getItem('accessToken') && localStorage.getItem('user')
  if ((to.path === '/' || to.path === '/profile' || to.path.startsWith('/students/')) && !isLoggedIn) {
    return '/login'
  }
})

export default router
