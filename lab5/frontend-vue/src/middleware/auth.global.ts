export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    await authStore.restoreSession()
  }

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