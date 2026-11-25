<template>
    <div v-if="errorMessage" class="auth-message" role="alert" aria-live="polite">
        {{ errorMessage }}
    </div>
</template>

<script setup>
defineProps({
    errorMessage: {
        type: String,
        default: ''
    }
})
</script>