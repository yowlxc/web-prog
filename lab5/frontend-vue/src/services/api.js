const API_BASE_URL = "";
import { useAuthStore } from '@/stores/auth'

async function request(url, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    const headers = new Headers(options.headers || {});
    
    const authStore = useAuthStore()
    if (!url.startsWith('/api/auth/') && authStore.accessToken) {
        headers.set('Authorization', `Bearer ${authStore.accessToken}`)
    }

    if (!headers.has("Content-Type") && ["POST", "PATCH", "PUT"].includes(method)) {
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
        throw new Error("Не удалось связаться с сервером.");
    }

    if (response.status === 401 && !url.startsWith('/api/auth/')) {
        try {
            const data = await refreshToken()
            authStore.accessToken = data.accessToken
            authStore.user = data.user
            return request(url, options)
        } catch {
            authStore.accessToken = null
            authStore.user = null
        }
    }

    if (!response.ok) {
        let errorData = {};
        try {
            errorData = await response.json();
        } catch {}
        
        let message = `Ошибка ${response.status}`;
        if (errorData.message) {
            message = errorData.message;
        } else if (Object.keys(errorData).length > 0) {
            message = Object.values(errorData).join(", ");
        }
        
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

export async function getStudents(params = {}, token = null) {
    const filterKeys = ["fio", "group", "isu", "dormNumber", "isForeign", "roomMin", "roomMax", "dateFrom", "dateTo"];
    const filters = Object.fromEntries(
        filterKeys.filter(key => params[key] !== undefined && params[key] !== null && params[key] !== "").map(key => [key, params[key]])
    );
    const filterCount = Object.keys(filters).length;
    const queryParams = { page: params.page ?? 0, size: params.size ?? 1000, sortBy: params.sortBy ?? "isu", sortDir: params.sortDir ?? "asc" };

    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    if (filterCount > 2) {
        const query = new URLSearchParams(queryParams).toString();
        return request(`/api/students/query?${query}`, { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(filters) });
    }

    const getParams = new URLSearchParams({ ...filters, ...queryParams });
    return request(`/api/students?${getParams}`, { headers });
}

export function getStudent(isu) { return request(`/api/students/${isu}`) }
export function createStudent(student) { return request('/api/students', { method: 'POST', body: JSON.stringify(student) }) }
export function updateStudent(isu, student) { return request(`/api/students/${isu}`, { method: 'PATCH', body: JSON.stringify(student) }) }
export function deleteStudent(isu) { return request(`/api/students/${isu}`, { method: 'DELETE' }) }