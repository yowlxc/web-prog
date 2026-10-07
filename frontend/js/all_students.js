const studentsTable = document.querySelector(".students-table tbody");

async function renderStudents(params = {}) {

    if (Object.keys(params).length <= 2) {
        students = await getStudents(params); // GET
    } else {
        students = await queryStudents(params); // QUERY
    }

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
                </div>
            </td>
        `;
    studentsTable.appendChild(row);
    })
}