const STORAGE_KEY = "students";

function getStudents() {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return [];
    }

    return JSON.parse(data);
}

function saveStudents(students) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(students)
    );
}

function addStudent(student) {
    const students = getStudents();

    students.push(student);

    saveStudents(students);
}

function updateStudent(oldIsu, updatedStudent) {
    const students = getStudents();

    // Проверяем, есть ли другой студент с новым ИСУ
    const exists = students.some(student =>
        student.isu === updatedStudent.isu &&
        student.isu !== oldIsu
    );

    if (exists) {
        isuError.textContent = "Студент с таким ИСУ уже существует";
        return;
    }

    const index = students.findIndex(student =>
        student.isu === oldIsu
    );

    if (index === -1) {
        return;
    }

    students[index] = updatedStudent;

    localStorage.setItem("students", JSON.stringify(students));
}

function deleteStudent(isu) {
    const students = getStudents();

    const filteredStudents = students.filter(function(student) {
        return student.isu !== isu;
    });

    saveStudents(filteredStudents);
}