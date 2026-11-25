export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path === '/') {
        return navigateTo('/home', { replace: true })
    }
    if (import.meta.server) return

    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
       await authStore.restoreSession()
    }

    const publicPages = ['/login', '/register']

    // восстанавливаем сессию только в браузере
    if (import.meta.client && !authStore.isAuthenticated) {
        await authStore.restoreSession()
    }

    if (to.path === '/') {
        if (import.meta.server) {
            return
        }

        return navigateTo(
            authStore.isAuthenticated ? '/home' : '/login'
        )
    }

    // на сервере не перенаправляем, состояние авторизации будет проверено в браузере
    if (import.meta.server) {
        return
    }

    if (!authStore.isAuthenticated && !publicPages.includes(to.path)) {
        return navigateTo('/login')
    }

    if (authStore.isAuthenticated && publicPages.includes(to.path)) {
        const nuxtApp = useNuxtApp()

        return navigateTo('/home', {
            replace: true,
            external: nuxtApp.isHydrating
        })
}
})
