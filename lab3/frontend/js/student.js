
const dosieSection = document.querySelector("#dosie-students");
const dosie = document.querySelector("#dosie");
const backButton = document.querySelector("#btn-back");
const studentsList = document.querySelector("#list-students");

const studsTable = document.querySelector("#list-students tbody");

studsTable.addEventListener("click", async function(event) {
    const button = event.target.closest("button");

    if (!button) return;

    const studentIsu = button.dataset.id;

    if (button.classList.contains("btn-details")) {
        try {
            const student = await getStudent(studentIsu);

            if (!student) {
                alert("Студент не найден");
                return;
            }

            dosie.innerHTML = `
                <p><strong>ФИО:</strong> ${student.fio ?? ""}</p>
                <p><strong>Группа:</strong> ${student.group ?? ""}</p>
                <p><strong>ИСУ:</strong> ${student.isu ?? ""}</p>
                <p><strong>Общежитие:</strong> ${student.dormNumber ?? ""}</p>
                <p><strong>Комната:</strong> ${student.roomNumber ?? ""}</p>
                <p><strong>Дата заселения:</strong> ${
                    student.dateInDorm
                        ? student.dateInDorm.split("-").reverse().join(".")
                        : ""
                }</p>
                <p><strong>Иностранец:</strong> ${student.isForeign ? "Да" : "Нет"}</p>
                <p><strong>Примечания:</strong> ${student.notes ?? ""}</p>
            `;

            studentsList.classList.add("hidden");
            dosieSection.classList.remove("hidden");

        } catch (error) {
            alert("Не удалось загрузить досье: " + error.message);
            console.error(error);
        }
    }

    if (button.classList.contains("btn-edit")) {
        try {
            const student = await getStudent(studentIsu);

            if (!student) {
                alert("Студент не найден");
                return;
            }

            const formStudents = document.querySelector("#form-students");
            const h2 = formStudents.querySelector("h2");

            h2.textContent = "Форма редактирования студента";
            editingIsu = student.isu;

            document.getElementById("fio").value = student.fio ?? "";
            document.getElementById("group").value = student.group ?? "";
            document.getElementById("isu").value = student.isu ?? "";
            document.getElementById("isu").readOnly = false;
            document.getElementById("num-dorm").value = student.dormNumber ?? "";
            document.getElementById("num-room").value = student.roomNumber ?? "";
            document.getElementById("date-in-dorm").value = student.dateInDorm ?? "";
            document.getElementById("no-rus").checked = student.isForeign ?? false;
            document.getElementById("notes").value = student.notes ?? "";

            studentsList.classList.add("hidden");
            formStudents.classList.remove("hidden");

        } catch (error) {
            alert("Не удалось загрузить студента: " + error.message);
            console.error(error);
        }
    }

    if (button.classList.contains("btn-delete")) {
        const confirmed = confirm("Удалить этого студента?");

        if (confirmed) {
            try {
                await deleteStudent(studentIsu);
                await renderStudents();
            } catch (error) {
                alert("Не удалось удалить студента: " + error.message);
                console.error(error);
            }
        }
    }
});

backButton.addEventListener("click", function() {
    dosieSection.classList.add("hidden");
    studentsList.classList.remove("hidden");
});
