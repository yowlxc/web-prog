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

function updateStudent(updatedStudent) {
    const students = getStudents();

    const index = students.findIndex(function(student) {
        return student.isu === updatedStudent.isu;
    });

    if (index !== -1) {
        students[index] = updatedStudent;
    }

    saveStudents(students);
}

function deleteStudent(isu) {
    const students = getStudents();

    const filteredStudents = students.filter(function(student) {
        return student.isu !== isu;
    });

    saveStudents(filteredStudents);
}