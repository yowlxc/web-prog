<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createStudent, getStudent, updateStudent } from '@/services/api'

const route = useRoute()
const router = useRouter()
const errorMessage = ref('')
const isLoading = ref(!!route.params.isu)
const isSaving = ref(false)
const isEditMode = !!route.params.isu
const today = new Date().toLocaleDateString('sv-SE')

const student = reactive({
    isu: null,
    fio: '',
    group: '',
    dormNumber: null,
    roomNumber: null,
    dateInDorm: '',
    isForeign: false,
    notes: ''
})

onMounted(async () => {
    if (!isEditMode) return

    isLoading.value = true
    try {
        const savedStudent = await getStudent(route.params.isu)
        Object.assign(student, savedStudent)
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        isLoading.value = false
    }
})

async function handleSubmit() {
    if (isSaving.value) return
    errorMessage.value = ''
    isSaving.value = true

    try {
        const saved = isEditMode
            ? await updateStudent(route.params.isu, student)
            : await createStudent(student)
        router.push(`/students/${saved.isu}`)
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        isSaving.value = false
    }
}
</script>

<template>
    <section class="student-form">
        <h2>{{ isEditMode ? 'Форма редактирования студента' : 'Форма добавления студента' }}</h2>
        <p v-if="errorMessage" class="auth-message">{{ errorMessage }}</p>
        <p v-if="isLoading">Загрузка...</p>

        <form v-else-if="!isEditMode || student.isu" @submit.prevent="handleSubmit">
            <div class="form-data">
                <label for="fio">ФИО</label>
                <input id="fio" v-model="student.fio" type="text" required
                       minlength="2" maxlength="50"
                       pattern="[А-Яа-яЁё]+( [А-Яа-яЁё]+)+"
                       placeholder="Иванов Иван Иванович">
            </div>

            <div class="form-data">
                <label for="group">Группа</label>
                <input id="group" v-model="student.group" type="text" required
                       minlength="5" maxlength="5" pattern="[A-Z][1-9][0-9]{3}"
                       placeholder="P1234">
            </div>

            <div class="form-data">
                <label for="isu">ИСУ</label>
                <input id="isu" v-model.number="student.isu" type="number" required
                       min="100000" max="999999" placeholder="123456" :readonly="isEditMode">
            </div>

            <div class="form-data">
                <label for="num-dorm">Номер общежития</label>
                <input id="num-dorm" v-model.number="student.dormNumber" type="number" required
                       min="1" max="100" placeholder="3">
            </div>

            <div class="form-data">
                <label for="num-room">Номер комнаты</label>
                <input id="num-room" v-model.number="student.roomNumber" type="number" required
                       min="1" max="99999" placeholder="804">
            </div>

            <div class="form-data">
                <label for="date-in-dorm">Дата заселения</label>
                <input id="date-in-dorm" v-model="student.dateInDorm" type="date" required
                       min="1999-01-01" :max="today">
            </div>

            <div class="form-no-rus">
                <label for="no-rus">Иностранец</label>
                <input id="no-rus" v-model="student.isForeign" type="checkbox">
            </div>

            <div class="form-notes">
                <label for="notes">Примечания</label>
                <textarea id="notes" v-model="student.notes" maxlength="300"
                          placeholder="Разбил окно"></textarea>
            </div>

            <div class="btn-form">
                <button type="submit" :disabled="isSaving">
                    {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
                </button>
                <button type="button" @click="router.push('/')">Отмена</button>
            </div>
        </form>
    </section>
</template>
