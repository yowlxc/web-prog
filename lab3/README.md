# Лабораторная работа 3

Backend: Spring Boot, JPA, SQLite. Frontend: HTML, CSS, JavaScript.

## Запуск

1. Перейдите в `backend-java`.
2. Задайте переменные окружения по образцу `.env.example`. `JWT_SECRET` — Base64-строка минимум из 32 случайных байт. `ADMIN_LOGIN`, `ADMIN_NAME` и `ADMIN_PASSWORD` нужны при первом запуске для создания администратора. Если пользователь с указанным логином уже существует, его роль автоматически не меняется.
3. Запустите `mvnw.cmd spring-boot:run` на Windows или `./mvnw spring-boot:run` на Linux/macOS.
4. Откройте `frontend/index.html` через Live Server на порту 5500. Адрес frontend должен быть указан в `FRONTEND_ORIGINS`.

Пример для PowerShell:

```powershell
$env:JWT_SECRET = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
$env:ADMIN_LOGIN = "admin"
$env:ADMIN_NAME = "Administrator"
$env:ADMIN_PASSWORD = "your-strong-password"
.\mvnw.cmd spring-boot:run
```

База SQLite по умолчанию находится в `backend-java/students.db`. Путь можно изменить через `DB_URL`.

## API

Описание API находится в `backend-java/openapi.yaml`. Его можно импортировать в Swagger Editor. Сценарии регистрации, входа, обновления токена, разных ролей и операций со студентами находятся в `backend-java/postman_collection.json`.

Перед изменяющими запросами к `/api/users` и `/api/auth` получите CSRF-токен через `GET /api/auth/csrf` и передавайте его в заголовке `X-XSRF-TOKEN`, сохраняя cookie. Для защищённых запросов к студентам передавайте `Authorization: Bearer <accessToken>`.

Список студентов возвращается массивом. Для него доступны параметры `page` (с нуля), `size` (1–100), `sortBy` и `sortDir` (`asc` или `desc`) вместе с фильтрами.
