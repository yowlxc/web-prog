<template>
    <aside class="filters">
        <h2>Фильтры</h2>

        <div class="filter-item">
            <label for="filter-fio">ФИО</label>
            <input type="text" id="filter-fio" v-model="filters.fio" ref="fioRef">
        </div>

        <div class="filter-item">
            <label for="filter-group">Группа</label>
            <input type="text" id="filter-group" v-model="filters.group" maxlength="5" ref="groupRef">
        </div>

        <div class="filter-item">
            <label for="filter-isu">ИСУ</label>
            <input type="number" id="filter-isu" v-model="filters.isu" maxlength="6" ref="isuRef">
        </div>

        <div class="filter-item">
            <label for="filter-dormitory">Общежитие</label>
            <input type="number" id="filter-dormitory" v-model="filters.dormNumber" ref="dormRef">
        </div>

        <div class="filter-item">
            <label for="filter-foreign">Иностранец</label>
            <select id="filter-foreign" v-model="filters.isForeign" ref="foreignRef">
                <option value="">Любой</option>
                <option :value="true">Да</option>
                <option :value="false">Нет</option>
            </select>
        </div>

        <div class="filter-item">
            <label>Номер комнаты</label>
            <div class="room-range">
                <input type="number" v-model="filters.roomMin" placeholder="От" ref="roomMinRef">
                <input type="number" v-model="filters.roomMax" placeholder="До" ref="roomMaxRef">
            </div>
        </div>

        <div class="filter-item">
            <label>Дата заселения</label>
            <div class="room-range">
                <input type="date" v-model="filters.dateFrom" aria-label="Дата от" ref="dateFromRef">
                <input type="date" v-model="filters.dateTo" aria-label="Дата до" ref="dateToRef">
            </div>
        </div>

        <p v-if="filterError" class="auth-message">{{ filterError }}</p>

        <button type="button" class="btn-filter" @click="onApply">
            Применить
        </button>

        <button type="button" class="btn-reset" @click="onReset">
            Сбросить
        </button>
    </aside>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { fromEvent, merge, Subscription } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'

const emit = defineEmits(['apply', 'reset', 'liveSearch'])

const filters = reactive({
    fio: '',
    group: '',
    isu: '',
    dormNumber: '',
    isForeign: '',
    roomMin: '',
    roomMax: '',
    dateFrom: '',
    dateTo: '',
})
const filterError = ref('')

// Ссылки на DOM-элементы
const fioRef = ref(null)
const groupRef = ref(null)
const isuRef = ref(null)
const dormRef = ref(null)
const foreignRef = ref(null)
const roomMinRef = ref(null)
const roomMaxRef = ref(null)
const dateFromRef = ref(null)
const dateToRef = ref(null)

let subscription = null

function getActiveFilters() {
    const result = {}
    for (const key in filters) {
        if (filters[key] !== '' && filters[key] !== null) result[key] = filters[key]
    }
    return result
}

onMounted(() => {
    // создаем потоки событий 'input' (или 'change' для select/date) от каждого инпута
    const inputs = [
        fromEvent(fioRef.value, 'input'),
        fromEvent(groupRef.value, 'input'),
        fromEvent(isuRef.value, 'input'),
        fromEvent(dormRef.value, 'input'),
        fromEvent(foreignRef.value, 'change'),
        fromEvent(roomMinRef.value, 'input'),
        fromEvent(roomMaxRef.value, 'input'),
        fromEvent(dateFromRef.value, 'change'),
        fromEvent(dateToRef.value, 'change')
    ]

    subscription = merge(...inputs).pipe(
        debounceTime(500), // Ждем 500мс тишины
        map(() => getActiveFilters()) // Собираем текущие значения фильтров
    ).subscribe((activeFilters) => {
        console.log('RxJS: Отправляем живые фильтры', activeFilters)
        emit('liveSearch', activeFilters)
    })
})

// отписываемся при уничтожении компонента (чтобы не было утечек памяти)
onUnmounted(() => {
    if (subscription) subscription.unsubscribe()
})

function onApply() {
    filterError.value = ''
    if (filters.roomMin && filters.roomMax && Number(filters.roomMin) > Number(filters.roomMax)) {
        filterError.value = 'Начало диапазона комнат больше конца'
        return
    }
    if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
        filterError.value = 'Начало диапазона дат позже конца'
        return
    }
    emit('apply', getActiveFilters())
}

function onReset() {
    filters.fio = ''
    filters.group = ''
    filters.isu = ''
    filters.dormNumber = ''
    filters.isForeign = ''
    filters.roomMin = ''
    filters.roomMax = ''
    filters.dateFrom = ''
    filters.dateTo = ''
    filterError.value = ''
    emit('reset')
}
</script>

<style scoped>
</style>