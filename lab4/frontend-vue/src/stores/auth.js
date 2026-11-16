import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

    async function restoreSession() {
        try {
            const data = await refreshToken()
            accessToken.value = data.accessToken
            user.value = data.user
        } catch (e) {
            accessToken.value = null
            user.value = null
        }
    }

    return { user, accessToken, isAuthenticated, isAdmin, login, logout, restoreSession }
})
