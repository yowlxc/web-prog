export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    if (!authStore.isAdmin) {
        const errorState = useState<string>('globalError', () => '')
        errorState.value = 'Доступ запрещён! Вы не администратор.'

        return navigateTo('/home')
    }
})