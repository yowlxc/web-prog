const studentsTable = document.querySelector("#list-students tbody");

function renderStudents() {

    const students = getStudents();

    studentsTable.innerHTML = "";
    students.forEach(function(student) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.isu}</td>
            <td>${student.fio}</td>
            <td>${student.group}</td>
            <td class="actions-col">
                <div class="btn-group">
                    <button class="btn-details" data-id="${student.isu}">
                        Подробнее
                    </button>

                    <button class="btn-edit" data-id="${student.isu}">
                        Редактировать
                    </button>

                    <button class="btn-delete" data-id="${student.isu}">
                        Удалить
                    </button>
            </td>
        `;
    studentsTable.appendChild(row);
    })
}