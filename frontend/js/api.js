async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error("Ошибка сервера");
    }

    if (response.status === 204) {
        return null;
    }
    return response.json();
}

async function getStudents(params = {}) {
    const query = new URLSearchParams(params);
    return request(`/api/requests?${query}`);
}

async function addStudent(student) {
    return request('/api/requests', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });
}

async function updateStudent(oldIsu, updatedStudent) {
    return request(`/api/requests/${oldIsu}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedStudent)
    });
}

async function deleteStudent(isu) {
    return request(`/api/requests/${isu}`, {
        method: "DELETE",
    });
}

async function queryStudents(params = {}) {
    return request("/api/requests", {
        method: "QUERY",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    });
}