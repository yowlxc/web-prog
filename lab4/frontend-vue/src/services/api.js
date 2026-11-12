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
    
    // Берем токен из Pinia, если он есть (и это не запрос на логин)
    const authStore = useAuthStore()
    if (!url.startsWith('/api/auth/') && authStore.accessToken) {
        headers.set('Authorization', `Bearer ${authStore.accessToken}`)
    }

    const isReadOnly = ["GET", "HEAD", "OPTIONS"].includes(method);
    
    // CSRF нужен для POST/PATCH/DELETE, КРОМЕ /api/students
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

    // Обработка 401 (обновление токена)
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

    // Обработка остальных ошибок
    if (!response.ok) {
        let errorData = {};
        try {
            errorData = await response.json();
        } catch {}
        
        let message = `Ошибка ${response.status}`;
        if (errorData.message) message = errorData.message;
        else if (Object.keys(errorData).length > 0) message = Object.values(errorData).join(", ");
        
        throw new Error(message);
    }
    
    if (response.status === 204) return null;
    return response.json();
}

export async function loginUser(email, password) {
    return request("/api/auth/email", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
}

export async function registerUser(name, email, password) {
    return request("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });
}

export async function logoutUser() {
    try {
        await request("/api/auth/logout", { method: "POST" });
    } catch (e) {
        console.warn("Сервер не ответил при выходе", e);
    }
}

export async function refreshToken() {
    return request("/api/auth/refresh", { method: "POST" });
}

// --- CRUD (из кода напарника) ---
export async function getStudents(params = {}, signal) {
    const filterKeys = ["fio", "group", "isu", "dormNumber", "isForeign", "roomMin", "roomMax", "dateFrom", "dateTo"];
    const filters = Object.fromEntries(
        filterKeys.filter(key => params[key] !== undefined && params[key] !== null && params[key] !== "").map(key => [key, params[key]])
    );
    const filterCount = Object.keys(filters).length;
    const queryParams = { page: params.page ?? 0, size: params.size ?? 8, sortBy: params.sortBy ?? "isu", sortDir: params.sortDir ?? "asc" };

    if (filterCount > 2) {
        const query = new URLSearchParams(queryParams).toString();
        return request(`/api/students/query?${query}`, { method: "POST", body: JSON.stringify(filters), signal });
    }

    const getParams = new URLSearchParams({ ...filters, ...queryParams });
    return request(`/api/students?${getParams}`, { signal });
}

export function getStudent(isu) { return request(`/api/students/${isu}`) }
export function createStudent(student) { return request('/api/students', { method: 'POST', body: JSON.stringify(student) }) }
export function updateStudent(isu, student) { return request(`/api/students/${isu}`, { method: 'PATCH', body: JSON.stringify(student) }) }
export function deleteStudent(isu) { return request(`/api/students/${isu}`, { method: 'DELETE' }) }