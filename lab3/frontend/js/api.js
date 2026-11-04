const API_BASE_URL = "http://127.0.0.1:8080";

window.authState = {
    accessToken: null,
    user: null
};

function setAuthSession(data) {
    window.authState.accessToken = data.accessToken;
    window.authState.user = data.user;
}

function clearAuthSession() {
    window.authState.accessToken = null;
    window.authState.user = null;
}

async function fetchCsrfToken() {
    const response = await fetch(`${API_BASE_URL}/api/auth/csrf`, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error(`Не удалось получить CSRF-токен: ${response.status}`);
    }

    const data = await response.json();
    return data.csrfToken;
}

async function request(url, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    const headers = new Headers(options.headers || {});

    // Не отправляем старый access-токен на публичные маршруты авторизации
    // и при регистрации нового пользователя.
    const isPublicRequest =
        url.startsWith("/api/auth/") ||
        (url === "/api/users" && method === "POST");

    if (window.authState.accessToken && !isPublicRequest) {
        headers.set(
            "Authorization",
            `Bearer ${window.authState.accessToken}`
        );
    }

    // CSRF проверяется для изменяющих запросов,
    // кроме API студентов, где защита отключена в SecurityConfig.
    const isReadOnly = ["GET", "HEAD", "OPTIONS"].includes(method);

    if (!isReadOnly && !url.startsWith("/api/students")) {
        const csrfToken = await fetchCsrfToken();
        headers.set("X-XSRF-TOKEN", csrfToken);
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        method,
        headers,
        credentials: "include"
    });

    if (!response.ok) {
        let errorData = {};

        try {
            errorData = await response.json();
        } catch {
            // Сервер мог вернуть ответ не в формате JSON.
        }

        const details =
            errorData.message ??
            errorData.error?.message ??
            errorData.detail;

        let message = `Ошибка запроса: ${response.status}`;

        if (typeof details === "string") {
            message = details;
        } else if (details && typeof details === "object") {
            message = Object.values(details).join("\n");
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return response.json();
    }

    return null;
}

// ---------- Регистрация и авторизация ----------

async function registerUser(name, login, password) {
    return request("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, login, password })
    });
}

async function loginUser(login, password) {
    const data = await request("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ login, password })
    });

    setAuthSession(data);
    return data.user;
}

async function refreshAccessToken() {
    const data = await request("/api/auth/refresh", {
        method: "POST"
    });

    setAuthSession(data);
    return data.user;
}

async function restoreSession() {
    try {
        return await refreshAccessToken();
    } catch {
        clearAuthSession();
        return null;
    }
}

async function logoutUser() {
    try {
        await request("/api/auth/logout", {
            method: "POST"
        });
    } finally {
        clearAuthSession();
    }
}

// Получить студентов с фильтрами

async function getStudents(params = {}) {
    const filterKeys = [
        "fio",
        "group",
        "isu",
        "dormNumber",
        "isForeign",
        "roomMin",
        "roomMax"
    ];

    // Получаем только заполненные фильтры.
    const filters = Object.fromEntries(
        filterKeys
            .filter(key =>
                params[key] !== undefined &&
                params[key] !== null &&
                params[key] !== ""
            )
            .map(key => [key, params[key]])
    );

    const filterCount = Object.keys(filters).length;

    // Параметры пагинации и сортировки.
    const query = new URLSearchParams({
        page: params.page ?? 0,
        size: params.size ?? 8,
        sortBy: params.sortBy ?? "isu",
        sortDir: params.sortDir ?? "asc"
    });

    // Более двух фильтров — POST /query.
    if (filterCount > 2) {
        return request(`/api/students/query?${query}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(filters)
        });
    }

    // Два фильтра или меньше — GET.
    const getParams = new URLSearchParams({
        ...filters,
        page: params.page ?? 0,
        size: params.size ?? 8,
        sortBy: params.sortBy ?? "isu",
        sortDir: params.sortDir ?? "asc"
    });

    return request(`/api/students?${getParams}`);
}

async function addStudent(student) {
    return request("/api/students", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });
}

async function updateStudent(isu, student) {
    return request(`/api/students/${encodeURIComponent(isu)}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });
}

async function deleteStudent(isu) {
    return request(`/api/students/${encodeURIComponent(isu)}`, {
        method: "DELETE"
    });
}
