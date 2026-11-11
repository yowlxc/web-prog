<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  // При старте приложения, если в памяти нет токена,
  // пробуем восстановить сессию через refresh-cookie.
  if (!authStore.accessToken) {
    await authStore.restoreSession()
  }
})
</script>