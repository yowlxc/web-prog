const API_BASE_URL = "http://127.0.0.1:8080";

async function request(url, options = {}) {
    const response = await fetch(API_BASE_URL + url, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
    }

    if (response.status === 204) {
        return null;
    }
    return response.json();
}

async function getStudents(params = {}) {
    const query = new URLSearchParams(params);
    return request(`/api/students?${query}`);
}

async function addStudent(student) {
    return request('/api/students', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });
}

async function updateStudent(oldIsu, updatedStudent) {
    return request(`/api/students/${oldIsu}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedStudent)
    });
}

async function deleteStudent(isu) {
    return request(`/api/students/${isu}`, {
        method: "DELETE",
    });
}

async function queryStudents(params = {}) {
    const query = new URLSearchParams(params);
    return request(`/api/students?${query}`);
}