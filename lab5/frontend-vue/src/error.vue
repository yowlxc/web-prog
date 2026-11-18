<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(
  () => props.error.statusCode === 404
)

const goHome = async () => {
  await clearError({
    redirect: '/home'
  })
}
</script>

<template>
  <main class="error-page">
    <div class="error-card">
      <div class="logo">
        <span>Мониторинг студентов</span>
      </div>

      <div class="error-content">
        <h1>{{ error.statusCode }}</h1>

        <h2>
          {{ is404
            ? 'Страница не найдена'
            : 'Произошла ошибка'
          }}
        </h2>

        <p>
          {{ is404
            ? 'Страница не найдена'
            : 'Не удалось выполнить запрос. Попробуйте позже.'
          }}
        </p>

        <button
          type="button"
          @click="goHome"
        >
          ← Вернуться к студентам
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.error-page {
  max-width: 540px;
  margin: 5vh auto;
  color: #333;
  font-family: Arial, Helvetica, sans-serif;
}

.error-card {
  padding: 30px;
  background: #f8f8f8;
  border: 1px solid #cacaca;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1em;
  font-weight: 600;
  color: rgb(18, 29, 50);
}

.logo-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  background: #0066ff;
  color: #f8f8f8;
  border: 2px solid #0049b6;
  border-radius: 8px;
}

.error-content {
  padding-top: 25px;
}

h1 {
  margin: 0 0 15px;
  font-size: clamp(64px, 15vw, 88px);
  font-weight: 600;
  line-height: 1.1;
  color: rgb(18, 29, 50);
}

h2 {
  margin: 0 0 20px;
  font-size: 1.4em;
  font-weight: 600;
  color: rgb(18, 29, 50);
  text-transform: uppercase;
}

p {
  margin: 0 auto 25px;
  max-width: 380px;
  font-size: 0.95em;
  line-height: 1.6;
  color: #414141;
}

button {
  padding: 8px 16px;
  background: #0066ff;
  color: #f8f8f8;
  border: 2px solid #0049b6;
  border-radius: 8px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background: #247bff;
}

button:focus-visible {
  outline: 3px solid #0049b6;
  outline-offset: 3px;
}

@media (max-width: 480px) {
  .error-card {
    padding: 25px 15px;
  }

  h2 {
    font-size: 1.2em;
  }

  button {
    max-width: 100%;
    margin: 0;
  }
}
</style>