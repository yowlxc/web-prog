const API_BASE_URL = "http://" + window.location.hostname + ":8080";
let accessToken = null;
let currentUser = null;
let csrfToken = null;

async function loadCsrf() {
    const response = await fetch(API_BASE_URL + "/api/auth/csrf", {
        credentials: "include"
    });
    if (!response.ok) throw new Error("Не удалось получить CSRF-токен");
    csrfToken = (await response.json()).csrfToken;
}

async function request(url, options = {}, retry = true) {
    const method = options.method || "GET";
    if (method !== "GET" && csrfToken === null) await loadCsrf();

    const headers = { ...(options.headers || {}) };
    if (accessToken && !url.startsWith("/api/auth/")) {
        headers.Authorization = "Bearer " + accessToken;
    }
    if (method !== "GET") headers["X-XSRF-TOKEN"] = csrfToken;

    const response = await fetch(API_BASE_URL + url, {
        ...options,
        credentials: "include",
        headers
    });

    if (response.status === 401 && retry && accessToken && !url.startsWith("/api/auth/")) {
        await refreshAuth();
        return request(url, options, false);
    }
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Ошибка запроса: " + response.status);
    }
    if (response.status === 204) return null;
    return response.json();
}

async function registerUser(name, login, password) {
    return request("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, login, password })
    });
}

async function loginUser(login, password) {
    const data = await request("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password })
    });
    accessToken = data.accessToken;
    currentUser = data.user;
    return data.user;
}

async function refreshAuth() {
    const data = await request("/api/auth/refresh", { method: "POST" }, false);
    accessToken = data.accessToken;
    currentUser = data.user;
    return data.user;
}

async function logoutUser() {
    await request("/api/auth/logout", { method: "POST" });
    accessToken = null;
    currentUser = null;
}

async function getStudents(params = {}) {
    const query = new URLSearchParams(params);
    return request(`/api/students?${query}`);
}

async function getStudent(isu) {
    return request(`/api/students/${isu}`);
}

async function addStudent(student) {
    return request("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
    });
}

async function updateStudent(oldIsu, updatedStudent) {
    return request(`/api/students/${oldIsu}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent)
    });
}

async function deleteStudent(isu) {
    return request(`/api/students/${isu}`, { method: "DELETE" });
}
