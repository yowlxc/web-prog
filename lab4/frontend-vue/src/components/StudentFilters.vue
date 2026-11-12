<template>
    <aside class="filters">
        <h2>Фильтры</h2>

        <div class="filter-item">
            <label for="filter-fio">ФИО</label>
            <input type="text" id="filter-fio" v-model="filters.fio" @input="onLiveSearch">
        </div>

        <div class="filter-item">
            <label for="filter-group">Группа</label>
            <input type="text" id="filter-group" v-model="filters.group" maxlength="5">
        </div>

        <div class="filter-item">
            <label for="filter-isu">ИСУ</label>
            <input type="text" id="filter-isu" v-model="filters.isu" maxlength="6">
        </div>

        <div class="filter-item">
            <label for="filter-dormitory">Общежитие</label>
            <input type="number" id="filter-dormitory" v-model="filters.dormNumber">
        </div>

        <div class="filter-item">
            <label for="filter-foreign">Иностранец</label>
            <select id="filter-foreign" v-model="filters.isForeign">
                <option value="">Любой</option>
                <option :value="true">Да</option>
                <option :value="false">Нет</option>
            </select>
        </div>

        <div class="filter-item">
            <label>Номер комнаты</label>
            <div class="room-range">
                <input type="number" v-model="filters.roomMin" placeholder="От">
                <input type="number" v-model="filters.roomMax" placeholder="До">
            </div>
        </div>

        <div class="filter-item">
            <label>Дата заселения</label>
            <div class="room-range">
                <input type="date" v-model="filters.dateFrom" aria-label="Дата от">
                <input type="date" v-model="filters.dateTo" aria-label="Дата до">
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
import { reactive, ref } from 'vue'

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

function activeFilters() {
    const result = {}
    for (const key in filters) {
        if (filters[key] !== '' && filters[key] !== null) result[key] = filters[key]
    }
    return result
}

function onLiveSearch() {
    emit('liveSearch', activeFilters())
}

// Для кнопки "Применить" (остальные поля)
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
    emit('apply', activeFilters())
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
