<template>
    <div class="auth-page">
        <div v-if="errorMessage" class="auth-message" role="alert" aria-live="polite">
            {{ errorMessage }}
        </div>

        <h2>Вход в систему</h2>

        <form @submit.prevent = "handleLogin" novalidate>
            <div class="auth-field">
                <label for="login-email">Электронная почта</label>
                <input
                    id="login-email"
                    v-model="email"
                    name="email"
                    type="email"
                    autocomplete="username"
                    required
                >
            </div>

            <div class="auth-field">
                <label for="login-password">Пароль</label>
                <input
                    id="login-password"
                    v-model="password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    required
                >
            </div>

            <div class="auth-actions">
                <button type="submit" :disabled="isSubmitting">{{ isSubmitting ? 'Вход…' : 'Войти' }}</button>
                <button type="button" @click="$router.push('/register')"> Регистрация</button>
            </div>
        </form>
    </div>
</template>

<script setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '@/services/api'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

async function handleLogin() {
    console.log('handleSubmit вызван')

    errorMessage.value = ''

    if(!email.value.trim()) errorMessage.value = 'Укажите электронную почту'
    if(!password.value.trim()) errorMessage.value = 'Введите пароль'

    if (isSubmitting.value) return
    isSubmitting.value = true

    try {
        const user = await loginUser(email.value.trim(), password.value)
        // TODO: позже сделаю редирект на страницу со студентами
        console.log('Успешный вход', user)
        console.log('Логин:', email.value, password.value)

        router.push('/')
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        isSubmitting.value = false
    }
}


</script>

<style scoped>
</style>