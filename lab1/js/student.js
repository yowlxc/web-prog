const dosieSection = document.querySelector("#dosie-students");
const dosie = document.querySelector("#dosie");
const studentsList = document.querySelector("#list-students");
const backButton = document.querySelector("#btn-back");

const detailsButtons = document.querySelectorAll(".btn-details");

detailsButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const studentId = button.dataset.id;
        const students = getStudents();
        const student = students.find(function(student) {
            return student.id == studentId;
        });
        dosie.innerHTML = `
            <p><strong>ФИО:</strong> ${student.fio}</p>
            <p><strong>Группа:</strong> ${student.group}</p>
            <p><strong>ИСУ:</strong> ${student.isu}</p>
            <p><strong>Общежитие:</strong> ${student.dorm}</p>
            <p><strong>Комната:</strong> ${student.room}</p>
            <p><strong>Дата заселения:</strong> ${student.dateInDorm}</p>
            <p><strong>Иностранец:</strong> ${student.foreigner ? "Да" : "Нет"}</p>
            <p><strong>Примечания:</strong> ${student.notes}</p>
        `;
    });

    backButton.addEventListener("click", function() {
        dosieSection.classList.add("hidden");
        studentsList.classList.remove("hidden");
    });
});