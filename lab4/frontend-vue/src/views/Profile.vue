<template>
    <div class="auth-page">
        <h2>Личный кабинет</h2>

        <div v-if="user" class="profile-card">
            <div class="profile-info">
                <p><strong>Имя:</strong> {{ user.name }}</p>
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p>
                    <strong>Роль: </strong> 
                    <!-- Условный рендеринг: если ADMIN, показываем красным, иначе синим -->
                    <span :class="user.role === 'ADMIN' ? 'role-admin' : 'role-user'">
                        {{ user.role === 'ADMIN' ? 'Администратор' : 'Пользователь' }}
                    </span>
                </p>
            </div>

            <div class="auth-actions">
                <button @click="handleLogout" :disabled="isLoggingOut" class="btn-logout">
                    {{ isLoggingOut ? 'Выход...' : 'Выйти из системы' }}
                </button>
                <button @click="$router.push('/')">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logoutUser } from '@/services/api'

const router = useRouter()
const user = ref(null)
const isLoggingOut = ref(false)

// Хук жизненного цикла: выполняется при загрузке страницы
onMounted(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
        user.value = JSON.parse(savedUser)
    } else {
        // Если данных нет (не залогинен), кидаем на вход
        router.push('/login')
    }
})

async function handleLogout() {
    isLoggingOut.value = true
    try {
        await logoutUser()
        // После выхода переходим на страницу логина
        router.push('/login')
    } finally {
        isLoggingOut.value = false
    }
}
</script>

<style scoped>
.profile-card {
    background: #f8f8f8;
    border: 2px solid #ababab;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.profile-info p {
    font-size: 1.1em;
    margin: 10px 0;
    text-transform: none;
}

.role-admin {
    color: #28c700;
    font-weight: bold;
}

.role-user {
    color: #7e96ff;
    font-weight: bold;
}

.btn-logout {
    background-color: #555;
    border-color: #333;
}

.btn-logout:hover {
    background-color: #707070;
}
</style>
