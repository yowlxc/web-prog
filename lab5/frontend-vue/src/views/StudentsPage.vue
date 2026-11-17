<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStudent } from '@/services/api'

const route = useRoute()
const router = useRouter()

const student = ref(null)
const errorMessage = ref('')
const isLoading = ref(true)

onMounted(async () => {
    try {
        student.value = await getStudent(route.params.isu)
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <section class="students-page">
        <button @click="router.push('/')">Назад</button>
        <h2>Досье студента</h2>

        <p v-if="errorMessage" class="auth-message">{{ errorMessage }}</p>
        <p v-else-if="isLoading">Загрузка...</p>

        <div v-else>
            <p><strong>ФИО:</strong> {{ student.fio }}</p>
            <p><strong>Группа:</strong> {{ student.group }}</p>
            <p><strong>ИСУ:</strong> {{ student.isu }}</p>
            <p><strong>Общежитие:</strong> {{ student.dormNumber }}</p>
            <p><strong>Комната:</strong> {{ student.roomNumber }}</p>
            <p><strong>Дата заселения:</strong> {{ student.dateInDorm?.split('-').reverse().join('.') }}</p>
            <p><strong>Иностранец:</strong> {{ student.isForeign ? 'Да' : 'Нет' }}</p>
            <p><strong>Примечания:</strong> {{ student.notes || '' }}</p>
        </div>
    </section>
</template>
