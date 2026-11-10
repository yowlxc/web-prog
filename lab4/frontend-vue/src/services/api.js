const API_BASE_URL = "http://localhost:8080";

async function fetchCsrfToken() {
    console.log("--> Запрос CSRF...");
    const response = await fetch(`${API_BASE_URL}/api/auth/csrf`, {
        credentials: "include"
    });
    console.log("<-- Ответ CSRF:", response.status);
    if (!response.ok) throw new Error("Не удалось получить CSRF-токен");
    const data = await response.json();
    return data.csrfToken;
}

async function request(url, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    const headers = new Headers(options.headers || {});

    const isReadOnly = ["GET", "HEAD", "OPTIONS"].includes(method);
    if (!isReadOnly && !url.startsWith("/api/students")) {
        const csrfToken = await fetchCsrfToken();
        headers.set("X-XSRF-TOKEN", csrfToken);
    }

    console.log(`--> Запрос ${method} ${url}`);
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            method,
            headers,
            credentials: "include"
        });
        console.log(`<-- Ответ ${url}:`, response.status);

        if (!response.ok) {
            let errorData = {};
            try { errorData = await response.json(); } catch {}
            
            let message = `Ошибка ${response.status}`;
            if (errorData.message) message = errorData.message;
            else if (Object.keys(errorData).length > 0) message = Object.values(errorData).join(", ");
            
            throw new Error(message);
        }

        if (response.status === 204) return null;
        return response.json();

    } catch (error) {
        console.error("!!! СЕТЕВАЯ ОШИБКА !!!", error);
        throw new Error("Не удалось связаться с сервером. Проверьте, запущен ли бэкенд.");
    }
}

export async function loginUser(email, password) {
    console.log("loginUser: начинаем...");
    const data = await request("/api/auth/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data.user;
}

export async function registerUser(name, email, password) {
    return request("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });
}