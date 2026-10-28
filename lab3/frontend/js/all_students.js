
const studentsTable = document.querySelector(".students-table tbody");

async function renderStudents(params = {}) {
    const students = await getStudents(params);

    if (!Array.isArray(students)) {
        throw new Error("Сервер вернул список студентов в неожиданном формате.");
    }

    studentsTable.replaceChildren();

    if (students.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 4;
        cell.textContent = "Студенты не найдены.";
        row.appendChild(cell);
        studentsTable.appendChild(row);
        return;
    }

    const isAdmin = window.authState?.user?.role === "ADMIN";

    students.forEach(function (student) {
        const row = document.createElement("tr");

        const isuCell = document.createElement("td");
        isuCell.classList.add("isu_tbl");
        isuCell.textContent = student.isu ?? "";
        row.appendChild(isuCell);

        const fioCell = document.createElement("td");
        fioCell.classList.add("fio_tbl");
        fioCell.textContent = student.fio ?? "";
        row.appendChild(fioCell);

        const groupCell = document.createElement("td");
        groupCell.textContent = student.group ?? "";
        row.appendChild(groupCell);

        const actionsCell = document.createElement("td");
        actionsCell.classList.add("actions-col");

        const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("btn-group");

        const detailsButton = document.createElement("button");
        detailsButton.type = "button";
        detailsButton.classList.add("btn-details");
        detailsButton.dataset.id = student.isu;
        detailsButton.textContent = "Подробнее";
        buttonGroup.appendChild(detailsButton);

        if (isAdmin) {
            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.classList.add("btn-edit");
            editButton.dataset.id = student.isu;
            editButton.textContent = "Редактировать";
            buttonGroup.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.classList.add("btn-delete");
            deleteButton.dataset.id = student.isu;
            deleteButton.textContent = "Удалить";
            buttonGroup.appendChild(deleteButton);
        }

        actionsCell.appendChild(buttonGroup);
        row.appendChild(actionsCell);
        studentsTable.appendChild(row);
    });
}
