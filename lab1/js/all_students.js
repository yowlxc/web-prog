const studentsTable = document.querySelector("#list-students tbody");
const students = getStudents();

students.forEach(function(student) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.isu}</td>
        <td>${student.fio}</td>
        <td>${student.group}</td>
        <td>
            <button>Подробнее</button>
            <button>Редактировать</button>
            <button>Удалить</button>
        </td>
    `;
    studentsTable.appendChild(row);
})