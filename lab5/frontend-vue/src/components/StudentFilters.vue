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

        <button type="button" class="reset-button" @click="onFilterReset"> Сбросить фильтры </button>

        <p v-if="filterError" class="auth-message">{{ filterError }}</p>
    </aside>
</template>

<script setup>
import { fromEvent, merge } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'

const emit = defineEmits(['reset', 'liveSearch'])

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

function onFilterReset() {
    Object.keys(filters).forEach(key => {
        filters[key] = ''
    })

    filterError.value = ''

    emit('reset')
    emit('liveSearch', {})
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
        debounceTime(500), // ждем 500мс тишины
        map(() => getActiveFilters()) // cобираем текущие значения фильтров
    ).subscribe((activeFilters) => {
        console.log('RxJS: Отправляем живые фильтры', activeFilters)
        emit('liveSearch', activeFilters)
    })
})

// отписываемся при уничтожении компонента (чтобы не было утечек памяти)
onUnmounted(() => {
    if (subscription) subscription.unsubscribe()
})
</script>

<style scoped>
</style>