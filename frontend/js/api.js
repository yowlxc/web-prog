async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error("Ошибка сервера");
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