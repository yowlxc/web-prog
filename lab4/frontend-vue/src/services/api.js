import { useAuthStore } from '@/stores/auth'

const API_BASE_URL = "";

async function fetchCsrfToken() {
    const response = await fetch(`${API_BASE_URL}/api/auth/csrf`, {
        credentials: "include"
    });
    if (!response.ok) throw new Error("Не удалось получить CSRF-токен");
    const data = await response.json();
    return data.csrfToken;
}

async function request(url, options = {}, canRefresh = true) {
    const method = (options.method || "GET").toUpperCase();
    const headers = new Headers(options.headers || {});
    const authStore = useAuthStore()
    if (!url.startsWith('/api/auth/') && authStore.accessToken) {
        headers.set('Authorization', `Bearer ${authStore.accessToken}`)
    }

    const isReadOnly = ["GET", "HEAD", "OPTIONS"].includes(method);
    if (!isReadOnly && !url.startsWith("/api/students")) {
        const csrfToken = await fetchCsrfToken();
        headers.set("X-XSRF-TOKEN", csrfToken);
    }

    if (!headers.has("Content-Type") && !isReadOnly) {
        headers.set("Content-Type", "application/json");
    }

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

    if (response.status === 401 && canRefresh && !url.startsWith('/api/auth/')) {
        try {
            const data = await refreshToken()
            authStore.accessToken = data.accessToken
            authStore.user = data.user
            return request(url, options, false)
        } catch {
            authStore.accessToken = null
            authStore.user = null
        }
    }

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
    return data;
}

export async function registerUser(name, email, password) {
    return request("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
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

export async function refreshToken() {
    // Запрос отправляет refresh-cookie (credentials: "include" уже в request)
    return request("/api/auth/refresh", { method: "POST" });
}

// Получить список студентов с учетом фильтров, пагинации и сортировки
export async function getStudents(params = {}) {
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
                params[key] !== "" &&
                !(key === 'isForeign' && params[key] === false)
            )
            .map(key => [key, params[key]])
    );

    const filterCount = Object.keys(filters).length;

    // Параметры пагинации и сортировки.
    const queryParams = {
        page: params.page ?? 0,
        size: params.size ?? 8,
        sortBy: params.sortBy ?? "isu",
        sortDir: params.sortDir ?? "asc"
    };

    // Более двух фильтров — POST /query.
    if (filterCount > 2) {
        const query = new URLSearchParams(queryParams).toString();
        return request(`/api/students/query?${query}`, {
            method: "POST",
            body: JSON.stringify(filters)
        });
    }

    // Два фильтра или меньше — GET.
    const getParams = new URLSearchParams({ ...filters, ...queryParams });
    
    return request(`/api/students?${getParams}`);
}

export function getStudent(isu) {
    return request(`/api/students/${isu}`)
}

export function createStudent(student) {
    return request('/api/students', {
        method: 'POST',
        body: JSON.stringify(student)
    })
}

export function updateStudent(isu, student) {
    return request(`/api/students/${isu}`, {
        method: 'PATCH',
        body: JSON.stringify(student)
    })
}

export function deleteStudent(isu) {
    return request(`/api/students/${isu}`, { method: 'DELETE' })
}
