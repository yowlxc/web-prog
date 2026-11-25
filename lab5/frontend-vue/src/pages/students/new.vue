<template>
  <StudentForm :student-id="route.params.id" />
</template>

<script setup>
import StudentForm from '~/components/StudentForm.vue'
const route = useRoute()
</script>