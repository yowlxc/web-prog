<template>
    <div class="home-page">
        <div class="session-bar" v-if="user">
            <span> Вы вошли как: <strong>{{ user.name }}</strong></span>
            <button @click="$router.push('/profile')">Профиль</button>
        </div>

        <div class="btn-add" v-if="user?.role === 'ADMIN'">
            <button @click="router.push('/students/new')">+ Добавить студента</button>
        </div>

        <!-- Главный контейнер с двумя колонками -->
        <div class="students-content">
            
            <!-- Левая колонка: фильтры -->
            <StudentFilters 
                @apply="onFilterApply" 
                @reset="onFilterReset"
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

const router = useRouter()

const students = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

// Состояние для API
const currentPage = ref(0)
const sortBy = ref('isu')
const sortDir = ref('asc')
const activeFilters = ref({}) // Храним примененные фильтры

const user = ref(null)

// Загрузка данных
async function loadData() {
    try {
        isLoading.value = true
        errorMessage.value = ''
        
        const data = await getStudents({
            page: currentPage.value,
            size: 8, 
            sortBy: sortBy.value,
            sortDir: sortDir.value,
            ...activeFilters.value 
        })
        students.value = data
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) user.value = JSON.parse(savedUser)
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

function nextPage() { currentPage.value++; loadData() }
function prevPage() { if (currentPage.value > 0) { currentPage.value--; loadData() } }

// Обработчики от таблицы
function handleDetails(isu) {
    router.push(`/students/${isu}`)
}
function handleEdit(isu) { console.log('Edit', isu) }
function handleDelete(isu) { console.log('Delete', isu) }
</script>

<style scoped>
</style>