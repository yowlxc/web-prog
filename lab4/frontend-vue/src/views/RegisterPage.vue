<template>
    <div id="reg-screen">
        <div v-if="errorMessage" class="auth-message" role="alert" aria-live="polite">
            {{ errorMessage }}
        </div>
        <h2>Регистрация</h2>

        <form @submit.prevent = "handleRegister" novalidate>
            <div class="auth-field">
                <label for="register-name">Имя</label>
                <input
                    id="register-name"
                    v-model="name"
                    name="name"
                    type="text"
                    autocomplete="name"
                    required
                >
            </div>

            <div class="auth-field">
                <label for="register-email">Электронная почта</label>
                <input
                    id="register-email"
                    v-model="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                >
            </div>

            <div class="auth-field">
                <label for="register-password">Пароль</label>
                <input
                    id="register-password"
                    v-model="password"
                    name="password"
                    type="password"
                    autocomplete="new-password"
                    required
                >
            </div>

            <div class="auth-actions">
                <button type="submit" :disabled = "isSubmitting"> {{isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}} </button>
                <button type="button" @click="$router.push('/login')"> Назад ко входу </button>
            </div>
        </form>
    </div>
</template>

<script setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/services/api'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

async function handleRegister() {
    console.log('handleRegister() вызван')

    if(!name.value.trim()) {
        errorMessage.value = 'Укажите имя'
        return
    }
    if (name.value.trim().length < 3 || name.value.trim().length > 30) {
        errorMessage.value = 'Имя должно быть от 3 до 30 символов'
        return
    }
    if (!/^[A-Za-zА-Яа-яЁё]+$/.test(name.value.trim())) {
        errorMessage.value = 'Имя должно содержать только буквы'
        return
    }

    if(!email.value.trim()) {
        errorMessage.value = 'Укажите электронную почту'
        return
    }
    if (!/^[^\s@]+@[^\s@]+$/.test(email.value.trim())) {
        errorMessage.value = 'Введите корректный адрес электронной почты'
        return
    }
    if(!password.value.trim()) {
        errorMessage.value = 'Придумайте пароль'
        return
    }
    if (password.value.length < 6 || password.value.length > 64) {
        errorMessage.value = 'Пароль должен содержать от 6 до 64 символов'
        return
    }

    if (isSubmitting.value) return;
    isSubmitting.value = true

    try {
        await registerUser(name.value.trim(), email.value.trim(), password.value)
        router.push('/login')
    } catch (error) {
        console.error('Ошибка регистрации:', error)
        errorMessage.value = error.message
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
</style>
