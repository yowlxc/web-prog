<template>
    <div class="auth-page">
        <h2>Личный кабинет</h2>

        <div v-if="user" class="profile-card">
            <div class="profile-info">
                <p><strong>Имя:</strong> {{ user.name }}</p>
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p>
                    <strong>Роль: </strong> 
                    <span :class="user.role === 'ADMIN' ? 'role-admin' : 'role-user'">
                        {{ user.role === 'ADMIN' ? 'Администратор' : 'Пользователь' }}
                    </span>
                </p>
            </div>

            <div class="auth-actions">
                <button @click="handleLogout" :disabled="isLoggingOut" class="btn-logout">
                    {{ isLoggingOut ? 'Выход...' : 'Выйти из системы' }}
                </button>
                <button @click="navigateTo('/home')">
                    К списку студентов
                </button>
            </div>
        </div>
        
        <div v-else>
            <p>Загрузка данных...</p>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const isLoggingOut = ref(false)

async function handleLogout() {
    isLoggingOut.value = true
    try {
        await authStore.logout()
        navigateTo('/login')
    } finally {
        isLoggingOut.value = false
    }
}
</script>

<style scoped>
</style>
