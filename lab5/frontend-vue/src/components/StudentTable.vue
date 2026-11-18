<script setup>
defineProps({
    students: { type: Array, required: true },
    isAdmin: { type: Boolean, default: false }
})
const emit = defineEmits(['delete', 'edit', 'details'])
</script>

<template>
    <div class="table-wrapper">
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
                <tr v-if="students.length === 0">
                    <td colspan="4" style="text-align: center; padding: 20px;">
                        Студенты не найдены.
                    </td>
                </tr>
                
                <tr v-for="student in students" :key="student.isu">
                    <td class="isu_tbl">{{ student.isu }}</td>
                    <td class="fio_tbl">{{ student.fio }}</td>
                    <td>{{ student.group }}</td>
                    <td class="actions-col">
                        <div class="btn-group">
                            <button type="button" @click="emit('details', student.isu)">
                                Подробнее
                            </button>
                            <template v-if="isAdmin">
                                <button type="button" @click="() => {
                                    console.log('Объект студента:', student)
                                    console.log('Передаваемый ИСУ:', student.isu)
                                    emit('edit', student.isu)
                                }"
                                >
                                    Редактировать
                                </button>
                                <button type="button" @click="emit('delete', student.isu)">
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
.table-wrapper {
    width: 100%;
    overflow-x: auto;
}
</style>