<template>
    <aside class="filters">
        <h2>Фильтры</h2>

        <div class="filter-item">
            <label for="filter-fio">ФИО</label>
            <input type="text" id="filter-fio" v-model="filters.fio" ref="fioInputRef">
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
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { fromEvent } from 'rxjs'
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators'

const emit = defineEmits(['apply', 'reset', 'liveSearch'])

const filters = reactive({
    fio: '',
    group: '',
    isu: '',
    dormNumber: '',
    isForeign: false,
    roomMin: '',
    roomMax: ''
})

// 1. Создаем ссылку на DOM-элемент
const fioInputRef = ref(null)
let fioSubscription

// 2. Настраиваем RxJS при монтировании компонента
onMounted(() => {
    if (!fioInputRef.value) return

    // Создаем поток событий ввода
    const fioInput$ = fromEvent(fioInputRef.value, 'input').pipe(
        map(event => event.target.value), // Берем текст из инпута
        debounceTime(500),                // Ждем 500мс тишины
        distinctUntilChanged()            // Если текст не изменился - игнорируем
    )

    // Подписываемся на поток
    fioSubscription = fioInput$.subscribe((text) => {
        // Отправляем событие наверх в HomePage для живого поиска
        emit('liveSearch', { ...filters, fio: text })
    })
})

onUnmounted(() => fioSubscription?.unsubscribe())

// Для кнопки "Применить" (остальные поля)
function onApply() {
    const activeFilters = {}
    for (const key in filters) {
        if (filters[key] !== '' && filters[key] !== false && filters[key] !== null) {
            activeFilters[key] = filters[key]
        }
    }
    emit('apply', activeFilters)
}

function onReset() {
    filters.fio = ''
    filters.group = ''
    filters.isu = ''
    filters.dormNumber = ''
    filters.isForeign = false
    filters.roomMin = ''
    filters.roomMax = ''
    emit('reset')
}
</script>

<style scoped>
</style>
