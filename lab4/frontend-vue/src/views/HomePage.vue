<template>
    <div class="home-page">
        <div class="session-bar" v-if="user">
            <span> Вы вошли как: <strong>{{ user.name }}</strong></span>
            <button @click="$router.push('/profile')">Профиль</button>
        </div>

        <div class="btn-add" v-if="isAdmin">
            <button @click="router.push('/students/new')">+ Добавить студента</button>
        </div>

        <div class="students-content">
            
            <StudentFilters 
                @apply="onFilterApply" 
                @reset="onFilterReset"
                @liveSearch="onLiveSearch"
            />

            <div class="students-table">
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

                <div v-if="isLoading" style="text-align: center; padding: 20px;">Загрузка...</div>
                <div v-else-if="errorMessage" class="auth-message">{{ errorMessage }}</div>

                <StudentTable 
                    v-else
                    :students="students"
                    :is-admin="isAdmin"
                    :deleting-isu="deletingIsu"
                    @details="handleDetails"
                    @edit="handleEdit"
                    @delete="handleDelete"
                />

                <div class="pagination">
                    <button @click="prevPage" :disabled="currentPage === 0 || isLoading">Назад</button>
                    <span>Страница {{ currentPage + 1 }}</span>
                    <button @click="nextPage" :disabled="students.length < 8 || isLoading">Далее</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import StudentTable from '@/components/StudentTable.vue'
import StudentFilters from '@/components/StudentFilters.vue'
import { deleteStudent } from '@/services/api'
import { createStudentSearch } from '@/services/studentSearch'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user, isAdmin } = storeToRefs(authStore)
const router = useRouter()

const students = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const deletingIsu = ref(null)

const currentPage = ref(0)
const sortBy = ref('isu')
const sortDir = ref('asc')
const activeFilters = ref({})

const search = createStudentSearch(
    () => {
        isLoading.value = true
        errorMessage.value = ''
    },
    data => {
        students.value = data
        isLoading.value = false
    },
    error => {
        errorMessage.value = error.message
        isLoading.value = false
        if (!authStore.isAuthenticated) router.push('/login')
    }
)

function loadData(live = false) {
    if (!authStore.accessToken) {
        router.push('/login')
        return
    }
    search.search({
        page: currentPage.value,
        size: 8,
        sortBy: sortBy.value,
        sortDir: sortDir.value,
        ...activeFilters.value
    }, live)
}

onMounted(() => {
    loadData()
})
onUnmounted(() => search.stop())

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

function onSortChange() {
    currentPage.value = 0
    loadData()
}

function onLiveSearch(newFilters) {
    activeFilters.value = newFilters
    currentPage.value = 0
    loadData(true)
}

function nextPage() { currentPage.value++; loadData() }
function prevPage() { if (currentPage.value > 0) { currentPage.value--; loadData() } }

function handleDetails(isu) {
    router.push(`/students/${isu}`)
}
function handleEdit(isu) {
    router.push(`/students/${isu}/edit`)
}

async function handleDelete(isu) {
    if (deletingIsu.value !== null) return
    if (!confirm(`Удалить студента с ИСУ ${isu}?`)) return

    deletingIsu.value = isu
    try {
        await deleteStudent(isu)
        if (students.value.length === 1 && currentPage.value > 0) {
            currentPage.value--
        }
        loadData()
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        deletingIsu.value = null
    }
}
</script>

<style scoped>
</style>
