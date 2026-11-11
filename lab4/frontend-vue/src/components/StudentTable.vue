<script setup>
// 1. Принимаем данные от родителя (HomePage)
defineProps({
    students: {
        type: Array,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

// 2. Объявляем события, которые таблица отправляет наверх
const emit = defineEmits(['delete', 'edit', 'details'])
</script>

<template>
    <div class="students-table">
        <table>
            <thead>
                <tr>
                    <th>ИСУ</th>
                    <th>ФИО</th>
                    <th>Группа</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <!-- Условный рендеринг: если пусто -->
                <tr v-if="students.length === 0">
                    <td colspan="4" style="text-align: center; padding: 20px;">
                        Студенты не найдены.
                    </td>
                </tr>

                <!-- Цикл вывода студентов -->
                <tr v-for="student in students" :key="student.isu">
                    <td class="isu_tbl">{{ student.isu }}</td>
                    <td class="fio_tbl">{{ student.fio }}</td>
                    <td>{{ student.group }}</td>
                    <td class="actions-col">
                        <div class="btn-group">
                            <button class="btn-details" @click="emit('details', student.isu)">
                                Подробнее
                            </button>

                            <!-- Кнопки редактирования и удаления только для админа -->
                            <template v-if="isAdmin">
                                <button class="btn-edit" @click="emit('edit', student.isu)">
                                    Редактировать
                                </button>
                                <button class="btn-delete" @click="emit('delete', student.isu)">
                                    Удалить
                                </button>
                            </template>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
</style>