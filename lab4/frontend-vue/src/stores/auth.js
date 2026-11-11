import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// Импортируем правильные функции из api.js
import { loginUser as apiLogin, logoutUser as apiLogout, refreshToken } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
    // 1. Состояние (только в памяти)
    const user = ref(null)
    const accessToken = ref(null)

    // 2. Геттеры
    const isAuthenticated = computed(() => !!accessToken.value)
    const isAdmin = computed(() => user.value?.role === 'ADMIN')

    // 3. Действия
    async function login(email, password) {
        const data = await apiLogin(email, password)
        accessToken.value = data.accessToken
        user.value = data.user
    }

    async function logout() {
        await apiLogout() // Очищаем куки на сервере
        accessToken.value = null
        user.value = null
    }

    // 4. Восстановление сессии при F5
    async function restoreSession() {
        try {
            // Используем готовую функцию из api.js
            const data = await refreshToken()
            accessToken.value = data.accessToken
            user.value = data.user
        } catch (e) {
            // Если refresh-токен протух — ничего не делаем
            console.log("Сессия не восстановлена:", e.message)
        }
    }

    return { user, accessToken, isAuthenticated, isAdmin, login, logout, restoreSession }
})