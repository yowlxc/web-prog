import { defineStore } from 'pinia'
import { loginUser as apiLogin, logoutUser as apiLogout, refreshToken } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const accessToken = ref(null)

    const isAuthenticated = computed(() => !!accessToken.value)
    const isAdmin = computed(() => user.value?.role === 'ADMIN')

    async function login(email, password) {
        const data = await apiLogin(email, password)
        accessToken.value = data.accessToken
        user.value = data.user
    }

    async function logout() {
        await apiLogout()
        accessToken.value = null
        user.value = null
    }

    let restorePromise = null

    async function restoreSession() {
        if (restorePromise) {
            return restorePromise
        }

        restorePromise = (async () => {
            try {
                const data = await refreshToken()
                accessToken.value = data.accessToken
                user.value = data.user
                return true
            } catch (e) {
                accessToken.value = null
                user.value = null
                return false
            } finally {
                restorePromise = null
            }
        })()

        return restorePromise
    }

    return { user, accessToken, isAuthenticated, isAdmin, login, logout, restoreSession }
})
