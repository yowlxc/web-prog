<template>
    <div class="home-page">
        <div class="session-bar" v-if="user">
            <span> Вы вошли как: <strong>{{ user.name }}</strong></span>
            <button @click="$router.push('/profile')">Профиль</button>
        </div>

        <div class="btn-add" v-if="user?.role === 'ADMIN'">
            <button>+ Добавить студента</button>
        </div>

        <!-- Главный контейнер с двумя колонками -->
        <div class="students-content">
            
            <!-- Левая колонка: фильтры -->
            <StudentFilters 
                @apply="onFilterApply" 
                @reset="onFilterReset"
                @liveSearch="onLiveSearch"
            />

            <!-- Правая колонка: сортировка, таблица, пагинация -->
            <div class="students-table">
                <!-- Сортировка -->
                <div class="list-controls">
                    <label for="sort-by">Сортировать по:</label>
                    <select id="sort-by" v-model="sortBy" @change="onSortChange">
                        <option value="isu">ИСУ</option>
                        <option value="fio">ФИО</option>
                        <option value="group">Группа</option>
                        <option value="roomNumber">Комната</option>
                    </select>
                    
                    <select v-model="sortDir" @change="onSortChange">
                        <option value="asc">По возрастанию</option>
                        <option value="desc">По убыванию</option>
                    </select>
                </div>

                <!-- Лоадер и ошибки -->
                <div v-if="isLoading" style="text-align: center; padding: 20px;">Загрузка...</div>
                <div v-else-if="errorMessage" class="auth-message">{{ errorMessage }}</div>

                <!-- Сама таблица -->
                <StudentTable 
                    v-else
                    :students="students"
                    :is-admin="user?.role === 'ADMIN'"
                    @details="handleDetails"
                    @edit="handleEdit"
                    @delete="handleDelete"
                />

                <!-- Пагинация -->
                <div class="pagination">
                    <button @click="prevPage" :disabled="currentPage === 0 || isLoading">Назад</button>
                    <span>Страница {{ currentPage + 1 }}</span>
                    <!-- Если пришло меньше 8 записей, значит это конец -->
                    <button @click="nextPage" :disabled="students.length < 8 || isLoading">Далее</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import StudentTable from '@/components/StudentTable.vue'
import StudentFilters from '@/components/StudentFilters.vue'
import { getStudents } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user, isAdmin } = storeToRefs(authStore) 
const router = useRouter()

const students = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

// Состояние для API
const currentPage = ref(0)
const sortBy = ref('isu')
const sortDir = ref('asc')
const activeFilters = ref({}) // Храним примененные фильтры

// Загрузка данных
async function loadData() {
    // 1. Если токена нет вообще — даже не пытаемся что-то грузить
    if (!authStore.accessToken) {
        router.push('/login')
        return
    }

    try {
        isLoading.value = true
        errorMessage.value = '' // Очищаем старые ошибки
        
        console.log('Токен в HomePage:', authStore.accessToken)
        const data = await getStudents({
            page: currentPage.value,
            size: 8, 
            sortBy: sortBy.value,
            sortDir: sortDir.value,
            ...activeFilters.value
        }, authStore.accessToken)
        
        students.value = data
    } catch (error) {
        console.error('Ошибка загрузки:', error)
        
        // 2. Если произошла ЛЮБАЯ ошибка при загрузке (401, 403 или сеть)
        // отправляем на логин и чистим сессию.
        authStore.logout()
        router.push('/login')
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    loadData()
})

// --- Обработка фильтров ---
function onFilterApply(newFilters) {
    activeFilters.value = newFilters
    currentPage.value = 0 
    loadData()
}

function onFilterReset() {
    activeFilters.value = {}
    currentPage.value = 0
    loadData()
}

// Сортировка и пагинация 
function onSortChange() {
    currentPage.value = 0
    loadData()
}

function onLiveSearch(newFilters) {
    activeFilters.value = newFilters
    currentPage.value = 0
    loadData() // Загружаем данные с новыми фильтрами
}

function nextPage() { currentPage.value++; loadData() }
function prevPage() { if (currentPage.value > 0) { currentPage.value--; loadData() } }

// Обработчики от таблицы
function handleDetails(isu) { console.log('Details', isu) }
function handleEdit(isu) { console.log('Edit', isu) }
function handleDelete(isu) { console.log('Delete', isu) }
</script>

<style scoped>
</style>