const API_BASE_URL = "http://localhost:8080";

// 1. Получение CSRF-токена (обязательно для изменяющих запросов)
async function fetchCsrfToken() {
    const response = await fetch(`${API_BASE_URL}/api/auth/csrf`, {
        credentials: "include" // Чтобы браузер сохранил cookie
    });
    if (!response.ok) throw new Error("Не удалось получить CSRF-токен");
    const data = await response.json();
    return data.csrfToken;
}

// 2. Универсальная функция для запросов
async function request(url, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    const headers = new Headers(options.headers || {});

    // Если это POST/PATCH/DELETE и это НЕ студенты, добавляем CSRF
    const isReadOnly = ["GET", "HEAD", "OPTIONS"].includes(method);
    if (!isReadOnly && !url.startsWith("/api/students")) {
        const csrfToken = await fetchCsrfToken();
        headers.set("X-XSRF-TOKEN", csrfToken);
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        method,
        headers,
        credentials: "include" // Для refresh-cookie
    });

    // Обработка ошибок сервера
    if (!response.ok) {
        let errorData = {};
        try {
            errorData = await response.json();
        } catch {
            // Если сервер вернул не JSON
        }
        
        // Бэкенд возвращает { message: "..." } или { поле: "ошибка" }
        let message = `Ошибка ${response.status}`;
        if (errorData.message) {
            message = errorData.message;
        } else if (Object.keys(errorData).length > 0) {
            message = Object.values(errorData).join(", ");
        }
        
        throw new Error(message);
    }

    if (response.status === 204) return null; // Нет контента
    return response.json();
}

// 3. Функция входа в систему
export async function loginUser(email, password) {
    const data = await request("/api/auth/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    // Сохраняем токен и данные пользователя в память браузера (localStorage)
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data.user;
}