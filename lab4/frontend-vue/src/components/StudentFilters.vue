<template>
    <aside class="filters">
        <h2>Фильтры</h2>

        <div class="filter-item">
            <label for="filter-fio">ФИО</label>
            <input type="text" id="filter-fio" v-model="filters.fio">
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

        <div class="filter-item filter-checkbox">
            <label class="checkbox-label">
                <input type="checkbox" v-model="filters.isForeign">
                <span class="custom-checkbox"></span>
                <span>Иностранец</span>
            </label>
        </div>

        <div class="filter-item">
            <label>Номер комнаты</label>
            <div class="room-range">
                <input type="number" v-model="filters.roomMin" placeholder="От">
                <input type="number" v-model="filters.roomMax" placeholder="До">
            </div>
        </div>

        <button type="button" class="btn-filter" @click="onApply">
            Применить
        </button>

        <button type="button" class="btn-reset" @click="onReset">
            Сбросить
        </button>
    </aside>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['apply', 'reset'])

const filters = reactive({
    fio: '',
    group: '',
    isu: '',
    dormNumber: '',
    isForeign: false,
    roomMin: '',
    roomMax: ''
})

// Кнопка "Применить"
function onApply() {
    const activeFilters = {}
    for (const key in filters) {
        if (filters[key] !== '' && filters[key] !== false && filters[key] !== null) {
            activeFilters[key] = filters[key]
        }
    }
    // Отправляем наверх
    emit('apply', activeFilters)
}

// Кнопка "Сбросить"
function onReset() {
    filters.fio = ''
    filters.group = ''
    filters.isu = ''
    filters.dormNumber = ''
    filters.isForeign = false
    filters.roomMin = ''
    filters.roomMax = ''
    // Отправляем наверх
    emit('reset')
}
</script>

<style scoped>
</style>