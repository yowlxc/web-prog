<template>
  <ClientOnly>
    <StudentForm />
  </ClientOnly>
</template>

<script setup>
import StudentForm from '~/components/StudentForm.vue'

definePageMeta({ middleware: 'admin' })
</script>