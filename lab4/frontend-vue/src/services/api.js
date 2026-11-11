const API_BASE_URL = ""; 

async function fetchCsrfToken() {
    const response = await fetch(`${API_BASE_URL}/api/auth/csrf`, {
        credentials: "include"
    });
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

    if (!headers.has("Content-Type") && !isReadOnly) {
        headers.set("Content-Type", "application/json");
    }

    // Пытаемся сделать запрос (если сервер упал - это поймает catch)
    let response;
    try {
        response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            method,
            headers,
            credentials: "include"
        });
    } catch (networkError) {
        console.error("Сетевая ошибка:", networkError);
        throw new Error("Не удалось связаться с сервером. Проверьте, запущен ли бэкенд.");
    }

    // Если сервер ответил ошибкой (400, 401, 422, 500)
    if (!response.ok) {
        let errorData = {};
        try {
            errorData = await response.json();
        } catch {
            // Если сервер вернул не JSON
        }
        
        let message = `Ошибка ${response.status}`;
        if (errorData.message) {
            message = errorData.message;
        } else if (Object.keys(errorData).length > 0) {
            message = Object.values(errorData).join(", ");
        }
        
        // Выбрасываем ошибку с текстом от сервера
        throw new Error(message);
    }

    if (response.status === 204) return null;
    return response.json();
}

export async function loginUser(email, password) {
    const data = await request("/api/auth/email", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data.user;
}

export async function registerUser(name, email, password) {
    return request("/api/users", {
        method: "POST",
        body: JSON.stringify({ name, email, password })
    });
}

export async function logoutUser() {
    try {
        // Говорим бэку убить refresh-cookie
        await request("/api/auth/logout", { method: "POST" });
    } catch (e) {
        console.warn("Сервер не ответил при выходе, но мы всё равно выйдем локально", e);
    } finally {
        // В любом случае чистим localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
    }
}

// Получить список студентов с учетом фильтров, пагинации и сортировки
export async function getStudents(params = {}) {
    const queryParams = {
        page: 0,
        size: 8, // Как в твоем старом коде
        sortBy: 'isu',
        sortDir: 'asc',
        ...params // Сюда развернутся переданные фильтры (fio, group и т.д.)
    }

    const cleanParams = {}
    for (const key in queryParams) {
        const val = queryParams[key]
        if (val !== '' && val !== null && val !== undefined) {
            cleanParams[key] = val
        }
    }

    // 3. Формируем URL-строку: ?page=0&size=8&fio=Иван
    const urlParams = new URLSearchParams(cleanParams).toString()
    
    // 4. Отправляем запрос (GET, CSRF не нужен)
    return request(`/api/students?${urlParams}`)
}