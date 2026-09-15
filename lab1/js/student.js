const dosieSection = document.querySelector("#dosie-students");
const dosie = document.querySelector("#dosie");
const studentsList = document.querySelector("#list-students");
const backButton = document.querySelector("#btn-back");
const detailsButtons = document.querySelectorAll(".btn-details");

const studsTable = document.querySelector("#list-students tbody");

studsTable.addEventListener("click", function(event) {
    if (event.target.classList.contains("btn-details")) {
        const studentId = event.target.dataset.id;
        const students = getStudents();
        const student = students.find(function(student) {
            return student.isu == studentId;
        });
        if (!student) {
            return;
        }
        dosie.innerHTML = `
            <p><strong>ФИО:</strong> ${student.fio}</p>
            <p><strong>Группа:</strong> ${student.group}</p>
            <p><strong>ИСУ:</strong> ${student.isu}</p>
            <p><strong>Общежитие:</strong> ${student.dormNumber}</p>
            <p><strong>Комната:</strong> ${student.roomNumber}</p>
            <p><strong>Дата заселения:</strong> ${student.dateInDorm}</p>
            <p><strong>Иностранец:</strong> ${student.isForeign ? "Да" : "Нет"}</p>
            <p><strong>Примечания:</strong> ${student.notes}</p>
        `;
        studentsList.classList.add("hidden");
        dosieSection.classList.remove("hidden");
    }
    if (event.target.classList.contains("btn-delete")) {

        const studentIsu = event.target.dataset.id;
        const students = getStudents();
        const confirmed = confirm("Удалить этого студента?");
        if (confirmed) {
            deleteStudent(studentIsu);
            renderStudents();
        }
    }

    if (event.target.classList.contains("btn-edit")) {

        const studentIsu = event.target.dataset.id;
        const students = getStudents();
        const student = students.find(function(student) {
            return student.isu === studentIsu;
        });

        if (!student) return;

        editingIsu = student.isu;

        document.getElementById("fio").value = student.fio;
        document.getElementById("group").value = student.group;
        document.getElementById("isu").value = student.isu;
        document.getElementById("num-dorm").value = student.dormNumber;
        document.getElementById("num-room").value = student.roomNumber;
        document.getElementById("date-in-dorm").value = student.dateInDorm;
        document.getElementById("no-rus").checked = student.isForeign;
        document.getElementById("notes").value = student.notes;

        studentsList.classList.add("hidden");
        document.querySelector("#form-students").classList.remove("hidden");
    }
    backButton.addEventListener("click", function() {
        dosieSection.classList.add("hidden");
        studentsList.classList.remove("hidden");
    });
});