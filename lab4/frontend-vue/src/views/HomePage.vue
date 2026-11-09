<template>
        <section id="auth-screen">
        <div id="auth-message"
            class="auth-message hidden"
            role="alert"
            aria-live="polite"></div>

        <!-- Вход -->
        <section id="login-panel" class="auth-panel">
            <h2>Вход в систему</h2>

            <form id="login-form" method="post">
                <div class="auth-field">
                    <label for="login-login">Логин</label>
                    <input
                        id="login-login"
                        name="login"
                        type="text"
                        autocomplete="username"
                        required
                    >
                </div>

                <div class="auth-field">
                    <label for="login-password">Пароль</label>
                    <input
                        id="login-password"
                        name="password"
                        type="password"
                        autocomplete="current-password"
                        required
                    >
                </div>

                <div class="auth-actions">
                    <button type="submit">Войти</button>
                    <button type="button" id="btn-show-register">
                        Регистрация
                    </button>
                </div>
            </form>
        </section>
</template>

<script>
</script>

<style scoped>
</style>