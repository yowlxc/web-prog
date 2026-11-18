export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  const publicPages = ['/login', '/register']

  if (to.path === '/') {
    return navigateTo(
      authStore.isAuthenticated ? '/home' : '/login'
    )
  }

  if (!authStore.isAuthenticated && !publicPages.includes(to.path)) {
    return navigateTo('/login')
  }

  if (authStore.isAuthenticated && publicPages.includes(to.path)) {
    return navigateTo('/home')
  }
})