export default defineNuxtRouteMiddleware(() => {
    if (import.meta.server) return

    const authStore = useAuthStore()

    if (!authStore.isAdmin) {
        const errorState = useState('adminError', () => '')
        errorState.value = 'Доступ запрещён! Вы не администратор.'

        return navigateTo('/home', { replace: true })
    }
})