<template>
    <div class="home-page">
        <div class="session-bar" v-if="isMounted && user">
            <span> Вы вошли как: <strong>{{ user.name }}</strong></span>
            <button @click="navigateTo('/profile')">Профиль</button>
        </div>

       <div class="btn-add" v-if="isMounted && isAdmin">
            <button @click="navigateTo('/students/new')">+ Добавить студента</button>
        </div>

        <div class="students-content">
            
            <StudentFilters 
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

                <div
                    v-if="isLoading"
                    class="table-wrapper"
                    aria-label="Загрузка студентов"
                    aria-busy="true"
                >
                    <table>
                        <thead>
                            <tr>
                                <th>ИСУ</th>
                                <th>ФИО</th>
                                <th>Группа</th>
                                <th class="actions-col">Действия</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="row in 8" :key="row" aria-hidden="true">
                                <td class="isu_tbl">
                                    <span class="skeleton-cell"></span>
                                </td>
                                <td class="fio_tbl">
                                    <span class="skeleton-cell"></span>
                                </td>
                                <td>
                                    <span class="skeleton-cell"></span>
                                </td>
                                <td class="actions-col">
                                    <div class="btn-group">
                                        <span
                                            v-for="button in (isAdmin ? 3 : 1)"
                                            :key="button"
                                            class="skeleton-cell skeleton-button"
                                        ></span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="errorMessage && !isLoading">
                    <ErrorMessage :error-message="errorMessage" />
                </div>

                <StudentTable 
                    v-if="!isLoading && !errorMessage"
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
                    <button @click="nextPage" :disabled="students.length < 3000 || isLoading">Далее</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { deleteStudent, clearStudentsCache } from '@/services/api'
import { createStudentSearch } from '@/services/studentSearch'
import { storeToRefs } from 'pinia'
import { fromEvent } from 'rxjs' 

const isMounted = ref(false)
const authStore = useAuthStore()
const { user, isAdmin } = storeToRefs(authStore)

const students = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const deletingIsu = ref(null)

const currentPage = ref(0)
const sortBy = ref('isu')
const sortDir = ref('asc')
const activeFilters = ref({})

let isFirstLoad = true 

const search = createStudentSearch(
    () => {
        if (isFirstLoad) {
            isLoading.value = true
        }
        errorMessage.value = ''
    },
    data => {
        students.value = data
        isLoading.value = false
        isFirstLoad = false
    },
    error => {
        errorMessage.value = error.message
        isLoading.value = false
        isFirstLoad = false
        if (!authStore.isAuthenticated) navigateTo('/login')
    }
)

function loadData(live = false) {
    if (!authStore.accessToken) {
        navigateTo('/login')
        return
    }
    search.search({
        page: currentPage.value,
        size: 1000,
        sortBy: sortBy.value,
        sortDir: sortDir.value,
        ...activeFilters.value
    }, live)
}

function onFilterReset() {
    activeFilters.value = {}
    currentPage.value = 0
    loadData() 
}

let sseSubscription = null
let eventSource = null

onMounted(() => {
    isMounted.value = true

    const errorState = useState<string>('adminError', () => '')
    if (errorState.value) {
        errorMessage.value = errorState.value 
        errorState.value = '' 
    }
    loadData()
    if (process.client) {
        eventSource = new EventSource('/api/students/stream')
        eventSource.onerror = () => eventSource.close() //защита от спама
        sseSubscription = fromEvent(eventSource, 'update').subscribe(() => {
            console.log('Сервер сообщил об изменениях. Обновляем данные')
            clearStudentsCache()
            loadData(true) 
        })
    }
})

onUnmounted(() => {
    // Отключаемся от SSE и RxJS при уходе со страницы
    if (sseSubscription) sseSubscription.unsubscribe()
    if (eventSource) eventSource.close()
    search.stop()
})

function onLiveSearch(newFilters) {
    activeFilters.value = newFilters
    currentPage.value = 0
    loadData(true)
}

function onSortChange() {
    currentPage.value = 0
    loadData()
}

function nextPage() { currentPage.value++; loadData() }
function prevPage() { if (currentPage.value > 0) { currentPage.value--; loadData() } }

function handleDetails(isu) {
    navigateTo(`/students/${isu}/dosie`)
}
function handleEdit(isu) {
    console.log('ИСУ получен в handleEdit:', isu)
    const path = `/students/${isu}/edit`
    console.log('Переход по адресу:', path)
    navigateTo(path)
}

async function handleDelete(isu) {
    if (deletingIsu.value !== null) return
    if (!confirm(`Удалить студента с ИСУ ${isu}?`)) return

    deletingIsu.value = isu
    try {
        await deleteStudent(isu)
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
