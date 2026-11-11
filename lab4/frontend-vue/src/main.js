import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
await useAuthStore().restoreSession()
app.use(router)

app.mount('#app')
